import { useState } from 'react';
import { getSystem, isReachable } from '../services/systems';

/**
 * Link to another system of the College Management System.
 * - No URL configured yet: renders as a disabled item (no broken link).
 * - URL configured but the host is down: shows a notice instead of a browser error page.
 */
export default function SystemLink({ systemId, className = '', children }) {
  const system = getSystem(systemId);
  const [status, setStatus] = useState('idle');

  if (!system || !system.enabled) {
    return (
      <span
        className={`${className} is-unavailable`}
        aria-disabled="true"
        title={`${system?.name ?? 'This system'} is not available yet.`}
      >
        {children}
      </span>
    );
  }

  async function handleClick(event) {
    event.preventDefault();
    setStatus('checking');
    if (await isReachable(system.url)) {
      window.location.assign(system.url);
    } else {
      setStatus('unavailable');
    }
  }

  return (
    <>
      <a href={system.url} className={className} onClick={handleClick}>
        {children}
      </a>
      {status === 'unavailable' && (
        <span role="alert" className="system-notice">
          {system.name} is temporarily unavailable. Please try again later.
        </span>
      )}
    </>
  );
}
