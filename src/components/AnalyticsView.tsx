import { useMemo } from 'react'
import type { Expense } from '@/types/expense'
import { isExpenseActive } from '@/utils/expenseStatus'
import CategoryPieChart from '@/components/CategoryPieChart'

interface AnalyticsViewProps {
  expenses: Expense[]
}

function AnalyticsView({ expenses }: AnalyticsViewProps) {
  const active = useMemo(() => expenses.filter(isExpenseActive), [expenses])

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <span className="expense-list-empty-icon">📈</span>
        <p>Добавьте расходы, чтобы увидеть аналитику.</p>
      </div>
    )
  }

  return (
    <div className="analytics">
      <div className="stats-section-label">Распределение по категориям</div>
      <CategoryPieChart expenses={active} />
    </div>
  )
}

export default AnalyticsView
