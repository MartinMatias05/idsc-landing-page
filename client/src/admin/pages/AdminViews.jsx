import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Eye, ArrowLeft, Trash2, Settings2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClinicFloatingLink from '../../components/ClinicFloatingLink';
import NewsHero from '../../sections/NewsHero';
import NewsSection from '../../sections/NewsSection';
import EnrollmentSection from '../../sections/EnrollmentSection';
import PulseSection from '../../sections/PulseSection';
import StatisticsSection from '../../sections/StatisticsSection';
import CtaSection from '../../sections/CtaSection';
import AsyncContent from '../../components/AsyncContent';
import NewsCarousel, { NewsCarouselCard } from '../../components/NewsCarousel';
import PulseCard from '../../components/PulseCard';
import PulseShowcase from '../../components/PulseShowcase';
import SectionLabel from '../../components/SectionLabel';
import TextLink from '../../components/TextLink';
import { useAdmin } from '../state/AdminStore';
import InlineEditor from '../components/InlineEditor';
import AdminTuitionEditor from '../components/AdminTuitionEditor';
import InformationPage, { infoPages, pagePath } from '../../pages/InformationPage';
import PolicyPage from '../../pages/PolicyPage';

function AdminClinicPreview({ editing }) {
  const { links } = useAdmin();
  return <ClinicFloatingLink configuredUrl={links.Clinic || ''} remindersEnabled={!editing} />;
}

const policyPageTypes = { 'Privacy Notice': 'privacy', 'Accessibility Statement': 'accessibility' };
const adminPageOptions = [...new Set([...Object.values(infoPages), ...Object.keys(policyPageTypes)])];
// These pages are reference information; only Finance-authorized fee values can be edited.
const readOnlyInfoPages = new Set(['Admission Requirements', 'Alternative Payment', 'Estimated Tuition Fee', 'College Programs', 'SHS Programs']);

const imageSrc = item => typeof item.image === 'string' ? item.image : item.image?.url || '';

/** Keep internal website navigation inside the selected Admin preview mode. */
function handlePreviewNavigation(event, editing, navigate) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.('a[href]');
  if (!link || link.closest('.adm-preview-toolbar, .adm-modal-backdrop') || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return; // External news and school systems stay external.
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  if (pathname.startsWith('/admin/')) return; // Admin toolbar links keep their original behavior.
  const mode = editing ? '/admin/view-admin' : '/admin/view-user';
  const name = infoPages[pathname] || (pathname === '/privacy' ? 'Privacy Notice' : pathname === '/accessibility' ? 'Accessibility Statement' : null);
  const destination = pathname === '/' ? mode : name
    ? `${mode}?page=${encodeURIComponent(name)}`
    : `${mode}?path=${encodeURIComponent(pathname)}`;
  event.preventDefault();
  event.stopPropagation();
  navigate(destination);
  window.scrollTo(0, 0);
}

/** Pages not implemented in the prototype must not eject the editor to public view. */
function AdminUnavailablePreview({ editing, path, site, nav }) {
  const navigate = useNavigate();
  const mode = editing ? '/admin/view-admin' : '/admin/view-user';
  return <div className="adm-public-view" onClickCapture={event => handlePreviewNavigation(event, editing, navigate)}>
    <div className="adm-preview-toolbar"><Link to={mode}><ArrowLeft size={16}/> Back to homepage preview</Link><strong className="adm-mode-label">{editing ? <><ShieldCheck size={16}/> Admin editing mode</> : <><Eye size={16}/> Visitor preview</>}</strong><Link className="adm-mode-switch" to={`${editing ? '/admin/view-user' : '/admin/view-admin'}?path=${encodeURIComponent(path)}`}>{editing ? <Eye size={16}/> : <Pencil size={16}/>} {editing ? 'View as visitor' : 'Enable editing'}</Link></div>
    <Header site={site.data} navigation={nav.data}/>
    <main id="main" className="adm-info-hidden"><h2>Page not available</h2><p>This page has not yet been added to the Admin prototype.</p><Link to={mode}>Return to homepage preview</Link></main>
    <Footer site={site.data} navigation={nav.data}/>
    <AdminClinicPreview editing={editing}/>
  </div>;
}


