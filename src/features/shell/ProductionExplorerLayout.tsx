import type { ReactNode } from 'react'
import type { MapTheme } from '../production/model/production'
import '../../app/layout.css'
import './footer.css'
import '../../app/theme.css'
import '../../app/responsive.css'

interface ProductionExplorerLayoutProps {
  theme: MapTheme
  isPanelOpen: boolean
  onToggleTheme: () => void
  onClosePanel: () => void
  onOpenPanel: () => void
  map: ReactNode
  children: ReactNode
}

function ProductionExplorerLayout({
  theme,
  isPanelOpen,
  onToggleTheme,
  onClosePanel,
  onOpenPanel,
  map,
  children,
}: ProductionExplorerLayoutProps) {
  return (
    <main className={`app-shell theme-${theme}${isPanelOpen ? '' : ' panel-closed'}`}>
      {map}
      <aside
        className="side-panel"
        aria-label="Production controls and details"
        aria-hidden={!isPanelOpen}
      >
        <div className="panel-brand">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span className="brand-name">ORIGIN</span>
          <span className="brand-divider" />
          <span className="brand-section">PRODUCTION</span>
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'light'}
            onClick={onToggleTheme}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === 'dark' ? '☼' : '◐'}
            </span>
            <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
          <button
            className="panel-toggle panel-close"
            type="button"
            aria-label="Hide sidebar"
            onClick={onClosePanel}
          >
            ‹
          </button>
        </div>

        <div className="panel-scroll">
          <section className="panel-intro">
            <p className="eyebrow">SUPPLY CHAIN / EXPLORER</p>
            <h1>Production map</h1>
            <p>Explore production across countries and time.</p>
          </section>
          {children}
        </div>

        <div className="panel-footer">
          <span className="live-dot" />
          <span>GLOBAL PRODUCTION INTELLIGENCE</span>
          <span className="footer-period">2010—2026</span>
        </div>
      </aside>
      {!isPanelOpen && (
        <button
          className="panel-toggle panel-open"
          type="button"
          aria-label="Show filters and production data"
          onClick={onOpenPanel}
        >
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>SHOW DATA</span>
          <span className="open-chevron">›</span>
        </button>
      )}
    </main>
  )
}

export default ProductionExplorerLayout
