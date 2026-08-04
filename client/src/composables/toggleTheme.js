import { readonly, ref } from 'vue';

const DARK_THEME_CLASS = 'app-dark';
const rootElement = document.documentElement;
const isDark = ref(rootElement.classList.contains(DARK_THEME_CLASS));

/**
 * Applies the requested colour scheme and keeps the shared reactive state in
 * sync with PrimeVue's dark-mode selector.
 */
function setTheme(useDarkTheme) {
    const nextIsDark = Boolean(useDarkTheme);

    rootElement.classList.toggle(DARK_THEME_CLASS, nextIsDark);
    isDark.value = nextIsDark;
}

/** Switches between the light and dark colour schemes. */
function toggleTheme() {
    setTheme(!isDark.value);
}

/**
 * Shared theme state and actions. This can be used by menus, settings pages,
 * shortcuts, or any other UI without duplicating DOM-class logic.
 */
export function useTheme() {
    return {
        isDark: readonly(isDark),
        setTheme,
        toggleTheme
    };
}
