<script setup>
import srpc from '../utils/srpc.js'
import state from '../state.js'
import { useRouter } from 'vue-router'
const router = useRouter()

srpc('https://a.aauth.link/aichat')

let value = $ref(0), users = $ref(''), loading = $ref(false)

if (!state.user?.token) router.push('/')

let cot = $computed(() => users.match(/\S/) ? users.trim().split('\n').length : 0)

async function submit () {
  const us = users.trim().split('\n').map(x => x.trim())
  if (us.length * value > state.point) return Swal.fire('剩余点数不足', '', 'error')
  loading = true
  await srpc.grant(state.user?.token, us, value)
  loading = false
  state.point = state.point - us.length * value
  return Swal.fire('成功', '', 'success')
}

async function del () {
  const us = users.trim().split('\n').map(x => x.trim())
  loading = true
  await srpc.del(state.user?.token, us)
  loading = false
  return Swal.fire('成功', '', 'success')
}
</script>

<template>
  <div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100 flex flex-col">
    <h1 class="text-3xl font-bold my-2">点数分配</h1>
    <p>您的点数剩余：<code>{{ state.point }}</code></p>
    <label class="block my-2">分配点数数值: <input type="number" class="border px-2 py-1 font-mono" v-model="value"></label>
    <label class="block mt-2">用户id:</label>
    <textarea class="block w-full p-2 my-1" placeholder="一行一个用户id" rows="10" v-model="users"></textarea>
    <p class="text-sm">共计分配点数：<code>{{ value }} * {{ cot }} = {{ value * cot }}</code></p>
    <p v-if="loading" class="m-4">Loading...</p>
    <div class="flex items-center" v-else>
      <button @click="submit" class="bg-blue-500 text-white px-3 py-1 m-4 rounded all-transition shadow hover:shadow-md self-start font-bold">分配点数</button>
      <button @click="del" v-if="state.user?.id === 'root'" class="bg-red-500 text-white px-3 py-1 m-4 rounded all-transition shadow hover:shadow-md self-start font-bold">清空点数</button>
    </div>
  </div>
</template>