import { Link } from 'react-router-dom';
import SystemLink from './SystemLink';
import { systemIdForRoute } from '../services/systems';

/** Single place that decides whether an API-provided `href` is an internal route or another system. */
export default function AppLink({ href, className = '', children, onClick }) {
  const isExternalHttpLink = typeof href === 'string' && (href.startsWith('https://') || href.startsWith('http://'));
  if (isExternalHttpLink) {
    return <a href={href} className={className} onClick={onClick}>{children}</a>;
  }
  const systemId = systemIdForRoute(href);
  if (systemId) {
    return (
      <SystemLink systemId={systemId} className={className}>
        {children}
      </SystemLink>
    );
  }
  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
