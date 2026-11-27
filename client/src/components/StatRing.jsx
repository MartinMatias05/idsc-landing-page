import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../lib/format';
import { STATISTIC_TO_SYSTEM } from '../config/systems.config';
import { getSystem } from '../services/systems';
import SystemLink from './SystemLink';

const DURATION = 1650;
const PALETTES = {
  students: { ring: '#21D02D', badge: '#DDF7DF', icon: '#21D02D', number: '#21D02D', label: '#0F8416' },
  faculty: { ring: '#076E27', badge: '#DCEFE1', icon: '#076E27', number: '#0C8030', label: '#0E6128' },
  visitors: { ring: '#D32A2A', badge: '#D97F7F', icon: '#D32A2A', number: '#B91717', label: '#B91717' },
};

function StatisticIcon({ type }) {
  if (type === 'students') {
    return (
      <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
        <circle cx="32" cy="15" r="10" />
        <path d="M13 41c3-10 11-15 19-15s16 5 19 15c-8-3-14-2-19 1-5-3-11-4-19-1Z" />
        <path d="M5 44c11-2 20-1 27 4 7-5 16-6 27-4v8c-11-2-20-1-27 4-7-5-16-6-27-4v-8Zm26 4h2v8h-2z" />
      </svg>
    );
  }
  if (type === 'faculty') {
    return (
      <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
        <circle cx="32" cy="15" r="10" />
        <path d="M11 53c1-16 8-24 19-26l-5 7 7 15 7-15-5-7c11 2 18 10 19 26H11Z" />
        <path d="m30 29 2 2 2-2-2-2-2 2Zm2 6-3 11 3 4 3-4-3-11Z" fill="var(--idsc-badge)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <circle cx="17" cy="16" r="7" /><circle cx="47" cy="16" r="7" />
      <path d="M6 35v-8c0-8 6-11 11-11s11 3 11 11v3c-6 1-10 4-13 9H9a3 3 0 0 1-3-4Zm52 0v-8c0-8-6-11-11-11s-11 3-11 11v3c6 1 10 4 13 9h6a3 3 0 0 0 3-4Z" />
      <circle cx="32" cy="37" r="16" />
      <circle cx="32" cy="32" r="6" fill="var(--idsc-badge)" />
      <path d="M21 43c1-6 5-9 11-9s10 3 11 9a13 13 0 0 1-22 0Z" fill="var(--idsc-badge)" />
    </svg>
  );
}

export default function StatRing({ statistic }) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const id = String(statistic.id || '');
  const type = id === 'students-enrolled' ? 'students' : id === 'faculty-fulltime' ? 'faculty' : 'visitors';
  const palette = PALETTES[type];
  const systemId = STATISTIC_TO_SYSTEM[id];
  const system = systemId ? getSystem(systemId) : null;
  const isLink = Boolean(system?.enabled);
  const target = Math.max(0, Math.floor(Number(statistic.value) || 0));

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      setDisplayValue(target);
      return undefined;
    }
    let frame;
    let started;
    const animate = (timestamp) => {
      if (started === undefined) started = timestamp;
      const progress = Math.min(1, (timestamp - started) / DURATION);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(progress === 1 ? target : Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, target]);

  const label = type === 'students' ? 'Student Enrolled' : type === 'faculty' ? 'Full-time Faculty' : 'Site View';
  return (
    <li ref={rootRef} style={{ '--idsc-ring': palette.ring, '--idsc-badge': palette.badge, '--idsc-icon': palette.icon, '--idsc-number': palette.number, '--idsc-label': palette.label }} className={`stat-ring idsc-stat-ring idsc-stat-ring--${type}${visible ? ' idsc-stat-visible' : ''}${isLink ? ' stat-ring--link' : ''}`}>
      <svg className="idsc-stat-ring__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="idsc-stat-ring__progress" cx="50" cy="50" r="42.5" pathLength="100" transform="rotate(-90 50 50)" />
      </svg>
      <div className="idsc-stat-ring__support" aria-hidden="true" />
      <div className="stat-ring__inner">
        <p className="stat-ring__value">{formatNumber(displayValue)}</p>
        <p className="stat-ring__label">{label}</p>
      </div>
      <div className="idsc-stat-ring__badge" aria-hidden="true">
        <StatisticIcon type={type} />
      </div>
      {isLink && (
        <SystemLink systemId={systemId} className="stat-ring__link stretched-link">
          <span className="visually-hidden">Open the {system.name} system: {label}</span>
        </SystemLink>
      )}
    </li>
  );
}
