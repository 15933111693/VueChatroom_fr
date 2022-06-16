<template>
  <v-avatar>
    <v-img :src="imageUrl ? imageUrl : src" cover>
      <input type="file" ref="avatar" style="opacity: 0;height: 100%">
    </v-img>
  </v-avatar>
</template>

<script>
export default {
  name: 'ChangeAvatar',
  props: {
    src: String
  },
  emits: {
    change: null
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted () {
    this.$refs.avatar.addEventListener('change', this.changeAvatar)
  },
  beforeUnmount () {
    this.$refs.avatar.removeEventListener('change', this.changeAvatar)
  },
  methods: {
    changeAvatar () {
      this.imageUrl = window.URL.createObjectURL(this.$refs.avatar.files[0])
      this.$emit('change', this.$refs.avatar.files[0])
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
