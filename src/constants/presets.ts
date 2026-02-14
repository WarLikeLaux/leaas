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
  { name: 'Молоко', cost: 90, lifespan: 5, period: 'days', category: 'food' },
  { name: 'Кофе (пачка)', cost: 600, lifespan: 1, period: 'months', category: 'food' },
  { name: 'Мясо (кг)', cost: 500, lifespan: 3, period: 'days', category: 'food' },
  { name: 'Губка для посуды', cost: 50, lifespan: 2, period: 'months', category: 'household' },
  { name: 'Зубная щётка', cost: 200, lifespan: 3, period: 'months', category: 'household' },
  { name: 'Зубная паста', cost: 250, lifespan: 2, period: 'months', category: 'household' },
  { name: 'Шампунь', cost: 400, lifespan: 2, period: 'months', category: 'household' },
  { name: 'Стиральный порошок', cost: 600, lifespan: 3, period: 'months', category: 'household' },
  { name: 'Полотенце', cost: 800, lifespan: 1, period: 'years', category: 'household' },
  { name: 'Постельное бельё', cost: 3000, lifespan: 2, period: 'years', category: 'household' },
  { name: 'Футболка', cost: 1500, lifespan: 1, period: 'years', category: 'clothing' },
  { name: 'Джинсы', cost: 5000, lifespan: 2, period: 'years', category: 'clothing' },
  { name: 'Кроссовки', cost: 8000, lifespan: 1, period: 'years', category: 'clothing' },
  { name: 'Куртка', cost: 15000, lifespan: 3, period: 'years', category: 'clothing' },
  { name: 'Носки (пара)', cost: 200, lifespan: 6, period: 'months', category: 'clothing' },
  { name: 'Смартфон', cost: 50000, lifespan: 2, period: 'years', category: 'tech' },
  { name: 'Ноутбук', cost: 80000, lifespan: 5, period: 'years', category: 'tech' },
  { name: 'Наушники', cost: 5000, lifespan: 2, period: 'years', category: 'tech' },
  { name: 'Чехол для телефона', cost: 1000, lifespan: 1, period: 'years', category: 'tech' },
  { name: 'Клавиатура', cost: 4000, lifespan: 3, period: 'years', category: 'tech' },
  { name: 'Проезд (месяц)', cost: 3000, lifespan: 1, period: 'months', category: 'transport' },
  { name: 'Бензин (бак)', cost: 3500, lifespan: 7, period: 'days', category: 'transport' },
  { name: 'ТО автомобиля', cost: 15000, lifespan: 1, period: 'years', category: 'transport' },
  { name: 'Витамины', cost: 1200, lifespan: 1, period: 'months', category: 'health' },
  { name: 'Визит к врачу', cost: 3000, lifespan: 6, period: 'months', category: 'health' },
  { name: 'Линзы', cost: 2000, lifespan: 1, period: 'months', category: 'health' },
  { name: 'YouTube Premium', cost: 250, lifespan: 1, period: 'months', category: 'subscriptions' },
  { name: 'Spotify', cost: 200, lifespan: 1, period: 'months', category: 'subscriptions' },
  {
    name: 'Облачное хранилище',
    cost: 150,
    lifespan: 1,
    period: 'months',
    category: 'subscriptions',
  },
  { name: 'VPN', cost: 300, lifespan: 1, period: 'months', category: 'subscriptions' },
  { name: 'Кино', cost: 500, lifespan: 7, period: 'days', category: 'entertainment' },
  { name: 'Настольная игра', cost: 2500, lifespan: 3, period: 'years', category: 'entertainment' },
  { name: 'Стрижка', cost: 1500, lifespan: 1, period: 'months', category: 'beauty' },
  { name: 'Крем для лица', cost: 800, lifespan: 2, period: 'months', category: 'beauty' },
  { name: 'Онлайн-курс', cost: 5000, lifespan: 6, period: 'months', category: 'education' },
  { name: 'Книга', cost: 700, lifespan: 3, period: 'months', category: 'education' },
  { name: 'Абонемент в зал', cost: 3000, lifespan: 1, period: 'months', category: 'sports' },
  { name: 'Протеин', cost: 2500, lifespan: 1, period: 'months', category: 'sports' },
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
