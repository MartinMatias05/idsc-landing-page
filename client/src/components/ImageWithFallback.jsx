import { useEffect, useState } from 'react';

/**
 * Renders an API-supplied image (`{ url, alt }`). When the image is missing or fails to load,
 * a branded green panel is shown instead so the Figma layout never collapses.
 * `decorative` hides the image from assistive technology (the text beside it already says it).
 */
export default function ImageWithFallback({ image, className = '', decorative = false, fallback = null }) {
  const [failed, setFailed] = useState(false);
  const url = image?.url;

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (!url || failed) {
    return (
      <div
        className={`image-fallback ${className}`}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : image?.alt}
        aria-hidden={decorative || undefined}
      >
        {fallback}
      </div>
    );
  }
  return (
    <img
      className={className}
      src={url}
      alt={decorative ? '' : image.alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
