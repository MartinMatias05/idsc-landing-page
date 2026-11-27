import { useEffect, useState, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import ImageSourceFields from './ImageSourceFields';
import { useAdmin } from '../state/AdminStore';
import { pulseArticleUrl } from '../../lib/pulseArticleUrl';

function validArticle(url,kind) {
  if (kind === 'pulse') return Boolean(pulseArticleUrl(url));
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && (kind === 'hero' ? (u.pathname !== '/' || Boolean(u.search)) : u.hostname === 'voxtemplari.idsc.edu.ph' && u.pathname !== '/');
  } catch { return false; }
}

/** Admin-only editing overlay. Updates the shared prototype store, not the public API. */
export default function InlineEditor({ kind, record, onClose }) {
  const { savePost, savePage, saveEnrollment, saveCta, pages, posts } = useAdmin();
  const enrollmentMode = kind === 'enrollment';
  const ctaMode = kind === 'cta';
  const pageMode = kind === 'page';
  const base = enrollmentMode
    ? { headline: record?.headline || '', description: record?.description || '', statusLabel: record?.statusLabel || '', audience: record?.audience || '', image: record?.image?.url || '' }
    : ctaMode
    ? { label: record?.callToAction?.label || '', headline: record?.callToAction?.headline || '', description: record?.callToAction?.description || '', primaryLabel: record?.callToAction?.actions?.[0]?.label || '', primaryHref: record?.callToAction?.actions?.[0]?.href || '', secondaryLabel: record?.callToAction?.actions?.[1]?.label || '', secondaryHref: record?.callToAction?.actions?.[1]?.href || '', supportTitle: record?.support?.title || '', supportDescription: record?.support?.description || '', supportPhone: record?.support?.phone || '' }
    : pageMode
    ? { title: pages[record.name]?.title || record.name, description: pages[record.name]?.description || '' }
    : { id: record?.id, kind, title: record?.title || '', description: record?.description || '',
        category: record?.category || '', date: record?.date || new Date().toISOString().slice(0, 10),
        url: record?.url || '', image: record?.image || '' };
  const [draft, setDraft] = useState(base);
  const postIdRef = useRef(record?.id || `local-${crypto.randomUUID()}`);
  const publishLock = useRef(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { setDraft(base); setError(''); setMessage(''); publishLock.current = false; postIdRef.current = record?.id || `local-${crypto.randomUUID()}`; }, [kind,record?.id,record?.name]);
  const update = (field, value) => setDraft(prev => ({ ...prev, [field]: value }));

  function submit(mode) {
    if (ctaMode) {
      if (!draft.headline?.trim() || !draft.description?.trim() || !draft.primaryLabel?.trim() || !draft.primaryHref?.startsWith('/')) { setError('Enter the CTA headline, description, and a valid internal Apply Now link beginning with /.'); return; }
      saveCta({ callToAction: { label: draft.label.trim(), headline: draft.headline.trim(), description: draft.description.trim(), actions: [{ label: draft.primaryLabel.trim(), href: draft.primaryHref.trim() }, { label: draft.secondaryLabel.trim(), href: draft.secondaryHref.trim() || '/admission/requirements' }] }, support: { label: record?.support?.label || 'Admissions Support', title: draft.supportTitle.trim(), description: draft.supportDescription.trim(), phone: draft.supportPhone.trim() } });
      setError(''); setMessage('Enrollment CTA updated for this prototype session.'); return;
    }
    if (enrollmentMode) {
      if (!draft.headline?.trim() || !draft.description?.trim()) { setError('Enter a headline and description.'); return; }
      saveEnrollment({ headline: draft.headline.trim(), description: draft.description.trim(), statusLabel: draft.statusLabel.trim(), audience: draft.audience.trim(), image: draft.image ? { url: draft.image, alt: draft.headline.trim() } : null });
      setMessage('Enrollment changes saved for this prototype session.');
      return;
    }
    if (!pageMode && !draft.title?.trim()) { setError('Enter a title.'); return; }
    if (pageMode) {
      savePage(record.name, { description: draft.description });
      setMessage('Page changes saved in this prototype session.'); return;
    }
    if (!draft.description?.trim() || !draft.category?.trim() || !draft.date || ((mode === 'publish' || kind !== 'hero') && !validArticle(draft.url, kind))) {
      setError(kind === 'hero' ? 'Enter a valid HTTPS article URL, title, description, category and date before publishing the Hero story.' : 'Enter a title, description, category, date, and a direct HTTPS article URL from the selected site.'); return;
    }
    if (mode === 'publish' && kind === 'news' && !(/^https:\/\//i.test(draft.image || '') || (draft.image || '').startsWith('data:image/'))) {
      setError('Provide a direct HTTPS cover image URL or upload a JPG, PNG, or WebP image before publishing.'); return;
    }
    if (mode === 'publish' && kind === 'pulse' && !(/^https:\/\//i.test(draft.image || '') || (draft.image || '').startsWith('data:image/'))) { setError('Enter an HTTPS cover image URL or upload a file for IDSC Pulse.'); return; }
    if (kind === 'hero' && mode === 'publish' && posts.filter(p => p.kind === 'hero' && p.status === 'Published' && p.id !== draft.id).length >= 4) {
      setError('Homepage allows up to 4 published featured posts. Remove or unpublish one before adding another.'); return;
    }
    if (publishLock.current) return;
    publishLock.current = true;
    const savedId = savePost({ ...draft, prototypeOnly: false, id: postIdRef.current }, mode);
    if (savedId === null) { publishLock.current = false; setError('Unable to publish. Check the Homepage four-story limit.'); return; }
    setDraft(prev => ({ ...prev, id: savedId }));
    setMessage(mode === 'publish' ? 'Preview published once in this prototype session.' : 'Draft saved in this prototype session.');
    if (mode === 'publish') onClose();
  }
  return <div className="adm-modal-backdrop" onMouseDown={onClose}>
    <div className="adm-modal adm-inline-modal" role="dialog" aria-modal="true" aria-labelledby="adm-inline-title" onMouseDown={e=>e.stopPropagation()}>
      <div className="adm-inline-heading"><div><small>LANDING PAGE · ADMIN MODE</small><h2 id="adm-inline-title">{enrollmentMode ? 'Edit enrollment section' : ctaMode ? 'Edit enrollment CTA' : pageMode ? `Edit ${record.name}` : record?.id ? `Edit ${kind === 'hero' ? 'Homepage' : kind === 'news' ? 'News' : 'IDSC Pulse'} preview` : `Add ${kind === 'hero' ? 'Homepage' : kind === 'news' ? 'News' : 'IDSC Pulse'} preview`}</h2></div><button type="button" className="adm-inline-close" aria-label="Close editor" onClick={onClose}><X size={19}/></button></div>
      <div className="adm-form">
        {!pageMode && !enrollmentMode && <>
          <label>{kind === 'hero' ? 'Published article URL (required to publish)' : 'Published article URL'}<input type="url" value={draft.url} onChange={e=>update('url',e.target.value)} placeholder={kind==='hero' ? 'https://publisher.example/article' : kind==='news' ? 'https://voxtemplari.idsc.edu.ph/article...' : 'https://idscpulse.netlify.app/'}/></label>
          <p className="adm-hint">{kind === 'hero' ? 'Use the exact published article URL from any HTTPS website. An image URL or upload remains optional.' : 'Paste the IDSC Pulse deployed HTTPS site or article link, then use an HTTPS cover image URL or upload a JPG/PNG/WebP image. Article URL alone does not include its photograph.'}</p>
        </>}
        {ctaMode ? <>
          <label>CTA eyebrow<input value={draft.label} onChange={e=>update('label', e.target.value)}/></label>
          <label>CTA headline<input value={draft.headline} onChange={e=>update('headline', e.target.value)}/></label>
          <label>CTA description<textarea rows={3} value={draft.description} onChange={e=>update('description', e.target.value)}/></label>
          <div className="adm-inline-subhead">Primary button</div>
          <label>Button text<input value={draft.primaryLabel} onChange={e=>update('primaryLabel',e.target.value)}/></label>
          <label>Internal destination<input value={draft.primaryHref} onChange={e=>update('primaryHref',e.target.value)} placeholder="/admission/requirements"/></label>
          <div className="adm-inline-subhead">Secondary button</div>
          <label>Button text<input value={draft.secondaryLabel} onChange={e=>update('secondaryLabel',e.target.value)}/></label>
          <label>Internal destination<input value={draft.secondaryHref} onChange={e=>update('secondaryHref',e.target.value)}/></label>
          <div className="adm-inline-subhead">Admissions support card</div>
          <label>Title<input value={draft.supportTitle} onChange={e=>update('supportTitle',e.target.value)}/></label>
          <label>Description<textarea rows={2} value={draft.supportDescription} onChange={e=>update('supportDescription',e.target.value)}/></label>
          <label>Phone<input value={draft.supportPhone} onChange={e=>update('supportPhone',e.target.value)}/></label>
        </> : enrollmentMode ? <>
          <label>Enrollment headline<input value={draft.headline} onChange={e=>update('headline',e.target.value)}/></label>
          <label>Enrollment status<input value={draft.statusLabel} onChange={e=>update('statusLabel',e.target.value)} placeholder="Admissions Open"/></label>
          <label>Audience<input value={draft.audience} onChange={e=>update('audience',e.target.value)} placeholder="Senior High School & College"/></label>
          <label>{pageMode ? 'Page description' : 'Description'}<textarea rows={3} value={draft.description} onChange={e=>update('description',e.target.value)}/></label>
          <ImageSourceFields compact image={draft.image} onChange={value=>update('image',value)}/>
        </> : <>
          {!pageMode && <label>Title<input value={draft.title} onChange={e=>update('title',e.target.value)}/></label>}
          {!pageMode && <>
            <label>Category<input value={draft.category} onChange={e=>update('category',e.target.value)}/></label>
            <label>Publication date<input type="date" value={draft.date} onChange={e=>update('date',e.target.value)}/></label>
          </>}
          <label>{pageMode ? 'Page description' : 'Description'}<textarea rows={3} value={draft.description} onChange={e=>update('description',e.target.value)}/></label>
          {!pageMode && <ImageSourceFields compact uploadOnly={false} required={kind === 'news' || kind === 'pulse'} image={draft.image} onChange={value=>update('image',value)}/>}
        </>}
        {error && <p className="adm-error" role="alert">{error}</p>}
        {message && <p className="adm-success" role="status">{message}</p>}
        <div className="adm-form-actions">
          <button className="adm-button adm-button--secondary" onClick={onClose} type="button">{message ? 'Close' : 'Cancel'}</button>
          {!pageMode && !enrollmentMode && !ctaMode && <button className="adm-button adm-button--secondary" onClick={()=>submit('draft')} disabled={Boolean(message)} type="button">Save draft</button>}
          <button className="adm-button adm-button--primary" onClick={()=>submit('publish')} disabled={Boolean(message)} type="button">{enrollmentMode ? 'Save enrollment' : ctaMode ? 'Save CTA' : pageMode ? 'Save page' : 'Publish preview'}</button>
        </div>
      </div>
      {!pageMode && !enrollmentMode && !ctaMode && Boolean(draft.url) && validArticle(draft.url,kind) && <a className="adm-green-link" href={draft.url} target="_blank" rel="noopener noreferrer">Open original article <ExternalLink size={14}/></a>}
      <p className="adm-inline-disclaimer">Prototype changes are shared with Admin Posts and Recent History for this session. They do not update the live website.</p>
    </div>
  </div>;
}
