/**
 * Inicializa la búsqueda.
 * @param {function(string):void} onSearch
 */
export function initSearch(onSearch) {
  const btn = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');

  btn.addEventListener('click', () => {
    btn.classList.toggle('d-none');
    input.style.display = 'block';
    input.focus();
  });

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      onSearch(input.value.trim().toLowerCase());
    }
  });
}
