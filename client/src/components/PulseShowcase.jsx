import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, BookOpen } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { pulseArticleUrl } from '../lib/pulseArticleUrl';
import '../styles/pulse-showcase.css';

const dateLabel = value => {
  if (!value) return '';
  const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString('en-PH', { day: 'numeric', month: 'short', year: 'numeric' });
};

const articleUrl = post => pulseArticleUrl(post?.url);

/** Shared public and Admin preview; renderTools supplies Admin-only per-post actions. */
export default function PulseShowcase({ items = [], title = 'Latest IDSC Blog', label = 'IDSC Pulse', renderTools }) {
  const [featuredId, setFeaturedId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const list = useMemo(() => items.filter(Boolean), [items]);
  const featured = list.find(post => post.id === featuredId) || list[0];
  const others = list.filter(post => post.id !== featured?.id);
  const maxOffset = Math.max(0, others.length - 3);
  const visible = others.slice(Math.min(offset, maxOffset), Math.min(offset, maxOffset) + 3);
  const fallbackArt = <span className="pulse-showcase__fallback-art"><BookOpen aria-hidden="true" size={36}/><span>IDSC PULSE</span></span>;
  useEffect(() => { setOffset(0); }, [featured?.id]);
  if (!featured) return <p className="pulse-showcase__empty">No IDSC Pulse posts are available.</p>;
  const featuredHref = articleUrl(featured);
  const cardContents = <>
    <ImageWithFallback image={featured.image} className="pulse-showcase__feature-image" fallback={fallbackArt} />
    <div className="pulse-showcase__feature-body">
      <span className="pulse-showcase__category">{featured.category || 'IDSC Pulse'}</span>
      <h3>{featured.title}</h3>
      {featured.summary && <p>{featured.summary}</p>}
      <div className="pulse-showcase__meta"><CalendarDays size={16} aria-hidden="true"/><span>{dateLabel(featured.postedOn)}</span>{featured.topic && <span className="pulse-showcase__topic">{featured.topic}</span>}</div>
    </div>
  </>;
  return <section className="pulse-showcase" aria-label="IDSC Pulse article previews">
    <div className="pulse-showcase__heading"><div className="pulse-showcase__heading-copy"><span className="pulse-showcase__label">{label}</span><h2>{title}</h2></div><a
  className="pulse-showcase__see-all"
  href="https://idscpulse.netlify.app/"
  target="_blank"
  rel="noopener noreferrer"
>
  View all posts
  <ExternalLink size={14} aria-hidden="true" />
</a></div>
    <div className="pulse-showcase__layout">
      <div className="pulse-showcase__feature-wrap">
        {featuredHref ? <a className="pulse-showcase__feature" href={featuredHref} target="_blank" rel="noopener noreferrer" aria-label={`Open original IDSC Pulse article: ${featured.title}`}>{cardContents}</a> : <div className="pulse-showcase__feature pulse-showcase__feature--unlinked" title="Published URL not configured">{cardContents}</div>}
        {renderTools?.(featured)}
      </div>
      <div className="pulse-showcase__side" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className="pulse-showcase__mini-list" style={{ '--pulse-mini-count': Math.max(1, visible.length) }}>
          {visible.map(post => {
            const href = articleUrl(post);
            return <div key={post.id} className="pulse-showcase__mini-wrap">
              <article className="pulse-showcase__mini">
                <button type="button" className="pulse-showcase__select" onClick={() => setFeaturedId(post.id)} aria-label={`Feature ${post.title}`}>
                  <ImageWithFallback image={post.image} className="pulse-showcase__mini-image" decorative fallback={fallbackArt} />
                  <div className="pulse-showcase__mini-copy"><span className="pulse-showcase__category">{post.category || 'IDSC Pulse'}</span><h3>{post.title}</h3><div className="pulse-showcase__meta"><CalendarDays size={14} aria-hidden="true"/><span>{dateLabel(post.postedOn)}</span>{post.topic && <span className="pulse-showcase__topic">{post.topic}</span>}</div></div>
                </button>
                {href ? <a className="pulse-showcase__external" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open original article: ${post.title}`} title="Open original article"><ExternalLink size={19}/></a> : <span className="pulse-showcase__external pulse-showcase__external--disabled" title="Published URL not configured" aria-label="Article link unavailable"><ExternalLink size={19}/></span>}
              </article>
              {renderTools?.(post)}
            </div>;
          })}
        </div>
        {maxOffset > 0 && <div className={`pulse-showcase__arrows${isHovering ? ' is-hovering' : ''}`} aria-label="Browse more IDSC Pulse posts">
          <button type="button" onClick={()=>setOffset(n=>Math.max(0,n-1))} disabled={offset===0} aria-label="Previous IDSC Pulse posts"><ArrowLeft size={19}/></button>
          <button type="button" onClick={()=>setOffset(n=>Math.min(maxOffset,n+1))} disabled={offset>=maxOffset} aria-label="Next IDSC Pulse posts"><ArrowRight size={19}/></button>
        </div>}
      </div>
    </div>
  </section>;
}
