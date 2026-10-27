// Vite配置
import type { ConfigEnv, UserConfig } from 'vite'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import createVitePlugins from './vite/plugins/index'

// https://vitejs.dev/config/
export default async ({ command, mode }: ConfigEnv): Promise<UserConfig> => {
  console.log('command, mode -> ', command, mode)
  // pnpm dev:h5 时得到 => serve development
  // pnpm build:h5 时得到 => build production
  // pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
  // pnpm build:mp-weixin 时得到 => build production
  // pnpm dev:app 时得到 => build development (注意区别，command为build)
  // pnpm build:app 时得到 => build production
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

  const { UNI_PLATFORM } = process.env
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const { VITE_APP_BASE_API, VITE_DELETE_CONSOLE, VITE_SHOW_SOURCEMAP, VITE_APP_PUBLIC_BASE } = env
  console.log('环境变量 env -> ', env)

  return defineConfig({
    // 基础路径 比如配置为了/demo/，那么访问地址为：https://ruoyi.plus/demo/ 且需要在nginx配置中配置静态资源映射
    //         location /demo/ {
    //         alias /www/sites/ruoyi.plus/index/demo/;
    //         try_files $uri $uri/ /demo/index.html;
    //     }
    base: VITE_APP_PUBLIC_BASE || '/',
    envDir: './env', // 自定义env目录
    // 使用抽离后的插件配置
    plugins: await createVitePlugins({ command, mode, env }),

    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
    },

    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': path.join(process.cwd(), '.'),
      },
    },

    server: {
      host: '0.0.0.0',
      // 允许访问的域名列表 .ruoyikj.top代表一级以及子域名访问
      allowedHosts: ['.ruoyikj.top'],
      hmr: true,
      // 端口被占用时自动递增
      strictPort: false,
      // 让 Vite 自己决定打开哪个 URL（会自动用最终端口）
      open: true,
    },

    // esbuild 配置 - 用于移除 console 和 debugger
    esbuild: {
      drop: VITE_DELETE_CONSOLE === 'true' ? ['console', 'debugger'] : ['debugger'],
    },

    // 依赖优化选项
    optimizeDeps: {
      include: ['jsencrypt/bin/jsencrypt.min.js', 'crypto-js'],
    },
    build: {
      sourcemap: VITE_SHOW_SOURCEMAP === 'true',
      target: 'es6',
      // 开发环境不用压缩，生产环境使用 esbuild 压缩
      minify: mode === 'development' ? false : 'esbuild',
    },
  })
}
