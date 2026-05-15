<template>
  <el-button circle @click="toggleTheme" :icon="isDark ? Sunny : Moon" class="theme-toggle" />
</template>

<script setup>
import { computed } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}
.theme-toggle:hover {
  transform: rotate(15deg);
  background: rgba(64, 158, 255, 0.3);
}
:deep(.el-icon) {
  font-size: 20px;
  color: var(--text-primary);
}
</style>