import { STATISTIC_TO_SYSTEM } from '../config/systems.config';
import { formatNumber } from '../lib/format';
import { getSystem } from '../services/systems';
import Icon from './Icon';
import SystemLink from './SystemLink';

/**
 * One circular statistic. `tone` (green | dark-green | red) comes from the API and selects the ring color.
 *
 * A statistic listed in STATISTIC_TO_SYSTEM (today: Full-time Faculty) becomes a link to the system that owns
 * the number, but only once that system has a URL; until then it renders as a plain ring, so nothing looks
 * clickable that is not. The link covers the whole circle and keeps the circular design.
 */
export default function StatRing({ statistic }) {
  const systemId = STATISTIC_TO_SYSTEM[statistic.id];
  const system = systemId ? getSystem(systemId) : null;
  const isLink = Boolean(system?.enabled);

  return (
    <li className={`stat-ring stat-ring--${statistic.tone}${isLink ? ' stat-ring--link' : ''}`}>
      <div className="stat-ring__inner">
        <p className="stat-ring__label">{statistic.label}</p>
        <p className="stat-ring__value">{formatNumber(statistic.value)}</p>
      </div>
      {isLink && (
        <SystemLink systemId={systemId} className="stat-ring__link stretched-link">
          <span className="visually-hidden">Open the {system.name} system: {statistic.label}</span>
          <Icon name="arrow-up-right" size={20} className="stat-ring__link-icon" />
        </SystemLink>
      )}
    </li>
  );
}
