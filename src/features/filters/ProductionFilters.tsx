import { END_YEAR, START_YEAR } from '../production/model/production'
import type { ProductionExplorerModel } from '../explorer/model/useProductionExplorer'
import SearchableSelect from './SearchableSelect'
import './styles.css'

const YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index,
)

interface ProductionFiltersProps {
  explorer: Pick<
    ProductionExplorerModel,
    | 'countryOptions'
    | 'productOptions'
    | 'selectedCountryId'
    | 'selectedProductId'
    | 'startYear'
    | 'endYear'
    | 'clearFilters'
    | 'selectCountry'
    | 'selectProduct'
    | 'changeStartYear'
    | 'changeEndYear'
  >
}

function ProductionFilters({ explorer }: ProductionFiltersProps) {
  const {
    countryOptions,
    productOptions,
    selectedCountryId,
    selectedProductId,
    startYear,
    endYear,
    clearFilters,
    selectCountry,
    selectProduct,
    changeStartYear,
    changeEndYear,
  } = explorer
  const selectedCountry = countryOptions.find(
    (country) => country.id === selectedCountryId,
  )
  const selectedProduct = productOptions.find(
    (product) => product.id === selectedProductId,
  )
  return (
    <section className="panel-section" aria-label="Production filters">
      {(selectedCountry || selectedProduct) && (
        <div className="active-filters" aria-label="Active filters">
          {selectedCountry && (
            <button
              className="filter-chip"
              type="button"
              aria-label={`Remove country ${selectedCountry.name}`}
              onClick={() => selectCountry('')}
            >
              {selectedCountry.name}<span aria-hidden="true">×</span>
            </button>
          )}
          {selectedProduct && (
            <button
              className="filter-chip"
              type="button"
              aria-label={`Remove product ${selectedProduct.name}`}
              onClick={() => selectProduct('')}
            >
              {selectedProduct.name}<span aria-hidden="true">×</span>
            </button>
          )}
          <button
            className="clear-filters"
            type="button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="section-heading">
        <span className="section-index">01</span>
        <h2>Explore by</h2>
      </div>
      <p className="filter-guidance" role="note">
        Start by choosing a country or a product. The other filter will show matching options.
      </p>
      <div className="filter-select">
        <label htmlFor="country-select">COUNTRY</label>
        <SearchableSelect
          id="country-select"
          label="COUNTRY"
          value={selectedCountryId}
          options={countryOptions.map(({ id, name }) => ({ value: id, label: name }))}
          placeholder="Choose a country"
          onChange={selectCountry}
        />
      </div>
      <div className="filter-select">
        <label htmlFor="product-select">PRODUCT</label>
        <SearchableSelect
          id="product-select"
          label="PRODUCT"
          value={selectedProductId}
          options={productOptions.map(({ id, name }) => ({ value: id, label: name }))}
          placeholder="Choose a product"
          onChange={selectProduct}
        />
      </div>
      {(selectedCountry || selectedProduct) && (
        <div className="year-field">
          <span className="filter-label">TIME PERIOD</span>
          <div className="year-range">
            <label className="visually-hidden" htmlFor="start-year">From year</label>
            <select
              id="start-year"
              value={startYear}
              onChange={(event) => changeStartYear(Number(event.target.value))}
            >
              {YEARS.filter((year) => year <= endYear).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="range-dash">—</span>
            <label className="visually-hidden" htmlFor="end-year">To year</label>
            <select
              id="end-year"
              value={endYear}
              onChange={(event) => changeEndYear(Number(event.target.value))}
            >
              {YEARS.filter((year) => year >= startYear).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductionFilters
