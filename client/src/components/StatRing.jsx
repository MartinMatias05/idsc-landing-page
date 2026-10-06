import { formatNumber } from '../lib/format';

/** One circular statistic. `tone` (green | dark-green | red) comes from the API and selects the ring color. */
export default function StatRing({ statistic }) {
  return (
    <li className={`stat-ring stat-ring--${statistic.tone}`}>
      <div className="stat-ring__inner">
        <p className="stat-ring__label">{statistic.label}</p>
        <p className="stat-ring__value">{formatNumber(statistic.value)}</p>
      </div>
    </li>
  );
}
