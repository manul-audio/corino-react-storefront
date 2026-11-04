import { DISPLAY_LOCALE } from './format-currency'

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString(DISPLAY_LOCALE, { year: 'numeric', month: 'short', day: 'numeric' })
}
