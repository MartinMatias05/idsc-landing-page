'use strict';

/** Mock data: 9 college programs and 2 Senior High School tracks, in design order. */

const programs = [
  { id: 'program-001', level: 'college', code: 'BSC', name: 'BS in Criminology', fullName: 'Bachelor of Science in Criminology (BSC)', major: null, department: 'College of Criminology', duration: null, icon: 'shield' },
  { id: 'program-002', level: 'college', code: 'BSHM', name: 'BS in Hospitality Management', fullName: 'Bachelor of Science in Hospitality Management (BSHM)', major: null, department: 'Hospitality & Tourism', duration: null, icon: 'utensils' },
  { id: 'program-003', level: 'college', code: 'BSTM', name: 'BS in Tourism Management', fullName: 'Bachelor of Science in Tourism Management (BSTM)', major: null, department: 'Hospitality & Tourism', duration: null, icon: 'map-pin' },
  { id: 'program-004', level: 'college', code: 'ACT', name: 'Associate in Computer Technology', fullName: 'Associate in Computer Technology (2-year)', major: null, department: 'Computer Technology', duration: '2-year', icon: 'cpu' },
  { id: 'program-005', level: 'college', code: 'BSBA-MM', name: 'BS in Business Administration', fullName: 'Bachelor of Science in Business Administration Major in Marketing Management (BSBA-MM)', major: 'Marketing Management', department: 'Business Administration', duration: null, icon: 'briefcase' },
  { id: 'program-006', level: 'college', code: 'BSBA-HRM', name: 'BS in Business Administration', fullName: 'Bachelor of Science in Business Administration Major in Human Resource Management (BSBA-HRM)', major: 'Human Resource Management', department: 'Business Administration', duration: null, icon: 'users' },
  { id: 'program-007', level: 'college', code: 'BSEd-English', name: 'Bachelor of Secondary Education', fullName: 'Bachelor of Secondary Education Major in English (BSEd-English)', major: 'English', department: 'Education', duration: null, icon: 'book-open' },
  { id: 'program-008', level: 'college', code: 'BSEd-Mathematics', name: 'Bachelor of Secondary Education', fullName: 'Bachelor of Secondary Education Major in Mathematics (BSEd-Mathematics)', major: 'Mathematics', department: 'Education', duration: null, icon: 'calculator' },
  { id: 'program-009', level: 'college', code: 'BSEd', name: 'Bachelor of Elementary Education', fullName: 'Bachelor of Elementary Education (BSEd)', major: null, department: 'Education', duration: null, icon: 'graduation-cap' },
  { id: 'program-010', level: 'shs', code: 'ACAD', name: 'Academic Track', fullName: 'Academic Track', major: null, department: 'Senior High School', duration: null, icon: 'book-open' },
  { id: 'program-011', level: 'shs', code: 'TECHPRO', name: 'TechPro Track', fullName: 'TechPro Track', major: null, department: 'Senior High School', duration: null, icon: 'cpu' },
];

module.exports = { programs };
