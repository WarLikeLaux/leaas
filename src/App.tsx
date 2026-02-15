import { useState } from 'react'
import MobileBlocker from '@/components/MobileBlocker'
import Layout from '@/components/Layout'
import Tabs from '@/components/Tabs'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import StatisticsView from '@/components/StatisticsView'
import AnalyticsView from '@/components/AnalyticsView'
import BudgetView from '@/components/BudgetView'
import EditExpenseModal from '@/components/EditExpenseModal'
import { useExpenses } from '@/hooks/useExpenses'
import type { Expense } from '@/types/expense'
import s from './App.module.css'

const TABS = [
  { label: 'Расходы', icon: '💰' },
  { label: 'Статистика', icon: '📊' },
  { label: 'Аналитика', icon: '📈' },
  { label: 'Бюджет', icon: '🎯' },
  { label: 'Настройки', icon: '⚙️', disabled: true },
]

function App() {
  const { expenses, addExpense, updateExpense, removeExpense, replaceExpense } = useExpenses()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <MobileBlocker />
      <Layout>
        <section className={s.dashboard}>
          <div className={s.header}>
            <h1 className={s.title}>{TABS[activeTab]?.label}</h1>
            <span className={s.count}>{expenses.length}</span>
          </div>
          <Tabs tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />
          {activeTab === 0 && (
            <>
              <ExpenseForm onAdd={addExpense} />
              <ExpenseList
                expenses={expenses}
                onEdit={setEditingExpense}
                onRemove={removeExpense}
              />
            </>
          )}
          {activeTab === 1 && <StatisticsView expenses={expenses} onEdit={setEditingExpense} />}
          {activeTab === 2 && <AnalyticsView expenses={expenses} />}
          {activeTab === 3 && (
            <BudgetView expenses={expenses} onEdit={setEditingExpense} onReplace={replaceExpense} />
          )}
        </section>
      </Layout>
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={updateExpense}
          onClose={() => setEditingExpense(null)}
          onRemove={removeExpense}
          onReplace={replaceExpense}
        />
      )}
    </>
  )
}

export default App
