<!-- 通过UniLayouts插件实现的Layout布局组件 default是默认的布局
 可以在页面顶部配置layout来自定义layout层但是不建议. 建议去/vite/plugins/uni-layouts.js中配置 这样所有页面都不需要配置route块
 在代码下方有完整的route块配置示例
 <route lang="json5">
{
  layout: 'demo',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '测试',
  },
}
</route>
 -->
<template>
  <wd-config-provider :theme-vars="themeVars">
    <!--  内容插槽  -->
    <slot />
    <!--  轻提示组件  -->
    <wd-toast />
    <!--  消息通知   -->
    <wd-notify />
    <!--  消息确认弹窗   -->
    <wd-message-box />
    <!--  授权头像昵称弹窗  -->
    <AuthModal />
  </wd-config-provider>
</template>

<script lang="ts" setup>
const { themeVars } = useTheme({
  // 需要覆盖的主题变量
})
</script>

<!-- 通过UniLayouts插件实现的Layout布局组件 default是默认的布局
 可以在页面顶部配置layout来自定义layout层
 <route lang="json5">
{
  // ===== UniLayouts 插件专用 =====
  layout: 'demo', // 指定使用的布局模板：default、admin、user、demo 等

  // ===== 页面类型 =====
  type: 'page', // 页面类型：'page' | 'home' | 'tabbar'

  // ===== 页面样式配置 =====
  style: {
    // 导航栏配置
    navigationStyle: 'default', // 'default' | 'custom' 是否自定义导航栏
    navigationBarTitleText: '页面标题', // 导航栏标题
    navigationBarBackgroundColor: '#000000', // 导航栏背景色
    navigationBarTextStyle: 'white', // 'black' | 'white' 导航栏标题颜色
    navigationBarShadow: {
      colorType: 1 // 导航栏阴影，0-无阴影，1-有阴影
    },

    // 窗口配置
    backgroundColor: '#ffffff', // 窗口背景色
    backgroundTextStyle: 'dark', // 'dark' | 'light' 下拉loading样式
    backgroundColorTop: '#ffffff', // 顶部窗口背景色(仅iOS)
    backgroundColorBottom: '#ffffff', // 底部窗口背景色(仅iOS)

    // 下拉刷新
    enablePullDownRefresh: false, // 是否开启下拉刷新
    onReachBottomDistance: 50, // 页面上拉触底事件触发时距页面底部距离

    // 其他配置
    disableScroll: false, // 是否禁止页面滚动
    titlePenetrate: 'NO', // 'YES' | 'NO' 是否允许点击穿透标题栏

    // App平台特有
    'app-plus': {
      bounce: 'vertical', // 'none' | 'vertical' | 'horizontal' 页面回弹效果
      scrollIndicator: 'none', // 'none' | 'default' 滚动条显示策略
      animationType: 'slide-in-right', // 窗口动画类型
      animationDuration: 300, // 窗口动画持续时间
      titleNView: {
        buttons: [
          {
            text: '按钮',
            fontSize: '16px',
            color: '#333333',
            float: 'right'
          }
        ]
      },
      subNVues: [
        {
          id: 'drawer',
          path: 'pages/drawer',
          style: {
            position: 'popup',
            width: '50%'
          }
        }
      ]
    },

    // H5平台特有
    h5: {
      pullToRefresh: {
        color: '#2bd009'
      },
      titleNView: {
        backgroundColor: '#f7f7f7',
        buttons: [
          {
            text: '分享',
            type: 'share'
          }
        ]
      }
    },

    // 小程序平台特有
    'mp-weixin': {
      shareElement: 'element-id' // 页面间共享元素
    },

    // 各平台通用配置
    usingComponents: {
      // 引入小程序原生组件
      'custom-component': 'plugin://myPlugin/custom-component'
    }
  },

  // ===== 自定义数据 =====
  meta: {
    // 可以存储任意自定义数据，在组件中通过 $route.meta 访问
    auth: true, // 是否需要登录
    title: '自定义标题',
    description: '页面描述',
    keywords: 'vue,uniapp',
    roles: ['admin', 'user'], // 权限控制
    keepAlive: true, // 是否缓存页面
    transition: 'slide-left', // 页面切换动画
    level: 2, // 页面层级
    analytics: {
      track: true,
      category: 'user'
    }
  },

  // ===== 页面预加载规则(分包用) =====
  preloadRule: {
    'pages/detail': {
      network: 'all', // 'wifi' | 'all' 网络条件
      packages: ['__APP__'] // 预下载的分包
    }
  },

  // ===== 窗口表现(小程序) =====
  window: {
    navigationBarTitleText: '窗口标题'
  },

  // ===== 其他平台特定配置 =====
  'mp-alipay': {
    allowsBounceVertical: 'YES'
  },
  'mp-baidu': {
    backgroundColor: '#ffffff'
  },
  'mp-toutiao': {
    navigationStyle: 'default'
  }
}
</route>
 -->
