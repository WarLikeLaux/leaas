import { useMemo } from 'react'
import type { Expense } from '@/types/expense'
import { getEndDate, formatShortDate } from '@/utils/expenseStatus'
import { formatMoney } from '@/utils/calculations'
import { getCategoryInfo } from '@/types/expense'

interface ForecastViewProps {
  expenses: Expense[]
  expired: Expense[]
  onEdit: (expense: Expense) => void
}

interface ForecastGroup {
  label: string
  type: 'expired' | 'upcoming'
  items: ForecastItem[]
}

interface ForecastItem {
  expense: Expense
  endDate: Date
}

function buildForecastGroups(expenses: Expense[], expired: Expense[]): ForecastGroup[] {
  const now = new Date()
  const in7d = new Date(now.getTime() + 7 * 86400000)
  const in30d = new Date(now.getTime() + 30 * 86400000)
  const in90d = new Date(now.getTime() + 90 * 86400000)

  const upcoming = expenses
    .map((e) => ({ expense: e, endDate: getEndDate(e) }))
    .filter((i) => i.endDate > now && i.endDate <= in90d)
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())

  const groups: ForecastGroup[] = []

  if (expired.length > 0) {
    groups.push({
      label: 'Требуют замены',
      type: 'expired',
      items: expired.map((e) => ({ expense: e, endDate: getEndDate(e) })),
    })
  }

  const week = upcoming.filter((i) => i.endDate <= in7d)
  if (week.length > 0) groups.push({ label: 'На этой неделе', type: 'upcoming', items: week })

  const month = upcoming.filter((i) => i.endDate > in7d && i.endDate <= in30d)
  if (month.length > 0) groups.push({ label: 'В течение месяца', type: 'upcoming', items: month })

  const quarter = upcoming.filter((i) => i.endDate > in30d && i.endDate <= in90d)
  if (quarter.length > 0) {
    groups.push({ label: 'В течение 3 месяцев', type: 'upcoming', items: quarter })
  }

  return groups
}

function ForecastView({ expenses, expired, onEdit }: ForecastViewProps) {
  const groups = useMemo(() => buildForecastGroups(expenses, expired), [expenses, expired])

  if (groups.length === 0) return null

  const replacementCost = groups.flatMap((g) => g.items).reduce((sum, i) => sum + i.expense.cost, 0)

  return (
    <div className="forecast">
      <div className="forecast-header">
        <span className="stats-section-label">Замены и прогноз</span>
        <span className="forecast-header-cost">{formatMoney(replacementCost)} ₽</span>
      </div>
      {groups.map((group) => (
        <div key={group.label} className="forecast-group">
          <div
            className={`forecast-group-label ${group.type === 'expired' ? 'forecast-group-label--expired' : ''}`}
          >
            {group.type === 'expired' && '⚠ '}
            {group.label}
          </div>
          {group.items.map((item) => {
            const info = getCategoryInfo(item.expense.category)
            return (
              <button
                key={item.expense.id}
                className={`forecast-item ${group.type === 'expired' ? 'forecast-item--expired' : ''}`}
                onClick={() => onEdit(item.expense)}
              >
                <span className="forecast-item-icon">{info.icon}</span>
                <div className="forecast-item-info">
                  <span className="forecast-item-name">{item.expense.name}</span>
                  <span className="forecast-item-date">
                    {group.type === 'expired'
                      ? 'Срок вышел'
                      : `до ${formatShortDate(item.endDate)}`}
                    {' · '}
                    {formatMoney(item.expense.cost)} ₽
                  </span>
                </div>
                <span className="forecast-item-arrow">→</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default ForecastView
