/* eslint-disable @typescript-eslint/no-explicit-any */
import { UTCTimeResponse } from '@/types/request/common'
import numeral from 'numeral'
import dayjs from 'dayjs'

export const isProtocolUrl = (url: string) => /^http(s)?:\/\//.test(url)

export async function fetchUTCTime(): Promise<number> {
  try {
    const timeResponse = await fetch(
      `https://worldtimeapi.org/api/timezone/etc/UTC`
    )
    const timeResponseData: UTCTimeResponse = await timeResponse.json()
    return timeResponseData.unixtime
  } catch (err: any) {
    console.error('err when fetching utc time', err)
    return Date.now() / 1000
  }
}

export const sleep = (millisecond: number) =>
  new Promise(resolve => setTimeout(() => resolve(true), millisecond))

/**
 * 为数字补充首位
 * @param value
 * @param length 字符长度，默认为 2
 * @param prefix 补充的字符，默认为 '0'
 * @returns string
 */
export function fillNumberPrefix(
  value: string | number,
  length = 2,
  prefix = '0'
): string {
  const val = typeof value === 'number' ? value.toString() : value
  return val.length < length ? val.padStart(length, prefix) : val
}

/**
 * 将数字转化成百分比
 * @param value
 * @param decimal 小数位，默认保留 2 位
 * @param trailPercent 末尾是否添加 %
 * @returns string
 */
export function convertToPercent(
  value: number,
  decimal = 2,
  trailPercent = true
): string {
  return Math.abs(value).toFixed(decimal) + (trailPercent ? '%' : '')
}

/**
 * 将数字转化成千分位分割
 * @param value
 * @returns string
 */
export const convertToDivision = (
  value?: string | number,
  format = '0,0.[00000]'
): string => {
  if (value === undefined) return ''
  return numeral(value).format(format)
}

/**
 * 将数字转化成 K、W 单位
 * @param value 数值
 * @param unit 单位，K：千 | W：万 | K+W：千+万，默认 K
 * @param decimal 小数位，默认保留 1 位
 * @returns string
 */
export const convertToKW = (
  value: number,
  unit: 'K' | 'W' | 'K+W' = 'K',
  decimal: number = 1
): string => {
  if (!value) return '0'

  if (unit === 'K') {
    if (value >= 1e3) {
      return (value / 1e3).toFixed(decimal) + unit
    } else {
      return value.toString()
    }
  } else if (unit === 'W') {
    if (value >= 1e4) {
      return (value / 1e4).toFixed(decimal) + unit
    } else {
      return value.toString()
    }
  } else {
    if (value >= 1e3 && value < 1e4) {
      return (value / 1e3).toFixed(decimal) + 'K'
    } else if (value >= 1e4) {
      return (value / 1e4).toFixed(decimal) + 'W'
    } else {
      return value.toString()
    }
  }
}

export function getBytesCount(str: string) {
  let cnt = 0

  for (let i = 0; i < str.length; i++) {
    const c = str.charAt(i)

    const re = /^[\u0000-\u00ff]$/

    if (re.test(c)) {
      cnt++
    } else {
      cnt += 2
    }
  }

  return cnt
}

/**
 * ellipsisText 展示指定长度的文本
 * @param text 文字内容
 * @param max 最大展示字符数
 * @param placeholder 占位符，默认…
 * @returns
 */
export const ellipsisText = (
  text: string,
  max: number,
  placeholder = '...'
) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + placeholder : text
}

/**
 * ellipsisLabel 简短展示指定字符串
 * @param  {String} text 字符串文本
 * @param  {Object} options
 * maxLen?: number 生效长度
 * headLen?: number 头部字符个数
 * tailLen?: number 尾部字符个数
 * placeholder?: string 占位符
 * @return {String}
 */
export function ellipsisLabel(
  text: string,
  options?: {
    maxLen?: number
    headLen?: number
    tailLen?: number
    placeholder?: string
  }
) {
  const {
    maxLen = 10,
    headLen = 6,
    tailLen = 4,
    placeholder = '...'
  } = options || {}
  if (text.length <= maxLen) return text

  return text.slice(0, headLen) + placeholder + text.slice(0 - tailLen)
}

/**
 * checkPathValidate 检测路径是否在指定规则内
 * @param pathname 当前路径，location.pathname
 * @param rules 需要匹配的规则，字符串或者正则组成的数组
 * @returns
 */
