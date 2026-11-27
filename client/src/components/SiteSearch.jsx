import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import AppLink from './AppLink';

/** Search published navigation links locally; no search API or credentials required. */
export default function SiteSearch({ navigation, placeholder = 'Search IDSC' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const navigate = useNavigate();
  const pages = useMemo(() => {
    const seen = new Set();
    const output = [];
    const visit = items => {
      for (const item of items || []) {
        if (item?.href && item?.label && !seen.has(item.href)) {
          seen.add(item.href);
          output.push({ label: item.label, href: item.href });
        }
        visit(item?.children);
      }
    };
    visit(navigation?.primary);
    return output;
  }, [navigation]);
  const matches = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return [];
    return pages.filter(p => p.label.toLocaleLowerCase().includes(q)).slice(0, 7);
  }, [pages, query]);

  useEffect(() => {
    const close = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    const escape = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  const choose = () => { setQuery(''); setOpen(false); };
  const submit = e => {
    e.preventDefault();
    if (!matches.length) return;
    const destination = matches[0].href;
    choose();
    if (/^https?:\/\//i.test(destination)) window.open(destination, '_blank', 'noopener,noreferrer');
    else navigate(destination);
  };

  return (
    <form className="search idsc-site-search" role="search" ref={root} onSubmit={submit}>
      <Icon name="search" size={19} />
      <input
        type="search"
        className="search__input"
        placeholder={placeholder}
        aria-label="Search website pages"
        aria-autocomplete="list"
        aria-expanded={open && Boolean(query.trim())}
        aria-controls="idsc-site-search-results"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && query.trim() && (
        <div className="idsc-site-search__results" id="idsc-site-search-results" role="listbox" aria-label="Matching pages">
          {matches.length ? matches.map(item => (
            <AppLink key={item.href} href={item.href} className="idsc-site-search__result" onClick={choose}>
              {item.label}
            </AppLink>
          )) : <p className="idsc-site-search__empty">No matching website pages.</p>}
        </div>
      )}
    </form>
  );
}
