import { DAYS_IN_MONTH, DAYS_IN_YEAR, type Period } from '@/types/expense'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'

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

export function formatMoneyRange(min: number, max: number): string {
  if (Math.abs(min - max) < 0.5) return formatMoney(min)
  return `${formatMoney(min)} - ${formatMoney(max)}`
}

export function formatLifespan(days: number): string {
  if (days < DAYS_IN_MONTH) return `${days} ${pluralizeDays(days)}`

  if (days < DAYS_IN_YEAR) {
    const months = Math.round(days / DAYS_IN_MONTH)
    return `${months} ${pluralizeMonths(months)}`
  }

  const years = days / DAYS_IN_YEAR
  const rounded = Math.round(years * 10) / 10
  return `${rounded} ${pluralizeYears(rounded)}`
}

export function formatLifespanRange(daysMin: number, daysMax: number): string {
  if (daysMin === daysMax) return formatLifespan(daysMin)
  return `${formatLifespan(daysMin)} - ${formatLifespan(daysMax)}`
}
