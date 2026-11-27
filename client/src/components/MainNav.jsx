import { useEffect, useRef, useState } from 'react';
import AppLink from './AppLink';
import SystemLink from './SystemLink';
import Icon from './Icon';

/**
 * Primary navigation. Desktop opens via hover; touch devices use tap.
 * Escape and outside clicks close it. `onNavigate` lets the header close the mobile panel.
 */
export default function MainNav({ items, onNavigate }) {
  const [openId, setOpenId] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpenId(null);
    };
    const closeOnEscape = (event) => event.key === 'Escape' && setOpenId(null);
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleNavigate = () => {
    setOpenId(null);
    onNavigate?.();
  };

  return (
    <ul className="main-nav__list" ref={rootRef}>
      {items.map((item) => {
        const hasDropdown = item.children.length > 0;
        const isOpen = openId === item.id;
        return (
          <li
            key={item.id}
            className={`main-nav__item${isOpen ? ' is-open' : ''}`}
            onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpenId(item.id); }}
            onMouseLeave={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpenId(null); }}
          >
            {hasDropdown ? (
              <button
                type="button"
                className="main-nav__trigger"
                aria-expanded={isOpen}
                aria-controls={`nav-${item.id}`}
                onClick={() => {
                  // Mouse clicking does not toggle desktop dropdowns. Tap still works on touch screens.
                  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpenId(isOpen ? null : item.id);
                }}
                onKeyDown={event => {
                  if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                    event.preventDefault();
                    setOpenId(item.id);
                  }
                }}
              >
                {item.label}
                <Icon name="chevron-down" size={18} />
              </button>
            ) : (
              <AppLink href={item.href} className="main-nav__trigger" onClick={handleNavigate}>
                {item.label}
                <Icon name="chevron-down" size={18} />
              </AppLink>
            )}
            {hasDropdown && (
              <ul id={`nav-${item.id}`} className="main-nav__dropdown">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <AppLink href={child.href} className="main-nav__link" onClick={handleNavigate}>
                      {child.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
      {/* student-portal-nav-v1: independent system destination */}
      <li className="main-nav__item main-nav__item--student-portal">
        <SystemLink systemId="student-portal" className="main-nav__trigger">
          IDSCian
        </SystemLink>
      </li>
    </ul>
  );
}
