<script setup>
import Select from 'primevue/select';
import { usePerformanceChart } from '../../composables/usePerformanceChart';
import { ChevronUp, ChevronDown } from '@lucide/vue';

const {
  chartCanvas,
  selectedPeriod,
  selectedMetric,
  periodOptions,
  currentPp,
  currentRank,
  ppDelta,
  rankDelta,
  formatMetricNumber,
  formatDelta,
  formatDeltaMagnitude,
  deltaClass
} = usePerformanceChart();
</script>

<template>
  <section class="panel app-theme-surface panel-performance">
    <div class="panel-heading panel-heading-with-controls">
      <h2 class="panel-title">Performance History</h2>
      <div class="performance-controls">
        <Select
          v-model="selectedPeriod"
          :options="periodOptions"
          optionLabel="label"
          optionValue="value"
          class="period-select"
          aria-label="Chart period" />
        <div class="metric-toggle">
          <button class="metric-button" :class="{ 'metric-button-active': selectedMetric === 'pp' }" @click="selectedMetric = 'pp'">PP</button>
          <button class="metric-button" :class="{ 'metric-button-active': selectedMetric === 'rank' }" @click="selectedMetric = 'rank'">Rank</button>
        </div>
      </div>
    </div>
    <div class="performance-content">
      <div class="performance-metrics">
        <div class="performance-metric">
          <span class="performance-metric-label">Current PP</span>
          <strong class="performance-metric-value">
            {{ formatMetricNumber(currentPp) }}
            <small class="performance-metric-delta" :class="deltaClass(ppDelta)">({{ formatDelta(ppDelta) }})</small>
          </strong>
        </div>
        <div class="performance-metric">
          <span class="performance-metric-label">Global Rank</span>
          <strong class="performance-metric-value">
            #{{ formatMetricNumber(currentRank) }}
            <small class="performance-metric-delta" :class="deltaClass(rankDelta)">
              (
              <ChevronUp v-if="rankDelta > 0" class="performance-metric-delta-icon" />
              <ChevronDown v-else-if="rankDelta < 0" class="performance-metric-delta-icon" />
              {{ formatDeltaMagnitude(rankDelta) }})
            </small>
          </strong>
        </div>
      </div>
      <div class="performance-chart-placeholder">
        <canvas ref="chartCanvas" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.875rem;
  padding: 1.5rem;
}
.panel-title {
  margin: 0 0 1.25rem;
  font-size: 1.063rem;
  font-weight: 600;
  color: var(--p-text-color);
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.performance-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.metric-button {
  height: 2rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.438rem;
  color: var(--p-text-color);
  background: var(--p-content-background);
  font: inherit;
  font-size: 0.75rem;
}
.metric-toggle {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.625rem;
}
.metric-button {
  height: 2.125rem;
  min-width: 4rem;
  padding: 0 1rem;
  border-color: transparent;
  border-radius: 0.438rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    transform 160ms ease;
}
.metric-button:hover,
.metric-button-active {
  color: var(--p-primary-contrast-color, #fff);
  background: var(--p-primary-color);
}
:deep(.period-select) {
  width: 11.875rem;
  min-height: 2.625rem;
  border-radius: 0.563rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}
:deep(.period-select .p-select-label) {
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
}
:deep(.period-select .p-select-dropdown) {
  width: 2.375rem;
}
:deep(.p-select-overlay) {
  border-radius: 0.563rem;
  overflow: hidden;
}
:deep(.p-select-option) {
  padding: 0.625rem 0.75rem;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.panel-performance {
  min-height: 30rem;
}
.panel-performance .panel-placeholder {
  min-height: 22.5rem;
}
.performance-content {
  display: grid;
  grid-template-columns: 11.25rem minmax(0, 1fr);
  gap: 1.5rem;
  height: 22.5rem;
}
.performance-metrics {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 100%;
}
.performance-metric {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  min-width: 13.75rem;
  padding: 1.5rem 0.75rem 1.5rem 1.5rem;
}
.performance-metric-label {
  font-size: 0.813rem;
  color: var(--p-text-muted-color);
}
.performance-metric-value {
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  min-width: 13.75rem;
  white-space: nowrap;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--p-text-color);
}
.performance-metric-delta {
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
  white-space: nowrap;
}
.performance-metric-delta-neutral {
  color: var(--p-text-muted-color);
}
.performance-metric-delta-positive {
  color: #4ade80;
}
.performance-metric-delta-negative {
  color: #f87171;
}
.performance-metric-delta-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.0625em;
  vertical-align: -0.1em;
  stroke-width: 3;
}
.performance-chart-placeholder {
  position: relative;
  min-height: 0;
  height: 100%;
  width: calc(100% - 8rem);
  margin-left: 4rem;
  transform: translateX(4rem);
}
.performance-chart-placeholder canvas {
  width: 100% !important;
  height: 100% !important;
  opacity: 1;
}
:global(#app .performance-tooltip) {
  position: absolute;
  z-index: 2;
  min-width: 7.375rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--p-content-border-color) 70%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--p-content-background) 90%, transparent);
  box-shadow: 0 8px 22px rgb(0 0 0 / 18%);
  color: var(--p-text-color);
  pointer-events: none;
  opacity: 0;
  left: 0;
  top: 0;
  transform: translate3d(calc(0px - 50%), calc(0px - 100% - 0.75rem), 0);
  transition-property: opacity, transform !important;
  transition-duration: 120ms, 260ms !important;
  transition-timing-function: ease, ease-out !important;
  transition-delay: 0ms;
  will-change: transform, opacity;
}
:global(.performance-tooltip-chevron) {
  width: 1.2em;
  height: 1.2em;
  display: inline-block;
  vertical-align: -0.2em;
  flex-shrink: 0;
}
:global(.performance-tooltip-date),
:global(.performance-tooltip-value),
:global(.performance-tooltip-change) {
  display: block;
  white-space: nowrap;
}
:global(.performance-tooltip-date) {
  margin-bottom: 0.313rem;
  font-size: 0.625rem;
  color: var(--p-text-muted-color);
}
:global(.performance-tooltip-value) {
  font-size: 0.75rem;
  font-weight: 600;
}
:global(.performance-tooltip-change) {
  display: flex;
  gap: 0.313rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}
:global(.performance-tooltip-change-label) {
  color: var(--p-text-color);
}
:global(.performance-tooltip-change-value.is-positive) {
  color: #4ade80;
}
:global(.performance-tooltip-change-value.is-negative) {
  color: #f87171;
}
:global(.performance-tooltip-change-value.is-neutral) {
  color: var(--p-text-muted-color);
}
@media (max-width: 900px) {
  .performance-content {
    grid-template-columns: 1fr;
  }
  .panel-heading-with-controls {
    flex-direction: column;
  }
  .performance-controls {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
