<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'
import { Search, Scale, EllipsisVertical, Info, Newspaper, LogIn, Check } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Сгруппированные пункты меню — секции с подписью (Navigation/Analytics)
const navGroups = [
  {
    label: 'Navigation',
    items: [
      { icon: Search, label: 'Search', path: '/search' },
      { icon: Newspaper, label: 'News', path: '/news' }
    ]
  },
  {
    label: 'Analytics',
    items: [{ icon: Scale, label: 'Compare', path: '/compare' }]
  }
]

function isActivePath(path) {
  return route.path === path
}

const aboutDialogVisible = ref(false)

// TODO: заменить на реальные данные из auth store / API, когда подключим бэкенд
const isLoggedIn = ref(true)
const currentUser = ref({
  name: 'dr1ma17',
  avatarUrl: 'https://i.pravatar.cc/80',
  verified: true
})

// Попап по клику на три точки — Profile, Settings, тема, Log out
const isDark = ref(document.documentElement.classList.contains('app-dark'))

function toggleTheme() {
  document.documentElement.classList.toggle('app-dark')
  isDark.value = !isDark.value
}

const profileMenu = ref()
const profileMenuItems = computed(() => [
  { label: 'Profile', icon: 'pi pi-user', class: 'menu-item-neutral', command: () => router.push('/') },
  { label: 'Settings', icon: 'pi pi-cog', class: 'menu-item-neutral' },
  { separator: true },
  {
    label: isDark.value ? 'Light theme' : 'Dark theme',
    icon: isDark.value ? 'pi pi-sun' : 'pi pi-moon',
    class: 'menu-item-neutral',
    command: toggleTheme
  },
  { separator: true },
  { label: 'Log out', icon: 'pi pi-sign-out', class: 'menu-item-logout' }
])

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
        <div class="logo-mark">
          <img src="./assets/logo-light.png" alt="Logo" class="logo-img" :class="{ visible: !isDark }" />
          <img src="./assets/logo-dark.png" alt="Logo" class="logo-img" :class="{ visible: isDark }" />
        </div>
      </div>

      <nav class="menu-items">
        <div v-for="group in navGroups" :key="group.label" class="menu-group">
          <span class="menu-group-label">{{ group.label }}</span>

          <router-link
            v-for="item in group.items"
            :key="item.label"
            :to="item.path"
            class="menu-button"
            :class="{ active: isActivePath(item.path) }"
          >
            <component :is="item.icon" :size="22" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </nav>

      <div class="menu-bottom">
        <button type="button" class="menu-button about-button" @click="aboutDialogVisible = true">
          <Info :size="22" />
          <span>About</span>
        </button>

        <div v-if="isLoggedIn" class="profile-lower">
          <Avatar
            :image="currentUser.avatarUrl || undefined"
            :label="!currentUser.avatarUrl ? currentUser.name.charAt(0).toUpperCase() : undefined"
            shape="circle"
          />
          <span class="profile-lower-name">
            {{ currentUser.name }}
            <Check v-if="currentUser.verified" :size="15" :stroke-width="3" class="verified-icon" />
          </span>

          <button type="button" class="profile-lower-more" @click="toggleProfileMenu">
            <EllipsisVertical :size="18" />
          </button>

          <Menu ref="profileMenu" :model="profileMenuItems" :popup="true" />
        </div>

        <router-link v-else to="/login" class="menu-button login-button">
          <LogIn :size="22" />
          <span>Log in</span>
        </router-link>
      </div>
    </aside>

    <main class="content">
      <router-view />
    </main>

    <Dialog
      v-model:visible="aboutDialogVisible"
      header="About"
      modal
      dismissableMask
      :style="{ width: '420px' }"
    >
      <p>Hello world</p>
    </Dialog>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-layout,
.app-layout * {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
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
  justify-content: center;
  border-bottom: 1px solid var(--p-content-border-color);
}

.logo-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--p-text-color);
}

.logo-mark {
  position: relative;
  width: 85%;
  aspect-ratio: 1024 / 178;
}

.logo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left center;
  opacity: 0;
  transition: opacity 200ms ease;
}

.logo-img.visible {
  opacity: 1;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-group-label {
  padding: 8px 12px 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--p-text-muted-color);
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
}

.login-button {
  margin-top: 6px;
  border-top: 1px solid var(--p-content-border-color);
  padding-top: 16px;
}

.about-button {
  appearance: none;
  border: 0;
  background: transparent;
  width: 100%;
  font: inherit;
  cursor: pointer;
  margin-bottom: 4px;
}

.profile-lower {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-top: 6px;
  border-top: 1px solid var(--p-content-border-color);
}

.profile-lower :deep(.p-avatar) {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.profile-lower-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--p-text-color);
}

.verified-icon {
  color: var(--p-primary-color);
  flex: 0 0 auto;
  position: relative;
  top: 1px;
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
body,
.p-menu,
.p-menu * {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

.menu-item-neutral .p-menu-item-icon {
  color: var(--p-text-color) !important;
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