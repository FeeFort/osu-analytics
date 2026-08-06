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

  // Enable transition rules before updating the PrimeVue selector.
  rootElement.classList.add(THEME_TRANSITION_CLASS);
  void rootElement.offsetWidth;

  transitionFrame = requestAnimationFrame(() => {
    rootElement.classList.toggle(DARK_THEME_CLASS, nextIsDark);
    isDark.value = nextIsDark;
    // Keep rules briefly to commit the final interpolated paint.
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
