import AppLink from '../components/AppLink';
import AsyncContent from '../components/AsyncContent';
import Icon from '../components/Icon';
import SupportCard from '../components/SupportCard';

// The design pairs the primary button with an arrow and the secondary one with a clipboard icon.
const ACTION_ICONS = ['arrow-right', 'clipboard-list'];

/** Final enrollment call to action + admissions support card (Figma 83:450). */
export default function CtaSection({ state }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <span className="cta__glow" aria-hidden="true" />
      <span className="cta__ring" aria-hidden="true" />
      <AsyncContent state={state} isEmpty={(data) => !data.callToAction} emptyMessage="No enrollment information available.">
        {({ callToAction, support }) => (
          <>
            <div className="cta__content">
              <p className="cta__label">
                <span className="cta__accent" aria-hidden="true" />
                {callToAction.label}
              </p>
              <h2 id="cta-title" className="cta__headline">
                {callToAction.headline}
              </h2>
              <p className="cta__description">{callToAction.description}</p>
              <div className="cta__actions">
                {callToAction.actions.map((action, index) => (
                  <AppLink
                    key={action.href}
                    href={action.href}
                    className={`btn btn--large ${index === 0 ? 'btn--yellow' : 'btn--white'}`}
                  >
                    {action.label}
                    <Icon name={ACTION_ICONS[index] ?? 'arrow-right'} size={23} />
                  </AppLink>
                ))}
              </div>
            </div>
            <SupportCard support={support} />
          </>
        )}
      </AsyncContent>
    </section>
  );
}
