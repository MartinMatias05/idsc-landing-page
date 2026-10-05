import { ROUTE_TO_SYSTEM, SYSTEMS } from '../config/systems.config';

function parseUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

const registry = new Map(
  SYSTEMS.map((system) => [
    system.id,
    { ...system, url: parseUrl(import.meta.env[system.envKey]) }
  ])
);

export function getSystem(id) {
  return registry.get(id) ?? null;
}

export function getSystemUrl(id) {
  return getSystem(id)?.url ?? null;
}

export function systemIdForRoute(href) {
  return ROUTE_TO_SYSTEM[href] ?? null;
}

export function handoffToSystem(id) {
  const system = getSystem(id);
  if (!system?.url) return { ok: false, reason: 'not-configured' };
  window.location.assign(system.url);
  return { ok: true };
}

export async function isReachable(url, timeoutMs = 4000) {
  if (!parseUrl(url)) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
