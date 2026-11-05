export const DEFAULT_MOONBASE_ENDPOINT = 'https://corino-demo.moonbase.sh'

/** Server-side only: resolved at request time so `next start` can be pointed elsewhere. */
export function resolveMoonbaseEndpoint(): string {
  const raw =
    process.env.MOONBASE_ENDPOINT ||
    process.env.NEXT_PUBLIC_MOONBASE_ENDPOINT ||
    DEFAULT_MOONBASE_ENDPOINT
  return raw.replace(/\/+$/, '')
}

export type DefaultUiMode = 'default' | 'embedded'

/**
 * Server-side only: which storefront UI a first-time visitor sees. `CORINO_UI=embedded`
 * starts on Moonbase's embedded storefront; anything else starts on this site's own UI.
 * Visitors can switch in the footer and their choice is remembered.
 */
export function resolveDefaultUiMode(): DefaultUiMode {
  return process.env.CORINO_UI === 'embedded' ? 'embedded' : 'default'
}
