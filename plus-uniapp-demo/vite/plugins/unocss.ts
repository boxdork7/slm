/**
 * UnoCSS 插件配置
 * 原子化 CSS 引擎，提供快速、灵活的样式解决方案
 */
export default async () => {
  // @see https://unocss.dev/
  const UnoCSS = (await import('unocss/vite')).default
  return UnoCSS()
}
