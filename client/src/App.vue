<script setup>
import { ref, nextTick } from 'vue'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import { User, Scale, EllipsisVertical } from 'lucide-vue-next'

const navItems = [
  { icon: User, label: 'Profile', path: '/' },
  { icon: Scale, label: 'Compare', path: '/compare' }
]

const activeLabel = ref('Profile')

const profileMenu = ref()
const profileMenuItems = [
  { label: 'Settings', icon: 'pi pi-cog', class: 'menu-item-settings' },
  { label: 'Log out', icon: 'pi pi-sign-out', class: 'menu-item-logout' }
]

async function toggleProfileMenu(event) {
  profileMenu.value.toggle(event)

  await nextTick()
  const panel = document.querySelector('.p-menu')
  if (panel) {
    const triggerRect = event.currentTarget.getBoundingClientRect()
    panel.style.left = `${triggerRect.right - panel.offsetWidth}px`
  }
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-title">Logo</span>
      </div>

      <nav class="menu-items">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.path"
          class="menu-button"
          :class="{ active: activeLabel === item.label }"
          @click="activeLabel = item.label"
        >
          <component :is="item.icon" :size="22" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="menu-bottom">
        <div class="profile-lower">
          <Avatar label="U" shape="circle" />
          <span class="profile-lower-name">User</span>

          <button type="button" class="profile-lower-more" @click="toggleProfileMenu">
            <EllipsisVertical :size="18" />
          </button>

          <Menu ref="profileMenu" :model="profileMenuItems" :popup="true" />
        </div>
      </div>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.sidebar {
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-left: none;
  border-top: none;
  border-radius: 0 14px 14px 0;
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 20rem;

  overflow-y: auto;
}

.logo {
  padding: 16px;
  min-height: 72px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--p-content-border-color);
}

.logo-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--p-text-color);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  color: var(--p-text-muted-color);
  text-decoration: none;
  font-size: 16px;
  transition: color 150ms ease, background-color 150ms ease;
}

.menu-button svg {
  flex: 0 0 auto;
  stroke-width: 2;
  width: 22px;
  height: 22px;
}

.menu-button:hover {
  color: var(--p-text-color);
  background: var(--p-content-hover-background);
}

.menu-button.active {
  color: var(--p-text-color);
  background: var(--p-highlight-background);
}

.menu-bottom {
  margin-top: auto;
  padding: 10px;
  border-top: 1px solid var(--p-content-border-color);
}

.profile-lower {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
}

.profile-lower :deep(.p-avatar) {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.profile-lower-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--p-text-color);
}

.profile-lower-more {
  margin-left: auto;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 6px;
  border-radius: 8px;
  color: var(--p-text-muted-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease, color 150ms ease;
}

.profile-lower-more:hover {
  background: var(--p-content-hover-background);
  color: var(--p-text-color);
}

.content {
  margin-left: 20rem;
  padding: 24px;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>

<style>
/* Не-scoped специально: Menu из PrimeVue телепортируется в <body>,
   а значит scoped/:deep() стили из App.vue его не достают. */
.menu-item-settings .p-menu-item-icon {
  color: #ffffff !important;
}

.menu-item-logout .p-menu-item-icon,
.menu-item-logout .p-menu-item-label {
  color: #f87171 !important;
}

.p-menu {
  min-width: 240px;
}

.p-menu .p-menu-item-icon {
  font-size: 18px;
}

.p-menu .p-menu-item-label {
  font-size: 16px;
}

.p-menu .p-menu-item-link {
  padding: 12px 16px;
  gap: 12px;
}
</style>