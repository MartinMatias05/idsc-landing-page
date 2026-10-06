import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../lib/format';
import AsyncContent from '../components/AsyncContent';
import ImageWithFallback from '../components/ImageWithFallback';

/** One article. A 404 from the API (unknown id) is shown as "Unable to load content." with a way back. */
export default function NewsArticlePage() {
  const { id } = useParams();
  const fetchArticle = useCallback((signal) => api.getNewsArticle(id, signal), [id]);
  const article = useApi(fetchArticle);

  return (
    <article className="article">
      <Link to="/news" className="article__back">
        Back to news
      </Link>
      <AsyncContent state={article} emptyMessage="This article is not available.">
        {(data) => (
          <>
            <p className="article__meta">
              {data.category} · {formatDate(data.publishedOn)}
            </p>
            <h1 className="article__title">{data.title}</h1>
            <ImageWithFallback image={data.image} className="article__image" />
            {data.body.map((paragraph) => (
              <p key={paragraph} className="article__body">
                {paragraph}
              </p>
            ))}
          </>
        )}
      </AsyncContent>
    </article>
  );
}
