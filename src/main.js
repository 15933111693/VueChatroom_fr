import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from './plugins/axios'
import { localstorageInstall } from './plugins/localstorage'
import socket from './plugins/socket'
import './registerServiceWorker'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(axios)
  .use(localstorageInstall)
  .use(socket)
  .mount('#app')
