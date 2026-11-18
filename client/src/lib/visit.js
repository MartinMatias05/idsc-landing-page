/**
 * Rules for counting a Landing Page view. Kept separate from the React hook so they can be tested alone.
 *
 * One view is counted per browser session: reloading the page does not inflate the number. To count every
 * page load instead, make `hasRecordedVisit` return false.
 */
const STORAGE_KEY = 'idsc:visit-recorded';

export function hasRecordedVisit(storage = globalThis.sessionStorage) {
  try {
    return storage?.getItem(STORAGE_KEY) === '1';
  } catch {
    return false; // storage blocked (private mode, policy): count the view rather than lose it
  }
}

export function markVisitRecorded(storage = globalThis.sessionStorage) {
  try {
    storage?.setItem(STORAGE_KEY, '1');
  } catch {
    /* storage blocked: the view may be counted again later, which is acceptable */
  }
}
