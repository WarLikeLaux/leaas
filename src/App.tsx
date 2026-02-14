import { useState } from 'react'
import MobileBlocker from '@/components/MobileBlocker'
import Layout from '@/components/Layout'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import EditExpenseModal from '@/components/EditExpenseModal'
import { useExpenses } from '@/hooks/useExpenses'
import type { Expense } from '@/types/expense'

function App() {
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenses()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  return (
    <>
      <MobileBlocker />
      <Layout>
        <section className="dashboard">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Расходы</h1>
            <span className="dashboard-count">{expenses.length}</span>
          </div>
          <ExpenseForm onAdd={addExpense} />
          <ExpenseList expenses={expenses} onEdit={setEditingExpense} onRemove={removeExpense} />
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
