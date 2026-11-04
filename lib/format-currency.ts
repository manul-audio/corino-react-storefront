/**
 * Locale for every displayed price and date. The site's copy is English and the
 * server and the browser must produce identical output byte for byte, or React
 * discards the server HTML on hydration.
 */
export const DISPLAY_LOCALE = 'en-US'

export function formatCurrency(amount: number, currency: string): string {
  const whole = amount % 1 === 0
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    maximumFractionDigits: whole ? 0 : undefined,
    minimumFractionDigits: whole ? 0 : 2,
  }
  try {
    return new Intl.NumberFormat(DISPLAY_LOCALE, { ...options, currencyDisplay: 'narrowSymbol' }).format(amount)
  } catch {
    return new Intl.NumberFormat(DISPLAY_LOCALE, { ...options, currencyDisplay: 'symbol' }).format(amount)
  }
}
