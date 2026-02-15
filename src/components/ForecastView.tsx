import { useMemo } from 'react'
import type { Expense } from '@/types/expense'
import {
  getEndDateMin,
  getEndDateMax,
  getExpenseStatus,
  formatShortDate,
} from '@/utils/expenseStatus'
import { formatMoney } from '@/utils/calculations'
import { getCategoryInfo } from '@/types/expense'
import s from './ForecastView.module.css'

interface ForecastViewProps {
  expenses: Expense[]
  expired: Expense[]
  onEdit: (expense: Expense) => void
}

interface ForecastGroup {
  label: string
  type: 'expired' | 'warning' | 'upcoming'
  items: ForecastItem[]
}

interface ForecastItem {
  expense: Expense
  endDateMin: Date
  endDateMax: Date
}

function toItem(e: Expense): ForecastItem {
  return { expense: e, endDateMin: getEndDateMin(e), endDateMax: getEndDateMax(e) }
}

function formatDateRange(min: Date, max: Date): string {
  if (min.getTime() === max.getTime()) return formatShortDate(min)
  return `${formatShortDate(min)} - ${formatShortDate(max)}`
}

function buildForecastGroups(expenses: Expense[], expired: Expense[]): ForecastGroup[] {
  const now = new Date()
  const in7d = new Date(now.getTime() + 7 * 86400000)
  const in30d = new Date(now.getTime() + 30 * 86400000)
  const in90d = new Date(now.getTime() + 90 * 86400000)

  const groups: ForecastGroup[] = []

  if (expired.length > 0) {
    groups.push({ label: 'Требуют замены', type: 'expired', items: expired.map(toItem) })
  }

  const warning = expenses.filter((e) => getExpenseStatus(e) === 'warning').map(toItem)
  if (warning.length > 0) {
    groups.push({ label: 'Могут потребовать замены', type: 'warning', items: warning })
  }

  const upcoming = expenses
    .filter((e) => getExpenseStatus(e) === 'active')
    .map(toItem)
    .filter((i) => i.endDateMin <= in90d)
    .sort((a, b) => a.endDateMin.getTime() - b.endDateMin.getTime())

  const week = upcoming.filter((i) => i.endDateMin <= in7d)
  if (week.length > 0) groups.push({ label: 'На этой неделе', type: 'upcoming', items: week })

  const month = upcoming.filter((i) => i.endDateMin > in7d && i.endDateMin <= in30d)
  if (month.length > 0) groups.push({ label: 'В течение месяца', type: 'upcoming', items: month })

  const quarter = upcoming.filter((i) => i.endDateMin > in30d && i.endDateMin <= in90d)
  if (quarter.length > 0) {
    groups.push({ label: 'В течение 3 месяцев', type: 'upcoming', items: quarter })
  }

  return groups
}

function groupLabelClass(type: string): string {
  if (type === 'expired') return s.groupLabelExpired
  if (type === 'warning') return s.groupLabelWarning
  return ''
}

function itemClass(type: string): string {
  if (type === 'expired') return s.itemExpired
  if (type === 'warning') return s.itemWarning
  return ''
}

function ForecastView({ expenses, expired, onEdit }: ForecastViewProps) {
  const groups = useMemo(() => buildForecastGroups(expenses, expired), [expenses, expired])

  if (groups.length === 0) return null

  const replacementCost = groups.flatMap((g) => g.items).reduce((sum, i) => sum + i.expense.cost, 0)

  return (
    <div className={s.forecast}>
      <div className={s.header}>
        <span className={s.sectionLabel}>Замены и прогноз</span>
        <span className={s.headerCost}>{formatMoney(replacementCost)} ₽</span>
      </div>
      {groups.map((group) => (
        <div key={group.label} className={s.group}>
          <div className={`${s.groupLabel} ${groupLabelClass(group.type)}`}>
            {group.type === 'expired' && '⚠ '}
            {group.type === 'warning' && '⏳ '}
            {group.label}
          </div>
          {group.items.map((item) => {
            const info = getCategoryInfo(item.expense.category)
            return (
              <button
                key={item.expense.id}
                className={`${s.item} ${itemClass(group.type)}`}
                onClick={() => onEdit(item.expense)}
              >
                <span className={s.itemIcon}>{info.icon}</span>
                <div className={s.itemInfo}>
                  <span className={s.itemName}>{item.expense.name}</span>
                  <span className={s.itemDate}>
                    {group.type === 'expired'
                      ? 'Срок вышел'
                      : `до ${formatDateRange(item.endDateMin, item.endDateMax)}`}
                    {' · '}
                    {formatMoney(item.expense.cost)} ₽
                  </span>
                </div>
                <span className={s.itemArrow}>→</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default ForecastView
