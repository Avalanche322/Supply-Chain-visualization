import type { Product } from '../production/model/production'

interface MapLegendProps {
  selectedProduct?: Product
}

function MapLegend({ selectedProduct }: MapLegendProps) {
  return (
    <>
      <div className="map-legend" aria-label="Map production scale">
        <span className="legend-caption">
          {selectedProduct
            ? `${selectedProduct.name} · ${selectedProduct.unit}`
            : 'Production volume'}
        </span>
        <span className="legend-scale">
          <span>Less</span>
          <span className="legend-gradient" aria-hidden="true" />
          <span>More</span>
        </span>
        <span className="legend-divider" />
        <span className="legend-muted" />
        <span>No data</span>
      </div>
      <div className="map-hint">Select a country on the map to explore</div>
    </>
  )
}

export default MapLegend
