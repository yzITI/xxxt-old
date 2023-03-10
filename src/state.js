import { reactive } from 'vue'

export const SS = window.sessionStorage

export const state = reactive({
  user: SS.user ? JSON.parse(SS.user) : null,
  token: 0 // this is the token of aichat!
})

export default state
