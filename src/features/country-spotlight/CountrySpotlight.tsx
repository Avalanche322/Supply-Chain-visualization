import type { ProductionExplorerModel } from '../explorer/model/useProductionExplorer'
import './styles.css'

interface CountrySpotlightProps {
  explorer: Pick<
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
}

function formatValue(value: number, unit: string) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}

function CountrySpotlight({ explorer }: CountrySpotlightProps) {
  const {
    selectedCountry,
    selectedProduct,
    countryProduction,
    countrySeries,
    startYear,
    endYear,
    year,
    marketShare,
    topProducts,
    topCountries,
  } = explorer
  const values = countrySeries.map((point) => point.production)
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 0
  const range = maximum - minimum || 1
  const points = countrySeries
    .map((point, index) => {
      const x = countrySeries.length === 1
        ? 300
        : (index / (countrySeries.length - 1)) * 560 + 20
      const y = 146 - ((point.production - minimum) / range) * 112
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="panel-section spotlight-section" aria-label="Country details">
      <div className="section-heading">
        <span className="section-index">03</span>
        <h2>Country spotlight</h2>
      </div>
      <div className="spotlight-heading">
        <h3>{selectedCountry?.name ?? 'Choose a country'}</h3>
        <span className="country-code">{selectedCountry?.code ?? '—'}</span>
      </div>
      <div className="spotlight-total">
        <span className="metric-label">PRODUCTION IN {year}</span>
        <strong>
          {countryProduction && selectedProduct
            ? formatValue(countryProduction.production, selectedProduct.unit)
            : '—'}
        </strong>
      </div>
      {marketShare !== undefined && (
        <div className="spotlight-share">
          <span>Share of global {selectedProduct?.name ?? 'production'}</span>
          <strong>{(marketShare * 100).toFixed(1)}%</strong>
        </div>
      )}
      <div className="chart-heading">
        <span>Annual trend</span>
        <span>{selectedProduct?.unit ?? 'output'}</span>
      </div>
      <div className="chart-wrap">
        <svg
          className="production-chart"
          viewBox="0 0 600 180"
          role="img"
          aria-label={`${selectedProduct?.name ?? 'Product'} annual production in ${selectedCountry?.name ?? 'selected country'} from ${startYear} to ${endYear}`}
          preserveAspectRatio="none"
        >
          <line x1="20" x2="580" y1="146" y2="146" className="chart-axis" />
          <line x1="20" x2="580" y1="90" y2="90" className="chart-grid" />
          <line x1="20" x2="580" y1="34" y2="34" className="chart-grid" />
          <polyline points={points} className="chart-line" />
          {countrySeries.map((point, index) => {
            const x = countrySeries.length === 1
              ? 300
              : (index / (countrySeries.length - 1)) * 560 + 20
            const y = 146 - ((point.production - minimum) / range) * 112
            return (
              <circle
                key={point.year}
                cx={x}
                cy={y}
                r={point.year === year ? '5' : '3.5'}
                className={`chart-point${point.year === year ? ' chart-point-active' : ''}`}
              />
            )
          })}
        </svg>
        <div className="chart-years">
          <span>{startYear}</span>
          {endYear - startYear > 2 && <span>{Math.round((startYear + endYear) / 2)}</span>}
          <span>{endYear}</span>
        </div>
      </div>
      <div className="top-list">
        <div className="chart-heading">
          <span>{selectedCountry ? 'Top products' : 'Top producers'}</span>
          <span>in {year}</span>
        </div>
        {selectedCountry
          ? topProducts.map((product) => (
              <div className="top-list-row" key={product.id}>
                <span>{product.name}</span>
                <strong>{formatValue(product.production, product.unit)}</strong>
              </div>
            ))
          : selectedProduct
            ? topCountries.map((country, index) => (
                <div className="top-list-row" key={country.countryId}>
                  <span><i>{index + 1}</i>{country.countryName}</span>
                  <strong>{formatValue(country.production, selectedProduct.unit)}</strong>
                </div>
              ))
            : <p className="top-list-empty">Choose a country or product to see rankings.</p>}
      </div>
      <p className="mock-note">Illustrative mock data · 2010–2026</p>
    </section>
  )
}

export default CountrySpotlight
