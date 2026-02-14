import { useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`search-input ${focused ? 'search-input--focused' : ''}`}>
      <span className="search-input-icon">🔍</span>
      <input
        className="search-input-field"
        type="text"
        placeholder="Поиск по названию..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="search-input-clear" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  )
}

export default SearchInput
