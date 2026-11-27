import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, ArrowUpRight } from 'lucide-react';
import AdminTuitionEditor from '../components/AdminTuitionEditor';
import { useAdmin } from '../state/AdminStore';
import { PageHeading, Panel, Status, ActionButton } from '../components/AdminShell';
import { pagePath } from '../../pages/InformationPage';
const descriptionLockedPages = new Set(['Admission Requirements', 'Alternative Payment', 'Estimated Tuition Fee', 'College Programs', 'SHS Programs', 'Privacy Notice', 'Accessibility Statement']);
const adminPagePath = name => name === 'Privacy Notice' ? '/privacy' : name === 'Accessibility Statement' ? '/accessibility' : pagePath(name);
export function AdminPages() {
 const {pageNames}=useAdmin();return <><PageHeading title="Page Management" subtitle="Edit website content while protecting the public layout, typography and spacing."/>
 <div className="adm-note adm-note-green"><b>Public layouts are protected.</b> Content-only updates do not change the approved Figma structure.</div>
 <Panel title="Managed pages"><div className="adm-scroll"><table className="adm-table"><thead><tr><th>Page</th><th>Content status</th><th>Actions</th></tr></thead><tbody>{pageNames.map((name,i)=><tr key={name}><td><div className="adm-pagecell"><FileText size={20}/><b>{name}</b></div></td><td><Status>{name === 'Estimated Tuition Fee' ? 'Fees only' : descriptionLockedPages.has(name) ? 'View only' : (adminPagePath(name) !== '/' || i === 0 ? 'Editable' : 'Planned')}</Status></td><td><div className="adm-row-actions">{(!descriptionLockedPages.has(name) || name === 'Estimated Tuition Fee') && <Link className="adm-mini-button" to={`/admin/pages/edit/${i}`}>{name === 'Estimated Tuition Fee' ? 'Edit Fees' : 'Edit'}</Link>}<Link className="adm-mini-button neutral" to={adminPagePath(name) === "/" ? "/admin/view-user" : `/admin/view-user?page=${encodeURIComponent(name)}`}>Preview</Link></div></td></tr>)}</tbody></table></div></Panel></>;
}
export function AdminPageEditor(){
 const {index}=useParams();const {pageNames,pages,savePage}=useAdmin();const name=pageNames[Number(index)];const navigate=useNavigate();const [draft,setDraft]=useState(()=>pages[name]||{title:name,description:'',image:''});const [saved,setSaved]=useState(false);const [feeOpen,setFeeOpen]=useState(false);
 useEffect(()=>{setDraft(pages[name]||{title:name||'',description:'',image:''});setSaved(false)},[name]);
 if(!name)return <p>Page not found.</p>;
 // Prevent opening the description editor by typing its route directly.
 if (descriptionLockedPages.has(name)) return <><PageHeading title={name === 'Estimated Tuition Fee' ? 'School Fee Management' : 'Page Preview'} subtitle={name} actions={<Link className="adm-button adm-button--secondary" to="/admin/pages">Back to pages</Link>}/>
 <div className="adm-note adm-note-green">{name === 'Estimated Tuition Fee' ? 'Finance-approved fee figures may be revised in the prototype. Page descriptions and images are developer-managed.' : 'This page is view-only for Admins. Content and structural changes are handled by the development team.'}</div>
 {name === 'Estimated Tuition Fee' && <div className="adm-form-actions"><button className="adm-button adm-button--primary" type="button" onClick={()=>setFeeOpen(true)}>Edit semester & miscellaneous fees</button></div>}
 <Panel title="Page preview"><Link className="adm-green-link" to={`/admin/view-admin?page=${encodeURIComponent(name)}`}>View Page Admin <ArrowUpRight size={15}/></Link></Panel>
 {feeOpen && name === 'Estimated Tuition Fee' && <AdminTuitionEditor onClose={()=>setFeeOpen(false)}/>}
 </>;
 const update=(key,val)=>setDraft(prev=>({...prev,[key]:val}));
 return <><PageHeading title="Page Editor" subtitle={`Editing: ${name}`} actions={<Link className="adm-button adm-button--secondary" to="/admin/pages">Back to pages</Link>}/>
 <div className="adm-note adm-note-green">Descriptions are editable. Image changes and page deletion are handled by developers. Tuition rates require Finance Office verification.</div>
 {name === 'Estimated Tuition Fee' && <div className="adm-form-actions"><button className="adm-button adm-button--primary" type="button" onClick={()=>setFeeOpen(true)}>Edit semester & miscellaneous fees</button></div>}
 <div className="adm-editor-grid"><Panel title="Page description"><div className="adm-form">
 <p className="adm-hint">Admins may revise descriptive text only. Changing page images or removing entire pages requires a developer.</p>
 {name === 'Home Page' && <label>Home Page title<input value={draft.title} onChange={e=>update('title',e.target.value)}/></label>}
 <label>Page description<textarea rows="6" value={draft.description} onChange={e=>update('description',e.target.value)} placeholder="Enter approved page description"/></label>
 {name === 'Home Page' && <label>Homepage image URL<input value={draft.image} onChange={e=>update('image',e.target.value)} placeholder="/assets/..."/></label>}
 <div className="adm-form-actions"><ActionButton kind="secondary" onClick={()=>navigate('/admin/pages')}>Cancel</ActionButton><ActionButton onClick={()=>{savePage(name,name === 'Home Page' ? draft : {description:draft.description});setSaved(true)}}>Save description</ActionButton></div>
 {saved&&<p role="status" className="adm-success">Description saved to this prototype session and recorded in Recent History.</p>}</div></Panel>
 <Panel title="Page preview"><div className="adm-page-preview"><span className="adm-preview-category">IDSC WEBSITE</span><h2>{name}</h2><p>{draft.description || 'No custom description. The default website content will appear unless the description is cleared.'}</p></div>
 <Link to={adminPagePath(name) === '/' ? '/admin/view-admin' : `/admin/view-admin?page=${encodeURIComponent(name)}`} className="adm-green-link">View Page Admin <ArrowUpRight size={15}/></Link></Panel></div>
 {feeOpen && <AdminTuitionEditor onClose={()=>setFeeOpen(false)}/>}
 </>;
}
