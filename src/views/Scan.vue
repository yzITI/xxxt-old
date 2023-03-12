<script setup>
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { ClipboardDocumentIcon } from '@heroicons/vue/24/solid'
const reader = new BrowserMultiFormatReader()
let device = $ref(true), video = $ref(), bg = $ref('bg-gray-800'), last = $ref(0)
let result = $ref({})

function addResult (r) {
  last = Date.now()
  if (result[r]) bg = 'bg-gray-700'
  else bg = 'bg-green-500'
  setTimeout(() => { if (last < Date.now() - 200) bg = 'bg-gray-800' }, 300)
  result[r] = 1
}

async function init () {
  try {
    const devices = await reader.listVideoInputDevices()
    device = null
    if (!devices?.length) return Swal.fire('Error', '没有摄像头', 'error')
    for (const d of devices) {
      if (d.label.match(/back/i) || d.label.match(/rear/i)) {
        device = d
        break
      }
    }
    if (!device) device = devices[devices.length - 1]
  } catch { device = null }
  if (!device) return Swal.fire('Error', '没有摄像头', 'error')
  reader.decodeFromVideoDevice(device.deviceId, video, (res, err) => {
    if (err && !(err instanceof NotFoundException)) {
      console.error(err)
      return Swal.fire('扫码错误', err, 'error')
    }
    if (!res) return
    addResult(res.text)
  })
}

init()

async function copy (text) {
  await navigator.clipboard.writeText(text)
  Swal.fire('已复制到剪切板', '', 'success')
}

async function complete () {
  const arr = Object.keys(result)
  if (!arr || !arr.length) return
  copy(arr.join('\n'))
}
</script>

<template>
  <div class="w-full h-screen relative all-transition flex items-center justify-center" :class="bg">
    <video ref="video"></video>
    <button class="absolute right-4 bottom-6 rounded-full py-2 px-4 font-bold text-xl text-white bg-blue-500 flex items-center all-transition shadow hover:shadow-md" @click="complete" title="copy to clipboard"><code class="mx-2">{{ Object.keys(result).length }}</code><ClipboardDocumentIcon class="w-6" /></button>
  </div>
</template>