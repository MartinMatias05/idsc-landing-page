import { formatPosted } from '../lib/format';
import Icon from './Icon';
import ImageWithFallback from './ImageWithFallback';

/** IDSC Pulse card (Figma "Notice card" 134:229): image, icon, title, summary, date + arrow. */
export default function PulseCard({ post }) {
  return (
    <article className="pulse-card">
      <ImageWithFallback image={post.image} className="pulse-card__image" />
      <Icon name={post.icon} size={22} />
      <h3 className="pulse-card__title">{post.title}</h3>
      <p className="pulse-card__summary">{post.summary}</p>
      <div className="pulse-card__footer">
        <span className="pulse-card__date">{formatPosted(post.postedOn)}</span>
        {/* Pulse posts have no detail page in the contract, so the arrow is decorative. */}
        <Icon name="arrow-up-right" size={16} />
      </div>
    </article>
  );
}
