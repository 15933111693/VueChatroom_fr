const get = (key) => {
  const value = JSON.parse(localStorage.getItem(key), (k, v) => {
    if (k === '') return v
    if (v === 'undefined') return undefined
    if (v === 'null') return null
    return v
  })
  return value
}

const set = (key, value) => {
  value = JSON.stringify(value, (k, v) => {
    if (k === '') return v
    if (v === undefined) return 'undefined'
    if (v === null) return 'null'
    return v
  })
  localStorage.setItem(key, value)
}

const clear = () => {
  localStorage.clear()
}

const localstorageInstall = (app) => {
  app.config.globalProperties.$get = get
  app.config.globalProperties.$set = set
  app.config.globalProperties.$clear = clear
}

export {
  localstorageInstall, get, set, clear
}
