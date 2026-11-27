import { useEffect, useState } from 'react';
import '../styles/clinic-floating-link.css';
import { getPublicContent } from '../services/adminApi';

const CLINIC_URL = import.meta.env.VITE_SYSTEM_CLINIC_URL || 'https://idsc-clinic-management.vercel.app/';
const reminders = [
  'Feeling unwell? Visit the school clinic for support.',
  'Stay hydrated! Take a moment to drink water.',
  'Feeling stressed? Take a short break and ask for support.',
  'Have a health concern? Reach out to the school clinic.',
  'Remember to rest, eat regularly, and look after yourself.',
  'Your well-being matters. Need help? The clinic is here for you.'
];

/** Independent Clinic shortcut with rotating general wellness reminders. */
function safeClinicUrl(value) {
  try {
    if (typeof value !== 'string') return null;
    const url = new URL(value);
    return !url.username && !url.password && (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) ? url.href : null;
  } catch { return null; }
}
export default function ClinicFloatingLink({ configuredUrl, remindersEnabled = true } = {}) {
  const [savedUrl, setSavedUrl] = useState(null);
  useEffect(() => {
    if (configuredUrl !== undefined) return;
    let active = true;
    getPublicContent().then(data => { if (active) setSavedUrl(data.links?.Clinic); }).catch(() => {});
    return () => { active = false; };
  }, [configuredUrl]);
  const destination = safeClinicUrl(configuredUrl ?? savedUrl) || safeClinicUrl(CLINIC_URL) || 'https://idsc-clinic-management.vercel.app/';
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || !remindersEnabled) return;
    let nextTimer, hideTimer, previous = -1;
    function schedule() {
      nextTimer = window.setTimeout(() => {
        if (!document.hidden) {
          let index = Math.floor(Math.random() * (reminders.length - (previous >= 0 ? 1 : 0)));
          if (previous >= 0 && index >= previous) index++;
          previous = index;
          setMessage(reminders[index]);
          setVisible(true);
          hideTimer = window.setTimeout(() => setVisible(false), 5000);
        }
        schedule();
      }, 12000 + Math.floor(Math.random() * 5001));
    }
    schedule();
    function onVisibility() {
      if (document.hidden) setVisible(false);
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(nextTimer);
      window.clearTimeout(hideTimer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [paused, remindersEnabled]);

  return (
    <>
      <div className={`idsc-clinic-reminder${visible && remindersEnabled ? ' is-visible' : ''}`} aria-hidden={!visible || !remindersEnabled}>
        <div className="idsc-clinic-reminder__heading">IDSC Clinic</div>
        <p>{message}</p>
        <button type="button" className="idsc-clinic-reminder__close" disabled={!visible || !remindersEnabled} aria-label="Dismiss health reminder" onClick={() => setVisible(false)}>×</button>
        <button type="button" className="idsc-clinic-reminder__pause" disabled={!visible || !remindersEnabled} onClick={() => { setVisible(false); setPaused(true); }}>Pause reminders</button>
      </div>
      <a className="idsc-clinic-float" href={destination} target="_blank" rel="noopener noreferrer" aria-label="Open IDSC Clinic Management System (opens in a new tab)" title="IDSC Clinic">
        <img src="/assets/clinic/idsc-clinic-assistant.png" alt="" draggable="false" />
        <span className="visually-hidden">Clinic</span>
      </a>
    </>
  );
}
