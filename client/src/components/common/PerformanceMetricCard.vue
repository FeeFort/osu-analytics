<script setup>
import { computed } from 'vue';
import { ArrowDown, ArrowUp, Minus, Plus } from '@lucide/vue';

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  delta: { type: Number, required: true },
  icon: { type: [Object, Function], required: true },
  variant: { type: String, default: 'sign' },
  positive: { type: Boolean, default: undefined },
  negative: { type: Boolean, default: undefined }
});

const isPositive = computed(() => props.positive ?? props.delta > 0);
const isNegative = computed(() => props.negative ?? props.delta < 0);

const deltaIcon = computed(() => {
  if (props.delta === 0) return Minus;
  if (props.variant === 'arrow') return isPositive.value ? ArrowUp : ArrowDown;
  return isPositive.value ? Plus : Minus;
});

const formattedDelta = computed(() => Math.abs(props.delta).toLocaleString('en-US'));
</script>

<template>
  <article class="performance-metric">
    <div class="performance-metric-copy">
      <span class="performance-metric-label">{{ label }}</span>
      <strong class="performance-metric-value">{{ value }}</strong>
    </div>

    <div class="performance-metric-side">
      <span class="performance-metric-icon">
        <component :is="icon" :size="19" :stroke-width="2" aria-hidden="true" />
      </span>
      <span class="metric-delta" :class="isPositive ? 'metric-delta--up' : isNegative ? 'metric-delta--down' : 'metric-delta--flat'">
        <component :is="deltaIcon" :size="14" :stroke-width="2.5" aria-hidden="true" />
        <span>{{ formattedDelta }}</span>
      </span>
    </div>
  </article>
</template>

<style scoped>
.performance-metric {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: 1.25rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--p-content-background) 96%, black 4%);
}
:global(.app-dark) .performance-metric {
  background: color-mix(in srgb, var(--p-content-background) 92%, black 8%);
}

.performance-metric-copy {
  align-self: flex-start;
  min-width: 0;
}
.performance-metric-label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--p-text-muted-color);
  font-size: 0.813rem;
}
.performance-metric-value {
  display: block;
  min-width: 0;
  color: var(--p-text-color);
  font-size: 1.625rem;
  font-weight: 700;
  white-space: nowrap;
}

.performance-metric-side {
  display: flex;
  align-self: stretch;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
}
.performance-metric-icon {
  display: grid;
  width: 2.625rem;
  height: 2.625rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--p-content-border-color) 80%, transparent);
  border-radius: 0.65rem;
  color: var(--p-text-color);
  background: color-mix(in srgb, var(--p-content-background) 78%, var(--p-content-border-color) 22%);
}
:global(.app-dark) .performance-metric-icon {
  border-color: transparent;
  color: var(--p-primary-color);
  background: color-mix(in srgb, var(--p-content-background) 78%, #000 22%);
}

.metric-delta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-width: 3rem;
  min-height: 2rem;
  padding: 0.35rem 0.65rem;
  border-radius: 0.55rem;
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}
.metric-delta > span {
  transform: translateY(0.1em);
}
.metric-delta--up {
  color: #16a34a;
  background: color-mix(in srgb, #16a34a 18%, transparent);
}
.metric-delta--down {
  color: #dc2626;
  background: color-mix(in srgb, #dc2626 16%, transparent);
}
.metric-delta--flat {
  color: var(--p-text-muted-color);
  background: color-mix(in srgb, var(--p-text-muted-color) 12%, transparent);
}
:global(.app-dark) .metric-delta--up {
  color: #4ade80;
  background: color-mix(in srgb, #4ade80 16%, transparent);
}
:global(.app-dark) .metric-delta--down {
  color: #f87171;
  background: color-mix(in srgb, #f87171 15%, transparent);
}
</style>
