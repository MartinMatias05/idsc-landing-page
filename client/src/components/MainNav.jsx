import { useEffect, useRef, useState } from 'react';
import AppLink from './AppLink';
import Icon from './Icon';

/**
 * Primary navigation. Items with `children` open a dropdown (click, or hover on desktop).
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
          <li key={item.id} className={`main-nav__item${isOpen ? ' is-open' : ''}`}>
            {hasDropdown ? (
              <button
                type="button"
                className="main-nav__trigger"
                aria-expanded={isOpen}
                aria-controls={`nav-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
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
    </ul>
  );
}
