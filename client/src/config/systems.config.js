/**
 * Single source of truth for external system hand-offs.
 * React components never hard-code another group's URL.
 */
export const SYSTEMS = [
  { id: 'library', name: 'Library', envKey: 'VITE_SYSTEM_LIBRARY_URL' },
  { id: 'student-portal', name: 'Student Portal', envKey: 'VITE_SYSTEM_STUDENT_PORTAL_URL' },
  { id: 'finance', name: 'Finance', envKey: 'VITE_SYSTEM_FINANCE_URL' },
  { id: 'faculty', name: 'Faculty', envKey: 'VITE_SYSTEM_FACULTY_URL' },
  { id: 'clinic', name: 'Clinic', envKey: 'VITE_SYSTEM_CLINIC_URL' },
  { id: 'registrar', name: 'Registrar', envKey: 'VITE_SYSTEM_REGISTRAR_URL' },
  { id: 'inventory', name: 'Inventory', envKey: 'VITE_SYSTEM_INVENTORY_URL' }
];

export const ROUTE_TO_SYSTEM = { '/students': 'student-portal' };
