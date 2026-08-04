import { readonly, ref } from 'vue';

const DARK_THEME_CLASS = 'app-dark';
const rootElement = document.documentElement;
const isDark = ref(rootElement.classList.contains(DARK_THEME_CLASS));

function setTheme(useDarkTheme) {
    const nextIsDark = Boolean(useDarkTheme);

    rootElement.classList.toggle(DARK_THEME_CLASS, nextIsDark);
    isDark.value = nextIsDark;
}

function toggleTheme() {
    setTheme(!isDark.value);
}

export function useTheme() {
    return {
        isDark: readonly(isDark),
        setTheme,
        toggleTheme
    };
}
