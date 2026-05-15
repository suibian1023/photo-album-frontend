import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

// 导入全局样式（必须放在 Element Plus 样式之后，确保变量覆盖）
import './assets/base.css'
import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化主题（必须在 pinia 使用后）
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')