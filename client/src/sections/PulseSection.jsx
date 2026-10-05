import { ArrowUpRight, CalendarDays } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { formatDate } from '../lib/format';

export default function PulseSection({ pulse }) {
  const items = pulse?.items ?? [];
  return <section className="section pulse-section"><div className="container"><SectionHeading label={pulse?.heading?.label || 'IDSC Pulse'} title={pulse?.heading?.title || 'Latest IDSC Blog'} description={pulse?.heading?.description || 'Stories, reminders, and community updates from IDSC.'}/><div className="pulse-grid">{items.map((item) => <article className="pulse-card" key={item.id}><div className="pulse-image" style={{backgroundImage:`url(${item.image?.url || '/assets/pulse/card.svg'})`}}/><div className="pulse-body"><div className="card-date"><CalendarDays size={14}/>{formatDate(item.postedOn)}</div><h3>{item.title}</h3><p>{item.summary}</p><a href="#pulse">Explore <ArrowUpRight size={15}/></a></div></article>)}</div></div></section>;
}
