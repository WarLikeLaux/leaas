import { useState, type FormEvent } from 'react'
import { lifespanToDays } from '@/utils/calculations'
import { todayISO } from '@/utils/expenseStatus'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'
import { EXPENSE_PRESETS, LIFESPAN_PRESETS } from '@/constants/presets'
import { CATEGORIES, type Expense, type ExpenseCategory, type Period } from '@/types/expense'
import s from './ExpenseForm.module.css'

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
  const [lifespanMin, setLifespanMin] = useState('')
  const [lifespanMax, setLifespanMax] = useState('')
  const [period, setPeriod] = useState<Period>('months')
  const [category, setCategory] = useState<ExpenseCategory>('other')
  const [presetsOpen, setPresetsOpen] = useState(false)

  const numericLifespan = parseFloat(lifespanMin) || 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsedCost = parseFloat(cost)
    const parsedMin = parseFloat(lifespanMin)
    const parsedMax = parseFloat(lifespanMax || lifespanMin)

    if (!name.trim()) return
    if (isNaN(parsedCost) || parsedCost <= 0) return
    if (isNaN(parsedMin) || parsedMin <= 0) return
    if (isNaN(parsedMax) || parsedMax < parsedMin) return

    onAdd({
      name: name.trim(),
      cost: parsedCost,
      lifespanMin: parsedMin,
      lifespanMax: parsedMax,
      lifespanDaysMin: lifespanToDays(parsedMin, period),
      lifespanDaysMax: lifespanToDays(parsedMax, period),
      lifespanPeriod: period,
      category,
      startDate: todayISO(),
      replacementCount: 0,
    })

    setName('')
    setCost('')
    setLifespanMin('')
    setLifespanMax('')
  }

  function handleLifespanPreset(preset: (typeof LIFESPAN_PRESETS)[number]) {
    setLifespanMin(String(preset.value))
    setLifespanMax(String(preset.value))
    setPeriod(preset.period)
  }

  function handleExpensePreset(preset: (typeof EXPENSE_PRESETS)[number]) {
    onAdd({
      name: preset.name,
      cost: preset.cost,
      lifespanMin: preset.lifespanMin,
      lifespanMax: preset.lifespanMax,
      lifespanDaysMin: preset.lifespanDaysMin,
      lifespanDaysMax: preset.lifespanDaysMax,
      lifespanPeriod: preset.lifespanPeriod,
      category: preset.category,
      startDate: todayISO(),
      replacementCount: 0,
    })
  }

  return (
    <div className={s.wrapper}>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.row}>
          <input
            className={s.input}
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={`${s.input} ${s.inputCost}`}
            type="number"
            placeholder="Стоимость, ₽"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            min="0"
            step="any"
            required
          />
          <input
            className={`${s.input} ${s.inputLifespan}`}
            type="number"
            placeholder="От"
            value={lifespanMin}
            onChange={(e) => setLifespanMin(e.target.value)}
            min="0"
            step="any"
            required
          />
          <input
            className={`${s.input} ${s.inputLifespan}`}
            type="number"
            placeholder="До"
            value={lifespanMax}
            onChange={(e) => setLifespanMax(e.target.value)}
            min="0"
            step="any"
          />
          <div className={s.toggleGroup}>
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                className={`${s.toggle} ${period === p ? s.toggleActive : ''}`}
                onClick={() => setPeriod(p)}
              >
                {getPeriodLabel(p, numericLifespan)}
              </button>
            ))}
          </div>
          <button className={s.button} type="submit">
            Добавить
          </button>
        </div>
        <div className={s.categories}>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`${s.category} ${category === c.value ? s.categoryActive : ''}`}
              onClick={() => setCategory(c.value)}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
        <div className={s.lifespanPresets}>
          <span className={s.presetsLabel}>Срок:</span>
          {LIFESPAN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={s.preset}
              onClick={() => handleLifespanPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </form>
      <div className={s.presets}>
        <button type="button" className={s.presetsToggle} onClick={() => setPresetsOpen((v) => !v)}>
          <span>{presetsOpen ? '▼' : '▶'}</span>
          Шаблоны
          <span className={s.presetsCount}>{EXPENSE_PRESETS.length}</span>
        </button>
        {presetsOpen && (
          <div className={s.presetsList}>
            {EXPENSE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={s.preset}
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
