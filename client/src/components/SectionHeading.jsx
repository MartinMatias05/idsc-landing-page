export default function SectionHeading({ label, title, description, align = 'left' }) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {label && <div className="eyebrow"><span />{label}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
