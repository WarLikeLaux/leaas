import type { Expense } from '@/types/expense'

export function getEndDateMin(expense: Expense): Date {
  const start = new Date(expense.startDate)
  start.setDate(start.getDate() + expense.lifespanDaysMin)
  return start
}

export function getEndDateMax(expense: Expense): Date {
  const start = new Date(expense.startDate)
  start.setDate(start.getDate() + expense.lifespanDaysMax)
  return start
}

export type ExpenseStatus = 'active' | 'warning' | 'expired'

export function getExpenseStatus(expense: Expense): ExpenseStatus {
  const now = new Date()
  if (now > getEndDateMax(expense)) return 'expired'
  if (now > getEndDateMin(expense)) return 'warning'
  return 'active'
}

export function isExpenseActive(expense: Expense): boolean {
  return getExpenseStatus(expense) !== 'expired'
}

export function getRemainingDaysRange(expense: Expense): { min: number; max: number } {
  const now = new Date()
  const diffMin = getEndDateMin(expense).getTime() - now.getTime()
  const diffMax = getEndDateMax(expense).getTime() - now.getTime()
  return {
    min: Math.max(0, Math.ceil(diffMin / (1000 * 60 * 60 * 24))),
    max: Math.max(0, Math.ceil(diffMax / (1000 * 60 * 60 * 24))),
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatShortDate(date: Date): string {
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}
