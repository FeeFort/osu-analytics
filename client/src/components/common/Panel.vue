<script setup>
defineOptions({ inheritAttrs: false });
defineProps({ title: { type: String, default: '' } });
</script>

<template>
  <section class="panel app-theme-surface" :class="$attrs.class">
    <h2 v-if="title" class="panel-title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.panel {
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.875rem;
  padding: 1.5rem;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel-title {
  margin: 0 0 1.25rem;
  font-size: 1.063rem;
  font-weight: 600;
  color: var(--p-text-color);
}

:global(.panel-placeholder) {
  min-height: 17.5rem;
  border-radius: 0.625rem;
  background: var(--p-content-hover-background);
  border: 1px dashed var(--p-content-border-color);
}
</style>
