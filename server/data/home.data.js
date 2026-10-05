'use strict';

/** Mock data: home-page blocks (enrollment messaging, IDSC Pulse, statistics). */

const enrollment = {
  hero: {
    statusLabel: 'Admissions Open',
    audience: 'Senior High School & College',
    headline: 'Enrollment is ongoing at IDSC',
    description:
      'Begin your next chapter in Ligao City. Explore learning pathways, review admission information, and take the first step toward joining the IDSC community.',
    image: {
      url: '/assets/enrollment/pre-registration-poster.jpg',
      alt: 'Pre-registration poster inviting students to secure their slots, with a QR code',
    },
  },
  callToAction: {
    label: 'Take the next step',
    headline: 'Planning to enroll at IDSC?',
    description:
      'Start with the official admission information, then connect with the IDSC team for pre-registration guidance.',
    actions: [
      { label: 'Apply Now', href: '/admission/requirements' },
      { label: 'Pre-registration Information', href: '/pre-registration' },
    ],
  },
  support: {
    label: 'Admissions Support',
    title: 'Questions before you apply?',
    description:
      'Contact the school during office hours for verified requirements, tuition information, and enrollment support.',
    phone: '09178812683',
  },
};

const pulse = {
  heading: { label: 'IDSC Pulse', title: 'Latest IDSC Blog', description: null },
  items: [
    {
      id: 'pulse-001',
      title: 'Enrollment Advisory for the Incoming School Year',
      summary:
        'Please refer to the official advisory and admissions office for complete enrollment guidance.',
      icon: 'shield-alert',
      postedOn: '2026-09-22',
      image: { url: '/assets/pulse/enrollment-advisory.jpg', alt: 'Admissions office reception area' },
    },
    {
      id: 'pulse-002',
      title: 'Pre-registration Guidance for Senior High School and College',
      summary:
        'Admission information and pre-registration guidance are available through the IDSC admissions office.',
      icon: 'megaphone',
      postedOn: '2026-09-15',
      image: { url: '/assets/pulse/pre-registration.jpg', alt: 'Students filling out pre-registration forms' },
    },
    {
      id: 'pulse-003',
      title: 'Office Hours and Campus Visit Reminders',
      summary:
        'Visit the school Monday to Friday, 8am to 4pm, for verified requirements and enrollment support.',
      icon: 'shield-alert',
      postedOn: '2026-09-08',
      image: { url: '/assets/pulse/campus-visit.jpg', alt: 'IDSC campus entrance' },
    },
  ],
};

/**
 * Temporary mock values. In production, `students-enrolled` is owned by the Registrar module,
 * `faculty-fulltime` by the Faculty module (consumed through their REST APIs, never their databases).
 * "FULL-TIME FACULTU" in the Figma file is corrected to "Full-time Faculty" here.
 */
const statistics = {
  asOf: '2026-10-05',
  items: [
    {
      id: 'students-enrolled',
      label: 'Student Enrolled',
      value: 2120,
      tone: 'green',
      provider: { module: 'registrar', isMock: true },
    },
    {
      id: 'faculty-fulltime',
      label: 'Full-time Faculty',
      value: 34,
      tone: 'dark-green',
      provider: { module: 'faculty', isMock: true },
    },
    {
      id: 'site-visitors',
      label: 'Site Visitor',
      value: 20000,
      tone: 'red',
      provider: { module: 'landing-page', isMock: true },
    },
  ],
};

module.exports = { enrollment, pulse, statistics };
