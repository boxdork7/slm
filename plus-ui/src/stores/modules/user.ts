// 用户状态
import { userLogin, userLogout } from '@/api/system/auth/authApi'
import { getUserInfo } from '@/api/system/core/user/userApi'
import type { PasswordStatusVo, SysUserVo } from '@/api/system/core/user/userTypes'
import type { LoginRequest } from '@/api/system/auth/authTypes'
import defAva from '@/assets/images/profile.jpg'
import { sessionCache } from '@/utils/cache'

/**
 * 用户认证管理 (useUserStore)
 *
 * 基于 Pinia 的用户认证与权限管理模块，提供完整的用户身份验证和授权功能。
 *
 * 包含以下功能：
 * - 用户认证: 提供登录、注销和身份验证功能 (login, logout, getInfo)
 * - 权限管理: 存储和提供用户角色与权限信息 (roles, permissions)
 * - 用户信息: 管理用户基本资料和个人信息 (userInfo)
 * - 身份令牌: 安全存储和管理访问令牌 (token)
 * - 资料更新: 支持更新用户头像等个人信息 (updateAvatar)
 */

/**
 * 用户模块名称
 */
const USER_MODULE = 'user'
const LAST_LOGIN_USER_KEY = 'last-login-user'

/**
 * 用户状态管理
 * @description 管理用户认证、权限和个人信息等状态。
 * 此Store负责用户登录、注销、获取用户信息等操作，
 * 同时维护用户的角色和权限数据，用于权限控制。
 *
 * @example
 * // 在组件中使用
 * import { useUserStore } from '@/stores/modules/user';
 *
 * export default defineComponent({
 *   setup() {
 *     const userStore = useUserStore();
 *
 *     // 获取用户信息
 *     onMounted(async () => {
 *       await userStore.fetchUserInfo();
 *     });
 *
 *     return {
 *       // 获取用户基本信息
 *       nickname: computed(() => userStore.userInfo?.nickName || ''),
 *       avatar: computed(() => userStore.userInfo?.avatar || '')
 *     }
 *   }
 * });
 */
