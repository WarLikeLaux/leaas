import { DAYS_IN_MONTH, DAYS_IN_YEAR, type Period } from '@/types/expense'

export function lifespanToDays(value: number, period: Period): number {
  if (period === 'months') return Math.round(value * DAYS_IN_MONTH)
  if (period === 'years') return Math.round(value * DAYS_IN_YEAR)
  return value
}

export function calculateDailyCost(cost: number, lifespanDays: number): number {
  if (lifespanDays <= 0) return 0
  return cost / lifespanDays
}

export function calculateMonthlyCost(cost: number, lifespanDays: number): number {
  return calculateDailyCost(cost, lifespanDays) * DAYS_IN_MONTH
}

export function calculateYearlyCost(cost: number, lifespanDays: number): number {
  return calculateDailyCost(cost, lifespanDays) * DAYS_IN_YEAR
}

export function formatMoney(value: number): string {
  if (value < 1) return value.toFixed(2)

  const fractionDigits = value < 10 ? 2 : 0
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatLifespan(days: number): string {
  if (days < DAYS_IN_MONTH) return `${days} дн.`

  if (days < DAYS_IN_YEAR) {
    const months = Math.round(days / DAYS_IN_MONTH)
    return `${months} мес.`
  }

  const years = days / DAYS_IN_YEAR
  const rounded = Math.round(years * 10) / 10
  return `${rounded} г.`
}
