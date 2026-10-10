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
        <span className="metric-label">PRODUCTION IN PERIOD</span>
        <strong>
          {countryProduction && selectedProduct
            ? formatValue(countryProduction.production, selectedProduct.unit)
            : '—'}
        </strong>
      </div>
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
            return <circle key={point.year} cx={x} cy={y} r="3.5" className="chart-point" />
          })}
        </svg>
        <div className="chart-years">
          <span>{startYear}</span>
          {endYear - startYear > 2 && <span>{Math.round((startYear + endYear) / 2)}</span>}
          <span>{endYear}</span>
        </div>
      </div>
      <p className="mock-note">Illustrative mock data · 2010–2026</p>
    </section>
  )
}

export default CountrySpotlight
