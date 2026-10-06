import Icon from './Icon';

/** "Admission support card" (Figma 83:468). */
export default function SupportCard({ support }) {
  return (
    <aside className="support-card" aria-labelledby="support-title">
      <div className="support-card__header">
        <span className="support-card__icon">
          <Icon name="graduation-cap" size={34} />
        </span>
        <span className="support-card__label">{support.label}</span>
      </div>
      <h2 id="support-title" className="support-card__title">
        {support.title}
      </h2>
      <p className="support-card__description">{support.description}</p>
      <hr className="support-card__divider" />
      <a className="support-card__phone" href={`tel:${support.phone}`}>
        <Icon name="phone" size={23} />
        {support.phone}
      </a>
    </aside>
  );
}
