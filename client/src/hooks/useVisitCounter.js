import { useEffect } from 'react';
import { api } from '../services/api';
import { hasRecordedVisit, markVisitRecorded } from '../lib/visit';

// React StrictMode runs effects twice in development; this keeps the page view to a single request.
let requestStarted = false;

/**
 * Tells the Landing Page API that the home page was viewed, then calls `onRecorded` so the statistics
 * can show the new Site Visitor count. A failing or missing endpoint is ignored: counting a visit must
 * never break the page.
 */
export function useVisitCounter(onRecorded) {
  useEffect(() => {
    if (requestStarted || hasRecordedVisit()) return;
    requestStarted = true;
    api
      .recordVisit()
      .then(() => {
        markVisitRecorded();
        onRecorded?.();
      })
      .catch(() => {
        requestStarted = false;
      });
    // Runs once per mount by design; onRecorded is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
