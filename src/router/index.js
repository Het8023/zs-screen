import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/BigScreenView'
    },
    {
      path: '/BigScreenView',
      name: 'BigScreenView',
      component: () => import('../views/BigScreenView.vue')
    }
  ]
})

export default router
