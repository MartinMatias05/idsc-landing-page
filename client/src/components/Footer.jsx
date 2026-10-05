import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSystemUrl } from '../services/systems';

export default function Footer({ site, navigation }) {
  const links = navigation?.footer?.links ?? [];
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <img src="/assets/brand/idsc-logo.svg" alt="IDSC" />
          <h3>Infotech Development<br/>System Colleges, Inc.</h3>
          <p>{site?.tagline || 'Empowering Futures with Dedicated Service'}</p>
          <div className="socials"><a href="#" aria-label="Facebook"><Facebook size={18}/></a><a href={`mailto:${site?.contact?.email}`} aria-label="Email"><Mail size={18}/></a></div>
        </div>
        <div><h4>{navigation?.footer?.heading || 'Explore'}</h4><div className="footer-links">{links.map((link) => link.href === '/students' && !getSystemUrl('student-portal') ? <span className="disabled-link" key={link.href}>Students <small>not configured</small></span> : <Link key={link.href} to={link.href}>{link.label}</Link>)}</div></div>
        <div><h4>Contact</h4><div className="contact-list"><span><MapPin size={17}/>{site?.city || 'Ligao City, Albay'}</span><a href={`tel:${site?.contact?.phone}`}><Phone size={17}/>{site?.contact?.phone}</a><a href={`mailto:${site?.contact?.email}`}><Mail size={17}/>{site?.contact?.email}</a></div><p className="office-hours">{site?.contact?.officeHours}</p></div>
      </div>
      <div className="footer-bottom"><div className="container"><span>{site?.legal?.copyright}</span><div>{(site?.legal?.links ?? []).map((link) => <Link key={link.href} to={link.href}>{link.label}</Link>)}</div></div></div>
    </footer>
  );
}
