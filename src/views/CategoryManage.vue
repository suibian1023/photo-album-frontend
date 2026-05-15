<template>
  <div class="category-manage">
    <div class="page-header">
      <el-button link @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回相册
      </el-button>
      <h2 class="page-title">分类管理</h2>
      <el-button type="primary" @click="showAddDialog" class="add-btn">
        <el-icon><Plus /></el-icon> 新增分类
      </el-button>
    </div>

    <el-card class="category-card" shadow="never">
      <el-table :data="categories" style="width: 100%" class="category-table">
        <el-table-column prop="name" label="分类名称" min-width="150">
          <template #default="{ row }">
            <span class="category-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="photoCount" label="照片数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.photoCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="editCategory(row)" :icon="Edit">编辑</el-button>
            <el-button
              link
              type="danger"
              @click="deleteCategory(row)"
              :icon="Delete"
              :disabled="row.is_default === 1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="400px" class="category-dialog">
      <el-input
        v-model="form.name"
        placeholder="请输入分类名称"
        maxlength="20"
        show-word-limit
        @keyup.enter="submitForm"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/categoryStore'

const router = useRouter()
const categoryStore = useCategoryStore()

const categories = computed(() => categoryStore.categories)
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const form = ref({ id: null, name: '' })

onMounted(() => {
  categoryStore.fetchCategories()
})

const goBack = () => {
  router.push('/')
}

const showAddDialog = () => {
  dialogTitle.value = '新增分类'
  form.value = { id: null, name: '' }
  dialogVisible.value = true
}

const editCategory = (row) => {
  dialogTitle.value = '编辑分类'
  form.value = { id: row.id, name: row.name }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  let success
  if (form.value.id) {
    success = await categoryStore.updateCategory(form.value.id, form.value.name)
  } else {
    success = await categoryStore.addCategory(form.value.name)
  }
  if (success) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
  }
}

