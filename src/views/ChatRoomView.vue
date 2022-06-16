<template>
  <v-container class="room" style="padding-top: 0 !important">
    <div class="msg" ref="msg">
      <v-row class="end" v-for="(chatList, idx) in chatLists" :key="chatList.id">
        <v-col cols="12">
          <div v-if="(idx + 1 < chatLists.length && isLongTime(chatList.createdAt, chatLists[idx+1].createdAt)) || idx === chatLists.length - 1" class="msg_timing">{{ chatList.createdAt }}</div>

          <div class="tranp_bg msg txt_color" flat="false">
            <div :class="`${id === chatList.userId  ? 'reverse' : ''}`" class="mx-auto transition-swing" style="display: flex; width: 100%;padding: 24px 0">
              <div>
                <v-avatar :image="id === chatList.userId ? avatar : chatList.avatar"></v-avatar>
              </div>
              <div class="msg_txt" :style="`text-align: ${id === chatList.userId  ? 'end' : 'start'}`">
                <div class="msg_name">{{ id === chatList.userId ? userName : chatList.userName }}</div>
                <div>{{ chatList.content }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div>
      <v-row>
      <v-col cols="12" ref="input">
        <div class="input">
          <div class="msg_tip" v-show="toolTip">
            有新消息了
          </div>
          <div style="display: flex">
            <div class="input_msg">
              <v-text-field v-model="message" class="txt_color" clearable label="Message" type="text" variant="outlined" density="compact" rounded="true" hide-details="true">
              </v-text-field>
            </div>
            <div class="input_submit">
              <v-btn style="height: 100%" @click="sendMsg" rounded="true" density="default" color="primary">发送</v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChatRoomView',
  data () {
    return {
      CID: null,
      message: '',
      toolTip: false,
      scroll: null,
      topPending: false
    }
  },
  watch: {
    chatLists: {
      async handler (val, oldVal) {
      }
    }
  },
  computed: {
    ...mapState('user/', [
      'id',
      'userName',
      'userAccount',
      'avatar'
    ]),
    ...mapState('chatroom/', [
      'mapRooms', 'chatRooms'
    ]),
    chatLists () {
      if (this.CID === null) return []
      if (this.mapRooms.get(this.CID) === undefined) return []
      return this.mapRooms.get(this.CID).chatList
    }
  },
  async beforeRouteEnter (to, from, next) {
    await next(vm => {
      const { CID } = to.query
      if (CID === undefined) vm.$router.push('/chatList')
      vm.CID = CID
    })
  },
  methods: {
    async sendMsg () {
      await this.$socket.sendMsg(this.CID, this.message)
      this.message = ''
    },
    isLongTime (last, cur) {
      cur = new Date(cur).getTime()
      last = new Date(last).getTime()
      return Math.abs(cur - last) >= 1000 * 60 * 15
    },
    async isTop () {
      const msgDom = this.$refs.msg
      const scrollHeight = msgDom.scrollHeight
      const clientHeight = msgDom.clientHeight
      const scrollTop = msgDom.scrollTop

      if (Math.abs(scrollHeight - clientHeight + scrollTop) <= 1) {
        if (!this.topPending) await this.getMsg()
      }
    },
    async getMsg () {
      this.topPending = true
      await this.$socket.getMoreMsg(this.CID, 10)
      this.topPending = false
    }
  },
  created () {
  },
  mounted () {
  },
  activated () {
    const msgDom = this.$refs.msg
    msgDom.addEventListener('scroll', this.isTop)
  },
  deactivated () {
    const msgDom = this.$refs.msg
    msgDom.removeEventListener('scroll', this.isTop)
  }
}
</script>

<style scoped lang="scss">
.room {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.end {
  align-content: flex-end;
  width: 100%;
}

.msg {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column-reverse;
  overflow: scroll;
  width: 100%;
  height: 100%;
  align-items: center;
}

.left {
  padding-left: 10px;
}

.right {
  padding-right: 10px;
}

.msg_txt {
  padding: 10px;
  word-wrap: break-word;
  overflow: auto;
}

.msg_timing {
  text-align: center;
  color: #21ce79;
  font-size: x-small;
}

.reverse {
  flex-direction: row-reverse;
}

.input {
  // position: fixed;
  bottom: 10px;
  width: inherit;
  max-width: inherit;
}
.input_msg {
  margin-right: 5px;
  backdrop-filter: blur(6px);
  flex: 1;
}
.input_submit {
}

.msg_tip {
  position: absolute;
  transform: translate(-50%, 0);
  left: 50%;
  top: -100%;
  background: rgba(var(--v-theme-surface-variant),.7);
  color: rgb(var(--v-theme-on-surface-variant));
  border-radius: 4px;
  font-size: .875rem;
  line-height: 1.6;
  display: inline-block;
  padding: 5px 16px;
  text-transform: initial;
  width: auto;
  opacity: 1;
  pointer-events: none;
  transition-property: opacity,transform;
  transform-origin: left center;
}

.wrapper {
  overflow-y: scroll;
}
</style>
