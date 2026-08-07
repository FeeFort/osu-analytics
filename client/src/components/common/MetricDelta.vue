<template>
  <span class="metric-delta" :class="positive ? 'metric-delta--up' : negative ? 'metric-delta--down' : 'metric-delta--flat'">
    <component :is="deltaIcon" :size="14" :stroke-width="2.5" aria-hidden="true" />
    <span>{{ formattedDelta }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowDown, ArrowUp, Minus, Plus } from '@lucide/vue';

const props = defineProps({
  delta: { type: Number, required: true },
  variant: { type: String, default: 'sign' },
  positive: { type: Boolean, default: undefined },
  negative: { type: Boolean, default: undefined }
});

const deltaIcon = computed(() => {
  const up = props.positive ?? props.delta > 0;
  if (props.delta === 0) return Minus;
  if (props.variant === 'arrow') return up ? ArrowUp : ArrowDown;
  return up ? Plus : Minus;
});

const formattedDelta = computed(() => Math.abs(props.delta).toLocaleString('en-US'));
</script>

<style scoped>
.metric-delta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-width: 4.4rem;
  min-height: 2rem;
  padding: 0.35rem 0.65rem;
  border-radius: 0.55rem;
  font-weight: 600;
  font-size: 0.98rem;
  line-height: 1;
  white-space: nowrap;
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

.metric-delta > span {
  transform: translateY(1px);
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
