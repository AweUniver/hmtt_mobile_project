// 此文件封装3个方法专门用于操作token
const key = 'geek-itheima'
export const setToken = (token) => {
  localStorage.setItem(key, token)
}

export const getToken = (token) => {
  localStorage.setItem(key, token)
}