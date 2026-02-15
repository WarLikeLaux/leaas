import { useState } from 'react'
import type { Expense } from '@/types/expense'
import { isPeriod, isExpenseCategory } from '@/types/expense'

const STORAGE_KEY = 'leaas-expenses'

function migrateExpense(raw: Record<string, unknown>): Expense {
  const id = String(raw.id ?? crypto.randomUUID())
  const name = String(raw.name ?? '')
  const cost = Number(raw.cost ?? 0)
  const lifespanDays = Number(raw.lifespanDays ?? 1)
  const lifespanValue = Number(raw.lifespanValue ?? lifespanDays)
  const createdAt = String(raw.createdAt ?? new Date().toISOString())
  const startDate = String(raw.startDate ?? createdAt.slice(0, 10))

  return {
    id,
    name,
    cost,
    lifespanDays,
    lifespanValue,
    lifespanPeriod: isPeriod(raw.lifespanPeriod) ? raw.lifespanPeriod : 'days',
    category: isExpenseCategory(raw.category) ? raw.category : 'other',
    startDate,
    replacementCount: Number(raw.replacementCount ?? 0),
    createdAt,
  }
}

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item: Record<string, unknown>) => migrateExpense(item))
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

  function replaceExpense(id: string, newCost?: number) {
    const today = new Date().toISOString().slice(0, 10)
    const updated = expenses.map((e) => {
      if (e.id !== id) return e
      return {
        ...e,
        startDate: today,
        replacementCount: e.replacementCount + 1,
        ...(newCost !== undefined ? { cost: newCost } : {}),
      }
    })
    setExpenses(updated)
    saveExpenses(updated)
  }

  return { expenses, addExpense, updateExpense, removeExpense, replaceExpense }
}
