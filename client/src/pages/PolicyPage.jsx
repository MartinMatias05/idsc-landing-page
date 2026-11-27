import { Link } from 'react-router-dom';
import {useEffect,useState} from 'react';
import {getPublicContent} from '../services/adminApi';
import '../styles/policy-pages.css';

const CONTACT_EMAIL = 'idscollegesinc@gmail.com';

function Topic({ title, children, id }) {
  return <section className="idsc-policy-topic" id={id}><h2>{title}</h2>{children}</section>;
}

function PrivacyContent() {
  return <>
    <Topic title="About this notice">
      <p>This notice describes how the public-facing IDSC Landing Page prototype works and the limited information involved when you browse it. It covers this website only, not the separate Student, Faculty, Registrar, Finance, Library, Clinic, or other linked systems.</p>
      <p>Infotech Development System Colleges, Inc. is located in Ligao City, Albay, Philippines. For questions about this website, use the school contact details below.</p>
    </Topic>
    <Topic title="Information handled by this website">
      <ul>
        <li><strong>Visitor count:</strong> Opening the Home Page sends a visit-recording request to the Landing Page API. The API increments an aggregate number; the current prototype does not create a visitor profile or account for that request.</li>
        <li><strong>Browser session flag:</strong> The site uses browser session storage to remember that a visit has already been counted during the current browser session. This helps avoid double-counting on refresh.</li>
        <li><strong>Content requests:</strong> Your browser requests public information, such as news previews, admissions guidance, programs, and published statistics, from the website API.</li>
      </ul>
      <p>The website's application code does not currently provide public account registration, an enrollment application form, or a payment collection form. You should not submit passwords or sensitive documents through the Admin prototype.</p>
    </Topic>
    <Topic title="Purpose and handling of visitor statistics">
      <p>The visitor count helps show approximate Home Page activity. The counter starts at zero in fresh storage and is designed to persist across backend restarts when its configured storage location is durable. It should not be interpreted as a count of unique people. The session flag normally disappears when the browser session ends.</p>
      <p>Separate web hosting, network infrastructure, or linked services may process technical information under their own operational practices. Those practices have not been verified as part of this frontend prototype.</p>
    </Topic>
    <Topic title="Links to other services">
      <p>The website provides navigation to separate school service modules and external publications such as Vox Templari and IDSC Pulse. Selecting those links may take you to another website or service with its own privacy practices. Check the relevant notice before entering personal details or uploading school documents.</p>
    </Topic>
    <Topic title="Security and retention">
      <p>The public Landing Page uses an API for website content and aggregate statistics. Admin content changes are stored by the backend and Admin login requires configured credentials. Production hosting, retention arrangements, backup policies and security controls must be reviewed before release.</p>
    </Topic>
    <Topic title="Your privacy rights and inquiries">
      <p>Republic Act No. 10173, the Data Privacy Act of 2012, establishes rights relating to personal information, subject to applicable legal conditions. To ask how IDSC handles personal data, request information, or raise a concern, contact the school using the details below. This website prototype does not yet identify a designated Data Protection Officer contact; the school should confirm and publish that contact before official release.</p>
      <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Phone: <a href="tel:09178812683">09178812683</a>.</p>
    </Topic>
    <Topic title="Changes to this notice">
      <p>This description reflects the current Landing Page prototype. It must be reviewed and updated before production launch, and whenever personal-data processing, hosting, analytics, or integrated services change.</p>
    </Topic>
  </>;
}

function AccessibilityContent() {
  return <>
    <Topic title="Our approach">
      <p>IDSC aims to make its public information easy to reach and understand for prospective students, current students, families, faculty, staff, and other visitors, including people who use assistive technologies. We use the Web Content Accessibility Guidelines (WCAG) 2.2 as a reference for ongoing improvements.</p>
      <p>This is a statement of intent and current development practices, <strong>not a claim of WCAG certification or full conformance</strong>. A formal accessibility audit has not been completed for this prototype.</p>
    </Topic>
    <Topic title="Using the website">
      <ul>
        <li>Use <strong>Tab</strong> and <strong>Shift + Tab</strong> to move through links and buttons. Press <strong>Enter</strong> to activate a focused link or control.</li>
        <li>Use the <strong>Skip to content</strong> link at the beginning of the page to move past repeated navigation when it appears on keyboard focus.</li>
        <li>Use your browser's zoom controls (for example, <strong>Ctrl + +</strong> or <strong>Ctrl + -</strong>) to adjust text size.</li>
        <li>On smaller screens, open the <strong>Menu</strong> button to access the website's navigation links.</li>
      </ul>
    </Topic>
    <Topic title="Current features and known limitations">
      <p>The public website uses headings, navigational links, form labels, and responsive layouts. Some interactive components, complex carousels, embedded media, images, and content supplied through external services may still need additional keyboard, screen-reader, color-contrast, and reflow testing.</p>
      <p>Some pages contain temporary or reference content, including financial information that requires school verification. The website's search box is currently a disabled prototype interface, not an available search service. Linked external systems are outside the scope of this accessibility statement.</p>
    </Topic>
    <Topic title="Get help or report a problem">
      <p>If you cannot access information or have difficulty using a page, please tell IDSC which page you were trying to use, what happened, and, if comfortable sharing, your browser or assistive technology. Do not include passwords or sensitive student records in a general inquiry.</p>
      <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Phone: <a href="tel:09178812683">09178812683</a>. School office hours: Monday–Friday, 8:00 AM–4:00 PM.</p>
    </Topic>
    <Topic title="Ongoing review">
      <p>Accessibility improvements will be assessed as the public website and its content develop. The school should validate this statement, test with assistive technologies, and publish a reviewed version before public production release.</p>
    </Topic>
  </>;
}

export default function PolicyPage({ type, override }) {
  const [published,setPublished]=useState(null);
  useEffect(()=>{if(override!==undefined)return;let active=true;getPublicContent().then(d=>{if(active)setPublished(d)}).catch(()=>{});return()=>{active=false}},[override]);
  const privacy = type === 'privacy';
  const defaultTitle = privacy ? 'Privacy Notice' : 'Accessibility Statement';
  const effectiveOverride = override===undefined ? published?.pages?.[defaultTitle] : override;
  const title = effectiveOverride?.title || defaultTitle;
  const intro = effectiveOverride?.descriptionRemoved ? '' : (effectiveOverride?.description || (privacy ? 'How this public website prototype handles information and connects to other school services.' : 'Our approach to making school website information easier for everyone to use.'));
  return <article className="idsc-policy" aria-labelledby="idsc-policy-title">
    <div className="idsc-policy-hero" style={effectiveOverride?.image ? {backgroundImage:`linear-gradient(110deg, rgba(5,58,30,.90),rgba(6,48,28,.75)), url("${effectiveOverride.image}")`,backgroundSize:"cover",backgroundPosition:"center"} : undefined}><div className="idsc-policy-wrap"><span className="idsc-policy-kicker">IDSC WEBSITE INFORMATION</span><h1 id="idsc-policy-title">{title}</h1><p>{intro}</p></div></div>
    <div className="idsc-policy-wrap idsc-policy-body">
      <p className="idsc-policy-status"><strong>Development notice:</strong> This page describes the current prototype. School review is required before official publication.</p>
      {privacy ? <PrivacyContent/> : <AccessibilityContent/>}
      <div className="idsc-policy-end"><Link to="/">Return to Home Page</Link><Link to={privacy ? '/accessibility' : '/privacy'}>{privacy ? 'Accessibility Statement' : 'Privacy Notice'}</Link></div>
    </div>
  </article>;
}
