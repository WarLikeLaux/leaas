import type { Expense } from '@/types/expense'

export function getEndDate(expense: Expense): Date {
  const start = new Date(expense.startDate)
  start.setDate(start.getDate() + expense.lifespanDays)
  return start
}

export function isExpenseActive(expense: Expense): boolean {
  return getEndDate(expense) > new Date()
}

export function getRemainingDays(expense: Expense): number {
  const end = getEndDate(expense)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
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
