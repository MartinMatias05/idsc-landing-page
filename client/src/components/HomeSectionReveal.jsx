import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function HomeSectionReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') return;

    document.body.classList.add('idsc-home-page');

    const sections = [
      ...document.querySelectorAll(
        '#main > section:not(:first-child):not(.idsc-stats-modern)'
      )
    ];

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduced || !('IntersectionObserver' in window)) {
      return () => {
        document.body.classList.remove('idsc-home-page');
      };
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('idsc-reveal-visible');
          } else {
            entry.target.classList.remove('idsc-reveal-visible');
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();

      section.classList.add('idsc-reveal-ready');

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.classList.add('idsc-reveal-visible');
      }

      observer.observe(section);
    });

    return () => {
      observer.disconnect();

      sections.forEach(section => {
        section.classList.remove(
          'idsc-reveal-ready',
          'idsc-reveal-visible'
        );
      });

      document.body.classList.remove('idsc-home-page');
    };
  }, [pathname]);

  return null;
}