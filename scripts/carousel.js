import { getConfig } from './config.js';

export function clearCarousel() {
  const container = document.getElementById('carouselInner');
  container.innerHTML = '';
  document.getElementById('error').classList.add('d-none');
  document.getElementById('noData').classList.add('d-none');
}

export function renderCarousel(repos) {
  const container = document.getElementById('carouselInner');

  if (repos.length === 0) {
    document.getElementById('noData').classList.remove('d-none');
    return;
  }

  const { carouselSize } = getConfig();

  repos.forEach((repo, i) => {
    const slideIndex = Math.floor(i / carouselSize);
    let slide = container.children[slideIndex];
    if (!slide) {
      slide = document.createElement('div');
      slide.className = 'carousel-item' + (slideIndex === 0 ? ' active' : '');
      const row = document.createElement('div');
      row.className = 'd-flex';
      slide.appendChild(row);
      container.appendChild(slide);
    }

    const card = document.createElement('div');
    card.className = 'card card-custom d-flex flex-column';
    card.onclick = () => window.open(repo.url, '_blank');
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${repo.imageUrl}" class="card-img-top" alt="${repo.name}">
        <div class="label-pill"
             data-bs-toggle="tooltip"
             data-bs-trigger="hover focus"
             data-bs-placement="top"
             data-bs-container="body"
             title="Último push: ${repo.pushedAt}">
          ${repo.name}
        </div>
        <div class="watcher-pill">
          <i class="fas fa-eye me-1"></i><span>${repo.watchersCount}</span>
        </div>
      </div>
      <div class="card-body">
        <p class="card-text mb-2">${repo.description}</p>
      </div>
    `;

    slide.firstChild.appendChild(card);
  });

  const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  triggers.forEach(el => new bootstrap.Tooltip(el));
}
