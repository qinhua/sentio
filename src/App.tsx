import JotaiProvider from '@/providers/JotaiProvider'
import AuthProvider from '@/providers/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import Layout from './layout'

function App() {
  return (
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
  )
}

export default App
