import ajax from '@/plugins/axios'
const { axios } = ajax

const loginApi = async (userAccount, userPwd) => {
  const res = await axios.post('/user/login', {
    userAccount, userPwd
  })
  return res
}

const registerApi = async (userAccount, userPwd) => {
  const res = await axios.post('/user/create', {
    userAccount, userPwd
  })
  return res
}

const modifyUserNameApi = async (userName) => {
  const res = await axios.post('/user/modifyUserName', {
    userName
  })
  return res
}

const modifyUserPwdApi = async (userPwd) => {
  const res = await axios.post('/user/modifyUserPwd', {
    userPwd
  })
  return res
}

const modifyUserAvatarApi = async (imgFile) => {
  const formDate = new FormData()
  formDate.append('image', imgFile)
  const res = await axios.post('/user/modifyUserAvatar', formDate)
  return res
}

export {
  loginApi, registerApi, modifyUserNameApi, modifyUserPwdApi, modifyUserAvatarApi
}
