import AsyncContent from '../components/AsyncContent';
import ImageWithFallback from '../components/ImageWithFallback';

/** Enrollment hero (Figma 65:210). The hero-actions frame is empty in the design, so no buttons are rendered. */
export default function EnrollmentSection({ state }) {
  return (
    <section className="enrollment" aria-labelledby="enrollment-title">
      <span className="enrollment__circle" aria-hidden="true" />
      <span className="enrollment__ring" aria-hidden="true" />
      <AsyncContent state={state} isEmpty={(data) => !data.hero} emptyMessage="No enrollment information available.">
        {({ hero }) => (
          <>
            <div className="enrollment__message">
              <div className="enrollment__status">
                <span className="section-label">{hero.statusLabel}</span>
                <span className="enrollment__audience">{hero.audience}</span>
              </div>
              <h2 id="enrollment-title" className="enrollment__headline">
                {hero.headline}
              </h2>
              <p className="enrollment__description">{hero.description}</p>
            </div>
            <div className="enrollment__art">
              <div className="enrollment__frame">
                <ImageWithFallback image={hero.image} className="enrollment__image" />
              </div>
            </div>
          </>
        )}
      </AsyncContent>
    </section>
  );
}
