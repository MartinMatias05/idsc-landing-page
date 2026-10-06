import AppLink from './AppLink';
import Icon from './Icon';

/** Figma "Text link": label + 16px arrow-up-right, 8px apart. */
export default function TextLink({ href, className = '', children }) {
  return (
    <AppLink href={href} className={`text-link ${className}`}>
      <span>{children}</span>
      <Icon name="arrow-up-right" size={16} />
    </AppLink>
  );
}
