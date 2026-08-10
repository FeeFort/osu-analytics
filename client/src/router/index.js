import { createRouter, createWebHistory } from 'vue-router';
import { getErrorState, isToastErrorCode } from '../error-config';
import { useAuth } from '../composables/useAuth.js';

const routes = [
  {
    path: '/',
    component: () => import('../views/Profile.vue'),
    meta: { title: 'Profile' }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { adminOnly: true },
    children: [
      { path: '', redirect: '/admin/badges' },
      { path: 'badges', component: () => import('../views/admin/AdminBadges.vue') },
      { path: 'news', component: () => import('../views/admin/AdminNews.vue') },
      { path: 'users', component: () => import('../views/admin/AdminUsers.vue') }
    ]
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
    redirect: {
      name: 'error',
      params: { code: '404' },
      query: { from: '/news' }
    }
  },
  {
    path: '/error/:code(400|401|403|404|408|429|500|502|503|504)',
    name: 'error',
    component: () => import('../views/ErrorPage.vue'),
    meta: { title: 'Error', isErrorPage: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => ({
      name: 'error',
      params: { code: '404' },
      query: { from: to.fullPath }
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  if (to.name === 'error' && isToastErrorCode(to.params.code)) {
    const fromPath = typeof to.query.from === 'string' && to.query.from !== to.fullPath ? to.query.from : '/';
    const resolved = router.resolve(fromPath);

    return {
      path: resolved.path,
      query: {
        ...resolved.query,
        errorToast: String(to.params.code)
      },
      hash: resolved.hash
    };
  }
  if (to.meta.adminOnly) {
    const { isAdmin } = useAuth()
    if (!isAdmin.value) {
      return { name: 'error', params: { code: '403' }, query: { from: to.fullPath } }
    }
  }

  const pageTitle = to.name === 'error' ? getErrorState(to.params.code).title : to.meta.title;

  document.title = pageTitle ? `${pageTitle} - MySite` : 'MySite';
});

export default router;
