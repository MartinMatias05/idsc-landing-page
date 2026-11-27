import { useEffect, useState } from 'react';
import { getPublicContent } from '../services/adminApi';
import { Link } from 'react-router-dom';
import TuitionFees from '../components/TuitionFees';
import '../styles/information-pages.css';

// These keys match AdminStore.pageNames. Data remains frontend-only; no backend endpoints are changed.
export const infoPages = {
  '/admission/requirements': 'Admission Requirements',
  '/admission/payment-instructions': 'Alternative Payment',
  '/admission/tuition': 'Estimated Tuition Fee',
  '/programs/college': 'College Programs',
  '/programs/shs': 'SHS Programs',
  '/about': 'About IDSC',
  '/about/hymn': 'IDSC Hymn',
  '/about/vision-mission': 'Vision, Mission & Core Values',
};
export const pagePath = name => Object.keys(infoPages).find(path => infoPages[path] === name) || '/';

const programGroups = [
  ['COLLEGE OF CRIMINOLOGY', 'Bachelor of Science in Criminology (BSC)'],
  ['COLLEGE OF HOSPITALITY AND TOURISM', 'Bachelor of Science in Hospitality Management (BSHM)', 'Bachelor of Science in Tourism Management (BSTM)'],
  ['COLLEGE OF INFORMATION TECHNOLOGY', 'Bachelor of Science in Information Technology (BSIT)', 'Associate in Computer Technology (2–year)'],
  ['BUSINESS ADMINISTRATION DEPARTMENT', 'Bachelor of Science in Business Administration Major in Marketing Management (BSBA–MM)', 'Bachelor of Science in Business Administration Major in Human Resource Management (BSBA–HRM)'],
  ['EDUCATION DEPARTMENT', 'Bachelor of Secondary Education Major in English (BSEd–English)', 'Bachelor of Secondary Education Major in Mathematics (BSEd–Mathematics)', 'Bachelor of Elementary Education (BSEd)'],
];
const collegeFees = programGroups.flatMap(([, ...programs]) => programs);
const shsPrograms = ['Academic Track', 'TechPro Track'];

const pageSettings = {
  'Admission Requirements': { title: 'Admissions', subtitle: 'Start your IDSC journey with clear next steps, short requirements guidance, and a simple path to enrollment.', image: '/assets/Admission Hero.png', kind: 'short' },
  'Alternative Payment': { title: 'Alternative Payment', subtitle: 'Students may inquire about available payment arrangements and alternative payment options to help manage their tuition and school expenses.', image: '/assets/Admission Hero.png', kind: 'short' },
  'Estimated Tuition Fee': { title: 'Estimated Tuition Fee', subtitle: 'Learn about the expected tuition and school fees for your chosen program, including any costs that may vary depending on the academic year or course.', image: '/assets/Admission Hero.png', kind: 'short' },
  'College Programs': { title: 'College Programs', image: '/assets/College.jpg', kind: 'program' },
  'SHS Programs': { title: 'Senior High School Program', image: '/assets/SHS.jpg', kind: 'program' },
  'About IDSC': { title: 'ABOUT IDSC', subtitle: '(Description)', image: '/assets/about/campus.jpg', kind: 'full' },
  'IDSC Hymn': { title: 'IDSC Hymn', subtitle: '(Description)', image: '/assets/about/idsc-community.jpg', kind: 'full' },
  'Vision, Mission & Core Values': { title: 'Vision, Mission and Core Values', subtitle: '(Description)', image: '/assets/about/idsc-community.jpg', kind: 'full' },
};

