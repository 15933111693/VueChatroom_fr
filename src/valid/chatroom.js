const reg = require('./reg')

export const roomName = (value) => reg.chatRoomName(value) || '房间名称格式错误, 请输入1到10位任意字符'
export const content = (value) => reg.chatContent(value) || '对话不能超过50个字'
export const CID = (value) => reg.CID(value) || 'CID格式错误'
