import { createContext, useContext, useMemo, useState, useRef, useEffect } from 'react';
import {adminApi,adminSession} from '../../services/adminApi';

const AdminContext = createContext(null);
const examples = [
  { id: 'n1', kind: 'news', title: 'IDSC declares campus as Zone of Peace', category: 'Campus news', date: '2026-10-24', status: 'Published', description: 'Community update preview', url: '', image: '' },
  { id: 'n2', kind: 'news', title: 'IDSC Tourism Students Join Clean-up Drive in Celebration of World Tourism and Bamboo Days 2026', category: 'Community', date: '2026-09-25', status: 'Draft', description: 'Tourism student activity', url: '', image: '' },
  { id: 'n3', kind: 'news', title: 'IDSC secures 5th in RX Detectives 2026 Regional Quiz Bee', category: 'Achievement', date: '2026-08-12', status: 'Published', description: 'Student achievements', url: '', image: '' },
  { id: 'p1', kind: 'pulse', title: 'Planning your next chapter at IDSC', category: 'Academics', date: '2026-09-22', status: 'Published', description: 'Admissions guide', url: '', image: '' },
  { id: 'p2', kind: 'pulse', title: 'Your first step: pre-registration', category: 'Thoughts', date: '2026-09-15', status: 'Draft', description: 'Pre-registration guide', url: '', image: '' },
  { id: 'p3', kind: 'pulse', title: 'Before you enroll: get the details', category: 'Planning', date: '2026-09-08', status: 'Published', description: 'Enrollment planning', url: '', image: '' },
];
const siteKeys = ['News', 'IDSC Pulse', 'Faculty', 'Registrar', 'Student Portal', 'Library', 'Finance', 'Clinic', 'Inventory'];
const initialLinks = {
  News: 'https://voxtemplari.idsc.edu.ph/',
  'IDSC Pulse': 'https://idscpulse.netlify.app/',
};
const pageNames = ['Home Page','Estimated Tuition Fee','Alternative Payment','Admission Requirements','College Programs','SHS Programs','About IDSC','IDSC Hymn','Vision, Mission & Core Values','Laboratories','Privacy Notice','Accessibility Statement'];

