import './news-hero-carousel.css';
import { useEffect, useRef, useState } from 'react';
import AsyncContent from '../components/AsyncContent';
import ImageWithFallback from '../components/ImageWithFallback';

const SNAP_MS = 390;

function displayDate(value) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
        .format(new Date(`${value}T00:00:00Z`))
    : value || null;
}

function safeStoryUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}

/** Drag-following, snap-to-slide carousel; no fade, arrows, or visible counter. */
export default function NewsHero({ state, articles, onActiveChange }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [settling, setSettling] = useState(false);
  const storiesRef = useRef([]);
  const areaRef = useRef(null);
  const gestureRef = useRef(null);
  const busyRef = useRef(false);
  const settleTimerRef = useRef(null);
  const suppressClickUntilRef = useRef(0);

  useEffect(() => () => window.clearTimeout(settleTimerRef.current), []);
  useEffect(() => {
    window.clearTimeout(settleTimerRef.current);
    busyRef.current = false;
    gestureRef.current = null;
    setSettling(false);
    setDragX(0);
    setIndex(0);
    if (articles?.[0]) onActiveChange?.(articles[0]);
  }, [articles?.[0]?.id]);

  function move(direction, fromDrag = 0) {
    if (busyRef.current) return;
    const stories = storiesRef.current;
    const width = areaRef.current?.clientWidth || 1;
    if (stories.length < 2) { setDragX(0); return; }
    busyRef.current = true;
    setSettling(true);
    // Positive drag moves content right (previous); negative moves left (next).
    setDragX(direction === 0 ? 0 : -direction * width);
    if (Math.abs(fromDrag) > 8) suppressClickUntilRef.current = Date.now() + 650;
    settleTimerRef.current = window.setTimeout(() => {
      const next = (index + direction + stories.length) % stories.length;
      // Rebase the three-slide strip instantly after the neighboring slide has arrived.
      setSettling(false);
      setIndex(next);
      setDragX(0);
      busyRef.current = false;
      onActiveChange?.(stories[next]);
    }, SNAP_MS);
  }

  function resetDrag() {
    if (busyRef.current) return;
    if (Math.abs(dragX) < 1) { setDragX(0); return; }
    move(0, dragX);
  }

  function renderSlide(story, slot, selected) {
    const published = story.publishedOn || story.postedOn;
    const url = safeStoryUrl(story.url);
    return <div
      key={`${story.id}-${slot}`}
      className={`news-hero__slide${settling ? ' news-hero__slide--settling' : ''}`}
      style={{ left: `${slot * 100}%`, transform: `translate3d(${dragX}px, 0, 0)` }}
      aria-hidden={!selected}
    >
      <ImageWithFallback image={story.image} className="news-hero__image" decorative />
      <div className="news-hero__scrim" aria-hidden="true" />
      <div className="news-hero__text">
        <div className="news-hero__meta">
          <span className="news-hero__category" aria-hidden="true" />
          {published && <time dateTime={published}>{displayDate(published)}</time>}
        </div>
        {selected ? <h1 id="hero-title" className="news-hero__title">
          {url ? <a className="news-hero__title-link" href={url} target="_blank" rel="noopener noreferrer"
            onDragStart={e => e.preventDefault()}
            onClick={e => { if (Date.now() < suppressClickUntilRef.current) e.preventDefault(); }}
          >{story.title}</a> : story.title}
        </h1> : <div className="news-hero__title" role="presentation">{story.title}</div>}
        {story.summary && <p className="news-hero__description">{story.summary}</p>}
      </div>
    </div>;
  }

  function build(data) {
    const source = articles ?? [...data.items].sort((a,b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    const stories = source.filter(Boolean).slice(0, 4);
    storiesRef.current = stories;
    if (!stories.length) return <div className="news-hero__empty">No featured stories available.</div>;
    const activeIndex = Math.min(index, stories.length - 1);
    if (stories.length === 1) return renderSlide(stories[0], 0, true);
    return <>
      {renderSlide(stories[(activeIndex - 1 + stories.length) % stories.length], -1, false)}
      {renderSlide(stories[activeIndex], 0, true)}
      {renderSlide(stories[(activeIndex + 1) % stories.length], 1, false)}
      <span className="news-hero__sr-only" aria-live="polite">
        Featured story {activeIndex + 1} of {stories.length}. Drag horizontally to slide between stories.
      </span>
    </>;
  }

  return <section
    ref={areaRef}
    className="news-hero"
    aria-labelledby="hero-title"
    aria-roledescription="carousel"
    tabIndex={0}
    onPointerDown={e => {
      if (busyRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
      gestureRef.current = { id:e.pointerId, startX:e.clientX, startY:e.clientY, moved:false };
    }}
    onPointerMove={e => {
      const g = gestureRef.current;
      if (!g || g.id !== e.pointerId || busyRef.current || storiesRef.current.length < 2) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (!g.moved && Math.abs(dx) < 9) return;
      if (!g.moved && Math.abs(dx) <= Math.abs(dy)) { gestureRef.current = null; return; }
      if (!g.moved) {
        g.moved = true;
        areaRef.current?.setPointerCapture?.(e.pointerId);
      }
      const width = areaRef.current?.clientWidth || 1;
      setDragX(Math.max(-width, Math.min(width, dx)));
      suppressClickUntilRef.current = Date.now() + 650;
    }}
    onPointerUp={e => {
      const g = gestureRef.current;
      gestureRef.current = null;
      if (!g || g.id !== e.pointerId || !g.moved) return;
      const dx = e.clientX - g.startX;
      const width = areaRef.current?.clientWidth || 1;
      if (Math.abs(dx) >= Math.min(width * 0.18, 140)) move(dx < 0 ? 1 : -1, dx);
      else resetDrag();
    }}
    onPointerCancel={() => { gestureRef.current = null; resetDrag(); }}
    onWheel={e => {
      if (busyRef.current || gestureRef.current) return;
      if (Math.abs(e.deltaX) > 45 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.3) move(e.deltaX > 0 ? 1 : -1);
    }}
    onKeyDown={e => {
      if (e.target?.tagName === 'A') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    }}
  >
    <AsyncContent state={state} isEmpty={data=>!data.items?.length && !articles?.length}
      emptyMessage="No featured stories available.">{build}</AsyncContent>
  </section>;
}
