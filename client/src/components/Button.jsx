import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Button({ children, href, variant = 'primary', external = false, icon = 'arrow' }) {
  const suffix = icon === 'chevron' ? <ChevronRight size={17} /> : <ArrowUpRight size={17} />;
  const className = `btn btn-${variant}`;
  if (!href) return <button className={className}>{children}</button>;
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{children}{suffix}</a>;
  return <Link className={className} to={href}>{children}{suffix}</Link>;
}
