import { useState, useMemo } from 'react'
import type { Expense } from '@/types/expense'
import { isExpenseActive, getEndDate, formatShortDate } from '@/utils/expenseStatus'
import { formatMoney } from '@/utils/calculations'
import { getCategoryInfo } from '@/types/expense'

interface BudgetViewProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onReplace: (id: string) => void
}

const HORIZON_OPTIONS = [
  { label: '1 год', months: 12 },
  { label: '2 года', months: 24 },
  { label: '3 года', months: 36 },
  { label: '5 лет', months: 60 },
]

interface BudgetItem {
  expense: Expense
  endDate: Date
}

function BudgetView({ expenses, onEdit, onReplace }: BudgetViewProps) {
  const [horizonMonths, setHorizonMonths] = useState(12)

  const expired = useMemo(
    () =>
      expenses
        .filter((e) => !isExpenseActive(e))
        .map((e) => ({ expense: e, endDate: getEndDate(e) })),
    [expenses],
  )

  const upcoming = useMemo(() => {
    const now = new Date()
    const horizon = new Date(now)
    horizon.setMonth(horizon.getMonth() + horizonMonths)

    return expenses
      .map((e) => ({ expense: e, endDate: getEndDate(e) }))
      .filter((i) => i.endDate > now && i.endDate <= horizon)
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
  }, [expenses, horizonMonths])

  const expiredCost = expired.reduce((sum, i) => sum + i.expense.cost, 0)
  const upcomingCost = upcoming.reduce((sum, i) => sum + i.expense.cost, 0)

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <span className="expense-list-empty-icon">🎯</span>
        <p>Добавьте расходы, чтобы планировать бюджет.</p>
      </div>
    )
  }

  return (
    <div className="budget">
      {expired.length > 0 && (
        <BudgetSection
          label="Требуют замены"
          type="expired"
          cost={expiredCost}
          items={expired}
          onEdit={onEdit}
          onReplace={onReplace}
        />
      )}
      <div className="budget-horizon">
        <span className="stats-section-label">Горизонт прогноза</span>
        <div className="form-toggle-group">
          {HORIZON_OPTIONS.map((opt) => (
            <button
              key={opt.months}
              type="button"
              className={`form-toggle ${horizonMonths === opt.months ? 'form-toggle--active' : ''}`}
              onClick={() => setHorizonMonths(opt.months)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {upcoming.length > 0 ? (
        <BudgetSection
          label="Предстоящие замены"
          type="upcoming"
          cost={upcomingCost}
          items={upcoming}
          onEdit={onEdit}
        />
      ) : (
        <div className="budget-empty">
          Нет предстоящих замен в ближайшие {horizonMonths / 12}{' '}
          {horizonMonths === 12 ? 'год' : horizonMonths <= 48 ? 'года' : 'лет'}.
        </div>
      )}
    </div>
  )
}

interface BudgetSectionProps {
  label: string
  type: 'expired' | 'upcoming'
  cost: number
  items: BudgetItem[]
  onEdit: (expense: Expense) => void
  onReplace?: (id: string) => void
}

function BudgetSection({ label, type, cost, items, onEdit, onReplace }: BudgetSectionProps) {
  return (
    <div className="budget-section">
      <div className="forecast-header">
        <span
          className={`stats-section-label ${type === 'expired' ? 'stats-section-label--danger' : ''}`}
        >
          {type === 'expired' && '⚠ '}
          {label}
        </span>
        <span className="forecast-header-cost">{formatMoney(cost)} ₽</span>
      </div>
      {items.map((item) => {
        const info = getCategoryInfo(item.expense.category)
        return (
          <button
            key={item.expense.id}
            className={`forecast-item ${type === 'expired' ? 'forecast-item--expired' : ''}`}
            onClick={() => onEdit(item.expense)}
          >
            <span className="forecast-item-icon">{info.icon}</span>
            <div className="forecast-item-info">
              <span className="forecast-item-name">{item.expense.name}</span>
              <span className="forecast-item-date">
                {type === 'expired' ? 'Срок вышел' : `до ${formatShortDate(item.endDate)}`}
                {' · '}
                {formatMoney(item.expense.cost)} ₽
              </span>
            </div>
            <span className="forecast-item-arrow">→</span>
            {type === 'expired' && onReplace && (
              <button
                type="button"
                className="forecast-item-replace"
                onClick={(e) => {
                  e.stopPropagation()
                  onReplace(item.expense.id)
                }}
              >
                🔄
              </button>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default BudgetView
