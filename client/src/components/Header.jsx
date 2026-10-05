import { Menu, Search, X, MapPin, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function Header({ site, navigation }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const items = navigation?.primary ?? [];
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" to="/" aria-label="IDSC home">
            <img src="/assets/brand/idsc-logo.svg" alt="IDSC" />
            <span><b>IDSC</b><small>Ligao City</small></span>
          </Link>
          <div className="top-actions">
            <label className="search-box"><Search size={17}/><input aria-label="Search IDSC" placeholder={site?.searchPlaceholder || 'Search IDSC'} /><kbd>⌘ K</kbd></label>
            <Button href={site?.headerCta?.href || '/admission/requirements'} variant="yellow">{site?.headerCta?.label || 'Apply Now'}</Button>
          </div>
        </div>
      </div>
      <div className="nav-row">
        <div className="container nav-inner">
          <nav className={`main-nav ${open ? 'open' : ''}`}>
            {items.map((item) => item.children?.length ? (
              <div className="nav-dropdown" key={item.id}>
                <button className="nav-link" onClick={() => setActive(active === item.id ? null : item.id)}>{item.label}<ChevronDown size={15}/></button>
                <div className={`dropdown-menu ${active === item.id ? 'show' : ''}`}>
                  {item.children.map((child) => <Link key={child.href} to={child.href} onClick={() => setOpen(false)}>{child.label}</Link>)}
                </div>
              </div>
            ) : <Link className="nav-link" key={item.id} to={item.href}>{item.label}</Link>)}
          </nav>
          <div className="location-tag"><MapPin size={15}/>{site?.city || 'Ligao City'}</div>
          <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
  );
}
