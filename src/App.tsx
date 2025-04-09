import JotaiProvider from '@/providers/JotaiProvider'
import AuthProvider from '@/providers/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import enUS from 'antd-mobile/es/locales/en-US'
import { ConfigProvider } from 'antd-mobile'
import Layout from './layout'

function App() {
  return (
    <ConfigProvider locale={enUS}>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <JotaiProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </JotaiProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
