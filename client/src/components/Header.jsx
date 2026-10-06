import { useState } from 'react';
import AppLink from './AppLink';
import Brand from './Brand';
import Icon from './Icon';
import MainNav from './MainNav';

/**
 * Two stacked bars as in Figma "Home Page and Header": a photographic green top bar
 * (brand, search, Apply Now) and a white navigation bar with the city on the right.
 * `site` / `navigation` may be null while loading or if the API fails; the header still renders.
 */
export default function Header({ site, navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <Brand site={site} />
        <div className="topbar__actions">
          {/* The API contract has no search endpoint, so the field is shown but not interactive. */}
          <div className="search" role="search">
            <Icon name="search" size={19} />
            <input
              type="search"
              className="search__input"
              placeholder={site?.searchPlaceholder ?? 'Search IDSC'}
              aria-label={site?.searchPlaceholder ?? 'Search IDSC'}
              disabled
            />
          </div>
          {site?.headerCta && (
            <AppLink href={site.headerCta.href} className="btn btn--yellow">
              {site.headerCta.label}
              <Icon name="arrow-right" size={19} />
            </AppLink>
          )}
        </div>
      </div>

      <div className="navbar">
        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          <span>Menu</span>
        </button>
        <nav id="main-nav" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main">
          {navigation && <MainNav items={navigation.primary} onNavigate={() => setMenuOpen(false)} />}
        </nav>
        {site && (
          <p className="navbar__location">
            <Icon name="map-pin" size={22} />
            {site.city}
          </p>
        )}
      </div>
    </header>
  );
}
