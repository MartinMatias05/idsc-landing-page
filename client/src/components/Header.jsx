import { Menu, Search, X, MapPin, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function Header({ site, navigation }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const items = navigation?.primary ?? [];

  const closeMobileMenu = () => {
    setOpen(false);
    setActive(null);
  };

  const toggleDropdown = (id) => {
    setActive((current) => (current === id ? null : id));
  };

  return (
    <header className="site-header">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="container topbar-inner">
          <Link
            className="brand"
            to="/"
            aria-label="IDSC home"
            onClick={closeMobileMenu}
          >
            <img
              src="/assets/brand/idsc-logo.svg"
              alt="Infotech Development System Colleges"
            />

            <span className="brand-copy">
              <b>IDSC</b>
              <small>{site?.city || 'Ligao City'}</small>
            </span>
          </Link>

          <div className="top-actions">
            <label className="search-box">
              <Search size={17} aria-hidden="true" />

              <input
                aria-label="Search IDSC"
                placeholder={site?.searchPlaceholder || 'Search IDSC'}
              />

              <kbd>⌘ K</kbd>
            </label>

            <Button
              href={site?.headerCta?.href || '/admission/requirements'}
              variant="yellow"
            >
              {site?.headerCta?.label || 'Apply Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="nav-row">
        <div className="container nav-inner">
          <nav
            className={`main-nav ${open ? 'open' : ''}`}
            aria-label="Main navigation"
          >
            {items.map((item) =>
              item.children?.length ? (
                <div className="nav-dropdown" key={item.id}>
                  <button
                    type="button"
                    className={`nav-link ${
                      active === item.id ? 'active' : ''
                    }`}
                    onClick={() => toggleDropdown(item.id)}
                    aria-expanded={active === item.id}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>

                  <div
                    className={`dropdown-menu ${
                      active === item.id ? 'show' : ''
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={closeMobileMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  className="nav-link"
                  key={item.id}
                  to={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="location-tag">
            <MapPin size={15} aria-hidden="true" />
            <span>{site?.city || 'Ligao City'}</span>
          </div>

          <button
            type="button"
            className="mobile-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}