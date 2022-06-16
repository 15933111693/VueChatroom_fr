import { createStore } from 'vuex'
import user from './user'
import chatRoom from './chatroom'

const store = createStore({
  state: {
    isFirstToPage: true,
    title: '',

    // tips
    snackbar: false,
    tips: '',
    timeout: null
  },
  getters: {
  },
  mutations: {
    joinPage (state) {
      state.isFirstToPage = false
    },
    tips (state, html) {
      clearTimeout(state.timeout)
      state.snackbar = false
      state.tips = html
      state.snackbar = true
      state.timeout = setTimeout(() => {
        state.snackbar = false
      }, 3000)
    }
  },
  actions: {
  },
  modules: {
  }
})

store.registerModule('user', user)
store.registerModule('chatroom', chatRoom)

export default store
