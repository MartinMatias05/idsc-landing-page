const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** '2026-09-25' -> 'Sep 25, 2026' (class-wide date format). */
export const formatDate = (isoDate) => DATE_FORMAT.format(new Date(`${isoDate}T00:00:00Z`));

/** '2026-09-25' -> 'Posted: Sep 25, 2026' (label pattern used by the notice and Pulse cards). */
export const formatPosted = (isoDate) => `Posted: ${formatDate(isoDate)}`;

/** 20000 -> '20,000' */
export const formatNumber = (value) => value.toLocaleString('en-US');