const deleteCategory = async (row) => {
  if (row.is_default === 1) {
    ElMessage.warning('默认分类不可删除')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确定删除分类「${row.name}」吗？该分类下的所有照片将移至「未分类」。`,
      '提示',
      { type: 'warning' }
    )
    const success = await categoryStore.deleteCategory(row.id)
    if (success) {
      ElMessage.success('删除成功')
    }
  } catch {
    // 取消
  }
}
</script>

<style scoped>
/* ========== 基础变量 & 亮色模式 ========== */
.category-manage {
  padding: 24px;
  background: var(--bg-color, #f5f7fa);
  min-height: 100vh;
}

/* 亮色模式下的卡片背景（毛玻璃） */
.category-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 亮色模式表格容器透明继承 */
.category-table {
  background: transparent !important;
}

/* 表头样式（亮色） */
.category-table .el-table__header th {
  background: rgba(64, 158, 255, 0.1) !important;
  backdrop-filter: blur(4px);
  color: var(--text-primary, #2c3e50);
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* 表格行 & 单元格（亮色） */
.category-table .el-table__row {
  background: transparent !important;
}
.category-table td {
  border-bottom-color: rgba(0, 0, 0, 0.06);
  color: var(--text-regular, #606266);
}
.category-table .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.05) !important;
}

/* 空状态 & 无数据区域背景透明 */
.category-table .el-table__empty-block {
  background: transparent !important;
}
.category-table .el-table__expanded-cell {
  background: transparent !important;
}

/* 分类名称 & 标签 */
.category-name {
  font-weight: 500;
  color: var(--text-primary, #2c3e50);
}
.el-tag--plain {
  background: rgba(64, 158, 255, 0.12);
  border: 1px solid rgba(64, 158, 255, 0.3);
  color: #409eff;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.back-btn {
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
}
.back-btn:hover {
  color: #409eff;
  transform: translateX(-2px);
}
.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff, #79bbff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}
.add-btn {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border: none;
  border-radius: 40px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.2s;
}
.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

/* ========== 弹窗样式（亮色） ========== */
:deep(.category-dialog .el-dialog) {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.15);
}
:deep(.category-dialog .el-dialog__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-right: 0;
  padding: 18px 20px;
}
:deep(.category-dialog .el-dialog__title) {
  font-weight: 600;
  color: #2c3e50;
}
:deep(.category-dialog .el-dialog__body) {
  padding: 24px 20px;
}
:deep(.category-dialog .el-dialog__footer) {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 20px;
}
/* 输入框亮色风格 */
:deep(.category-dialog .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}
:deep(.category-dialog .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff;
}
:deep(.category-dialog .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}
:deep(.category-dialog .el-input__inner) {
  color: #2c3e50;
}

/* ========== 暗色模式全面修复 ========== */
[data-theme="dark"] .category-manage {
  background: #1a1a1e;
}

[data-theme="dark"] .category-card {
  background: rgba(28, 28, 32, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

/* 表格暗色主题（全覆盖） */
[data-theme="dark"] .category-table {
  background: transparent !important;
}
[data-theme="dark"] .category-table .el-table__header th {
  background: rgba(45, 45, 50, 0.9) !important;
  backdrop-filter: blur(4px);
  color: #e5e9f0;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
[data-theme="dark"] .category-table td {
  border-bottom-color: rgba(255, 255, 255, 0.06);
  color: #d4d8e8;
}
[data-theme="dark"] .category-table .el-table__row {
  background: transparent !important;
}
[data-theme="dark"] .category-table .el-table__body tr:hover > td {
  background-color: rgba(65, 65, 75, 0.7) !important;
}
[data-theme="dark"] .category-table .el-table__empty-block {
  background: transparent !important;
}
[data-theme="dark"] .category-table .el-table__expanded-cell {
  background: transparent !important;
}
[data-theme="dark"] .category-table .cell {
  color: #e5e9f0;
}
/* 修复表格内部白色背景残留 */
[data-theme="dark"] .category-table .el-table__body,
[data-theme="dark"] .category-table .el-table__header,
[data-theme="dark"] .category-table .el-table__fixed,
[data-theme="dark"] .category-table .el-table__fixed-right {
  background: transparent !important;
}

/* 暗色分类名称 */
[data-theme="dark"] .category-name {
  color: #f0f3fa;
}
[data-theme="dark"] .el-tag--plain {
  background: rgba(64, 158, 255, 0.2);
  border: 1px solid rgba(64, 158, 255, 0.4);
  color: #79bbff;
}

/* 暗色页面头部元素 */
[data-theme="dark"] .back-btn {
  color: #b0b8c5;
}
[data-theme="dark"] .back-btn:hover {
  color: #79bbff;
}
[data-theme="dark"] .page-title {
  background: linear-gradient(135deg, #79bbff, #a0cfff);
  -webkit-background-clip: text;
  background-clip: text;
}
[data-theme="dark"] .add-btn {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

/* ========== 弹窗暗色完全重写 ========== */
[data-theme="dark"] :deep(.category-dialog .el-dialog) {
  background: rgba(28, 28, 32, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
}
[data-theme="dark"] :deep(.category-dialog .el-dialog__header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
[data-theme="dark"] :deep(.category-dialog .el-dialog__title) {
  color: #ecf0f5;
}
[data-theme="dark"] :deep(.category-dialog .el-dialog__body) {
  color: #e0e4ec;
}
[data-theme="dark"] :deep(.category-dialog .el-dialog__footer) {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
/* 输入框暗色样式 */
[data-theme="dark"] :deep(.category-dialog .el-input__wrapper) {
  background: rgba(20, 20, 24, 0.7);
  backdrop-filter: blur(4px);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12);
}
[data-theme="dark"] :deep(.category-dialog .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #79bbff;
}
[data-theme="dark"] :deep(.category-dialog .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #79bbff;
}
[data-theme="dark"] :deep(.category-dialog .el-input__inner) {
  color: #ecf0f5;
}
[data-theme="dark"] :deep(.category-dialog .el-input__count) {
  color: #9aa4bf;
}

/* 暗色模式下的按钮文字调整（弹窗底部） */
[data-theme="dark"] :deep(.category-dialog .el-button:not(.el-button--primary)) {
  background: rgba(45, 45, 50, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
  color: #e0e4ec;
}
[data-theme="dark"] :deep(.category-dialog .el-button:not(.el-button--primary):hover) {
  background: rgba(60, 60, 68, 0.9);
  border-color: rgba(255, 255, 255, 0.25);
}
[data-theme="dark"] :deep(.category-dialog .el-button--primary) {
  background: #409eff;
  border: none;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.25);
}

/* 额外修复: 确保卡片和表格之间没有白色间隙 */
[data-theme="dark"] .category-card .el-card__body {
  background: transparent !important;
  padding: 0 !important;
}
.category-card .el-card__body {
  background: transparent !important;
  padding: 0 !important;
}

/* 响应式保持不变 */
@media (max-width: 768px) {
  .category-manage {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  .page-title {
    text-align: center;
    order: -1;
  }
  .back-btn, .add-btn {
    justify-content: center;
  }
  .el-table__header th,
  .el-table td {
    font-size: 12px;
  }
}
</style>

<style>
/* 我根本不知道为什么会有这个bug，我真不会css，快气死我了，这里是修复表格的深色模式 */
[data-theme="dark"] .category-table .el-table__row:hover > td {
  background-color: rgba(60, 60, 70, 0.9) !important;
}

[data-theme="dark"] .category-table .el-table__row {
  background-color: transparent !important;
}

[data-theme="dark"] .category-table .el-table__body tr {
  background-color: transparent !important;
}

[data-theme="dark"] .category-table .el-table__cell {
  color: var(--text-primary) !important;
}

[data-theme="dark"] .category-table .el-table__row:hover .el-table__cell {
  color: #ffffff !important;
}

[data-theme="dark"] .category-table .el-table__header th {
  background-color: rgba(30, 30, 35, 0.95) !important;
  color: var(--text-primary) !important;
  border-bottom-color: var(--border-light) !important;
}
</style>