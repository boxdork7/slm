// 页面配置
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  // 全局页面样式配置
  globalStyle: {
    // 导航栏样式 自定义custom
    navigationBarTitleText: 'ryplus-uni',
    navigationStyle: 'custom',
    'mp-alipay': {
      'transparentTitle': 'always',
      'titlePenetrate': 'YES'
    },
    // H5端配置
    'h5': {
      'titleNView': false
    },
    // APP端专用配置 - 核心防抖动设置
    'app-plus': {
      // 关键：完全禁用页面弹性效果
      'bounce': 'none',
    },
  },

  // 组件自动导入配置
  easycom: {
    autoscan: true, // 是否开启自动扫描 components 目录
    custom: {
      // 自定义组件前缀映射规则 组件库
      '^wd-(.*)': '@/wd/components/wd-$1/wd-$1.vue'
    }
  }
})
