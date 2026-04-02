import { computed, watchEffect } from 'vue'

export function useThemeColor(hexColor: string) {
  // Parse hex ke RGB
  function hexToRgb(hex: string) {
    const h = hex.replace('#', '')
    const r = parseInt(h.slice(0,2), 16)
    const g = parseInt(h.slice(2,4), 16)
    const b = parseInt(h.slice(4,6), 16)
    return { r, g, b }
  }

  function adjust(hex: string, amt: number): string {
    try {
      const { r, g, b } = hexToRgb(hex)
      const nr = Math.min(255, Math.max(0, r + amt))
      const ng = Math.min(255, Math.max(0, g + amt))
      const nb = Math.min(255, Math.max(0, b + amt))
      return `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`
    } catch { return hex }
  }

  function toRgbStr(hex: string): string {
    try {
      const { r, g, b } = hexToRgb(hex)
      return `${r},${g},${b}`
    } catch { return '168,197,216' }
  }

  // Apply CSS variables ke :root
  function applyTheme(color: string) {
    const root = document.documentElement
    const rgb = toRgbStr(color)
    const light = adjust(color, 40)
    const lighter = adjust(color, 65)
    const dark = adjust(color, -50)
    const darker = adjust(color, -80)

    root.style.setProperty('--theme-primary', color)
    root.style.setProperty('--theme-light', light)
    root.style.setProperty('--theme-lighter', lighter)
    root.style.setProperty('--theme-dark', dark)
    root.style.setProperty('--theme-darker', darker)
    root.style.setProperty('--theme-rgb', rgb)
    root.style.setProperty('--theme-bg-start', adjust(light, 20))
    root.style.setProperty('--theme-bg-end', lighter)
    root.style.setProperty('--theme-text', darker)
    root.style.setProperty('--theme-text-muted', dark + 'aa')
    root.style.setProperty('--theme-border', color + '44')
    root.style.setProperty('--theme-shadow', `rgba(${rgb},0.2)`)
    root.style.setProperty('--theme-btn-bg', dark)
    root.style.setProperty('--theme-btn-text', '#ffffff')
    // Background gradient
    root.style.setProperty('--theme-gradient',
      `linear-gradient(160deg, ${adjust(light,15)}cc 0%, ${light}99 35%, ${adjust(lighter,10)}ee 65%, ${adjust(light,5)}bb 100%)`)
    root.style.setProperty('--theme-section-alt',
      `linear-gradient(180deg, ${lighter}ee 0%, ${adjust(lighter,8)}ff 100%)`)
    root.style.setProperty('--theme-countdown-bg',
      `linear-gradient(180deg, ${dark} 0%, ${adjust(dark,-20)} 100%)`)
  }

  return { applyTheme, adjust, toRgbStr }
}
