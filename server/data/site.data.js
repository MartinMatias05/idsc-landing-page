'use strict';

/** Mock data: site identity and navigation (see docs/data-model.md). */

const site = {
  name: 'Infotech Development System Colleges, Inc.',
  abbreviation: 'IDSC',
  city: 'Ligao City',
  tagline: 'Empowering Futures with Dedicated Service',
  logo: { url: '/assets/brand/idsc-logo.png', alt: 'IDSC official logo' },
  searchPlaceholder: 'Search IDSC',
  headerCta: { label: 'Apply Now', href: '/admission/requirements' },
  contact: {
    email: 'idscollegesinc@gmail.com',
    phone: '09178812683',
    officeHours:
      'For inquiries you can visit the school during office hours: Monday–Friday at 8am–4pm',
  },
  legal: {
    copyright: '© 2009–2026 Infotech Development System Colleges, Inc.',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
};

const navigation = {
  primary: [
    {
      id: 'admission',
      label: 'Admission',
      href: null,
      children: [
        { label: 'Admission Requirement', href: '/admission/requirements' },
        { label: 'Alternative Payment Service', href: '/admission/payment-instructions' },
        { label: 'Estimated Tuition Fee', href: '/admission/tuition' },
      ],
    },
    {
      id: 'programs',
      label: 'Programs',
      href: null,
      children: [
        { label: 'College Course', href: '/programs/college' },
        { label: 'Senior High School', href: '/programs/shs' },
      ],
    },
    {
      id: 'facilities',
      label: 'Facilities',
      href: null,
      children: [
        { label: 'Laboratories', href: '/facilities/laboratories' },
        { label: 'Academic Spaces', href: '/facilities/academic-spaces' },
        { label: 'Clinic', href: '/facilities/clinic' },
      ],
    },
    { id: 'news', label: 'News', href: '/news', children: [] },
    {
      id: 'about',
      label: 'About IDSC',
      href: null,
      children: [
        { label: 'About IDSC', href: '/about' },
        { label: 'Vision, Mission and Core Values', href: '/about/vision-mission' },
        { label: 'IDSC Hymn', href: '/about/hymn' },
        { label: 'Career', href: '/about/career' },
      ],
    },
  ],
  footer: {
    heading: 'Explore',
    links: [
      { label: 'Admission', href: '/admission/requirements' },
      { label: 'Programs', href: '/programs/college' },
      // "Students" is expected to hand off to the Student Portal module (see docs/integration.md).
      { label: 'Students', href: '/students' },
      { label: 'Facilities', href: '/facilities/laboratories' },
      { label: 'News', href: '/news' },
      { label: 'About IDSC', href: '/about' },
    ],
  },
};

module.exports = { site, navigation };
