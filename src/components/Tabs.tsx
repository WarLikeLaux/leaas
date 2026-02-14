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
    <nav className="tabs">
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          className={`tab ${i === activeIndex ? 'tab--active' : ''} ${tab.disabled ? 'tab--disabled' : ''}`}
          onClick={() => !tab.disabled && onChange(i)}
          disabled={tab.disabled}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {tab.disabled && <span className="tab-badge">скоро</span>}
        </button>
      ))}
    </nav>
  )
}

export default Tabs
