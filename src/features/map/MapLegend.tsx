import type { Product } from '../production/model/production'
import type { MapCountryStyles } from '../production/model/production'
import { useMemo } from 'react'

interface MapLegendProps {
  selectedProduct?: Product
  data: MapCountryStyles
  year: number
}

function MapLegend({ selectedProduct, data, year }: MapLegendProps) {
  const values = useMemo(
    () => Object.values(data).map(({ production }) => production),
    [data],
  )
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 0
  const format = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)

  return (
    <>
      <div className="map-legend" aria-label={`Map production scale for ${year}`}>
        <span className="legend-caption">
          {selectedProduct
            ? `${selectedProduct.name} · ${year} · ${selectedProduct.unit}`
            : 'Production volume'}
        </span>
        <span className="legend-scale">
          <span>{format(minimum)}</span>
          <span className="legend-gradient" aria-hidden="true" />
          <span>{format(maximum)}</span>
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
