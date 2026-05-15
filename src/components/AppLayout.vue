<template>
  <div class="app-layout">
    <el-container>
      <el-aside width="250px">
        <CategorySidebar />
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-toolbar">
            <span class="title">{{ currentCategory?.name || '相册' }}</span>
            <div class="header-actions">
              <el-button type="primary" @click="showUploadModal = true">
                <el-icon><Upload /></el-icon> 上传照片
              </el-button>
              <el-button @click="goToCategoryManage">
                <el-icon><Collection /></el-icon> 分类管理
              </el-button>
              <ThemeToggle />
              <el-button @click="handleLogout">
                <el-icon><SwitchButton /></el-icon> 退出
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main>
          <PhotoGrid />
        </el-main>
      </el-container>
    </el-container>
    <UploadModal v-model:visible="showUploadModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Collection, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { useCategoryStore } from '@/stores/categoryStore'
import CategorySidebar from './CategorySidebar.vue'
import PhotoGrid from './PhotoGrid.vue'
import UploadModal from './UploadModal.vue'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const showUploadModal = ref(false)
const currentCategory = computed(() => categoryStore.currentCategory)

const goToCategoryManage = () => {
  router.push('/categories')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  background: var(--bg-color);
}

.el-container {
  height: 100%;
}

/* 头部 - 毛玻璃效果 */
.el-header {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  z-index: 10;
}

[data-theme="dark"] .el-header {
  background: rgba(30, 30, 32, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.header-toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 1.4rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), #79bbff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* 全局按钮样式 - 毛玻璃透明背景，暗色模式适配 */
:deep(.el-button) {
  transition: all 0.2s ease;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: var(--text-primary);
}

[data-theme="dark"] :deep(.el-button) {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-regular);
}

:deep(.el-button:hover) {
  background: rgba(64, 158, 255, 0.2);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--primary-color), #66b1ff);
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #66b1ff, var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

[data-theme="dark"] :deep(.el-button--primary) {
  background: linear-gradient(135deg, #3a8ee6, #2d7bcb);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.el-main {
  background: var(--bg-color);
  padding: 0;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .el-header {
    padding: 0 16px;
  }
  .title {
    font-size: 1.1rem;
    display: none; /* 小屏幕隐藏标题，节省空间 */
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  :deep(.el-button span) {
    display: none; /* 只显示图标 */
  }
  :deep(.el-button .el-icon) {
    margin: 0;
  }
  :deep(.el-button) {
    padding: 8px 12px;
  }
}
</style>