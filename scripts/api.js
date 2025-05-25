// scripts/api.js

export const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en ms

/**
 * Obtiene datos de perfil, usando localStorage para cache con TTL.
 * @param {string} apiBase
 * @param {string} traceParent
 * @param {string} channelId
 * @returns {Promise<Object>}
 */
export async function getProfile(apiBase, traceParent, channelId) {
  const cacheKey = 'profileCache';
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // Si no hay cache válido, hacemos la petición
  const url = `${apiBase}/profiles/miguel-armas-abt`;
  const res = await fetch(url, {
    headers: { traceParent, channelId }
  });
  if (!res.ok) throw new Error(`Error fetching profile ${url}`);
  const data = await res.json();

  // Guardamos en cache
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ timestamp: Date.now(), data })
  );

  return data;
}

/**
 * Obtiene repos por etiqueta, usando localStorage para cache con TTL.
 * @param {string} label
 * @param {string} apiBase
 * @param {string} traceParent
 * @param {string} channelId
 * @returns {Promise<Array>}
 */
export async function getRepos(label, apiBase, traceParent, channelId) {
  const cacheKey = `repoCache_${label}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const url = `${apiBase}/users/miguel-armas-abt/repos?label=${label}`;
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
