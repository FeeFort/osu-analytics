<script setup>
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import SidebarMenuItem from 'primevue/sidebarmenuitem';
import SidebarMenuButton from 'primevue/sidebarmenubutton';
import { computed, ref } from 'vue';
import { ChevronDown, LogOut, Moon, Settings, Sun, UserRound } from '@lucide/vue';
import { useRouter } from 'vue-router';
import { useTheme } from '../../composables/useTheme';

const router = useRouter();
const { isDark, toggleTheme: applyThemeToggle } = useTheme();
const userMenu = ref();
const themeChangePending = ref(false);
const userMenuTransition = {
  leaveActiveClass: 'app-user-menu-leave-active',
  leaveFromClass: 'app-user-menu-leave-from',
  leaveToClass: 'app-user-menu-leave-to',
  onAfterLeave: applyPendingThemeChange
};
const userMenuItems = computed(() => [
  { label: 'Profile', icon: UserRound, command: () => router.push('/') },
  { label: 'Settings', icon: Settings },
  { separator: true },
  {
    label: isDark.value ? 'Light theme' : 'Dark theme',
    icon: isDark.value ? Sun : Moon,
    command: toggleTheme
  },
  { separator: true },
  { label: 'Log out', icon: LogOut, class: 'app-user-menu-logout' }
]);

function toggleTheme() {
  themeChangePending.value = true;
}
function applyPendingThemeChange() {
  if (!themeChangePending.value) return;
  themeChangePending.value = false;
  applyThemeToggle();
}
</script>

<template>
  <SidebarMenuItem class="app-sidebar-profile-item">
    <SidebarMenuButton
      class="app-sidebar-menu-button app-sidebar-header-button"
      @click="(e) => userMenu.toggle(e)"
      aria-haspopup="true"
      aria-controls="user_menu"
    >
      <Avatar label="JD" shape="circle" class="app-sidebar-avatar shrink-0" />
      <span>John Doe</span>
      <ChevronDown class="app-sidebar-profile-chevron" />
    </SidebarMenuButton>
    <Menu
      ref="userMenu"
      id="user_menu"
      class="app-user-menu"
      :model="userMenuItems"
      :popup="true"
      :pt="{ transition: userMenuTransition }"
    />
  </SidebarMenuItem>
</template>
