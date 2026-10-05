export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
}
