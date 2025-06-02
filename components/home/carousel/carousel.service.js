import { getRepos } from '../../../repository/repos_repository.js';
import { generateTraceParent } from '../../../commons/tracing.js';
import {
  clearCarousel,
  renderCarousel,
  updateCarouselIndicator,
  updateExpandButtons
} from './carousel.component.js';

export async function loadAndRenderCarousel(label) {
  clearCarousel();
  document.getElementById('loading').classList.remove('d-none');
  try {
    const traceParent = generateTraceParent();
    const repos = await getRepos(label, traceParent);
    repos.sort((a, b) => a.priority - b.priority);
    document.getElementById('loading').classList.add('d-none');
    renderCarousel(repos);
    updateCarouselIndicator();
    updateExpandButtons();
    return repos;
  } catch {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
    return [];
  }
}
