import { loadConfig } from './commons/properties.js';
import { getProfile } from './repository/repos_repository.js';
import { generateTraceParent } from './commons/tracing.js';

import { initThemeToggle } from './components/home/theme-toggle/themeToggle.component.js';
import { initTabs } from './components/home/tabs/tabs.component.js';
import { initSearch } from './components/home/search/search.component.js';
import { filterRepos } from './components/home/search/search.service.js';
import { loadAndRenderCarousel } from './components/home/carousel/carousel.service.js';

let currentRepos = [];

async function loadProfileAndTabs() {
  const traceParent = generateTraceParent();
  const profile = await getProfile(traceParent);

  document.getElementById('profileName').textContent = profile.fullName;
  document.getElementById('profilePhoto').src = profile.photoUrl;
  document.getElementById('profileLink').href = profile.linkedinUrl;
  document.getElementById('downloadCv').href = profile.cvUrl;
  document.getElementById('githubLink').href = profile.gitHubUrl;

  const tabsContainer = document.getElementById('filterTabs');
  tabsContainer.innerHTML = '';
  profile.repoFilters
    .sort((a, b) => a.priority - b.priority)
    .forEach((filter, idx) => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const btn = document.createElement('button');
      btn.className = `nav-link${idx === 0 ? ' active' : ''}`;
      btn.dataset.filter = filter.key;
      btn.textContent = filter.description;
      li.appendChild(btn);
      tabsContainer.appendChild(li);
    });

  return profile.repoFilters[0]?.key || '';
}

async function init() {
  const loader = document.getElementById('globalLoader');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  loader.classList.remove('d-none');
  searchBtn.disabled = true;
  searchInput.disabled = true;

  await loadConfig();
  const fallbackLabel = await loadProfileAndTabs();

  initThemeToggle();
  initTabs(async (label) => {
    const repos = await loadAndRenderCarousel(label);
    currentRepos = repos;
  });

  initSearch(
    term => {
      const filtered = filterRepos(currentRepos, term);
      loadFilteredCarousel(filtered);
    },
    async () => {
      const activeBtn = document.querySelector('#filterTabs .nav-link.active');
      const label = activeBtn?.dataset.filter || fallbackLabel;
      const repos = await loadAndRenderCarousel(label);
      currentRepos = repos;
    }
  );

  const activeBtn = document.querySelector('#filterTabs .nav-link.active');
  const initialLabel = activeBtn?.dataset.filter || fallbackLabel;
  const repos = await loadAndRenderCarousel(initialLabel);
  currentRepos = repos;

  loader.classList.add('d-none');
  searchBtn.disabled = false;
  searchInput.disabled = false;

  const carouselEl = document.getElementById('repoCarousel');
  carouselEl.addEventListener('slid.bs.carousel', () => {
    import('./components/home/carousel/carousel.component.js').then(module => {
      module.updateCarouselIndicator();
      module.updateExpandButtons();
      module.updateControlsVisibility();
    });
  });

  let prevIsMobile = window.innerWidth < 768;
  window.addEventListener('resize', async () => {
    const currIsMobile = window.innerWidth < 768;
    if (currIsMobile !== prevIsMobile) {
      prevIsMobile = currIsMobile;
      const activeLab = document.querySelector('#filterTabs .nav-link.active')?.dataset.filter || fallbackLabel;
      const reposRe = await loadAndRenderCarousel(activeLab);
      currentRepos = reposRe;
    }
  });
}

async function loadFilteredCarousel(filteredRepos) {
  const {
    clearCarousel,
    renderCarousel,
    updateCarouselIndicator,
    updateExpandButtons,
    updateControlsVisibility
  } = await import('./components/home/carousel/carousel.component.js');

  clearCarousel();
  renderCarousel(filteredRepos);
  updateCarouselIndicator();
  updateExpandButtons();
  updateControlsVisibility();
}

document.addEventListener('DOMContentLoaded', init);
