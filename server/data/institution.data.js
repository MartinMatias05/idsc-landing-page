'use strict';

/**
 * Mock data: About and Facilities.
 * The approved design defines only titles for Vision/Mission/Core Values, Hymn, Career,
 * Laboratories, Academic Spaces and Clinic. They are exposed as `title-only` (a design-scope
 * limitation documented in docs/design-system.md), not as unfinished placeholders.
 */

const about = {
  title: 'About IDSC',
  summary:
    'Infotech Development System Colleges, Inc. (IDSC) is a higher education institution in Ligao City offering Senior High School and college programs.',
  backgroundImage: { url: '/assets/about/campus.jpg', alt: 'IDSC campus building under a clear sky' },
  pages: [
    { id: 'about', title: 'About IDSC', href: '/about', contentStatus: 'available' },
    { id: 'vision-mission', title: 'Vision, Mission and Core Values', href: '/about/vision-mission', contentStatus: 'title-only' },
    { id: 'hymn', title: 'IDSC Hymn', href: '/about/hymn', contentStatus: 'title-only' },
    { id: 'career', title: 'Career', href: '/about/career', contentStatus: 'title-only' },
  ],
};

const facilities = [
  { id: 'laboratories', title: 'Laboratories', href: '/facilities/laboratories', contentStatus: 'title-only' },
  { id: 'academic-spaces', title: 'Academic Spaces', href: '/facilities/academic-spaces', contentStatus: 'title-only' },
  // Public information page only. Clinic operations belong to the separate Clinic module.
  { id: 'clinic', title: 'Clinic', href: '/facilities/clinic', contentStatus: 'title-only' },
];

module.exports = { about, facilities };
