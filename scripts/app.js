import { loadConfig }          from './commons/config/properties.js';
import { getProfile, getRepos } from './repository/repos_repository.js';
import { initThemeToggle }     from './view/themeToggle.js';
import { initSearch }          from './view/search.js';
import { clearCarousel, renderCarousel } from './view/carousel.js';
import { initTabs }            from './view/tabs.js';
import { generateTraceParent } from './commons/tracing/tracing.js';

let currentRepos = [];

async function loadProfileAndTabs() {
  const traceParent = generateTraceParent();
  const profile     = await getProfile(traceParent);

  document.getElementById('profileName').textContent = profile.fullName;
  document.getElementById('profilePhoto').src        = profile.photoUrl;
  document.getElementById('profileLink').href        = profile.linkedinUrl;
  document.getElementById('downloadCv').href         = profile.cvUrl;
  document.getElementById('githubLink').href         = profile.gitHubUrl;

  const tabsContainer = document.getElementById('filterTabs');
  tabsContainer.innerHTML = '';
  profile.repoFilters
    .sort((a, b) => a.priority - b.priority)
    .forEach((filter, idx) => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const btn = document.createElement('button');
      btn.className      = `nav-link${idx === 0 ? ' active' : ''}`;
      btn.dataset.filter = filter.key;
      btn.textContent    = filter.description;
      li.appendChild(btn);
      tabsContainer.appendChild(li);
    });

  // Return the *first* filter key so we have a fallback.
  return profile.repoFilters[0]?.key || '';
}

async function loadAndRender(label) {
  clearCarousel();
  document.getElementById('loading').classList.remove('d-none');
  try {
    const traceParent = generateTraceParent();
    currentRepos = await getRepos(label, traceParent);
    document.getElementById('loading').classList.add('d-none');
    renderCarousel(currentRepos);
  } catch {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
  }
}

async function init() {
  // Show global loader & disable search until ready
  const loader       = document.getElementById('globalLoader');
  const searchBtn    = document.getElementById('searchBtn');
  const searchInput  = document.getElementById('searchInput');
  loader.classList.remove('d-none');
  searchBtn.disabled   = true;
  searchInput.disabled = true;

  // 1. Load config + profile (and build tabs)
  await loadConfig();
  const fallbackLabel = await loadProfileAndTabs();

  // 2. Init UI controls
  initThemeToggle();
  initTabs(loadAndRender);

  initSearch(
    term => {
      clearCarousel();
      const filtered = currentRepos.filter(r =>
        r.name.toLowerCase().includes(term)
      );
      renderCarousel(filtered);
    },
    () => {
      clearCarousel();
      renderCarousel(currentRepos);
    }
  );

  // 3. Determine which tab should actually drive the first load:
  //    Use what's in localStorage (initTabs applied it), otherwise fallback.
  const activeBtn = document.querySelector('#filterTabs .nav-link.active');
  const initialLabel = activeBtn?.dataset.filter || fallbackLabel;
  await loadAndRender(initialLabel);

  // 4. Hide global loader & enable search
  loader.classList.add('d-none');
  searchBtn.disabled   = false;
  searchInput.disabled = false;

  // 5. Re-render when crossing mobile/desktop breakpoint
  let prevIsMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    const currIsMobile = window.innerWidth < 768;
    if (currIsMobile !== prevIsMobile) {
      prevIsMobile = currIsMobile;
      clearCarousel();
      renderCarousel(currentRepos);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
