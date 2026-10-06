import { Link } from 'react-router-dom';
import AppLink from './AppLink';
import ImageWithFallback from './ImageWithFallback';
import Icon from './Icon';

/** Footer: identity, "Explore" links, contact details and the legal row (Figma "Footer"). */
export default function Footer({ site, navigation }) {
  if (!site) return <footer className="site-footer" />;
  const { contact, legal } = site;

  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="footer-identity">
          <Link to="/" className="footer-brand" aria-label={`${site.name} home`}>
            <ImageWithFallback
              image={site.logo}
              className="footer-brand__logo"
              fallback={<span className="brand__monogram">{site.abbreviation}</span>}
            />
            <span className="footer-brand__text">
              <span className="footer-brand__abbr">{site.abbreviation}</span>
              <span className="footer-brand__city">{site.city}</span>
            </span>
          </Link>
          <p className="footer-identity__name">{site.name}</p>
          <p className="footer-identity__tagline">{site.tagline}</p>
        </div>

        {navigation && (
          <nav className="footer-nav" aria-label="Explore">
            <h2 className="footer-heading">{navigation.footer.heading}</h2>
            <ul>
              {navigation.footer.links.map((link) => (
                <li key={link.label}>
                  <AppLink href={link.href} className="footer-nav__link">
                    {link.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="footer-contact">
          <h2 className="footer-heading">Contact</h2>
          <ul>
            <li>
              <Icon name="mail" size={22} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <Icon name="phone" size={22} />
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </li>
            <li>
              <Icon name="clock-3" size={22} />
              <span>{contact.officeHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="site-footer__divider" />
      <div className="site-footer__legal">
        <p>{legal.copyright}</p>
        <ul>
          {legal.links.map((link) => (
            <li key={link.label}>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
