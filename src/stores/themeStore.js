import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 从 localStorage 读取，默认为 'light'
    theme: localStorage.getItem('theme') || 'light'
  }),
  getters: {
    isDark: (state) => state.theme === 'dark'
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      this.applyTheme()
    },
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme()
    },
    // 应用主题到 html 根元素
    applyTheme() {
      const htmlElement = document.documentElement
      if (this.theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark')
      } else {
        htmlElement.removeAttribute('data-theme')
      }
    },
    // 初始化（从 localStorage 恢复）
    initTheme() {
      this.applyTheme()
    }
  }
})