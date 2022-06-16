<template>
  <v-container>
    <v-row>
      <v-card class="mx-auto tranp_bg txt_color" width="100%" elevation="23"
        :prepend-avatar="avatar">
        <template v-slot:title>
          {{ userName }}
        </template>
      </v-card>
    </v-row>
    <v-row style="margin-top: 20px;">
      <v-list class="tranp_bg txt_color" width="100%" shaped>
        <v-list-subheader>设置</v-list-subheader>
        <v-list-item v-for="(item, i) in items" :key="i" :value="item" @click="openDialog(item.value)">
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialogUsername" persistent>
        <v-card min-width="300">
          <v-card-title>
            <span class="text-h5">修改用户名</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="input.userName" :rules="[rules.userName]" :error-messages="errMsg.userName" label="用户名" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" text @click="cancel">
              取消
            </v-btn>
            <v-btn color="blue-darken-1" text @click="modifyUserName">
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialogPwd" persistent>
        <v-card min-width="300">
          <v-card-title>
            <span class="text-h5">修改密码</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="input.pwd" :rules="[rules.userPwd]" :error-messages="errMsg.pwd" label="密码" type="password"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="input.secondPwd" :rules="[rules.secondPwd]" :error-messages="errMsg.secondPwd" label="确认密码" type="password"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" text @click="cancel">
              取消
            </v-btn>
            <v-btn color="blue-darken-1" text @click="modifyUserPwd">
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialogAvatar" persistent>
        <v-card min-width="300">
          <v-card-title>
            <span class="text-h5">修改头像</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <ChangeAvatar :src="avatar" @change="getFile"/>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" text @click="cancel">
              取消
            </v-btn>
            <v-btn color="blue-darken-1" text @click="modifyUserAvatar" :disabled="input.file === null">
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { modifyUserNameApi, modifyUserPwdApi, modifyUserAvatarApi } from '@/api/user'
import { userName, userPwd } from '@/valid/user'
import ChangeAvatar from '@/components/ChangeAvatar.vue'

export default {
  name: 'AccountView',
  components: { ChangeAvatar },
  data () {
    return {
      items: [
        { text: '修改用户名', value: 'correctName' },
        { text: '修改密码', value: 'correctPwd' },
        { text: '修改头像', value: 'correctAvatar' }
      ],
      dialogUsername: false,
      dialogPwd: false,
      dialogAvatar: false,
      input: {
        userName: '',
        pwd: '',
        secondPwd: '',
        avatar: '',
        changeAvatar: false,
        file: null
      },
      rules: {
        userName,
        userPwd,
        secondPwd: (value) => {
          return (this.input.pwd === this.input.secondPwd && this.input.secondPwd !== '') || '两次密码输入不一致'
        }
      },
      errMsg: {
        account: '',
        pwd: '',
        secondPwd: ''
      }
    }
  },
  computed: {
    ...mapState('user/', [
      'id',
      'userName',
      'userAccount',
      'avatar',
      'createdAt',
      'updatedAt'
    ])
  },
  methods: {
    openDialog (value) {
      if (value === 'correctName') { this.dialogUsername = true }
      if (value === 'correctPwd') { this.dialogPwd = true }
      if (value === 'correctAvatar') { this.dialogAvatar = true }
    },
    cancel () {
      this.dialogAvatar = false
      this.dialogUsername = false
      this.dialogPwd = false
      // 清空errMsg
      for (const item in this.errMsg) { this.errMsg[item] = '' }
      for (const item in this.input) { this.input[item] = '' }
      this.input.file = null
    },
    async modifyUserName () {
      const validUserName = this.rules.userName(this.input.userName)
      this.errMsg.userName = validUserName === true ? '' : validUserName
      if (validUserName !== true) { return }
      const { state } = await modifyUserNameApi(this.input.userName)
      if (state) {
        this.$store.state.user.userName = this.input.userName
        const user = this.$get('user')
        user.userName = this.input.userName
        this.$set('user', user)
        this.input.userName = ''
        this.$store.commit('tips', '修改成功')
      } else {
        this.$store.commit('tips', '修改失败')
      }
      this.dialogUsername = false
    },
    async modifyUserPwd () {
      const validPwd = this.rules.userPwd(this.input.pwd)
      const validSecondPwd = this.rules.secondPwd(this.input.secondPwd)
      this.errMsg.pwd = validPwd === true ? '' : validPwd
      this.errMsg.secondPwd = validSecondPwd === true ? '' : validSecondPwd
      if (validPwd !== true || validSecondPwd !== true) { return }
      const { state } = await modifyUserPwdApi(this.input.pwd)
      if (state) {
        this.input.pwd = ''
        this.input.secondPwd = ''
        this.$store.commit('tips', '修改成功')
      } else {
        this.$store.commit('tips', '修改失败')
      }
      this.dialogPwd = false
    },
    async modifyUserAvatar () {
      console.log(this.input.file)
      const file = this.input.file
      const { data, state } = await modifyUserAvatarApi(file)
      if (state) {
        this.$store.state.user.avatar = data.avatar
        const user = this.$get('user')
        user.avatar = data.avatar
        this.$set('user', user)
        this.cancel()
        this.$store.commit('tips', '修改成功')
      } else {
        this.$store.commit('tips', '修改失败')
      }
    },
    getFile (file) {
      this.input.file = file
    }
  }
}
</script>

<style scss>
.v-img__img--contain {
  object-fit: fill;
}
.v-img {
  height: 100%;
}
</style>
