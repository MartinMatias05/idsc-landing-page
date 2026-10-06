import AsyncContent from '../components/AsyncContent';
import ImageWithFallback from '../components/ImageWithFallback';

/** Full-width featured news (Figma "View Image" 54:203). Text comes entirely from the featured API item. */
export default function NewsHero({ state }) {
  return (
    <section className="news-hero" aria-labelledby="hero-title">
      <AsyncContent
        state={state}
        isEmpty={(data) => data.items.length === 0}
        emptyMessage="No news available."
      >
        {(data) => {
          const article = data.items.find((item) => item.featured) ?? data.items[0];
          return (
            <>
              <ImageWithFallback image={article.image} className="news-hero__image" decorative />
              <div className="news-hero__scrim" aria-hidden="true" />
              <div className="news-hero__text">
                <h1 id="hero-title" className="news-hero__title">
                  {article.title}
                </h1>
                <p className="news-hero__description">{article.summary}</p>
              </div>
            </>
          );
        }}
      </AsyncContent>
    </section>
  );
}
