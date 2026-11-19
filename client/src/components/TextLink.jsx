import AppLink from './AppLink';
import Icon from './Icon';
import SystemLink from './SystemLink';

/**
 * Figma "Text link": label + 16px arrow-up-right, 8px apart.
 * Pass `href` for a Landing Page route, or `systemId` (+ optional `itemId`) for another system.
 */
export default function TextLink({ href, systemId, itemId, className = '', children }) {
  const classes = `text-link ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <Icon name="arrow-up-right" size={16} />
    </>
  );
  if (systemId) {
    return (
      <SystemLink systemId={systemId} itemId={itemId} className={classes}>
        {content}
      </SystemLink>
    );
  }
  return (
    <AppLink href={href} className={classes}>
      {content}
    </AppLink>
  );
}
