<template>
  <v-app>
    <!-- bar -->
    <v-app-bar v-if="!barExclude.has($route.path)" @click="menuBtn = false">
      <template v-slot:image>
        <v-img class="bg_color"></v-img>
      </template>

      <template v-slot:prepend>
        <v-app-bar-nav-icon class="txt_color" v-if="navInclude.has($route.path) && !search" @click="drawer = !drawer">
        </v-app-bar-nav-icon>
        <v-btn v-if="!backExclude.has($route.path) || search" @click="back" icon>
          <v-icon class="txt_color">mdi-arrow-left</v-icon>
        </v-btn>
      </template>

      <!-- title -->
      <v-app-bar-title class="txt_color">
        <div v-if="titleInclude.has($route.path) && !search">{{ $store.state.title }}</div>
        <div v-if="search" class="search_input">
          <v-text-field variant="plain" autofocus="true"></v-text-field>
        </div>
      </v-app-bar-title>
      <!-- <v-spacer></v-spacer> -->

      <v-btn v-if="searchInclude.has($route.path) && !search" @click="search = true" icon>
        <v-icon class="txt_color">mdi-magnify</v-icon>
      </v-btn>
      <v-menu v-if="verticalInclude.has($route.path) && !search" :model-value="menuBtn" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" @click="menuBtn = true" icon>
            <v-icon class="txt_color">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="left">
          <v-list-item v-for="(item, index) in menuList" :key="index" @click="menuClick(item.value)"
            :value="item.value">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 抽屉 -->
    <v-navigation-drawer class="bg_color txt_color" v-model="drawer" temporary>
      <v-list-item @click="$router.push('/account')" :prepend-avatar="avatar"
        :title="userName"></v-list-item>

      <v-divider></v-divider>

      <v-list class="txt_color tranp_bg" density="compact" nav>
        <v-list-item prepend-icon="mdi-account-multiple-plus" title="新建群" @click="createGroupDialog = true"></v-list-item>
        <v-list-item prepend-icon="mdi-account-plus" title="加入群" @click="joinNewRoomDialog = true"></v-list-item>
        <v-list-item prepend-icon="mdi-exit-to-app" title="退出账户" @click="quitAccountDialog = true"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 退群dialog -->
    <v-dialog v-model="quitGroupDialog">
      <v-card>
        <v-card-text>你想要退出群吗?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="quitRoom">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 建新群dialog -->
    <v-dialog v-model="createGroupDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card class="bg_color txt_color">
        <v-toolbar dark elevation="5" class="bg_color txt_color">
          <v-btn icon dark @click="createGroupDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>新建群</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="buildNewGroup">
              建立
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container>
          <v-row class="text-center">
            <v-col cols="12" sm="6" md="3">
              <ChangeAvatar :src="createGroupAvatar" @change="getFile"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="createGroupInput" :rules="[rules.roomName]" :error-messages="errMsg.roomName" label="群名称" variant="underlined" clearable></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- 加入群dialog -->
    <v-dialog v-model="joinNewRoomDialog">
      <v-card width="300">
        <v-card-text>
            <v-text-field v-model="joinNewRoomCID" :rules="[rules.CID]" :error-messages="errMsg.joinNewRoom" class="label" variant="outlined" label="CID"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="joinNewRoomClick">
            加入
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 退出账号dialog -->
    <v-dialog v-model="quitAccountDialog">
      <v-card width="300">
        <v-card-text>
          <v-row justify="center"><div>你想要退出账号吗?</div></v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="quit">
            是
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 提示 -->
    <v-snackbar
      v-model="snackbar"
    >
      <v-row justify="center">
        <div v-html="tips"></div>
      </v-row>
    </v-snackbar>

    <v-main class="bg_color" @click="initComponent">
      <transition name="scroll-x-transition">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <Component :is="Component" />
          </keep-alive>
        </router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { roomName, CID } from './valid/chatroom'
import { createRoomApi } from '@/api/chatroom'
import ChangeAvatar from '@/components/ChangeAvatar.vue'

