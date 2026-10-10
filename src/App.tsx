import ProductionFilters from './features/filters/ProductionFilters'
import MapLegend from './features/map/MapLegend'
import MapView from './features/map/MapView'
import { useProductionExplorer } from './features/explorer/model/useProductionExplorer'
import CountrySpotlight from './features/country-spotlight/CountrySpotlight'
import ProductionExplorerLayout from './features/shell/ProductionExplorerLayout'
import type { ProductionExplorerModel } from './features/explorer/model/useProductionExplorer'
import './features/summary/styles.css'

interface ProductionSummaryProps {
  explorer: Pick<
    ProductionExplorerModel,
    | 'startYear'
    | 'endYear'
    | 'selectedProduct'
    | 'totalProduction'
    | 'productionByCountry'
    | 'leadingProducer'
  >
}

function formatValue(value: number, unit: string) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`
}

function ProductionSummary({ explorer }: ProductionSummaryProps) {
  const {
    startYear,
    endYear,
    selectedProduct,
    totalProduction,
    productionByCountry,
    leadingProducer,
  } = explorer

  return (
    <section className="panel-section summary-section" aria-label="Production summary">
      <div className="section-heading">
        <span className="section-index">02</span>
        <h2>At a glance</h2>
        <span className="summary-years">{startYear}—{endYear}</span>
      </div>
      <div className="summary-total">
        <span className="metric-label">TOTAL PRODUCTION</span>
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
            onCountrySelect={explorer.selectCountry}
          />
          <MapLegend selectedProduct={explorer.selectedProduct} />
        </>
      }
    >
      <ProductionFilters explorer={explorer} />
      <ProductionSummary explorer={explorer} />
      <CountrySpotlight explorer={explorer} />
    </ProductionExplorerLayout>
  )
}

export default App
