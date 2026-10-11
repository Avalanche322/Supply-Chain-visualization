import { describe, expect, it } from 'vitest'
import type { MapCountryStyles } from '../../production/model/production'
import { createProductionColumns } from './productionColumns'

describe('createProductionColumns', () => {
  it('creates a positioned polygon for each country with production', () => {
    const data: MapCountryStyles = {
      CHN: { fillColor: '#397eae', isSelected: false, production: 100 },
      BRA: { fillColor: '#8dcfff', isSelected: true, production: 25 },
    }

    const collection = createProductionColumns(data)

    expect(collection.features).toHaveLength(2)
    expect(collection.features[0]).toMatchObject({
      id: 'CHN',
      properties: { countryId: 'CHN', production: 100, color: '#397eae' },
      geometry: { type: 'Polygon' },
    })
    expect(collection.features[1].properties.height)
      .toBeLessThan(collection.features[0].properties.height)
  })

  it('returns no columns when no production data is selected', () => {
    expect(createProductionColumns({}).features).toEqual([])
  })

  it('ignores countries without a configured column location', () => {
    const data: MapCountryStyles = {
      XXX: { fillColor: '#397eae', isSelected: false, production: 100 },
    }

    expect(createProductionColumns(data).features).toEqual([])
  })

  it('keeps column heights within the normalized range', () => {
    const columns = createProductionColumns({
      BRA: { fillColor: '#397eae', isSelected: false, production: 25 },
      CHN: { fillColor: '#8dcfff', isSelected: false, production: 100 },
    })

    expect(columns.features[1].properties.height).toBe(1_200_000)
    expect(columns.features[0].properties.height).toBeGreaterThan(80_000)
    expect(columns.features[0].properties.height).toBeLessThan(1_200_000)
    expect(columns.features[0].properties.height / columns.features[1].properties.height)
      .toBeLessThan(0.35)
  })
})
