<template>
  <v-btn
    icon
    @click="toggleTheme"
    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
  </v-btn>
</template>

<script setup>
/**
 * ThemeToggle Component
 * @description A theme toggle button that switches between light and dark modes
 * @component ThemeToggle
 * @vue-prop {boolean} [isDarkMode=false] - Current theme state
 * @vue-event {void} toggleTheme - Emitted when theme is toggled
 */

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDarkMode = ref(false);
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Initialize theme state from localStorage or system preference
 * @function initializeTheme
 * @returns {void}
 */
const initializeTheme = () => {
  /** @type {('light'|'dark'|null)} */
  const savedTheme = localStorage.getItem('theme');
  const validThemes = ['light', 'dark'];
  
  if (savedTheme && validThemes.includes(savedTheme)) {
    // Use validated saved preference
    isDarkMode.value = savedTheme === 'dark';
  } else {
    // Fall back to system preference
    isDarkMode.value = mediaQuery.matches;
  }
  
  applyTheme();
};

/**
 * Apply theme changes to the application
 * @function applyTheme
 * @returns {void}
 */
const applyTheme = () => {
  const themeName = isDarkMode.value ? 'dark' : 'light';
  theme.global.name.value = themeName;
  localStorage.setItem('theme', themeName);
  
  // Update body class for global theme styles
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

/**
 * Toggle theme handler - switches between light and dark modes
 * @function toggleTheme
 * @returns {void}
 */
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
};

/**
 * System theme preference handler - updates theme when system preference changes
 * @function updateThemeFromSystem
 * @param {MediaQueryListEvent} e - Media query event
 * @returns {void}
 */
const updateThemeFromSystem = (e) => {
  // Only apply system preference if user hasn't explicitly chosen a theme
  if (!localStorage.getItem('theme')) {
    isDarkMode.value = e.matches;
    applyTheme();
  }
};

// Lifecycle hooks
onMounted(() => {
  initializeTheme();
  mediaQuery.addEventListener('change', updateThemeFromSystem);
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', updateThemeFromSystem);
});
</script>