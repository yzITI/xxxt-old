import { reactive } from 'vue'

export const SS = window.sessionStorage

export const state = reactive({
  user: SS.user ? JSON.parse(SS.user) : null,
  point: 0
})

export default state
