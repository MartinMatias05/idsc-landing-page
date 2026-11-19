/**
 * Central registry of the external systems the Landing Page links to: the News System, the IDSC Pulse
 * System and the other college systems. Each is developed and deployed independently.
 *
 * The Landing Page only needs to know WHERE to send the user. Destination URLs come from environment
 * variables (see .env.example), so when a group changes its URL you edit the environment, never a
 * React component.
 *
 * `itemPathKey` (optional) names a variable holding a path template such as `/articles/{id}`. It is only
 * for systems whose item URLs are built from an id both sides agree on. Without it, every link to that
 * system goes to its landing URL.
 */
export const SYSTEMS = [
  { id: 'news', name: 'News System', envKey: 'VITE_SYSTEM_NEWS_URL', itemPathKey: 'VITE_SYSTEM_NEWS_ITEM_PATH' },
  { id: 'pulse', name: 'IDSC Pulse', envKey: 'VITE_SYSTEM_PULSE_URL', itemPathKey: 'VITE_SYSTEM_PULSE_ITEM_PATH' },
  { id: 'library', name: 'Library', envKey: 'VITE_SYSTEM_LIBRARY_URL' },
  { id: 'student-portal', name: 'Student Portal', envKey: 'VITE_SYSTEM_STUDENT_PORTAL_URL' },
  { id: 'finance', name: 'Finance', envKey: 'VITE_SYSTEM_FINANCE_URL' },
  { id: 'faculty', name: 'Faculty', envKey: 'VITE_SYSTEM_FACULTY_URL' },
  { id: 'clinic', name: 'Clinic', envKey: 'VITE_SYSTEM_CLINIC_URL' },
  { id: 'registrar', name: 'Registrar', envKey: 'VITE_SYSTEM_REGISTRAR_URL' },
  { id: 'inventory', name: 'Inventory', envKey: 'VITE_SYSTEM_INVENTORY_URL' },
];

/**
 * Landing Page routes that hand the visitor off to another system instead of rendering a page.
 * The API's "News" menu item (/news) leaves the Landing Page for the News System.
 */
export const ROUTE_TO_SYSTEM = {
  '/news': 'news',
};

/**
 * Statistics whose circle is also a link to the system that owns the number.
 * Keys are statistic ids from GET /statistics; values are ids from SYSTEMS above.
 * "Student Enrolled" and "Site Visitor" are deliberately absent: they are not links.
 */
export const STATISTIC_TO_SYSTEM = {
  'faculty-fulltime': 'faculty',
};
