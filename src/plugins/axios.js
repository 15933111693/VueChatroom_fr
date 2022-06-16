'use strict'

import axios from 'axios'
import { get, set } from '@/plugins/localstorage'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.lo0 = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: process.env.VUE_APP_BASE_URL || '',
  timeout: 60 * 1000, // Timeout
  withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = get('token')
    if (token) config.headers.token = token

    if (config.data instanceof FormData) config.headers['Content-Type'] = 'multipart/form-data'
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    const { token, tokentime } = response.headers
    if (token) {
      set('token', token)
      set('tokenTime', Number(tokentime))
      set('createTokenTime', new Date().getTime())
    }
    const { data, msg, state } = response.data
    if (!state) console.error(msg)
    else console.log(msg)
    console.log(data)
    return response.data
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

const Plugin = { axios: _axios }

Plugin.install = function (app, options) {
  app.config.globalProperties.$axios = _axios
}

export default Plugin
