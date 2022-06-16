<template>
  <HelloWorld />
</template>

<script>
import { defineComponent } from 'vue'

// Components
import HelloWorld from '../components/HelloWorld.vue'
import socket from '@/plugins/socket'

export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld
  },
  created () {
    console.log(this.$socket === socket)
  }
})
</script>
