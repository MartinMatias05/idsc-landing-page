import AsyncContent from '../components/AsyncContent';
import NoticeCard from '../components/NoticeCard';
import SectionLabel from '../components/SectionLabel';
import TextLink from '../components/TextLink';

const CARDS_SHOWN = 3;

/** "What's happening at IDSC:" heading row + notice grid (Figma "News" 71:240). */
export default function NewsSection({ state }) {
  return (
    <section className="news-section" aria-labelledby="news-title">
      <div className="news-section__heading">
        <div>
          <SectionLabel>News</SectionLabel>
          <h2 id="news-title" className="section-title">
            What’s happening at IDSC:
          </h2>
        </div>
        <TextLink href="/news">View all notices</TextLink>
      </div>
      <AsyncContent
        state={state}
        isEmpty={(data) => data.items.length === 0}
        emptyMessage="No news available."
      >
        {(data) => (
          <div className="notice-grid">
            {data.items.slice(0, CARDS_SHOWN).map((article, index) => (
              <NoticeCard key={article.id} article={article} accent={index === 0} />
            ))}
          </div>
        )}
      </AsyncContent>
    </section>
  );
}
