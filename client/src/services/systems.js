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

/** An item path template must be an absolute path containing `{id}`, for example `/articles/{id}`. */
const parseItemPath = (value) => (value && value.startsWith('/') && value.includes('{id}') ? value : null);

const registry = new Map(
  SYSTEMS.map(({ id, name, envKey, itemPathKey }) => {
    const url = parseUrl(import.meta.env[envKey]);
    const itemPath = itemPathKey ? parseItemPath(import.meta.env[itemPathKey]) : null;
    return [id, { id, name, url, itemPath, enabled: url !== null }];
  }),
);

/** @returns {{id: string, name: string, url: string|null, itemPath: string|null, enabled: boolean}|null} */
export const getSystem = (id) => registry.get(id) ?? null;

export const systemIdForRoute = (href) => ROUTE_TO_SYSTEM[href] ?? null;

/**
 * Destination for a link to `system`. With an `itemId` and a configured item path the link goes to that
 * item; otherwise to the system's landing URL. Returns null when the system has no URL yet.
 */
export function getSystemUrl(system, itemId) {
  if (!system?.enabled) return null;
  if (itemId === undefined || !system.itemPath) return system.url;
  return new URL(system.itemPath.replace('{id}', encodeURIComponent(itemId)), system.url).href;
}

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
