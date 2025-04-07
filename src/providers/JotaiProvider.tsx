import type { ReactNode } from 'react'
import { Provider } from 'jotai'

const JotaiProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>
}

export default JotaiProvider
