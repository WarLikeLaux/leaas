import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { lifespanToDays, formatLifespan } from '@/utils/calculations'
import { getExpenseStatus, getRemainingDaysRange, type ExpenseStatus } from '@/utils/expenseStatus'
import { pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'
import { LIFESPAN_PRESETS } from '@/constants/presets'
import { CATEGORIES, type Expense, type ExpenseCategory, type Period } from '@/types/expense'
import s from './EditExpenseModal.module.css'
import f from './ExpenseForm.module.css'

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

function formatStatusLabel(status: ExpenseStatus, range: { min: number; max: number }): string {
  if (status === 'expired') return 'Требует замены'
  if (status === 'warning') return `≈${range.max} дней осталось`
  if (range.min === range.max) return `${range.min} дней осталось`
  return `${range.min} - ${range.max} дней осталось`
}

function statusBadgeClass(status: ExpenseStatus): string {
  if (status === 'expired') return s.statusExpired
  if (status === 'warning') return s.statusWarning
  return s.statusActive
}

function getElapsedDays(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  return Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
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
  const [lifespanMin, setLifespanMin] = useState(String(expense.lifespanMin))
  const [lifespanMax, setLifespanMax] = useState(String(expense.lifespanMax))
  const [period, setPeriod] = useState<Period>(expense.lifespanPeriod)
  const [category, setCategory] = useState<ExpenseCategory>(expense.category)
  const [startDate, setStartDate] = useState(expense.startDate)

  const numericLifespan = parseFloat(lifespanMin) || 0

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
    const parsedMin = parseFloat(lifespanMin)
    const parsedMax = parseFloat(lifespanMax || lifespanMin)

    if (!name.trim()) return
    if (isNaN(parsedCost) || parsedCost <= 0) return
    if (isNaN(parsedMin) || parsedMin <= 0) return
    if (isNaN(parsedMax) || parsedMax < parsedMin) return

    onSave(expense.id, {
      name: name.trim(),
      cost: parsedCost,
      lifespanMin: parsedMin,
      lifespanMax: parsedMax,
      lifespanDaysMin: lifespanToDays(parsedMin, period),
      lifespanDaysMax: lifespanToDays(parsedMax, period),
      lifespanPeriod: period,
      category,
      startDate,
      replacementCount: expense.replacementCount,
    })
    onClose()
  }

  const status = getExpenseStatus(expense)
  const remaining = getRemainingDaysRange(expense)
  const elapsed = getElapsedDays(expense.startDate)

  const avgLifespanDays = useMemo(() => {
    if (expense.replacementCount === 0) return null
    const created = new Date(expense.createdAt)
    const now = new Date()
    const totalDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return Math.round(totalDays / (expense.replacementCount + 1))
  }, [expense.createdAt, expense.replacementCount])

  const rangeHint = useMemo(() => {
    if (avgLifespanDays === null) return null
    const { lifespanDaysMin, lifespanDaysMax } = expense
    if (avgLifespanDays >= lifespanDaysMin && avgLifespanDays <= lifespanDaysMax) return null
    return avgLifespanDays
  }, [avgLifespanDays, expense])

  function handleRemove() {
    if (!window.confirm(`Удалить «${expense.name}»?`)) return
    onRemove(expense.id)
    onClose()
  }

  function handleReplace() {
    onReplace(expense.id)
    onClose()
  }

  function handleLifespanPreset(preset: (typeof LIFESPAN_PRESETS)[number]) {
    setLifespanMin(String(preset.value))
    setLifespanMax(String(preset.value))
    setPeriod(preset.period)
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <h2 className={s.title}>Редактирование</h2>
            <span className={`${s.statusBadge} ${statusBadgeClass(status)}`}>
              {formatStatusLabel(status, remaining)}
            </span>
            {expense.replacementCount > 0 && (
              <span className={`${s.statusBadge} ${s.statusNeutral}`}>
                замен {expense.replacementCount}×
              </span>
            )}
          </div>
          <button className={s.close} onClick={onClose}>
            ×
          </button>
        </div>
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label}>Название</label>
            <input
              className={f.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Стоимость, ₽</label>
            <input
              className={f.input}
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Категория</label>
            <div className={f.categories}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`${f.category} ${category === c.value ? f.categoryActive : ''}`}
                  onClick={() => setCategory(c.value)}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>
              {expense.replacementCount > 0 ? 'Дата последней замены' : 'Дата начала'}
              <span className={s.labelHint}> · идёт {formatLifespan(elapsed)}</span>
            </label>
            <input
              className={f.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {expense.replacementCount > 0 && (
              <div className={s.labelSub}>
                Дата начала: {new Date(expense.createdAt).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
          <div className={s.field}>
            <label className={s.label}>Срок (от - до)</label>
            <div className={s.lifespanRow}>
              <input
                className={`${f.input} ${f.inputLifespan}`}
                type="number"
                placeholder="От"
                value={lifespanMin}
                onChange={(e) => setLifespanMin(e.target.value)}
                min="0"
                step="any"
                required
              />
              <span className={s.lifespanDash}>-</span>
              <input
                className={`${f.input} ${f.inputLifespan}`}
                type="number"
                placeholder="До"
                value={lifespanMax}
                onChange={(e) => setLifespanMax(e.target.value)}
                min="0"
                step="any"
              />
              <div className={f.toggleGroup}>
                {PERIOD_OPTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${f.toggle} ${period === p ? f.toggleActive : ''}`}
                    onClick={() => setPeriod(p)}
                  >
                    {getPeriodLabel(p, numericLifespan)}
                  </button>
                ))}
              </div>
            </div>
            {rangeHint !== null && (
              <div className={s.hint}>
                💡 Фактический средний срок: {formatLifespan(rangeHint)} - отличается от
                настроенного диапазона
              </div>
            )}
            <div className={f.lifespanPresets}>
              {LIFESPAN_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={f.preset}
                  onClick={() => handleLifespanPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className={s.actions}>
            <button type="button" className={s.actionDelete} onClick={handleRemove}>
              Удалить
            </button>
            <div className={s.actionsRight}>
              <button type="button" className={s.actionReplace} onClick={handleReplace}>
                🔄 Заменить
              </button>
              <button className={f.button} type="submit">
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
