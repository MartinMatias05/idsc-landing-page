import { formatPosted } from '../lib/format';
import Icon from './Icon';
import ImageWithFallback from './ImageWithFallback';
import TextLink from './TextLink';

/**
 * News notice card (Figma "Notice card" 71:255). `accent` is the dark-green variant used by the first card.
 * The image is flexible: it takes whatever height the text above/below leaves inside the fixed-height card.
 */
export default function NoticeCard({ article, accent = false }) {
  return (
    <article className={`notice-card${accent ? ' notice-card--accent' : ''}`}>
      <ImageWithFallback image={article.image} className="notice-card__image" />
      <div className="notice-card__header">
        <span className="pill">{article.category}</span>
        <Icon name="megaphone" size={22} />
      </div>
      <h3 className="notice-card__title">{article.title}</h3>
      {article.summary && <p className="notice-card__summary">{article.summary}</p>}
      <div className="notice-card__footer">
        <span className="notice-card__date">{formatPosted(article.publishedOn)}</span>
        <TextLink href={`/news/${article.id}`}>Read update</TextLink>
      </div>
    </article>
  );
}
