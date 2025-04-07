import Router from '@/router'
import { Suspense } from 'react'
import { DotLoading } from 'antd-mobile'

const IContent = () => {
  return (
    <div className="i-content">
      <Suspense fallback={<DotLoading />}>
        <Router />
      </Suspense>
    </div>
  )
}

export default IContent
