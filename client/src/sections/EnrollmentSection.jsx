import AsyncContent from '../components/AsyncContent';
import ImageWithFallback from '../components/ImageWithFallback';
import '../styles/enrollment-refined.css';

const DEFAULT_HEADLINE = 'Enrollment is ongoing at IDSC';
const DEFAULT_DESCRIPTION =
  'Begin your next chapter in Ligao City. Explore learning pathways, review admission information, and take the first step toward joining the IDSC community.';
const DEFAULT_POSTER = '/assets/enrollment/pre-registration-poster.jpg';
const STUDENTS_PHOTO = '/assets/enrollment/idsc-students-cutout.png';

/**
 * Website enrollment information, assembled from semantic HTML and CSS.
 * The student image is a transparent foreground asset supplied by the user.
 * Text and background design are separate JSX/CSS elements.
 * Admin prototype overrides are still respected via the `state` prop.
 */
export default function EnrollmentSection({ state }) {
  return (
    <section className="enrollment enrollment--refined" aria-labelledby="enrollment-title">
      <AsyncContent state={state} isEmpty={(data) => !data.hero} emptyMessage="No enrollment information available.">
        {({ hero }) => {
          const headline = hero.headline || DEFAULT_HEADLINE;
          const description = hero.description || DEFAULT_DESCRIPTION;
          const image = hero.image?.url === DEFAULT_POSTER || !hero.image?.url
            ? { url: STUDENTS_PHOTO, alt: 'IDSC students in school uniforms' }
            : hero.image;

          return (
            <>
              <div className="enrollment-refined__copy">
                <div className="enrollment-refined__content">
                  <div className="enrollment-refined__eyebrow">
                    <span className="enrollment-refined__status">{hero.statusLabel || 'Admissions Open'}</span>
                    </div>
                  <h2 id="enrollment-title" className="enrollment-refined__title">{headline}</h2>
                  <span className="enrollment-refined__dash" aria-hidden="true" />
                  <p className="enrollment-refined__description">{description}</p>
                </div>
              </div>
              <div className="enrollment-refined__visual" aria-label="IDSC enrollment student photograph">
                <ImageWithFallback image={image} className="enrollment-refined__photo" />
              </div>
            </>
          );
        }}
      </AsyncContent>
    </section>
  );
}
