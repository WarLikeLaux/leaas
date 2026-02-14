import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('отображает заголовок секции', () => {
    render(<App />)

    expect(screen.getByText('Расходы')).toBeInTheDocument()
  })

  it('отображает логотип в хедере', () => {
    render(<App />)

    expect(screen.getByText('LEaaS')).toBeInTheDocument()
    expect(screen.getByText('Life Expenses as a Service')).toBeInTheDocument()
  })

  it('отображает мобильную заглушку', () => {
    render(<App />)

    expect(screen.getByText('Откройте на компьютере')).toBeInTheDocument()
  })

  it('отображает пустое состояние при отсутствии расходов', () => {
    render(<App />)

    expect(screen.getByText('Расходов пока нет. Добавьте первый.')).toBeInTheDocument()
  })
})
