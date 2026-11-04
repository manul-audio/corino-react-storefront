export function formatCurrency(amount: number, currency: string): string {
  const whole = amount % 1 === 0
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    maximumFractionDigits: whole ? 0 : undefined,
    minimumFractionDigits: whole ? 0 : 2,
  }
  try {
    return new Intl.NumberFormat(undefined, { ...options, currencyDisplay: 'narrowSymbol' }).format(amount)
  } catch {
    return new Intl.NumberFormat(undefined, { ...options, currencyDisplay: 'symbol' }).format(amount)
  }
}
