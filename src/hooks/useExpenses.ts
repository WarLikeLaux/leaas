import { useState } from 'react'
import type { Expense } from '@/types/expense'

const STORAGE_KEY = 'leaas-expenses'

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Expense[]
  } catch {
    return []
  }
}

function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (_) {
    void _
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)

  function addExpense(data: Omit<Expense, 'id' | 'createdAt'>) {
    const newExpense: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newExpense, ...expenses]
    setExpenses(updated)
    saveExpenses(updated)
  }

  function updateExpense(id: string, data: Omit<Expense, 'id' | 'createdAt'>) {
    const updated = expenses.map((e) => (e.id === id ? { ...e, ...data } : e))
    setExpenses(updated)
    saveExpenses(updated)
  }

  function removeExpense(id: string) {
    const updated = expenses.filter((e) => e.id !== id)
    setExpenses(updated)
    saveExpenses(updated)
  }

  return { expenses, addExpense, updateExpense, removeExpense }
}
