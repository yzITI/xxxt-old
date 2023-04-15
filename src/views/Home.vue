<script setup>
import srpc from '../utils/srpc.js'
import state from '../state.js'
import { IdentificationIcon, TvIcon, ChatBubbleOvalLeftEllipsisIcon, CodeBracketIcon, WrenchScrewdriverIcon, CurrencyYenIcon, QrCodeIcon, AdjustmentsHorizontalIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
const router = useRouter()

srpc('https://a.aauth.link/aichat')

if (state.user?.token) init()
else router.push('/')

async function init () {
  state.point = 'Loading...'
  state.point = await srpc.point(state.user?.token)
  if (typeof state.point !== 'number') state.point = Infinity
}

function goto (p, requirePoint = false) {
  if (requirePoint && state.point < 1) return Swal.fire('点数不足', '请联系管理员获得点数', 'error')
  router.push(p)
}

function slide () {
  window.open('https://s.yzzx.org/slide/#/view/xxxt?name=' + state.user?.name)
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
    <p class="my-1 text-gray-500">欢迎来到信息学堂！您的点数剩余：<code>{{ state.point }}</code></p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
      <button @click="showID"><IdentificationIcon class="w-8 mr-2" />我的ID</button>
      <button @click="slide"><TvIcon class="w-8 mr-2" />课堂课件</button>
      <button @click="goto('/chat', true)"><ChatBubbleOvalLeftEllipsisIcon class="w-8 mr-2" />AI助教</button>
      <button @click="goto('/question', true)"><QuestionMarkCircleIcon class="w-8 mr-2" />通用答疑</button>
      <button @click="goto('/code-check', true)"><CodeBracketIcon class="w-8 mr-2" />代码检查</button>
      <button @click="goto('/error-check', true)"><WrenchScrewdriverIcon class="w-8 mr-2" />错误解释</button>
      <button @click="goto('/donate')"><CurrencyYenIcon class="w-8 mr-2" />支持一下</button>
      <button v-if="state.point > 100e3" @click="goto('/scan')"><QrCodeIcon class="w-8 mr-2" />扫一扫</button>
      <button v-if="state.point > 100e3" @click="goto('/grant')"><AdjustmentsHorizontalIcon class="w-8 mr-2" />点数分配</button>
    </div>
  </div>
</template>

<style scoped>
.grid button {
  transition: all 0.3s ease;
  @apply m-2 p-4 bg-gray-200 flex items-center font-bold text-gray-700 rounded hover:bg-gray-300;
}
</style>