// Transcribed from IDSC's photographed SCHOOL FEES board.
// First semester, SY 2026–2027. Amounts in Philippine pesos.
// Columns: year level, regular units, tuition, miscellaneous, laboratory, thesis/research.
// The total is calculated from these columns to avoid inconsistent manual totals.
export const schoolYear = '2026–2027';
export const semester = '1st Semester';
const courses = [
  ['Bachelor of Science in Criminology (BSC)', [
    [1,23,12878.50,6248,0,0],[2,26,15574,5723,1200,0],[3,26,15574,5723,1200,0],[4,22,13178,5723,0,2220],
  ]],
  ['Bachelor of Science in Information Technology (BSIT)', [
    [1,23,12878.50,6248,1800,0],[2,23,13777,5723,2400,0],[3,18,10782,5723,3000,0],[4,12,7188,5723,600,2220],
  ]],
  ['Bachelor of Science in Hospitality Management (BSHM)', [
    [1,20,11081.50,6248,0,0],[2,23,13777,5723,1200,0],[3,21,12579,5723,1200,0],[4,21,12579,5723,0,2220],
  ]],
  ['Bachelor of Science in Tourism Management (BSTM)', [
    [1,20,11081.50,6248,0,0],[2,23,13777,5723,1200,0],[3,21,12579,5723,600,0],[4,18,10782,5723,600,2220],
  ]],
  ['Bachelor of Science in Business Administration Major in Marketing Management (BSBA–MM)', [
    [1,20,11081.50,6248,0,0],[2,23,13777,5723,0,0],[3,18,10782,5723,0,0],[4,18,10782,5723,0,2220],
  ]],
  ['Bachelor of Science in Business Administration Major in Human Resource Management (BSBA–HRM)', [
    [1,20,11081.50,6248,0,0],[2,23,13777,5723,0,0],[3,18,10782,5723,0,0],[4,18,10782,5723,0,2220],
  ]],
  ['Bachelor of Elementary Education (BSEd)', [
    [1,26,14675.50,6248,0,0],[2,23,13777,5723,0,0],[3,21,12579,5723,0,0],[4,6,3594,5723,0,0],
  ]],
  ['Bachelor of Secondary Education Major in English (BSEd–English)', [
    [1,26,14675.50,6248,0,0],[2,26,15574,5723,0,0],[3,24,14376,5723,0,0],[4,6,3594,5723,0,0],
  ]],
  ['Bachelor of Secondary Education Major in Mathematics (BSEd–Mathematics)', [
    [1,26,14675.50,6248,0,0],[2,24,14376,5723,0,0],[3,21,12579,5723,0,0],[4,6,3594,5723,0,0],
  ]],
  ['Associate in Computer Technology (2–year)', [
    [1,23,12878.50,6248,1800,0],[2,20,11980,5723,3000,0],
  ]],
];
export const semesterFees = courses.map(([name, rows]) => ({
  name,
  years: rows.map(([year, units, tuition, miscellaneous, laboratory, research]) => ({
    year, units, tuition, miscellaneous, laboratory, research,
    total: tuition + miscellaneous + laboratory + research,
  })),
}));

// The base miscellaneous breakdown shown in the photo totals PHP 6,248.
// Separate parentheses for laboratory/thesis and late enrollment are not treated
// as additions to this base breakdown; relevant program-specific charges already
// appear in the semester table above.
export const miscellaneousFees = [
  ['Registration', 150],
  ['Matriculation', 72],
  ['Medical / Dental', 600],
  ['Guidance & Counseling', 432],
  ['Audio Visual', 144],
  ['Library', 1008],
  ['E-Resource', 100],
  ['Journals', 150],
  ['Energy', 1440],
  ['Test Materials', 180],
  ['Internet', 240],
  ['Student Activity Fund', 180],
  ['Faculty Development Fund', 200],
  ['Purified Water', 120],
  ['Athletics', 360],
  ['Insurance', 72],
  ['School ID / Validation', 550],
  ['Student Affairs and Services Fund', 150],
  ['R&D / Extension Services Fund', 100],
];
export const baseMiscellaneousTotal = miscellaneousFees.reduce((sum, [, value]) => sum + value, 0);
