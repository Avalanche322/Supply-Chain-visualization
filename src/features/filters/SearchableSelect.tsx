import { useId, useRef, useState, type KeyboardEvent } from 'react'
import './styles.css'

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  id: string
  label: string
  value: string
  options: SearchableSelectOption[]
  placeholder: string
  onChange: (value: string) => void
}

function SearchableSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: SearchableSelectProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  function openList() {
    setQuery('')
    setActiveIndex(0)
    setIsOpen(true)
  }

  function selectOption(optionValue: string) {
    onChange(optionValue)
    setIsOpen(false)
    setQuery('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) openList()
      else setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && isOpen && filteredOptions[activeIndex]) {
      event.preventDefault()
      selectOption(filteredOptions[activeIndex].value)
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      setIsOpen(false)
      setQuery('')
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div
      className={`filter-control${isOpen ? ' is-open' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false)
          setQuery('')
        }
      }}
    >
      <input
        ref={inputRef}
        id={id}
        className="filter-select-input"
        type="text"
        role="combobox"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen && filteredOptions[activeIndex]
          ? `${listId}-${filteredOptions[activeIndex].value}`
          : undefined}
        placeholder={placeholder}
        value={isOpen ? query : selectedOption?.label ?? ''}
        onFocus={() => {
          if (!isOpen) openList()
        }}
        onClick={() => {
          if (!isOpen) openList()
        }}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <div className="filter-options" id={listId} role="listbox" aria-label={label}>
          <button
            className={`filter-option${value === '' ? ' is-selected' : ''}`}
            id={`${listId}-empty`}
            type="button"
            role="option"
            aria-selected={value === ''}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectOption('')}
          >
            {placeholder}
          </button>
          {filteredOptions.length
            ? filteredOptions.map((option, index) => (
                <button
                  className={[
                    'filter-option',
                    option.value === value ? ' is-selected' : '',
                    index === activeIndex ? ' is-active' : '',
                  ].filter(Boolean).join(' ')}
                  id={`${listId}-${option.value}`}
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </button>
              ))
            : <span className="filter-no-options">No matching options</span>}
        </div>
      )}
      <span className={`filter-select-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true">
        ⌄
      </span>
      {value && (
        <button
          className="filter-clear"
          type="button"
          aria-label={`Clear ${label.toLowerCase()}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            selectOption('')
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchableSelect
