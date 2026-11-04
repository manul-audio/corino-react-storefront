import { Platform, type Download } from '@moonbase.sh/react'

export const platformOrder: Platform[] = [Platform.Windows, Platform.Mac, Platform.Linux, Platform.Universal]

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return Platform.Universal
  const p = (navigator.platform ?? 'Unknown').toLowerCase()
  if (/mac/.test(p)) return Platform.Mac
  if (/win/.test(p)) return Platform.Windows
  if (/linux/.test(p)) return Platform.Linux
  return Platform.Universal
}

/** Current platform first, then the rest in a fixed order. */
export function sortDownloads(downloads: Download[], current: Platform): Download[] {
  const ordered = [current, ...platformOrder.filter((p) => p !== current)]
  return ordered.flatMap((p) => downloads.filter((d) => d.platform === p))
}
