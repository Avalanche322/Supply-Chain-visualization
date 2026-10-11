import { describe, expect, it } from 'vitest'
import {
  COUNTRIES,
  getCountriesForProduct,
  getCountrySeries,
  getMapCountryStyles,
  getProductionByCountry,
  getProductsForCountry,
} from './production'

describe('production data selectors', () => {
  it('lists only products produced by the selected country', () => {
    expect(getProductsForCountry('BRA').map(({ id }) => id)).toEqual([
      'coffee',
      'crude-oil',
      'wheat',
    ])
  })

  it('lists only countries producing the selected product', () => {
    expect(getCountriesForProduct('coffee').map(({ id }) => id)).toEqual([
      'BRA',
      'COL',
      'ETH',
      'IDN',
      'VNM',
    ])
  })

  it('does not include Russia in the country data', () => {
    expect(COUNTRIES.some(({ id, name }) => id === 'RUS' || name === 'Russia'))
      .toBe(false)
  })

  it('includes Ukraine, Poland, and the Netherlands with mock production', () => {
    const newCountryIds = ['UKR', 'POL', 'NLD']

    expect(
      COUNTRIES.filter(({ id }) => newCountryIds.includes(id)).map(
        ({ id }) => id,
      ),
    ).toEqual(expect.arrayContaining(newCountryIds))
    expect(getProductsForCountry('UKR').map(({ id }) => id)).toContain('wheat')
    expect(getProductsForCountry('POL').map(({ id }) => id)).toContain('wheat')
    expect(getProductsForCountry('NLD').map(({ id }) => id)).toEqual([
      'semiconductors',
      'wheat',
    ])
    expect(getCountriesForProduct('wheat').map(({ id }) => id))
      .toEqual(expect.arrayContaining(newCountryIds))
  })
})

describe('production aggregates', () => {
  it('returns an inclusive annual series for a valid country-product pair', () => {
    const series = getCountrySeries('BRA', 'coffee', 2010, 2012)

    expect(series).toHaveLength(3)
    expect(series.map(({ year }) => year)).toEqual([2010, 2011, 2012])
    expect(series.every(({ production }) => production > 0)).toBe(true)
  })

  it('returns no annual series for a pair without mock data', () => {
    expect(getCountrySeries('FRA', 'coffee', 2010, 2026)).toEqual([])
  })

  it('shows noticeable deterministic variation between annual mock values', () => {
    const series = getCountrySeries('BRA', 'coffee', 2010, 2026)
    const annualChanges = series.slice(1).map((entry, index) =>
      (entry.production - series[index].production) / series[index].production,
    )

    expect(Math.max(...annualChanges) - Math.min(...annualChanges)).toBeGreaterThan(0.12)
    expect(getCountrySeries('BRA', 'coffee', 2010, 2026)).toEqual(series)
  })

  it('returns annual wheat production for each newly added country', () => {
    for (const countryId of ['UKR', 'POL', 'NLD']) {
      const series = getCountrySeries(countryId, 'wheat', 2010, 2026)

      expect(series).toHaveLength(17)
      expect(series.every(({ production }) => production > 0)).toBe(true)
    }
  })

  it('sorts product totals from highest to lowest production', () => {
    const totals = getProductionByCountry('coffee', 2010, 2026)

    expect(totals[0].countryId).toBe('BRA')
    expect(totals.every(
      (entry, index) => index === 0 || totals[index - 1].production >= entry.production,
    )).toBe(true)
  })

  it('generates theme-aware map styles and marks the selected country', () => {
    const production = getProductionByCountry('coffee', 2010, 2026)
    const darkStyles = getMapCountryStyles(production, 'BRA', 'dark')
    const lightStyles = getMapCountryStyles(production, 'BRA', 'light')

    expect(darkStyles.BRA.isSelected).toBe(true)
    expect(darkStyles.COL.isSelected).toBe(false)
    expect(darkStyles.BRA.fillColor).not.toBe(lightStyles.BRA.fillColor)
    for (const color of [
      ...Object.values(darkStyles).map(({ fillColor }) => fillColor),
      ...Object.values(lightStyles).map(({ fillColor }) => fillColor),
    ]) {
      const red = Number.parseInt(color.slice(1, 3), 16)
      const green = Number.parseInt(color.slice(3, 5), 16)
      const blue = Number.parseInt(color.slice(5, 7), 16)

      expect(green).toBeGreaterThan(red)
      expect(green).toBeGreaterThan(blue)
    }
  })

  it('adds annual values and year-over-year change to map styles', () => {
    const styles = getMapCountryStyles(
      [{ countryId: 'BRA', countryName: 'Brazil', production: 12 }],
      '',
      'dark',
      [{ countryId: 'BRA', countryName: 'Brazil', production: 10 }],
    )

    expect(styles.BRA.production).toBe(12)
    expect(styles.BRA.changePercent).toBe(20)
  })
})
