# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# ESLint and Prettier

ESLint and Prettier were added and configured. Please, run commands `npm run lint` and `npm run format` before commiting. Additionally, you can use `npm run lint:fix` to fix auto-fixable issues and `npm run format:check` to check formatting.

# Custom Icons

Custom icons should go into `src/components/icons`, each as a separate `.vue` file:

``` html
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- paths go here -->
  </svg>
</template>
```

Then the new icon should be added into the `src/components/icons/index.js` as in the example:

``` js
export { default as DmtTeamIcon } from './DmtTeamIcon.vue';
```

Afterwards custom icons can be imported for use just like icons from the libraries, for example:

``` js
import { DmtTeamIcon, FounderIcon } from '../components/icons';
```