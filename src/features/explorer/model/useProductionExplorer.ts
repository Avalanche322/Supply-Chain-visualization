import { useEffect, useMemo, useState } from 'react'
import {
  COUNTRIES,
  END_YEAR,
  getCountriesForProduct,
  getCountrySeries,
  getMapCountryStyles,
  getProductionByCountry,
  getProductsForCountry,
  PRODUCTS,
  START_YEAR,
  type MapTheme,
} from '../../production/model/production'

const THEME_STORAGE_KEY = 'origin-map-theme'

function readStoredTheme(): MapTheme {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : 'dark'
  } catch (error) {
    console.warn('Unable to read the saved map theme', error)
    return 'dark'
  }
}

export function useProductionExplorer() {
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [theme, setTheme] = useState<MapTheme>(readStoredTheme)
  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [startYear, setStartYear] = useState(START_YEAR)
  const [endYear, setEndYear] = useState(END_YEAR)
  const [year, setYear] = useState(END_YEAR)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedCountry = COUNTRIES.find(
    (country) => country.id === selectedCountryId,
  )
  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId,
  )
  const countryOptions = selectedProductId
    ? getCountriesForProduct(selectedProductId)
    : COUNTRIES
  const productOptions = selectedCountryId
    ? getProductsForCountry(selectedCountryId)
    : PRODUCTS
  const productionByCountry = useMemo(
    () =>
      selectedProductId
        ? getProductionByCountry(selectedProductId, year, year)
        : [],
    [selectedProductId, year],
  )
  const previousProductionByCountry = useMemo(
    () =>
      selectedProductId && year > START_YEAR
        ? getProductionByCountry(selectedProductId, year - 1, year - 1)
        : [],
    [selectedProductId, year],
  )
  const countryProduction = productionByCountry.find(
    (entry) => entry.countryId === selectedCountryId,
  )
  const countrySeries =
    selectedCountryId && selectedProductId
      ? getCountrySeries(
          selectedCountryId,
          selectedProductId,
          startYear,
          endYear,
        )
      : []
  const mapData = useMemo(
    () => getMapCountryStyles(
      productionByCountry,
      selectedCountryId,
      theme,
      previousProductionByCountry,
    ),
    [productionByCountry, previousProductionByCountry, selectedCountryId, theme],
  )
  const leadingProducer = productionByCountry[0]
  const totalProduction = productionByCountry.reduce(
    (sum, entry) => sum + entry.production,
    0,
  )
  const marketShare = totalProduction > 0 && countryProduction
    ? countryProduction.production / totalProduction
    : undefined
  const annualTrend = useMemo(
    () => selectedProductId
      ? Array.from({ length: endYear - startYear + 1 }, (_, index) => {
          const trendYear = startYear + index
          const total = getProductionByCountry(
            selectedProductId,
            trendYear,
            trendYear,
          ).reduce((sum, entry) => sum + entry.production, 0)
          return { year: trendYear, total }
        })
      : [],
    [selectedProductId, startYear, endYear],
  )
  const topProducts = useMemo(
    () => selectedCountryId
      ? getProductsForCountry(selectedCountryId)
          .map((product) => ({
            ...product,
            production: getCountrySeries(
              selectedCountryId,
              product.id,
              year,
              year,
            )[0]?.production ?? 0,
          }))
          .sort((left, right) => right.production - left.production)
          .slice(0, 5)
      : [],
    [selectedCountryId, year],
  )
  const topCountries = productionByCountry.slice(0, 5)

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Unable to save the map theme', error)
    }
  }, [theme])

  useEffect(() => {
    if (!isPlaying || !selectedProductId) return

    const intervalId = window.setInterval(() => {
      setYear((currentYear) =>
        currentYear >= endYear ? startYear : currentYear + 1,
      )
    }, 900)

    return () => window.clearInterval(intervalId)
  }, [isPlaying, selectedProductId, startYear, endYear])

  function selectCountry(countryId: string) {
    if (!countryId) {
      setSelectedCountryId('')
      return
    }

    const availableProducts = getProductsForCountry(countryId)
    setSelectedCountryId(countryId)
    setIsPanelOpen(true)
    if (
      !availableProducts.some((product) => product.id === selectedProductId)
    ) {
      setIsPlaying(false)
      setSelectedProductId(availableProducts[0]?.id ?? '')
    }
  }

  function selectProduct(productId: string) {
    if (productId !== selectedProductId) setIsPlaying(false)
    setSelectedProductId(productId)
    if (productId) setSelectedCountryId('')
  }

  function changeStartYear(value: number) {
    setStartYear(value)
    if (value > endYear) setEndYear(value)
    if (year < value) setYear(value)
  }

  function changeEndYear(value: number) {
    setEndYear(value)
    if (value < startYear) setStartYear(value)
    if (year > value) setYear(value)
  }

  function clearFilters() {
    setSelectedCountryId('')
    setSelectedProductId('')
    setIsPlaying(false)
  }

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  function closePanel() {
    setIsPanelOpen(false)
  }

  function openPanel() {
    setIsPanelOpen(true)
  }

  return {
    isPanelOpen,
    theme,
    toggleTheme,
    closePanel,
    openPanel,
    selectedCountry,
    selectedCountryId,
    selectedProduct,
    selectedProductId,
    startYear,
    endYear,
    year,
    isPlaying,
    countryOptions,
    productOptions,
    productionByCountry,
    countryProduction,
    countrySeries,
    annualTrend,
    mapData,
    leadingProducer,
    totalProduction,
    marketShare,
    topProducts,
    topCountries,
    selectCountry,
    selectProduct,
    changeStartYear,
    changeEndYear,
    setYear,
    setIsPlaying,
    clearFilters,
  }
}

export type ProductionExplorerModel = ReturnType<typeof useProductionExplorer>
