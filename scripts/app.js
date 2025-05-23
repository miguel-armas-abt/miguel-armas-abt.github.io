import { getRepos }        from './api.js';
import { initThemeToggle } from './themeToggle.js';
import { initTabs }        from './tabs.js';
import { initSearch }      from './search.js';
import { clearCarousel, renderCarousel } from './carousel.js';

const apiBase    = 'http://localhost:8080/poc/repositories/v1';
const traceParent = '00-682c6c8de346208bb942f4fee2469715-476d65446bbd4bfb-01';
const channelId   = 'WEB';

// Estado actual de repos cargados
let currentRepos = [];

/**
 * Carga y pinta repositorios para la etiqueta dada.
 * @param {string} label
 */
async function loadAndRender(label) {
  clearCarousel();
  document.getElementById('loading').classList.remove('d-none');
  try {
    currentRepos = await getRepos(label, apiBase, traceParent, channelId);
    document.getElementById('loading').classList.add('d-none');
    renderCarousel(currentRepos);
  } catch {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTabs(loadAndRender);
  initSearch(term => {
    const filtered = currentRepos.filter(r => r.name.toLowerCase().includes(term));
    renderCarousel(filtered);
  });
});
