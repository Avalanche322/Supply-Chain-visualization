export const START_YEAR = 2010
export const END_YEAR = 2026

export interface Country {
  id: string
  code: string
  name: string
}

export interface Product {
  id: string
  name: string
  unit: string
}

interface ProductionPair {
  countryId: string
  productId: string
  baseline: number
  annualGrowth: number
  phase: number
}

export interface CountryProduction {
  countryId: string
  countryName: string
  production: number
}

export interface AnnualProduction {
  year: number
  production: number
}

export interface MapCountryStyle {
  fillColor: string
  isSelected: boolean
  production: number
  changePercent?: number
}

export type MapCountryStyles = Record<string, MapCountryStyle>

export type MapTheme = 'light' | 'dark'

export const COUNTRIES: Country[] = [
  { id: 'ARG', code: 'ARG', name: 'Argentina' },
  { id: 'AUS', code: 'AUS', name: 'Australia' },
  { id: 'BRA', code: 'BRA', name: 'Brazil' },
  { id: 'CAN', code: 'CAN', name: 'Canada' },
  { id: 'CHL', code: 'CHL', name: 'Chile' },
  { id: 'CHN', code: 'CHN', name: 'China' },
  { id: 'COL', code: 'COL', name: 'Colombia' },
  { id: 'DEU', code: 'DEU', name: 'Germany' },
  { id: 'ETH', code: 'ETH', name: 'Ethiopia' },
  { id: 'FRA', code: 'FRA', name: 'France' },
  { id: 'IDN', code: 'IDN', name: 'Indonesia' },
  { id: 'IND', code: 'IND', name: 'India' },
  { id: 'JPN', code: 'JPN', name: 'Japan' },
  { id: 'KOR', code: 'KOR', name: 'South Korea' },
  { id: 'MEX', code: 'MEX', name: 'Mexico' },
  { id: 'NLD', code: 'NLD', name: 'Netherlands' },
  { id: 'PER', code: 'PER', name: 'Peru' },
  { id: 'POL', code: 'POL', name: 'Poland' },
  { id: 'SAU', code: 'SAU', name: 'Saudi Arabia' },
  { id: 'ZAF', code: 'ZAF', name: 'South Africa' },
  { id: 'TWN', code: 'TWN', name: 'Taiwan' },
  { id: 'UKR', code: 'UKR', name: 'Ukraine' },
  { id: 'USA', code: 'USA', name: 'United States' },
  { id: 'VNM', code: 'VNM', name: 'Vietnam' },
]

export const PRODUCTS: Product[] = [
  { id: 'coffee', name: 'Coffee', unit: 'million tonnes' },
  { id: 'copper', name: 'Copper', unit: 'million tonnes' },
  { id: 'crude-oil', name: 'Crude oil', unit: 'million barrels / day' },
  { id: 'lithium', name: 'Lithium', unit: 'thousand tonnes' },
  { id: 'semiconductors', name: 'Semiconductors', unit: 'production index' },
  { id: 'wheat', name: 'Wheat', unit: 'million tonnes' },
]

