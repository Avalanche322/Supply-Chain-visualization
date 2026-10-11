import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ProductionExplorerModel } from '../explorer/model/useProductionExplorer'
import CountrySpotlight from './CountrySpotlight'

const selectedExplorer = {
  selectedCountry: { id: 'BRA', code: 'BRA', name: 'Brazil' },
  selectedProduct: { id: 'coffee', name: 'Coffee', unit: 'million tonnes' },
  countryProduction: {
    countryId: 'BRA',
    countryName: 'Brazil',
    production: 65.25,
  },
  countrySeries: [
    { year: 2010, production: 3.2 },
    { year: 2011, production: 3.7 },
    { year: 2012, production: 3.5 },
  ],
  startYear: 2010,
  endYear: 2012,
  year: 2012,
  marketShare: 0.25,
  topProducts: [
    { id: 'coffee', name: 'Coffee', unit: 'million tonnes', production: 3.5 },
  ],
  topCountries: [
    { countryId: 'BRA', countryName: 'Brazil', production: 65.25 },
  ],
} satisfies Pick<
  ProductionExplorerModel,
  | 'selectedCountry'
  | 'selectedProduct'
  | 'countryProduction'
  | 'countrySeries'
  | 'startYear'
  | 'endYear'
  | 'year'
  | 'marketShare'
  | 'topProducts'
  | 'topCountries'
>

describe('CountrySpotlight', () => {
  it('shows selected country production and annual trend', () => {
    const { container } = render(<CountrySpotlight explorer={selectedExplorer} />)
    const points = container.querySelector('.chart-line')
      ?.getAttribute('points')
      ?.split(' ')

    expect(screen.getByRole('heading', { name: 'Brazil' }).textContent)
      .toBe('Brazil')
    expect(screen.getByText('BRA').textContent).toBe('BRA')
    expect(screen.getByText('65.3 million tonnes').textContent)
      .toBe('65.3 million tonnes')
    expect(screen.getByText('25.0%').textContent).toBe('25.0%')
    expect(screen.getByText('Top products').textContent).toBe('Top products')
    expect(screen.getByText('3.5 million tonnes').textContent)
      .toBe('3.5 million tonnes')
    expect(container.querySelectorAll('.chart-point')).toHaveLength(3)
    expect(points).toHaveLength(3)
    expect(points?.[0]).toBe('20,146')
    expect(points?.[1]).toBe('300,34')
    const lastPoint = points?.[2].split(',').map(Number)
    expect(lastPoint?.[0]).toBe(580)
    expect(lastPoint?.[1]).toBeCloseTo(78.8)
    expect(screen.getByText('2012').textContent).toBe('2012')
  })

  it('shows placeholders and an empty trend when no country is selected', () => {
    const { container } = render(
      <CountrySpotlight
        explorer={{
          ...selectedExplorer,
          selectedCountry: undefined,
          countryProduction: undefined,
          countrySeries: [],
          selectedProduct: undefined,
          marketShare: undefined,
          topProducts: [],
          topCountries: [],
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Choose a country' }).textContent)
      .toBe('Choose a country')
    expect(screen.getByRole('img', {
      name: 'Product annual production in selected country from 2010 to 2012',
    })).toBeTruthy()
    expect(container.querySelector('.chart-line')?.getAttribute('points'))
      .toBe('')
    expect(container.querySelectorAll('.chart-point')).toHaveLength(0)
  })
})