export const checkPathValidate = (
  pathname: string,
  rules: string | RegExp | Array<string | RegExp>
) => {
  if (!rules) return true

  if (typeof rules === 'string') return pathname === rules
  if (Array.isArray(rules)) {
    const ret = rules.map(item =>
      typeof item === 'string' ? pathname === item : item.test(pathname)
    )
    return ret.some(itm => itm)
  } else {
    return rules.test(pathname)
  }
}

export const stringToRgb = (str: string, mode = 'array') => {
  const template = str.toLowerCase()
  let result = ''
  if (template.indexOf('rgb(') === 0) {
    result = template
  } else if (template.indexOf('rgba(') === 0) {
    const colors = template
      .replace(/rgba\(/g, '')
      .replace(/\)/g, '')
      .split(',')
    const r = colors[0]
    const g = colors[1]
    const b = colors[2]
    result = `rgb(${r},${g},${b})`
  } else if (template.indexOf('#') === 0) {
    let colors = template.replace(/#/g, '')
    const resultArr: number[] = []
    if (colors.length === 3) {
      colors = colors.replace(/[0-9a-f]/g, str => {
        return str + str
      })
    }
    for (let i = 0; i < colors.length; i += 2) {
      resultArr.push(parseInt(colors[i] + colors[i + 1], 16))
    }
    result = `rgb(${resultArr.join(',')})`
  }
  if (mode === 'string') {
    return result
  } else if (mode === 'array') {
    return result.replace(/rgb\(/g, '').replace(/\)/g, '').split(',')
  }
}
export const genBetweenAll = (m: number, n: number) =>
  Math.floor(Math.random() * (n - m + 1)) + m

export const transformValueFormat = (
  value: string | number | boolean,
  type: 'string' | 'number' | 'bigint' | 'boolean'
) => {
  if (type === 'string') return String(value).trim() as string
  if (type === 'boolean') return Boolean(value) as boolean
  if (type === 'number') return Number(String(value).trim()) as number
  if (type === 'bigint') return BigInt(String(value).trim()) as bigint
}

/**
 * formatTime 获取格式化后的时间字符串
 * @param time
 * @param friendly
 * @returns string
 */
export const formatTime = (
  time: number | string,
  friendly?: boolean,
  unix = false
) => {
  const date = unix ? dayjs.unix(Number(time)) : dayjs(time)
  if (friendly)
    return date
      .fromNow()
      .replace(/^a day/, '1 day')
      .replace(/^a minute/, '1 minute')
  return date.format('YYYY-MM-DD HH:mm')
}

export const formatTimeWithUTCOffset = (timestamp: number) => {
  // 将时间转换为 UTC 时间并格式化
  const formattedTime = dayjs
    .unix(timestamp)
    .utc()
    .local()
    .format('YYYY-MM-DD HH:mm:ss')
  // 获取 UTC 偏移量
  const utcOffset = dayjs().format('Z')
  // 拼接格式化的时间和 UTC 偏移量
  return `${formattedTime} UTC${utcOffset}`
}

export async function waitUntil(
  condition: () => boolean | Promise<boolean>,
  timeout = 600 * 1000
) {
  const start = Date.now()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await condition()
    // 如果超过了 timeout 时间，就直接返回
    if (Date.now() - start > timeout) {
      return false
    }
    if (res) {
      return res
    }
    await sleep(1000)
  }
}

/** 异步加载脚本 */
export function loadScript(
  url: string,
  position: 'head' | 'body' = 'body',
  scriptId?: string, // script 的id，传入 #script-xxx 这种
  timeout = 5000
) {
  return new Promise((resolve, reject) => {
    let script: HTMLScriptElement | null
    let timer: number | null

    if (scriptId && document.querySelector(scriptId)) {
      script = document.querySelector(scriptId) || null
    } else {
      script = document.createElement('script')
      script.defer = true
      script.src = url
      timer = window.setTimeout(() => {
        script?.remove()
        timer && clearTimeout(timer)
        timer = null
        reject('script load timeout!')
      }, timeout)
      if (scriptId) {
        script.id = scriptId.replace('#', '')
      }
    }
    if (!script) return reject('script is null!')

    script.onload = res => {
      timer && clearTimeout(timer)
      timer = null
      resolve(res)
    }
    script.onerror = err => {
      timer && clearTimeout(timer)
      timer = null
      reject(err)
    }

    const hasScript = scriptId && document.querySelector(scriptId)

    if (hasScript) return resolve('script already loaded!')

    document[position].appendChild(script)
  })
}

export function genUniqueId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 9)
}

export function isEvmAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function alphaColor(color: string, opacity: number) {
  const _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255)
  return color + _opacity.toString(16).toUpperCase()
}
