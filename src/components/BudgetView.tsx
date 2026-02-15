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
import { pluralizeExpenses } from '@/utils/pluralize'
import s from './BudgetView.module.css'
import fc from './ForecastView.module.css'
import f from './ExpenseForm.module.css'

interface BudgetViewProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onReplace: (id: string) => void
}

const HORIZON_OPTIONS = [
  { label: '1 неделя', months: 0.25 },
  { label: '1 месяц', months: 1 },
  { label: '3 месяца', months: 3 },
  { label: '6 месяцев', months: 6 },
  { label: '1 год', months: 12 },
  { label: '2 года', months: 24 },
  { label: '5 лет', months: 60 },
]

const BUCKET_RANGES = [
  { label: '🔜 Ближайшие', sub: 'до 1 месяца', maxMonths: 1 },
  { label: '📅 Среднесрочные', sub: '1 - 6 месяцев', maxMonths: 6 },
  { label: '📆 Долгосрочные', sub: '6 месяцев - 1 год', maxMonths: 12 },
  { label: '🔭 Дальний горизонт', sub: '1 - 5 лет', maxMonths: 60 },
]

interface BudgetItem {
  expense: Expense
  endDateMin: Date
  endDateMax: Date
}

interface TimeBucket {
  label: string
  sub: string
  items: BudgetItem[]
}

function toBudgetItem(e: Expense): BudgetItem {
  return { expense: e, endDateMin: getEndDateMin(e), endDateMax: getEndDateMax(e) }
}

function formatDateRange(min: Date, max: Date): string {
  if (min.getTime() === max.getTime()) return formatShortDate(min)
  return `${formatShortDate(min)} - ${formatShortDate(max)}`
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + Math.round(months * 30.44))
  return d
}

function bucketItems(items: BudgetItem[], now: Date): TimeBucket[] {
  return BUCKET_RANGES.map((range, idx) => {
    const minDate = idx === 0 ? now : addMonths(now, BUCKET_RANGES[idx - 1].maxMonths)
    const maxDate = addMonths(now, range.maxMonths)
    const filtered = items.filter((i) => i.endDateMin >= minDate && i.endDateMin < maxDate)
    return { label: range.label, sub: range.sub, items: filtered }
  }).filter((b) => b.items.length > 0)
}

function BudgetView({ expenses, onEdit, onReplace }: BudgetViewProps) {
  const [horizonMonths, setHorizonMonths] = useState(12)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

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
    const horizon = addMonths(now, horizonMonths)

    return expenses
      .filter((e) => getExpenseStatus(e) === 'active')
      .map(toBudgetItem)
      .filter((i) => i.endDateMin <= horizon)
      .sort((a, b) => a.endDateMin.getTime() - b.endDateMin.getTime())
  }, [expenses, horizonMonths])

  const buckets = useMemo(() => bucketItems(upcoming, new Date()), [upcoming])

  const expiredCost = expired.reduce((sum, i) => sum + i.expense.cost, 0)
  const warningCost = warning.reduce((sum, i) => sum + i.expense.cost, 0)

  function toggleBucket(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

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
        <div className={s.buckets}>
          {buckets.map((bucket) => {
            const cost = bucket.items.reduce((sum, i) => sum + i.expense.cost, 0)
            const isOpen = !collapsed.has(bucket.label)
            return (
              <div key={bucket.label} className={s.bucket}>
                <button className={s.bucketHeader} onClick={() => toggleBucket(bucket.label)}>
                  <div className={s.bucketLeft}>
                    <span className={s.bucketLabel}>{bucket.label}</span>
                    <span className={s.bucketSub}>({bucket.sub})</span>
                  </div>
                  <div className={s.bucketRight}>
                    <span className={s.bucketCount}>
                      {bucket.items.length} {pluralizeExpenses(bucket.items.length)}
                    </span>
                    <span className={fc.headerCost}>{formatMoney(cost)} ₽</span>
                    <span className={s.bucketArrow}>{isOpen ? '▾' : '▸'}</span>
                  </div>
                </button>
                {isOpen && (
                  <BudgetSection
                    label=""
                    type="upcoming"
                    cost={0}
                    items={bucket.items}
                    onEdit={onEdit}
                    showHeader={false}
                  />
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className={s.empty}>Нет предстоящих замен в выбранном горизонте.</div>
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
  showHeader?: boolean
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

function BudgetSection({
  label,
  type,
  cost,
  items,
  onEdit,
  onReplace,
  showHeader = true,
}: BudgetSectionProps) {
  return (
    <div className={s.section}>
      {showHeader && (
        <div className={fc.header}>
          <span className={`${s.sectionLabel} ${sectionLabelClass(type)}`}>
            {type === 'expired' && '⚠ '}
            {type === 'warning' && '⏳ '}
            {label}
          </span>
          <span className={fc.headerCost}>{formatMoney(cost)} ₽</span>
        </div>
      )}
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
