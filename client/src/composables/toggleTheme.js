import { readonly, ref } from 'vue';

const DARK_THEME_CLASS = 'app-dark';
const THEME_TRANSITION_CLASS = 'app-theme-transition';
const THEME_TRANSITION_DURATION = 180;
const rootElement = document.documentElement;
const isDark = ref(rootElement.classList.contains(DARK_THEME_CLASS));
let transitionTimeout;
let transitionFrame;

function setTheme(useDarkTheme) {
    const nextIsDark = Boolean(useDarkTheme);

    clearTimeout(transitionTimeout);
    cancelAnimationFrame(transitionFrame);
    rootElement.classList.add(THEME_TRANSITION_CLASS);
    // First paint the transition rules, then change the theme on the next
    // frame. This gives every large surface the same transition start point.
    transitionFrame = requestAnimationFrame(() => {
        rootElement.classList.toggle(DARK_THEME_CLASS, nextIsDark);
        isDark.value = nextIsDark;

        transitionTimeout = window.setTimeout(() => {
            rootElement.classList.remove(THEME_TRANSITION_CLASS);
        }, THEME_TRANSITION_DURATION);
    });
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
