import { SYSTEMS, ROUTE_TO_SYSTEM } from '../config/systems.config';

/** Accepts only absolute http(s) URLs, so a bad value can never become a `javascript:` link. */
function parseUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

const registry = new Map(
  SYSTEMS.map(({ id, name, envKey }) => {
    const url = parseUrl(import.meta.env[envKey]);
    return [id, { id, name, url, enabled: url !== null }];
  }),
);

/** @returns {{id: string, name: string, url: string|null, enabled: boolean}|null} */
export const getSystem = (id) => registry.get(id) ?? null;

export const systemIdForRoute = (href) => ROUTE_TO_SYSTEM[href] ?? null;

/**
 * Best-effort reachability probe. A no-cors request resolves for any server that answers
 * (the response is opaque) and rejects when the host is down or times out.
 */
export async function isReachable(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