/** Keep the original Figma card components and hydrate only author-approved prototype overrides. */
function EditableCards({ kind, state, onEdit, onDelete, showTools = true }) {
  const { posts, hiddenPreviews } = useAdmin();
  const toCard = p => kind === 'news'
    ? { id:p.id, title:p.title, category:p.category, summary:p.description, publishedOn:p.date, image: p.image ? {url:p.image, alt:p.title} : null, url:p.url }
    : { id:p.id, title:p.title, category:p.category, summary:p.description, postedOn:p.date, image:p.image ? {url:p.image,alt:p.title} : null, url:p.url, prototypeOnly:p.prototypeOnly === true };
  const renderCard = (item, index) => <div className="adm-card-edit" key={item.id}>
    {kind === 'news' ? <NewsCarouselCard article={item}/> : <PulseCard post={item}/>}
    {showTools && <div className="adm-card-tools" role="group" aria-label={`Admin tools for ${item.title}`}><button className="adm-card-tool-edit" type="button" aria-label={`Edit ${item.title}`} title="Edit this card" onClick={()=>onEdit(kind,item)}><Pencil size={15}/><span>Edit</span></button><button className="adm-card-tool-delete" type="button" aria-label={`Delete ${item.title}`} title="Remove this card" onClick={()=>onDelete(kind,item)}><Trash2 size={15}/><span>Delete</span></button></div>}
    {kind === 'pulse' && item.url && <a className="adm-original-link" href={item.url} target="_blank" rel="noopener noreferrer">Open original ↗</a>}
  </div>;
  return kind === 'news'
    ? <section className="news-section idsc-news-section" aria-labelledby="news-title"><div className="news-section__heading"><div><SectionLabel>News</SectionLabel><h2 id="news-title" className="section-title">What’s happening at IDSC:</h2></div><TextLink systemId="news">View all notices</TextLink></div><AsyncContent state={state} isEmpty={d=>!d.items?.length && !posts.some(p=>p.kind==='news' && p.status==='Published')} emptyMessage="No news available.">{d=>{
      const items = (d.items || []).filter(a=>!hiddenPreviews.includes(a.id)).map(a=>{
        const patch=posts.find(p=>p.id===a.id && p.kind===kind && p.status==='Published');
        return patch ? { ...a, ...toCard(patch), image: patch.image ? {url:patch.image,alt:patch.title}:a.image } : a;
      });
      const added = posts.filter(p=>p.kind===kind && p.status==='Published' && !items.some(a=>a.id===p.id) && !hiddenPreviews.includes(p.id)).map(toCard);
      const newest = [...added,...items].sort((a,b) => (b.publishedOn||'').localeCompare(a.publishedOn||'')).slice(0,12);
      return <NewsCarousel items={newest} renderCard={renderCard}/>;
    }}</AsyncContent></section>
    : <div className="pulse"><AsyncContent state={state} isEmpty={d=>!d.items?.length && !posts.some(p=>p.kind==='pulse' && p.status==='Published')} emptyMessage="No IDSC Pulse posts available.">{d=>{
      const items = (d.items || []).filter(a=>!hiddenPreviews.includes(a.id)).map(a=>{
        const patch=posts.find(p=>p.id===a.id && p.kind===kind && p.status==='Published');
        return patch ? { ...a, ...toCard(patch), image:patch.image?{url:patch.image,alt:patch.title}:a.image } : a;
      });
      const added = posts.filter(p=>p.kind===kind && p.status==='Published' && p.id.startsWith('local-') && !hiddenPreviews.includes(p.id)).map(toCard);
      const pulseItems = [...added,...items].sort((a,b)=>(b.postedOn||'').localeCompare(a.postedOn||''));
      const adminTools = showTools ? item => <div className="adm-card-tools" role="group" aria-label={`Admin tools for ${item.title}`}><button className="adm-card-tool-edit" type="button" title="Edit Pulse post" aria-label={`Edit ${item.title}`} onClick={()=>onEdit(kind,item)}><Pencil size={15}/><span>Edit</span></button><button className="adm-card-tool-delete" type="button" title="Delete Pulse preview" aria-label={`Delete ${item.title}`} onClick={()=>onDelete(kind,item)}><Trash2 size={15}/><span>Delete</span></button></div> : undefined;
      return <PulseShowcase label={d.heading?.label || 'IDSC Pulse'} title={d.heading?.title || 'Latest IDSC Blog'} items={pulseItems} renderTools={adminTools}/>;
    }}</AsyncContent></div>;
}

