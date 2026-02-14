import { useState, type FormEvent } from 'react'
import { lifespanToDays } from '@/utils/calculations'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'
import { EXPENSE_PRESETS, LIFESPAN_PRESETS } from '@/constants/presets'
import { CATEGORIES, type Expense, type ExpenseCategory, type Period } from '@/types/expense'

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
}

const PERIOD_OPTIONS: Period[] = ['days', 'months', 'years']

function getPeriodLabel(period: Period, count: number): string {
  if (period === 'months') return pluralizeMonths(count)
  if (period === 'years') return pluralizeYears(count)
  return pluralizeDays(count)
}

function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [lifespanValue, setLifespanValue] = useState('')
  const [period, setPeriod] = useState<Period>('months')
  const [category, setCategory] = useState<ExpenseCategory>('other')
  const [presetsOpen, setPresetsOpen] = useState(false)

  const numericLifespan = parseFloat(lifespanValue) || 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsedCost = parseFloat(cost)
    const parsedLifespan = parseFloat(lifespanValue)

    if (!name.trim()) return
    if (isNaN(parsedCost) || parsedCost <= 0) return
    if (isNaN(parsedLifespan) || parsedLifespan <= 0) return

    onAdd({
      name: name.trim(),
      cost: parsedCost,
      lifespanDays: lifespanToDays(parsedLifespan, period),
      category,
    })

    setName('')
    setCost('')
    setLifespanValue('')
  }

  function handleLifespanPreset(preset: (typeof LIFESPAN_PRESETS)[number]) {
    setLifespanValue(String(preset.value))
    setPeriod(preset.period)
  }

  function handleExpensePreset(preset: (typeof EXPENSE_PRESETS)[number]) {
    onAdd({
      name: preset.name,
      cost: preset.cost,
      lifespanDays: preset.lifespanDays,
      category: preset.category,
    })
  }

  return (
    <div className="expense-form-wrapper">
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            className="form-input"
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="form-input form-input--cost"
            type="number"
            placeholder="Стоимость, ₽"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            min="0"
            step="any"
            required
          />
          <input
            className="form-input form-input--lifespan"
            type="number"
            placeholder="Срок"
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
          <button className="form-button" type="submit">
            Добавить
          </button>
        </div>
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
        <div className="form-lifespan-presets">
          <span className="form-presets-label">Срок:</span>
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
      </form>
      <div className="form-presets">
        <button
          type="button"
          className="form-presets-toggle"
          onClick={() => setPresetsOpen((v) => !v)}
        >
          <span>{presetsOpen ? '▼' : '▶'}</span>
          Шаблоны
          <span className="form-presets-count">{EXPENSE_PRESETS.length}</span>
        </button>
        {presetsOpen && (
          <div className="form-presets-list">
            {EXPENSE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="form-preset"
                onClick={() => handleExpensePreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseForm
