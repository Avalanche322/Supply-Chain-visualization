import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProductionFilters from '../../filters/ProductionFilters'
import TimelineControl from '../../timeline/TimelineControl'
import { useProductionExplorer } from './useProductionExplorer'

const THEME_STORAGE_KEY = 'origin-map-theme'

function selectFilterOption(label: string, query: string, optionLabel: string) {
  const combobox = screen.getByRole('combobox', { name: label })
  fireEvent.focus(combobox)
  fireEvent.change(combobox, { target: { value: query } })
  fireEvent.click(screen.getByRole('option', { name: optionLabel }))
}

function getOpenOptionLabels(label: string) {
  const combobox = screen.getByRole('combobox', { name: label })
  fireEvent.focus(combobox)
  return Array.from(
    screen.getByRole('listbox', { name: label }).querySelectorAll('[role="option"]'),
  ).map((option) => option.textContent)
}

function ProductionFiltersHarness() {
  const explorer = useProductionExplorer()
  return <ProductionFilters explorer={explorer} />
}

function TimelineHarness() {
  const explorer = useProductionExplorer()
  return (
    <>
      <output aria-label="Timeline year">{explorer.year}</output>
      <ProductionFilters explorer={explorer} />
      <TimelineControl placement="map" explorer={explorer} />
    </>
  )
}

function ExplorerActionsHarness() {
  const explorer = useProductionExplorer()

  return (
    <>
      <output aria-label="Sidebar state">
        {explorer.isPanelOpen ? 'open' : 'closed'}
      </output>
      <output aria-label="Current theme">{explorer.theme}</output>
      <button type="button" onClick={explorer.closePanel}>
        Close sidebar
      </button>
      <button type="button" onClick={() => explorer.selectCountry('BRA')}>
        Select map country
      </button>
      <button type="button" onClick={explorer.toggleTheme}>
        Toggle theme
      </button>
    </>
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('production explorer filter flow', () => {
  it('shows the time period only after choosing a country or product', () => {
    render(<ProductionFiltersHarness />)

    expect(screen.queryByText('TIME PERIOD')).toBeNull()

    selectFilterOption('PRODUCT', 'wheat', 'Wheat')

    expect(screen.getByText('TIME PERIOD')).toBeTruthy()
    expect(screen.getByLabelText('From year')).toBeTruthy()
    expect(screen.getByLabelText('To year')).toBeTruthy()
  })

  it('keeps the country empty when the user starts with a product', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('PRODUCT', 'coffee', 'Coffee')

    expect((screen.getByRole('combobox', { name: 'COUNTRY' }) as HTMLInputElement).value)
      .toBe('')
    expect((screen.getByRole('combobox', { name: 'PRODUCT' }) as HTMLInputElement).value)
      .toBe('Coffee')
    expect(getOpenOptionLabels('COUNTRY')).toHaveLength(6)
  })

  it('selects a compatible product when the user starts with a country', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('COUNTRY', 'braz', 'Brazil')

    expect((screen.getByRole('combobox', { name: 'COUNTRY' }) as HTMLInputElement).value)
      .toBe('Brazil')
    expect((screen.getByRole('combobox', { name: 'PRODUCT' }) as HTMLInputElement).value)
      .toBe('Coffee')
    expect(getOpenOptionLabels('PRODUCT')).toEqual([
      'Choose a product',
      'Coffee',
      'Crude oil',
      'Wheat',
    ])
  })

  it('offers only compatible countries after selecting a product', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('PRODUCT', 'coffee', 'Coffee')

    expect(getOpenOptionLabels('COUNTRY')).toEqual([
      'Choose a country',
      'Brazil',
      'Colombia',
      'Ethiopia',
      'Indonesia',
      'Vietnam',
    ])
  })

  it('filters country options by the search text', () => {
    render(<ProductionFiltersHarness />)

    const countrySelect = screen.getByRole('combobox', { name: 'COUNTRY' })
    fireEvent.focus(countrySelect)
    fireEvent.change(countrySelect, { target: { value: 'ukr' } })

    expect(
      Array.from(
        screen.getByRole('listbox', { name: 'COUNTRY' })
          .querySelectorAll('[role="option"]'),
      ).map((option) => option.textContent),
    ).toEqual(['Choose a country', 'Ukraine'])
  })

  it('clears all active filters with one action', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('COUNTRY', 'braz', 'Brazil')
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect((screen.getByRole('combobox', { name: 'COUNTRY' }) as HTMLInputElement).value)
      .toBe('')
    expect((screen.getByRole('combobox', { name: 'PRODUCT' }) as HTMLInputElement).value)
      .toBe('')
    expect(screen.queryByRole('button', { name: 'Remove country Brazil' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Remove product Coffee' })).toBeNull()
  })

  it('clears the country while keeping the selected product', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('COUNTRY', 'braz', 'Brazil')
    fireEvent.click(screen.getByRole('button', { name: 'Clear country' }))

    expect((screen.getByRole('combobox', { name: 'COUNTRY' }) as HTMLInputElement).value)
      .toBe('')
    expect((screen.getByRole('combobox', { name: 'PRODUCT' }) as HTMLInputElement).value)
      .toBe('Coffee')
    expect(screen.queryByRole('button', { name: 'Clear country' })).toBeNull()
  })

  it('clears the product while keeping the selected country', () => {
    render(<ProductionFiltersHarness />)

    selectFilterOption('COUNTRY', 'braz', 'Brazil')
    fireEvent.click(screen.getByRole('button', { name: 'Clear product' }))

    expect((screen.getByRole('combobox', { name: 'COUNTRY' }) as HTMLInputElement).value)
      .toBe('Brazil')
    expect((screen.getByRole('combobox', { name: 'PRODUCT' }) as HTMLInputElement).value)
      .toBe('')
    expect(screen.queryByRole('button', { name: 'Clear product' })).toBeNull()
  })

  it('opens a closed sidebar after selecting a country on the map', () => {
    render(<ExplorerActionsHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }))
    expect(screen.getByLabelText('Sidebar state').textContent).toBe('closed')

    fireEvent.click(screen.getByRole('button', { name: 'Select map country' }))
    expect(screen.getByLabelText('Sidebar state').textContent).toBe('open')
  })

  it('restores the saved theme and persists theme changes', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { unmount } = render(<ExplorerActionsHarness />)

    expect(screen.getByLabelText('Current theme').textContent).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    unmount()
    render(<ExplorerActionsHarness />)
    expect(screen.getByLabelText('Current theme').textContent).toBe('dark')
  })

  it('uses the default theme for an invalid saved preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'invalid')

    render(<ExplorerActionsHarness />)

    expect(screen.getByLabelText('Current theme').textContent).toBe('dark')
  })

  it('plays the timeline through years in the selected range', () => {
    vi.useFakeTimers()
    render(<TimelineHarness />)
    selectFilterOption('PRODUCT', 'wheat', 'Wheat')
    fireEvent.change(screen.getByRole('slider', { name: 'Production year' }), {
      target: { value: '2010' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Play timeline' }))

    act(() => {
      vi.advanceTimersByTime(900)
    })

    expect(screen.getByLabelText('Timeline year').textContent).toBe('2011')
    expect(screen.getByRole('button', { name: 'Pause timeline' })).toBeTruthy()
  })
})
