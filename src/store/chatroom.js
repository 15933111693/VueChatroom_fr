
export default ({
  namespaced: true,
  state: {
    chatRooms: [
      {
        CID: 'CID0000001',
        roomAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        roomName: 'cav',
        chatList: [
          { userId: '', avatar: '', userName: '', content: '' }
        ]
      }
    ],
    mapRooms: new Map()
  },
  getters: {
  },
  mutations: {
    initChatRoom (state, data) {
      const { chatRooms } = data
      state.chatRooms = chatRooms
      for (const room of state.chatRooms) {
        state.mapRooms.set(room.CID, room)
      }
    },
    joinRoom (state, data) {
      state.chatRooms.unshift(data)
    },
    pushMsg (state, data) {
      const { CID, content, userId, avatar, userName, createdAt, id } = data
      state.mapRooms.get(CID).chatList.unshift({
        userId,
        avatar,
        userName,
        content,
        createdAt,
        id
      })
    },
    pushMsgBottom (state, data) {
      const { CID, content, userId, avatar, userName, createdAt, id } = data
      state.mapRooms.get(CID).chatList.push({
        userId,
        avatar,
        userName,
        content,
        createdAt,
        id
      })
    },
    leaveRoom (state, data) {
      const { CID } = data
      const n = state.chatRooms.length
      for (let i = 0; i < n; i++) {
        const room = state.chatRooms[i]
        if (room.CID === CID) {
          state.chatRooms.splice(i, 1)
          break
        }
      }
    },
    clear (state) {
      state.chatRooms = []
      state.mapRooms.clear()
    }
  },
  actions: {
    pushMsg ({ commit, rootState }, data) {
      commit('pushMsg', data)
    },
    pushMsgBottom ({ commit }, data) {
      commit('pushMsgBottom', data)
    }
  }
})
