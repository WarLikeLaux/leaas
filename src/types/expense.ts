export interface Expense {
  id: string
  name: string
  cost: number
  lifespanMin: number
  lifespanMax: number
  lifespanDaysMin: number
  lifespanDaysMax: number
  lifespanPeriod: Period
  category: ExpenseCategory
  startDate: string
  replacementCount: number
  createdAt: string
}

export type ExpenseCategory =
  | 'food'
  | 'household'
  | 'clothing'
  | 'tech'
  | 'transport'
  | 'health'
  | 'subscriptions'
  | 'entertainment'
  | 'beauty'
  | 'education'
  | 'sports'
  | 'other'

export type Period = 'days' | 'months' | 'years'

export const PERIODS: Period[] = ['days', 'months', 'years']

export const DAYS_IN_MONTH = 30.44
export const DAYS_IN_YEAR = 365.25

export function isPeriod(value: unknown): value is Period {
  return typeof value === 'string' && PERIODS.some((p) => p === value)
}

export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return typeof value === 'string' && CATEGORIES.some((c) => c.value === value)
}

export interface CategoryInfo {
  value: ExpenseCategory
  label: string
  icon: string
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'food', label: 'Еда', icon: '🍞' },
  { value: 'household', label: 'Быт', icon: '🏠' },
  { value: 'clothing', label: 'Одежда', icon: '👕' },
  { value: 'tech', label: 'Техника', icon: '💻' },
  { value: 'transport', label: 'Транспорт', icon: '🚗' },
  { value: 'health', label: 'Здоровье', icon: '💊' },
  { value: 'subscriptions', label: 'Подписки', icon: '📱' },
  { value: 'entertainment', label: 'Развлечения', icon: '🎮' },
  { value: 'beauty', label: 'Красота', icon: '💅' },
  { value: 'education', label: 'Образование', icon: '📚' },
  { value: 'sports', label: 'Спорт', icon: '🏋️' },
  { value: 'other', label: 'Другое', icon: '📦' },
]

export function getCategoryInfo(category: ExpenseCategory): CategoryInfo {
  return (
    CATEGORIES.find((c) => c.value === category) ?? {
      value: 'other',
      label: 'Другое',
      icon: '📦',
    }
  )
}
