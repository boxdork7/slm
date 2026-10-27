// ESLint 配置文件 - 基于 @uni-helper/eslint-config，专门为 uni-app 项目优化
import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  // ===== 功能开关配置 =====

  // 启用 UnoCSS 支持，提供 UnoCSS 相关的 ESLint 规则和自动修复
  unocss: true,

  // 启用 Vue 3 支持，包含 Vue 3 组合式 API、SFC 等相关规则
  vue: true,

  // 禁用 Markdown 文件检查，uni-app 项目通常不需要对 .md 文件进行 lint
  markdown: false,

  // ===== 忽略文件配置 =====
  ignores: [
    // uni-app 插件目录，包含第三方插件，不需要检查
    'src/uni_modules/',

    // 构建输出目录
    'dist',

    // unplugin-auto-import 生成的类型文件，每次自动导入变化时都会重新生成
    'auto-imports.d.ts',

    // vite-plugin-uni-pages 生成的类型文件，根据页面结构动态生成
    'uni-pages.d.ts',

    // 插件自动生成的配置文件
    'src/pages.json', // 页面路由配置
    'src/manifest.json', // 应用配置清单
  ],

  // ===== 自定义规则配置 =====
  rules: {
    // 允许使用 console 语句，开发环境下经常需要调试输出
    'no-console': 'off',

    // 关闭未使用变量检查，开发过程中可能临时定义变量
    'no-unused-vars': 'off',

    // 允许未使用的 ref 引用，Vue 3 中的 ref 可能在模板中使用但代码中未直接引用
    'vue/no-unused-refs': 'off',

    // 关闭 unused-imports 插件的未使用变量检查，避免与其他规则冲突
    'unused-imports/no-unused-vars': 'off',

    // 允许无限制的 eslint-disable 注释，在某些复杂场景下可能需要大范围禁用规则
    'eslint-comments/no-unlimited-disable': 'off',

    // 关闭参数名称检查，JSDoc 参数名与实际参数名不一致时不报错
    'jsdoc/check-param-names': 'off',

    // 不强制要求返回值描述，简单函数的返回值可能不需要详细描述
    'jsdoc/require-returns-description': 'off',

    // 允许空对象类型，TypeScript 中有时需要定义空接口作为基础类型
    'ts/no-empty-object-type': 'off',

    // 允许扩展原生对象，某些情况下可能需要为原生对象添加方法（谨慎使用）
    'no-extend-native': 'off',

    // 或者完全关闭这个规则
    'vue/block-order': 'off',

    // 关闭函数风格配置
    'func-style': 'off',
    'antfu/top-level-function': 'off',

    // 关闭 Vue 3 define-macros 的顺序检查
    'vue/define-macros-order': 'off',

    // 关闭大括号风格检查，允许不同风格的代码
    'style/brace-style': 'off',

    // 关闭引号风格检查，允许单引号和双引号混用
    'style/quote-props': 'off',

    // 关闭操作符换行检查，允许操作符在行尾或行首
    'style/operator-linebreak': 'off',
    // 关闭 if 语句换行检查，允许 if 语句不换行
    'antfu/if-newline': 'off',
    // 关闭箭头函数括号检查
    'style/arrow-parens': 'off',

    'style/indent-binary-ops': 'off',

    'vue/operator-linebreak': 'off',

    'vue/html-indent': 'off',

    'style/indent': 'off',

    'style/member-delimiter-style': 'off',

    'style/comma-dangle': 'off',

    'format/prettier': 'off',

    'vue/singleline-html-element-content-newline': 'off',

    'perfectionist/sort-named-imports': 'off',

    'perfectionist/sort-imports': 'off',
  },

  // ===== 格式化配置 =====
  formatters: {
    // 启用 CSS 格式化，格式化 CSS、LESS、SCSS 文件及 Vue 文件中的 <style> 块
    css: true,

    // 启用 HTML 格式化，格式化 HTML 文件和 Vue 文件中的模板部分
    html: true,
  },
})
