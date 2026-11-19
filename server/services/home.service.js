
'use strict';

const { enrollment, pulse, statistics } = require('../data/home.data');
const { getVisitCount } = require('./visit.service');
const { getExternalCounts } = require('./external-stats.service');

const getEnrollment = () => structuredClone(enrollment);

const getPulse = () =>
  structuredClone({ ...pulse, total: pulse.items.length });

async function getStatistics() {
  const result = structuredClone(statistics);

  // Retrieve optional statistics from other CMS systems.
  const { studentsEnrolled, fullTimeFaculty } =
    await getExternalCounts();

  const students = result.items.find(
    (item) => item.id === 'students-enrolled'
  );

  const faculty = result.items.find(
    (item) => item.id === 'faculty-fulltime'
  );

  const visitors = result.items.find(
    (item) => item.id === 'site-visitors'
  );
if (students) {
  students.value = studentsEnrolled;
}

if (faculty) {
  faculty.value = fullTimeFaculty;
}
  // Site Visitor remains independently managed by our backend.
  if (visitors) visitors.value = getVisitCount();

  return result;
}

module.exports = { getEnrollment, getPulse, getStatistics };
