<script setup>
import Sidebar from 'primevue/sidebar';
import SidebarAside from 'primevue/sidebaraside';
import SidebarContent from 'primevue/sidebarcontent';
import SidebarFooter from 'primevue/sidebarfooter';
import SidebarGroup from 'primevue/sidebargroup';
import SidebarGroupAction from 'primevue/sidebargroupaction';
import SidebarGroupContent from 'primevue/sidebargroupcontent';
import SidebarGroupLabel from 'primevue/sidebargrouplabel';
import SidebarHeader from 'primevue/sidebarheader';
import SidebarMain from 'primevue/sidebarmain';
import SidebarLayout from 'primevue/sidebarlayout';
import SidebarMenu from 'primevue/sidebarmenu';
import SidebarMenuAction from 'primevue/sidebarmenuaction';
import SidebarMenuBadge from 'primevue/sidebarmenubadge';
import SidebarMenuButton from 'primevue/sidebarmenubutton';
import SidebarMenuItem from 'primevue/sidebarmenuitem';
import SidebarMenuSub from 'primevue/sidebarmenusub';
import SidebarMenuSubButton from 'primevue/sidebarmenusubbutton';
import SidebarMenuSubItem from 'primevue/sidebarmenusubitem';
import SidebarPanel from 'primevue/sidebarpanel';
import SidebarSpacer from 'primevue/sidebarspacer';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import { computed, nextTick, ref, watch } from 'vue';
import { ChevronDown, Settings, Info, LogOut, Moon, Newspaper, Scale, Search, Sun, UserRound } from '@lucide/vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import logoLight from './assets/logo-light.png';
import logoDark from './assets/logo-dark.png';
import { getErrorState, isPageErrorCode } from './error-config';
import { useTheme } from './composables/toggleTheme';

const { isDark, toggleTheme: applyThemeToggle } = useTheme();
const themeChangePending = ref(false);
const userMenuTransition = {
    leaveActiveClass: 'app-user-menu-leave-active',
    leaveFromClass: 'app-user-menu-leave-from',
    leaveToClass: 'app-user-menu-leave-to',
    onAfterLeave: applyPendingThemeChange
};
const router = useRouter();
const route = useRoute();
const isErrorRoute = computed(() => route.meta.isErrorPage === true);
const shouldUseFullPageError = computed(() => isErrorRoute.value && isPageErrorCode(route.params.code));
const logo = computed(() => (isDark.value ? logoDark : logoLight));
const toast = useToast();
const handledToastKey = ref('');
const userMenuItems = computed(() => [
    { label: 'Profile', icon: UserRound, command: () => router.push('/') },
    { label: 'Settings', icon: Settings },
    { separator: true },
    { label: isDark.value ? 'Light theme' : 'Dark theme', icon: isDark.value ? Sun : Moon, command: toggleTheme },
    { separator: true },
    { label: 'Log out', icon: LogOut, class: 'app-user-menu-logout' }
]);

function toggleTheme() {
    // The popup is closed by PrimeVue immediately after this command. The
    // palette changes in its after-leave hook, once it is no longer visible.
    themeChangePending.value = true;
}

function applyPendingThemeChange() {
    if (!themeChangePending.value) return;

    themeChangePending.value = false;
    applyThemeToggle();
}

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
    router.replace({
        path: route.path,
        query: nextQuery,
        hash: route.hash
    });
}

watch(
    () => route.query.errorToast,
    async (errorToast) => {
        const code = typeof errorToast === 'string' ? errorToast : '';
        const toastKey = `${route.fullPath}::${code}`;

        if (!code || handledToastKey.value === toastKey || isPageErrorCode(code)) {
            return;
        }

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

    <div v-else class="app-theme-shell border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
        <SidebarLayout class="app-shell-layout min-h-192! relative!">
            <Sidebar id="menu-demo" class="app-sidebar" width="20rem" iconWidth="5.5rem">
                <SidebarSpacer />
                <SidebarAside>
                    <SidebarPanel>
                        <SidebarHeader>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <div class="app-sidebar-menu-button app-sidebar-header-button flex items-center gap-2">
                                        <div class="app-sidebar-logo-frame">
                                            <img :src="logo" alt="Ð›Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿" class="app-sidebar-logo" />
                                        </div>
                                    </div>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarHeader>

                        <SidebarContent>
                            <SidebarGroup>
                            <SidebarGroupLabel class="app-sidebar-group-label">Navigation</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton class="app-sidebar-menu-button" :isActive="route.path === '/search'">
                                                <Search class="app-sidebar-menu-icon" />
                                                <span>Search</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton class="app-sidebar-menu-button" :isActive="route.path === '/news'" @click="router.push('/news')">
                                                <Newspaper class="app-sidebar-menu-icon" />
                                                <span>News</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                            <SidebarGroupLabel class="app-sidebar-group-label">Analytics</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton class="app-sidebar-menu-button" :isActive="route.path.startsWith('/compare')" @click="router.push('/compare')">
                                                <Scale class="app-sidebar-menu-icon" />
                                                <span>Compare</span>
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
                                <SidebarMenuItem class="app-sidebar-profile-item">
                                    <SidebarMenuButton class="app-sidebar-menu-button app-sidebar-header-button" @click="(e) => $refs.userMenu.toggle(e)" aria-haspopup="true" aria-controls="user_menu">
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
                            </SidebarMenu>
                        </SidebarFooter>
                    </SidebarPanel>
                </SidebarAside>
            </Sidebar>

            <SidebarMain>
                <main class="app-page-content">
                    <router-view />
                </main>
            </SidebarMain>
        </SidebarLayout>
    </div>
</template>

