import { colors, radii, shadows, spacing, typography } from '../constants'

/** Injecte les tokens du design system sur :root */
export function applyDesignTokens(root: HTMLElement = document.documentElement): void {
  const set = (key: string, value: string) => root.style.setProperty(key, value)

  set('--color-black', colors.txt.BLACK)
  set('--color-text', colors.txt.BLACK)
  set('--color-text-muted', colors.txt.MUTED)
  set('--color-text-disabled', colors.txt.DISABLED)
  set('--color-white', colors.txt.WHITE)

  set('--color-surface', colors.bg.WHITE)
  set('--color-bg-primary', colors.bg.PRIMARY)
  set('--color-cream', colors.bg.CREAM)
  set('--color-cream-light', colors.bg.CREAM_LIGHT)
  set('--color-offwhite', colors.bg.OFFWHITE)
  set('--color-dark', colors.bg.DARKGREY)
  set('--color-peach', colors.bg.PEACH)
  set('--color-coral', colors.bg.CORAL)
  set('--color-peach-soft', colors.bg.PEACH_TRANSPARENT)
  set('--color-dark-orange-soft', colors.bg.DARKORANGE)

  set('--color-info-bg', colors.bg.LIGHTBLUE)
  set('--color-warning-bg', colors.bg.CREAM)
  set('--color-error-bg', colors.bg.LIGHTRED)
  set('--color-success-bg', colors.bg.SUCCESS)

  set('--color-border', colors.border.DEFAULT)
  set('--color-border-strong', colors.border.STRONG)
  set('--color-border-focus', colors.border.FOCUS)

  set('--color-primary', colors.accent.PRIMARY)
  set('--color-primary-hover', colors.accent.PRIMARY_HOVER)
  set('--color-primary-glow', colors.accent.PRIMARY_GLOW)
  set('--color-accent', colors.accent.ACCENT)
  set('--color-info', colors.accent.INFO)
  set('--color-warning', colors.accent.WARNING)
  set('--color-error', colors.accent.ERROR)
  set('--color-success', colors.accent.SUCCESS)
  set('--color-valid', colors.accent.SUCCESS)
  set('--color-expired', colors.accent.ERROR)

  set('--color-bg', colors.bg.CREAM)
  set('--gradient-coral', colors.gradient.CORAL)
  set('--gradient-sidebar', colors.gradient.SIDEBAR)
  set('--gradient-button', colors.gradient.BUTTON)
  set('--gradient-logo', colors.gradient.LOGO)

  set('--radius-sm', radii.sm)
  set('--radius-md', radii.md)
  set('--radius-lg', radii.lg)
  set('--radius-xl', radii.xl)
  set('--radius-pill', radii.pill)

  set('--space-1', spacing[1])
  set('--space-2', spacing[2])
  set('--space-3', spacing[3])
  set('--space-4', spacing[4])
  set('--space-5', spacing[5])
  set('--space-6', spacing[6])
  set('--space-7', spacing[7])
  set('--space-8', spacing[8])

  set('--font-sans', typography.fontSans)
  set('--shadow-card', shadows.card)
  set('--shadow-card-hover', shadows.cardHover)
  set('--shadow-button', shadows.button)
  set('--shadow-button-hover', shadows.buttonHover)
  set('--shadow-bottom-nav', shadows.bottomNav)
  set('--focus-ring', `0 0 8px ${colors.accent.PRIMARY_GLOW}`)
  set('--max-width', '1200px')
  set('--header-height', '72px')
}
