export function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = toggle.querySelector('i');
  const isDark = localStorage.getItem('darkMode') === 'true';

  if (isDark) document.body.classList.add('dark-mode');
  icon.classList.toggle('fa-sun', isDark);
  icon.classList.toggle('fa-moon', !isDark);

  toggle.addEventListener('click', () => {
    const active = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', active);
    icon.classList.toggle('fa-sun', active);
    icon.classList.toggle('fa-moon', !active);
  });
}
