// scripts/app.js
import { getProfile, getRepos } from './api.js';
import { initThemeToggle }        from './themeToggle.js';
import { initSearch }             from './search.js';
import { clearCarousel, renderCarousel } from './carousel.js';
import { initTabs }               from './tabs.js';

const apiBase     = 'http://localhost:8080/poc/repositories/v1';
const traceParent = '00-682c6c8de346208bb942f4fee2469715-476d65446bbd4bfb-01';
const channelId   = 'WEB';

let currentRepos = [];

/**
 * Carga perfil y construye header y pestañas.
 */
async function loadProfileAndTabs() {
  try {
    const profile = await getProfile(apiBase, traceParent, channelId);

    // Renderizar nombre y foto
    document.getElementById('profileName').textContent = profile.fullName;
    document.getElementById('profilePhoto').src        = profile.photoUrl;
    document.getElementById('profileLink').href        = profile.photoUrl;

    // Enlace al CV
    const cvLink = document.getElementById('downloadCv');
    cvLink.href = profile.cvUrl;

    // Enlace dinámico a GitHub
    const ghLink = document.getElementById('githubLink');
    ghLink.href = profile.gitHubUrl;

    // Crear tabs dinámicos
    const tabsContainer = document.getElementById('filterTabs');
    tabsContainer.innerHTML = '';
    profile.repoFilters
      .sort((a, b) => a.priority - b.priority)
      .forEach((filt, idx) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const btn = document.createElement('button');
        btn.className = `nav-link${idx === 0 ? ' active' : ''}`;
        btn.dataset.filter = filt.key;
        btn.textContent = filt.description;
        li.appendChild(btn);
        tabsContainer.appendChild(li);
      });

    return profile.repoFilters[0]?.key || '';
  } catch (err) {
    console.error('Error cargando perfil:', err);
    return 'fundamentals';
  }
}

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

async function init() {
  const defaultLabel = await loadProfileAndTabs();
  initThemeToggle();
  initTabs(loadAndRender);
  initSearch(term => {
    const filtered = currentRepos.filter(r =>
      r.name.toLowerCase().includes(term)
    );
    renderCarousel(filtered);
  });
  // Carga inicial con la primera pestaña
  loadAndRender(defaultLabel);
}

document.addEventListener('DOMContentLoaded', init);
