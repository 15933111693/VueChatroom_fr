import ajax from '@/plugins/axios'
const { axios } = ajax

const createRoomApi = async (roomName, roomAvatar) => {
  const formData = new FormData()
  formData.append('roomName', roomName)
  if (roomAvatar) formData.append('image', roomAvatar)
  const res = await axios.post('/chatroom/create', formData)
  return res
}

const getMsgListApi = async (limit, offset, CID) => {
  const res = await axios.post('/chatroom/getMsgList', {
    limit, offset, CID
  })
  return res
}

export {
  createRoomApi, getMsgListApi
}
