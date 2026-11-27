import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Search, Image as ImageIcon, ExternalLink } from 'lucide-react';
import ImageSourceFields from '../components/ImageSourceFields';
import { useAdmin } from '../state/AdminStore';
import { PageHeading, Panel, Status, ActionButton } from '../components/AdminShell';
import { pulseArticleUrl } from '../../lib/pulseArticleUrl';

function validArticle(url,kind) {
 if (kind === 'pulse') return Boolean(pulseArticleUrl(url));
 try { const u = new URL(url); return u.protocol === 'https:' && (kind === 'hero' ? (u.pathname !== '/' || Boolean(u.search)) : u.hostname === 'voxtemplari.idsc.edu.ph'); } catch {return false;}
}
export function AdminPosts() {
 const {posts,removePost}=useAdmin(); const [params,setParams]=useSearchParams();const kind=['news','pulse','hero'].includes(params.get('kind'))?params.get('kind'):'news';
 const [search,setSearch]=useState('');const [status,setStatus]=useState('All statuses');const [deleting,setDeleting]=useState(null);
 const matches=posts.filter(p=>p.kind===kind && p.title.toLowerCase().includes(search.toLowerCase()) && (status==='All statuses'||p.status===status));
 return <><PageHeading title="Posts" subtitle="Manage News, IDSC Pulse and Homepage content without changing the public layout." actions={<Link className="adm-button adm-button--primary" to={`/admin/posts/new?kind=${kind}`}><Plus size={17}/> New post</Link>}/>
 <div className="adm-tabbar"><button className={kind==='news'?'selected':''} onClick={()=>setParams({kind:'news'})}>News · {posts.filter(p=>p.kind==='news').length}</button><button className={kind==='pulse'?'selected':''} onClick={()=>setParams({kind:'pulse'})}>IDSC Pulse · {posts.filter(p=>p.kind==='pulse').length}</button><button className={kind==='hero'?'selected':''} onClick={()=>setParams({kind:'hero'})}>Homepage · {posts.filter(p=>p.kind==='hero' && p.status==='Published').length}/4</button></div>
 <Panel title="" className="adm-table-panel"><div className="adm-filters"><label>Search posts<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title…"/></label><label>Show<select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option></select></label></div>
 <div className="adm-scroll"><table className="adm-table"><thead><tr><th>Post title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{matches.map(p=><tr key={p.id}><td><div className="adm-title-cell"><div className="adm-thumb">{p.image?<img src={p.image} alt=""/>:<ImageIcon size={21}/>}</div><span><b>{p.title}</b><small>{p.category}</small></span></div></td><td>{p.date}</td><td><Status>{p.status}</Status></td><td><div className="adm-row-actions"><Link className="adm-mini-button" to={`/admin/posts/edit/${p.id}?kind=${p.kind}`}>Edit</Link><button className="adm-mini-button danger" onClick={()=>setDeleting(p)}>Delete</button></div></td></tr>)}</tbody></table>{matches.length===0&&<p className="adm-empty-inline">No matching posts</p>}</div><p className="adm-count">Showing {matches.length} of {posts.filter(p=>p.kind===kind).length} posts</p></Panel>
 <div className="adm-note adm-note-green"><b>Homepage is independent from Vox News</b><p>News requires its official article URL; IDSC Pulse accepts its deployed HTTPS site or article link. Homepage supports up to 4 published featured posts. Each published post needs a valid HTTPS destination URL. A direct HTTPS cover-image URL or an uploaded image is required for News and Pulse posts. Homepage images remain optional.</p></div>
 {deleting && <div className="adm-modal-backdrop" role="presentation" onMouseDown={()=>setDeleting(null)}><div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-delete-title" onMouseDown={e=>e.stopPropagation()}><h2 id="adm-delete-title">Delete this post?</h2><h3>{deleting.title}</h3><p>This removes the preview from the public website after the Admin API saves the change. The original external article is not deleted.</p><div className="adm-modal-actions"><ActionButton kind="secondary" onClick={()=>setDeleting(null)}>Cancel</ActionButton><ActionButton kind="danger" onClick={()=>{removePost(deleting.id,deleting.kind);setDeleting(null)}}>Delete post</ActionButton></div></div></div>}
 </>;
}
const empty=(kind)=>({kind, title:'',description:'',category:'',date:new Date().toISOString().slice(0,10),url:'',image:'',status:'Draft'});
export function AdminPostEditor() {
 const { id }=useParams();const [params]=useSearchParams();const { posts,savePost }=useAdmin();const navigate=useNavigate();
 const existing=posts.find(p=>p.id===id && (!params.get('kind') || p.kind===params.get('kind')));const [draft,setDraft]=useState(()=>existing||empty(['news','pulse','hero'].includes(params.get('kind'))?params.get('kind'):'news'));
 const [error,setError]=useState('');const [saved,setSaved]=useState('');
 const draftIdRef=useRef(existing?.id || `local-${crypto.randomUUID()}`); const submitLock=useRef(false);
 useEffect(()=>{setDraft(existing||empty(['news','pulse','hero'].includes(params.get('kind'))?params.get('kind'):'news'));setSaved('');setError('');submitLock.current=false;draftIdRef.current=existing?.id || `local-${crypto.randomUUID()}`},[id,params.get('kind')]);
 const update=(key,value)=>setDraft(prev=>({...prev,[key]:value}));
 function submit(mode) {
   if (mode === 'publish' && draft.kind === 'hero' && posts.filter(p => p.kind === 'hero' && p.status === 'Published' && p.id !== draft.id).length >= 4) {
     setError('Homepage allows a maximum of 4 published stories.'); return;
   }
   if (!draft.title.trim() || !draft.category.trim() || !draft.description.trim() || !draft.date) {
     setError('Enter a title, category, short description and publication date.'); return;
   }
   if ((mode === 'publish' || draft.kind !== 'hero') && !validArticle(draft.url,draft.kind)) {
     setError('Enter a valid HTTPS link for the selected publication. IDSC Pulse can use its Netlify, Vercel, or other HTTPS deployment URL.'); return;
   }
   if (mode === 'publish' && draft.kind === 'news' && !(/^https:\/\//i.test(draft.image || '') || (draft.image || '').startsWith('data:image/'))) {
     setError('Provide a direct HTTPS cover image URL or upload a JPG, PNG, or WebP image before publishing.'); return;
   }
   if (mode === 'publish' && draft.kind === 'pulse' && !(/^(https:\/\/)/i.test(draft.image || '') || (draft.image || '').startsWith('data:image/'))) {setError('Provide an HTTPS image URL or upload a cover image for IDSC Pulse.');return;}
   if (submitLock.current) return;
   submitLock.current=true;
   const savedId=savePost({...draft,id:draftIdRef.current,prototypeOnly:false},mode);
   if(savedId===null){submitLock.current=false;setError('Cannot publish because the Homepage carousel is full.');return;}
   setDraft(prev=>({...prev,id:savedId}));setError('');setSaved(mode==='publish'?'Post published.':'Draft saved');
 }


 return <><PageHeading title={existing?'Edit post':'New Post'} subtitle="Add a direct published article URL and manage its preview card." actions={<Link to={`/admin/posts?kind=${draft.kind}`} className="adm-button adm-button--secondary">Back to posts</Link>}/>
 {saved ? <Panel title={saved}><p className="adm-form-copy">{saved==='Draft saved'?'Your draft remains private and is queued for server persistence.':'The post is published through the backend. Wait for the save confirmation before refreshing.'}</p><div className="adm-row-actions"><ActionButton kind="secondary" onClick={()=>{submitLock.current=false;setSaved('')}}>Continue editing</ActionButton><ActionButton onClick={()=>navigate(`/admin/posts?kind=${draft.kind}`)}>Back to posts</ActionButton></div></Panel> : <div className="adm-editor-grid"><Panel title="Post details"><div className="adm-form">
 <label>Publication<select value={draft.kind} onChange={e=>update('kind',e.target.value)}><option value="news">News</option><option value="pulse">IDSC Pulse</option><option value="hero">Homepage</option></select></label>
 <label>{draft.kind==='hero' ? 'Published article URL (required to publish)' : 'Exact published article URL'}<input value={draft.url} onChange={e=>update('url',e.target.value)} placeholder={draft.kind==='hero'?'https://publisher.example/story':draft.kind==='news'?'https://voxtemplari.idsc.edu.ph/article...':'https://idscpulse.netlify.app/'}/></label>
 <p className="adm-hint">{draft.kind==='hero' ? 'Homepage is independent of Vox Templari. Paste the exact published article URL from any HTTPS website. An image is optional for Homepage stories.' : 'Use the exact published article URL. An article link can point to the current Netlify/Vercel deployment. For IDSC Pulse, choose an HTTPS image URL or upload a cover image.'}</p>
 <label>Post title<input value={draft.title} onChange={e=>update('title',e.target.value)} placeholder="Enter article title"/></label><label>Category<input value={draft.category} onChange={e=>update('category',e.target.value)} placeholder="e.g. Campus news"/></label>
 <label>Description<textarea rows="4" value={draft.description} onChange={e=>update('description',e.target.value)} placeholder="Write a short preview description"/></label>
 <label>Published date<input type="date" value={draft.date} onChange={e=>update('date',e.target.value)}/></label>
 <ImageSourceFields uploadOnly={false} required={draft.kind === 'news' || draft.kind === 'pulse'} image={draft.image} onChange={value => update('image',value)} />
 {error&&<p className="adm-error" role="alert">{error}</p>}<div className="adm-form-actions"><ActionButton kind="secondary" onClick={()=>submit('draft')}>Save draft</ActionButton><ActionButton onClick={()=>submit('publish')}>Publish</ActionButton></div></div></Panel>
 <Panel title="Live card preview" className="adm-preview-panel"><div className="adm-post-preview">{draft.image?<img className="adm-post-preview-img" src={draft.image} alt="Selected preview"/>:<div className="adm-post-preview-img adm-post-preview-empty"><ImageIcon size={36}/><small>Image not selected</small></div>}<div className="adm-post-preview-body"><b className="adm-preview-category">{draft.category||'Category'}</b><h3>{draft.title||'Article title'}</h3><p>{draft.description||'Preview description appears here.'}</p><div className="adm-card-meta"><span>{draft.date}</span><span>{draft.kind==='hero'?'Homepage':draft.kind==='news'?'News':'IDSC Pulse'}</span></div></div></div>{!!draft.url && validArticle(draft.url,draft.kind)&&<a className="adm-green-link" href={draft.url} target="_blank" rel="noopener noreferrer">Verify original article <ExternalLink size={14}/></a>}</Panel></div>}
 </>;
}
