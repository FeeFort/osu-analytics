<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Crosshair, Gauge, Star, Target, Zap } from '@lucide/vue'
import Select from 'primevue/select'
import Badge from '../components/Badge.vue'
import { THEME_TRANSITION_DURATION, useTheme } from '../composables/useTheme'

Chart.register(...registerables)

const chartCanvas = ref(null)
const selectedPeriod = ref('threeMonths')
const selectedMetric = ref('pp')
let performanceChart
let isPeriodTransitioning = false
const { isDark } = useTheme()

const periodOptions = [
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' },
  { label: 'Last 3 Months', value: 'threeMonths' },
  { label: 'Last Year', value: 'year' }
]

const periodDays = {
  week: 7,
  month: 30,
  threeMonths: 90,
  year: 360
}

let periodAnimationFrame
let metricAnimationFrame

// Smooth the custom Chart.js crosshair independently of tooltip animation.
let crosshairCurrent = null
let crosshairTarget = null
let crosshairRafId = null
const CROSSHAIR_EASE = 0.22
const CROSSHAIR_SNAP_EPSILON = 0.4

function stepCrosshair(chart) {
  if (!crosshairCurrent || !crosshairTarget) {
    crosshairRafId = null
    return
  }

  const dx = crosshairTarget.x - crosshairCurrent.x
  const dy = crosshairTarget.y - crosshairCurrent.y

  if (Math.abs(dx) < CROSSHAIR_SNAP_EPSILON && Math.abs(dy) < CROSSHAIR_SNAP_EPSILON) {
    crosshairCurrent = { ...crosshairTarget }
    crosshairRafId = null
    chart.draw()
    return
  }

  crosshairCurrent = {
    x: crosshairCurrent.x + dx * CROSSHAIR_EASE,
    y: crosshairCurrent.y + dy * CROSSHAIR_EASE
  }
  chart.draw()
  crosshairRafId = requestAnimationFrame(() => stepCrosshair(chart))
}
let themeGridAnimationFrame

const crosshairPlugin = {
  id: 'performanceCrosshair',
  afterDraw(chart) {
    if (isPeriodTransitioning) return

    const activeElements = chart.getActiveElements()
    if (!activeElements.length) {
      crosshairCurrent = null
      crosshairTarget = null
      if (crosshairRafId) {
        cancelAnimationFrame(crosshairRafId)
        crosshairRafId = null
      }
      return
    }

    const element = activeElements[0].element
    const rawPosition = element.tooltipPosition ? element.tooltipPosition() : element
    crosshairTarget = { x: rawPosition.x, y: rawPosition.y }

    if (!crosshairCurrent) {
      crosshairCurrent = { ...crosshairTarget }
    } else if (!crosshairRafId) {
      const dx = crosshairTarget.x - crosshairCurrent.x
      const dy = crosshairTarget.y - crosshairCurrent.y
      if (Math.abs(dx) >= CROSSHAIR_SNAP_EPSILON || Math.abs(dy) >= CROSSHAIR_SNAP_EPSILON) {
        crosshairRafId = requestAnimationFrame(() => stepCrosshair(chart))
      }
    }

    const position = crosshairCurrent
    const { left, top } = chart.chartArea
    const { bottom } = chart.chartArea
    const context = chart.ctx
    const crosshairColor = getCssColor('--p-text-muted-color', '#94a3b8')
    const primaryColor = getCssColor('--p-primary-color', '#ec4899')
    const backgroundColor = getCssColor('--p-content-background', '#ffffff')

    context.save()
    context.strokeStyle = crosshairColor
    context.lineWidth = 1
    context.setLineDash([4, 4])

    context.beginPath()
    context.moveTo(position.x, top)
    context.lineTo(position.x, bottom)
    context.stroke()

    context.setLineDash([])
    context.fillStyle = backgroundColor
    context.beginPath()
    const ringRadius = 5.5
    context.arc(position.x, position.y, ringRadius, 0, Math.PI * 2)
    context.fill()

    context.strokeStyle = primaryColor
    context.lineWidth = 1.5
    context.beginPath()
    context.arc(position.x, position.y, ringRadius, 0, Math.PI * 2)
    context.stroke()
    context.restore()
  }
}

