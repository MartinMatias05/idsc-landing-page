import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { PageHeading, Panel } from '../components/AdminShell';
import { useAdmin } from '../state/AdminStore';

function localDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function labelForDate(key) {
  if (!key) return 'Unknown date';
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function todayKey() { return localDateKey(new Date()); }

export default function AdminNotifications() {
  const { history } = useAdmin();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState('all');
  const [collapsedDates, setCollapsedDates] = useState([]);

  useEffect(() => {
    let alive = true;
    const timeout = window.setTimeout(() => {
      adminApi.notifications(query)
        .then(data => {
          if (!alive) return;
          setItems(Array.isArray(data.items) ? data.items : []);
          setError('');
          setLoading(false);
        })
        .catch(err => {
          if (!alive) return;
          setError(err.message);
          setLoading(false);
        });
    }, 250);
    return () => { alive = false; window.clearTimeout(timeout); };
  }, [query, history]);

  const filteredItems = useMemo(() => {
    const now = new Date();
    const today = todayKey();
    return items.filter(item => {
      const key = localDateKey(item.when);
      if (selectedDate && key !== selectedDate) return false;
      if (!selectedDate && range === 'today' && key !== today) return false;
      if (!selectedDate && (range === 'week' || range === 'month')) {
        const timestamp = new Date(item.when).getTime();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        start.setDate(start.getDate() - (range === 'week' ? 6 : 29));
        if (!Number.isFinite(timestamp) || timestamp < start.getTime() || timestamp > now.getTime()) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  }, [items, selectedDate, range]);

  const groups = useMemo(() => {
    const grouped = new Map();
    filteredItems.forEach(item => {
      const key = localDateKey(item.when) || 'unknown';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(item);
    });
    return [...grouped].map(([key, entries]) => ({ key, entries }));
  }, [filteredItems]);

  function changeRange(next) { setRange(next); setSelectedDate(''); }
  function toggleDate(key) {
    setCollapsedDates(previous => previous.includes(key)
      ? previous.filter(value => value !== key) : [...previous, key]);
  }
  function clearFilters() { setSelectedDate(''); setRange('all'); setQuery(''); }

  return <>
    <PageHeading title="Notifications" subtitle="Search and organize published, edited, and deleted website activity saved by the backend." />
    <Panel title="Recent activity" aside={<span>{filteredItems.length} {filteredItems.length === 1 ? 'notification' : 'notifications'}</span>}>
      <label className="adm-notification-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={query} onChange={event => { setQuery(event.target.value); setLoading(true); }} placeholder="Search notifications by action or content title…" aria-label="Search notifications" />
      </label>
      <div className="adm-notification-organizer" aria-label="Filter notifications by date">
        <div className="adm-notification-range" role="group" aria-label="Quick date filters">
          {[
            ['all', 'All dates'], ['today', 'Today'], ['week', 'Last 7 days'], ['month', 'Last 30 days'],
          ].map(([value, label]) => <button key={value} type="button" className={range === value && !selectedDate ? 'is-active' : ''} aria-pressed={range === value && !selectedDate} onClick={() => changeRange(value)}>{label}</button>)}
        </div>
        <label className="adm-notification-date-input">
          <CalendarDays size={17} aria-hidden="true" />
          <span>Specific date</span>
          <input type="date" value={selectedDate} onChange={event => { setSelectedDate(event.target.value); setRange('all'); }} aria-label="Filter notifications on a specific date" />
        </label>
        {(selectedDate || range !== 'all' || query) && <button type="button" className="adm-notification-clear" onClick={clearFilters}><X size={15} aria-hidden="true" /> Clear filters</button>}
      </div>
      {selectedDate && <p className="adm-notification-filter-caption">Showing activity for {labelForDate(selectedDate)}</p>}
      {loading && <p role="status">Loading notifications…</p>}
      {error && <p role="alert" className="adm-error">{error}</p>}
      {!loading && !error && (groups.length ? <div className="adm-notification-groups">
        {groups.map(group => {
          const collapsed = collapsedDates.includes(group.key);
          return <section className="adm-notification-group" key={group.key}>
            <button type="button" className="adm-notification-group-date" onClick={() => toggleDate(group.key)} aria-expanded={!collapsed}>
              <span>{collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />} <CalendarDays size={16} /> {labelForDate(group.key)}</span>
              <small>{group.entries.length} {group.entries.length === 1 ? 'activity' : 'activities'}</small>
            </button>
            {!collapsed && <div className="adm-history-list">{group.entries.map((item, index) => <div className="adm-history-row" key={`${item.id ?? group.key}-${index}`}><Bell size={18} aria-hidden="true" /><span className="adm-history-text"><b>{item.type}: {item.target}</b><small>{item.when}</small></span></div>)}</div>}
          </section>;
        })}
      </div> : <p className="adm-empty-inline">No notifications match your search or selected date.</p>)}
    </Panel>
  </>;
}
