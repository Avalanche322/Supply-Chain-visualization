import { END_YEAR, START_YEAR } from '../production/model/production'
import type { ProductionExplorerModel } from '../explorer/model/useProductionExplorer'
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
    selectCountry,
    selectProduct,
    changeStartYear,
    changeEndYear,
  } = explorer

  return (
    <section className="panel-section" aria-label="Production filters">
      <div className="section-heading">
        <span className="section-index">01</span>
        <h2>Explore by</h2>
      </div>
      <p className="filter-guidance" role="note">
        Start by choosing a country or a product. The other filter will show matching options.
      </p>
      <div className="filter-select">
        <label htmlFor="country-select">COUNTRY</label>
        <div className="filter-control">
          <select
            id="country-select"
            value={selectedCountryId}
            onChange={(event) => selectCountry(event.target.value)}
          >
            <option value="">Choose a country</option>
            {countryOptions.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {selectedCountryId && (
            <button
              className="filter-clear"
              type="button"
              aria-label="Clear country"
              onClick={() => selectCountry('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="filter-select">
        <label htmlFor="product-select">PRODUCT</label>
        <div className="filter-control">
          <select
            id="product-select"
            value={selectedProductId}
            onChange={(event) => selectProduct(event.target.value)}
          >
            <option value="">Choose a product</option>
            {productOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {selectedProductId && (
            <button
              className="filter-clear"
              type="button"
              aria-label="Clear product"
              onClick={() => selectProduct('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
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
    </section>
  )
}

export default ProductionFilters
