
'use strict';

const { enrollment, pulse, statistics } = require('../data/home.data');
const admin = require('./admin-state.service');
const { getVisitCount } = require('./visit.service');
const { getExternalCounts } = require('./external-stats.service');

const getEnrollment = () => {
  const state=admin.read();
  return structuredClone({ ...enrollment,
    hero: {...enrollment.hero,...(state.enrollmentEdit || {})},
    callToAction:{...enrollment.callToAction,...(state.ctaEdit?.callToAction || {})},
    support:{...enrollment.support,...(state.ctaEdit?.support || {})}
  });
};

const getPulse = () => {
  const state=admin.read();
  const deleted = new Set([...(state.hiddenPreviews || []),...(state.deletedPosts || [])]);
  const overrides=(state.posts||[]).filter(p=>p.kind==='pulse' && p.prototypeOnly===false);
  const replaced=new Set(overrides.map(p=>p.id));
  const published=overrides.filter(p=>p.status==='Published').map(p=>({id:p.id,title:p.title,summary:p.description,postedOn:p.date,image:{url:p.image || '',alt:p.title},url:p.url,icon:'megaphone'}));
  const items=[...published,...pulse.items.filter(p=>!deleted.has(p.id) && !replaced.has(p.id))];
  return structuredClone({...pulse,items,total:items.length});
};

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
