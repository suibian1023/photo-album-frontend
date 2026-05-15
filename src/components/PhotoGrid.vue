<template>
  <div class="photo-grid">
    <div class="toolbar">
      <div class="photo-count">共 {{ sortedPhotos.length }} 张照片</div>
      <el-select v-model="sortOrder" size="small" style="width: 120px" @change="handleSortChange">
        <el-option label="最新在上" value="desc" />
        <el-option label="最旧在上" value="asc" />
      </el-select>
    </div>

    <div v-loading="photoStore.loading" class="grid-container">
      <div v-if="sortedPhotos.length === 0" class="empty">暂无照片，点击上传吧~</div>
      <div v-else class="grid">
        <div v-for="photo in sortedPhotos" :key="photo.id" class="photo-card">
          <el-image
            :src="photo.url"
            fit="cover"
            lazy
            @click="previewPhoto(photo.url)"
          >
            <template #placeholder>
              <div class="image-skeleton">加载中...</div>
            </template>
            <template #error>
              <div class="image-error">加载失败</div>
            </template>
          </el-image>
          <div class="info">
            <div class="name">{{ photo.name }}</div>
            <div class="meta">
              <span class="date">{{ formatDate(photo.created_at) }}</span>
              <el-button type="danger" size="small" @click.stop="handleDelete(photo.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-image-viewer v-if="previewVisible" :url-list="[previewUrl]" @close="previewVisible = false" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { usePhotoStore } from '@/stores/photoStore'
import { useCategoryStore } from '@/stores/categoryStore'

const photoStore = usePhotoStore()
const categoryStore = useCategoryStore()

const sortOrder = ref('desc')

const rawPhotos = computed(() => photoStore.photos)

const sortedPhotos = computed(() => {
  const photosCopy = [...rawPhotos.value]
  if (sortOrder.value === 'desc') {
    return photosCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else {
    return photosCopy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const previewVisible = ref(false)
const previewUrl = ref('')

const previewPhoto = (url) => {
  previewUrl.value = url
  previewVisible.value = true
}

const handleDelete = async (photoId) => {
  try {
    await ElMessageBox.confirm('确定删除这张照片吗？', '提示', { type: 'warning' })
    const success = await photoStore.deletePhoto(photoId, categoryStore.currentCategoryId)
    if (success) {
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}

watch(
  () => categoryStore.currentCategoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      photoStore.fetchPhotos(newCategoryId)
    }
  },
  { immediate: true }
)

const handleSortChange = () => {}
</script>

<style scoped>
.photo-grid {
  padding: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* 照片卡片基础样式 */
.photo-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

/* 暗色模式卡片基础样式 */
[data-theme="dark"] .photo-card {
  background: rgba(37, 37, 39, 0.8);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 卡片悬浮效果 - 亮色模式 */
.photo-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.15);
  border-color: rgba(64, 158, 255, 0.3);
}

/* 卡片悬浮效果 - 暗色模式 */
[data-theme="dark"] .photo-card:hover {
  background: rgba(50, 50, 55, 0.9);
  box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.4);
  border-color: rgba(64, 158, 255, 0.4);
}

:deep(.el-image) {
  width: 100%;
  height: 200px;
  display: block;
  background: var(--bg-hover);
}

.image-skeleton {
  width: 100%;
  height: 200px;
  background: linear-gradient(110deg, rgba(240,240,240,0.6) 8%, rgba(224,224,224,0.8) 18%, rgba(240,240,240,0.6) 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.image-error {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 108, 108, 0.1);
  color: var(--danger-color);
}

.info {
  padding: 12px;
}

.name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.date {
  background: rgba(0,0,0,0.05);
  padding: 2px 8px;
  border-radius: 20px;
  backdrop-filter: blur(2px);
}

.empty {
  text-align: center;
  padding: 80px 20px;
  font-size: 1rem;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
  border-radius: 32px;
  margin: 40px;
}

@media (max-width: 768px) {
  .photo-grid {
    padding: 16px;
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  :deep(.el-image) {
    height: 140px;
  }
  .info {
    padding: 8px;
  }
  .name {
    font-size: 0.75rem;
  }
}
</style>