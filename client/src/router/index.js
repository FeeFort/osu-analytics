import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Profile.vue'),
    meta: { title: 'Profile' }
  },
  {
    path: '/compare',
    component: () => import('../views/CompareSetup.vue'),
    meta: { title: 'Compare Teams' }
  },
  {
    path: '/compare/:id',
    component: () => import('../views/CompareResults.vue'),
    meta: { title: 'Comparison Result' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Прокидываем title страницы в <title> документа
router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — MySite` : 'MySite'
})

export default router