const productionPairs: ProductionPair[] = [
  { countryId: 'ARG', productId: 'wheat', baseline: 15, annualGrowth: 0.018, phase: 1 },
  { countryId: 'ARG', productId: 'lithium', baseline: 3, annualGrowth: 0.11, phase: 4 },
  { countryId: 'AUS', productId: 'wheat', baseline: 26, annualGrowth: 0.021, phase: 2 },
  { countryId: 'AUS', productId: 'copper', baseline: 0.9, annualGrowth: 0.015, phase: 5 },
  { countryId: 'AUS', productId: 'lithium', baseline: 10, annualGrowth: 0.13, phase: 2 },
  { countryId: 'BRA', productId: 'coffee', baseline: 3.1, annualGrowth: 0.026, phase: 3 },
  { countryId: 'BRA', productId: 'wheat', baseline: 6, annualGrowth: 0.035, phase: 1 },
  { countryId: 'BRA', productId: 'crude-oil', baseline: 2.1, annualGrowth: 0.04, phase: 5 },
  { countryId: 'CAN', productId: 'wheat', baseline: 27, annualGrowth: 0.02, phase: 4 },
  { countryId: 'CAN', productId: 'crude-oil', baseline: 3.3, annualGrowth: 0.027, phase: 2 },
  { countryId: 'CHL', productId: 'copper', baseline: 5.4, annualGrowth: 0.018, phase: 3 },
  { countryId: 'CHL', productId: 'lithium', baseline: 10, annualGrowth: 0.07, phase: 5 },
  { countryId: 'CHN', productId: 'wheat', baseline: 115, annualGrowth: 0.012, phase: 5 },
  { countryId: 'CHN', productId: 'copper', baseline: 1.2, annualGrowth: 0.04, phase: 3 },
  { countryId: 'CHN', productId: 'lithium', baseline: 3, annualGrowth: 0.12, phase: 1 },
  { countryId: 'CHN', productId: 'semiconductors', baseline: 25, annualGrowth: 0.085, phase: 1 },
  { countryId: 'COL', productId: 'coffee', baseline: 0.75, annualGrowth: 0.021, phase: 5 },
  { countryId: 'DEU', productId: 'wheat', baseline: 24, annualGrowth: 0.011, phase: 2 },
  { countryId: 'DEU', productId: 'semiconductors', baseline: 16, annualGrowth: 0.06, phase: 2 },
  { countryId: 'ETH', productId: 'coffee', baseline: 0.37, annualGrowth: 0.035, phase: 2 },
  { countryId: 'FRA', productId: 'wheat', baseline: 38, annualGrowth: 0.014, phase: 4 },
  { countryId: 'IDN', productId: 'coffee', baseline: 0.69, annualGrowth: 0.026, phase: 1 },
  { countryId: 'IDN', productId: 'copper', baseline: 0.8, annualGrowth: 0.048, phase: 3 },
  { countryId: 'IND', productId: 'wheat', baseline: 81, annualGrowth: 0.022, phase: 1 },
  { countryId: 'IND', productId: 'crude-oil', baseline: 0.8, annualGrowth: 0.009, phase: 4 },
  { countryId: 'JPN', productId: 'semiconductors', baseline: 22, annualGrowth: 0.035, phase: 2 },
  { countryId: 'KOR', productId: 'semiconductors', baseline: 27, annualGrowth: 0.075, phase: 5 },
  { countryId: 'MEX', productId: 'crude-oil', baseline: 2.6, annualGrowth: -0.006, phase: 4 },
  { countryId: 'MEX', productId: 'copper', baseline: 0.5, annualGrowth: 0.022, phase: 2 },
  { countryId: 'NLD', productId: 'wheat', baseline: 1.5, annualGrowth: 0.012, phase: 3 },
  { countryId: 'NLD', productId: 'semiconductors', baseline: 8.2, annualGrowth: 0.075, phase: 2 },
  { countryId: 'PER', productId: 'copper', baseline: 1.2, annualGrowth: 0.031, phase: 5 },
  { countryId: 'POL', productId: 'wheat', baseline: 9.3, annualGrowth: 0.023, phase: 4 },
  { countryId: 'SAU', productId: 'crude-oil', baseline: 9.8, annualGrowth: 0.013, phase: 4 },
  { countryId: 'ZAF', productId: 'copper', baseline: 0.12, annualGrowth: 0.014, phase: 1 },
  { countryId: 'TWN', productId: 'semiconductors', baseline: 29, annualGrowth: 0.09, phase: 3 },
  { countryId: 'UKR', productId: 'wheat', baseline: 16.8, annualGrowth: 0.019, phase: 5 },
  { countryId: 'USA', productId: 'wheat', baseline: 60, annualGrowth: 0.018, phase: 3 },
  { countryId: 'USA', productId: 'crude-oil', baseline: 5.5, annualGrowth: 0.045, phase: 1 },
  { countryId: 'USA', productId: 'copper', baseline: 1.1, annualGrowth: 0.012, phase: 4 },
  { countryId: 'USA', productId: 'semiconductors', baseline: 32, annualGrowth: 0.065, phase: 4 },
  { countryId: 'VNM', productId: 'coffee', baseline: 1.1, annualGrowth: 0.032, phase: 4 },
]

