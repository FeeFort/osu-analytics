import { readonly, ref } from 'vue';

const DARK_THEME_CLASS = 'app-dark';
const THEME_TRANSITION_CLASS = 'app-theme-transition';
export const THEME_TRANSITION_DURATION = 180;
const THEME_TRANSITION_CLEANUP_BUFFER = 32;
const rootElement = document.documentElement;
const isDark = ref(rootElement.classList.contains(DARK_THEME_CLASS));
let transitionTimeout;
let transitionFrame;

function setTheme(useDarkTheme) {
    const nextIsDark = Boolean(useDarkTheme);

    clearTimeout(transitionTimeout);
    cancelAnimationFrame(transitionFrame);

    // Commit the transition rules first. The following frame then changes the
    // PrimeVue selector so every large surface starts the same transition.
    rootElement.classList.add(THEME_TRANSITION_CLASS);
    void rootElement.offsetWidth;

    transitionFrame = requestAnimationFrame(() => {
        rootElement.classList.toggle(DARK_THEME_CLASS, nextIsDark);
        isDark.value = nextIsDark;
        // Keep the rules for two extra frames so the final interpolated paint
        // is committed before the temporary class disappears.
        transitionTimeout = window.setTimeout(() => {
            rootElement.classList.remove(THEME_TRANSITION_CLASS);
        }, THEME_TRANSITION_DURATION + THEME_TRANSITION_CLEANUP_BUFFER);
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
