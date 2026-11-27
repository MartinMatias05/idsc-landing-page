import { useEffect, useState } from 'react';
import {getPublicContent} from '../services/adminApi';
import { getSystem, getSystemUrl, isReachable } from '../services/systems';

/**
 * Link to another system of the College Management System.
 * - No URL configured yet: renders as a disabled item (no broken link).
 * - `itemId` links to one item of the system when an item path is configured (see systems.config.js).
 * - URL configured but the host is down: shows a notice instead of a browser error page.
 */
const names={news:'News',pulse:'IDSC Pulse',faculty:'Faculty',registrar:'Registrar','student-portal':'Student Portal',library:'Library',finance:'Finance',clinic:'Clinic',inventory:'Inventory'};
let publicContentPromise;
function loadPublicContent(){return publicContentPromise ||= getPublicContent().catch(()=>({links:{}}));}
function publicTarget(url) {
  try {const parsed=new URL(url);return parsed.protocol==='https:' || (parsed.protocol==='http:' && ['localhost','127.0.0.1'].includes(parsed.hostname)) ? parsed.href:null}catch{return null}
}
export default function SystemLink({ systemId, itemId, className = '', children }) {
  const system = getSystem(systemId);
  const [overrides,setOverrides]=useState(null);
  useEffect(()=>{let active=true;loadPublicContent().then(d=>{if(active)setOverrides(d.links || {})});return()=>{active=false}},[]);
  const configured=overrides?.[names[systemId]];
  const overrideTarget=typeof configured==='string'?publicTarget(configured):null;
  const target=overrideTarget ? (itemId!==undefined && system?.itemPath ? new URL(system.itemPath.replace('{id}',encodeURIComponent(itemId)),overrideTarget).href:overrideTarget) : getSystemUrl(system,itemId);
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