export const useUserStore = defineStore(USER_MODULE, () => {
  // 获取token工具，避免重复创建实例
  const tokenUtils = useToken()

  /**
   * 用户令牌
   * @description 用户登录后的访问令牌，用于API请求认证
   */
  const token = ref(tokenUtils.getToken())

  /**
   * 用户基本信息
   * @description 用户的基本信息（账号、昵称、头像等）
   */
  const userInfo = ref<SysUserVo | null>(null)

  /**
   * 用户角色编码集合
   * @description 用于判断路由权限和功能权限
   */
  const roles = ref<Array<string>>([])

  /**
   * 用户权限编码集合
   * @description 用于判断按钮权限等细粒度权限控制
   */
  const permissions = ref<Array<string>>([])

  /**
   * 字段权限快照：资源标识 → (字段名 → 档位码 0隐藏/1脱敏/2只读)
   * @description 由 fetchUserInfo 从后端带回，只含受限字段，绝大多数用户是空对象。
   * 供表格列 / 详情项 / 表单项判断是否隐藏或禁用。
   *
   * 🔴 仅体验优化，不是安全边界：真正的隔离由后端四个出口保证
   * （JSON 序列化 / Excel 导出 / JSON 写入 / Excel 导入），绕过前端一样改不动、看不到。
   */
  const fieldPermissions = ref<Record<string, Record<string, string>>>({})

  /**
   * 密码状态（等保二级 8.1.4.1 a）
   * @description 由 fetchUserInfo 从后端带回，路由守卫据此决定是否强制跳转改密页。
   * 每次刷新页面都会重新拉取，因此用户改完密码后无需重新登录即可解除拦截。
   */
  const passwordStatus = ref<PasswordStatusVo | null>(null)

  /**
   * 是否必须修改密码
   * @description 两种情形：从未改过密码（新建用户/管理员刚重置），或密码已过期。
   */
  const mustChangePwd = computed(() => passwordStatus.value?.mustChangePwd === true)

  /**
   * 密码到期提醒天数
   * @description 仅在「已进入提醒窗口但尚未过期」时有值，用于顶部柔性提示，不拦截操作。
   */
  const pwdExpireInDays = computed(() => passwordStatus.value?.expireInDays ?? null)

  /**
   * 用户登录
   * @param loginRequest 登录信息，包含用户名和密码
   * @returns Promise 登录成功时resolve，失败时reject错误信息
   * @description 调用登录API，成功后保存token
   * @example
   * // 用户登录
   * const [err, data] = await userStore.loginUser({
   *   userName: 'admin',
   *   password: '123456',
   *   code: '1234',
   *   uuid: 'uuid'
   * })
   */
  const loginUser = async (loginRequest: LoginRequest): Result<void> => {
    const [err, data] = await userLogin(loginRequest)
    if (err) {
      return [err, null]
    }
    // 保存token到localStorage和store，使用已缓存的tokenUtils实例
    tokenUtils.setToken(data.access_token, data.expire_in)
    token.value = data.access_token
    return [null, null]
  }

  /**
   * 获取用户信息
   * @returns Result
   * @description 调用获取用户信息API，获取用户基本信息、角色和权限
   * @example
   * // 在路由守卫中使用
   * router.beforeEach(async (to, from, next) => {
   *   if (userStore.token && !userStore.roles.length) {
   *     await userStore.fetchUserInfo();
   *     next();
   *   }
   * });
   */
  const fetchUserInfo = async (): Result<void> => {
    const [err, data] = await getUserInfo()
    if (err) {
      return [err, null]
    }

    const user = data.user
    const currentUserKey = String(user.userId)
    const lastUserKey = sessionCache.get(LAST_LOGIN_USER_KEY)
    if (lastUserKey && lastUserKey !== currentUserKey) {
      await useLayout().delAllViews()
    }
    sessionCache.set(LAST_LOGIN_USER_KEY, currentUserKey)
    // 处理用户头像
    if (!user.avatar) {
      user.avatar = defAva
    }

    // 设置用户基本信息
    userInfo.value = user

    // 设置角色和权限
    roles.value = data.roles || []
    permissions.value = data.permissions || []

    // 等保二级 8.1.4.1 a：记录密码状态，供路由守卫判断是否强制改密
    passwordStatus.value = data.passwordStatus || null

    // 字段权限快照：供前端隐藏受限列 / 禁用受限表单项
    fieldPermissions.value = data.fieldPermissions || {}

    return [null, null]
  }

  /**
   * 用户注销
   * @returns Result
   * @description 调用注销API，清除用户状态和token
   * @example
   * // 用户注销
   * userStore.logoutUser().then(() => {
   *   // 重定向到登录页
   *   router.push('/login');
   * });
   */
  const logoutUser = async (): Result<void> => {
    // 调用注销API
    const [err] = await userLogout()

    // 清除状态
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    passwordStatus.value = null
    // 必须清：不清的话换账号登录会残留上一个用户的字段配置，造成界面层的串权
    fieldPermissions.value = {}

    // 移除localStorage中的token，使用已缓存的tokenUtils实例
    tokenUtils.removeToken()
    return [err, null]
  }

  /**
   * 清除强制改密标记
   * @description 用户改密成功后调用，立即解除路由守卫的拦截，
   * 不必等下一次 fetchUserInfo 才放行。
   */
  const clearMustChangePwd = (): void => {
    if (passwordStatus.value) {
      passwordStatus.value = {
        ...passwordStatus.value,
        mustChangePwd: false,
        pwdExpired: false,
        expireInDays: undefined
      }
    }
  }

  /**
   * 更新用户头像
   * @param avatarUrl 新头像的URL地址
   * @description 更新用户头像
   * @example
   * // 修改用户头像
   * userStore.updateAvatar('https://example.com/avatar.jpg');
   */
  const updateAvatar = (avatarUrl: string): void => {
    if (userInfo.value) {
      userInfo.value.avatar = avatarUrl
    }
  }

  /**
   * 取字段的权限档位
   * @param resourceKey 资源标识（如 system:user）
   * @param fieldName 字段名
   * @returns 档位码；无限制返回 null
   * @description 快照里只有受限字段，查不到即为可写
   */
  const getFieldAccess = (resourceKey?: string, fieldName?: string): string | null => {
    if (!resourceKey || !fieldName) return null
    return fieldPermissions.value[resourceKey]?.[fieldName] ?? null
  }

  /**
   * 字段是否应在界面上隐藏（档位=隐藏）
   */
  const isFieldHidden = (resourceKey?: string, fieldName?: string): boolean => {
    return getFieldAccess(resourceKey, fieldName) === '0'
  }

  /**
   * 字段是否应禁止编辑（隐藏/脱敏/只读都不可改）
   * @description 脱敏档也禁用——用户看到的是掩码，放行会把掩码串提交进库
   */
  const isFieldReadonly = (resourceKey?: string, fieldName?: string): boolean => {
    const access = getFieldAccess(resourceKey, fieldName)
    return access !== null && access !== '3'
  }

  return {
    // 状态
    token,
    userInfo,
    roles,
    permissions,
    passwordStatus,
    fieldPermissions,

    // 计算属性
    mustChangePwd,
    pwdExpireInDays,

    // 方法
    fetchUserInfo,
    updateAvatar,
    loginUser,
    logoutUser,
    clearMustChangePwd,
    getFieldAccess,
    isFieldHidden,
    isFieldReadonly
  }
})