function createDailyChartData(days, basePp, baseRank) {
  const endDate = new Date()
  const labels = []
  const offsets = []
  const pp = []
  const rank = []

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(endDate)
    date.setDate(endDate.getDate() - index)
    labels.push(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
    offsets.push(-(index))

    const progress = (days - index) / days
    const wave = Math.sin(index * 0.42) * 7 + Math.cos(index * 0.13) * 4
    pp.push(Math.round(basePp + progress * 42 + wave))
    rank.push(Math.max(1, Math.round(baseRank - progress * (baseRank * 0.32) + wave * 1.5)))
  }

  return { labels, offsets, pp, rank }
}

const masterChartData = createDailyChartData(periodDays.year, 520, 1240)
const currentPp = 566
const currentRank = 849000
const ppDelta = masterChartData.pp.at(-1) - masterChartData.pp.at(-2)
const rankDelta = (masterChartData.rank.at(-1) - masterChartData.rank.at(-2)) * 1000

function formatMetricNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.abs(Math.round(value))).replace(/,/g, ' ')
}

function formatDelta(value) {
  return `${value >= 0 ? '+' : '−'}${formatMetricNumber(value)}`
}

function deltaClass(value) {
  if (value > 0) return 'performance-metric-delta-positive'
  if (value < 0) return 'performance-metric-delta-negative'
  return 'performance-metric-delta-neutral'
}

const chartData = {
  week: {
    labels: masterChartData.labels.slice(-periodDays.week),
    pp: masterChartData.pp.slice(-periodDays.week),
    rank: masterChartData.rank.slice(-periodDays.week)
  },
  month: {
    labels: masterChartData.labels.slice(-periodDays.month),
    pp: masterChartData.pp.slice(-periodDays.month),
    rank: masterChartData.rank.slice(-periodDays.month)
  },
  threeMonths: {
    labels: masterChartData.labels.slice(-periodDays.threeMonths),
    pp: masterChartData.pp.slice(-periodDays.threeMonths),
    rank: masterChartData.rank.slice(-periodDays.threeMonths)
  },
  year: masterChartData
}

const activeChartData = computed(() => masterChartData)

function getCssColor(variable, fallback) {
  return getComputedStyle(chartCanvas.value?.parentElement || document.body)
    .getPropertyValue(variable)
    .trim() || fallback
}

function parseColor(color) {
  const value = color.trim()
  const hex = value.match(/^#([\da-f]{3,8})$/i)?.[1]

  if (hex) {
    const expanded = hex.length <= 4 ? [...hex].map((character) => character.repeat(2)).join('') : hex
    return {
      red: Number.parseInt(expanded.slice(0, 2), 16),
      green: Number.parseInt(expanded.slice(2, 4), 16),
      blue: Number.parseInt(expanded.slice(4, 6), 16),
      alpha: expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1
    }
  }

  const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i)
  if (!rgb) return null

  return {
    red: Number(rgb[1]),
    green: Number(rgb[2]),
    blue: Number(rgb[3]),
    alpha: rgb[4] === undefined ? 1 : Number(rgb[4])
  }
}

function getCssEase(progress) {
  const sample = (time, first, second) => 3 * (1 - time) ** 2 * time * first + 3 * (1 - time) * time ** 2 * second + time ** 3
  let lower = 0
  let upper = 1

  for (let iteration = 0; iteration < 12; iteration += 1) {
    const time = (lower + upper) / 2
    if (sample(time, 0.25, 0.25) < progress) lower = time
    else upper = time
  }

  return sample((lower + upper) / 2, 0.1, 1)
}

