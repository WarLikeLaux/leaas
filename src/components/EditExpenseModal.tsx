import { useState, useEffect, type FormEvent } from 'react'
import { lifespanToDays } from '@/utils/calculations'
import { isExpenseActive, getRemainingDays } from '@/utils/expenseStatus'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'
import { LIFESPAN_PRESETS } from '@/constants/presets'
import { CATEGORIES, type Expense, type ExpenseCategory, type Period } from '@/types/expense'

interface EditExpenseModalProps {
  expense: Expense
  onSave: (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => void
  onClose: () => void
  onRemove: (id: string) => void
  onReplace: (id: string) => void
}

const PERIOD_OPTIONS: Period[] = ['days', 'months', 'years']

function getPeriodLabel(period: Period, count: number): string {
  if (period === 'months') return pluralizeMonths(count)
  if (period === 'years') return pluralizeYears(count)
  return pluralizeDays(count)
}

function EditExpenseModal({
  expense,
  onSave,
  onClose,
  onRemove,
  onReplace,
}: EditExpenseModalProps) {
  const [name, setName] = useState(expense.name)
  const [cost, setCost] = useState(String(expense.cost))
  const [lifespanValue, setLifespanValue] = useState(String(expense.lifespanValue))
  const [period, setPeriod] = useState<Period>(expense.lifespanPeriod)
  const [category, setCategory] = useState<ExpenseCategory>(expense.category)
  const [startDate, setStartDate] = useState(expense.startDate)

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
      lifespanValue: parsedLifespan,
      lifespanPeriod: period,
      category,
      startDate,
      replacementCount: expense.replacementCount,
    })
    onClose()
  }

  const active = isExpenseActive(expense)
  const remaining = getRemainingDays(expense)

  function handleRemove() {
    onRemove(expense.id)
    onClose()
  }

  function handleReplace() {
    onReplace(expense.id)
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
          <div className="modal-header-left">
            <h2 className="modal-title">Редактирование</h2>
            <span
              className={`status-badge ${active ? 'status-badge--active' : 'status-badge--expired'}`}
            >
              {active ? `${remaining} дн. осталось` : 'Требует замены'}
            </span>
            {expense.replacementCount > 0 && (
              <span className="status-badge status-badge--neutral">
                замен {expense.replacementCount}×
              </span>
            )}
          </div>
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
            <label className="modal-label">Дата начала</label>
            <input
              className="form-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
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
            <div className="modal-actions-right">
              {!active && (
                <button type="button" className="modal-action-replace" onClick={handleReplace}>
                  🔄 Заменить
                </button>
              )}
              <button className="form-button" type="submit">
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExpenseModal
