import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

/** Logo + school name + tagline. Falls back to the abbreviation when the logo is unavailable. */
export default function Brand({ site }) {
  const abbreviation = site?.abbreviation ?? 'IDSC';
  return (
    <Link to="/" className="brand" aria-label={`${site?.name ?? abbreviation} home`}>
      <ImageWithFallback
        image={site?.logo}
        className="brand__logo"
        fallback={<span className="brand__monogram">{abbreviation}</span>}
      />
      {site && (
        <span className="brand__text">
          <span className="brand__name">{site.name}</span>
          <span className="brand__tagline">{site.tagline}</span>
        </span>
      )}
    </Link>
  );
}
