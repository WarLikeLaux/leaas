export function pluralize(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(Math.floor(count))
  const mod10 = abs % 10
  const mod100 = abs % 100

  if (mod100 >= 11 && mod100 <= 19) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

export function pluralizeDays(count: number): string {
  return pluralize(count, 'день', 'дня', 'дней')
}

export function pluralizeMonths(count: number): string {
  return pluralize(count, 'месяц', 'месяца', 'месяцев')
}

export function pluralizeYears(count: number): string {
  return pluralize(count, 'год', 'года', 'лет')
}

export function pluralizeExpenses(count: number): string {
  return pluralize(count, 'расход', 'расхода', 'расходов')
}
