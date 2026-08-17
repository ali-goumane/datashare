export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || Number.isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} o`
  const units = ['Ko', 'Mo', 'Go', 'To']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const decimals = value >= 100 ? 0 : 1
  return `${value.toFixed(decimals).replace('.', ',')} ${units[unitIndex]}`
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function daysUntil(value: string | Date | null | undefined): number {
  if (!value) return 0
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return 0
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function getErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  return fallback
}
