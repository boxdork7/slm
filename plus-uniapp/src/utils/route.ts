// 路由工具
import pagesConfig from '@/pages.json'

// 从 pages.json 配置中解构出页面配置、分包配置和底部导航配置
const { pages, subPackages, tabBar = { list: [] } } = { ...pagesConfig }

/**
 * 获取当前页面栈中的最后一个页面（即当前页面）
 * @returns 当前页面实例
 */
export const getCurrentPage = () => {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

// 导出底部导航栏配置列表，用于其他模块使用
export const tabBarList = tabBar?.list || []

/**
 * 判断当前页面是否是 tabBar 页面
 * @returns true: 当前页面是 tabBar 页面, false: 当前页面不是 tabBar 页面
 */
export const isCurrentTabBarPage = () => {
  try {
    const lastPage = getCurrentPage()
    const currPath = lastPage?.route

    // 通过遍历 tabBar 配置列表，判断当前页面路径是否匹配
    return Boolean(tabBar?.list?.some((item) => item.pagePath === currPath))
  } catch {
    // 发生异常时返回 false，确保函数稳定性
    return false
  }
}

/**
 * 判断指定页面路径是否是 tabBar 页面
 * @param path 页面路径，如 'pages/index/index'
 * @returns true: 是 tabBar 页面, false: 不是 tabBar 页面
 */
export const isTabBarPage = (path: string) => {
  // 检查是否存在 tabBar 配置
  if (!tabBar) {
    return false
  }

  // 检查 tabBar 列表是否为空
  if (!tabBar.list.length) {
    // 通常有 tabBar 的话，list 不能为空，且至少有2个元素，这里其实不用处理
    return false
  }

  // 处理路径格式：移除开头的 '/' 字符
  // 因为 tabBar 中的 pagePath 是不带 '/' 前缀的，如 'pages/index/index'
  if (path.startsWith('/')) {
    path = path.substring(1)
  }

  // 在 tabBar 列表中查找匹配的页面路径
  return !!tabBar.list.find((e) => e.pagePath === path)
}

/**
 * 递归解码 URL 编码的字符串
 * 确保完全解码多层编码的 URL 参数
 * @param url 需要解码的字符串
 * @returns 完全解码后的字符串
 */
const fullyDecodeUrl = (url: string) => {
  // 如果字符串以 '%' 开头，说明还有编码需要解码
  if (url.startsWith('%')) {
    return fullyDecodeUrl(decodeURIComponent(url))
  }
  return url
}

/**
 * 解析 URL 字符串，提取路径和查询参数
 * @param url 完整的 URL 字符串
 * @returns 包含 path 和 query 的对象
 * @example
 * // 输入：'/pages/auth/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor'
 * // 输出：{
 * //   path: '/pages/auth/login',
 * //   query: { redirect: '/pages/demo/base/route-interceptor' }
 * // }
 */
export const parseUrl = (url: string) => {
  // 按 '?' 分割 URL，获取路径和查询字符串
  const [path, queryStr] = url.split('?')

  // 如果没有查询字符串，直接返回路径和空查询对象
  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }

  // 解析查询字符串为对象
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // 对查询参数值进行解码，兼容 H5 和小程序平台的编码差异
    query[key] = fullyDecodeUrl(value)
  })

  return { path, query }
}
/**
 * 获取当前页面的完整路由信息
 * 解析当前页面的路径和查询参数
 * @returns 包含 path 和 query 的对象
 * @example
 * // 返回示例：
 * // {
 * //   path: '/pages/auth/login',
 * //   query: { redirect: '/pages/demo/base/route-interceptor' }
 * // }
 */
export const getCurrentRoute = () => {
  const lastPage = getCurrentPage()
  const currRoute = (lastPage as any).$page

  // 调试日志（已注释）
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)

  // 经过多端测试，只有 fullPath 属性在各个平台上都比较可靠
  const { fullPath } = currRoute as { fullPath: string }

  // fullPath 示例：
  // 小程序：/pages/auth/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
  // H5：/pages/auth/login?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30

  return parseUrl(fullPath)
}
