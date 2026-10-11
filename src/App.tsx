import ProductionFilters from './features/filters/ProductionFilters'
import MapLegend from './features/map/MapLegend'
import TimelineControl from './features/timeline/TimelineControl'
import MapView from './features/map/MapView'
import { useProductionExplorer } from './features/explorer/model/useProductionExplorer'
import CountrySpotlight from './features/country-spotlight/CountrySpotlight'
import ProductionExplorerLayout from './features/shell/ProductionExplorerLayout'
import type { ProductionExplorerModel } from './features/explorer/model/useProductionExplorer'
import './features/summary/styles.css'

interface ProductionSummaryProps {
  explorer: Pick<
    ProductionExplorerModel,
    | 'year'
    | 'selectedProduct'
    | 'totalProduction'
    | 'productionByCountry'
    | 'leadingProducer'
    | 'marketShare'
  >
}

function formatValue(value: number, unit: string) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}

function ProductionSummary({ explorer }: ProductionSummaryProps) {
  const {
    year,
    selectedProduct,
    totalProduction,
    productionByCountry,
    leadingProducer,
    marketShare,
  } = explorer

  return (
    <section className="panel-section summary-section" aria-label="Production summary">
      <div className="section-heading">
        <span className="section-index">02</span>
        <h2>At a glance</h2>
        <span className="summary-years">{year}</span>
      </div>
      <div className="summary-total">
        <span className="metric-label">GLOBAL PRODUCTION</span>
        <strong>
          {selectedProduct
            ? formatValue(totalProduction, selectedProduct.unit)
            : '—'}
        </strong>
        <span className="metric-caption">
          {selectedProduct?.name ?? 'Select a product to view total'}
        </span>
      </div>
      <div className="summary-pair">
        <div className="summary-stat">
          <span className="metric-label">COUNTRIES</span>
          <strong>{selectedProduct ? productionByCountry.length : '—'}</strong>
        </div>
        <div className="summary-stat top-producer">
          <span className="metric-label">TOP PRODUCER</span>
          <strong>{leadingProducer?.countryName ?? '—'}</strong>
        </div>
      </div>
      <div className="summary-market-share">
        <span className="metric-label">SELECTED COUNTRY SHARE</span>
        <strong>{marketShare === undefined
          ? '—'
          : `${(marketShare * 100).toFixed(1)}%`}</strong>
      </div>
    </section>
  )
}

function App() {
  const explorer = useProductionExplorer()

  return (
    <ProductionExplorerLayout
      theme={explorer.theme}
      isPanelOpen={explorer.isPanelOpen}
      onToggleTheme={explorer.toggleTheme}
      onClosePanel={explorer.closePanel}
      onOpenPanel={explorer.openPanel}
      map={
        <>
          <MapView
            data={explorer.mapData}
            theme={explorer.theme}
            selectedProduct={explorer.selectedProduct}
            year={explorer.year}
            onCountrySelect={explorer.selectCountry}
          />
          <TimelineControl placement="map" explorer={explorer} />
          <MapLegend
            selectedProduct={explorer.selectedProduct}
            data={explorer.mapData}
            year={explorer.year}
          />
        </>
      }
    >
      <ProductionFilters explorer={explorer} />
      <TimelineControl placement="sidebar" explorer={explorer} />
      <ProductionSummary explorer={explorer} />
      <CountrySpotlight explorer={explorer} />
    </ProductionExplorerLayout>
  )
}

export default App
