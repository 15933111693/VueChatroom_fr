<template>
  <v-container class="container">
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field v-model="account" :rules="[rules.userAccount]" :error-messages="errMsg.account" class="label" variant="plain" label="用户名" :color="input.color"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field v-model="pwd" :rules="[rules.userPwd]" :error-messages="errMsg.pwd" class="label" variant="plain" label="密码" type="password" :color="input.color"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" block @click="login">登录</v-btn>
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" block @click="$router.push('/register')">注册</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { loginApi } from '@/api/user'
import { mapMutations } from 'vuex'
import { userAccount, userPwd } from '@/valid/user'

export default {
  name: 'LoginView',
  data () {
    return {
      input: {
        color: 'white',
        bgColor: 'white'
      },
      // 用户
      account: '',
      pwd: '',

      rules: {
        userAccount, userPwd
      },

      errMsg: {
        account: '',
        pwd: ''
      }
    }
  },
  methods: {
    ...mapMutations('user/', ['userInit']),
    async login () {
      const validAccount = this.rules.userAccount(this.account)
      const validPwd = this.rules.userPwd(this.pwd)
      this.errMsg.account = validAccount === true ? '' : validAccount
      this.errMsg.pwd = validPwd === true ? '' : validPwd

      if (validAccount !== true || validPwd !== true) return
      const { data, state, msg } = await loginApi(this.account, this.pwd)
      if (state) {
        this.$set('user', data)
        this.$store.commit('user/userInit', data)
        await this.$socket.createNewInstance(this.$get('token'))
        this.$router.push('/chatList')
      } else {
        this.$store.commit('tips', '登录失败 ' + msg)
        this.$clear()
      }
    }
  }
}
</script>

<style lang='scss'>
.container {
  background-image: $bg_color;
  width: 100%;
  height: 100%;
}
.label {
  color: $login_text;
}
</style>
