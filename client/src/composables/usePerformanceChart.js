import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { THEME_TRANSITION_DURATION, useTheme } from './useTheme'
import {
  createExternalTooltipHandler,
  getCssColor,
  getCssEase,
  parseColor,
} from '../utils/chartTooltip'
import { createCrosshairPlugin } from '../utils/chartCrosshairPlugin'

Chart.register(...registerables)

export function usePerformanceChart() {
  const chartCanvas = ref(null)
  const selectedPeriod = ref('threeMonths')
  const selectedMetric = ref('pp')
  const { isDark } = useTheme()
  let performanceChart
  let isPeriodTransitioning = false
  let periodAnimationFrame
  let metricAnimationFrame
  let themeGridAnimationFrame

  const periodOptions = [
    { label: 'Last Week', value: 'week' },
    { label: 'Last Month', value: 'month' },
    { label: 'Last 3 Months', value: 'threeMonths' },
    { label: 'Last Year', value: 'year' },
  ]
  const periodDays = {
    week: 7,
    month: 30,
    threeMonths: 90,
    year: 360,
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
      labels.push(date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }))
      offsets.push(-index)
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
  const activeChartData = () => masterChartData
  const externalTooltipHandler = createExternalTooltipHandler(
    activeChartData,
    () => selectedMetric.value,
  )
  const crosshairPlugin = createCrosshairPlugin(
    () => isPeriodTransitioning,
    (variable, fallback) => getCssColor(variable, fallback, chartCanvas),
  )

  function formatMetricNumber(value) {
    return new Intl.NumberFormat('en-US')
      .format(Math.abs(Math.round(value)))
      .replace(/,/g, ' ')
  }

  function formatDelta(value) {
    return `${value >= 0 ? '+' : '−'}${formatMetricNumber(value)}`
  }

  function deltaClass(value) {
    if (value > 0) return 'performance-metric-delta-positive'
    if (value < 0) return 'performance-metric-delta-negative'
    return 'performance-metric-delta-neutral'
  }

  function toPlotValue(metric, value) {
    return metric === 'rank' ? -value : value
  }

  function getChartRange(period = selectedPeriod.value) {
    return { min: -(periodDays[period] - 1), max: 0 }
  }

  function getTicksLimit(period = selectedPeriod.value) {
    if (period === 'year') return 12
    if (period === 'threeMonths') return 6
    if (period === 'month') return 6
    return 7
  }

  function getYRange(period, metric = selectedMetric.value) {
    const values = masterChartData[metric]
      .slice(-periodDays[period])
      .map((value) => toPlotValue(metric, value))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min || Math.max(Math.abs(max) * 0.1, 1)) * 0.1
    return { min: Math.floor(min - padding), max: Math.ceil(max + padding) }
  }

  function getFullDataset(metric = selectedMetric.value) {
    return masterChartData[metric].map((value, index) => ({
      x: masterChartData.offsets[index],
      y: toPlotValue(metric, value),
    }))
  }

  function getChartOptions(
    textColor,
    borderColor,
    range = getChartRange(),
    yRange = getYRange(selectedPeriod.value),
    { themeTransition = false } = {},
  ) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      transitions: { active: { animation: { duration: 0 } } },
      animation: { duration: themeTransition ? THEME_TRANSITION_DURATION : 1200, easing: 'ease' },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          mode: 'index',
          intersect: false,
          external: externalTooltipHandler,
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          type: 'linear',
          min: range.min,
          max: range.max,
          grid: { display: false },
          ticks: {
            color: textColor,
            callback: (value) => (
              masterChartData.labels[Math.round(Number(value) + periodDays.year - 1)]
                ?.replace(/, \d{4}$/, '') || value
            ),
            autoSkip: true,
            maxTicksLimit: getTicksLimit(),
            maxRotation: 0,
          },
        },
        y: {
          min: yRange.min,
          max: yRange.max,
          grid: { color: borderColor },
          ticks: {
            color: textColor,
            callback: (value) => Math.round(Math.abs(value)),
          },
        },
      },
    }
  }

  function renderPerformanceChart() {
    if (!chartCanvas.value) return
    performanceChart?.destroy()
    const primaryColor = getCssColor('--p-primary-color', '#ec4899', chartCanvas)
    const textColor = getCssColor('--p-text-muted-color', '#94a3b8', chartCanvas)
    const borderColor = getCssColor('--p-content-border-color', '#3a3a44', chartCanvas)
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
          tension: 0.35,
        }],
      },
      options: getChartOptions(textColor, borderColor),
      plugins: [crosshairPlugin],
    })
  }

  function updatePerformanceChart({ animate = true, themeTransition = false, gridColor } = {}) {
    const update = () => {
      if (!performanceChart) return renderPerformanceChart()
      const primaryColor = getCssColor('--p-primary-color', '#ec4899', chartCanvas)
      const textColor = getCssColor('--p-text-muted-color', '#94a3b8', chartCanvas)
      const borderColor = gridColor || getCssColor('--p-content-border-color', '#3a3a44', chartCanvas)
      performanceChart.data.datasets[0].data = getFullDataset()
      performanceChart.data.datasets[0].borderColor = primaryColor
      performanceChart.data.datasets[0].backgroundColor = `${primaryColor}22`
      performanceChart.options = getChartOptions(
        textColor,
        borderColor,
        {
          min: performanceChart.options.scales.x.min,
          max: performanceChart.options.scales.x.max,
        },
        getYRange(selectedPeriod.value, selectedMetric.value),
        { themeTransition },
      )
      performanceChart.update(themeTransition ? undefined : animate ? 'active' : 'none')
    }

    if (animate && !themeTransition) nextTick(update)
    else update()
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
    const target = getChartRange(period)
    const targetY = getYRange(period, selectedMetric.value)
    const fromMin = Number.isFinite(Number(scaleOptions.min)) ? Number(scaleOptions.min) : liveScale.min
    const fromMax = Number.isFinite(Number(scaleOptions.max)) ? Number(scaleOptions.max) : liveScale.max
    const fromYMin = Number.isFinite(Number(yScaleOptions.min)) ? Number(yScaleOptions.min) : liveYScale.min
    const fromYMax = Number.isFinite(Number(yScaleOptions.max)) ? Number(yScaleOptions.max) : liveYScale.max
    yScaleOptions.min = fromYMin
    yScaleOptions.max = fromYMax
    scaleOptions.ticks.maxTicksLimit = getTicksLimit(period)
    const start = performance.now()
    const ease = (value) => value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
    const step = (now) => {
      const progress = Math.min((now - start) / 650, 1)
      const eased = ease(progress)
      performanceChart.options.scales.x.min = fromMin + (target.min - fromMin) * eased
      performanceChart.options.scales.x.max = fromMax + (target.max - fromMax) * eased
      performanceChart.options.scales.y.min = fromYMin + (targetY.min - fromYMin) * eased
      performanceChart.options.scales.y.max = fromYMax + (targetY.max - fromYMax) * eased
      performanceChart.update('none')
      if (progress < 1) periodAnimationFrame = requestAnimationFrame(step)
      else {
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
    const start = performance.now()
    const ease = (value) => value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
    isPeriodTransitioning = true
    chart.options.events = []
    chart.setActiveElements([])
    chart.tooltip?.setActiveElements([], { x: 0, y: 0 })
    const step = (now) => {
      const progress = Math.min((now - start) / 650, 1)
      const eased = ease(progress)
      dataset.data = toData.map((point, index) => ({ x: point.x, y: fromData[index].y + (point.y - fromData[index].y) * eased }))
      chart.options.scales.y.min = fromRange.min + (toRange.min - fromRange.min) * eased
      chart.options.scales.y.max = fromRange.max + (toRange.max - fromRange.max) * eased
      chart.update('none')
      if (progress < 1) metricAnimationFrame = requestAnimationFrame(step)
      else {
        dataset.data = toData
        isPeriodTransitioning = false
        chart.options.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
        chart.update('none')
      }
    }
    metricAnimationFrame = requestAnimationFrame(step)
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
      const interpolate = (first, second) => first + (second - first) * eased
      performanceChart.options.scales.y.grid.color = `rgba(${Math.round(interpolate(from.red, to.red))}, ${Math.round(interpolate(from.green, to.green))}, ${Math.round(interpolate(from.blue, to.blue))}, ${interpolate(from.alpha, to.alpha)})`
      performanceChart.update('none')
      if (progress < 1) themeGridAnimationFrame = requestAnimationFrame(step)
      else performanceChart.options.scales.y.grid.color = toColor
    }
    themeGridAnimationFrame = requestAnimationFrame(step)
  }

  watch(selectedPeriod, (period) => animatePeriodRange(period))
  watch(selectedMetric, (metric, previousMetric) => animateMetricChange(metric, previousMetric))
  watch(isDark, () => {
    if (!performanceChart) return
    const fromGridColor = performanceChart.options.scales.y.grid.color
    const toGridColor = getCssColor('--p-content-border-color', '#3a3a44', chartCanvas)
    performanceChart.stop()
    updatePerformanceChart({ animate: false, gridColor: fromGridColor })
    animateThemeGridColor(fromGridColor, toGridColor)
  })
  onMounted(renderPerformanceChart)
  onBeforeUnmount(() => {
    cancelAnimationFrame(periodAnimationFrame)
    cancelAnimationFrame(metricAnimationFrame)
    cancelAnimationFrame(themeGridAnimationFrame)
    performanceChart?.destroy()
  })

  return {
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
    deltaClass,
  }
}

