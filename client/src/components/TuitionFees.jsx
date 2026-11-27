import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { semesterFees, miscellaneousFees, schoolYear, semester } from '../data/semester-fees.data';
import '../styles/tuition-fees.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
const yearLabel = year => `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`;

function BreakdownRow({ label, amount }) {
  return <div className="idsc-tuition-breakdown-row"><span>{label}</span><strong>{money(amount)}</strong></div>;
}

export default function TuitionFees({ overrides }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [courseIndex, setCourseIndex] = useState(0);
  const [year, setYear] = useState(1);
  const openButton = useRef(null);
  const closeButton = useRef(null);
  const drawerRef = useRef(null);
  const titleId = useId();
  const courseId = useId();
  const yearId = useId();
  const course = semesterFees[courseIndex];
  const effective = (name, row) => overrides?.rows?.[`${name}::${row.year}`] || row;
  const selected = effective(course.name, course.years.find(item => item.year === year) || course.years[0]);
  const effectiveMisc = miscellaneousFees.map(([label, amount]) => [label, overrides?.miscellaneous?.[label] ?? amount]);
  const effectiveMiscTotal = effectiveMisc.reduce((sum, [, amount]) => sum + amount, 0);

  const chooseCourse = raw => {
    const index = Number(raw);
    setCourseIndex(index);
    setYear(semesterFees[index].years[0].year);
  };

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setDrawerOpen(false);
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const controls = Array.from(drawerRef.current.querySelectorAll('button:not([disabled]), select:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      openButton.current?.focus();
    };
  }, [drawerOpen]);

  const drawer = drawerOpen && createPortal(
    <div className="idsc-tuition-drawer-layer">
      <div className="idsc-tuition-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className="idsc-tuition-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={drawerRef}>
        <div className="idsc-tuition-drawer-header">
          <div className="idsc-tuition-drawer-symbol" aria-hidden="true">₱</div>
          <div className="idsc-tuition-drawer-heading">
            <h2 id={titleId}>Fee Calculator</h2>
            <p>Find your first-semester school fees.</p>
          </div>
          <button className="idsc-tuition-close" type="button" onClick={() => setDrawerOpen(false)} ref={closeButton} aria-label="Close fee calculator">×</button>
        </div>
        <div className="idsc-tuition-drawer-content">
          <div className="idsc-tuition-picker-fields">
            <label htmlFor={courseId}>College program
              <select id={courseId} value={courseIndex} onChange={event => chooseCourse(event.target.value)}>
                {semesterFees.map((entry, index) => <option value={index} key={entry.name}>{entry.name}</option>)}
              </select>
            </label>
            <label htmlFor={yearId}>Year level
              <select id={yearId} value={year} onChange={event => setYear(Number(event.target.value))}>
                {course.years.map(item => <option key={item.year} value={item.year}>{yearLabel(item.year)}</option>)}
              </select>
            </label>
          </div>
          <div className="idsc-tuition-result" aria-live="polite">
            <span className="idsc-tuition-eyebrow">TOTAL SCHOOL FEES · {semester.toUpperCase()}</span>
            <strong className="idsc-tuition-amount">{money(selected.total)}</strong>
            <small>{selected.units} regular units · {yearLabel(selected.year)} · SY {schoolYear}</small>
          </div>
          <div className="idsc-tuition-breakdown">
            <h3>Semester Fee Breakdown</h3>
            <BreakdownRow label="Tuition" amount={selected.tuition} />
            <BreakdownRow label="Miscellaneous" amount={selected.miscellaneous} />
            <BreakdownRow label="Laboratory" amount={selected.laboratory} />
            <BreakdownRow label="Thesis / Research" amount={selected.research} />
            <div className="idsc-tuition-total"><span>Semester total</span><strong>{money(selected.total)}</strong></div>
          </div>
          <p className="idsc-tuition-drawer-note">These are reference amounts from the school fee schedule, not a final billing assessment. Confirm applicable fees with the IDSC Finance Office.</p>
        </div>
      </aside>
    </div>,
    document.body
  );

  return <section className="idsc-info-section idsc-tuition-section">
    <div className="idsc-info-container">
      <div className="idsc-tuition-page-heading">
        <div className="idsc-info-heading">
          <span className="idsc-info-tag">TUITION</span>
          <h2>Estimated Tuition Fees</h2>
          <p>Published school fees for {semester}, SY {schoolYear}. Browse the full schedules below or use the optional fee calculator.</p>
        </div>
        <button className="idsc-tuition-launch" type="button" onClick={() => setDrawerOpen(true)} ref={openButton} aria-haspopup="dialog">
          <span aria-hidden="true">▤</span> Fee Calculator <span aria-hidden="true">→</span>
        </button>
      </div>

      <section className="idsc-tuition-table-section idsc-tuition-first-table" aria-labelledby="idsc-all-fees-title">
        <div className="idsc-tuition-section-header"><div><span className="idsc-info-tag">SEMESTER</span><h3 id="idsc-all-fees-title">College School Fee Schedule</h3><p>All college programs and year levels published for the first semester.</p></div></div>
        <div className="idsc-table-scroll idsc-tuition-all-table"><table><thead><tr><th scope="col">Program</th><th scope="col">Year</th><th scope="col">Units</th><th scope="col">Tuition</th><th scope="col">Misc.</th><th scope="col">Laboratory</th><th scope="col">Thesis / Research</th><th scope="col">Total</th></tr></thead><tbody>{semesterFees.flatMap(entry => entry.years.map(original => { const item = effective(entry.name, original); return <tr key={`${entry.name}-${item.year}`}><td>{entry.name}</td><td>{yearLabel(item.year)}</td><td>{item.units}</td><td>{money(item.tuition)}</td><td>{money(item.miscellaneous)}</td><td>{money(item.laboratory)}</td><td>{money(item.research)}</td><td className="idsc-tuition-strong">{money(item.total)}</td></tr>; }))}</tbody></table></div>
      </section>

      <section className="idsc-tuition-table-section" aria-labelledby="idsc-misc-title">
        <div className="idsc-tuition-section-header"><div><span className="idsc-info-tag">MISCELLANEOUS</span><h3 id="idsc-misc-title">Miscellaneous Fee Breakdown</h3><p>Published itemized base miscellaneous charges. Some continuing-year totals differ.</p></div></div>
        <div className="idsc-table-scroll idsc-tuition-misc-table"><table><thead><tr><th scope="col">Miscellaneous item</th><th scope="col">Amount</th></tr></thead><tbody>{effectiveMisc.map(([label, amount]) => <tr key={label}><td>{label}</td><td>{money(amount)}</td></tr>)}</tbody><tfoot><tr><th scope="row">Published base miscellaneous total</th><td>{money(effectiveMiscTotal)}</td></tr></tfoot></table></div>
      </section>

      <div className="idsc-tuition-info-note"><strong>Important:</strong> The photographed schedule is for the first semester of SY {schoolYear} only. The itemized {money(effectiveMiscTotal)} breakdown is the base list; the semester table uses the published {money(5723)} miscellaneous amount for most continuing-year entries. These amounts are reference figures, not a billing statement. Confirm applicable fees and adjustments with the IDSC Finance Office. Senior High School fee rates were not included in the supplied notice.</div>
    </div>
    {drawer}
  </section>;
}
