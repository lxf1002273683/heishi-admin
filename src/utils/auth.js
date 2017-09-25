import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Tokentime = 'tokentime'

// 在登录时获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setTokenTime(token) {
  return Cookies.set(Tokentime, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
