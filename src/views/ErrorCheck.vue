<script setup>
import srpc from '../utils/srpc.js'
import { LanguageIcon } from '@heroicons/vue/24/outline'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { micromark } from 'micromark'
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()
if (!state.user?.token) router.push('/')

srpc('https://a.aauth.link/aichat')

let input = $ref(), ready = $ref(false), loading = $ref(false), lang = $ref(''), html = $ref(''), pointUsed = $ref(0)

function checkReady () {
  const c = input.textContent
  ready = c.match(/\S/)
  html = ''
}

async function analyze () {
  if (!ready || loading) return
  loading = true
  const msgs = [{ role: 'system', content: 'Explain the error message and provide short solutions' + (lang ? ' in Chinese' : '') }, { role: 'user', content: input.textContent }]
  const res = await srpc.chat(state.user?.token, msgs)
  loading = false
  if (res.err) return Swal.fire('Error', res.err, 'error')
  const r = res.choices[0].message.content.trim()
  html = micromark(r)
  pointUsed = res.usage
  state.point = res.point
  if (typeof state.point !== 'number') state.point = Infinity
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col items-center bg-gray-800 p-4 sm:p-10 text-white relative">
    <button class="absolute right-4 top-4 flex items-center" @click="lang = lang ? '' : 'cn'"><LanguageIcon class="w-5 mr-2" />{{ lang ? '中文' : 'English' }}</button>
    <h1 class="font-bold text-3xl sm:text-5xl my-4">{{ lang ? '错误解释' : 'Error Explanation' }}</h1>
    <p class="mb-4">{{ lang ? '请将错误信息粘贴在下面的框中' : 'Please paste your error message in the box below' }}</p>
    <pre ref="input" @input="checkReady" contenteditable class="font-mono bg-white text-black opacity-80 p-2 sm:p-4 w-full text-sm block my-6 min-h-[30vh] overflow-auto"></pre>
    <button @click="analyze" v-if="!html" class="rounded-full p-3 absolute right-6 bottom-6 shadow-md all-transition hover:shadow-lg" :class="loading ? 'bg-yellow-500' : (ready ? 'bg-blue-500' : 'bg-gray-500')"><PlayIcon class="w-10" /></button>
    <div v-if="html" class="bg-white mt-4 p-4 text-black w-full md-content break-words overflow-auto" v-html="html"></div>
    <div v-if="html" class="bg-white text-xs font-mono w-full mb-4 text-gray-500 p-1">点数: 使用{{ pointUsed }}, 剩余{{ state.point }}</div>
  </div>
</template>

<style>
.md-content li * {
  display: inline;
}
.md-content li::before {
  display: inline;
  content: '-';
  margin-right: 3px;
}
.md-content pre {
  @apply bg-black text-white p-2 my-2 text-sm;
}
</style>
