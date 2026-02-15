import s from './Tabs.module.css'

interface Tab {
  label: string
  icon: string
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeIndex: number
  onChange: (index: number) => void
}

function Tabs({ tabs, activeIndex, onChange }: TabsProps) {
  return (
    <nav className={s.tabs}>
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          className={`${s.tab} ${i === activeIndex ? s.active : ''} ${tab.disabled ? s.disabled : ''}`}
          onClick={() => !tab.disabled && onChange(i)}
          disabled={tab.disabled}
        >
          <span className={s.icon}>{tab.icon}</span>
          <span className={s.label}>{tab.label}</span>
          {tab.disabled && <span className={s.badge}>скоро</span>}
        </button>
      ))}
    </nav>
  )
}

export default Tabs
