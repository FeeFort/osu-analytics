<script setup>
defineProps({
  label: { type: String, required: true },
  color: { type: String, default: '#f8894d' },
  paths: { type: Array, default: () => [] },
  reverse: { type: Boolean, default: false }
})
</script>

<template>
  <span class="badge" :class="{ 'badge--reverse': reverse }" :style="{ '--badge-color': color }">
    <svg class="badge-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path v-for="(path, index) in paths" :key="index" :d="path" />
    </svg>
    <span class="badge-label">{{ label }}</span>
  </span>
</template>

<style scoped>
.badge {
  --badge-color: #f8894d;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 6px 11px;
  border: 2px solid color-mix(in srgb, var(--badge-color) 35%, transparent);
  border-radius: 8px;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 14%, var(--p-content-background));
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.badge--reverse {
  color: var(--p-content-background);
  background: var(--badge-color);
  border-color: var(--badge-color);
}

.badge-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
