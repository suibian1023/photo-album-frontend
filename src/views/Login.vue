<template>
  <div class="login-container">
    <div class="login-card">
      <h2>相册登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="register-link">
        没有账号？ <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
      </div>
      <div class="demo-hint">测试账号: test / test123</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { useCategoryStore } from '@/stores/categoryStore'

const router = useRouter()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const formRef = ref(null)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const success = await userStore.login(form)
      loading.value = false
      if (success) {
        ElMessage.success('登录成功')
        await categoryStore.fetchCategories()
        router.push('/')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}
.login-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.login-card {
  width: 400px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 32px 24px;
  z-index: 1;
}
.login-card h2 {
  text-align: center;
  margin-bottom: 28px;
  font-size: 28px;
  background: linear-gradient(120deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
:deep(.el-form-item__label) {
  color: rgba(255,255,255,0.9);
  font-weight: 500;
}
:deep(.el-input__wrapper) {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 16px;
}
:deep(.el-input__inner) {
  color: #fff;
}
:deep(.el-input__inner::placeholder) {
  color: rgba(255,255,255,0.6);
}
.login-card .el-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 40px;
  height: 44px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 16px;
}
.login-card .el-button:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(102,126,234,0.4);
}
.register-link {
  text-align: center;
  margin-top: 20px;
  color: rgba(255,255,255,0.8);
}
.register-link .el-link {
  font-size: 14px;
}
.demo-hint {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.2);
  padding: 8px 12px;
  border-radius: 40px;
  backdrop-filter: blur(4px);
}
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    padding: 24px 20px;
  }
  .login-card h2 {
    font-size: 24px;
  }
}
</style>