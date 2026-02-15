import { useState, useMemo } from 'react'
import { CATEGORIES, getCategoryInfo, type Expense, type ExpenseCategory } from '@/types/expense'
import {
  calculateDailyCost,
  calculateMonthlyCost,
  calculateYearlyCost,
  formatMoney,
  formatMoneyRange,
  formatLifespanRange,
} from '@/utils/calculations'
import { isExpenseActive } from '@/utils/expenseStatus'
import SearchInput from '@/components/SearchInput'
import s from './StatisticsView.module.css'

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

function monthlyRangeForItem(e: Expense): { min: number; max: number } {
  return {
    min: calculateMonthlyCost(e.cost, e.lifespanDaysMax),
    max: calculateMonthlyCost(e.cost, e.lifespanDaysMin),
  }
}

function sumMonthlyRange(items: Expense[]): { min: number; max: number } {
  let min = 0
  let max = 0
  for (const e of items) {
    min += calculateMonthlyCost(e.cost, e.lifespanDaysMax)
    max += calculateMonthlyCost(e.cost, e.lifespanDaysMin)
  }
  return { min, max }
}

function StatisticsView({ expenses, onEdit }: StatisticsViewProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<ExpenseCategory>>(new Set())

  const filtered = useMemo(() => {
    if (!search.trim()) return expenses
    const q = search.toLowerCase()
    return expenses.filter((e) => {
      const cat = getCategoryInfo(e.category)
      return e.name.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q)
    })
  }, [expenses, search])

  const groups = useMemo(() => groupByCategory(filtered), [filtered])

  const active = useMemo(() => filtered.filter(isExpenseActive), [filtered])

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

  const burnDaily = {
    min: active.reduce((sum, e) => sum + calculateDailyCost(e.cost, e.lifespanDaysMax), 0),
    max: active.reduce((sum, e) => sum + calculateDailyCost(e.cost, e.lifespanDaysMin), 0),
  }
  const burnMonthly = sumMonthlyRange(active)
  const burnYearly = {
    min: active.reduce((sum, e) => sum + calculateYearlyCost(e.cost, e.lifespanDaysMax), 0),
    max: active.reduce((sum, e) => sum + calculateYearlyCost(e.cost, e.lifespanDaysMin), 0),
  }

  if (expenses.length === 0) {
    return (
      <div className={s.empty}>
        <span className={s.emptyIcon}>📊</span>
        <p>Добавьте расходы, чтобы увидеть статистику.</p>
      </div>
    )
  }

  return (
    <div className={s.statistics}>
      <SearchInput value={search} onChange={setSearch} />
      <div className={s.sectionLabel}>Текущий Burn Rate</div>
      <div className={s.totals}>
        <div className={s.total}>
          <span className={s.totalLabel}>В день</span>
          <span className={s.totalValue}>{formatMoneyRange(burnDaily.min, burnDaily.max)} ₽</span>
        </div>
        <div className={s.total}>
          <span className={s.totalLabel}>В месяц</span>
          <span className={s.totalValue}>
            {formatMoneyRange(burnMonthly.min, burnMonthly.max)} ₽
          </span>
        </div>
        <div className={s.total}>
          <span className={s.totalLabel}>В год</span>
          <span className={s.totalValue}>{formatMoneyRange(burnYearly.min, burnYearly.max)} ₽</span>
        </div>
      </div>
      <div className={s.sectionLabel}>По категориям</div>
      <div className={s.groups}>
        {CATEGORIES.map((cat) => {
          const items = groups.get(cat.value)
          if (!items || items.length === 0) return null
          const isOpen = search.trim() !== '' || expanded.has(cat.value)
          const catMonthly = sumMonthlyRange(items)
          return (
            <CategoryGroup
              key={cat.value}
              category={cat.value}
              items={items}
              monthlyRange={catMonthly}
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
  monthlyRange: { min: number; max: number }
  isOpen: boolean
  onToggle: () => void
  onEdit: (expense: Expense) => void
}

function CategoryGroup({
  category,
  items,
  monthlyRange,
  isOpen,
  onToggle,
  onEdit,
}: CategoryGroupProps) {
  const info = getCategoryInfo(category)

  return (
    <div className={s.group}>
      <button className={s.groupHeader} onClick={onToggle}>
        <div className={s.groupLeft}>
          <span className={s.groupArrow}>{isOpen ? '▼' : '▶'}</span>
          <span className={s.groupIcon}>{info.icon}</span>
          <span className={s.groupName}>{info.label}</span>
          <span className={s.groupCount}>{items.length}</span>
        </div>
        <span className={s.groupTotal}>
          {formatMoneyRange(monthlyRange.min, monthlyRange.max)} ₽/мес
        </span>
      </button>
      {isOpen && (
        <div className={s.groupItems}>
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
  const range = monthlyRangeForItem(expense)
  const daily = {
    min: calculateDailyCost(expense.cost, expense.lifespanDaysMax),
    max: calculateDailyCost(expense.cost, expense.lifespanDaysMin),
  }

  return (
    <button className={s.item} onClick={() => onEdit(expense)}>
      <span className={s.itemName}>{expense.name}</span>
      <span className={s.itemMeta}>
        {formatMoney(expense.cost)} ₽ ·{' '}
        {formatLifespanRange(expense.lifespanDaysMin, expense.lifespanDaysMax)}
      </span>
      <span className={s.itemDaily}>{formatMoneyRange(daily.min, daily.max)} ₽/д</span>
      <span className={s.itemMonthly}>{formatMoneyRange(range.min, range.max)} ₽/м</span>
    </button>
  )
}

export default StatisticsView
