import { ArrowDown, ArrowUpRight, CalendarDays } from 'lucide-react';
import Button from '../components/Button';
import { formatDate } from '../lib/format';

export default function Hero({ article }) {
  if (!article) return null;
  return (
    <section className="hero">
      <div className="hero-image" style={{ backgroundImage: `url(${article.image?.url || '/assets/news/hero.svg'})` }} />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-meta"><span>{article.category}</span><span><CalendarDays size={14}/>{formatDate(article.publishedOn)}</span></div>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <Button href={`/news/${article.id}`} variant="yellow">Read full story</Button>
        </div>
        <div className="hero-scroll"><ArrowDown size={18}/><span>Scroll to explore</span></div>
        <div className="hero-index"><b>01</b><span>/</span><span>03</span><ArrowUpRight size={17}/></div>
      </div>
    </section>
  );
}
