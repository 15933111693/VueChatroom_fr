import { io } from 'socket.io-client'
import store from '@/store/index'
const url = process.env.VUE_APP_SOCKET_URL
console.log(url)

class Socket {
  constructor () {
    this.instance = null
  }

  async createNewInstance (token) {
    store.state.title = '连接中...'
    this.instance = await io(url, {
      auth: {
        token: token
      }
    })

    this.initSocket(this.instance)
  }

  async initSocket (socket) {
    socket.on('connect', async (io) => {
      console.log('connect')
      store.state.title = '已连接'
      await socket.emit('joinRoom')
    })

    socket.on('initChatRoom', async (data) => {
      store.commit('chatroom/initChatRoom', data)
    })

    socket.on('getMsg', (data) => {
      const { msg } = data
      store.dispatch('chatroom/pushMsg', msg)
    })

    socket.on('getMoreMsgs', (data) => {
      const { msgs } = data
      if (msgs.length !== 0) {
        for (const msg of msgs) store.dispatch('chatroom/pushMsgBottom', msg)
      }
    })

    socket.on('joinNewRoom', (data) => {
      const { CID, roomAvatar, roomName, chatList } = data
      if (CID === undefined) {
        store.commit('tips', '加入失败, 已经加入房间或者CID不存在')
        return
      }
      store.commit('chatroom/joinRoom', {
        CID,
        roomAvatar,
        roomName,
        chatList
      })
      store.commit('tips', '加入成功')
    })

    socket.on('joinMyCreateRoomClient', (data) => {
      const { CID, roomAvatar, roomName, chatList } = data
      store.commit('chatroom/joinRoom', {
        CID,
        roomAvatar,
        roomName,
        chatList
      })
    })

    socket.on('leaveRoom', (data) => {
      store.commit('chatroom/leaveRoom', data)
    })

    socket.on('error', async (err) => {
      console.error(err.message)
      await socket.disconnect()
    })

    socket.on('disconnect', () => {
      store.state.title = '已断开连接'
      console.log('disconnect')
    })
  }

  async joinOneRoom (CID) {
    await this.instance.emit('joinOneRoom', {
      CID
    })
  }

  async joinMyCreateRoom (CID) {
    return await this.instance.emit('joinMyCreateRoom', {
      CID
    })
  }

  async sendMsg (CID, content) {
    return await this.instance.emit('sendMsg', {
      CID, content
    })
  }

  async leaveRoom (CID) {
    return await this.instance.emit('leaveRoom', { CID })
  }

  async getMoreMsg (CID, limit) {
    return await this.instance.emit('getMoreMsg', { CID, limit })
  }

  async quit () {
    await this.instance.disconnect()
  }

  install (app, options) {
    app.config.globalProperties.$socket = this
  }
}

export default new Socket()
