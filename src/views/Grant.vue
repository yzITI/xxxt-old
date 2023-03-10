<script setup>
import srpc from '../utils/srpc.js'
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()

srpc('https://a.aauth.link/aichat')

let value = $ref(0), users = $ref('')

if (!state.user?.token) router.push('/')

async function submit () {
  const us = users.trim().split('\n').map(x => x.trim())
  if (us.length * value > state.token) return Swal.fire('剩余点数不足', '', 'error')
  await srpc.grant(state.user?.token, us, value)
  state.token = state.token - us.length * value
  return Swal.fire('成功', '', 'success')
}
</script>

<template>
  <div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100 flex flex-col">
    <label class="block">Token:</label>
    <input type="number" class="block w-full" v-model="value">
    <label class="block">Users:</label>
    <textarea class="block w-full" rows="10" v-model="users"></textarea>
    <button @click="submit" class="bg-blue-500 text-white px-3 py-1 rounded all-transition shadow hover:shadow-md self-start">Submit</button>
  </div>
</template>