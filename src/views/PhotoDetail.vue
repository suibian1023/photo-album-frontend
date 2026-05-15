<template>
  <div class="photo-detail">
    <el-button @click="$router.back()">返回</el-button>
    <el-image :src="photoUrl" style="width: 100%; max-height: 80vh; object-fit: contain;" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePhotoStore } from '@/stores/photoStore'

const route = useRoute()
const photoStore = usePhotoStore()
const photoUrl = ref('')

onMounted(() => {
  const id = Number(route.params.id)
  const photo = photoStore.photos.find(p => p.id === id)
  if (photo) {
    photoUrl.value = photo.url
  }
})
</script>

<style scoped>
.photo-detail {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--bg-color), #0a0a0a);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.photo-detail .el-button {
  align-self: flex-start;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 40px;
}
:deep(.el-image) {
  border-radius: 32px;
  box-shadow: 0 20px 35px -10px rgba(0,0,0,0.3);
  background: #000;
}
</style>