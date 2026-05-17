'use client'

export default function SearchBar({ value, onChange, placeholder = "Buscar comandos..." }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        autoComplete="off"
      />
      <span className="search-icon">🔍</span>
    </div>
  )
}
