// 路由守卫
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isHttp, isPathMatch } from '@/utils/validators'
import { type Router } from 'vue-router'
import { showMsgError, showMsgWarning, showNotifyError } from '@/utils/modal'
import { isReLogin } from '@/composables/useHttp'
import i18n from '@/locales/i18n'

/**
 * 路由守卫配置
 *
 * 包含以下功能：
 * - 路由拦截: 基于用户登录状态和权限控制路由访问
 * - 进度条控制: 页面加载时显示进度条提升用户体验
 * - 白名单管理: 维护无需登录即可访问的页面列表
 * - 用户验证: 自动获取用户信息和角色权限
 * - 动态路由: 根据用户权限动态生成可访问路由
 * - 页面标题: 自动设置浏览器标签页标题
 * - 路由重定向: 处理未授权访问和登录后跳转
 */

// 进度条配置
NProgress.configure({ showSpinner: false })

// 白名单列表 - 不需要登录就可以访问的页面
const WHITE_LIST = ['/login', '/register', '/forgotPassword', '/socialCallback', '/register*', '/register/*', '/401', '/home']

/**
 * 强制改密时仍允许访问的路由（等保二级 8.1.4.1 a）
 *
 * 必须放行个人中心 —— 改密表单就在那个页面里，全拦死会让用户无路可走。
 * 401/403 页面也要放行，否则出错时会陷入「跳改密页 → 无权限 → 跳改密页」的死循环。
 */
const FORCE_CHANGE_PWD_ALLOW_LIST = ['/user/profile', '/401', '/403', '/404']

// 强制改密时的目标页面
const CHANGE_PWD_PATH = '/user/profile'

// 路由守卫内部状态 - 防止重复获取用户信息
let isFetchingUserInfo = false

// 是否在白名单中的辅助函数
const isInWhiteList = (path: string) => {
  return WHITE_LIST.some((pattern) => isPathMatch(pattern, path))
}

/**
 * 判断是否需要拦截到改密页
 *
 * @param mustChangePwd 是否处于「必须改密」状态
 * @param path 目标路由路径
 * @returns true 表示应当拦截
 */
const needForceChangePwd = (mustChangePwd: boolean, path: string): boolean => {
  if (!mustChangePwd) {
    return false
  }
  return !FORCE_CHANGE_PWD_ALLOW_LIST.some((allowed) => isPathMatch(allowed, path))
}

/**
 * 初始化路由守卫
 * 在主路由文件中调用此函数来设置路由守卫
 * @param router 路由实例
 */
export const setupRouteGuards = (router: Router): void => {
  // 路由前置守卫
  router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 一次性获取所有需要的 store 实例
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 获取权限钩子和标题钩子
    const { canAccessRoute, isLoggedIn } = useAuth()

    // 没有token的情况
    if (!isLoggedIn.value) {
      // 重置状态
      isFetchingUserInfo = false

      // 白名单直接通过
      if (isInWhiteList(to.path)) {
        return next()
      }
      // 非白名单重定向到登录页，并携带重定向参数
      const redirect = encodeURIComponent(to.fullPath || '/')
      return next(`/login?redirect=${redirect}`)
    }

    // 有token的情况
    // 已登录用户访问登录页，重定向到首页
    if (to.path === '/login') {
      return next({ path: '/' })
    }

    // 白名单页面直接通过
    if (isInWhiteList(to.path)) {
      return next()
    }

    // 非白名单页面需要检查权限
    // 已加载用户信息，检查路由访问权限
    if (userStore.roles.length > 0) {
      // 等保二级 8.1.4.1 a：必须改密时，除个人中心外一律拦回改密页
      if (needForceChangePwd(userStore.mustChangePwd, to.path)) {
        showMsgWarning(userStore.passwordStatus?.pwdExpired ? '密码已过期，请先修改密码' : '首次登录请先修改初始密码')
        return next(CHANGE_PWD_PATH)
      }
      // 使用新的权限钩子检查路由访问权限
      if (canAccessRoute(to)) {
        return next()
      } else {
        return next('/403') // 无权限访问，重定向到403页面
      }
    }

    // 防止重复获取用户信息
    if (isFetchingUserInfo) {
      // 直接返回，不做任何操作，等待当前获取完成
      return next()
    }
    // 未加载用户信息，需要获取
    isFetchingUserInfo = true
    // 标记为正在获取用户信息，此时的401请求不弹框
    isReLogin.show = true

    // 使用 await-to-js 处理异步操作，优雅地捕获错误
    const [fetchUserErr] = await userStore.fetchUserInfo()
    if (fetchUserErr) {
      // 获取用户信息失败，重置标记
      isReLogin.show = false

      // 显示错误提示（页面刷新时的轻量级提示）
      showMsgError('登录状态已过期，请重新登录')

      const [logoutErr] = await userStore.logoutUser()
      if (!logoutErr) {
        // 跳转到登录页
        const redirect = encodeURIComponent(to.fullPath || '/')
        return next(`/login?redirect=${redirect}`)
      } else {
        // 处理注销错误
        showNotifyError({
          title: '系统提示',
          message: '后端服务未启动或异常，请检查!',
          duration: 10000
        })
        return next()
      }
    }

    // 获取用户信息成功，重置标记，之后的401请求会弹框
    isReLogin.show = false

    // 生成动态路由
    const [generateRoutesErr, accessRoutes] = await permissionStore.generateRoutes()
    if (generateRoutesErr) {
      showMsgError(generateRoutesErr)
      return next('/403')
    }

    // 添加动态路由
    accessRoutes.forEach((route) => {
      if (!isHttp(route.path)) {
        router.addRoute(route)
      }
    })

    // 等保二级 8.1.4.1 a：首次进入（刚拉到用户信息）时同样要判定强制改密。
    // 这一处不能省 —— 用户登录后的第一跳走的正是这个分支，漏了就等于策略不生效。
    if (needForceChangePwd(userStore.mustChangePwd, to.path)) {
      showMsgWarning(userStore.passwordStatus?.pwdExpired ? '密码已过期，请先修改密码' : '首次登录请先修改初始密码')
      return next(CHANGE_PWD_PATH)
    }

    // 检查目标路由是否有权限访问
    if (!canAccessRoute(to)) {
      return next('/403')
    }

    // 使用与原始代码完全相同的语法，确保类型匹配
    // 移除 name 和 params 参数，避免警告和错误
    // params 在使用 path 时会被忽略，动态路由参数已包含在 path 中
    next({
      path: to.path,
      replace: true,
      query: to.query,
      hash: to.hash
    })
  })

  // 路由后置守卫
  router.afterEach((to) => {
    // 结束进度条
    NProgress.done()

    // 设置页面标题（支持国际化）
    const layout = useLayout()
    if (to.meta.title) {
      // 优先使用 i18nKey 进行翻译，否则直接使用 title
      const i18nKey = to.meta?.i18nKey as string | undefined
      let title: string
      if (i18nKey) {
        const translated = i18n.global.t(i18nKey)
        // 如果翻译结果和 key 相同，说明没找到翻译，使用原始 title 作为兜底
        title = translated === i18nKey ? (to.meta?.title as string) : translated
      } else {
        title = to.meta?.title as string
      }
      layout.setTitle(title)
    }
  })
}
