const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { kind = 'network', status = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

async function request(path, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(data?.detail || data?.title || `Request failed (${response.status})`, {
        kind: 'http', status: response.status
      });
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    if (error instanceof ApiError) throw error;
    throw new ApiError('The IDSC information service could not be reached.');
  }
}

export const api = {
  getSite: (signal) => request('/site', signal),
  getNavigation: (signal) => request('/navigation', signal),
  getNews: (signal) => request('/news', signal),
  getEnrollment: (signal) => request('/enrollment', signal),
  getPulse: (signal) => request('/pulse', signal),
  getStatistics: (signal) => request('/statistics', signal),
  getPrograms: (level, signal) => request(`/programs?level=${encodeURIComponent(level)}`, signal),
  getRequirements: (signal) => request('/admission/requirements', signal),
  getProcess: (signal) => request('/admission/process', signal),
  getTuition: (signal) => request('/admission/tuition', signal),
  getAbout: (signal) => request('/about', signal),
  getFacilities: (signal) => request('/facilities', signal)
};

export { API_BASE_URL };
