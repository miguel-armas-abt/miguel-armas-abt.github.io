import { loadConfig } from './commons/config/properties.js';
import { getProfile, getRepos } from './repository/repos_repository.js';
import { initThemeToggle } from './view/themeToggle.js';
import { initSearch } from './view/search.js';
import { clearCarousel, renderCarousel, updateExpandButtons } from './view/carousel.js';
import { initTabs } from './view/tabs.js';
import { generateTraceParent } from './commons/tracing/tracing.js';

let currentRepos = [];

function updateCarouselIndicator() {
  const carousel = document.getElementById('repoCarousel');
  const items = Array.from(carousel.querySelectorAll('.carousel-item'));
  const total = items.length;
  const activeItem = carousel.querySelector('.carousel-item.active');
  const index = items.indexOf(activeItem) + 1;
  document.getElementById('carouselIndicator').textContent = `${index}/${total}`;
}

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

async function loadAndRender(label) {
  clearCarousel();
  document.getElementById('loading').classList.remove('d-none');
  try {
    const traceParent = generateTraceParent();
    currentRepos = await getRepos(label, traceParent);
    currentRepos.sort((a, b) => a.priority - b.priority);
    document.getElementById('loading').classList.add('d-none');
    renderCarousel(currentRepos);
    updateCarouselIndicator();
    updateExpandButtons();
  } catch {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
  }
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
  initTabs(loadAndRender);

  initSearch(
    term => {
      clearCarousel();
      const filtered = currentRepos.filter(r =>
        r.name.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
      );
      renderCarousel(filtered);
      updateCarouselIndicator();
      updateExpandButtons();
    },
    () => {
      clearCarousel();
      renderCarousel(currentRepos);
      updateCarouselIndicator();
      updateExpandButtons();
    }
  );

  const activeBtn = document.querySelector('#filterTabs .nav-link.active');
  const initialLabel = activeBtn?.dataset.filter || fallbackLabel;
  await loadAndRender(initialLabel);

  loader.classList.add('d-none');
  searchBtn.disabled = false;
  searchInput.disabled = false;

  const carouselEl = document.getElementById('repoCarousel');
  carouselEl.addEventListener('slid.bs.carousel', () => {
    updateCarouselIndicator();
    updateExpandButtons();
  });

  let prevIsMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    const currIsMobile = window.innerWidth < 768;
    if (currIsMobile !== prevIsMobile) {
      prevIsMobile = currIsMobile;
      clearCarousel();
      renderCarousel(currentRepos);
      updateCarouselIndicator();
      updateExpandButtons();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
