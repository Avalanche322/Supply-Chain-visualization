import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TimelineControl from './TimelineControl'

describe('TimelineControl', () => {
  it('hides the timeline until a country or product is selected', () => {
    render(
      <TimelineControl
        placement="map"
        explorer={{
          selectedProduct: undefined,
          selectedCountryId: '',
          year: 2026,
          startYear: 2010,
          endYear: 2026,
          isPlaying: false,
          annualTrend: [],
          setYear: vi.fn(),
          setIsPlaying: vi.fn(),
        }}
      />,
    )

    expect(screen.queryByRole('region', { name: 'Production timeline' })).toBeNull()
  })

  it('renders the sparkline with the selected product context', () => {
    render(
      <TimelineControl
        placement="map"
        explorer={{
          selectedProduct: { id: 'wheat', name: 'Wheat', unit: 'million tonnes' },
          selectedCountryId: '',
          year: 2018,
          startYear: 2010,
          endYear: 2026,
          isPlaying: false,
          annualTrend: [
            { year: 2010, total: 20 },
            { year: 2011, total: 24 },
            { year: 2012, total: 22 },
          ],
          setYear: vi.fn(),
          setIsPlaying: vi.fn(),
        }}
      />,
    )

    expect(screen.getByRole('img', {
      name: 'Wheat global production trend from 2010 to 2026',
    })).toBeTruthy()
    expect(screen.getByText('Wheat · million tonnes')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Play timeline' }).hasAttribute('disabled'))
      .toBe(false)
  })
})