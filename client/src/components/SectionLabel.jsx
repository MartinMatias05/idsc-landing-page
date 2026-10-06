/** Yellow uppercase pill that introduces a section (Figma: "Section label" > "Status"). */
export default function SectionLabel({ children, className = '' }) {
  return <span className={`section-label ${className}`}>{children}</span>;
}
