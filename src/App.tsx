import { useState } from 'react'
import MobileBlocker from '@/components/MobileBlocker'
import Layout from '@/components/Layout'
import Tabs from '@/components/Tabs'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import StatisticsView from '@/components/StatisticsView'
import EditExpenseModal from '@/components/EditExpenseModal'
import { useExpenses } from '@/hooks/useExpenses'
import type { Expense } from '@/types/expense'

const TABS = [
  { label: 'Расходы', icon: '💰' },
  { label: 'Статистика', icon: '📊' },
  { label: 'Аналитика', icon: '📈', disabled: true },
  { label: 'Бюджет', icon: '🎯', disabled: true },
  { label: 'Настройки', icon: '⚙️', disabled: true },
]

function App() {
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenses()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <MobileBlocker />
      <Layout>
        <section className="dashboard">
          <div className="dashboard-header">
            <h1 className="dashboard-title">{TABS[activeTab].label}</h1>
            <span className="dashboard-count">{expenses.length}</span>
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
        </section>
      </Layout>
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={updateExpense}
          onClose={() => setEditingExpense(null)}
          onRemove={removeExpense}
        />
      )}
    </>
  )
}

export default App
