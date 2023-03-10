import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/home': () => import('./views/Home.vue'),
  '/login': () => import('./views/Login.vue'),
  '/grant': () => import('./views/Grant.vue'),
  '/chat': () => import('./views/Chat.vue'),
  '/code-check': () => import('./views/CodeCheck.vue'),
  '/:any(.*)*': () => import('./views/Cover.vue')
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