import { formatPosted } from '../lib/format';
import Icon from './Icon';
import ImageWithFallback from './ImageWithFallback';
import SystemLink from './SystemLink';

/**
 * IDSC Pulse preview card (Figma "Notice card" 134:229): image, icon, title, summary, date + arrow.
 * The whole card links to the existing IDSC Pulse System; the post itself is not rendered here.
 */
export default function PulseCard({ post }) {
  return (
    <article className="pulse-card">
      <ImageWithFallback image={post.image} className="pulse-card__image" />
      <Icon name={post.icon} size={22} />
      <h3 className="pulse-card__title">{post.title}</h3>
      <p className="pulse-card__summary">{post.summary}</p>
      <div className="pulse-card__footer">
        <span className="pulse-card__date">{formatPosted(post.postedOn)}</span>
        <SystemLink systemId="pulse" itemId={post.id} className="pulse-card__link stretched-link">
          <span className="visually-hidden">Open in IDSC Pulse: {post.title}</span>
          <Icon name="arrow-up-right" size={16} />
        </SystemLink>
      </div>
    </article>
  );
}
