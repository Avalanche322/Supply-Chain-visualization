import { describe, expect, it } from 'vitest'
import type { StyleSpecification } from 'maplibre-gl'
import { transformMapStyle } from './transformMapStyle'

const demoStyle = {
  version: 8,
  sources: { maplibre: { type: 'vector', url: 'https://example.com/tiles.json' } },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#D8F2FF' } },
    { id: 'countries-fill', type: 'fill', source: 'maplibre', 'source-layer': 'countries', paint: { 'fill-color': '#EAB38F' } },
    { id: 'crimea-fill', type: 'fill', source: 'maplibre', 'source-layer': 'countries', paint: { 'fill-color': '#D6C7FF' } },
    { id: 'countries-boundary', type: 'line', source: 'maplibre', 'source-layer': 'countries', paint: { 'line-color': '#fff' } },
    { id: 'coastline', type: 'line', source: 'maplibre', 'source-layer': 'countries', paint: { 'line-color': '#198EC8' } },
    { id: 'countries-label', type: 'symbol', source: 'maplibre', 'source-layer': 'countries', paint: { 'text-color': '#08254D' } },
    { id: 'geolines', type: 'line', source: 'maplibre', 'source-layer': 'geolines', layout: { visibility: 'visible' } },
    { id: 'geolines-label', type: 'symbol', source: 'maplibre', 'source-layer': 'geolines', layout: { visibility: 'visible' } },
  ],
} satisfies StyleSpecification

describe('transformMapStyle', () => {
  it('applies the dark theme before MapLibre renders the basemap', () => {
    const { layers } = transformMapStyle(demoStyle, 'dark')

    expect(layers.find(({ id }) => id === 'background')?.paint)
      .toMatchObject({ 'background-color': '#182329' })
    expect(layers.find(({ id }) => id === 'countries-fill')?.paint)
      .toMatchObject({ 'fill-color': '#26343a' })
    expect(layers.find(({ id }) => id === 'countries-boundary')?.paint)
      .toMatchObject({ 'line-color': '#43545a' })
    expect(layers.find(({ id }) => id === 'geolines')?.layout)
      .toMatchObject({ visibility: 'none' })
    expect(layers.find(({ id }) => id === 'geolines-label')?.layout)
      .toMatchObject({ visibility: 'none' })
    expect(layers.findIndex(({ id }) => id === 'crimea-fill'))
      .toBeLessThan(layers.findIndex(({ id }) => id === 'countries-boundary'))
  })

  it('applies the light theme and preserves unrelated style data', () => {
    const { layers, sources } = transformMapStyle(demoStyle, 'light')

    expect(layers.find(({ id }) => id === 'background')?.paint)
      .toMatchObject({ 'background-color': '#e9eee7' })
    expect(layers.find(({ id }) => id === 'countries-fill')?.paint)
      .toMatchObject({ 'fill-color': '#f4f6f1' })
    expect(layers.find(({ id }) => id === 'countries-boundary')?.paint)
      .toMatchObject({ 'line-color': '#84968b' })
    expect(layers.find(({ id }) => id === 'coastline')?.paint)
      .toMatchObject({ 'line-color': '#89a397' })
    expect(sources).toEqual(demoStyle.sources)
  })
})
