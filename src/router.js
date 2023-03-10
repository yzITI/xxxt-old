import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/chat': () => import('./views/Chat.vue'),
  '/code-check': () => import('./views/CodeCheck.vue')
}

const routes = []
for (const r in index) routes.push({ path: r, component: index[r] })
const router = createRouter({ history: createWebHashHistory(), routes }) 

router.beforeEach(() => { NProgress.start() })
router.afterEach(() => {
  Swal.close()
  NProgress.done()
})

export default router