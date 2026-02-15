import { useState, useMemo } from 'react'
import type { Expense } from '@/types/expense'
import {
  getExpenseStatus,
  getEndDateMin,
  getEndDateMax,
  formatShortDate,
} from '@/utils/expenseStatus'
import { formatMoney } from '@/utils/calculations'
import { getCategoryInfo } from '@/types/expense'
import s from './BudgetView.module.css'
import fc from './ForecastView.module.css'
import f from './ExpenseForm.module.css'

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
  endDateMin: Date
  endDateMax: Date
}

function toBudgetItem(e: Expense): BudgetItem {
  return { expense: e, endDateMin: getEndDateMin(e), endDateMax: getEndDateMax(e) }
}

function formatDateRange(min: Date, max: Date): string {
  if (min.getTime() === max.getTime()) return formatShortDate(min)
  return `${formatShortDate(min)} - ${formatShortDate(max)}`
}

function BudgetView({ expenses, onEdit, onReplace }: BudgetViewProps) {
  const [horizonMonths, setHorizonMonths] = useState(12)

  const expired = useMemo(
    () => expenses.filter((e) => getExpenseStatus(e) === 'expired').map(toBudgetItem),
    [expenses],
  )

  const warning = useMemo(
    () => expenses.filter((e) => getExpenseStatus(e) === 'warning').map(toBudgetItem),
    [expenses],
  )

  const upcoming = useMemo(() => {
    const now = new Date()
    const horizon = new Date(now)
    horizon.setMonth(horizon.getMonth() + horizonMonths)

    return expenses
      .filter((e) => getExpenseStatus(e) === 'active')
      .map(toBudgetItem)
      .filter((i) => i.endDateMin <= horizon)
      .sort((a, b) => a.endDateMin.getTime() - b.endDateMin.getTime())
  }, [expenses, horizonMonths])

  const expiredCost = expired.reduce((sum, i) => sum + i.expense.cost, 0)
  const warningCost = warning.reduce((sum, i) => sum + i.expense.cost, 0)
  const upcomingCost = upcoming.reduce((sum, i) => sum + i.expense.cost, 0)

  if (expenses.length === 0) {
    return (
      <div className={s.emptyState}>
        <span className={s.emptyIcon}>🎯</span>
        <p>Добавьте расходы, чтобы планировать бюджет.</p>
      </div>
    )
  }

  return (
    <div className={s.budget}>
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
      {warning.length > 0 && (
        <BudgetSection
          label="Могут потребовать замены"
          type="warning"
          cost={warningCost}
          items={warning}
          onEdit={onEdit}
          onReplace={onReplace}
        />
      )}
      <div className={s.horizon}>
        <span className={s.sectionLabel}>Горизонт прогноза</span>
        <div className={f.toggleGroup}>
          {HORIZON_OPTIONS.map((opt) => (
            <button
              key={opt.months}
              type="button"
              className={`${f.toggle} ${horizonMonths === opt.months ? f.toggleActive : ''}`}
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
        <div className={s.empty}>
          Нет предстоящих замен в ближайшие {horizonMonths / 12}{' '}
          {horizonMonths === 12 ? 'год' : horizonMonths <= 48 ? 'года' : 'лет'}.
        </div>
      )}
    </div>
  )
}

interface BudgetSectionProps {
  label: string
  type: 'expired' | 'warning' | 'upcoming'
  cost: number
  items: BudgetItem[]
  onEdit: (expense: Expense) => void
  onReplace?: (id: string) => void
}

function sectionLabelClass(type: string): string {
  if (type === 'expired') return s.sectionLabelDanger
  if (type === 'warning') return s.sectionLabelWarning
  return ''
}

function itemClass(type: string): string {
  if (type === 'expired') return fc.itemExpired
  if (type === 'warning') return fc.itemWarning
  return ''
}

function BudgetSection({ label, type, cost, items, onEdit, onReplace }: BudgetSectionProps) {
  return (
    <div className={s.section}>
      <div className={fc.header}>
        <span className={`${s.sectionLabel} ${sectionLabelClass(type)}`}>
          {type === 'expired' && '⚠ '}
          {type === 'warning' && '⏳ '}
          {label}
        </span>
        <span className={fc.headerCost}>{formatMoney(cost)} ₽</span>
      </div>
      {items.map((item) => {
        const info = getCategoryInfo(item.expense.category)
        return (
          <button
            key={item.expense.id}
            className={`${fc.item} ${itemClass(type)}`}
            onClick={() => onEdit(item.expense)}
          >
            <span className={fc.itemIcon}>{info.icon}</span>
            <div className={fc.itemInfo}>
              <span className={fc.itemName}>{item.expense.name}</span>
              <span className={fc.itemDate}>
                {type === 'expired'
                  ? 'Срок вышел'
                  : `до ${formatDateRange(item.endDateMin, item.endDateMax)}`}
                {' · '}
                {formatMoney(item.expense.cost)} ₽
              </span>
            </div>
            <span className={fc.itemArrow}>→</span>
            {type !== 'upcoming' && onReplace && (
              <button
                type="button"
                className={fc.itemReplace}
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
