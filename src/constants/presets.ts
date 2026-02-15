import type { ExpenseCategory, Period } from '@/types/expense'
import { lifespanToDays } from '@/utils/calculations'

export interface ExpensePreset {
  name: string
  cost: number
  lifespanMin: number
  lifespanMax: number
  lifespanDaysMin: number
  lifespanDaysMax: number
  lifespanPeriod: Period
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
  min: number
  max: number
  period: Period
  category: ExpenseCategory
}

const PRESET_SOURCES: PresetSource[] = [
  { name: 'Хлеб', cost: 60, min: 2, max: 4, period: 'days', category: 'food' },
  { name: 'Молоко', cost: 90, min: 4, max: 7, period: 'days', category: 'food' },
  { name: 'Кофе (пачка)', cost: 600, min: 3, max: 5, period: 'days', category: 'food' },
  { name: 'Мясо (кг)', cost: 500, min: 2, max: 4, period: 'days', category: 'food' },
  { name: 'Губка для посуды', cost: 50, min: 1, max: 3, period: 'months', category: 'household' },
  { name: 'Зубная щётка', cost: 200, min: 2, max: 3, period: 'months', category: 'household' },
  { name: 'Зубная паста', cost: 250, min: 1, max: 3, period: 'months', category: 'household' },
  { name: 'Шампунь', cost: 400, min: 1, max: 3, period: 'months', category: 'household' },
  {
    name: 'Стиральный порошок',
    cost: 600,
    min: 2,
    max: 4,
    period: 'months',
    category: 'household',
  },
  { name: 'Полотенце', cost: 800, min: 1, max: 2, period: 'years', category: 'household' },
  { name: 'Постельное бельё', cost: 3000, min: 1, max: 3, period: 'years', category: 'household' },
  { name: 'Футболка', cost: 1500, min: 6, max: 18, period: 'months', category: 'clothing' },
  { name: 'Джинсы', cost: 5000, min: 1, max: 3, period: 'years', category: 'clothing' },
  { name: 'Кроссовки', cost: 8000, min: 6, max: 18, period: 'months', category: 'clothing' },
  { name: 'Куртка', cost: 15000, min: 2, max: 5, period: 'years', category: 'clothing' },
  { name: 'Носки (пара)', cost: 200, min: 3, max: 8, period: 'months', category: 'clothing' },
  { name: 'Смартфон', cost: 50000, min: 2, max: 4, period: 'years', category: 'tech' },
  { name: 'Ноутбук', cost: 80000, min: 3, max: 6, period: 'years', category: 'tech' },
  { name: 'Наушники', cost: 5000, min: 1, max: 3, period: 'years', category: 'tech' },
  { name: 'Чехол для телефона', cost: 1000, min: 6, max: 18, period: 'months', category: 'tech' },
  { name: 'Клавиатура', cost: 4000, min: 2, max: 5, period: 'years', category: 'tech' },
  { name: 'Проезд (месяц)', cost: 3000, min: 1, max: 1, period: 'months', category: 'transport' },
  { name: 'Бензин (бак)', cost: 3500, min: 5, max: 10, period: 'days', category: 'transport' },
  { name: 'ТО автомобиля', cost: 15000, min: 6, max: 12, period: 'months', category: 'transport' },
  { name: 'Витамины', cost: 1200, min: 1, max: 1, period: 'months', category: 'health' },
  { name: 'Визит к врачу', cost: 3000, min: 6, max: 12, period: 'months', category: 'health' },
  { name: 'Линзы', cost: 2000, min: 1, max: 1, period: 'months', category: 'health' },
  {
    name: 'YouTube Premium',
    cost: 250,
    min: 1,
    max: 1,
    period: 'months',
    category: 'subscriptions',
  },
  { name: 'Spotify', cost: 200, min: 1, max: 1, period: 'months', category: 'subscriptions' },
  {
    name: 'Облачное хранилище',
    cost: 150,
    min: 1,
    max: 1,
    period: 'months',
    category: 'subscriptions',
  },
  { name: 'VPN', cost: 300, min: 1, max: 1, period: 'months', category: 'subscriptions' },
  { name: 'Кино', cost: 500, min: 5, max: 10, period: 'days', category: 'entertainment' },
  {
    name: 'Настольная игра',
    cost: 2500,
    min: 2,
    max: 5,
    period: 'years',
    category: 'entertainment',
  },
  { name: 'Стрижка', cost: 1500, min: 3, max: 6, period: 'days', category: 'beauty' },
  { name: 'Крем для лица', cost: 800, min: 1, max: 3, period: 'months', category: 'beauty' },
  { name: 'Онлайн-курс', cost: 5000, min: 3, max: 6, period: 'months', category: 'education' },
  { name: 'Книга', cost: 700, min: 1, max: 3, period: 'months', category: 'education' },
  { name: 'Абонемент в зал', cost: 3000, min: 1, max: 1, period: 'months', category: 'sports' },
  { name: 'Протеин', cost: 2500, min: 1, max: 1, period: 'months', category: 'sports' },
]

export const EXPENSE_PRESETS: ExpensePreset[] = PRESET_SOURCES.map((s) => ({
  name: s.name,
  cost: s.cost,
  lifespanMin: s.min,
  lifespanMax: s.max,
  lifespanDaysMin: lifespanToDays(s.min, s.period),
  lifespanDaysMax: lifespanToDays(s.max, s.period),
  lifespanPeriod: s.period,
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
