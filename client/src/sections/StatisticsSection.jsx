import AsyncContent from '../components/AsyncContent';
import StatRing from '../components/StatRing';
import '../styles/stats-modern.css';

/** Live values are supplied by the Landing Page statistics API. */
export default function StatisticsSection({ state }) {
  return (
    <section className="stats idsc-stats-modern" aria-label="IDSC statistics">
      <div className="idsc-stats-modern__content">
        <AsyncContent
          state={state}
          isEmpty={(data) => data.items.length === 0}
          emptyMessage="No statistics available."
        >
          {(data) => (
            <ul className="stats__list">
              {data.items.map((statistic) => (
                <StatRing key={statistic.id} statistic={statistic} />
              ))}
            </ul>
          )}
        </AsyncContent>
      </div>
    </section>
  );
}
