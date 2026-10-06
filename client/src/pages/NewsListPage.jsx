import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import AsyncContent from '../components/AsyncContent';
import NoticeCard from '../components/NoticeCard';
import SectionLabel from '../components/SectionLabel';

/** All news, using the same notice cards as the home page (the Figma file has no dedicated news frame). */
export default function NewsListPage() {
  const news = useApi(api.getNews);
  return (
    <section className="news-section" aria-labelledby="news-list-title">
      <div className="news-section__heading">
        <div>
          <SectionLabel>News</SectionLabel>
          <h1 id="news-list-title" className="section-title">
            Latest news and announcements
          </h1>
        </div>
      </div>
      <AsyncContent state={news} isEmpty={(data) => data.items.length === 0} emptyMessage="No news available.">
        {(data) => (
          <div className="notice-grid">
            {data.items.map((article, index) => (
              <NoticeCard key={article.id} article={article} accent={index === 0} />
            ))}
          </div>
        )}
      </AsyncContent>
    </section>
  );
}
