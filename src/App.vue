<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useCategoryStore } from '@/stores/categoryStore'

const userStore = useUserStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  // 用户已登录但分类数据为空时，主动拉取分类（适用于页面刷新）
  if (userStore.isAuthenticated && categoryStore.categories.length === 0) {
    categoryStore.fetchCategories()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>