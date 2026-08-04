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
    path: '/news',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'News' }
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

// ÐŸÑ€Ð¾ÐºÐ¸Ð´Ñ‹Ð²Ð°ÐµÐ¼ title ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ð² <title> Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°
router.beforeEach((to) => {
      document.title = to.meta.title ? `${to.meta.title} — MySite` : 'MySite'
})

export default router


