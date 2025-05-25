import { getConfig } from '../commons/config/properties.js';

const CACHE_KEY_PROFILE = 'profileCache_';
const CACHE_KEY_REPOS   = 'repoCache_';

export async function getProfile(traceParent) {
  const { apiBase, channelId, username, cacheTtl } = getConfig();
  const cacheKey = CACHE_KEY_PROFILE + username;
  const cached   = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTtl) {
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const url = `${apiBase}/profiles/${username}`;
  const res = await fetch(url, {
    headers: { traceParent, channelId }
  });
  if (!res.ok) throw new Error(`Error fetching ${url}`);
  const data = await res.json();

  localStorage.setItem(
    cacheKey,
    JSON.stringify({ timestamp: Date.now(), data })
  );
  return data;
}

export async function getRepos(label, traceParent) {
  const { apiBase, channelId, username, cacheTtl } = getConfig();
  const cacheKey = CACHE_KEY_REPOS + label;
  const cached   = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTtl) {
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const url = `${apiBase}/users/${username}/repos?label=${label}`;
  const res = await fetch(url, {
    headers: { traceParent, channelId }
  });
  if (!res.ok) throw new Error(`Error fetching ${url}`);
  const data = await res.json();

  localStorage.setItem(
    cacheKey,
    JSON.stringify({ timestamp: Date.now(), data })
  );
  return data;
}
