import { type ReactNode } from 'react'
import s from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={s.layout}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <span className={s.logo}>
            <span className={s.logoAbbr}>LEaaS</span>
            <span className={s.logoFull}>Life Expenses as a Service</span>
          </span>
        </div>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  )
}

export default Layout
