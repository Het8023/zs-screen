import Cookies from 'js-cookie'

const KEY = 'acw_tc'

export function getCookie() {
  return Cookies.get(KEY)
}

export function setCookie(value) {
  Cookies.set(KEY, value)
}

export function removeCookie() {
  Cookies.remove(KEY)
}
