export function getCssColor(variable, fallback, elementRef) {
  const element = elementRef?.value?.parentElement || document.body;
  return getComputedStyle(element).getPropertyValue(variable).trim() || fallback;
}

export function parseColor(color) {
  const value = color.trim();
  const hex = value.match(/^#([\da-f]{3,8})$/i)?.[1];

  if (hex) {
    const expanded = hex.length <= 4 ? [...hex].map((character) => character.repeat(2)).join('') : hex;

    return {
      red: Number.parseInt(expanded.slice(0, 2), 16),
      green: Number.parseInt(expanded.slice(2, 4), 16),
      blue: Number.parseInt(expanded.slice(4, 6), 16),
      alpha: expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1
    };
  }

  const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);

  if (!rgb) return null;

  return {
    red: Number(rgb[1]),
    green: Number(rgb[2]),
    blue: Number(rgb[3]),
    alpha: rgb[4] === undefined ? 1 : Number(rgb[4])
  };
}

export function getCssEase(progress) {
  const sample = (time, first, second) => 3 * (1 - time) ** 2 * time * first + 3 * (1 - time) * time ** 2 * second + time ** 3;
  let lower = 0;
  let upper = 1;

  for (let index = 0; index < 12; index += 1) {
    const time = (lower + upper) / 2;
    if (sample(time, 0.25, 0.25) < progress) lower = time;
    else upper = time;
  }

  return sample((lower + upper) / 2, 0.1, 1);
}

export function createExternalTooltipHandler(getActiveChartData, getSelectedMetric, getQualityDelta) {
  return ({ chart, tooltip }) => {
    const parent = chart.canvas.parentNode;
    let element = parent.querySelector('.performance-tooltip');

    if (!element) {
      element = document.createElement('div');
      element.className = 'performance-tooltip';
      parent.appendChild(element);
    }

    if (tooltip.opacity === 0) {
      element.style.opacity = '0';
      return;
    }

    const CHEVRON_UP = `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="performance-tooltip-chevron"><path d="m18 15-6-6-6 6" /></svg>`
    const CHEVRON_DOWN = `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="performance-tooltip-chevron"><path d="m6 9 6 6 6-6" /></svg>`
    const index = tooltip.dataPoints?.[0]?.dataIndex;
    const data = getActiveChartData();
    const metric = getSelectedMetric();
    const isRank = metric === 'rank';
    const values = data?.[metric] || [];
    const value = values[index];
    const previous = index > 0 ? values[index - 1] : value;
    const rawChange = value - previous;
    const change = getQualityDelta(metric, rawChange);
    const magnitude = Math.abs(rawChange);
    const sign = change > 0 ? '+' : '';
    const deltaClass = change > 0 ? 'is-positive' : change < 0 ? 'is-negative' : 'is-neutral';
    const changeMarkup = isRank ? (change > 0 ? CHEVRON_UP : change < 0 ? CHEVRON_DOWN : '') : ''

    element.innerHTML = `
      <span class="performance-tooltip-date">${data.labels[index]}</span>
      <span class="performance-tooltip-value">${isRank ? 'Rank' : 'PP'}: ${isRank ? `#${value}` : value}</span>
      <span class="performance-tooltip-change">
        <span class="performance-tooltip-change-label">Change:</span>
        <span class="performance-tooltip-change-value ${deltaClass}">${changeMarkup}${isRank ? magnitude : `${sign}${change}pp`}</span>
      </span>
    `;
    element.style.opacity = '1';
    element.style.transform = `translate3d(calc(${tooltip.caretX}px - 50%), calc(${tooltip.caretY}px - 100% - 12px), 0)`;
  };
}
