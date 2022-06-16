<template>
  <v-container class="container">
    <v-row class="text-center">
      <v-col cols="12" class="title">注册</v-col>
      <v-col cols="12">
        <v-text-field v-model="account" :rules="[rules.userAccount]" :error-messages="errMsg.account" class="label" variant="plain" label="用户名" :color="input.color"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field v-model="pwd" :rules="[rules.userPwd]" :error-messages="errMsg.pwd" class="label" variant="plain" label="密码" type="password" :color="input.color"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field v-model="secondPwd" :rules="[rules.secondPwd]" :error-messages="errMsg.secondPwd" class="label" variant="plain" label="确认密码" type="password" :color="input.color"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-btn @click="register" color="primary" block>注册</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { userAccount, userPwd } from '@/valid/user'
import { registerApi } from '@/api/user'

export default {
  name: 'RegisterView',
  data () {
    return {
      input: {
        color: 'white',
        bgColor: 'white'
      },
      account: '',
      pwd: '',
      secondPwd: '',
      rules: {
        userAccount,
        userPwd,
        secondPwd: (value) => {
          return (this.pwd === this.secondPwd && this.secondPwd !== '') || '两次密码输入不一致'
        }
      },
      errMsg: {
        account: '',
        pwd: '',
        secondPwd: ''
      }
    }
  },
  methods: {
    async register () {
      const validAccount = this.rules.userAccount(this.account)
      const validPwd = this.rules.userPwd(this.pwd)
      const validSecondPwd = this.rules.secondPwd()
      this.errMsg.account = validAccount === true ? '' : validAccount
      this.errMsg.pwd = validPwd === true ? '' : validPwd
      this.errMsg.secondPwd = validSecondPwd === true ? '' : validSecondPwd

      if (validAccount !== true || validPwd !== true || validSecondPwd !== true) return
      const { state, msg } = await registerApi(this.account, this.pwd)
      if (state) {
        this.$store.commit('tips', '注册成功')
        this.$router.push('/login')
      } else {
        this.$store.commit('tips', '注册失败 ' + msg)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  background-image: $bg_color;
  width: 100%;
  height: 100%;
}
.title {
  color: $login_text;
  font-size: 30px;
}
.label {
  color: $login_text;
}
</style>
