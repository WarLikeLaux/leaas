import { useMemo, type ReactElement } from 'react'
import type { Expense } from '@/types/expense'
import { CATEGORIES } from '@/types/expense'
import { calculateMonthlyCost, formatMoney } from '@/utils/calculations'
import s from './CategoryPieChart.module.css'

interface CategoryPieChartProps {
  expenses: Expense[]
}

interface Slice {
  category: string
  icon: string
  label: string
  value: number
  percentage: number
  color: string
}

const SLICE_COLORS = [
  '#6c5ce7',
  '#00cec9',
  '#fd79a8',
  '#fdcb6e',
  '#55efc4',
  '#74b9ff',
  '#e17055',
  '#a29bfe',
  '#fab1a0',
  '#81ecec',
  '#ffeaa7',
  '#dfe6e9',
]

function buildSlices(expenses: Expense[]): Slice[] {
  const totals = new Map<string, number>()

  for (const expense of expenses) {
    const avgDays = (expense.lifespanDaysMin + expense.lifespanDaysMax) / 2
    const monthly = calculateMonthlyCost(expense.cost, avgDays)
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + monthly)
  }

  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0)
  if (grandTotal === 0) return []

  return CATEGORIES.filter((c) => (totals.get(c.value) ?? 0) > 0).map((c, i) => {
    const value = totals.get(c.value) ?? 0
    return {
      category: c.value,
      icon: c.icon,
      label: c.label,
      value,
      percentage: (value / grandTotal) * 100,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    }
  })
}

function PieSlices({ slices }: { slices: Slice[] }) {
  const paths: ReactElement[] = []
  let cumulative = 0
  const cx = 100
  const cy = 100
  const r = 80

  for (const slice of slices) {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
    cumulative += slice.percentage
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = slice.percentage > 50 ? 1 : 0

    const d = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ')

    paths.push(<path key={slice.category} d={d} fill={slice.color} opacity={0.85} />)
  }

  return <>{paths}</>
}

function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const slices = useMemo(() => buildSlices(expenses), [expenses])

  if (slices.length === 0) return null

  const total = slices.reduce((sum, sl) => sum + sl.value, 0)

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <svg viewBox="0 0 200 200" className={s.svg}>
          <circle cx="100" cy="100" r="80" fill="var(--color-surface)" />
          <PieSlices slices={slices} />
          <circle cx="100" cy="100" r="50" fill="var(--color-bg)" />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fill="var(--color-text)"
            fontSize="14"
            fontWeight="700"
          >
            {formatMoney(total)}
          </text>
          <text x="100" y="112" textAnchor="middle" fill="var(--color-text-muted)" fontSize="9">
            ₽/мес
          </text>
        </svg>
      </div>
      <div className={s.legend}>
        {slices.map((slice) => (
          <div key={slice.category} className={s.legendItem}>
            <span className={s.legendColor} style={{ background: slice.color }} />
            <span className={s.legendIcon}>{slice.icon}</span>
            <span className={s.legendLabel}>{slice.label}</span>
            <span className={s.legendValue}>{formatMoney(slice.value)} ₽</span>
            <span className={s.legendPct}>{slice.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPieChart
