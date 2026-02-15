import {
  lifespanToDays,
  calculateDailyCost,
  calculateMonthlyCost,
  calculateYearlyCost,
  formatMoney,
  formatLifespan,
} from '@/utils/calculations'

describe('lifespanToDays', () => {
  it('возвращает дни без изменений', () => {
    expect(lifespanToDays(30, 'days')).toBe(30)
  })

  it('конвертирует месяцы в дни', () => {
    expect(lifespanToDays(1, 'months')).toBe(30)
  })

  it('конвертирует годы в дни', () => {
    expect(lifespanToDays(1, 'years')).toBe(365)
  })

  it('округляет дробные результаты', () => {
    expect(lifespanToDays(3, 'months')).toBe(91)
  })
})

describe('calculateDailyCost', () => {
  it('вычисляет стоимость в день', () => {
    expect(calculateDailyCost(3650, 365)).toBeCloseTo(10)
  })

  it('возвращает 0 при нулевом сроке', () => {
    expect(calculateDailyCost(100, 0)).toBe(0)
  })

  it('возвращает 0 при отрицательном сроке', () => {
    expect(calculateDailyCost(100, -5)).toBe(0)
  })
})

describe('calculateMonthlyCost', () => {
  it('вычисляет стоимость в месяц', () => {
    const result = calculateMonthlyCost(365, 365)

    expect(result).toBeCloseTo(30.44)
  })
})

describe('calculateYearlyCost', () => {
  it('вычисляет стоимость в год', () => {
    const result = calculateYearlyCost(365, 365)

    expect(result).toBeCloseTo(365.25)
  })
})

describe('formatMoney', () => {
  it('форматирует маленькие суммы с копейками', () => {
    expect(formatMoney(0.5)).toBe('0.50')
  })

  it('форматирует средние суммы с копейками', () => {
    expect(formatMoney(5.75)).toBe('5,75')
  })

  it('форматирует большие суммы без копеек', () => {
    const result = formatMoney(15000)

    expect(result.replace(/\s/g, '')).toBe('15000')
  })
})

describe('formatLifespan', () => {
  it('форматирует дни', () => {
    expect(formatLifespan(14)).toBe('14 дней')
  })

  it('форматирует месяцы', () => {
    expect(formatLifespan(91)).toBe('3 месяца')
  })

  it('форматирует годы', () => {
    expect(formatLifespan(730)).toBe('2 года')
  })
})