function animateThemeGridColor(fromColor, toColor) {
  cancelAnimationFrame(themeGridAnimationFrame)
  const from = parseColor(fromColor)
  const to = parseColor(toColor)

  if (!from || !to) {
    performanceChart.options.scales.y.grid.color = toColor
    performanceChart.update('none')
    return
  }

  const start = performance.now()
  const step = (now) => {
    if (!performanceChart) return

    const progress = Math.min((now - start) / THEME_TRANSITION_DURATION, 1)
    const eased = getCssEase(progress)
    const interpolate = (startValue, endValue) => startValue + (endValue - startValue) * eased
    const red = Math.round(interpolate(from.red, to.red))
    const green = Math.round(interpolate(from.green, to.green))
    const blue = Math.round(interpolate(from.blue, to.blue))
    const alpha = interpolate(from.alpha, to.alpha)

    performanceChart.options.scales.y.grid.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`
    performanceChart.update('none')

    if (progress < 1) themeGridAnimationFrame = requestAnimationFrame(step)
    else performanceChart.options.scales.y.grid.color = toColor
  }

  themeGridAnimationFrame = requestAnimationFrame(step)
}

function externalTooltipHandler(context) {
  const { chart, tooltip } = context
  const parent = chart.canvas.parentNode
  let tooltipElement = parent.querySelector('.performance-tooltip')

  if (!tooltipElement) {
    tooltipElement = document.createElement('div')
    tooltipElement.className = 'performance-tooltip'
    parent.appendChild(tooltipElement)
  }

  if (tooltip.opacity === 0) {
    tooltipElement.style.opacity = '0'
    return
  }

  const dataIndex = tooltip.dataPoints?.[0]?.dataIndex
  const currentData = activeChartData.value
  const isPp = selectedMetric.value === 'pp'
  const label = isPp ? 'PP' : 'Rank'
  const values = currentData?.[selectedMetric.value] || []
  const value = values[dataIndex]
  const previousValue = dataIndex > 0 ? values[dataIndex - 1] : value
  const change = value - previousValue
  const changeColor = change > 0 ? '#4ade80' : change < 0 ? '#f87171' : 'var(--p-text-muted-color)'
  const changeSign = change > 0 ? '+' : ''
  const formattedValue = isPp ? value : `#${value}`
  const formattedChange = isPp ? `${changeSign}${change}pp` : `${changeSign}${change}`

  tooltipElement.innerHTML = `
    <span class="performance-tooltip-date">${currentData.labels[dataIndex]}</span>
    <span class="performance-tooltip-value">${label}: ${formattedValue}</span>
    <span class="performance-tooltip-change">
      <span class="performance-tooltip-change-label">Change:</span>
      <span style="color: ${changeColor};">${formattedChange}</span>
    </span>
  `
  // Use inline transforms to avoid layout thrashing and discrete custom-property transitions.
  tooltipElement.style.opacity = '1'
  tooltipElement.style.transform = `translate3d(calc(${tooltip.caretX}px - 50%), calc(${tooltip.caretY}px - 100% - 12px), 0)`
}

function getChartRange(period = selectedPeriod.value) {
  return {
    min: -(periodDays[period] - 1),
    max: 0
  }
}

function getYRange(period, metric = selectedMetric.value) {
  const values = masterChartData[metric].slice(-periodDays[period]).map((value) => toPlotValue(metric, value))
  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)
  const dataRange = dataMax - dataMin || Math.max(Math.abs(dataMax) * 0.1, 1)
  const padding = dataRange * 0.1

  return {
    min: Math.floor(dataMin - padding),
    max: Math.ceil(dataMax + padding)
  }
}

function getTicksLimit(period = selectedPeriod.value) {
  return period === 'year' ? 12 : period === 'threeMonths' ? 6 : period === 'month' ? 6 : 7
}

function getChartOptions(
  textColor,
  borderColor,
  currentData,
  range = getChartRange(),
  yRange = getYRange(selectedPeriod.value),
  { themeTransition = false } = {}
) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    transitions: {
      active: {
        animation: { duration: 0 }
      }
    },
    animation: {
      duration: themeTransition ? THEME_TRANSITION_DURATION : 1200,
      easing: themeTransition ? 'ease' : 'ease'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        mode: 'index',
        intersect: false,
        external: externalTooltipHandler
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        type: 'linear',
        min: range.min,
        max: range.max,
        grid: { display: false },
        ticks: {
          color: textColor,
          callback: (value) => {
            const index = Math.round(Number(value) + (periodDays.year - 1))
            const date = currentData.labels[index]
            return date?.replace(/, \d{4}$/, '') || value
          },
          autoSkip: true,
          maxTicksLimit: getTicksLimit(),
          maxRotation: 0
        }
      },
      y: {
        min: yRange.min,
        max: yRange.max,
        grid: { color: borderColor },
        ticks: {
          color: textColor,
          callback: (value) => Math.round(Math.abs(value))
        }
      }
    }
  }
}

