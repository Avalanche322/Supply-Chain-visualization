import { useEffect, useRef, useState } from 'react'
import {
  Map as MapLibreMap,
  NavigationControl,
  setWorkerUrl,
  type ExpressionSpecification,
  type FilterSpecification,
  type StyleSpecification,
} from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import type { MapCountryStyles, MapTheme } from '../production/model/production'
import { transformMapStyle } from './model/transformMapStyle'
import { getMapCountryId } from './model/getMapCountryId'
import './styles.css'

setWorkerUrl(maplibreWorkerUrl)

const MAPLIBRE_DEMO_STYLE = 'https://demotiles.maplibre.org/style.json'

interface MapViewProps {
  data: MapCountryStyles
  theme: MapTheme
  onCountrySelect: (countryId: string) => void
}

function applyTheme(map: MapLibreMap, theme: MapTheme) {
  const dark = theme === 'dark'
  map.setPaintProperty('background', 'background-color', dark ? '#182329' : '#e9eee7')
  map.setPaintProperty('countries-fill', 'fill-color', dark ? '#26343a' : '#f4f6f1')
  map.setPaintProperty('crimea-fill', 'fill-color', dark ? '#26343a' : '#f4f6f1')
  map.setPaintProperty('countries-boundary', 'line-color', dark ? '#43545a' : '#84968b')
  map.setPaintProperty('coastline', 'line-color', dark ? '#61747a' : '#89a397')
  map.setPaintProperty('countries-label', 'text-color', dark ? '#eff4ec' : '#24332f')
  map.setPaintProperty('countries-label', 'text-halo-color', dark ? '#25343a' : '#ffffff')
  map.setPaintProperty('geolines', 'line-color', dark ? '#8cb8ca' : '#7d94a6')
  map.setPaintProperty('geolines-label', 'text-color', dark ? '#8cb8ca' : '#7d94a6')
  map.setPaintProperty('geolines-label', 'text-halo-color', dark ? '#25343a' : '#ffffff')
  map.setPaintProperty('selected-country-border', 'line-color', dark ? '#f6f5e9' : '#253b2d')
  map.setPaintProperty(
    'selected-country-crimea-border',
    'line-color',
    dark ? '#f6f5e9' : '#253b2d',
  )
  map.setPaintProperty('country-production-fill', 'fill-outline-color', dark ? '#10191e' : '#84968b')
}

function updateProductionLayers(
  map: MapLibreMap,
  data: MapCountryStyles,
) {
  if (!map.getLayer('country-production-fill')) return

  const countryStyles = Object.entries(data)
  const fillColorExpression: ExpressionSpecification = [
    'match',
    ['get', 'ADM0_A3'],
    '',
    '#000000',
    ...countryStyles.flatMap(([countryId, style]) => [countryId, style.fillColor]),
    '#000000',
  ]
  const countryFilter: FilterSpecification = [
    'in',
    ['get', 'ADM0_A3'],
    ['literal', countryStyles.map(([countryId]) => countryId)],
  ]
  const selectedCountryId = countryStyles.find(([, style]) => style.isSelected)?.[0]

  map.setFilter('country-production-fill', countryFilter)
  map.setPaintProperty('country-production-fill', 'fill-color', fillColorExpression)
  map.setPaintProperty(
    'country-production-crimea-fill',
    'fill-color',
    data.UKR?.fillColor ?? '#000000',
  )
  map.setPaintProperty(
    'country-production-crimea-fill',
    'fill-opacity',
    data.UKR ? 0.9 : 0,
  )
  map.setFilter(
    'selected-country-border',
    selectedCountryId
      ? ['==', ['get', 'ADM0_A3'], selectedCountryId]
      : ['==', ['get', 'ADM0_A3'], ''],
  )
  map.setPaintProperty(
    'selected-country-crimea-border',
    'line-opacity',
    data.UKR?.isSelected ? 1 : 0,
  )
}

