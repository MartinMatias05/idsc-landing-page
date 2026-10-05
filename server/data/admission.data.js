'use strict';

/**
 * Mock data: admission information. Text follows the approved Figma design.
 * Tuition fees are `null` because the design shows "—" until official rates are published.
 */

const requirements = {
  heading: {
    label: 'Requirements',
    title: 'Prepare your application',
    description:
      'Review the quick guidance below, then confirm exact requirements with the IDSC admissions office before you submit.',
  },
  groups: [
    {
      id: 'shs',
      badge: 'Senior High School',
      title: 'Senior High School',
      items: [
        'Original Junior High School Card (SF 9)',
        'Original Good Moral Certificate',
        'Photocopy of PSA Birth Certificate',
        'Two (2) passport-size pictures with white background',
        'One (1) long white folder',
      ],
    },
    {
      id: 'college',
      badge: 'College',
      title: 'College',
      items: [
        'PSA Birth Certificate — Photocopy',
        'Form 138 / SF 9 — Original',
        'Good Moral Certificate — Original',
        'Two (2) 2×2 pictures with white background',
      ],
    },
    {
      id: 'transferees',
      badge: 'Transferees',
      title: 'Transferees',
      items: ['Transcript of Records', 'Honorable Dismissal'],
    },
  ],
  note: 'Exact requirements may vary by program. Confirm the latest documents, deadlines, and eligibility rules with the IDSC admissions office.',
};

const process = {
  heading: {
    label: 'Process',
    title: 'Simple admission steps',
    description:
      'Follow these general steps, then connect with the admissions team for verified guidance and next steps.',
  },
  steps: [
    {
      step: 1,
      title: 'Choose a program',
      summary:
        'Explore Senior High School and College pathways to find the best fit for your next academic step.',
      icon: 'book-open',
    },
    {
      step: 2,
      title: 'Confirm requirements',
      summary:
        'Check the documents, deadlines, and eligibility rules for your chosen program with the admissions office.',
      icon: 'shield-alert',
    },
    {
      step: 3,
      title: 'Prepare and submit',
      summary:
        'Prepare your documents, complete your application, and submit it according to the official guidance.',
      icon: 'megaphone',
    },
    {
      step: 4,
      title: 'Follow enrolment guidance',
      summary:
        'Wait for the next enrolment steps, then complete registration and orientation as advised by the school.',
      icon: 'graduation-cap',
    },
  ],
};

/**
 * Row order matches the design. `programId: null` rows are listed in the tuition table only
 * (BSIT appears there but not among the 9 program cards; see docs/data-model.md).
 */
const tuition = {
  heading: {
    label: 'Tuition',
    title: 'Estimated Tuition Fees',
    description:
      'Review the programs available at IDSC and their corresponding tuition information. Fees will be updated once the official rates are available.',
  },
  currency: 'PHP',
  groups: [
    {
      id: 'college',
      title: 'College Programs',
      rows: [
        { programId: 'program-001' },
        { programId: 'program-002' },
        { programId: 'program-003' },
        { programId: null, program: 'Bachelor of Science in Information Technology (BSIT)' },
        { programId: 'program-004' },
        { programId: 'program-005' },
        { programId: 'program-006' },
        { programId: 'program-007' },
        { programId: 'program-008' },
        { programId: 'program-009' },
      ].map((row) => ({ estimatedFee: null, ...row })),
    },
    {
      id: 'shs',
      title: 'Senior High School',
      rows: [{ programId: 'program-010' }, { programId: 'program-011' }].map((row) => ({
        estimatedFee: null,
        ...row,
      })),
    },
  ],
};

// `**text**` marks emphasis; clients render it as bold.
const paymentInstructions = {
  heading: {
    label: 'Instructions',
    title: 'Payment Instructions',
    description:
      'Follow the steps below when paying your tuition and school fees through online banking or GCash. Make sure to submit your proof of payment for verification.',
  },
  account: {
    bank: 'Philippine National Bank (PNB)',
    bankCode: 'PNB',
    accountName: 'INFOTECH DEVELOPMENT SYSTEMS COLLEGES, INC.',
    accountNumber: '250570002777',
    proofOfPaymentEmail: 'idscolleges@yahoo.com',
  },
  methods: [
    {
      id: 'online-banking',
      label: 'Online Banking',
      title: 'Online Banking / PNB',
      icon: 'landmark',
      steps: [
        "Pay your fees through online banking or deposit to IDSC's PNB bank account using the details above.",
        'Select **PNB**, enter the bank details and the amount to transfer.',
        'Select real-time transfer via **InstaPay**.',
        'Enter your **name, course, and year** in the Purpose field.',
        "Send proof of payment to IDSC's official Facebook page or email **idscolleges@yahoo.com**.",
        'Proceed to the **Finance Officer** for the online payment verification form and exam permit.',
        'After **2–3 business days**, claim your Official Receipt at **Cashier Window 1**.',
      ],
      reminder: null,
    },
    {
      id: 'gcash',
      label: 'Mobile Payment',
      title: 'GCash',
      icon: 'smartphone',
      steps: [
        'Open GCash and tap **Transfer**.',
        'Select **PNB**, enter the amount and the same bank account details shown above.',
        'Send the GCash receipt to **idscolleges@yahoo.com**.',
        'Proceed to the **Finance Officer** for the online payment verification form and exam permit.',
        'After **2–3 business days**, proceed to the **Cashier** to claim your Official Receipt.',
      ],
      reminder:
        'Use the same PNB account details shown in the panel above when transferring via GCash.',
    },
  ],
  importantNote: {
    title: 'Important Note',
    body: 'Keep your payment receipt until payment verification is complete and your Official Receipt has been issued. You must complete the Finance Officer verification process **before** proceeding to the Cashier to claim your Official Receipt. For Online Banking, claim at **Cashier Window 1 or 2**. For GCash, proceed to the **Cashier** as directed.',
  },
};

module.exports = { requirements, process, tuition, paymentInstructions };
