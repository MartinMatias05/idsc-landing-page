const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  /** @param {'network'|'http'} kind */
  constructor(message, { kind, status = null }) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** GET a JSON resource. Problem Details bodies (RFC 9457) become ApiError messages. */
async function request(path, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal, headers: { Accept: 'application/json' } });
  } catch (cause) {
    if (cause.name === 'AbortError') throw cause;
    throw new ApiError('The Landing Page API could not be reached.', { kind: 'network' });
  }
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}.`;
    try {
      detail = (await response.json()).detail ?? detail;
    } catch {
      /* body was not JSON; keep the generic message */
    }
    throw new ApiError(detail, { kind: 'http', status: response.status });
  }
  return response.json();
}

// Every function takes an AbortSignal so components can cancel in-flight requests.
export const api = {
  getSite: (signal) => request('/site', signal),
  getNavigation: (signal) => request('/navigation', signal),
  getNews: (signal) => request('/news', signal),
  getNewsArticle: (id, signal) => request(`/news/${encodeURIComponent(id)}`, signal),
  getEnrollment: (signal) => request('/enrollment', signal),
  getPulse: (signal) => request('/pulse', signal),
  getStatistics: (signal) => request('/statistics', signal),
};
