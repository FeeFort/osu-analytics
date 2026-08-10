<script setup>
import Sidebar from 'primevue/sidebar';
import SidebarAside from 'primevue/sidebaraside';
import SidebarContent from 'primevue/sidebarcontent';
import SidebarFooter from 'primevue/sidebarfooter';
import SidebarGroup from 'primevue/sidebargroup';
import SidebarGroupContent from 'primevue/sidebargroupcontent';
import SidebarGroupLabel from 'primevue/sidebargrouplabel';
import SidebarHeader from 'primevue/sidebarheader';
import SidebarMenu from 'primevue/sidebarmenu';
import SidebarMenuButton from 'primevue/sidebarmenubutton';
import SidebarMenuItem from 'primevue/sidebarmenuitem';
import SidebarPanel from 'primevue/sidebarpanel';
import SidebarSpacer from 'primevue/sidebarspacer';
import { computed } from 'vue';
import { Info, Newspaper, Scale, Search, ShieldCheck } from '@lucide/vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '../../composables/useTheme';
import { useAuth } from '../../composables/useAuth'
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const route = useRoute();
const router = useRouter();
const { isDark } = useTheme();
const { isAdmin } = useAuth()
const logo = computed(() => (isDark.value ? logoDark : logoLight));

const navGroups = computed(() => [
  {
    label: 'Navigation',
    items: [
      { label: 'Search', icon: Search, path: '/search', exact: true },
      { label: 'News', icon: Newspaper, path: '/news', exact: true }
    ]
  },
  {
    label: 'Analytics',
    items: [{ label: 'Compare', icon: Scale, path: '/compare', exact: false }]
  },
  {
    label: 'Management',
    requiresAdmin: true,
    items: [{ label: 'Admin', icon: ShieldCheck, path: '/admin', exact: false }]
  }
].filter((group) => !group.requiresAdmin || isAdmin.value))

function isActive(item) {
  return item.exact ? route.path === item.path : route.path.startsWith(item.path);
}
function navigate(item) {
  if (item.path !== '/search') router.push(item.path);
}
</script>

<template>
  <Sidebar id="menu-demo" class="app-sidebar" width="20rem" collapsible="none">
    <SidebarSpacer />
    <SidebarAside>
      <SidebarPanel>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div class="app-sidebar-menu-button app-sidebar-header-button flex items-center gap-2">
                <div class="app-sidebar-logo-frame">
                  <img :src="logo" alt="logo" class="app-sidebar-logo" />
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup v-for="group in navGroups" :key="group.label">
            <SidebarGroupLabel class="app-sidebar-group-label">{{ group.label }}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in group.items" :key="item.path">
                  <SidebarMenuButton class="app-sidebar-menu-button" :isActive="isActive(item)" @click="navigate(item)">
                    <component :is="item.icon" class="app-sidebar-menu-icon" />
                    <span>{{ item.label }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton class="app-sidebar-menu-button app-sidebar-about-button">
                <Info class="app-sidebar-menu-icon" />
                <span>About</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <slot name="user-menu" />
          </SidebarMenu>
        </SidebarFooter>
      </SidebarPanel>
    </SidebarAside>
  </Sidebar>
</template>
