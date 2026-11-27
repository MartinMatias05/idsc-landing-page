import { useEffect, useMemo, useState } from 'react';
import '../styles/live-statistics-graph.css';

// Real API readings observed in THIS browser. No historical values are generated.
const STORAGE_KEY = 'idsc-admin-statistics-observations-v2';
const COLORS = [
  { key: 'visitors', label: 'Site Visitors', color: '#bb3139' },
  { key: 'students', label: 'Student Enrolled', color: '#13b84d' },
  { key: 'faculty', label: 'Full-time Faculty', color: '#176b35' },
];
const valid = n => Number.isSafeInteger(n) && n >= 0;
const monthOf = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const monthTitle = m => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); };
const fmt = n => valid(n) ? n.toLocaleString() : '—';
function readHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(p => p && Number.isFinite(p.ts) && COLORS.every(s => valid(p[s.key]))) : [];
  } catch { return []; }
}
function niceMax(v) {
  if (v <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(v)) / 2;
  return Math.ceil(v / (step * 4)) * step * 4;
}

export default function LiveStatisticsGraph({ status, error, visitors, students, faculty }) {
  const [month, setMonth] = useState(() => monthOf(new Date()));
  const [history, setHistory] = useState(readHistory);
  const todayMonth = monthOf(new Date());

  useEffect(() => {
    // Capture only real, successful API readings. Keep 12 months, at most one
    // observation per minute, to avoid runaway storage while the tab is open.
    if (status !== 'success' && status !== 'ready') return;
    if (![visitors, students, faculty].every(valid)) return;
    const ts = Date.now();
    setHistory(prev => {
      const previous = prev[prev.length - 1];
      if (previous && ts - previous.ts < 14_000) return prev;
      const cutoff = ts - 366 * 24 * 60 * 60 * 1000;
      const next = [...prev.filter(p => p.ts >= cutoff), { ts, visitors, students, faculty }].slice(-2500);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, [status, visitors, students, faculty]);

  const observations = useMemo(() => history.filter(p => monthOf(new Date(p.ts)) === month), [history, month]);
  const left = 64, right = 728, top = 24, bottom = 265;
  const max = niceMax(Math.max(0, ...observations.flatMap(p => COLORS.map(s => p[s.key]))));
  const y = v => bottom - (v / max) * (bottom - top);
  // Time-scaled X-axis makes each observation a real timestamp, never a fake month-long series.
  const first = observations[0]?.ts ?? 0;
  const last = observations[observations.length - 1]?.ts ?? first;
  const x = ts => first === last ? (left + right) / 2 : left + ((ts - first) / (last - first)) * (right - left);
  const lastValues = observations[observations.length - 1];
  const ticks = Array.from({ length: 5 }, (_, i) => max * (4 - i) / 4);
  const stamp = ts => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const previousMonth = () => { const [yr, mo] = month.split('-').map(Number); setMonth(monthOf(new Date(yr, mo - 2, 1))); };
  const nextMonth = () => { const [yr, mo] = month.split('-').map(Number); const next = monthOf(new Date(yr, mo, 1)); if (next <= todayMonth) setMonth(next); };

  return (
    <section className="adm-stats-line" aria-label="Monthly website statistics observations">
      <div className="adm-stats-line-toolbar">
        <div className="adm-stats-month-controls">
          <button type="button" onClick={previousMonth} aria-label="Previous month">‹</button>
          <label htmlFor="adm-stat-month" className="adm-stats-month-label">Month</label>
          <input id="adm-stat-month" type="month" value={month} max={todayMonth} onChange={e => { if (e.target.value && e.target.value <= todayMonth) setMonth(e.target.value); }} />
          <button type="button" onClick={nextMonth} disabled={month >= todayMonth} aria-label="Next month">›</button>
        </div>
        <span className="adm-stats-month-title">{monthTitle(month)}</span>
      </div>
      {error && <p role="alert" className="adm-stats-message">Statistics API unavailable. Existing recorded readings are shown when available.</p>}
      {status === 'loading' && !observations.length && <p role="status" className="adm-stats-message">Loading current statistics…</p>}
      <div className="adm-stats-graph-scroll">
        <svg viewBox="0 0 770 325" role="img" aria-label={`${monthTitle(month)} line graph. ${observations.length} actual API observations. ${COLORS.map(s => `${s.label}: ${fmt(lastValues?.[s.key])}`).join(', ')}`}>
          {ticks.map((tick, i) => {
            const yy = top + i * (bottom - top) / 4;
            return <g key={i}><line x1={left} x2={right} y1={yy} y2={yy} stroke="#e4ebe6" /><text x={left - 12} y={yy + 4} textAnchor="end" className="adm-stats-tick">{Number.isInteger(tick) ? tick.toLocaleString() : tick.toFixed(1)}</text></g>;
          })}
          <line x1={left} x2={left} y1={top} y2={bottom} stroke="#82938a" />
          <line x1={left} x2={right} y1={bottom} y2={bottom} stroke="#82938a" />
          {observations.length > 0 && COLORS.map(s => <g key={s.key}>
            {observations.length >= 2 && <polyline points={observations.map(p => `${x(p.ts)},${y(p[s.key])}`).join(' ')} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
            {observations.map((p, i) => <circle key={p.ts} cx={x(p.ts)} cy={y(p[s.key])} r={i === observations.length - 1 ? 5 : 2.8} fill={s.color}><title>{s.label}: {fmt(p[s.key])} · {stamp(p.ts)}</title></circle>)}
          </g>)}
          {observations.length > 0 && <>
            <text x={left} y="297" className="adm-stats-time">{stamp(first)}</text>
            {observations.length > 1 && <text x={right} y="297" textAnchor="end" className="adm-stats-time">{stamp(last)}</text>}
          </>}
          {!observations.length && <text x="396" y="155" textAnchor="middle" className="adm-stats-no-data">No recorded statistics for {monthTitle(month)}</text>}
        </svg>
      </div>
      <div className="adm-stats-line-legend" aria-label="Statistics legend">
        {COLORS.map(s => <span key={s.key}><i style={{ backgroundColor: s.color }} />{s.label}<strong>{fmt(lastValues?.[s.key])}</strong></span>)}
      </div>
      {observations.length === 1 && <p className="adm-stats-message">One genuine reading recorded. A line appears after another reading is captured.</p>}
    </section>
  );
}
