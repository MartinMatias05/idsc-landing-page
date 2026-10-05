import { ArrowUpRight, Clock3, MessageCircle } from 'lucide-react';
import Button from '../components/Button';

export default function CtaSection({ enrollment, site }) {
  const support = enrollment?.support;
  return <section className="cta-section"><div className="container cta-wrap"><div><div className="eyebrow"><span />Take the next step</div><h2>{enrollment?.callToAction?.headline || 'Planning to enroll at IDSC?'}</h2><p>{enrollment?.callToAction?.description}</p><div className="cta-actions"><Button href="/admission/requirements" variant="yellow">Apply now</Button><Button href="/admission/requirements" variant="ghost">View requirements</Button></div></div><aside className="support-card"><div className="support-icon"><MessageCircle/></div><span>{support?.label || 'Admissions Support'}</span><h3>{support?.title || 'Questions before you apply?'}</h3><p>{support?.description}</p><a href={`tel:${support?.phone || site?.contact?.phone}`}><ArrowUpRight size={16}/>{support?.phone || site?.contact?.phone}</a><small><Clock3 size={14}/>{site?.contact?.officeHours || 'Monday–Friday · 8:00 AM–4:00 PM'}</small></aside></div></section>;
}
