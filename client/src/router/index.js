import { createRouter, createWebHistory } from 'vue-router';
import { getErrorState, isToastErrorCode } from '../error-config';

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
    const fromPath =
      typeof to.query.from === 'string' && to.query.from !== to.fullPath ? to.query.from : '/';
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

  const pageTitle = to.name === 'error' ? getErrorState(to.params.code).title : to.meta.title;

  document.title = pageTitle ? `${pageTitle} - MySite` : 'MySite';
});

export default router;
