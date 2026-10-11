import { COUNTRIES } from '../../production/model/production'

const SELECTABLE_COUNTRY_IDS = new Set(COUNTRIES.map(({ id }) => id))
const CRIMEA_LAYER_IDS = new Set([
  'crimea-fill',
  'country-production-crimea-fill',
])

export function getMapCountryId(
  layerId: string,
  properties?: Record<string, unknown> | null,
) {
  if (CRIMEA_LAYER_IDS.has(layerId)) return 'UKR'

  const countryId = properties?.ADM0_A3 ?? properties?.countryId
  return typeof countryId === 'string' && SELECTABLE_COUNTRY_IDS.has(countryId)
    ? countryId
    : undefined
}
