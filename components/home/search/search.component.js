export function initSearch(onSearch, onReset) {
  const btn = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');

  btn.addEventListener('click', () => {
    btn.classList.add('d-none');
    input.style.display = 'block';
    input.focus();
  });

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    onSearch(term);
  });

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      onSearch(input.value.trim().toLowerCase());
    }
  });

  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.style.display = 'none';
      btn.classList.remove('d-none');
      onReset();
    }
  });
}
