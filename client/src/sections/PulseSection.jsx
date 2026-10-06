import AsyncContent from '../components/AsyncContent';
import PulseCard from '../components/PulseCard';
import SectionLabel from '../components/SectionLabel';

/** IDSC Pulse heading band + three cards (Figma "Programs and admission" 83:353). */
export default function PulseSection({ state }) {
  return (
    <section className="pulse" aria-labelledby="pulse-title">
      <AsyncContent
        state={state}
        isEmpty={(data) => data.items.length === 0}
        emptyMessage="No posts available."
      >
        {({ heading, items }) => (
          <>
            <div className="pulse__heading">
              <SectionLabel>{heading.label}</SectionLabel>
              <h2 id="pulse-title" className="section-title">
                {heading.title}
              </h2>
            </div>
            <div className="pulse__grid">
              {items.map((post) => (
                <PulseCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </AsyncContent>
    </section>
  );
}
