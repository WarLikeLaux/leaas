import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-inner">
          <span className="layout-logo">
            <span className="layout-logo-abbr">LEaaS</span>
            <span className="layout-logo-full">Life Expenses as a Service</span>
          </span>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  )
}

export default Layout
