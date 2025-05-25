/**
 * Inicializa la búsqueda de repositorios.
 * @param {(term: string) => void} onSearch   Lógica al cambiar texto
 * @param {() => void}           onReset    Lógica al cancelar búsqueda
 */
export function initSearch(onSearch, onReset) {
  const btn   = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');

  // Mostrar input, ocultar botón
  btn.addEventListener('click', () => {
    btn.classList.add('d-none');
    input.style.display = 'block';
    input.focus();
  });

  // Al escribir, filtro en tiempo real
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    onSearch(term);
  });

  // Al presionar Enter, también filtrar
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      onSearch(input.value.trim().toLowerCase());
    }
  });

  // Al quitar foco y no hay texto, revertimos todo
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.style.display = 'none';
      btn.classList.remove('d-none');
      onReset();
    }
  });
}
