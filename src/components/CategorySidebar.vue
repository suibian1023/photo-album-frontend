<template>
  <div class="category-sidebar">
    <div class="logo">我的相册</div>
    <el-menu :default-active="currentCategoryId" @select="handleSelect">
      <el-menu-item v-for="cat in categories" :key="cat.id" :index="String(cat.id)">
        <span>{{ cat.name }}</span>
        <span class="count">({{ cat.photoCount }})</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { usePhotoStore } from '@/stores/photoStore'

const categoryStore = useCategoryStore()
const photoStore = usePhotoStore()

const categories = computed(() => categoryStore.categories)
const currentCategoryId = computed(() => categoryStore.currentCategoryId)

const handleSelect = (index) => {
  const id = Number(index)
  categoryStore.setCurrentCategory(id)
  photoStore.fetchPhotos(id)
}
</script>

<style scoped>
.category-sidebar {
  height: 100%;
  background: rgba(245, 247, 250, 0.7);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

[data-theme="dark"] .category-sidebar {
  background: rgba(26, 26, 28, 0.8);
  border-right-color: rgba(255, 255, 255, 0.05);
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(120deg, var(--primary-color), #a0cfff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  letter-spacing: 1px;
}

/* 菜单项定制 */
:deep(.el-menu) {
  background: transparent;
  border-right: none;
}
:deep(.el-menu-item) {
  color: var(--text-regular);
  margin: 4px 12px;
  border-radius: 12px;
  transition: all 0.2s;
}
:deep(.el-menu-item:hover) {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}
:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(100, 180, 255, 0.1));
  color: var(--primary-color);
  font-weight: 500;
  backdrop-filter: blur(4px);
}
.count {
  float: right;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.05);
  padding: 0 6px;
  border-radius: 20px;
  line-height: 20px;
}

/* 移动端：侧边栏固定宽度，但内容区可滚动 */
@media (max-width: 768px) {
  .category-sidebar {
    width: 100% !important;
    height: auto;
    backdrop-filter: blur(16px);
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.2);
  }
  .logo {
    height: 48px;
    line-height: 48px;
    font-size: 1rem;
  }
  :deep(.el-menu) {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding: 8px 12px;
  }
  :deep(.el-menu-item) {
    display: inline-block;
    margin: 0 4px;
  }
}
</style>