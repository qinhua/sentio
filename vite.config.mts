import { ConfigEnv, UserConfigExport, defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import postCssPxToRem from 'postcss-pxtorem'
import vitePluginImp from 'vite-plugin-imp'
import react from '@vitejs/plugin-react'
import path from 'path'
// @ts-ignore
import { BACKEND_API_HOST } from './src/config/host'

const getPath = (url: string) => path.resolve(__dirname, url)

// https://vitejs.dev/config/
export default ({ mode, command, isSsrBuild }: ConfigEnv) => {
  mode = ['dev', 'prod'].includes(mode)
    ? mode
    : /^prod/.test(mode)
    ? 'prod'
    : 'dev'

  console.log({
    mode: process.env.NODE_ENV,
    env: mode,
    BACKEND_API_HOST,
    command,
    isSsrBuild
  })

  const config: UserConfigExport = {
    root: getPath(__dirname),
    resolve: {
      alias: {
        '@': getPath('src'),
        src: getPath('src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          // import语句后面的;不能省略，不然全局样式不生效
          additionalData: `@use "@/assets/style/variable.scss" as *;`
        }
      },
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 37.5, // 设计稿/10 即 1rem
            unitPrecision: 3, // 允许rem单位增长到十进制数字，小数点后保留的位数
            propList: ['*', '!border'], // 除 border 外所有 px 转 rem
            exclude: /node_modules/i,
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 2 //设置要替换的最小像素值
          })
        ]
      }
    },
    plugins: [
      ViteEjsPlugin({
        NODE_ENV: process.env.NODE_ENV,
        APP_ENV: mode
      }),
      nodePolyfills(),
      react(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd-mobile',
            style: () => true,
            libDirectory: 'es/components',
            replaceOldImport: true
          }
        ]
      })
    ],
    server: {
      open: true,
      port: 3000
      // proxy: {
      //   '/api': {
      //     target: BACKEND_API_HOST,
      //     changeOrigin: true,
      //     secure: false
      //   }
      // }
    }
  }

  return defineConfig(config)
}
