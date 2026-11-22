import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import './news-carousel.css';

const MAX_NEWS = 12;
const safeLink = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const dateLabel = (value) => {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
};

export function NewsCarouselCard({ article }) {
  const href = safeLink(article.url || article.articleUrl || article.externalUrl);
  const content = <>
    <div className="idsc-news-card__photo">
      <ImageWithFallback image={article.image} className="idsc-news-card__img" />
      <span className="idsc-news-card__category">{article.category || 'Campus News'}</span>
    </div>
    <div className="idsc-news-card__body">
      <h3 className="idsc-news-card__title">{article.title}</h3>
      {article.publishedOn && <time className="idsc-news-card__date" dateTime={article.publishedOn}><CalendarDays size={17} aria-hidden="true" /> {dateLabel(article.publishedOn)}</time>}
    </div>
  </>;
  return href
    ? <a className="idsc-news-card" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Read article: ${article.title}`}>{content}</a>
    : <div className="idsc-news-card" title="Direct article URL not yet configured">{content}</div>;
}

/** 4 visible at desktop; buttons move exactly one story with native smooth scrolling. */
export default function NewsCarousel({ items = [], renderCard = (item) => <NewsCarouselCard article={item} /> }) {
  const track = useRef(null);
  const [position, setPosition] = useState(0);
  const [perView, setPerView] = useState(4);
  const news = items.slice(0, MAX_NEWS);
  const maxPosition = Math.max(0, news.length - perView);
  const scrollStep = () => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!el || !card) return 0;
    return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
  };
  const updatePosition = () => {
    const step = scrollStep();
    if (step > 0) setPosition(Math.max(0, Math.round(track.current.scrollLeft / step)));
  };
  const move = (dir) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(maxPosition, position + dir));
    el.scrollTo({ left: next * scrollStep(), behavior: 'smooth' });
    setPosition(next);
  };
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      const count = width <= 620 ? 1 : width <= 980 ? 2 : 4;
      setPerView(count);
      const step = scrollStep();
      setPosition(step ? Math.round(el.scrollLeft / step) : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (position > maxPosition) {
      const next = Math.max(0, maxPosition);
      setPosition(next);
      track.current?.scrollTo({ left: next * scrollStep(), behavior: 'auto' });
    }
  }, [maxPosition, position]);
  return <div className="idsc-news-carousel">
    {news.length > perView && <button type="button" className="idsc-news-arrow idsc-news-arrow--previous" onClick={() => move(-1)} disabled={position <= 0} aria-label="Previous news article"><ChevronLeft size={25} /></button>}
    <div className="idsc-news-carousel__track" ref={track} onScroll={updatePosition} tabIndex={0} aria-label="Latest IDSC news, scroll horizontally" onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } }}>
      {news.map((article, i) => <div className="idsc-news-carousel__slide" key={`${article.id || 'article'}-${i}`}>{renderCard(article, i)}</div>)}
    </div>
    {news.length > perView && <button type="button" className="idsc-news-arrow idsc-news-arrow--next" onClick={() => move(1)} disabled={position >= maxPosition} aria-label="Next news article"><ChevronRight size={25} /></button>}
    {news.length > perView && <div className="idsc-news-carousel__pagination" aria-label={`Showing article ${Math.min(position + 1, news.length)} of ${news.length}`}>
      {Array.from({ length: Math.min(4, Math.max(1, maxPosition + 1)) }, (_, i) => <span key={i} className={i === (maxPosition ? Math.round(position / maxPosition * (Math.min(4,maxPosition+1)-1)) : 0) ? 'is-active' : ''} />)}
    </div>}
  </div>;
}
