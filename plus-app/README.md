# plus-uniapp移动端APP框架（涉及原生插件开发APP则使用本项目）

## 文档地址
https://ruoyi.plus/mobile/

## 说明
专用于APP开发，使用HBuilderX进行运行和打包，代码编写可在VSCode/IDEA中进行。

## 运行

```bash
# 环境:node>=18 pnpm>=8 可下载安装nvm进行node版本切换和管理
# 如果没有 pnpm，请先安装: npm i -g pnpm
# (Unable to find the global bin directory)则执行 pnpm config set global-bin-dir "D:\software\dev\nvm\nodejs"(这里根据自己的目录更改)
# 执行更新 pnpm self-update

# 1. 克隆项目（注意：项目路径不能包含中文字符，否则鸿蒙打包可能出错）
git clone xxx.git

# 2. 安装依赖
pnpm i

# 3. 开发调试
# 使用 HBuilderX 打开项目，点击"运行"到手机或模拟器
# 开发环境会自动加载 .env.development 配置

# 打包发布
# hbuilderx中发行，会自动使用生产环境配置
```
