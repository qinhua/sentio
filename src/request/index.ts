/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CanceledError
} from 'axios'
// import { AuthTokenManager } from './authTokenManager'
import { BACKEND_API_URL } from '@/config/host'
import { eventEmitter } from '@/utils/events'
import { COMMON_EVENTS } from '@/enum/events'
// import { encodeTimestamp } from '@/addons/bot'
import { toast } from 'react-toastify'
import { Dict_Request } from './dict'
import qs from 'qs'

const ToastErrorId = 'request-error'

export interface IRequestConfig<R> extends AxiosRequestConfig {
  customHeaders?: boolean // 为 true 时使用业务中传入的 headers
  rawResponse?: boolean // 为 true 时返回完整的响应数据方便前端判断
  noToast?: boolean
  withCredentials?: boolean
  customResponse?: (data: AxiosResponse) => R
}

const instance = axios.create({ timeout: 20000 })

async function baseRequest<R = any>(url: string, config?: IRequestConfig<R>) {
  config = {
    withCredentials: config?.withCredentials ?? true,
    ...config,
    headers: config?.customHeaders
      ? config.headers || {}
      : {
          // Authorization: AuthTokenManager.token
          //   ? `Bearer ${AuthTokenManager.token}`
          //   : "",
          // Accept: "application/json",
          // "X-Interceptor-Id": encodeTimestamp(), // 添加 bot interceptor 到请求头
          ...config?.headers
        }
  }

  if (!config.params) {
    config.params = {}
  }
  // config.params.chain_id = CURRENT_BASE_NETWORK_ID // 统一带上 chain_id

  if (
    config?.headers?.['Content-Type'] === 'application/x-www-form-urlencoded' &&
    config.data
  ) {
    config.data = qs.stringify(config.data)
  }

  return instance({ url, ...config })
    .then(res => {
      // console.log(res, 'res-request')
      if (config?.rawResponse) {
        return res.data as R
      }
      if (config?.customResponse) {
        return config?.customResponse(res) as R
      }
      if (
        typeof res.data?.code === 'number' &&
        typeof res.data?.msg === 'string'
      ) {
        if (res.data?.code === 0) {
          // if (!['/get_signature_text', '/login'].includes(res.config.url)) {
          //   setTimeout(() => {
          //     eventEmitter.emit(COMMON_EVENTS.SESSION_EXPIRED)
          //   }, 500)
          // }
          return res.data?.data as R
        }
        return Promise.reject(res.data)
      }
      return res.data as R
    })
    .catch(err => {
      // console.log(err, 'err-request')
      if (typeof err?.code === 'number' && typeof err?.msg === 'string') {
        if (err?.code !== 0) {
          if (!config?.noToast) {
            const errMsg = err?.msg || Dict_Request.SomethingWrong
            toast.error(errMsg, { toastId: ToastErrorId })
          }

          // 新增逻辑：处理 code 为 12006 的情况
          // if (err.code === 12006) {
          //   setTimeout(() => {
          //     eventEmitter.emit(COMMON_EVENTS.BIND_WALLET) // 引导用户绑定钱包
          //   }, 1000)
          // }
        }
      } else if (err instanceof AxiosError) {
        if (err instanceof CanceledError) {
          throw err
        }
        if (err.status === 401 || err.response?.status === 401) {
          if (!config?.noToast) {
            toast.error(Dict_Request.SessionExpired, {
              toastId: ToastErrorId
            })
          }
          eventEmitter.emit(COMMON_EVENTS.SESSION_EXPIRED)
        }
        if (
          (err.status === 403 || err.response?.status === 403) &&
          err.response?.data?.msg === 'Invalid turnstile token'
        ) {
          if (!config?.noToast) {
            toast.error(Dict_Request.SessionExpired, {
              toastId: ToastErrorId
            })
          }
          eventEmitter.emit(COMMON_EVENTS.SESSION_EXPIRED)
        } else {
          if (!config?.noToast) {
            const errMsg =
              err?.response?.data?.message || err?.message || Dict_Request.Opps
            toast.error(errMsg, { toastId: ToastErrorId })
            // Toast.show({ content: errMsg })
          }
        }
      } else if (err instanceof Error) {
        if (!config?.noToast) {
          const errMsg =
            // @ts-ignore
            err?.response?.data?.message || err?.message || Dict_Request.Opps
          toast.error(errMsg, { toastId: ToastErrorId })
        }
      } else {
        if (!config?.noToast) {
          const errMsg =
            err?.response?.data?.message ||
            err?.message ||
            err?.msg ||
            Dict_Request.Opps
          toast.error(errMsg, { toastId: ToastErrorId })
        }
      }
      throw err
    })
}

export const request = {
  baseRequest,
  api: {
    get: <R = any>(url: string, config?: IRequestConfig<R>) =>
      baseRequest(url, {
        ...config,
        method: 'get',
        baseURL: BACKEND_API_URL
      }),
    post: <R = any>(url: string, config?: IRequestConfig<R>) =>
      baseRequest(url, {
        ...config,
        method: 'post',
        baseURL: BACKEND_API_URL
      }),
    put: <R = any>(url: string, config?: IRequestConfig<R>) =>
      baseRequest(url, {
        ...config,
        method: 'put',
        baseURL: BACKEND_API_URL
      }),
    delete: <R = any>(url: string, config?: IRequestConfig<R>) =>
      baseRequest(url, {
        ...config,
        method: 'delete',
        baseURL: BACKEND_API_URL
      })
  }
}
/**
 * 普通的数据结构
 */
export interface PlainResponse<T> {
  code: number
  data: T
  message: string
  detail?: string
}

/**
 * 带分页的数据结构
 */
export interface PageResponse<T> {
  code: number
  data: T
  message: string
  meta: IPagerInfo
}

/**
 * 分页参数
 */
export interface IPagerParams {
  page: number
  items: number
  outset?: number
}

/**
 * 分页结构
 */
export interface IPagerInfo {
  current_page: number
  page_items: number
  total_count: number
  total_pages: number
  jump_info?: { topic_id: string; topic_onchain_id: string }
}
