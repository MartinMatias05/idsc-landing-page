import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { formatDate } from '../lib/format';

export default function NewsSection({ articles = [] }) {
  const cards = articles.filter((a) => !a.featured).slice(0, 3);
  return <section className="section news-section"><div className="container"><div className="section-top"><SectionHeading label="What's happening" title="News & updates" description="Stay close to the latest stories, activities, and announcements from the IDSC community."/><Link className="text-link" to="/news">View all news <ArrowUpRight size={16}/></Link></div><div className="news-grid">{cards.map((article) => <article className="news-card" key={article.id}><div className="card-image" style={{backgroundImage:`url(${article.image?.url || '/assets/news/card.svg'})`}}><span>{article.category}</span></div><div className="card-body"><div className="card-date"><CalendarDays size={14}/>{formatDate(article.publishedOn)}</div><h3>{article.title}</h3><p>{article.summary}</p><Link to={`/news/${article.id}`}>Read story <ArrowUpRight size={15}/></Link></div></article>)}</div></div></section>;
}
