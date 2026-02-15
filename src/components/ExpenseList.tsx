import { getCategoryInfo, type Expense } from '@/types/expense'
import {
  calculateDailyCost,
  calculateMonthlyCost,
  calculateYearlyCost,
  formatMoney,
  formatLifespan,
} from '@/utils/calculations'
import { isExpenseActive, getRemainingDays } from '@/utils/expenseStatus'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

function ExpenseList({ expenses, onEdit, onRemove }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <span className="expense-list-empty-icon">📝</span>
        <p>Расходов пока нет. Добавьте первый.</p>
      </div>
    )
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </div>
  )
}

interface ExpenseCardProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

function ExpenseCard({ expense, onEdit, onRemove }: ExpenseCardProps) {
  const daily = calculateDailyCost(expense.cost, expense.lifespanDays)
  const monthly = calculateMonthlyCost(expense.cost, expense.lifespanDays)
  const yearly = calculateYearlyCost(expense.cost, expense.lifespanDays)
  const categoryInfo = getCategoryInfo(expense.category)
  const active = isExpenseActive(expense)
  const remaining = getRemainingDays(expense)

  return (
    <div className="expense-card" onClick={() => onEdit(expense)}>
      <div className="expense-card-header">
        <h3 className="expense-card-name">{expense.name}</h3>
        <button
          className="expense-card-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(expense.id)
          }}
          aria-label="Удалить"
        >
          ×
        </button>
      </div>
      <div className="expense-card-meta">
        <span className="expense-card-badge">
          {categoryInfo.icon} {categoryInfo.label}
        </span>
        <span className="expense-card-separator">·</span>
        <span className="expense-card-cost">{formatMoney(expense.cost)} ₽</span>
        <span className="expense-card-separator">·</span>
        <span className="expense-card-lifespan">{formatLifespan(expense.lifespanDays)}</span>
        <span className="expense-card-separator">·</span>
        <span
          className={`status-badge-sm ${active ? 'status-badge-sm--active' : 'status-badge-sm--expired'}`}
        >
          {active ? `${remaining} дн.` : '⚠ замена'}
        </span>
      </div>
      <div className="expense-card-breakdown">
        <div className="expense-card-rate">
          <span className="expense-card-rate-label">В день</span>
          <span className="expense-card-rate-value">{formatMoney(daily)} ₽</span>
        </div>
        <div className="expense-card-rate">
          <span className="expense-card-rate-label">В месяц</span>
          <span className="expense-card-rate-value">{formatMoney(monthly)} ₽</span>
        </div>
        <div className="expense-card-rate">
          <span className="expense-card-rate-label">В год</span>
          <span className="expense-card-rate-value">{formatMoney(yearly)} ₽</span>
        </div>
      </div>
    </div>
  )
}

export default ExpenseList
