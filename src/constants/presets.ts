import type { ExpenseCategory, Period } from '@/types/expense'
import { lifespanToDays } from '@/utils/calculations'

export interface ExpensePreset {
  name: string
  cost: number
  lifespanDays: number
  category: ExpenseCategory
}

export interface LifespanPreset {
  label: string
  value: number
  period: Period
}

interface PresetSource {
  name: string
  cost: number
  lifespan: number
  period: Period
  category: ExpenseCategory
}

const PRESET_SOURCES: PresetSource[] = [
  { name: 'Хлеб', cost: 60, lifespan: 3, period: 'days', category: 'food' },
  {
    name: 'Молоко',
    cost: 90,
    lifespan: 5,
    period: 'days',
    category: 'food',
  },
  {
    name: 'Зубная щётка',
    cost: 200,
    lifespan: 3,
    period: 'months',
    category: 'household',
  },
  {
    name: 'Стрижка',
    cost: 1500,
    lifespan: 1,
    period: 'months',
    category: 'other',
  },
  {
    name: 'Кроссовки',
    cost: 8000,
    lifespan: 1,
    period: 'years',
    category: 'clothing',
  },
  {
    name: 'Смартфон',
    cost: 50000,
    lifespan: 2,
    period: 'years',
    category: 'tech',
  },
  {
    name: 'Ноутбук',
    cost: 80000,
    lifespan: 5,
    period: 'years',
    category: 'tech',
  },
]

export const EXPENSE_PRESETS: ExpensePreset[] = PRESET_SOURCES.map((s) => ({
  name: s.name,
  cost: s.cost,
  lifespanDays: lifespanToDays(s.lifespan, s.period),
  category: s.category,
}))

export const LIFESPAN_PRESETS: LifespanPreset[] = [
  { label: '3 дня', value: 3, period: 'days' },
  { label: 'неделя', value: 7, period: 'days' },
  { label: 'месяц', value: 1, period: 'months' },
  { label: '3 месяца', value: 3, period: 'months' },
  { label: '6 месяцев', value: 6, period: 'months' },
  { label: 'год', value: 1, period: 'years' },
  { label: '2 года', value: 2, period: 'years' },
  { label: '5 лет', value: 5, period: 'years' },
  { label: '10 лет', value: 10, period: 'years' },
]
