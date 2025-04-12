import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastPortal } from '@/components/common/ToastPortal'
import App from './App'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import utcTime from 'dayjs/plugin/utc'
import '@/addons/flexible'
import dayjs from 'dayjs'
import 'antd-mobile/es/global'
import 'react-toastify/dist/ReactToastify.css'
import '@/assets/style/global.scss'
import '@fontsource/pacifico'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(utcTime)
dayjs.extend(timezone)

const toastRoot = document.createElement('div')
toastRoot.id = 'toast-root'
toastRoot.style.zIndex = '2000'
document.body.appendChild(toastRoot)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastPortal
      theme="light"
      position="top-center"
      limit={1}
      newestOnTop
      hideProgressBar
      autoClose={2500}
      closeButton={false}
      pauseOnFocusLoss={false}
    />
  </StrictMode>
)
