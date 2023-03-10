<script setup>
import srpc from '../utils/srpc.js'
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()

srpc('https://a.aauth.link/aichat')

if (state.user?.token) init()
else router.push('/')

async function init () {
  state.token = await srpc.token(state.user?.token)
  if (typeof state.token !== 'number') state.token = Infinity
}

function goto (p) {
  if (state.token < 1) return Swal.fire('点数不足', '请联系管理员获得点数', 'error')
  router.push(p)
}

function showID () {
  Swal.fire({
    showConfirmButton: false,
    html: `
    <div class="flex flex-col items-center">
      <svg class="w-48 my-4" viewBox="0 0 18 18" fill="#000" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" version="1.1">${DATAMatrix({ msg: state.user.id, pad: 0 }).innerHTML}</svg>
      <p><code>${state.user.id}</code></p>
    </div>`
  })
}
</script>

<template>
  <div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
    <h1 class="font-bold text-3xl">你好，{{ state.user?.name || '' }}</h1>
    <p class="my-1 text-gray-500">欢迎来到信息学堂！（此页面建设中）</p>
    <p>剩余点数：<code>{{ state.token }}</code></p>
    <button class="m-2 bg-gray-300" @click="showID">我的ID</button>
    <button class="m-2 bg-gray-300" @click="goto('/chat')">AI助教</button>
    <button class="m-2 bg-gray-300" @click="goto('/code-check')">代码检查</button>
  </div>
  
</template>