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
  border-radius: 14px;
  padding: 24px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.panel-title {
  margin: 0 0 20px;
  font-size: 17px;
  font-weight: 600;
  color: var(--p-text-color);
}

:global(.panel-placeholder) {
  min-height: 280px;
  border-radius: 10px;
  background: var(--p-content-hover-background);
  border: 1px dashed var(--p-content-border-color);
}
</style>
