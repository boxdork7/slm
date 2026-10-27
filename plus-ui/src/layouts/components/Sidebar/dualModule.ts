/**
 * 双列布局的一级模块判定规则
 *
 * 抽成独立文件是因为这套判断有两个使用方，且必须得出同一个结论：
 *   · DualSidebar —— 决定右侧子菜单列渲不渲染（railOnly）
 *   · Layout.vue  —— 决定外层 .sidebar-container 的宽度（284px 还是 74px）
 * 两边各写一份的话，一旦只改了其中一处，就会出现「子菜单列已隐藏、外层仍按
 * 284px 留位」的空白黑块。
 */
import type { RouteRecordRaw } from 'vue-router'

/** 需要从一级模块列表里排除的系统 / 兜底路由 */
export const DUAL_EXCLUDE_PATHS = ['/redirect', '/login', '/register', '/401', '/user', '/index', '/']

/** 首页入口路径（非菜单模块，图标列固定置顶） */
export const DUAL_HOME_PATH = '/index'

/**
 * 是否「被 Layout 包起来的单页面模块」
 *
 * 🔴 一级普通菜单（sys_menu.menu_type='C' 且 parent_id=0，如「我的应用」「我的积分」）
 * 在后端会被包成 Layout 父路由 —— 见 SysMenuServiceImpl 的「一级普通菜单处理」分支：
 *     router.setMeta(null);                 // 父路由没有 meta
 *     router.setName(StringUtils.EMPTY);    // 也没有 name
 *     children.setMeta(new MetaVo(菜单名, 图标, ...));   // 真正的标题与图标在唯一的子路由上
 *
 * 这类模块本身就是终点页，它那唯一的「子菜单」其实就是它自己，
 * 右列再挂一条同名菜单是多余的一层。
 *
 * 上游没处理这种结构，是因为它的一级菜单全是 M 类目录，父路由自带 meta 也有多个子菜单。
 */
export const isSinglePageModule = (mod: any): boolean => !!mod && !mod.meta && Array.isArray(mod.children) && mod.children.length === 1

/**
 * 取模块用于「展示」的那条路由（标题 / 图标从这里读）
 *
 * 单页面模块的父路由 meta=null、name=''，直接读会得到空标题空图标 ——
 * 图标列上就是一排「有高度、没内容」的空白块。与 SidebarItem 的 singleChildRoute
 * 同思路：用那个唯一子路由的展示信息顶上。只影响展示，跳转仍按模块本身算。
 */
export const displayRoute = (mod: any): any => (isSinglePageModule(mod) ? mod.children[0] : mod)

/** 过滤出可进图标列的一级模块 */
export const filterTopModules = (routes: RouteRecordRaw[]): RouteRecordRaw[] =>
  routes.filter((m: any) => m.hidden !== true && !DUAL_EXCLUDE_PATHS.includes(m.path))

/**
 * 由当前路由反推所属的一级模块 path（取路径第一段拼成 /xxx）
 *
 * 首页返回 DUAL_HOME_PATH；非模块页返回空串（不做兜底高亮，避免误点亮第一个模块）。
 */
export const resolveTopPath = (routePath: string, topModules: RouteRecordRaw[]): string => {
  if (routePath === DUAL_HOME_PATH) return DUAL_HOME_PATH
  const seg = routePath.split('/').filter(Boolean)[0]
  const guess = seg ? '/' + seg : ''
  return topModules.some((m) => m.path === guess) ? guess : ''
}

/**
 * 双列布局下是否「只保留图标列」
 *
 * 三种情况收起右列：侧栏折叠态、当前在首页、当前模块是单页面模块。
 * DualSidebar 用它决定渲染，Layout 用它决定外层宽度 —— 同一个函数保证两者不会打架。
 */
export const shouldRailOnly = (opts: { sidebarOpened: boolean; routePath: string; topModules: RouteRecordRaw[] }): boolean => {
  const { sidebarOpened, routePath, topModules } = opts
  if (!sidebarOpened) return true
  if (routePath === DUAL_HOME_PATH) return true
  const topPath = resolveTopPath(routePath, topModules)
  const mod = topModules.find((m) => m.path === topPath)
  // 找不到所属模块（非模块页）时也没有子菜单可展示
  if (!mod) return true
  return isSinglePageModule(mod)
}
