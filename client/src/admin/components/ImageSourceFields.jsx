import { useRef, useState } from 'react';
import { ImagePlus, Link2, UploadCloud, X } from 'lucide-react';

/** Optional image controls used by both admin workflows. Prototype only: no file upload to a server. */
export default function ImageSourceFields({ image = '', onChange, compact = false, uploadOnly = false, required = false }) {
  const fileInput = useRef(null);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('url');
  const isLocal = typeof image === 'string' && image.startsWith('data:image/');
  const imageIsUrl = image && !isLocal;

  function updateUrl(value) {
    setError('');
    onChange(value);
  }
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setError('Select JPG, PNG or WebP, up to 10 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result)); setMethod('upload'); setError(''); };
    reader.onerror = () => setError('Unable to read the selected image.');
    reader.readAsDataURL(file);
  }
  return (
    <div className={`adm-image-fields${compact ? ' adm-image-fields--compact' : ''}`}>
      <div className="adm-image-fields__head">
        <span className="adm-image-fields__label"><ImagePlus size={17}/> {compact ? 'Change cover image' : 'Cover image'} <small>{required ? 'Required to publish' : 'Optional'}</small></span>
        {!!image && !required && <button type="button" className="adm-image-clear" onClick={() => { onChange(''); setError(''); if (fileInput.current) fileInput.current.value = ''; }}><X size={13}/> Remove</button>}
      </div>
      {!uploadOnly && <div className="adm-image-tabs" role="group" aria-label="Choose image source">
        <button type="button" className={method === 'url' ? 'is-active' : ''} onClick={() => setMethod('url')}><Link2 size={15}/> Image URL</button>
        <button type="button" className={method === 'upload' ? 'is-active' : ''} onClick={() => setMethod('upload')}><UploadCloud size={15}/> Upload file</button>
      </div>}
      {!uploadOnly && method === 'url' ? (
        <label className="adm-image-url-label">Image URL (optional)
          <input type="url" placeholder="https://website.com/cover.jpg" value={imageIsUrl ? image : ''} onChange={e => updateUrl(e.target.value)} />
        </label>
      ) : (
        <label className="adm-image-upload-label"><UploadCloud size={19}/><span>Choose a JPG, PNG or WebP image <small>Maximum 10 MB</small></span><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile}/></label>
      )}
      {!!image && <div className="adm-image-current"><img src={image} alt="Selected cover preview" onError={() => setError('Image could not be displayed. Check the URL or upload a file.')} /><span>Selected image preview</span></div>}
      {error && <p className="adm-error" role="alert">{error}</p>}
      <p className="adm-image-fields__note">{uploadOnly ? (required ? "Upload a JPG, PNG or WebP cover before publishing. The article link is separate from its image." : "Upload a replacement cover if needed.") : "Article links do not automatically supply images in this prototype."}</p>
    </div>
  );
}
