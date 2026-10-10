import { describe, expect, it } from 'vitest'
import { getMapCountryId } from './getMapCountryId'

describe('getMapCountryId', () => {
  it('maps the separate Crimea basemap shape to Ukraine', () => {
    expect(getMapCountryId('crimea-fill')).toBe('UKR')
    expect(getMapCountryId('country-production-crimea-fill')).toBe('UKR')
  })

  it('keeps selectable countries mapped by their country code', () => {
    expect(getMapCountryId('countries-fill', { ADM0_A3: 'UKR' })).toBe('UKR')
  })

  it('does not make Russia selectable', () => {
    expect(getMapCountryId('countries-fill', { ADM0_A3: 'RUS' })).toBeUndefined()
  })
})
