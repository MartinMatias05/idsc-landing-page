import { useEffect } from 'react';
import '../styles/home-motion.css';

/** Optional, one-time entrance effects for the public Homepage sections. */
export default function HomeMotion() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(document.querySelectorAll(
      '#main > .news-section, #main > .enrollment, #main > .pulse, #main > .stats, #main > .cta'
    ));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('home-motion-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });

    for (const section of targets) {
      section.classList.add('home-motion-pending');
      // Make above-fold content immediately visible; don't hide already visible sections.
      if (section.getBoundingClientRect().top < window.innerHeight * 0.93) {
        section.classList.add('home-motion-visible');
      } else {
        observer.observe(section);
      }
    }
    return () => {
      observer.disconnect();
      targets.forEach((section) => {
        section.classList.remove('home-motion-pending', 'home-motion-visible');
      });
    };
  }, []);
  return null;
}
