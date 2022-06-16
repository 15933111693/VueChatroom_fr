const reg = require('./reg')

export const userAccount = (value) => reg.account.test(value) || '账号格式错误, 请输入6到20位数字或字母组合'
export const userPwd = (value) => reg.password.test(value) || '密码格式错误, 请输入6到8位数字或字母组合'
export const userName = (value) => reg.userName.test(value) || '用户名格式错误, 请输入3到15个字符，只能包含小写字符，数字或特殊符号“ _-”'
