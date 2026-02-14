import { useState, useEffect, type FormEvent } from 'react'
import { lifespanToDays } from '@/utils/calculations'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'
import { LIFESPAN_PRESETS } from '@/constants/presets'
import { CATEGORIES, type Expense, type ExpenseCategory, type Period } from '@/types/expense'
import { DAYS_IN_MONTH, DAYS_IN_YEAR } from '@/types/expense'

interface EditExpenseModalProps {
  expense: Expense
  onSave: (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => void
  onClose: () => void
  onRemove: (id: string) => void
}

const PERIOD_OPTIONS: Period[] = ['days', 'months', 'years']

function getPeriodLabel(period: Period, count: number): string {
  if (period === 'months') return pluralizeMonths(count)
  if (period === 'years') return pluralizeYears(count)
  return pluralizeDays(count)
}

function daysToInput(days: number): { value: number; period: Period } {
  if (days >= DAYS_IN_YEAR && days % Math.round(DAYS_IN_YEAR) === 0) {
    return { value: Math.round(days / DAYS_IN_YEAR), period: 'years' }
  }
  if (days >= DAYS_IN_MONTH && days % Math.round(DAYS_IN_MONTH) === 0) {
    return { value: Math.round(days / DAYS_IN_MONTH), period: 'months' }
  }
  return { value: days, period: 'days' }
}

function EditExpenseModal({ expense, onSave, onClose, onRemove }: EditExpenseModalProps) {
  const initial = daysToInput(expense.lifespanDays)

  const [name, setName] = useState(expense.name)
  const [cost, setCost] = useState(String(expense.cost))
  const [lifespanValue, setLifespanValue] = useState(String(initial.value))
  const [period, setPeriod] = useState<Period>(initial.period)
  const [category, setCategory] = useState<ExpenseCategory>(expense.category)

  const numericLifespan = parseFloat(lifespanValue) || 0

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsedCost = parseFloat(cost)
    const parsedLifespan = parseFloat(lifespanValue)

    if (!name.trim()) return
    if (isNaN(parsedCost) || parsedCost <= 0) return
    if (isNaN(parsedLifespan) || parsedLifespan <= 0) return

    onSave(expense.id, {
      name: name.trim(),
      cost: parsedCost,
      lifespanDays: lifespanToDays(parsedLifespan, period),
      category,
    })
    onClose()
  }

  function handleRemove() {
    onRemove(expense.id)
    onClose()
  }

  function handleLifespanPreset(preset: (typeof LIFESPAN_PRESETS)[number]) {
    setLifespanValue(String(preset.value))
    setPeriod(preset.period)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактирование</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">Название</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Стоимость, ₽</label>
            <input
              className="form-input"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Категория</label>
            <div className="form-categories">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`form-category ${category === c.value ? 'form-category--active' : ''}`}
                  onClick={() => setCategory(c.value)}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-field">
            <label className="modal-label">Срок</label>
            <div className="modal-lifespan-row">
              <input
                className="form-input form-input--lifespan"
                type="number"
                value={lifespanValue}
                onChange={(e) => setLifespanValue(e.target.value)}
                min="0"
                step="any"
                required
              />
              <div className="form-toggle-group">
                {PERIOD_OPTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`form-toggle ${period === p ? 'form-toggle--active' : ''}`}
                    onClick={() => setPeriod(p)}
                  >
                    {getPeriodLabel(p, numericLifespan)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-lifespan-presets">
              {LIFESPAN_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="form-preset"
                  onClick={() => handleLifespanPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-action-delete" onClick={handleRemove}>
              Удалить
            </button>
            <button className="form-button" type="submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpenseModal
