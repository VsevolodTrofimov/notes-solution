common.net = (function syncModule() {
  let shouldAutoUpdate = true
  let autoCb = undefined

  const HeadersJSON = new Headers({
    'Content-Type': 'application/json'
  })

  const HeadersText = new Headers({
    'Content-Type': 'text/plain'
  })


  const request = (url, method='GET', body) => {
    const init = {method, body, headers: HeadersText}
    if(method !== 'GET' && typeof body === 'object') {
      init.body = JSON.stringify(body)
      init.headers = HeadersJSON
    }

    return fetch(url, init).then(res => res.text())
  }

  const sync = {
    do: false,
    cb: undefined,
    url: undefined,
    interval: 1000,
    timeout: setTimeout(() => {})
  }

  const update = () => {
    request(sync.url)
      .then(JSON.parse)
      .then(data => {
          sync.cb(data)
          sync.timeout = setTimeout(update, sync.interval)
      })
  }

  sync.stop = () => {
    sync.do = false
    clearTimeout(sync.timeout)
  }

  sync.start = (url, cb, interval) => {
      if(url) sync.url = url
      if(cb) sync.cb = cb
      if(interval) sync.interval = interval
      sync.do = true
      update()
  }

  return {
    request,
    sync
  }
}() )
