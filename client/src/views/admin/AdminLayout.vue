<template>
  <div class="app-theme-shell app-theme-surface border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
    <SidebarLayout class="app-shell-layout min-h-192! relative!">
      <AdminSidebar />
      <SidebarMain class="app-theme-surface">
        <main class="app-page-content">
          <router-view />
        </main>
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

<script setup>
import SidebarMain from 'primevue/sidebarmain'
import SidebarLayout from 'primevue/sidebarlayout'
import AdminSidebar from '../../components/layout/AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-content {
  flex: 1;
  padding: 24px;
}
</style>
