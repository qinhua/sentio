// @ts-nocheck
const loadScript = obj => {
  return new Promise((resolve, reject) => {
    if (window.J$) {
      resolve(true)
    } else {
      if (obj.noCache) {
        obj.url = obj.url + '?t=' + new Date().valueOf()
      }
      const body = document.querySelector('body')
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', obj.url)
      script.setAttribute('name', obj.name)
      script.setAttribute('version', obj.version)
      script.onerror = () => reject(false)
      body.appendChild(script)
      if (document.all) {
        script.onreadystatechange = function () {
          const state = this.readyState
          if (state === 'loaded' || state === 'complete') {
            resolve(true)
          } else {
            reject(false)
          }
        }
      } else {
        //firefox, chrome
        script.onload = function () {
          resolve(true)
        }
      }
    }
  })
}

export default loadScript
