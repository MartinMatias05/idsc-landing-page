import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { semesterFees, miscellaneousFees } from '../../data/semester-fees.data';
import { useAdmin } from '../state/AdminStore';

const fields = [ ['units','Regular units'], ['tuition','Tuition'], ['miscellaneous','Miscellaneous'], ['laboratory','Laboratory'], ['research','Thesis / Research'] ];
const money = amount => new Intl.NumberFormat('en-PH', {style:'currency',currency:'PHP'}).format(amount);
export default function AdminTuitionEditor({ onClose }) {
  const { tuitionOverrides, saveTuitionRow, saveMiscellaneousFee } = useAdmin();
  const [courseIndex, setCourseIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(0);
  const [mode, setMode] = useState('semester');
  const [miscIndex, setMiscIndex] = useState(0);
  const [draft, setDraft] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const course = semesterFees[courseIndex];
  const selected = course.years[yearIndex] || course.years[0];
  const key = `${course.name}::${selected.year}`;
  const base = tuitionOverrides.rows[key] || selected;
  const [miscName, baseMisc] = miscellaneousFees[miscIndex];
  useEffect(() => {
    const current = mode === 'semester' ? base : {amount:tuitionOverrides.miscellaneous[miscName] ?? baseMisc};
    setDraft(Object.fromEntries(Object.entries(current).map(([k,v]) => [k,String(v)])));
    setError(''); setMessage('');
  // Switching records reloads the saved values; saving the current record preserves the success notice.
  }, [mode, courseIndex, yearIndex, miscIndex]);
  useEffect(() => {
    const onKey = event => { if(event.key === 'Escape') onClose(); };
    window.addEventListener('keydown',onKey);
    return () => window.removeEventListener('keydown',onKey);
  }, [onClose]);
  const update = (name,value) => { setDraft(prev => ({...prev,[name]:value})); setMessage(''); };
  function save() {
    setError('');
    if(mode === 'semester') {
      const values = Object.fromEntries(fields.map(([field]) => [field,Number(draft[field])]));
      if(fields.some(([field])=>draft[field] === '' || !Number.isFinite(values[field]) || values[field]<0) || !Number.isInteger(values.units) || values.units>80) {setError('Enter valid, non-negative amounts and a whole-number unit count (0–80).');return;}
      if(!saveTuitionRow(course.name,selected.year,values)) {setError('The entry could not be saved.');return;}
      setMessage('Semester fees updated and recorded in Recent History.');
    } else {
      const amount=Number(draft.amount);
      if(draft.amount === '' || !Number.isFinite(amount) || amount<0 || !saveMiscellaneousFee(miscName,amount)) {setError('Enter a valid, non-negative amount.');return;}
      setMessage('Miscellaneous charge updated and recorded in Recent History.');
    }
  }
  const previewTotal=fields.slice(1).reduce((sum,[field])=>sum+(Number(draft[field])||0),0);
  return <div className="adm-modal-backdrop" onMouseDown={onClose}>
    <div className="adm-modal adm-inline-modal" role="dialog" aria-modal="true" aria-label="Edit first semester school fees" onMouseDown={event=>event.stopPropagation()}>
      <div className="adm-inline-heading"><div><small>IDSC · WEBSITE ADMINISTRATION</small><h2>Edit first-semester fees</h2></div><button type="button" className="adm-inline-close" aria-label="Close tuition editor" onClick={onClose}><X size={19}/></button></div>
      <p className="adm-hint">Prototype data only. Review fee changes with the IDSC Finance Office before official publication. Images and page structure are developer-managed.</p>
      <div className="adm-form">
        <label>Fee section<select value={mode} onChange={e=>setMode(e.target.value)}><option value="semester">College semester schedule</option><option value="miscellaneous">Miscellaneous breakdown</option></select></label>
        {mode === 'semester' ? <>
          <label>College program<select value={courseIndex} onChange={e=>{setCourseIndex(Number(e.target.value));setYearIndex(0)}}>{semesterFees.map((item,i)=><option key={item.name} value={i}>{item.name}</option>)}</select></label>
          <label>Year level<select value={yearIndex} onChange={e=>setYearIndex(Number(e.target.value))}>{course.years.map((row,i)=><option key={row.year} value={i}>{row.year}{row.year===1?'st':row.year===2?'nd':row.year===3?'rd':'th'} Year</option>)}</select></label>
          {fields.map(([field,label])=><label key={field}>{label}<input type="number" min="0" step={field==='units'?'1':'0.01'} value={draft[field] ?? ''} onChange={e=>update(field,e.target.value)}/></label>)}
          <p className="adm-note adm-note-green"><b>Calculated semester total:</b> {money(previewTotal)}</p>
        </> : <>
          <label>Miscellaneous item<select value={miscIndex} onChange={e=>setMiscIndex(Number(e.target.value))}>{miscellaneousFees.map(([label],i)=><option key={label} value={i}>{label}</option>)}</select></label>
          <label>Amount (₱)<input type="number" min="0" step="0.01" value={draft.amount ?? ''} onChange={e=>update('amount',e.target.value)}/></label>
          <p className="adm-hint">Updating an itemized charge changes the miscellaneous table total. Existing course-specific miscellaneous charges remain separate unless edited in the semester schedule.</p>
        </>}
        {error && <p className="adm-error" role="alert">{error}</p>}
        {message && <p className="adm-success" role="status">{message}</p>}
        <div className="adm-form-actions"><button type="button" className="adm-button adm-button--secondary" onClick={onClose}>Close</button><button type="button" className="adm-button adm-button--primary" onClick={save}>Save fee changes</button></div>
      </div>
    </div>
  </div>;
}
