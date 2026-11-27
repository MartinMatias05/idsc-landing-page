import AsyncContent from '../components/AsyncContent';
import PulseShowcase from '../components/PulseShowcase';

/** Public IDSC Pulse previews. Cards retain direct article URLs when supplied. */
export default function PulseSection({ state }) {
  return <div className="pulse">
    <AsyncContent state={state} isEmpty={data => !data.items?.length} emptyMessage="No IDSC Pulse posts available.">
      {({ heading, items }) => <PulseShowcase label={heading?.label || 'IDSC Pulse'} title={heading?.title || 'Latest IDSC Blog'} items={items || []} />}
    </AsyncContent>
  </div>;
}
