import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';

export default function EnrollmentSection({ enrollment }) {
  if (!enrollment) return null;
  return <section className="enrollment-section"><div className="container enrollment-grid"><div className="enrollment-copy"><div className="eyebrow"><span />{enrollment.hero?.statusLabel || 'Admissions Open'}</div><SectionHeading title={enrollment.hero?.headline} description={enrollment.hero?.description}/><div className="enrollment-points"><span><CheckCircle2 size={18}/>Senior High School</span><span><CheckCircle2 size={18}/>College Programs</span><span><CheckCircle2 size={18}/>Admissions Guidance</span></div><Button href="/admission/requirements" variant="primary">Explore admission</Button></div><div className="enrollment-art"><div className="art-glow"/><img src={enrollment.hero?.image?.url || '/assets/enrollment/poster.svg'} alt={enrollment.hero?.image?.alt || 'Enrollment information'}/><div className="art-badge"><b>2026</b><span>Enrollment<br/>now open</span></div></div></div></section>;
}
