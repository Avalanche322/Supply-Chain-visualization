import type { StyleSpecification } from 'maplibre-gl'
import type { MapTheme } from '../../production/model/production'

export function transformMapStyle(
  style: StyleSpecification,
  theme: MapTheme,
): StyleSpecification {
  const dark = theme === 'dark'
  const colors = {
    background: dark ? '#182329' : '#e9eee7',
    countries: dark ? '#26343a' : '#f4f6f1',
    boundaries: dark ? '#496b80' : '#9ba8b0',
    coastline: dark ? '#64879b' : '#8799a4',
    labels: dark ? '#eff4ec' : '#24332f',
    labelHalo: dark ? '#25343a' : '#ffffff',
  }

  const layers = style.layers.map((layer) => {
    if (layer.id === 'background' && layer.type === 'background') {
      return {
        ...layer,
        paint: {
          ...layer.paint,
          'background-color': colors.background,
        },
      }
    }
    if (
      (layer.id === 'countries-fill' || layer.id === 'crimea-fill')
      && layer.type === 'fill'
    ) {
      return {
        ...layer,
        paint: { ...layer.paint, 'fill-color': colors.countries },
      }
    }
    if (layer.id === 'countries-boundary' && layer.type === 'line') {
      return {
        ...layer,
        paint: { ...layer.paint, 'line-color': colors.boundaries },
      }
    }
    if (layer.id === 'coastline' && layer.type === 'line') {
      return {
        ...layer,
        paint: { ...layer.paint, 'line-color': colors.coastline },
      }
    }
    if (
      layer.id === 'countries-label'
      && layer.type === 'symbol'
    ) {
      return {
        ...layer,
        paint: {
          ...layer.paint,
          'text-color': colors.labels,
          'text-halo-color': colors.labelHalo,
        },
      }
    }
    if (layer.id === 'geolines' && layer.type === 'line') {
      return {
        ...layer,
        layout: { ...layer.layout, visibility: 'none' as const },
      }
    }
    if (layer.id === 'geolines-label' && layer.type === 'symbol') {
      return {
        ...layer,
        layout: { ...layer.layout, visibility: 'none' as const },
      }
    }
    return layer
  })
  const crimeaLayerIndex = layers.findIndex((layer) => layer.id === 'crimea-fill')
  const countryBoundaryIndex = layers.findIndex(
    (layer) => layer.id === 'countries-boundary',
  )

  if (crimeaLayerIndex !== -1 && countryBoundaryIndex !== -1) {
    const [crimeaLayer] = layers.splice(crimeaLayerIndex, 1)
    const targetIndex = layers.findIndex(
      (layer) => layer.id === 'countries-boundary',
    )
    layers.splice(targetIndex, 0, crimeaLayer)
  }

  return {
    ...style,
    layers,
  }
}
