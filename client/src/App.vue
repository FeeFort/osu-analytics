<!-- Main App, this comment only for test Lint CI/CD workflow -->
<script setup>
import SidebarMain from 'primevue/sidebarmain';
import SidebarLayout from 'primevue/sidebarlayout';
import Toast from 'primevue/toast';
import { computed, nextTick, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import { getErrorState, isPageErrorCode, isStandaloneErrorCode } from './error-config';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppUserMenu from './components/layout/AppUserMenu.vue';

const router = useRouter();
const route = useRoute();
const isErrorRoute = computed(() => route.meta.isErrorPage === true);
const shouldUseFullPageError = computed(() => isErrorRoute.value && isStandaloneErrorCode(route.params.code));
const toast = useToast();
const handledToastKey = ref('');

async function showRouteToast(code) {
  const toastState = getErrorState(code);
  await nextTick();
  toast.removeGroup('app-errors');
  toast.add({
    group: 'app-errors',
    severity: toastState.severity,
    summary: toastState.title,
    detail: toastState.text,
    life: toastState.life
  });
}

function clearToastQuery() {
  const nextQuery = { ...route.query };
  delete nextQuery.errorToast;
  router.replace({ path: route.path, query: nextQuery, hash: route.hash });
}

watch(
  () => route.query.errorToast,
  async (errorToast) => {
    const code = typeof errorToast === 'string' ? errorToast : '';
    const toastKey = `${route.fullPath}::${code}`;

    if (!code || handledToastKey.value === toastKey || isPageErrorCode(code)) return;

    handledToastKey.value = toastKey;
    await showRouteToast(code);
    clearToastQuery();
  },
  { immediate: true }
);
</script>

<template>
  <Toast group="app-errors" position="top-right" class="app-toast" />

  <main v-if="shouldUseFullPageError" class="app-page-content app-page-content--error">
    <router-view />
  </main>

  <div v-else class="app-theme-shell app-theme-surface border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
    <SidebarLayout class="app-shell-layout min-h-192! relative!">
      <AppSidebar>
        <template #user-menu><AppUserMenu /></template>
      </AppSidebar>
      <SidebarMain class="app-theme-surface">
        <main class="app-page-content">
          <router-view />
        </main>
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>
