# plus-uniappx 移动端框架（UniApp X 版本，使用 UTS 语言开发原生APP）

## 文档地址
https://ruoyi.plus/mobile/

## 说明
基于 UniApp X 的原生APP开发项目，使用 UTS 语言（`.uts`）和 UVue（`.uvue`）编写，需使用 HBuilderX 进行运行和打包。

与 plus-uniapp / plus-app 的区别：
- **plus-uniapp**：Vue3 + TypeScript，支持小程序/H5/APP，CLI 构建
- **plus-app**：Vue3 + TypeScript，专用于原生APP，HBuilderX 构建
- **plus-uniappx**：UTS + UVue（UniApp X），编译为纯原生APP，HBuilderX 构建

## 运行

```bash
# 环境:node>=18 pnpm>=8 可下载安装nvm进行node版本切换和管理
# 如果没有 pnpm，请先安装: npm i -g pnpm
# (Unable to find the global bin directory)则执行 pnpm config set global-bin-dir "D:\software\dev\nvm\nodejs"(这里根据自己的目录更改)
# 执行更新 pnpm self-update

# 1. 克隆项目（注意：项目路径不能包含中文字符）
git clone xxx.git

# 2. 安装依赖
pnpm i

# 3. 开发调试
# 使用 HBuilderX 打开项目，点击"运行"到手机或模拟器
# 开发环境会自动加载 env/.env.development 配置

# 打包发布
# HBuilderX 中发行，会自动使用生产环境配置
```

## 目录结构

```
plus-uniappx/
├── api/                    # API 定义
├── components/             # 业务组件
├── composables/            # 组合函数
├── env/                    # 环境配置
│   ├── .env                # 通用配置
│   ├── .env.development    # 开发环境
│   └── .env.production     # 生产环境
├── layouts/                # 布局组件
├── locales/                # 国际化语言包
├── pages/                  # 主页面（自动路由）
├── pages-sub/              # 子页面（分包）
├── static/                 # 静态资源
├── stores/                 # 状态管理
├── style/                  # 全局样式
├── types/                  # 类型定义
├── utils/                  # 工具函数（.uts）
├── wd/                     # WD UI 组件库
├── App.uvue                # 应用入口
├── main.uts                # 主入口
├── manifest.json           # 应用配置
├── pages.json              # 页面路由配置
├── systemConfig.uts        # 系统配置
└── uni.scss                # 全局样式变量
```
