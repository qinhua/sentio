// import { useEffect } from 'react'
// import { useLocaleContext } from '@/providers/LocaleProvider'
// import { getLINEConfigByLocale } from '@/config/line'

// const LINE_INIT_KEY = 'LINE_INITIALIZED'

// export const useLINEConfig = () => {
//   const { urlLocale } = useLocaleContext()

//   useEffect(() => {
//     const initLine = async () => {
//       const isInitialized = sessionStorage.getItem(LINE_INIT_KEY)

//       if (!isInitialized) {
//         try {
//           // 使用 urlLocale 获取 LINE 配置
//           const config = getLINEConfigByLocale(urlLocale)

//           console.log(config, 'LINE Config')

//           //     // 初始化 LINE 平台
//           //     await initializeLine(config)

//           //     sessionStorage.setItem(LINE_INIT_KEY, 'true')
//           //     console.log(`LINE platform initialized with locale: ${urlLocale}`)
//         } catch (error) {
//           console.error('Failed to initialize LINE platform:', error)
//         }
//       }
//     }

//     initLine()
//   }, [urlLocale]) // 仅在 urlLocale 变化时重新初始化
// }
