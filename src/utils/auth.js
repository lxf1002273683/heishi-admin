import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Tokentime = 'tokentime'

// 在登录时获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// token 过期时间
export function getTokenTime() {
  return Cookies.get(Tokentime)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// token 过期时间
export function setTokenTime(token) {
  return Cookies.set(Tokentime, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
