import { Link } from 'react-router-dom';

/** Shown for routes that do not exist or whose page is not part of the delivered screens yet. */
export default function NotFoundPage() {
  return (
    <section className="article">
      <h1 className="article__title">Page not available</h1>
      <p className="article__body">This page does not exist or is not available yet.</p>
      <Link to="/" className="article__back">
        Back to home
      </Link>
    </section>
  );
}
