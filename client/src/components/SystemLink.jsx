import { useState } from 'react';
import { getSystem, getSystemUrl, isReachable } from '../services/systems';

/**
 * Link to another system of the College Management System.
 * - No URL configured yet: renders as a disabled item (no broken link).
 * - `itemId` links to one item of the system when an item path is configured (see systems.config.js).
 * - URL configured but the host is down: shows a notice instead of a browser error page.
 */
export default function SystemLink({ systemId, itemId, className = '', children }) {
  const system = getSystem(systemId);
  const target = getSystemUrl(system, itemId);
  const [status, setStatus] = useState('idle');

  if (!target) {
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
    if (await isReachable(target)) {
      window.location.assign(target);
    } else {
      setStatus('unavailable');
    }
  }

  return (
    <>
      <a href={target} className={className} onClick={handleClick}>
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
