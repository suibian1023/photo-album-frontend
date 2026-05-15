import { defineStore } from 'pinia'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    currentCategoryId: null
  }),
  getters: {
    currentCategory: (state) => state.categories.find(c => c.id === state.currentCategoryId)
  },
  actions: {
    async fetchCategories() {
      const res = await getCategories()
      if (res.code === 200) {
        this.categories = res.data
        // 如果没有当前选中的分类，默认选中第一个（通常是默认分类）
        if (!this.currentCategoryId && this.categories.length > 0) {
          this.currentCategoryId = this.categories[0].id
        }
      }
    },
    async addCategory(name) {
      const res = await addCategory(name)
      if (res.code === 200) {
        await this.fetchCategories() // 刷新列表
        return true
      }
      return false
    },
    async updateCategory(id, name) {
      const res = await updateCategory(id, name)
      if (res.code === 200) {
        await this.fetchCategories()
        return true
      }
      return false
    },
    async deleteCategory(id) {
      const res = await deleteCategory(id)
      if (res.code === 200) {
        await this.fetchCategories()
        // 如果删除的是当前选中的分类，切换到第一个分类
        if (this.currentCategoryId === id) {
          this.currentCategoryId = this.categories[0]?.id || null
        }
        return true
      }
      return false
    },
    setCurrentCategory(id) {
      this.currentCategoryId = id
    }
  }
})