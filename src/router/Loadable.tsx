 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementType, FC, ReactNode, Suspense } from 'react'

const WindmillLoading: FC<{ height: number }> = () => null

interface E_Props {
  children?: ReactNode
}
interface E_State {
  error: unknown
  errorInfo: any
}

class ErrorBoundary extends Component {
  public state: E_State = { error: null, errorInfo: null }
  public props: E_Props = {}
  constructor(props: E_Props = { children: null }) {
    super(props)
    this.props = props
  }

  componentDidCatch(error: any, errorInfo: any) {
    // 发版后继续访问老版本文件出现错误时，自动刷新下页面
    const errString = error?.toString()
    const isChunkLoadError = /Loading chunk \d+ failed/g.test(errString)
    const isDynamicImportError =
      /Failed to fetch dynamically imported module/g.test(errString)
    const isCSSError = /Unable to preload CSS/g.test(errString)
    if (isChunkLoadError || isDynamicImportError || isCSSError) {
      window.location.reload()
    } else {
      console.log(error, errorInfo)
      this.setState({
        error,
        errorInfo
      })
    }
    // You can add error reporting service here
  }

  render() {
    const commonTips = (
      <h2
        className="p-4 font-bold rounded-md capitalize"
        style={{
          background: 'linear-gradient(45deg, #eb3f1d, transparent 90%)'
        }}
      >
        <span role="img" aria-label="img">
          😰
        </span>
        &nbsp;&nbsp;&nbsp;Error detected.&nbsp;&nbsp;&nbsp;Kindly refresh the
        page to continue.
      </h2>
    )
    if (this.state.errorInfo) {
      return (
        <div style={{ padding: '70px 30px' }}>
          {commonTips}
          <details
            style={{
              marginTop: '16px',
              whiteSpace: 'pre-wrap',
              color: '#aaa'
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export const Loadable = (Component: ElementType) => (props: unknown) =>
  (
    <ErrorBoundary>
      <Suspense fallback={<WindmillLoading height={500} />}>
        <Component {...(props || {})} />
      </Suspense>
    </ErrorBoundary>
  )

export default Loadable
