import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',  // 代理后实际请求到 http://localhost:3000/api
  timeout: 10000
})

// 请求拦截器：自动添加 token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理错误和 401
request.interceptors.response.use(
  response => {
    // 直接返回 data，方便调用
    return response.data
  },
  error => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        // 跳转到登录页
        window.location.href = '/login'
      } else {
        ElMessage.error(data?.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查后端服务')
    }
    return Promise.reject(error)
  }
)

export default request