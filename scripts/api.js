export const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en ms

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
  localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  return data;
}