function toPlotValue(metric, value) {
  return metric === 'rank' ? -value : value
}

function getFullDataset(metric = selectedMetric.value) {
  return masterChartData[metric].map((value, index) => ({
    x: masterChartData.offsets[index],
    y: toPlotValue(metric, value)
  }))
}

function renderPerformanceChart() {
  if (!chartCanvas.value) return
  performanceChart?.destroy()

  const primaryColor = getCssColor('--p-primary-color', '#ec4899')
  const textColor = getCssColor('--p-text-muted-color', '#94a3b8')
  const borderColor = getCssColor('--p-content-border-color', '#3a3a44')

  performanceChart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: [{
        data: getFullDataset(),
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}22`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: 'start',
        tension: 0.35
      }]
    },
    options: getChartOptions(textColor, borderColor, masterChartData, getChartRange(), getYRange(selectedPeriod.value)),
    plugins: [crosshairPlugin]
  })
}

function updatePerformanceChart({ animate = true, themeTransition = false, gridColor } = {}) {
  const update = () => {
    if (!performanceChart) {
      renderPerformanceChart()
      return
    }

    const primaryColor = getCssColor('--p-primary-color', '#ec4899')
    const textColor = getCssColor('--p-text-muted-color', '#94a3b8')
    const borderColor = gridColor || getCssColor('--p-content-border-color', '#3a3a44')

    performanceChart.data.datasets[0].data = getFullDataset()
    performanceChart.data.datasets[0].borderColor = primaryColor
    performanceChart.data.datasets[0].backgroundColor = `${primaryColor}22`
    performanceChart.data.datasets[0].fill = 'start'
    performanceChart.options = getChartOptions(
      textColor,
      borderColor,
      masterChartData,
      {
        min: performanceChart.options.scales.x.min,
        max: performanceChart.options.scales.x.max
      },
      getYRange(selectedPeriod.value, selectedMetric.value),
      { themeTransition }
    )
    // Use normal Chart.js animation for theme changes.
    performanceChart.update(themeTransition ? undefined : animate ? 'active' : 'none')
  }

  // Update synchronously so the canvas matches CSS surfaces.
  if (animate && !themeTransition) {
    nextTick(update)
  } else {
    update()
  }
}

function animatePeriodRange(period) {
  if (!performanceChart) return
  cancelAnimationFrame(periodAnimationFrame)

  isPeriodTransitioning = true
  performanceChart.options.events = []
  performanceChart.setActiveElements([])
  performanceChart.tooltip?.setActiveElements([], { x: 0, y: 0 })
  const tooltipElement = performanceChart.canvas.parentNode.querySelector('.performance-tooltip')
  if (tooltipElement) tooltipElement.style.opacity = '0'
  performanceChart.update('none')

  const scaleOptions = performanceChart.options.scales.x
  const yScaleOptions = performanceChart.options.scales.y
  const liveScale = performanceChart.scales.x
  const liveYScale = performanceChart.scales.y
  const fromMin = Number.isFinite(Number(scaleOptions.min))
    ? Number(scaleOptions.min)
    : liveScale.min
  const fromMax = Number.isFinite(Number(scaleOptions.max))
    ? Number(scaleOptions.max)
    : liveScale.max
  const target = getChartRange(period)
  const targetY = getYRange(period, selectedMetric.value)
  const fromYMin = Number.isFinite(Number(yScaleOptions.min))
    ? Number(yScaleOptions.min)
    : liveYScale.min
  const fromYMax = Number.isFinite(Number(yScaleOptions.max))
    ? Number(yScaleOptions.max)
    : liveYScale.max
  yScaleOptions.min = fromYMin
  yScaleOptions.max = fromYMax
  scaleOptions.ticks.maxTicksLimit = getTicksLimit(period)
  const duration = 650
  const start = performance.now()
  const easeInOutCubic = (value) => value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = easeInOutCubic(progress)
    const min = fromMin + (target.min - fromMin) * eased
    const max = fromMax + (target.max - fromMax) * eased
    const yMin = fromYMin + (targetY.min - fromYMin) * eased
    const yMax = fromYMax + (targetY.max - fromYMax) * eased

    performanceChart.options.scales.x.min = min
    performanceChart.options.scales.x.max = max
    performanceChart.options.scales.y.min = yMin
    performanceChart.options.scales.y.max = yMax
    performanceChart.update('none')

    if (progress < 1) {
      periodAnimationFrame = requestAnimationFrame(step)
    } else {
      isPeriodTransitioning = false
      performanceChart.options.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
      performanceChart.update('none')
    }
  }

  periodAnimationFrame = requestAnimationFrame(step)
}

function animateMetricChange(metric, previousMetric) {
  if (!performanceChart || metric === previousMetric) return
  cancelAnimationFrame(metricAnimationFrame)
  const chart = performanceChart
  const dataset = chart.data.datasets[0]
  const fromData = getFullDataset(previousMetric)
  const toData = getFullDataset(metric)
  const fromRange = getYRange(selectedPeriod.value, previousMetric)
  const toRange = getYRange(selectedPeriod.value, metric)
  const fromValue = masterChartData[previousMetric].at(-1)
  const toValue = masterChartData[metric].at(-1)
  const start = performance.now()
  const duration = 650
  const ease = (value) => value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2

  isPeriodTransitioning = true
  chart.options.events = []
  dataset.fill = 'start'
  chart.setActiveElements([])
  chart.tooltip?.setActiveElements([], { x: 0, y: 0 })

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = ease(progress)
    dataset.data = toData.map((point, index) => ({ x: point.x, y: fromData[index].y + (point.y - fromData[index].y) * eased }))
    chart.options.scales.y.min = fromRange.min + (toRange.min - fromRange.min) * eased
    chart.options.scales.y.max = fromRange.max + (toRange.max - fromRange.max) * eased
    chart.update('none')

    if (progress < 1) {
      metricAnimationFrame = requestAnimationFrame(step)
    } else {
      dataset.data = toData
      isPeriodTransitioning = false
      chart.options.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
      chart.update('none')
    }
  }

  metricAnimationFrame = requestAnimationFrame(step)
}

watch(selectedPeriod, (period) => animatePeriodRange(period))
watch(selectedMetric, (metric, previousMetric) => animateMetricChange(metric, previousMetric))
watch(isDark, () => {
  if (!performanceChart) return

  const fromGridColor = performanceChart.options.scales.y.grid.color
  const toGridColor = getCssColor('--p-content-border-color', '#3a3a44')
  performanceChart.stop()
  updatePerformanceChart({ animate: false, gridColor: fromGridColor })
  animateThemeGridColor(fromGridColor, toGridColor)
})
onMounted(() => {
  renderPerformanceChart()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(periodAnimationFrame)
  cancelAnimationFrame(metricAnimationFrame)
  if (crosshairRafId) cancelAnimationFrame(crosshairRafId)
  cancelAnimationFrame(themeGridAnimationFrame)
  performanceChart?.destroy()
})

const stats = [
  { label: 'TPI', value: '—', sub: 'Top 0.15%' },
  { label: 'Performance', value: '—', sub: '#124 Global' },
  { label: 'Accuracy', value: '—', sub: '#421 Global' },
  { label: 'Playcount', value: '—', sub: '#213 Global' }
]

const skillProfileRows = [
  { label: 'Aim', icon: Crosshair, color: '#FF4FA3', min: '88', max: '99', avg: '96.3' },
  { label: 'Speed', icon: Zap, color: '#A855F7', min: '86', max: '98', avg: '94.1' },
  { label: 'Accuracy', icon: Target, color: '#38BDF8', min: '90', max: '99', avg: '97.2' },
  { label: 'BPM', icon: Gauge, color: '#F97316', min: '—', max: '—', avg: '—' },
  { label: 'Stars', icon: Star, color: '#FBBF24', min: '—', max: '—', avg: '—' }
]

// Country flags are stored in assets/countries/{code}.png.
const country = {
  code: 'ru',
  name: 'Russia'
}

// Badge backgrounds and borders adapt through CSS color-mix().
const badges = [
  {
    label: 'Founder',
    color: '#f8894d',
    paths: [
      'M8 13a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
      'M8.5 10.5l-1 -2.5h-5.5l2.48 5.788a2 2 0 0 0 1.84 1.212h2.18',
      'M15.5 10.5l1 -2.5h5.5l-2.48 5.788a2 2 0 0 1 -1.84 1.212h-2.18'
    ]
  },
  {
    label: 'DMT Team',
    color: '#ac8bde',
    paths: [
      'M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0',
      'M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1',
      'M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0',
      'M17 10h2a2 2 0 0 1 2 2v1',
      'M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0',
      'M3 13v-1a2 2 0 0 1 2 -2h2'
    ]
  }
]
</script>

<template>
  <div class="profile-page">
    <!-- Profile header with avatar, metadata, and statistics. -->
    <section class="panel app-theme-surface profile-header">
      <div class="avatar-block">
        <div class="avatar-placeholder" />
      </div>

      <div class="meta-block">
        <div class="name-row">
          <h1 class="player-name">Player Name</h1>
        </div>

        <div class="country-row">
          <img class="country-flag" :src="`./src/assets/countries/${country.code}.png`" :alt="country.name" />
          <span class="country-name">{{ country.name }}</span>
        </div>

        <div class="badges-row">
          <Badge
            v-for="badge in badges"
            :key="badge.label"
            v-bind="badge"
          />
        </div>
      </div>

      <div class="stats-block">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-sub">{{ stat.sub }}</span>
        </div>
      </div>
    </section>

    <!-- First row: Skill Profile, Mod Performance, and Info. -->
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
            aria-label="Chart period"
          />
          <div class="metric-toggle" role="group" aria-label="Chart metric">
            <button
              type="button"
              class="metric-button"
              :class="{ 'metric-button-active': selectedMetric === 'pp' }"
              @click="selectedMetric = 'pp'"
            >PP</button>
            <button
              type="button"
              class="metric-button"
              :class="{ 'metric-button-active': selectedMetric === 'rank' }"
              @click="selectedMetric = 'rank'"
            >Rank</button>
          </div>
        </div>
      </div>
      <div class="performance-content">
        <div class="performance-metrics">
          <div class="performance-metric">
            <span class="performance-metric-label">Current PP</span>
            <span class="performance-metric-value">
              {{ formatMetricNumber(currentPp) }}
              <small class="performance-metric-delta" :class="deltaClass(ppDelta)">({{ formatDelta(ppDelta) }})</small>
            </span>
          </div>
          <div class="performance-metric">
            <span class="performance-metric-label">Global Rank</span>
            <span class="performance-metric-value">
              #{{ formatMetricNumber(currentRank) }}
              <small class="performance-metric-delta" :class="deltaClass(rankDelta)">({{ formatDelta(rankDelta) }})</small>
            </span>
          </div>
        </div>
        <div class="performance-chart-placeholder">
          <canvas ref="chartCanvas" />
        </div>
      </div>
    </section>

    <section class="grid-row">
      <div class="panel app-theme-surface">
        <h2 class="panel-title">Skill Profile</h2>
        <div class="skill-profile-table" role="table" aria-label="Skill profile">
          <div class="skill-profile-row skill-profile-header" role="row">
            <span role="columnheader"></span>
            <span role="columnheader">Min</span>
            <span role="columnheader">Avg</span>
            <span role="columnheader">Max</span>
          </div>
          <div
            v-for="skill in skillProfileRows"
            :key="skill.label"
            class="skill-profile-row"
            role="row"
          >
            <span class="skill-profile-name" role="rowheader">
              <component
                :is="skill.icon"
                :size="18"
                :stroke-width="2"
                :style="{ color: skill.color }"
                aria-hidden="true"
              />
              {{ skill.label }}
            </span>
            <span role="cell">{{ skill.min }}</span>
            <span role="cell">{{ skill.avg }}</span>
            <span role="cell">{{ skill.max }}</span>
          </div>
        </div>
      </div>
      <div class="panel app-theme-surface">
        <h2 class="panel-title">Tournament Duel Rating</h2>
        <div class="panel-placeholder" />
      </div>
    </section>

    <section class="grid-row">
      <div class="panel app-theme-surface">
        <h2 class="panel-title">Skillset Profile</h2>
        <div class="panel-placeholder" />
      </div>
      <div class="panel app-theme-surface">
        <h2 class="panel-title">Top Plays</h2>
        <div class="panel-placeholder" />
      </div>
    </section>

    <section class="panel app-theme-surface panel-tournament-experience">
      <h2 class="panel-title">Tournament Experience</h2>
      <div class="experience-placeholders">
        <div class="panel-placeholder" />
        <div class="panel-placeholder" />
        <div class="panel-placeholder" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

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
  transition: background-color 160ms ease, transform 160ms ease;
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
  transition: border-color 160ms ease, box-shadow 160ms ease;
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
  transition: background-color 140ms ease, color 140ms ease;
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
  /* Match global selector specificity to preserve compositor-only tooltip transforms. */
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

.panel-tournament-experience {
  min-height: 390px;
}

.experience-placeholders {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 1fr;
  gap: 16px;
}

.experience-placeholders .panel-placeholder {
  min-height: 250px;
}

.panel-placeholder {
  min-height: 280px;
  border-radius: 10px;
  background: var(--p-content-hover-background);
  border: 1px dashed var(--p-content-border-color);
}

.skill-profile-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: min(100%, 420px);
  min-height: 0;
  color: var(--p-text-muted-color);
  font-size: 15px;
}

.skill-profile-row {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(42px, 0.7fr));
  align-items: center;
  min-height: 48px;
  border-bottom: 1px solid color-mix(in srgb, var(--p-content-border-color) 45%, transparent);
}

.skill-profile-header {
  min-height: 34px;
  border-bottom: 0;
  color: var(--p-text-muted-color);
  font-size: 13px;
  text-align: right;
}

.skill-profile-row:not(.skill-profile-header) {
  color: var(--p-text-color);
}

.skill-profile-header span:first-child {
  text-align: left;
}

.skill-profile-row > span:not(:first-child) {
  text-align: right;
}

.skill-profile-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--p-text-color);
  font-weight: 600;
  text-align: left !important;
}

.skill-profile-name svg {
  flex: 0 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 32px;
}

.avatar-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--p-content-hover-background);
  border: 3px solid var(--p-primary-color);
  flex: 0 0 auto;
}

.meta-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.player-name {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: var(--p-text-color);
}

.badges-row {
  display: flex;
  gap: 8px;
}

.country-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -6px;
}

.country-flag {
  width: 26px;
  height: 18px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
  flex: 0 0 auto;
}

.country-name {
  font-size: 18px;
  font-weight: 500;
  color: var(--p-text-color);
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.stats-block {
  display: flex;
  gap: 32px;
  flex: 0 0 auto;
  padding-right: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  padding-left: 28px;
  border-left: 1px solid var(--p-content-border-color);
}

.stat-item:first-child {
  padding-left: 0;
  border-left: none;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-color);
}

.stat-label {
  font-size: 13px;
  color: var(--p-text-muted-color);
}

.stat-sub {
  font-size: 11px;
  color: var(--p-text-muted-color);
}

.recent-matches-placeholder {
  min-height: 360px;
}

.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .grid-row,
  .experience-placeholders,
  .performance-content {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-block {
    flex-wrap: wrap;
    padding-right: 0;
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
