import { useMemo } from 'react'
import type { Expense } from '@/types/expense'
import { isExpenseActive } from '@/utils/expenseStatus'
import CategoryPieChart from '@/components/CategoryPieChart'
import s from './AnalyticsView.module.css'

interface AnalyticsViewProps {
  expenses: Expense[]
}

function AnalyticsView({ expenses }: AnalyticsViewProps) {
  const active = useMemo(() => expenses.filter(isExpenseActive), [expenses])

  if (expenses.length === 0) {
    return (
      <div className={s.empty}>
        <span className={s.emptyIcon}>📈</span>
        <p>Добавьте расходы, чтобы увидеть аналитику.</p>
      </div>
    )
  }

  return (
    <div className={s.analytics}>
      <div className={s.sectionLabel}>Распределение по категориям</div>
      <CategoryPieChart expenses={active} />
    </div>
  )
}

export default AnalyticsView
