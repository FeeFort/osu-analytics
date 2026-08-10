<script setup>
import Sidebar from 'primevue/sidebar'
import SidebarAside from 'primevue/sidebaraside'
import SidebarContent from 'primevue/sidebarcontent'
import SidebarGroup from 'primevue/sidebargroup'
import SidebarGroupContent from 'primevue/sidebargroupcontent'
import SidebarGroupLabel from 'primevue/sidebargrouplabel'
import SidebarHeader from 'primevue/sidebarheader'
import SidebarMenu from 'primevue/sidebarmenu'
import SidebarMenuButton from 'primevue/sidebarmenubutton'
import SidebarMenuItem from 'primevue/sidebarmenuitem'
import SidebarPanel from 'primevue/sidebarpanel'
import SidebarSpacer from 'primevue/sidebarspacer'
import { computed } from 'vue'
import { ArrowLeft, Newspaper, ShieldCheck, Users } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import logoLight from '../../assets/logo-light.png'
import logoDark from '../../assets/logo-dark.png'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()
const logo = computed(() => (isDark.value ? logoDark : logoLight))

const navItems = [
  { label: 'Badges', icon: ShieldCheck, path: '/admin/badges' },
  { label: 'News', icon: Newspaper, path: '/admin/news' },
  { label: 'Users', icon: Users, path: '/admin/users' }
]

function isActive(item) {
  return route.path.startsWith(item.path)
}
</script>

<template>
  <Sidebar id="admin-menu" class="app-sidebar" width="20rem" collapsible="none">
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
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton class="app-sidebar-menu-button" @click="router.push('/')">
                    <ArrowLeft class="app-sidebar-menu-icon" />
                    <span>Back to site</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel class="app-sidebar-group-label">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in navItems" :key="item.path">
                  <SidebarMenuButton class="app-sidebar-menu-button" :isActive="isActive(item)" @click="router.push(item.path)">
                    <component :is="item.icon" class="app-sidebar-menu-icon" />
                    <span>{{ item.label }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarPanel>
    </SidebarAside>
  </Sidebar>
</template>