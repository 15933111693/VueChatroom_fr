import { clear } from '@/plugins/localstorage'

export default ({
  namespaced: true,
  state: {
    id: null,
    userName: null,
    userAccount: null,
    avatar: null,
    createdAt: null,
    updatedAt: null
  },
  getters: {
  },
  mutations: {
    userInit (state, user) {
      for (const item in user) {
        state[item] = user[item]
      }
    },
    quit (state) {
      for (const item in state) {
        state[item] = null
      }
      clear()
    }
  },
  actions: {
  }
})
