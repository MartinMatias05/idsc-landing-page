import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, Image as ImageIcon, Eye, Pencil, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../state/AdminStore';
import { PageHeading, Panel, Status, ActionButton } from '../components/AdminShell';
export function AdminPages() {
 const {pageNames}=useAdmin();return <><PageHeading title="Page Management" subtitle="Edit website content while protecting the public layout, typography and spacing."/>
 <div className="adm-note adm-note-green"><b>Public layouts are protected.</b> Content-only updates do not change the approved Figma structure.</div>
 <Panel title="Managed pages"><div className="adm-scroll"><table className="adm-table"><thead><tr><th>Page</th><th>Content status</th><th>Actions</th></tr></thead><tbody>{pageNames.map((name,i)=><tr key={name}><td><div className="adm-pagecell"><FileText size={20}/><b>{name}</b></div></td><td><Status>{i===0?'Editable':'Planned'}</Status></td><td><div className="adm-row-actions"><Link className="adm-mini-button" to={`/admin/pages/edit/${i}`}>Edit</Link><Link className="adm-mini-button neutral" to="/admin/view-user">Preview</Link></div></td></tr>)}</tbody></table></div></Panel></>;
}
export function AdminPageEditor(){
 const {index}=useParams();const {pageNames,pages,savePage}=useAdmin();const name=pageNames[Number(index)];const navigate=useNavigate();const [draft,setDraft]=useState(()=>pages[name]||{title:name,description:'',image:''});const [saved,setSaved]=useState(false);
 useEffect(()=>{setDraft(pages[name]||{title:name||'',description:'',image:''});setSaved(false)},[name]);
 if(!name)return <p>Page not found.</p>;
 const update=(key,val)=>setDraft(prev=>({...prev,[key]:val}));
 return <><PageHeading title="Page Editor" subtitle={`Editing: ${name}`} actions={<Link className="adm-button adm-button--secondary" to="/admin/pages">Back to pages</Link>}/>
 <div className="adm-note adm-note-green">Only text, approved images, and content values may change. The public design remains locked.</div>
 <div className="adm-editor-grid"><Panel title="Page content"><div className="adm-form"><label>Page title<input value={draft.title} onChange={e=>update('title',e.target.value)}/></label><label>Content summary<textarea rows="6" value={draft.description} onChange={e=>update('description',e.target.value)} placeholder="Enter approved public page content"/></label><label>Image URL<input value={draft.image} onChange={e=>update('image',e.target.value)} placeholder="/assets/..."/></label><div className="adm-form-actions"><ActionButton kind="secondary" onClick={()=>navigate('/admin/pages')}>Cancel</ActionButton><ActionButton onClick={()=>{savePage(name,draft);setSaved(true)}}>Save changes</ActionButton></div>{saved&&<p role="status" className="adm-success">Page changes saved in this prototype session.</p>}</div></Panel>
 <Panel title="Page preview"><div className="adm-page-preview"><span className="adm-preview-category">IDSC WEBSITE</span><h2>{draft.title}</h2><p>{draft.description||'Content preview will appear here. Existing page components remain unchanged.'}</p>{draft.image?<img src={draft.image} alt="Page content"/>:<div className="adm-image-empty"><ImageIcon size={35}/></div>}</div><Link to="/admin/view-admin" className="adm-green-link">View Page Admin <ArrowUpRight size={15}/></Link></Panel></div>
 </>;
}
