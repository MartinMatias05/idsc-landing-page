import AsyncContent from '../components/AsyncContent';
import NewsCarousel from '../components/NewsCarousel';
import SectionLabel from '../components/SectionLabel';
import TextLink from '../components/TextLink';

/** Four visible news previews, up to twelve posts; slide one at a time. */
export default function NewsSection({ state, items }) {
  return <section className="news-section idsc-news-section" aria-labelledby="news-title">
    <div className="news-section__heading">
      <div><SectionLabel>News</SectionLabel><h2 id="news-title" className="section-title">What’s happening at IDSC:</h2></div>
      <TextLink systemId="news">View all notices</TextLink>
    </div>
    <AsyncContent state={state} isEmpty={data => !data.items?.length && !items?.length} emptyMessage="No news available.">
      {data => <NewsCarousel items={items || data.items || []} />}
    </AsyncContent>
  </section>;
}