const barExclude = ['/login', '/register', '/']
const backExclude = ['/chatList']
const navInclude = ['/chatList']
const titleInclude = ['/chatList']
// const searchInclude = ['/chatList']
const searchInclude = []
const verticalInclude = ['/chatRoom']

const baseUrl = process.env.VUE_APP_BASE_URL
export default {
  name: 'App',
  components: { ChangeAvatar },
  data: () => ({
    barExclude: new Set(barExclude),
    backExclude: new Set(backExclude),
    navInclude: new Set(navInclude),
    titleInclude: new Set(titleInclude),
    searchInclude: new Set(searchInclude),
    verticalInclude: new Set(verticalInclude),
    // 搜索模式
    search: false,
    // 抽屉
    drawer: false,
    // chatroom右菜单
    menuList: [
      // { title: '查找', value: 'search' },
      { title: '退出群', value: 'leave' }
    ],
    menuBtn: false,
    // 对话框
    // 退出群dialog
    quitGroupDialog: false,
    // 创建群dialog
    createGroupDialog: false,
    createGroupInput: '',
    createGroupAvatar: baseUrl + '/images/default.jpg',
    createGroupFile: null,
    // 加入群dialog
    joinNewRoomDialog: false,
    joinNewRoomCID: '',
    // 退出账号dialog
    quitAccountDialog: false,
    rules: {
      roomName,
      CID
    },
    errMsg: {
      roomName: '',
      joinNewRoom: ''
    }
  }),
  computed: {
    ...mapState('user/', [
      'id',
      'userName',
      'userAccount',
      'avatar',
      'createdAt',
      'updatedAt'
    ]),
    ...mapState([
      'tips',
      'snackbar'
    ])
  },
  watch: {
    $route: {
      handler (to, from) {
        this.initComponent()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initComponent () {
      this.quitGroupDialog = false
      this.menuBtn = false
      this.drawer = false
      this.search = false
    },
    back () {
      if (this.search) { this.search = false } else { this.$router.back() }
    },
    async menuClick (value) {
      if (value === 'search') { this.search = true }
      if (value === 'leave') { this.quitGroupDialog = true }
      this.menuBtn = false
    },
    async buildNewGroup () {
      const validRoomName = this.rules.roomName(this.createGroupInput)
      this.errMsg.roomName = validRoomName === true ? '' : validRoomName
      if (validRoomName !== true) { return }
      const { data, state } = await createRoomApi(this.createGroupInput, this.createGroupFile)
      if (state) {
        const { CID } = data
        // 这个api一定要在https协议下或者localhost地址使用
        await navigator.clipboard.writeText(CID)
        this.$socket.joinMyCreateRoom(CID)
        this.$store.commit('tips', `群号 <span style="color: red;">${CID}</span> 已复制到粘贴板`)
        this.drawer = false
        this.createGroupInput = ''
        this.createGroupDialog = false
      }
    },
    getFile (file) {
      this.createGroupFile = file
    },
    async quitRoom () {
      await this.$socket.leaveRoom(this.$route.query.CID)
      this.$store.commit('chatroom/leaveRoom', { CID: this.$route.query.CID })
      this.quitGroupDialog = false
      this.$store.commit('tips', '退出成功')
      this.drawer = false
      this.$router.back()
    },
    async joinNewRoomClick () {
      const validCID = this.rules.CID(this.joinNewRoomCID)
      this.errMsg.joinNewRoom = validCID === true ? '' : validCID
      if (validCID !== true) { return }
      await this.$socket.joinOneRoom(this.joinNewRoomCID)
      this.joinNewRoomCID = ''
      this.drawer = false
      this.joinNewRoomDialog = false
    },
    async quit () {
      this.$store.commit('user/quit')
      this.$store.commit('chatroom/clear')
      this.quitAccountDialog = false
      await this.$socket.quit()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
* {
  // outline: 1px solid;
}

::-webkit-scrollbar {
  width: 0 !important;
  display: none !important;
}

.search_input {
  padding-top: 28px;
}

.left {
  left: -20px !important;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .2s ease-in-out;
}

.v-img__img--contain {
  object-fit: fill;
}
.v-img {
  height: 100%;
}
</style>
