import { useCallback, useEffect, useState } from 'react';

const LOADING = { status: 'loading', data: null, error: null };

/**
 * Runs `fetcher(signal)` and tracks loading / success / error.
 * `fetcher` must be stable (a module-level function or wrapped in useCallback).
 */
export function useApi(fetcher) {
  const [state, setState] = useState(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState(LOADING);
    fetcher(controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null, error });
      });
    return () => controller.abort();
  }, [fetcher, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);
  return { ...state, reload };
}
