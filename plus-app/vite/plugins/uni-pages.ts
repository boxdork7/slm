// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import path from 'node:path'
/**
 * 页面路由/分包配置插件
 * 自动生成页面路由配置, 且在此配置配置主页,配置layout等,可以不需要在每个页面配置route块
 */
export default (mode: string) => {
  return UniPages({
    outDir: '.',
    dir: 'pages',
    // 直接设置主页
    homePage: 'pages/index/index',
    // 扫描的文件后缀：vue + nvue（nvue 仅 APP 端生效，weex 原生渲染）
    extensions: ['vue', 'nvue'],
    // 排除的组件路径
    exclude: ['**/components/**/**.*'],
    // 页面可以使用route块配置路由,但是建议不使用
    routeBlockLang: 'json5', // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
    // pages 目录为 src/pages，分包目录不能配置在pages目录下
    subPackages: [
      // 分包管理员相关页面
      'pages-sub/admin',
      // 可以通过下面的方式根据环境才加载对应分包
      // ...(mode === 'production' ? [] : ['src/pages-sub/demo']),
    ],
    dts: path.resolve(__dirname, '../../types/uni-pages.d.ts'),

    onAfterMergePageMetaData(ctx) {
      // console.log('🟠 onAfterMergePageMetaData 被调用')

      // 处理主包页面
      ctx.pageMetaData.forEach((page) => {
        page.layout = 'default'
        // 可以通过判断路径来设置不同的 layout
      })

      // 处理分包页面
      if (ctx.subPageMetaData) {
        ctx.subPageMetaData.forEach((subPackage) => {
          // console.log('处理分包:', subPackage.root)

          subPackage.pages.forEach((page) => {
            // console.log('处理分包页面:', `${subPackage.root}/${page.path}`)
            page.layout = 'default'
            // 也可以通过判断路径来设置不同的 layout
            // 根据分包根目录设置 layout
            if (subPackage.root === 'pages-sub/admin') {
              page.layout = 'default'
              // console.log('admin 分包设置:', page.path, '-> admin')
            }
          })
        })
      }
    },
  })
}
