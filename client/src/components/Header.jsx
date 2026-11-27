const REGISTRAR_APPLY_NOW_URL = 'https://registrar-frontend-s3mn.onrender.com/login';

import { useState } from 'react';
import '../styles/home-motion.css';
import AppLink from './AppLink';
import Brand from './Brand';
import Icon from './Icon';
import MainNav from './MainNav';
import SiteSearch from './SiteSearch';
import '../styles/header-sticky-search.css';

export default function Header({ site, navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Hide unavailable internal pages even when using an older navigation API.
  const publicNavigation = navigation && {
    ...navigation,
    primary: navigation.primary.map(item => ({
      ...item,
      children: item.children.filter(child => !['/facilities/clinic', '/about/career'].includes(child.href))
    }))
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <Brand site={site} />

        <div className="topbar__actions">
          <SiteSearch
            navigation={publicNavigation}
            placeholder={site?.searchPlaceholder ?? 'Search IDSC'}
          />

          {site?.headerCta && (
            <AppLink
              href={site.headerCta.label?.trim().toLowerCase() === 'apply now' ? REGISTRAR_APPLY_NOW_URL : site.headerCta.href}
              className="btn btn--yellow"
            >
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

        <nav
          id="main-nav"
          className={`main-nav${menuOpen ? ' is-open' : ''}`}
          aria-label="Main"
        >
          {navigation && (
            <MainNav
              items={publicNavigation.primary}
              onNavigate={() => setMenuOpen(false)}
            />
          )}
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
