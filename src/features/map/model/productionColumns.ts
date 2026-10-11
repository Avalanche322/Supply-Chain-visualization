import type { MapCountryStyles } from '../../production/model/production'

const COLUMN_LOCATIONS: Record<string, [number, number]> = {
  ARG: [-64, -34],
  AUS: [134, -25],
  BRA: [-52, -10],
  CAN: [-106, 56],
  CHL: [-71, -30],
  CHN: [103, 35],
  COL: [-74, 4],
  DEU: [10.5, 51],
  ETH: [40, 9],
  FRA: [2, 46],
  IDN: [117, -2],
  IND: [79, 22],
  JPN: [138, 37],
  KOR: [127, 36],
  MEX: [-102, 23],
  NLD: [5.3, 52],
  PER: [-75, -10],
  POL: [19, 52],
  SAU: [45, 24],
  TWN: [121, 24],
  UKR: [31, 49],
  USA: [-98, 39],
  VNM: [108, 16],
  ZAF: [24, -29],
}

const COLUMN_HALF_SIZE = 0.65
const MIN_COLUMN_HEIGHT = 80_000
const MAX_COLUMN_HEIGHT = 1_200_000

export interface ProductionColumnProperties {
  countryId: string
  production: number
  height: number
  color: string
}

export function createProductionColumns(data: MapCountryStyles) {
  const entries = Object.entries(data)
    .filter(([countryId, value]) => COLUMN_LOCATIONS[countryId] && value.production > 0)
  const maxProduction = Math.max(...entries.map(([, value]) => value.production), 1)

  return {
    type: 'FeatureCollection' as const,
    features: entries.map(([countryId, value]) => {
      const [longitude, latitude] = COLUMN_LOCATIONS[countryId]
      const west = longitude - COLUMN_HALF_SIZE
      const east = longitude + COLUMN_HALF_SIZE
      const south = latitude - COLUMN_HALF_SIZE
      const north = latitude + COLUMN_HALF_SIZE
      const normalizedProduction = value.production / maxProduction

      return {
        type: 'Feature' as const,
        id: countryId,
        properties: {
          countryId,
          production: value.production,
          height: MIN_COLUMN_HEIGHT
            + normalizedProduction * (MAX_COLUMN_HEIGHT - MIN_COLUMN_HEIGHT),
          color: value.fillColor,
        } satisfies ProductionColumnProperties,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
          ]],
        },
      }
    }),
  }
}
