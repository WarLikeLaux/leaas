import { pluralize, pluralizeDays, pluralizeMonths, pluralizeYears } from '@/utils/pluralize'

describe('pluralize', () => {
  it('возвращает форму для 1', () => {
    expect(pluralize(1, 'день', 'дня', 'дней')).toBe('день')
  })

  it('возвращает форму для 2-4', () => {
    expect(pluralize(3, 'день', 'дня', 'дней')).toBe('дня')
  })

  it('возвращает форму для 5-20', () => {
    expect(pluralize(15, 'день', 'дня', 'дней')).toBe('дней')
  })

  it('возвращает форму для 11-19', () => {
    expect(pluralize(11, 'год', 'года', 'лет')).toBe('лет')
  })

  it('возвращает форму для 21', () => {
    expect(pluralize(21, 'день', 'дня', 'дней')).toBe('день')
  })

  it('возвращает форму для 0', () => {
    expect(pluralize(0, 'день', 'дня', 'дней')).toBe('дней')
  })
})

describe('pluralizeDays', () => {
  it('склоняет дни', () => {
    expect(pluralizeDays(1)).toBe('день')
    expect(pluralizeDays(2)).toBe('дня')
    expect(pluralizeDays(5)).toBe('дней')
  })
})

describe('pluralizeMonths', () => {
  it('склоняет месяцы', () => {
    expect(pluralizeMonths(1)).toBe('месяц')
    expect(pluralizeMonths(3)).toBe('месяца')
    expect(pluralizeMonths(7)).toBe('месяцев')
  })
})

describe('pluralizeYears', () => {
  it('склоняет годы', () => {
    expect(pluralizeYears(1)).toBe('год')
    expect(pluralizeYears(2)).toBe('года')
    expect(pluralizeYears(5)).toBe('лет')
  })
})
