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
  })
})
