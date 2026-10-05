import { BarChart3 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { formatNumber } from '../lib/format';

export default function StatsSection({ statistics }) {
  const items = statistics?.items ?? [];
  return <section className="stats-section"><div className="container"><SectionHeading align="center" label="IDSC in numbers" title="Growing with our community" description="A snapshot of the IDSC community and digital presence."/><div className="stats-grid">{items.map((item) => <div className={`stat-ring tone-${item.tone}`} key={item.id}><div className="ring-inner"><strong>{formatNumber(item.value)}</strong><span>{item.label}</span></div></div>)}</div><div className="stats-note"><BarChart3 size={16}/>Mock values are clearly identified while connected modules are still being integrated.</div></div></section>;
}