function SectionTitle({ tag, title, description }) {
  return <div className="idsc-info-heading"><span className="idsc-info-tag">{tag}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
function RequirementGroup({ badge, title, items, green = false, isOpen, onToggle, groupId }) {
  return <section className={`idsc-requirement${isOpen ? ' is-expanded' : ''}`}>
    <h3 className="idsc-requirement-title">
      <button type="button" className="idsc-requirement-toggle" aria-expanded={isOpen} aria-controls={`idsc-requirement-panel-${groupId}`} onClick={onToggle}>
        <span className={`idsc-info-smalltag${green ? ' is-green' : ''}`}>{badge}</span>
        <span className="idsc-requirement-label">{title}</span>
        <span className="idsc-requirement-chevron" aria-hidden="true">⌄</span>
      </button>
    </h3>
    {isOpen && <div className="idsc-requirement-body" id={`idsc-requirement-panel-${groupId}`}>
      <ol>{items.map(item => <li key={item}>{item}</li>)}</ol>
    </div>}
  </section>;
}
function Requirements() {
  // Exactly one panel can be expanded, matching the three supplied Figma states.
  const [expanded, setExpanded] = useState(null);
  const groups = [
    { id: 'shs', badge: 'SENIOR HIGH SCHOOL', title: 'Senior High School', items: [
      'Original Junior High School Card (SF 9)',
      'Original Good Moral Certificate',
      'Photocopy of PSA Birth Certificate',
      'Two (2) passport-size pictures with white background',
      'One (1) long white folder',
    ] },
    { id: 'college', badge: 'COLLEGE', title: 'College', green: true, items: [
      'PSA Birth Certificate — Photocopy',
      'Form 138 / SF 9 — Original',
      'Good Moral Certificate — Original',
      'Two (2) 2×2 pictures with white background',
    ] },
    { id: 'transferees', badge: 'TRANSFEREES', title: 'Transferees', items: [
      'Transcript of Records',
      'Honorable Dismissal',
    ] },
  ];
  return <>
    <section className="idsc-info-section">
      <div className="idsc-info-container">
        <SectionTitle tag="REQUIREMENTS" title="Prepare your application" description="Review the quick guidance below, then confirm exact requirements with the IDSC admissions office before you submit."/>
        <div className="idsc-info-requirements">
          {groups.map(group => <RequirementGroup key={group.id} {...group} groupId={group.id} isOpen={expanded === group.id} onToggle={() => setExpanded(previous => previous === group.id ? null : group.id)}/>)}
          <p className="idsc-info-notice">ⓘ Exact requirements may vary by program. Confirm the latest documents, deadlines, and eligibility rules with the IDSC admissions office.</p>
        </div>
      </div>
    </section>
    <section className="idsc-info-section idsc-info-tinted">
      <div className="idsc-info-container">
        <SectionTitle tag="PROCESS" title="Simple admission steps" description="Follow these general steps, then connect with the admissions team for verified guidance and next steps."/>
        <div className="idsc-steps">{[
          ['Choose a program','Explore Senior High School and College pathways to find the best fit for your next academic step.'],
          ['Confirm requirements','Check the documents, deadlines, and eligibility rules for your chosen program with the admissions office.'],
          ['Prepare and submit','Prepare your documents, complete your application, and submit it according to the official guidance.'],
          ['Follow enrollment guidance','Wait for the next enrollment steps, then complete registration and orientation as advised by the school.'],
        ].map(([title,detail],i) => <article className="idsc-step" key={title}><span className="idsc-info-smalltag">STEP {i + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </div>
    </section>
  </>;
}
function Payments() {return <section className="idsc-info-section idsc-info-tinted"><div className="idsc-info-container"><SectionTitle tag="INSTRUCTIONS" title="Payment Instructions" description="Follow the steps below when paying your tuition and school fees through online banking or GCash. Make sure to submit your proof of payment for verification."/><div className="idsc-bank-banner"><span className="idsc-bank-symbol">▦</span><div><small>PNB ACCOUNT DETAILS</small><strong>INFOTECH DEVELOPMENT SYSTEM COLLEGES, INC.</strong><span>Account Number: <b>250570002777</b> &nbsp; Bank: Philippine National Bank (PNB)</span></div></div><div className="idsc-payment-grid"><article className="idsc-payment-card"><small>ONLINE BANKING</small><h3>Online Banking / PNB</h3><ol>{['Pay your fees through online banking or deposit to IDSC’s PNB bank account using the details above.','Select PNB, enter the bank details and the amount to transfer.','Select real-time transfer via InstaPay.','Enter your name, course, and year in the Purpose field.','Send proof of payment to IDSC’s official Facebook page or email.','Proceed to the Finance Officer for the online payment verification form and exam permit.','After 2–3 business days, claim your Official Receipt at Cashier Window 1.'].map(x=><li key={x}>{x}</li>)}</ol></article><article className="idsc-payment-card"><small>MOBILE PAYMENT</small><h3>GCash</h3><ol>{['Open GCash and tap Transfer.','Select PNB, enter the amount and use the same bank account details shown above.','Send the GCash receipt to the school for verification.','Proceed to the Finance Officer for the online payment verification form and exam permit.','After 2–3 business days, proceed to the Cashier to claim your Official Receipt.'].map(x=><li key={x}>{x}</li>)}</ol><p className="idsc-info-notice">ⓘ Use the same PNB account details shown in the panel above when transferring via GCash.</p></article></div><div className="idsc-payment-warning"><strong>Important Note</strong><p>Keep your payment receipt until payment verification is complete and your Official Receipt has been issued. Confirm current bank details and payment instructions directly with the IDSC Finance Office before sending money.</p></div></div></section>}
function Programs({ shs=false, descriptionOverride, descriptionRemoved=false }) {return <section className="idsc-info-section idsc-program-section"><div className="idsc-info-container"><SectionTitle tag="PROGRAMS" title={shs?'Senior High School Program':'College Programs'} description={descriptionRemoved ? '' : (descriptionOverride || (shs?'Discover your interests, develop your skills, and build a strong foundation that prepares you for college, career, and future opportunities.':'Explore programs that build your knowledge, strengthen your skills, and prepare you for a meaningful career and a brighter future.'))}/><div className="idsc-program-list">{shs?shsPrograms.map(entry=><div className="idsc-program-box" key={entry}>• &nbsp;{entry==='TechPro Track'?'Technical–Professional Track (TechPro)':entry}</div>):programGroups.map(([group,...entries])=><div className="idsc-program-box" key={group}><strong>{group}</strong><ul>{entries.map(entry=><li key={entry}>{entry}</li>)}</ul></div>)}</div></div></section>}
export default function InformationPage({ name, override, tuitionOverrides }) {
  const [published,setPublished]=useState(null);
  useEffect(()=>{if(override!==undefined)return;let mounted=true;getPublicContent().then(value=>{if(mounted)setPublished(value)}).catch(()=>{});return()=>{mounted=false}},[override]);
  const effectiveOverride=override===undefined ? published?.pages?.[name] : override;
  const effectiveTuition=tuitionOverrides===undefined ? published?.tuitionOverrides : tuitionOverrides;
  const cfg=pageSettings[name];
  if(!cfg) return null;
  const title=effectiveOverride?.title && effectiveOverride.title!==name ? effectiveOverride.title : cfg.title;
  const description = effectiveOverride?.descriptionRemoved ? '' : (effectiveOverride?.description || cfg.subtitle);
  const image=effectiveOverride?.image || cfg.image;
  return <div className={`idsc-info-page idsc-info-${cfg.kind}`}>
    <section className="idsc-info-hero" style={{backgroundImage:cfg.kind==='program' ? `url(${JSON.stringify(image)})` : cfg.kind==='full' ? `linear-gradient(180deg, rgba(47,126,65,.75) 0%, rgba(27,95,50,.81) 48%, rgba(11,36,21,.96) 84%, #0b2415 100%), url(${JSON.stringify(image)})` : `linear-gradient(90deg,rgba(4,34,23,.57),rgba(4,34,23,.36)),url(${JSON.stringify(image)})`}}>
      {cfg.kind!=='program' && <div className="idsc-info-hero-inner"><h1>{title}</h1><p>{description}</p></div>}
    </section>
    {name==='Admission Requirements' && <Requirements/>}
    {name==='Alternative Payment' && <Payments/>}
    {name==='Estimated Tuition Fee' && <TuitionFees overrides={effectiveTuition}/>}
    {name==='College Programs' && <Programs descriptionOverride={effectiveOverride?.description} descriptionRemoved={effectiveOverride?.descriptionRemoved}/>}
    {name==='SHS Programs' && <Programs shs descriptionOverride={effectiveOverride?.description} descriptionRemoved={effectiveOverride?.descriptionRemoved}/>}
    {cfg.kind==='full' && effectiveOverride?.description && <section className="idsc-info-section"><div className="idsc-info-container"><SectionTitle tag="ABOUT IDSC" title={title} description={effectiveOverride.description}/></div></section>}
  </div>;
}
