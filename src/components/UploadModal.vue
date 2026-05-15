<template>
  <el-dialog title="上传照片" v-model="visible" width="500px" @close="handleClose">
    <el-form :model="form" label-width="80px">
      <el-form-item label="选择分类">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件">
        <!-- 添加 accept 属性，限制可选文件类型 -->
        <el-upload
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          :file-list="fileList"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              支持 jpg/png/gif/bmp，将自动转换为 WebP 格式，不超过10MB
              <!-- 显示转换状态 -->
              <span v-if="converting" style="color: #409eff;">正在转换格式，请稍后...</span>
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleUpload" :loading="uploading">上传</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import imageCompression from 'browser-image-compression' // 导入库
import { useCategoryStore } from '@/stores/categoryStore'
import { usePhotoStore } from '@/stores/photoStore'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const categoryStore = useCategoryStore()
const photoStore = usePhotoStore()

const categories = computed(() => categoryStore.categories)
const form = ref({ categoryId: null })
const fileList = ref([])
const uploading = ref(false)
const converting = ref(false) // 新增转换状态

// 保存转换后的 WebP 文件对象
const webpFile = ref(null)

// 文件选择变化时的处理函数（核心转换逻辑）
const handleFileChange = async (file) => {
  // 1. 基础校验
  const rawFile = file.raw
  if (!rawFile) return

  // 文件大小校验（10MB）
  if (rawFile.size > 10 * 1024 * 1024) {
    ElMessage.error('文件不能超过10MB')
    fileList.value = []
    return
  }

  // 2. 开始转换，显示提示
  converting.value = true
  ElMessage.info('正在优化图片格式为 WebP，请稍候...')

  try {
    // 3. 配置转换选项
    const options = {
      // 输出格式设为 WebP
      fileType: 'image/webp',
      // 控制输出质量 (0-1)，0.8 是比较好的平衡点
      quality: 0.8,
      // 限制图片最大宽度，可避免超大图片导致内存问题（可选）
      maxWidthOrHeight: 1920,
      // 开启 Web Worker，避免阻塞主线程
      useWebWorker: true,
    }

    // 执行压缩/转换
    const convertedBlob = await imageCompression(rawFile, options)

    // 4. 将转换后的 Blob 包装成 File 对象
    // 注意：originalname 最好还是用原文件名，后缀保持不变（前端展示用）
    const originalName = rawFile.name
    const webpFileName = originalName.substring(0, originalName.lastIndexOf('.')) + '.webp'
    webpFile.value = new File([convertedBlob], webpFileName, { type: 'image/webp' })

    // 5. 更新 UI 显示，告知用户转换成功
    ElMessage.success(`转换成功！文件从 ${(rawFile.size / 1024).toFixed(1)}KB 优化至 ${(convertedBlob.size / 1024).toFixed(1)}KB`)

    // 6. 更新 fileList，显示已处理的文件（用于 UI 展示）
    fileList.value = [{
      name: webpFileName,
      size: convertedBlob.size,
      // 可以生成预览 URL，供用户查看（可选）
      url: URL.createObjectURL(convertedBlob)
    }]

  } catch (error) {
    console.error('图片转换失败:', error)
    ElMessage.error('图片处理失败，请尝试其他图片或稍后再试。')
    fileList.value = []
    webpFile.value = null
  } finally {
    converting.value = false
  }
}

// 上传按钮逻辑
const handleUpload = async () => {
  if (!form.value.categoryId) {
    ElMessage.warning('请选择分类')
    return
  }
  if (!webpFile.value) {
    ElMessage.warning('请先选择并等待图片处理完成')
    return
  }
  
  uploading.value = true
  // 上传转换后的 WebP 文件
  const success = await photoStore.uploadPhoto(webpFile.value, form.value.categoryId)
  uploading.value = false
  
  if (success) {
    ElMessage.success('上传成功')
    visible.value = false
    resetForm()
  }
}

const resetForm = () => {
  form.value.categoryId = null
  fileList.value = []
  webpFile.value = null
  converting.value = false
}

const handleClose = () => {
  resetForm()
  emit('update:visible', false)
}

// 双向绑定
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
</script>

<style scoped>
/* 弹窗样式覆盖 – 使用毛玻璃 */
:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

[data-theme="dark"] :deep(.el-dialog) {
  background: rgba(30, 30, 35, 0.9);
  border-color: rgba(255, 255, 255, 0.08);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
  margin: 0;
}
:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 1.25rem;
  background: linear-gradient(135deg, var(--primary-color), #b3d8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
:deep(.el-dialog__body) {
  padding: 24px;
}
:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 上传区域美化 */
:deep(.el-upload-dragger) {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border: 2px dashed var(--border-color);
  border-radius: 24px;
  transition: all 0.2s;
}
:deep(.el-upload-dragger:hover) {
  background: rgba(64, 158, 255, 0.1);
  border-color: var(--primary-color);
}
:deep(.el-icon--upload) {
  font-size: 48px;
  color: var(--primary-color);
}
.el-upload__tip {
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: calc(100% - 32px) !important;
    margin: 16px !important;
    border-radius: 24px;
  }
  :deep(.el-dialog__body) {
    padding: 16px;
  }
}
</style>