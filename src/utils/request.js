import axios from 'axios'
import { getCookie } from '@/utils/auth'
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getCookie()
    // console.log('token', token)
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
