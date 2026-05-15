import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { removeToken, setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(credentials) {
      const res = await login(credentials.username, credentials.password)
      if (res.code === 200) {
        this.token = res.data.token
        this.userInfo = res.data.user
        setToken(res.data.token)
        return true
      }
      return false
    },
    logout() {
      this.token = ''
      this.userInfo = null
      removeToken()
      // 重置其他 store 的数据（可选）
    }
  }
})