import { formatPosted } from '../lib/format';
import ImageWithFallback from './ImageWithFallback';
import SystemLink from './SystemLink';

// Editorial labels are copied from the supplied Figma Home Page reference.
// They describe the current three preview slots, not data from the remote Pulse API.
const DESIGN_LABELS = {
  'pulse-001': { category: 'Admissions Guide', topic: 'Academics' },
  'pulse-002': { category: 'Student Guide', topic: 'Thoughts' },
  'pulse-003': { category: 'Enrollment', topic: 'Planning' },
};

export default function PulseCard({ post }) {
  const labels = DESIGN_LABELS[post.id];
  return (
    <article className="pulse-card">
      <ImageWithFallback image={post.image} className="pulse-card__image" />
      <p className="pulse-card__category">{post.category || labels?.category || 'IDSC Pulse'}</p>
      <h3 className="pulse-card__title">{post.title}</h3>
      {post.summary && <p className="pulse-card__summary">{post.summary}</p>}
      <div className="pulse-card__footer">
        <span className="pulse-card__date">{formatPosted(post.postedOn)}</span>
        <span className="pulse-card__topic">{post.topic || labels?.topic || 'IDSC Pulse'}</span>
      </div>
      <SystemLink systemId="pulse" itemId={post.id} className="pulse-card__link stretched-link">
        <span className="visually-hidden">Open in IDSC Pulse: {post.title}</span>
      </SystemLink>
    </article>
  );
}
