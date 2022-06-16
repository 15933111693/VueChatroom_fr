<template>
  <div class="container">
    <v-list shaped class="tranp_bg txt_color" style="padding-top: 0;">
      <v-list-item-group>
        <template v-for="(chatRoom, idx) in chatRooms" :key="chatRoom.CID">
          <v-list-item :value="chatRoom" @click="$router.push('/chatRoom?CID=' + chatRoom.CID)">
            <template v-slot:default>
              <v-list-item-avatar style="margin-right: 10px;">
                <v-img :src="chatRoom.roomAvatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="chatRoom.roomName"></v-list-item-title>
                <v-list-item-subtitle v-text="chatRoom.chatList.length ? `${ id === chatRoom.chatList[0].userId ? userName : chatRoom.chatList[0].userName}: ${chatRoom.chatList[0].content}` : ''" style="min-height: 1rem"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>
           <v-divider v-if="idx != chatRooms.length - 1" color=""></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChatListView',
  data: () => ({
  }),
  computed: {
    ...mapState('chatroom/', [
      'chatRooms'
    ]),
    ...mapState('user/', [
      'id',
      'userName',
      'userAccount',
      'avatar'
    ])
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-image: $bg-color;
}
</style>