/** Edit the actual public information-page layout without modifying public API content. */
function AdminInformationPreview({ editing, name, site, nav }) {
  const { pages, clearPageDescription, tuitionOverrides } = useAdmin();
  const [editOpen, setEditOpen] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const navigate = useNavigate();
  const activeName = infoPages[pagePath(name)] ? name : 'Admission Requirements';
  const hidden = false;
  const query = `?page=${encodeURIComponent(activeName)}`;
  return <div className="adm-public-view" onClickCapture={event => handlePreviewNavigation(event, editing, navigate)}>
    <div className="adm-preview-toolbar"><Link to="/admin/pages"><ArrowLeft size={16}/> Page Management</Link><strong className="adm-mode-label">{editing ? <><ShieldCheck size={16}/> Admin editing mode</> : <><Eye size={16}/> Visitor preview</>}</strong><Link className="adm-mode-switch" to={`${editing?'/admin/view-user':'/admin/view-admin'}${query}`}>{editing ? <Eye size={16}/> : <Pencil size={16}/>} {editing?'View as visitor':'Enable editing'}</Link></div>
    <Header site={site.data} navigation={nav.data}/>
    <div className="adm-info-preview-region">
      {editing && !readOnlyInfoPages.has(activeName) && <div className="adm-overlay-tools" role="toolbar" aria-label={`${activeName} page tools`}><label className="adm-info-page-switch adm-info-page-switch--overlay"><Settings2 size={14}/><span className="adm-sr-only">Choose page</span><select aria-label="Choose website page to preview" value={activeName} onChange={e=>navigate(`/admin/view-admin?page=${encodeURIComponent(e.target.value)}`)}>{adminPageOptions.map(value=><option key={value} value={value}>{value}</option>)}</select></label><button className="adm-overlay-action" type="button" onClick={()=>setEditOpen(true)} aria-label="Edit page description"><Pencil size={15}/><span>Edit</span></button><button className="adm-overlay-action adm-overlay-remove" type="button" onClick={()=>setConfirmRemove(true)} aria-label="Clear page description"><Trash2 size={15}/><span>Clear text</span></button></div>}
      {editing && activeName === 'Estimated Tuition Fee' && <div className="adm-overlay-tools" role="toolbar" aria-label="Tuition fee tools"><button className="adm-overlay-action adm-overlay-add" type="button" onClick={()=>setFeeOpen(true)} aria-label="Edit school fees"><Settings2 size={15}/><span>Edit Fees</span></button></div>}
      {hidden ? <div className="adm-info-hidden"><h2>Page removed from prototype preview</h2><p>{editing?'Select Add to restore this page.':'This page is temporarily unavailable in the prototype.'}</p></div> : <InformationPage name={activeName} override={pages[activeName]} tuitionOverrides={tuitionOverrides}/>}
    </div>
    <Footer site={site.data} navigation={nav.data}/>
    <AdminClinicPreview editing={editing}/>
    {editing && (!readOnlyInfoPages.has(activeName) || activeName === 'Estimated Tuition Fee') && <div className="adm-preview-footnote">Changes are saved through the Admin API and reflected on supported public pages.</div>}
    {editing && !readOnlyInfoPages.has(activeName) && editOpen && <InlineEditor kind="page" record={{name:activeName}} onClose={()=>setEditOpen(false)}/>} 
    {editing && !readOnlyInfoPages.has(activeName) && confirmRemove && <div className="adm-modal-backdrop" onMouseDown={()=>setConfirmRemove(false)}><div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-info-remove-title" onMouseDown={e=>e.stopPropagation()}><h2 id="adm-info-remove-title">Clear {activeName} description?</h2><p>Only the editable page description will be cleared in this prototype. The page, image, and fee data remain in place. This action is recorded in Recent History.</p><div className="adm-modal-actions"><button type="button" className="adm-button adm-button--secondary" onClick={()=>setConfirmRemove(false)}>Cancel</button><button type="button" className="adm-button adm-button--danger" onClick={()=>{clearPageDescription(activeName);setConfirmRemove(false)}}>Clear description</button></div></div></div>}
  </div>;
}

/** Policy pages use the same preserved Admin/Visitor mode as information pages. */
function AdminPolicyPreview({ editing, name, site, nav }) {
  const { pages } = useAdmin();
  const navigate = useNavigate();
  const policyType = policyPageTypes[name];
  const hidden = false;
  const query = `?page=${encodeURIComponent(name)}`;
  return <div className="adm-public-view" onClickCapture={event => handlePreviewNavigation(event, editing, navigate)}>
    <div className="adm-preview-toolbar"><Link to="/admin/pages"><ArrowLeft size={16}/> Page Management</Link><strong className="adm-mode-label">{editing ? <><ShieldCheck size={16}/> Admin editing mode</> : <><Eye size={16}/> Visitor preview</>}</strong><Link className="adm-mode-switch" to={`${editing?'/admin/view-user':'/admin/view-admin'}${query}`}>{editing ? <Eye size={16}/> : <Pencil size={16}/>} {editing?'View as visitor':'Enable editing'}</Link></div>
    <Header site={site.data} navigation={nav.data}/>
    <div className="adm-info-preview-region">

      {hidden ? <div className="adm-info-hidden"><h2>Page removed from prototype preview</h2><p>{editing?'Select Add to restore this page.':'This page is temporarily unavailable in the prototype.'}</p></div> : <PolicyPage type={policyType} override={pages[name]}/>}
    </div>
    <Footer site={site.data} navigation={nav.data}/>
    <AdminClinicPreview editing={editing}/>

  </div>;
}

/** Page preview does not increment Site Visitor. All editor overlays remain on the Landing Page. */
export default function AdminView({ editing=false }) {
  const news=useApi(api.getNews), hero=useApi(api.getHero), pulse=useApi(api.getPulse), enrollment=useApi(api.getEnrollment), stats=useApi(api.getStatistics);
  const site=useApi(api.getSite), nav=useApi(api.getNavigation);
  const [pageQuery] = useSearchParams();
  const requestedPage = pageQuery.get('page');
  const requestedPath = pageQuery.get('path');
  const navigate = useNavigate();
  const {posts,hiddenPreviews,featuredPostId,hidePreview,hiddenHeroIds,hideHero,seedPublicPosts,enrollmentEdit,enrollmentHidden,removeEnrollment,ctaEdit}=useAdmin();
  useEffect(() => { if (news.data?.items) seedPublicPosts('news',news.data.items); },[news.data]);
  useEffect(() => { if (pulse.data?.items) seedPublicPosts('pulse',pulse.data.items); },[pulse.data]);
  const [editor,setEditor]=useState(null), [deleting,setDeleting]=useState(null), [removeEnrollmentConfirm,setRemoveEnrollmentConfirm]=useState(false);
  const [activeHero,setActiveHero]=useState(null);
  const editPost=(kind,item)=>setEditor({kind,record:{id:item.id,title:item.title,description:item.summary||'',category:item.category||'',date:item.publishedOn||item.postedOn||'',url:item.url||'',image:imageSrc(item),prototypeOnly:item.prototypeOnly === true}});
  const apiHero = enrollment.data?.hero || {};
  const effectiveHero = { ...apiHero, ...(enrollmentEdit || {}) };
  const enrollmentState = enrollment.data ? { ...enrollment, data: { ...enrollment.data, hero: effectiveHero } } : enrollment;
  const editEnrollment = () => setEditor({ kind: 'enrollment', record: effectiveHero });
  const effectiveCta = enrollment.data ? { ...enrollment.data, ...(ctaEdit || {}), callToAction: { ...enrollment.data.callToAction, ...(ctaEdit?.callToAction || {}) }, support: { ...enrollment.data.support, ...(ctaEdit?.support || {}) } } : null;
  const ctaState = effectiveCta ? { ...enrollment, data: effectiveCta } : enrollment;
  const toHero = p => ({ id:p.id, title:p.title, summary:p.description, publishedOn:p.date, image:p.image ? {url:p.image,alt:p.title} : null, url:p.url, featured:p.id===featuredPostId });
  const rawStories = hero.data?.items || [];
  // Homepage posts are independent from Vox News cards. Existing API news
  // remains as starter slides, but editing it creates a Hero-only override.
  const heroPosts = posts.filter(p=>p.kind==='hero' && p.status==='Published');
  const heroStories = [
    ...heroPosts.filter(p=>!rawStories.some(article=>article.id===p.id)).map(toHero),
    ...rawStories.map(article=>{
      const patch=heroPosts.find(p=>p.id===article.id);
      return patch ? {...article, ...toHero(patch), image:patch.image ? {url:patch.image,alt:patch.title} : article.image} : article;
    }),
  ].filter(article=>!hiddenHeroIds.includes(article.id));
  heroStories.sort((a,b)=>Number(b.id===featuredPostId)-Number(a.id===featuredPostId) || Number(Boolean(b.featured))-Number(Boolean(a.featured)));
  // Homepage carousel shows at most four slides (including initial public API stories).
  heroStories.splice(4);
  const selectedHero = heroStories.find(a=>a.id===activeHero?.id) || heroStories[0];
  const sections=[
    ['Homepage',<NewsHero state={hero} articles={heroStories} onActiveChange={setActiveHero}/>],
    ["What's Happening", <EditableCards kind="news" state={news} onEdit={editing?editPost:undefined} onDelete={editing?(kind,item)=>setDeleting({...item,kind}):undefined} showTools={editing}/>],
    ['Enrollment', enrollmentHidden ? (editing ? <div className="adm-enrollment-removed"><strong>Enrollment section removed</strong><p>Visitors do not see this section in this prototype. Use Add to restore and edit it.</p></div> : null) : <EnrollmentSection state={enrollmentState}/>],
    ['IDSC Pulse',<EditableCards kind="pulse" state={pulse} onEdit={editing?editPost:undefined} onDelete={editing?(kind,item)=>setDeleting({...item,kind}):undefined} showTools={editing}/>],
    ['Statistics',<StatisticsSection state={stats}/>],
    ['Enrollment CTA',<CtaSection state={ctaState}/>],
  ];
  function editSection(name) {
    if (name==='IDSC Pulse' || name==="What's Happening" || name==='Homepage') {
      const kind=name==='Homepage'?'hero':name==='IDSC Pulse'?'pulse':'news';
      if(name==='Homepage' && selectedHero) { editPost('hero', selectedHero); return; }
      setEditor({kind,record:null});
    } else if (name === 'Enrollment') { editEnrollment(); }
    else if (name === 'Enrollment CTA') { if(effectiveCta) setEditor({kind:'cta',record:effectiveCta}); }
    else setEditor({kind:'page',record:{name:'Home Page'}});
  }
  if (requestedPage && policyPageTypes[requestedPage]) return <AdminPolicyPreview editing={editing} name={requestedPage} site={site} nav={nav}/>;
  if (requestedPage && pagePath(requestedPage) !== "/") return <AdminInformationPreview editing={editing} name={requestedPage} site={site} nav={nav}/>;
  if (requestedPath) return <AdminUnavailablePreview editing={editing} path={requestedPath} site={site} nav={nav}/>;
  return <div className="adm-public-view" onClickCapture={event => handlePreviewNavigation(event, editing, navigate)}><div className="adm-preview-toolbar"><Link to="/admin/dashboard"><ArrowLeft size={17}/> Dashboard</Link><strong className="adm-mode-label">{editing?<><ShieldCheck size={16}/> Admin editing mode</>:<><Eye size={16}/> Visitor preview</>}</strong><Link className="adm-mode-switch" to={editing?'/admin/view-user':'/admin/view-admin'}>{editing?<Eye size={17}/>:<Pencil size={17}/>} {editing?'View as visitor':'Enable editing'}</Link></div>
    <Header site={site.data} navigation={nav.data}/><div className="adm-public-sections">{sections.map(([name,section])=><div className="adm-edit-region" key={name}>{editing && name !== 'Statistics' && <div className="adm-overlay-tools" role="toolbar" aria-label={`${name} admin tools`}><span className="adm-overlay-title"><Settings2 size={14}/>{name}</span>{name === 'Enrollment' ? <>{enrollmentHidden ? <button className="adm-overlay-action adm-overlay-add" type="button" onClick={editEnrollment} aria-label="Add enrollment section"><Plus size={16}/><span>Add</span></button> : <><button className="adm-overlay-action" type="button" onClick={editEnrollment} aria-label="Edit enrollment section"><Pencil size={15}/><span>Edit</span></button><button className="adm-overlay-action adm-overlay-remove" type="button" onClick={()=>setRemoveEnrollmentConfirm(true)} aria-label="Remove enrollment section"><Trash2 size={15}/><span>Remove</span></button></>}</> : <>{name !== 'IDSC Pulse' && <button className="adm-overlay-action" type="button" onClick={()=>editSection(name)} aria-label={`Edit ${name}`} title={`Edit ${name} on this page`}><Pencil size={15}/><span>Edit</span></button>}{(name==='IDSC Pulse'||name==="What's Happening"||name==='Homepage') && <button className="adm-overlay-action adm-overlay-add" type="button" onClick={()=>setEditor({kind:name==='Homepage'?'hero':name==='IDSC Pulse'?'pulse':'news',record:null})} aria-label={`Add ${name} post`} title={`Add ${name} post here`}><Plus size={16}/><span>Add</span></button>}{name==='Homepage' && selectedHero && <button className="adm-overlay-action adm-overlay-remove" type="button" onClick={()=>setDeleting({...selectedHero,heroOnly:true})} aria-label="Remove current featured story" title="Remove current featured story"><Trash2 size={15}/><span>Remove</span></button>}</>}</div>}{section}</div>)}</div>
    <Footer site={site.data} navigation={nav.data}/>
    <AdminClinicPreview editing={editing}/>
    {editing && <div className="adm-preview-footnote">Admin tools edit prototype content in place; the live API and public website stay unchanged until secure CMS publishing is implemented.</div>}
    {editing && editor && <InlineEditor kind={editor.kind} record={editor.record} onClose={()=>setEditor(null)}/>}
    {editing && removeEnrollmentConfirm && <div className="adm-modal-backdrop" onMouseDown={()=>setRemoveEnrollmentConfirm(false)}><div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-remove-enrollment" onMouseDown={e=>e.stopPropagation()}><h2 id="adm-remove-enrollment">Remove enrollment section?</h2><p>The enrollment block will disappear from View Page User in this prototype. This does not delete the original backend data. You can restore the section using Add.</p><div className="adm-modal-actions"><button className="adm-button adm-button--secondary" type="button" onClick={()=>setRemoveEnrollmentConfirm(false)}>Cancel</button><button className="adm-button adm-button--danger" type="button" onClick={()=>{removeEnrollment();setRemoveEnrollmentConfirm(false)}}>Remove section</button></div></div></div>}
    {editing && deleting && <div className="adm-modal-backdrop" onMouseDown={()=>setDeleting(null)}><div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-delete-preview" onMouseDown={e=>e.stopPropagation()}><h2 id="adm-delete-preview">Delete this preview?</h2><h3>{deleting.title}</h3><p>This hides the preview in Admin View for this session. It does not delete the original external article or modify the running public API.</p><div className="adm-modal-actions"><button className="adm-button adm-button--secondary" onClick={()=>setDeleting(null)}>Cancel</button><button className="adm-button adm-button--danger" onClick={()=>{if (deleting.heroOnly) hideHero(deleting.id,deleting.title); else hidePreview(deleting.id,deleting.title); setDeleting(null)}}>Delete preview</button></div></div></div>}
  </div>;
}
export function AdminHistory(){const {history}=useAdmin();return <><div className="adm-pageheading"><div><h1>Recent History</h1><p>Published, edited and deleted website content recorded by the backend.</p></div></div><div className="adm-panel"><div className="adm-history-list">{history.length?history.map(h=><div className="adm-history-row" key={h.id}><span className="adm-history-text"><b>{h.type}: {h.target}</b><small>{h.when}</small></span></div>):<p className="adm-empty-inline">No changes yet. Try editing a post or page in the prototype.</p>}</div></div></>}
