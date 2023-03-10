<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function login () {
  router.push('/login')
}
</script>

<template>
  <p>信息学堂首页（建设中）</p>
  <button @click="login">点击登录</button>
</template>