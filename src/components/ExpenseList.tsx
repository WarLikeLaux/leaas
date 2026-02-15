import { useState, useMemo } from 'react'
import { getCategoryInfo, type Expense } from '@/types/expense'
import {
  calculateDailyCost,
  calculateMonthlyCost,
  calculateYearlyCost,
  formatMoney,
  formatMoneyRange,
} from '@/utils/calculations'
import { getExpenseStatus, getRemainingDaysRange, type ExpenseStatus } from '@/utils/expenseStatus'
import css from './ExpenseList.module.css'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

type SortKey = 'name' | 'cost' | 'monthly' | 'remaining'
type SortDir = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'cost', label: 'Стоимость' },
  { key: 'monthly', label: 'В месяц' },
  { key: 'remaining', label: 'Осталось' },
  { key: 'name', label: 'Название' },
]

function getAvgMonthly(e: Expense): number {
  const avgDays = (e.lifespanDaysMin + e.lifespanDaysMax) / 2
  return calculateMonthlyCost(e.cost, avgDays)
}

function getAvgRemaining(e: Expense): number {
  const r = getRemainingDaysRange(e)
  return (r.min + r.max) / 2
}

function sortExpenses(expenses: Expense[], key: SortKey, dir: SortDir): Expense[] {
  const sorted = [...expenses]
  const mult = dir === 'asc' ? 1 : -1
  sorted.sort((a, b) => {
    if (key === 'cost') return (a.cost - b.cost) * mult
    if (key === 'monthly') return (getAvgMonthly(a) - getAvgMonthly(b)) * mult
    if (key === 'remaining') return (getAvgRemaining(a) - getAvgRemaining(b)) * mult
    return a.name.localeCompare(b.name, 'ru') * mult
  })
  return sorted
}

function statusLabel(status: ExpenseStatus, range: { min: number; max: number }): string {
  if (status === 'expired') return '⚠ замена'
  if (status === 'warning') return `≈${range.max} дней`
  if (range.min === range.max) return `${range.min} дней`
  return `${range.min} - ${range.max} дней`
}

function statusClass(status: ExpenseStatus): string {
  if (status === 'expired') return css.statusExpired
  if (status === 'warning') return css.statusWarning
  return css.statusActive
}

function ExpenseList({ expenses, onEdit, onRemove }: ExpenseListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(
    () => sortExpenses(expenses, sortKey, sortDir),
    [expenses, sortKey, sortDir],
  )

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  if (expenses.length === 0) {
    return (
      <div className={css.empty}>
        <span className={css.emptyIcon}>📝</span>
        <p>Расходов пока нет. Добавьте первый.</p>
      </div>
    )
  }

  return (
    <div>
      <div className={css.sortBar}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`${css.sortButton} ${sortKey === opt.key ? css.sortButtonActive : ''}`}
            onClick={() => handleSort(opt.key)}
          >
            {opt.label}
            {sortKey === opt.key && (
              <span className={css.sortArrow}>{sortDir === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        ))}
      </div>
      <div className={css.list}>
        {sorted.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

interface ExpenseCardProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

function ExpenseCard({ expense, onEdit, onRemove }: ExpenseCardProps) {
  const dailyMin = calculateDailyCost(expense.cost, expense.lifespanDaysMax)
  const dailyMax = calculateDailyCost(expense.cost, expense.lifespanDaysMin)
  const monthlyMin = calculateMonthlyCost(expense.cost, expense.lifespanDaysMax)
  const monthlyMax = calculateMonthlyCost(expense.cost, expense.lifespanDaysMin)
  const yearlyMin = calculateYearlyCost(expense.cost, expense.lifespanDaysMax)
  const yearlyMax = calculateYearlyCost(expense.cost, expense.lifespanDaysMin)
  const categoryInfo = getCategoryInfo(expense.category)
  const status = getExpenseStatus(expense)
  const remaining = getRemainingDaysRange(expense)

  return (
    <div className={css.card} onClick={() => onEdit(expense)}>
      <div className={css.cardHeader}>
        <h3 className={css.cardName}>{expense.name}</h3>
        <button
          className={css.cardRemove}
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm(`Удалить «${expense.name}»?`)) onRemove(expense.id)
          }}
          aria-label="Удалить"
        >
          ×
        </button>
      </div>
      <div className={css.cardMeta}>
        <span className={css.cardBadge}>
          {categoryInfo.icon} {categoryInfo.label}
        </span>
        <span className={css.cardSeparator}>·</span>
        <span className={css.cardCost}>{formatMoney(expense.cost)} ₽</span>
        <span className={css.cardSeparator}>·</span>
        <span className={`${css.statusBadge} ${statusClass(status)}`}>
          {statusLabel(status, remaining)}
        </span>
      </div>
      <div className={css.cardBreakdown}>
        <div className={css.cardRate}>
          <span className={css.cardRateLabel}>В день</span>
          <span className={css.cardRateValue}>{formatMoneyRange(dailyMin, dailyMax)} ₽</span>
        </div>
        <div className={css.cardRate}>
          <span className={css.cardRateLabel}>В месяц</span>
          <span className={css.cardRateValue}>{formatMoneyRange(monthlyMin, monthlyMax)} ₽</span>
        </div>
        <div className={css.cardRate}>
          <span className={css.cardRateLabel}>В год</span>
          <span className={css.cardRateValue}>{formatMoneyRange(yearlyMin, yearlyMax)} ₽</span>
        </div>
      </div>
    </div>
  )
}

export default ExpenseList