function getPair(countryId: string, productId: string) {
  return productionPairs.find(
    (pair) => pair.countryId === countryId && pair.productId === productId,
  )
}

function getAnnualValue(pair: ProductionPair, year: number) {
  const yearsFromStart = year - START_YEAR
  const cycle = yearsFromStart + pair.phase
  const variation = 1
    + Math.sin(cycle * 0.72) * 0.13
    + Math.sin(cycle * 0.27 + 1.4) * 0.06
  return Math.max(
    0,
    pair.baseline * (1 + pair.annualGrowth) ** yearsFromStart * variation,
  )
}

export function getProductsForCountry(countryId: string) {
  const productIds = new Set(
    productionPairs
      .filter((pair) => pair.countryId === countryId)
      .map((pair) => pair.productId),
  )
  return PRODUCTS.filter((product) => productIds.has(product.id))
}

export function getCountriesForProduct(productId: string) {
  const countryIds = new Set(
    productionPairs
      .filter((pair) => pair.productId === productId)
      .map((pair) => pair.countryId),
  )
  return COUNTRIES.filter((country) => countryIds.has(country.id))
}

export function getProductionByCountry(
  productId: string,
  startYear: number,
  endYear: number,
): CountryProduction[] {
  return productionPairs
    .filter((pair) => pair.productId === productId)
    .map((pair) => {
      const country = COUNTRIES.find((entry) => entry.id === pair.countryId)!
      const production = Array.from(
        { length: endYear - startYear + 1 },
        (_, index) => getAnnualValue(pair, startYear + index),
      ).reduce((sum, value) => sum + value, 0)
      return {
        countryId: pair.countryId,
        countryName: country.name,
        production,
      }
    })
    .sort((left, right) => right.production - left.production)
}

export function getCountrySeries(
  countryId: string,
  productId: string,
  startYear: number,
  endYear: number,
): AnnualProduction[] {
  const pair = getPair(countryId, productId)
  if (!pair) return []
  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  ).map((year) => ({
    year,
    production: getAnnualValue(pair, year),
  }))
}

function colorForProductionInTheme(
  value: number,
  maxValue: number,
  theme: MapTheme,
) {
  if (value <= 0) return 'rgba(0, 0, 0, 0)'
  const amount = Math.min(value / maxValue, 1)
  const start = theme === 'dark' ? [36, 75, 50] : [216, 233, 210]
  const end = theme === 'dark' ? [164, 207, 145] : [57, 117, 69]
  const color = start.map((channel, index) =>
    Math.round(channel + (end[index] - channel) * amount),
  )
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export function getMapCountryStyles(
  production: CountryProduction[],
  selectedCountryId: string,
  theme: MapTheme = 'dark',
  previousProduction: CountryProduction[] = [],
): MapCountryStyles {
  const maxValue = Math.max(...production.map((entry) => entry.production), 1)
  const previousByCountry = new Map(
    previousProduction.map((entry) => [entry.countryId, entry.production]),
  )
  return Object.fromEntries(
    production.map((entry) => [
      entry.countryId,
      {
        fillColor: colorForProductionInTheme(entry.production, maxValue, theme),
        isSelected: entry.countryId === selectedCountryId,
        production: entry.production,
        ...(previousByCountry.has(entry.countryId)
          ? {
              changePercent:
                ((entry.production - previousByCountry.get(entry.countryId)!)
                  / previousByCountry.get(entry.countryId)!) * 100,
            }
          : {}),
      },
    ]),
  )
}
