// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import path from 'node:path'
import { loadEnv } from 'vite'
import process from 'node:process'
// 获取环境变量的范例
const env = loadEnv(process.env.VITE_APP_ENV!, path.resolve(process.cwd(), 'env'))
const {
  VITE_APP_TITLE,
  VITE_UNI_APPID,
  VITE_APP_PUBLIC_PATH,
  // 各平台小程序 appid
  VITE_WECHAT_MINI_APP_ID,
  VITE_ALIPAY_MINI_APP_ID,
  VITE_BYTEDANCE_MINI_APP_ID,
  VITE_BAIDU_MINI_APP_ID,
  VITE_QQ_MINI_APP_ID,
} = env

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  appid: VITE_UNI_APPID,
  description: 'ryplus-uni',
  versionName: '5.6.1',
  versionCode: '100',
  transformPx: false,
  locale: 'zh-Hans',

  /* H5 配置 */
  h5: {
    router: {
      mode: 'history', // 设置为 history 模式
      base: VITE_APP_PUBLIC_PATH,
    },
    // H5 标题配置
    title: VITE_APP_TITLE,
    // 模板路径
    template: 'index.html',
    // 是否开启 gzip 压缩
    devServer: {
      https: false,
    },
  },

  /* 5+App特有相关 */
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    compatible: {
      ignoreVersion: true,
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    /* 模块配置 */
    modules: {},
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        minSdkVersion: 30,
        targetSdkVersion: 30,
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
      },
      /* ios打包配置 */
      ios: {},
      /* SDK配置 */
      sdkConfigs: {},
      /* 图标配置 */
      icons: {
        android: {
          hdpi: 'static/app/icons/72x72.png',
          xhdpi: 'static/app/icons/96x96.png',
          xxhdpi: 'static/app/icons/144x144.png',
          xxxhdpi: 'static/app/icons/192x192.png',
        },
        ios: {
          appstore: 'static/app/icons/1024x1024.png',
          ipad: {
            app: 'static/app/icons/76x76.png',
            'app@2x': 'static/app/icons/152x152.png',
            notification: 'static/app/icons/20x20.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'proapp@2x': 'static/app/icons/167x167.png',
            settings: 'static/app/icons/29x29.png',
            'settings@2x': 'static/app/icons/58x58.png',
            spotlight: 'static/app/icons/40x40.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
          },
          iphone: {
            'app@2x': 'static/app/icons/120x120.png',
            'app@3x': 'static/app/icons/180x180.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'notification@3x': 'static/app/icons/60x60.png',
            'settings@2x': 'static/app/icons/58x58.png',
            'settings@3x': 'static/app/icons/87x87.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
            'spotlight@3x': 'static/app/icons/120x120.png',
          },
        },
      },
    },
  },

  /* 快应用特有相关 */
  quickapp: {},

  /* 微信小程序配置 */
  'mp-weixin': {
    appid: VITE_WECHAT_MINI_APP_ID,
    setting: {
      urlCheck: false, // 是否检查安全域名和 TLS 版本
      es6: true, // 是否启用 ES6 转 ES5
      enhance: true, // 是否启用增强编译
      postcss: true, // 是否启用 postcss
      preloadBackgroundData: false, // 是否开启小程序独立分包加载
      minified: true, // 是否压缩代码
      coverView: true, // 是否使用工具渲染 CoverView
      bigPackageSizeSupport: true, // 是否支持分包异步化
    },
    usingComponents: true, // 是否启用自定义组件模式
    permission: { // 小程序接口权限相关设置
      'scope.userLocation': {
        desc: '您的位置信息将用于小程序位置接口的效果展示'
      }
    },
    // 按需注入
    lazyCodeLoading: 'requiredComponents',
    // 隐私相关设置
    requiredPrivateInfos: [
      'getLocation',
      'chooseLocation'
    ],
  },

  /* 支付宝小程序配置 */
  'mp-alipay': {
    appid: VITE_ALIPAY_MINI_APP_ID,
    usingComponents: true,
    styleIsolation: 'shared', // 样式隔离：shared(样式共享) | isolated(样式隔离)
  },

  /* 百度小程序配置 */
  'mp-baidu': {
    appid: VITE_BAIDU_MINI_APP_ID,
    usingComponents: true,
    // 编译设置
    compilation: {
      workers: 1, // 编译进程数
    },
    // 优化设置
    optimization: {
      subPackages: true, // 是否开启分包优化
    },
    // 权限配置
    permission: {},
  },

  /* 字节跳动小程序配置 */
  'mp-toutiao': {
    appid: VITE_BYTEDANCE_MINI_APP_ID,
    usingComponents: true,
    // 编译设置
    setting: {
      urlCheck: false, // 是否检查安全域名
      es6: true, // 是否启用 ES6 转 ES5
      postcss: true, // 是否启用 postcss
      minified: true, // 是否压缩代码
      newFeature: true, // 是否启用新特性
    },
    // 权限配置
    permission: {},
    // 分包配置
    subPackages: [],
    // 插件配置
    plugins: {},
  },

  /* QQ小程序配置 */
  'mp-qq': {
    appid: VITE_QQ_MINI_APP_ID,
    usingComponents: true,
    // 编译设置
    setting: {
      urlCheck: false, // 是否检查安全域名
      es6: true, // 是否启用 ES6 转 ES5
      postcss: true, // 是否启用 postcss
      minified: true, // 是否压缩代码
      newFeature: true, // 是否启用新特性
    },
    // 权限配置
    permission: {
      'scope.userLocation': {
        desc: '您的位置信息将用于小程序位置接口的效果展示'
      }
    },
    // 分包配置
    subPackages: [],
    // 插件配置
    plugins: {},
  },

  /* 快手小程序配置 */
  'mp-kuaishou': {
    // appid: '', // 如果有快手小程序，在这里配置
    usingComponents: true,
    // 编译设置
    setting: {
      urlCheck: false,
      es6: true,
      postcss: true,
      minified: true,
    },
  },

  /* 飞书小程序配置 */
  'mp-lark': {
    // appid: '', // 如果有飞书小程序，在这里配置
    usingComponents: true,
    // 编译设置
    setting: {
      urlCheck: false,
      es6: true,
      postcss: true,
      minified: true,
    },
  },

  /* 京东小程序配置 */
  'mp-jd': {
    // appid: '', // 如果有京东小程序，在这里配置
    usingComponents: true,
  },

  /* 360小程序配置 */
  'mp-360': {
    // appid: '', // 如果有360小程序，在这里配置
    usingComponents: true,
  },

  /* 统计配置 */
  uniStatistics: {
    enable: false // 是否开启uni统计     // 统计版本
  },

  /* Vue版本 */
  vueVersion: '3',

  /* 编译器版本 */
  compilerVersion: 3,
})
