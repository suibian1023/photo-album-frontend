import { defineStore } from 'pinia'
import { getPhotos, uploadPhoto, deletePhoto } from '@/api/photo'
import { ElLoading } from 'element-plus'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [],
    loading: false
  }),
  actions: {
    async fetchPhotos(categoryId) {
      this.loading = true
      try {
        const res = await getPhotos(categoryId)
        if (res.code === 200) {
          this.photos = res.data
        }
      } finally {
        this.loading = false
      }
    },
    async uploadPhoto(file, categoryId, onProgress) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('categoryId', categoryId)

      // 可以配合 loading 或进度条
      const loading = ElLoading.service({ fullscreen: true, text: '上传中...' })
      try {
        const res = await uploadPhoto(formData)
        if (res.code === 200) {
          // 上传成功后刷新当前分类照片
          await this.fetchPhotos(categoryId)
          return true
        }
        return false
      } finally {
        loading.close()
      }
    },
    async deletePhoto(photoId, categoryId) {
      const res = await deletePhoto(photoId)
      if (res.code === 200) {
        // 刷新当前分类照片（注意可能照片属于当前分类，但也可以重新拉取）
        await this.fetchPhotos(categoryId)
        return true
      }
      return false
    },
    clearPhotos() {
      this.photos = []
    }
  }
})