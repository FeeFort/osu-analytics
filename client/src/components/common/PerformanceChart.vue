<script setup>
import Select from 'primevue/select';
import { usePerformanceChart } from '../../composables/usePerformanceChart';

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
            <small class="performance-metric-delta" :class="deltaClass(rankDelta)">({{ formatDelta(rankDelta) }})</small>
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
  border-radius: 14px;
  padding: 24px;
}
.panel-title {
  margin: 0 0 20px;
  font-size: 17px;
  font-weight: 600;
  color: var(--p-text-color);
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.performance-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.metric-button {
  height: 32px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 7px;
  color: var(--p-text-color);
  background: var(--p-content-background);
  font: inherit;
  font-size: 12px;
}
.metric-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 10px;
}
.metric-button {
  height: 34px;
  min-width: 64px;
  padding: 0 16px;
  border-color: transparent;
  border-radius: 7px;
  font-size: 14px;
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
  width: 190px;
  min-height: 42px;
  border-radius: 9px;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}
:deep(.period-select .p-select-label) {
  padding: 10px 12px;
  font-size: 14px;
}
:deep(.period-select .p-select-dropdown) {
  width: 38px;
}
:deep(.p-select-overlay) {
  border-radius: 9px;
  overflow: hidden;
}
:deep(.p-select-option) {
  padding: 10px 12px;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.panel-performance {
  min-height: 480px;
}
.panel-performance .panel-placeholder {
  min-height: 360px;
}
.performance-content {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 24px;
  height: 360px;
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
  gap: 8px;
  min-width: 220px;
  padding: 24px 12px 24px 24px;
}
.performance-metric-label {
  font-size: 13px;
  color: var(--p-text-muted-color);
}
.performance-metric-value {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  min-width: 220px;
  white-space: nowrap;
  font-size: 30px;
  font-weight: 700;
  color: var(--p-text-color);
}
.performance-metric-delta {
  font-size: 13px;
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
.performance-chart-placeholder {
  position: relative;
  min-height: 0;
  height: 100%;
  width: calc(100% - 128px);
  margin-left: 64px;
  transform: translateX(64px);
}
.performance-chart-placeholder canvas {
  width: 100% !important;
  height: 100% !important;
  opacity: 1;
}
:global(#app .performance-tooltip) {
  position: absolute;
  z-index: 2;
  min-width: 118px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--p-content-border-color) 70%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--p-content-background) 90%, transparent);
  box-shadow: 0 8px 22px rgb(0 0 0 / 18%);
  color: var(--p-text-color);
  pointer-events: none;
  opacity: 0;
  left: 0;
  top: 0;
  transform: translate3d(calc(0px - 50%), calc(0px - 100% - 12px), 0);
  transition-property: opacity, transform !important;
  transition-duration: 120ms, 260ms !important;
  transition-timing-function: ease, ease-out !important;
  transition-delay: 0ms;
  will-change: transform, opacity;
}
:global(.performance-tooltip-date),
:global(.performance-tooltip-value),
:global(.performance-tooltip-change) {
  display: block;
  white-space: nowrap;
}
:global(.performance-tooltip-date) {
  margin-bottom: 5px;
  font-size: 10px;
  color: var(--p-text-muted-color);
}
:global(.performance-tooltip-value) {
  font-size: 12px;
  font-weight: 600;
}
:global(.performance-tooltip-change) {
  display: flex;
  gap: 5px;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
}
:global(.performance-tooltip-change-label) {
  color: var(--p-text-color);
}
:global(.performance-tooltip-change.is-positive) {
  color: #4ade80;
}
:global(.performance-tooltip-change.is-negative) {
  color: #f87171;
}
:global(.performance-tooltip-change.is-neutral) {
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
