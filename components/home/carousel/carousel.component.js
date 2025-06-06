import { getConfig } from '../../../commons/properties.js';

export function createCard(repo) {
  const card = document.createElement('div');
  card.className = 'card card-custom d-flex flex-column';
  card.onclick = () => window.open(repo.url, '_blank');

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'card-img-wrapper position-relative';
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border text-turquoise position-absolute top-50 start-50 translate-middle';
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = `<span class="visually-hidden">Cargando imagen…</span>`;
  imgWrapper.appendChild(spinner);

  const img = document.createElement('img');
  img.className = 'card-img-top d-none';
  img.alt = repo.name;
  img.src = repo.imageUrl;
  img.decoding = 'async';
  img.onload = () => {
    spinner.remove();
    img.classList.remove('d-none');
  };
  imgWrapper.appendChild(img);

  const label = document.createElement('div');
  label.className = 'label-pill';
  label.setAttribute('data-bs-toggle', 'tooltip');
  label.setAttribute('data-bs-trigger', 'hover focus');
  label.setAttribute('data-bs-placement', 'top');
  label.setAttribute('data-bs-container', 'body');
  label.title = `Último push: ${repo.pushedAt}`;
  label.textContent = repo.name;
  imgWrapper.appendChild(label);

  const watcher = document.createElement('div');
  watcher.className = 'watcher-pill';
  watcher.innerHTML = `<i class="fas fa-eye me-1"></i><span>${repo.watchersCount}</span>`;
  imgWrapper.appendChild(watcher);

  const body = document.createElement('div');
  body.className = 'card-body';

  const descContainer = document.createElement('div');
  descContainer.className = 'description-container';
  const desc = document.createElement('div');
  desc.className = 'card-text';
  desc.innerHTML = repo.description || '';
  descContainer.appendChild(desc);
  body.appendChild(descContainer);

  card.appendChild(imgWrapper);
  card.appendChild(body);
  return card;
}

export function clearCarousel() {
  const container = document.getElementById('carouselInner');
  container.innerHTML = '';
  document.getElementById('error').classList.add('d-none');
  document.getElementById('noData').classList.add('d-none');
}

export function renderCarousel(repos) {
  const container = document.getElementById('carouselInner');
  clearCarousel();

  if (repos.length === 0) {
    document.getElementById('noData').classList.remove('d-none');
    return;
  }

  const { carouselSize } = getConfig();
  const isMobile = window.matchMedia('(max-width: 767.98px)').matches;

  if (isMobile) {
    repos.forEach(repo => container.appendChild(createCard(repo)));
  } else {
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
      slide.querySelector('.d-flex').appendChild(createCard(repo));
    });
  }

  document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach(el => new bootstrap.Tooltip(el));

  updateExpandButtons();
  updateCarouselIndicator();
  updateControlsVisibility();
}

export function updateExpandButtons() {
  const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
  let cards = [];

  if (isMobile) {
    cards = Array.from(document.querySelectorAll('#carouselInner .card-custom'));
  } else {
    const activeSlide = document.querySelector('#repoCarousel .carousel-item.active');
    if (!activeSlide) return;
    cards = Array.from(activeSlide.querySelectorAll('.card-custom'));
  }

  cards.forEach(card => {
    const body = card.querySelector('.card-body');
    if (body.querySelector('.expand-btn')) return;

    const descContainer = body.querySelector('.description-container');
    const desc = descContainer.querySelector('.card-text');
    if (desc.scrollHeight > descContainer.clientHeight) {
      const btn = document.createElement('button');
      btn.className = 'expand-btn';
      btn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (isMobile) {
          card.classList.toggle('expanded');
        } else {
          const activeSlide = document.querySelector('#repoCarousel .carousel-item.active');
          activeSlide.querySelectorAll('.card-custom')
              .forEach(c => c.classList.toggle('expanded'));
        }
      });
      body.appendChild(btn);
    }
  });
}

export function updateCarouselIndicator() {
  const items = Array.from(document.querySelectorAll('#repoCarousel .carousel-item'));
  const total = items.length;
  const activeItem = document.querySelector('#repoCarousel .carousel-item.active');
  const index = items.indexOf(activeItem) + 1;

  document.getElementById('carouselIndicator').textContent = `${index}/${total}`;
  updateControlsVisibility();
}

export function updateControlsVisibility() {
  const items = Array.from(document.querySelectorAll('#repoCarousel .carousel-item'));
  const total = items.length;
  const activeItem = document.querySelector('#repoCarousel .carousel-item.active');
  const index = items.indexOf(activeItem) + 1;

  const prevBtn = document.querySelector('#repoCarousel .carousel-control-prev');
  const nextBtn = document.querySelector('#repoCarousel .carousel-control-next');

  if (index <= 1) {
    prevBtn.classList.add('d-none');
    prevBtn.classList.remove('d-md-flex');
  } else {
    prevBtn.classList.remove('d-none');
    prevBtn.classList.add('d-md-flex');
  }

  if (index >= total) {
    nextBtn.classList.add('d-none');
    nextBtn.classList.remove('d-md-flex');
  } else {
    nextBtn.classList.remove('d-none');
    nextBtn.classList.add('d-md-flex');
  }
}