export function AdminProvider({ children }) {
  const [posts, setPosts] = useState(examples);
  const [changeVersion,setChangeVersion]=useState(0);
  const [loadState,setLoadState]=useState('loading');
  const [saveError,setSaveError]=useState('');
  const [syncStatus,setSyncStatus]=useState('');
  const pendingSaves=useRef(Promise.resolve());
  const [hiddenPreviews, setHiddenPreviews] = useState([]);
  const [hiddenHeroIds, setHiddenHeroIds] = useState([]);
  const seededKinds = useRef(new Set());
  const savingIds = useRef(new Map());
  const [history, setHistory] = useState([]);
  const [toast,setToast] = useState(null);
  const toastTimer=useRef(null);
  useEffect(()=>()=>window.clearTimeout(toastTimer.current),[]);
  const [links, setLinks] = useState(initialLinks);
  const [pages, setPages] = useState(() => Object.fromEntries(pageNames.map(name => [name, { title: name, description: '', image: '' }])));
  const [hiddenPages, setHiddenPages] = useState([]);
  const [tuitionOverrides, setTuitionOverrides] = useState({ rows: {}, miscellaneous: {} });
  const [profile, setProfile] = useState({ name: 'Administrator', email: 'admin@idsc.edu.ph' });
  // Temporary overrides shared by View Page User and View Page Admin.
  const [enrollmentEdit, setEnrollmentEdit] = useState(null);
  const [enrollmentHidden, setEnrollmentHidden] = useState(false);
  const [ctaEdit, setCtaEdit] = useState(null);
  const [featuredPostId, setFeaturedPostId] = useState(null);
  const log = (type, target) => {window.clearTimeout(toastTimer.current);setToast({type,target});toastTimer.current=window.setTimeout(()=>setToast(null),10000);setChangeVersion(v=>v+1);setHistory(prev => [{ id: Date.now() + Math.random(), type, target, when: new Date().toLocaleString() }, ...prev]);};
  function savePost(post, mode) {
    const id = post.id || `local-${crypto.randomUUID()}`;
    const key = `${post.kind}:${id}:${mode}`;
    // Debounce identical submissions; later edits to the same post remain allowed.
    if (Date.now() - (savingIds.current.get(key) || 0) < 750) return id;
    savingIds.current.set(key, Date.now());
    const next = { ...post, id, prototypeOnly:false, status: mode === 'publish' ? 'Published' : 'Draft' };
    if (mode === 'publish' && next.kind === 'hero' && posts.filter(p => p.kind === 'hero' && p.status === 'Published' && p.id !== id).length >= 4) { savingIds.current.delete(key); return null; }
    const updated = posts.some(p => p.id === id && p.kind === next.kind)
      ? posts.map(p => p.id === id && p.kind === next.kind ? next : p)
      : [next, ...posts];
    if (mode === 'publish' && next.kind === 'news') {
      const published = updated.filter(p => p.kind === 'news' && p.status === 'Published')
        .sort((a,b) => (b.date || '').localeCompare(a.date || '') || (b.id === id ? 1 : a.id === id ? -1 : 0));
      const excess = published.slice(12);
      if (excess.length) {
        const discarded = new Set(excess.map(p => p.id));
        setPosts(updated.filter(p => !discarded.has(p.id) || p.kind !== 'news'));
        setHiddenPreviews(prev => [...new Set([...prev, ...discarded])]);
        excess.forEach(p => log('Automatically removed oldest News post', p.title));
      } else setPosts(updated);
    } else setPosts(updated);
    if (mode === 'publish' && next.kind === 'hero') {
      setFeaturedPostId(id);
      log('Featured', next.title);
    }
    log(mode === 'publish' ? 'Published' : post.id ? 'Edited' : 'Draft saved', next.title);
    if (next.kind === 'hero') setHiddenHeroIds(prev => prev.filter(existingId => existingId !== id));
    return id;
  }
  function seedPublicPosts(kind, items) {
    if (seededKinds.current.has(kind) || !Array.isArray(items)) return;
    seededKinds.current.add(kind);
    const normalized = items.map(item => ({
      id:item.id, kind, title:item.title, category:item.category || 'General',
      date:item.publishedOn || item.postedOn || '', description:item.summary || '',
      url:item.url || '', image:typeof item.image === 'string' ? item.image : (item.image?.url || ''),
      status:'Published',
    }));
    setPosts(prev => {
      const kept = prev.filter(p => p.kind !== kind || !examples.some(example => example.id === p.id));
      const added = normalized.filter(p => !kept.some(old => old.id === p.id) && !hiddenPreviews.includes(p.id));
      const merged = [...kept, ...added];
      if (kind !== 'news') return merged;
      const newest = merged.filter(p=>p.kind==='news' && p.status==='Published')
        .sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,12);
      const keepIds = new Set(newest.map(p=>p.id));
      return merged.filter(p=>p.kind!=='news' || p.status!=='Published' || keepIds.has(p.id));
    });
  }
  function hideHero(id, title) {
    setHiddenHeroIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setHiddenPreviews(prev => [...new Set([...prev,id])]);
    setFeaturedPostId(prev => prev === id ? null : prev);
    setPosts(prev => prev.filter(post => !(post.id === id && post.kind === 'hero')));
    log('Removed featured story', title);
  }
  function hidePreview(id, title) {
    setHiddenPreviews(prev => prev.includes(id) ? prev : [...prev, id]);
    setPosts(prev => prev.filter(p => p.id !== id));
    setFeaturedPostId(prev => prev === id ? null : prev);
    log('Deleted', title);
  }
  function removePost(id, kind) {
    const post = posts.find(p => p.id === id && (!kind || p.kind === kind));
    if (!post) return;
    setPosts(prev => prev.filter(p => !(p.id === id && p.kind === post.kind)));
    setHiddenPreviews(prev => [...new Set([...prev,id])]);
    if (post.kind === 'hero') setHiddenHeroIds(prev => prev.includes(id) ? prev : [...prev, id]);
    log('Deleted', post.title);
  }
  function savePage(name, data) {
    // Non-Home page images are developer-maintained and cannot be changed here.
    setPages(prev => ({ ...prev, [name]: name === 'Home Page' ? data : {
      ...prev[name], description: data.description || '', descriptionRemoved: false,
    } }));
    log('Edited description', name);
  }
  function clearPageDescription(name) {
    setPages(prev => ({ ...prev, [name]: { ...prev[name], description: '', descriptionRemoved: true } }));
    log('Cleared description', name);
  }
  function saveTuitionRow(courseName, year, values) {
    const fields = ['units','tuition','miscellaneous','laboratory','research'];
    if (!fields.every(field => Number.isFinite(values[field]) && values[field] >= 0)) return false;
    if (!Number.isInteger(values.units) || values.units > 80) return false;
    setTuitionOverrides(prev => ({...prev, rows: {...prev.rows, [`${courseName}::${year}`]: {...values, total: values.tuition + values.miscellaneous + values.laboratory + values.research}} }));
    log('Updated semester fees', `${courseName} — Year ${year}`);
    return true;
  }
  function saveMiscellaneousFee(label, amount) {
    if (!Number.isFinite(amount) || amount < 0) return false;
    setTuitionOverrides(prev => ({...prev, miscellaneous: {...prev.miscellaneous, [label]: amount}}));
    log('Updated miscellaneous fee', label);
    return true;
  }
  function removePage(name) {
    setHiddenPages(prev => prev.includes(name) ? prev : [...prev, name]);
    log('Removed', `${name} page preview`);
  }
  function restorePage(name) {
    setHiddenPages(prev => prev.filter(item => item !== name));
    log('Restored', `${name} page preview`);
  }
  function saveEnrollment(hero) {
    const wasHidden = enrollmentHidden;
    setEnrollmentEdit(hero);
    setEnrollmentHidden(false);
    log(wasHidden ? 'Added' : 'Edited', 'Home Page enrollment section');
  }
  function removeEnrollment() {
    setEnrollmentHidden(true);
    log('Removed', 'Home Page enrollment section');
  }
  function saveCta(value) {
    setCtaEdit(value);
    log('Edited', 'Home Page enrollment CTA');
  }
  function featurePost(id, title) {
    setFeaturedPostId(id);
    log('Featured', title);
  }
  function saveLink(name, url) {
    setLinks(prev => ({ ...prev, [name]: url }));
    log('Edited', `${name} destination`);
  }

  // Load authoritative data before allowing mutations to be saved. This is not browser localStorage.
  useEffect(()=>{
    if(!adminSession.token()){setLoadState('unauthorized');return;}
    let active=true;
    adminApi.getState().then(data=>{
      if(!active)return;
      setPosts(data.posts || []);setHiddenPreviews(data.hiddenPreviews || []);
      setHiddenHeroIds(data.hiddenHeroIds || []);setHistory(data.history || []);
      setLinks({...initialLinks,...(data.links || {})});
      setPages({...Object.fromEntries(pageNames.map(name=>[name,{title:name,description:'',image:''}])),...(data.pages || {})});
      setHiddenPages(data.hiddenPages || []);
      setTuitionOverrides(data.tuitionOverrides || {rows:{},miscellaneous:{}});
      setProfile(data.profile || {name:'Administrator',email:''});
      setEnrollmentEdit(data.enrollmentEdit || null);setEnrollmentHidden(Boolean(data.enrollmentHidden));
      setCtaEdit(data.ctaEdit || null);setFeaturedPostId(data.featuredPostId || null);
      setLoadState('ready');
    }).catch(error=>{if(active){setSaveError(error.message);setLoadState('error')}});
    return()=>{active=false};
  },[]);
  useEffect(()=>{
    if(loadState!=='ready' || changeVersion===0 || !adminSession.token())return;
    const state={posts,hiddenPreviews,hiddenHeroIds,history,links,pages,hiddenPages,tuitionOverrides,profile,enrollmentEdit,enrollmentHidden,ctaEdit,featuredPostId};
    setSyncStatus('Pending save…');
    const timer=setTimeout(()=>{
      setSyncStatus('Saving…');
      pendingSaves.current=pendingSaves.current.catch(()=>{}).then(()=>adminApi.saveState(state));
      pendingSaves.current.then(()=>{setSaveError('');setSyncStatus('Saved to backend')}).catch(error=>{setSyncStatus('Save failed');setSaveError(`Save failed: ${error.message}. Do not refresh until resolved.`)});
    },500);
    return()=>clearTimeout(timer);
  },[changeVersion,posts,hiddenPreviews,hiddenHeroIds,history,links,pages,hiddenPages,tuitionOverrides,profile,enrollmentEdit,enrollmentHidden,ctaEdit,featuredPostId,loadState]);

  const value = useMemo(() => ({posts, hiddenPreviews, hiddenHeroIds, hideHero, seedPublicPosts, history, links, pages, hiddenPages, removePage, restorePage, clearPageDescription, tuitionOverrides, saveTuitionRow, saveMiscellaneousFee, pageNames, siteKeys, profile, setProfile, savePost, hidePreview, removePost, savePage, saveLink, enrollmentEdit, enrollmentHidden, saveEnrollment, removeEnrollment, ctaEdit, saveCta, featuredPostId, featurePost, log}), [posts, hiddenPreviews, hiddenHeroIds, history, links, pages, hiddenPages, tuitionOverrides, profile, enrollmentEdit, enrollmentHidden, ctaEdit, featuredPostId]);
  if(loadState==='loading')return <p role="status" style={{padding:24}}>Loading saved Admin content…</p>;
  if(loadState==='error')return <p role="alert" style={{padding:24}}>Admin content unavailable: {saveError}. No changes will be saved.</p>;
  return <AdminContext.Provider value={value}>{saveError && <div role="alert" style={{position:'fixed',bottom:16,right:16,zIndex:9999,background:'#7f1d1d',color:'white',padding:12,borderRadius:8,maxWidth:440}}>{saveError}</div>}{syncStatus && !saveError && <div role="status" style={{position:'fixed',bottom:12,right:12,zIndex:9998,background:'#143b26',color:'white',padding:'6px 12px',borderRadius:6,fontSize:12}}>{syncStatus}</div>}{toast && <div className="adm-activity-toast" role="status"><strong>{toast.type}</strong><span>{toast.target}</span><button type="button" onClick={()=>{window.clearTimeout(toastTimer.current);setToast(null)}} aria-label="Dismiss notification">×</button></div>}{children}</AdminContext.Provider>;
}
export function useAdmin() { const value = useContext(AdminContext); if (!value) throw new Error('AdminProvider missing'); return value; }
