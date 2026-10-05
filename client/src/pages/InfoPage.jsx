import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function InfoPage({ site, navigation }) {
  const location = useLocation();
  const title = location.pathname.split('/').filter(Boolean).map((part) => part.replaceAll('-', ' ')).join(' / ') || 'IDSC';
  const pretty = title.split(' / ').map((part) => part.replace(/\b\w/g, (m) => m.toUpperCase())).join(' / ');
  return <><Header site={site} navigation={navigation}/><main className="info-page"><div className="container"><Link className="back-link" to="/"><ArrowLeft size={16}/>Back to home</Link><div className="info-hero"><div className="eyebrow"><span/>IDSC Information</div><h1>{pretty}</h1><p>This page is part of the approved IDSC landing-page navigation. Detailed content can be connected to the corresponding API resource as the class modules finalize their content.</p></div><div className="info-card"><h2>Integration-ready page</h2><p>The Landing Page owns navigation and presentation. Operational data remains with the responsible module and is consumed through documented API boundaries.</p><Link to="/admission/requirements">Explore admission information <ArrowUpRight size={16}/></Link></div></div></main><Footer site={site} navigation={navigation}/></>;
}
