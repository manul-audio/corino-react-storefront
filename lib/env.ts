export const DEFAULT_MOONBASE_ENDPOINT = 'https://corino-demo.moonbase.sh'

/** Server-side only: resolved at request time so `next start` can be pointed elsewhere. */
export function resolveMoonbaseEndpoint(): string {
  const raw =
    process.env.MOONBASE_ENDPOINT ||
    process.env.NEXT_PUBLIC_MOONBASE_ENDPOINT ||
    DEFAULT_MOONBASE_ENDPOINT
  return raw.replace(/\/+$/, '')
}