function MapView({ data, theme, onCountrySelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const dataRef = useRef(data)
  const themeRef = useRef(theme)
  const countrySelectRef = useRef(onCountrySelect)
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    countrySelectRef.current = onCountrySelect
  }, [onCountrySelect])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const controller = new AbortController()
    let map: MapLibreMap | undefined

    async function initializeMap() {
      try {
        const response = await fetch(MAPLIBRE_DEMO_STYLE, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Map style request failed with status ${response.status}`)
        }

        const style: unknown = await response.json()
        if (
          typeof style !== 'object'
          || style === null
          || !('version' in style)
          || style.version !== 8
          || !('layers' in style)
          || !Array.isArray(style.layers)
          || !('sources' in style)
          || typeof style.sources !== 'object'
          || style.sources === null
        ) {
          throw new Error('Map style response is not a valid MapLibre style')
        }

        if (controller.signal.aborted) return
        map = new MapLibreMap({
          container,
          style: transformMapStyle(style as StyleSpecification, themeRef.current),
          center: [0, 20],
          zoom: 0,
          minZoom: 0,
          maxZoom: 4,
          renderWorldCopies: false,
        })
        mapRef.current = map
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right')

        map.once('load', () => {
          if (controller.signal.aborted || !map) return
          map.addLayer({
            id: 'country-production-crimea-fill',
            type: 'fill',
            source: 'crimea',
            paint: {
              'fill-color': '#000000',
              'fill-opacity': 0,
              'fill-outline-color': '#f7faf4',
            },
          }, 'countries-boundary')
          map.addLayer({
            id: 'country-production-fill',
            type: 'fill',
            source: 'maplibre',
            'source-layer': 'countries',
            filter: ['in', ['get', 'ADM0_A3'], ['literal', []]],
            paint: {
              'fill-color': '#000000',
              'fill-opacity': 0.9,
              'fill-outline-color': '#f7faf4',
            },
          }, 'countries-boundary')
          map.addLayer({
            id: 'selected-country-border',
            type: 'line',
            source: 'maplibre',
            'source-layer': 'countries',
            filter: ['==', ['get', 'ADM0_A3'], ''],
            paint: {
              'line-color': '#f6f5e9',
              'line-width': 2,
            },
          }, 'countries-label')
          map.addLayer({
            id: 'selected-country-crimea-border',
            type: 'line',
            source: 'crimea',
            paint: {
              'line-color': '#f6f5e9',
              'line-width': 2,
              'line-opacity': 0,
            },
          }, 'countries-label')
          applyTheme(map, themeRef.current)
          updateProductionLayers(map, dataRef.current)
          map.fitBounds([[-180, -58], [180, 84]], {
            padding: 18,
            duration: 0,
          })

          map.on('click', (event) => {
            const country = map?.queryRenderedFeatures(event.point, {
              layers: [
                'country-production-fill',
                'country-production-crimea-fill',
                'countries-fill',
                'crimea-fill',
              ],
            }).find((feature) => {
              return getMapCountryId(feature.layer.id, feature.properties) !== undefined
            })
            const countryId = country
              ? getMapCountryId(country.layer.id, country.properties)
              : undefined
            if (countryId) {
              countrySelectRef.current(countryId)
            }
          })
          map.on('mousemove', (event) => {
            const hasSelectableCountry = map?.queryRenderedFeatures(event.point, {
              layers: [
                'country-production-fill',
                'country-production-crimea-fill',
                'countries-fill',
                'crimea-fill',
              ],
            }).some((feature) =>
              getMapCountryId(feature.layer.id, feature.properties) !== undefined,
            )
            if (map) {
              map.getCanvas().style.cursor = hasSelectableCountry ? 'pointer' : ''
            }
          })
          setMapStatus('ready')
        })
      } catch (error) {
        if (controller.signal.aborted) return
        map?.remove()
        map = undefined
        mapRef.current = null
        console.error('Unable to load the MapLibre base style', error)
        setMapStatus('error')
      }
    }

    setMapStatus('loading')
    void initializeMap()

    return () => {
      controller.abort()
      map?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (map) updateProductionLayers(map, data)
  }, [data])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getLayer('background')) return
    applyTheme(map, theme)
  }, [theme])

  return (
    <div className={`map-frame map-${mapStatus}`} aria-busy={mapStatus === 'loading'}>
      <div
        className="map-canvas"
        ref={containerRef}
        role="application"
        aria-label="Interactive world production map. Click a country to explore its production."
      />
      {mapStatus !== 'ready' && (
        <div
          className={`map-status map-status-${mapStatus}`}
          role={mapStatus === 'error' ? 'alert' : 'status'}
        >
          {mapStatus === 'loading'
            ? 'Loading map…'
            : 'The map could not be loaded. Check your internet connection and reload the page.'}
        </div>
      )}
    </div>
  )
}

export default MapView
