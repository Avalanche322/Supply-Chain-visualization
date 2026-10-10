import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ProductionFilters from '../../filters/ProductionFilters'
import { useProductionExplorer } from './useProductionExplorer'

const THEME_STORAGE_KEY = 'origin-map-theme'

function ProductionFiltersHarness() {
  const explorer = useProductionExplorer()
  return <ProductionFilters explorer={explorer} />
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

describe('production explorer filter flow', () => {
  it('keeps the country empty when the user starts with a product', () => {
    render(<ProductionFiltersHarness />)

    fireEvent.change(screen.getByLabelText('PRODUCT'), {
      target: { value: 'coffee' },
    })

    expect((screen.getByLabelText('COUNTRY') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('PRODUCT') as HTMLSelectElement).value)
      .toBe('coffee')
    expect(screen.getByLabelText('COUNTRY').querySelectorAll('option'))
      .toHaveLength(6)
  })

  it('selects a compatible product when the user starts with a country', () => {
    render(<ProductionFiltersHarness />)

    fireEvent.change(screen.getByLabelText('COUNTRY'), {
      target: { value: 'BRA' },
    })

    expect((screen.getByLabelText('COUNTRY') as HTMLSelectElement).value)
      .toBe('BRA')
    expect((screen.getByLabelText('PRODUCT') as HTMLSelectElement).value)
      .toBe('coffee')
    expect(
      Array.from(screen.getByLabelText('PRODUCT').querySelectorAll('option'))
        .map((option) => option.value),
    ).toEqual(['', 'coffee', 'crude-oil', 'wheat'])
  })

  it('offers only compatible countries after selecting a product', () => {
    render(<ProductionFiltersHarness />)

    fireEvent.change(screen.getByLabelText('PRODUCT'), {
      target: { value: 'coffee' },
    })

    expect(
      Array.from(screen.getByLabelText('COUNTRY').querySelectorAll('option'))
        .map((option) => option.value),
    ).toEqual(['', 'BRA', 'COL', 'ETH', 'IDN', 'VNM'])
  })

  it('clears the country while keeping the selected product', () => {
    render(<ProductionFiltersHarness />)

    fireEvent.change(screen.getByLabelText('COUNTRY'), {
      target: { value: 'BRA' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Clear country' }))

    expect((screen.getByLabelText('COUNTRY') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('PRODUCT') as HTMLSelectElement).value)
      .toBe('coffee')
    expect(screen.queryByRole('button', { name: 'Clear country' })).toBeNull()
  })

  it('clears the product while keeping the selected country', () => {
    render(<ProductionFiltersHarness />)

    fireEvent.change(screen.getByLabelText('COUNTRY'), {
      target: { value: 'BRA' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Clear product' }))

    expect((screen.getByLabelText('COUNTRY') as HTMLSelectElement).value)
      .toBe('BRA')
    expect((screen.getByLabelText('PRODUCT') as HTMLSelectElement).value).toBe('')
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
})
