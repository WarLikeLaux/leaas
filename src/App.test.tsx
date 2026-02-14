import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)

    expect(screen.getByText('Life Expenses')).toBeInTheDocument()
    expect(screen.getByText('as a Service')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<App />)

    expect(screen.getByText('В разработке')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<App />)

    expect(
      screen.getByText('Финансовый рентген: узнай реальную стоимость своей жизни.'),
    ).toBeInTheDocument()
  })
})
