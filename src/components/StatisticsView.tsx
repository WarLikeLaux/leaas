import { useState, useMemo } from 'react'
import { CATEGORIES, getCategoryInfo, type Expense, type ExpenseCategory } from '@/types/expense'
import {
  calculateDailyCost,
  calculateMonthlyCost,
  calculateYearlyCost,
  formatMoney,
  formatLifespan,
} from '@/utils/calculations'
import SearchInput from '@/components/SearchInput'

interface StatisticsViewProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
}

function groupByCategory(expenses: Expense[]) {
  const groups = new Map<ExpenseCategory, Expense[]>()
  for (const expense of expenses) {
    const list = groups.get(expense.category) ?? []
    list.push(expense)
    groups.set(expense.category, list)
  }
  return groups
}

function StatisticsView({ expenses, onEdit }: StatisticsViewProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<ExpenseCategory>>(new Set())

  const filtered = useMemo(() => {
    if (!search.trim()) return expenses
    const q = search.toLowerCase()
    return expenses.filter((e) => e.name.toLowerCase().includes(q))
  }, [expenses, search])

  const groups = useMemo(() => groupByCategory(filtered), [filtered])

  function toggleCategory(category: ExpenseCategory) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const totalDaily = filtered.reduce(
    (sum, e) => sum + calculateDailyCost(e.cost, e.lifespanDays),
    0,
  )
  const totalMonthly = filtered.reduce(
    (sum, e) => sum + calculateMonthlyCost(e.cost, e.lifespanDays),
    0,
  )
  const totalYearly = filtered.reduce(
    (sum, e) => sum + calculateYearlyCost(e.cost, e.lifespanDays),
    0,
  )

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <span className="expense-list-empty-icon">📊</span>
        <p>Добавьте расходы, чтобы увидеть статистику.</p>
      </div>
    )
  }

  return (
    <div className="statistics">
      <SearchInput value={search} onChange={setSearch} />
      <div className="stats-totals">
        <div className="stats-total">
          <span className="stats-total-label">В день</span>
          <span className="stats-total-value">{formatMoney(totalDaily)} ₽</span>
        </div>
        <div className="stats-total">
          <span className="stats-total-label">В месяц</span>
          <span className="stats-total-value">{formatMoney(totalMonthly)} ₽</span>
        </div>
        <div className="stats-total">
          <span className="stats-total-label">В год</span>
          <span className="stats-total-value">{formatMoney(totalYearly)} ₽</span>
        </div>
      </div>
      <div className="stats-groups">
        {CATEGORIES.map((cat) => {
          const items = groups.get(cat.value)
          if (!items || items.length === 0) return null
          const isOpen = expanded.has(cat.value)
          const catMonthly = items.reduce(
            (sum, e) => sum + calculateMonthlyCost(e.cost, e.lifespanDays),
            0,
          )
          return (
            <CategoryGroup
              key={cat.value}
              category={cat.value}
              items={items}
              monthlyTotal={catMonthly}
              isOpen={isOpen}
              onToggle={() => toggleCategory(cat.value)}
              onEdit={onEdit}
            />
          )
        })}
      </div>
    </div>
  )
}

interface CategoryGroupProps {
  category: ExpenseCategory
  items: Expense[]
  monthlyTotal: number
  isOpen: boolean
  onToggle: () => void
  onEdit: (expense: Expense) => void
}

function CategoryGroup({
  category,
  items,
  monthlyTotal,
  isOpen,
  onToggle,
  onEdit,
}: CategoryGroupProps) {
  const info = getCategoryInfo(category)

  return (
    <div className="stats-group">
      <button className="stats-group-header" onClick={onToggle}>
        <div className="stats-group-left">
          <span className="stats-group-arrow">{isOpen ? '▼' : '▶'}</span>
          <span className="stats-group-icon">{info.icon}</span>
          <span className="stats-group-name">{info.label}</span>
          <span className="stats-group-count">{items.length}</span>
        </div>
        <span className="stats-group-total">{formatMoney(monthlyTotal)} ₽/мес</span>
      </button>
      {isOpen && (
        <div className="stats-group-items">
          {items.map((expense) => (
            <StatisticsItem key={expense.id} expense={expense} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

interface StatisticsItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
}

function StatisticsItem({ expense, onEdit }: StatisticsItemProps) {
  const daily = calculateDailyCost(expense.cost, expense.lifespanDays)
  const monthly = calculateMonthlyCost(expense.cost, expense.lifespanDays)

  return (
    <button className="stats-item" onClick={() => onEdit(expense)}>
      <span className="stats-item-name">{expense.name}</span>
      <span className="stats-item-meta">
        {formatMoney(expense.cost)} ₽ · {formatLifespan(expense.lifespanDays)}
      </span>
      <span className="stats-item-daily">{formatMoney(daily)} ₽/д</span>
      <span className="stats-item-monthly">{formatMoney(monthly)} ₽/м</span>
    </button>
  )
}

export default StatisticsView
