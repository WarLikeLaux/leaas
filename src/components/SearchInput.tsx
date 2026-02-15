import { useState } from 'react'
import s from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`${s.wrapper} ${focused ? s.focused : ''}`}>
      <span className={s.icon}>🔍</span>
      <input
        className={s.field}
        type="text"
        placeholder="Поиск по названию..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className={s.clear} onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  )
}

export default SearchInput
