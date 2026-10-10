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
        ? getProductionByCountry(selectedProductId, startYear, endYear)
        : [],
    [selectedProductId, startYear, endYear],
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
    () => getMapCountryStyles(productionByCountry, selectedCountryId, theme),
    [productionByCountry, selectedCountryId, theme],
  )
  const leadingProducer = productionByCountry[0]
  const totalProduction = productionByCountry.reduce(
    (sum, entry) => sum + entry.production,
    0,
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Unable to save the map theme', error)
    }
  }, [theme])

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
      setSelectedProductId(availableProducts[0]?.id ?? '')
    }
  }

  function selectProduct(productId: string) {
    setSelectedProductId(productId)
    if (productId) setSelectedCountryId('')
  }

  function changeStartYear(value: number) {
    setStartYear(value)
    if (value > endYear) setEndYear(value)
  }

  function changeEndYear(value: number) {
    setEndYear(value)
    if (value < startYear) setStartYear(value)
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
    countryOptions,
    productOptions,
    productionByCountry,
    countryProduction,
    countrySeries,
    mapData,
    leadingProducer,
    totalProduction,
    selectCountry,
    selectProduct,
    changeStartYear,
    changeEndYear,
  }
}

export type ProductionExplorerModel = ReturnType<typeof useProductionExplorer>
