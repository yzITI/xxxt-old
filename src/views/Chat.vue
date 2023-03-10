<script setup>
import srpc from '../utils/srpc.js'
import { sendIn, setListener } from '../utils/iframe.js'
srpc('https://a.aauth.link/aichat')

let iframe = $ref(), loading = $ref(false)
const msgs = [{ role: 'system', content: '你是扬州中学的信息技术助教，简明回答同学的问题' }]

const html = '同学们可以在这里提问各种信息技术问题哦！'

setListener(async msg => {
  if (msg.ready) {
    sendIn({ slide: { data: { html } } }, iframe)
  }
  if (msg.response) {
    msgs.push({ role: 'user', content: msg.response })
    loading = true
    const res = await srpc.chat(msgs)
    loading = false
    const m = res.choices[0].message
    m.content = m.content.trim()
    msgs.push(m)
    sendIn({ message: m.content }, iframe)
  }
})
</script>

<template>
  <div class="w-full h-screen relative">
    <iframe class="w-full h-full" ref="iframe" src="https://s.yzzx.org/slide/#/plugins/chat?inverse=1" />
    <Transition name="fade">
      <div v-if="loading" class="absolute w-full h-20 bg-gray-100 bottom-0 left-0 flex items-center text-sm p-4">正在响应，请稍等......</div>
    </Transition>
  </div>
</template>
