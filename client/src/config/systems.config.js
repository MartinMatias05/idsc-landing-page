/**
 * Central registry of the other 7 systems of the College Management System.
 *
 * The Landing Page only needs to know WHERE to send the user. Destination URLs come from
 * environment variables (see .env.example), so when a group changes its URL you edit the
 * environment, never a React component.
 */
export const SYSTEMS = [
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
 * The API's footer link "Students" (/students) leads to the Student Portal.
 */
export const ROUTE_TO_SYSTEM = {
  '/students': 'student-portal',
};
