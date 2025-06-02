import { isDarkMode, setDarkMode } from './themeToggle.service.js';

export function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = toggle.querySelector('i');
  const dark = isDarkMode();

  if (dark) document.body.classList.add('dark-mode');
  icon.classList.toggle('fa-sun', dark);
  icon.classList.toggle('fa-moon', !dark);

  toggle.addEventListener('click', () => {
    const active = document.body.classList.toggle('dark-mode');
    setDarkMode(active);
    icon.classList.toggle('fa-sun', active);
    icon.classList.toggle('fa-moon', !active);
  });
}
