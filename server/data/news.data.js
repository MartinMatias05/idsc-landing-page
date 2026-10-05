'use strict';

/** Mock data: news articles, newest first. Exactly one article is `featured` (home hero). */

const news = [
  {
    id: 'news-001',
    title: 'IDSC declares campus as Zone of Peace',
    summary:
      'IDSC joins other higher education institutions throughout the region in declaring strengthened measures in promoting peace.',
    category: 'Declaration',
    publishedOn: '2026-09-28',
    image: {
      url: '/assets/news/zone-of-peace.jpg',
      alt: 'Students and school officials signing a Zone of Peace declaration board',
    },
    featured: false,
    body: [
      'IDSC has declared its campus a Zone of Peace, joining other higher education institutions throughout the region in strengthening measures that promote peace.',
      'Students, faculty and school officials took part in the signing of the declaration.',
    ],
  },
  {
    id: 'news-002',
    title:
      'IDSC Tourism Students Join Clean-up Drive in Celebration of World Tourism and Bamboo Days 2026',
    summary:
      'Tourism students took part in a clean-up drive at the Ligao City Bambuseum in Tuburan, Ligao City.',
    category: 'Tourism',
    publishedOn: '2026-09-25',
    image: {
      url: '/assets/news/clean-up-drive.jpg',
      alt: 'Tourism students and faculty gathered at the Ligao City Bambuseum',
    },
    featured: true,
    body: [
      'To celebrate World Tourism Day and World Bamboo Day 2026, tourism students of Infotech Development Systems Colleges Inc. (IDSC) participated in a clean-up drive on September 25, 2026, at the Ligao City Bambuseum in Tuburan, Ligao City.',
    ],
  },
  {
    id: 'news-003',
    title: 'IDSC secures 5th in RX Detectives 2026 Regional Quiz Bee',
    summary: 'IDSC representatives placed fifth in the RX Detectives 2026 Regional Quiz Bee.',
    category: 'Event',
    publishedOn: '2026-09-20',
    image: {
      url: '/assets/news/rx-detectives.jpg',
      alt: 'IDSC students seated at the RX Detectives 2026 Regional Quiz Bee',
    },
    featured: false,
    body: [
      'IDSC secured fifth place in the RX Detectives 2026 Regional Quiz Bee, where participating schools competed in a regional quiz competition.',
    ],
  },
];

module.exports = { news };
