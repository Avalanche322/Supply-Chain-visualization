import type { CSSProperties } from 'react'
import type { ProductionExplorerModel } from '../explorer/model/useProductionExplorer'
import './styles.css'

interface TimelineControlProps {
  placement: 'map' | 'sidebar'
  explorer: Pick<
    ProductionExplorerModel,
    | 'selectedProduct'
    | 'selectedCountryId'
    | 'year'
    | 'startYear'
    | 'endYear'
    | 'isPlaying'
    | 'annualTrend'
    | 'setYear'
    | 'setIsPlaying'
  >
}

function TimelineControl({ explorer, placement }: TimelineControlProps) {
  const {
    selectedProduct,
    selectedCountryId,
    year,
    startYear,
    endYear,
    isPlaying,
    annualTrend,
    setYear,
    setIsPlaying,
  } = explorer
  if (!selectedProduct && !selectedCountryId) return null

  const values = annualTrend.map(({ total }) => total)
  const maxValue = Math.max(...values, 1)
  const sparkline = annualTrend.map(({ total }, index) => {
    const x = annualTrend.length < 2
      ? 50
      : (index / (annualTrend.length - 1)) * 100
    const y = 24 - (total / maxValue) * 20
    return `${x},${y}`
  }).join(' ')

  return (
    <section
      className={`timeline-control timeline-control-${placement}`}
      aria-label="Production timeline"
    >
      <div className="timeline-heading">
        <div>
          <span className="timeline-eyebrow">ANNUAL PRODUCTION</span>
          <strong aria-live="polite">{year}</strong>
        </div>
        <svg
          className="timeline-sparkline"
          viewBox="0 0 100 28"
          role="img"
          aria-label={selectedProduct
            ? `${selectedProduct.name} global production trend from ${startYear} to ${endYear}`
            : 'Select a product to view production trend'}
        >
          <polyline points={sparkline} />
        </svg>
        {(placement !== 'map' || selectedProduct || selectedCountryId) && (
          <button
            className="timeline-play"
            type="button"
            aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
            title={isPlaying ? 'Pause timeline' : 'Play timeline'}
            disabled={!selectedProduct || startYear === endYear}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
        )}
      </div>
      <input
        className="timeline-slider"
        type="range"
        aria-label="Production year"
        min={startYear}
        max={endYear}
        step={1}
        value={year}
        disabled={!selectedProduct || startYear === endYear}
        onChange={(event) => setYear(Number(event.target.value))}
        style={{
          '--timeline-progress': `${endYear === startYear
            ? 100
            : ((year - startYear) / (endYear - startYear)) * 100}%`,
        } as CSSProperties}
      />
      <div className="timeline-range">
        <span>{startYear}</span>
        <span>{selectedProduct
          ? `${selectedProduct.name} · ${selectedProduct.unit}`
          : 'Choose a product to animate production'}</span>
        <span>{endYear}</span>
      </div>
    </section>
  )
}

export default TimelineControl
