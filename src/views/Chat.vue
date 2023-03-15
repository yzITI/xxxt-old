<script setup>
import srpc from '../utils/srpc.js'
import { sendIn, setListener } from '../utils/iframe.js'
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()
if (!state.user?.token) router.push('/')
srpc('https://a.aauth.link/aichat')

let iframe = $ref(), loading = $ref(false)
const msgs = [{ role: 'system', content: '你是信息学堂AI助教，简短回答问题' }]

const html = '同学们可以在这里提问各种信息技术问题哦！'

setListener(async msg => {
  if (msg.ready) {
    sendIn({ slide: { data: { html } } }, iframe)
  }
  if (msg.response) {
    msgs.push({ role: 'user', content: msg.response })
    loading = true
    const res = await srpc.chat(state.user?.token, msgs)
    loading = false
    if (res.err) return Swal.fire('Error', res.err, 'error')
    const m = res.choices[0].message
    m.content = m.content.trim()
    msgs.push(m)
    sendIn({ message: m.content }, iframe)
    state.token = res.usage.left_tokens
    if (typeof state.token !== 'number') state.token = Infinity
  }
})
</script>

<template>
  <div class="w-full h-screen relative">
    <iframe class="w-full h-full" ref="iframe" src="https://s.yzzx.org/slide/#/plugins/chat?inverse=1" />
    <Transition name="fade">
      <div v-if="loading" class="absolute w-full h-20 bg-gray-100 bottom-0 left-0 flex items-center justify-between text-sm p-4">
        <div>正在响应，请稍等......</div>
        <div v-if="state.token" class="font-mono">点数剩余：{{ state.token }}</div>
      </div>
    </Transition>
  </div>
</template>
