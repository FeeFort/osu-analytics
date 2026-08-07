export const CROSSHAIR_EASE = 0.22;
export const CROSSHAIR_SNAP_EPSILON = 0.4;

let crosshairCurrent = null;
let crosshairTarget = null;
let crosshairRafId = null;

export function stepCrosshair(chart) {
  if (!crosshairCurrent || !crosshairTarget) {
    crosshairRafId = null;
    return;
  }

  const dx = crosshairTarget.x - crosshairCurrent.x;
  const dy = crosshairTarget.y - crosshairCurrent.y;

  if (Math.abs(dx) < CROSSHAIR_SNAP_EPSILON && Math.abs(dy) < CROSSHAIR_SNAP_EPSILON) {
    crosshairCurrent = { ...crosshairTarget };
    crosshairRafId = null;
    chart.draw();
    return;
  }

  crosshairCurrent = {
    x: crosshairCurrent.x + dx * CROSSHAIR_EASE,
    y: crosshairCurrent.y + dy * CROSSHAIR_EASE
  };
  chart.draw();
  crosshairRafId = requestAnimationFrame(() => stepCrosshair(chart));
}

export function createCrosshairPlugin(getIsPeriodTransitioning, getCssColor) {
  return {
    id: 'performanceCrosshair',
    afterDraw(chart) {
      if (getIsPeriodTransitioning()) return;

      const activeElements = chart.getActiveElements();
      if (!activeElements.length) {
        crosshairCurrent = null;
        crosshairTarget = null;
        if (crosshairRafId) cancelAnimationFrame(crosshairRafId);
        crosshairRafId = null;
        return;
      }

      const element = activeElements[0].element;
      const rawPosition = element.tooltipPosition ? element.tooltipPosition() : element;
      crosshairTarget = { x: rawPosition.x, y: rawPosition.y };

      if (!crosshairCurrent) {
        crosshairCurrent = { ...crosshairTarget };
      } else if (!crosshairRafId) {
        const dx = crosshairTarget.x - crosshairCurrent.x;
        const dy = crosshairTarget.y - crosshairCurrent.y;
        if (Math.abs(dx) >= CROSSHAIR_SNAP_EPSILON || Math.abs(dy) >= CROSSHAIR_SNAP_EPSILON) {
          crosshairRafId = requestAnimationFrame(() => stepCrosshair(chart));
        }
      }

      const { top, bottom } = chart.chartArea;
      const context = chart.ctx;
      const position = crosshairCurrent;

      context.save();
      context.strokeStyle = getCssColor('--p-text-muted-color', '#94a3b8');
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(position.x, top);
      context.lineTo(position.x, bottom);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = getCssColor('--p-content-background', '#ffffff');
      context.beginPath();
      context.arc(position.x, position.y, 5.5, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = getCssColor('--p-primary-color', '#ec4899');
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(position.x, position.y, 5.5, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
  };
}
