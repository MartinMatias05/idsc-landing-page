import AsyncContent from '../components/AsyncContent';
import StatRing from '../components/StatRing';

/** Three circular statistics (Figma "View" 2014:162). */
export default function StatisticsSection({ state }) {
  return (
    <section className="stats" aria-label="IDSC in numbers">
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
    </section>
  );
}
