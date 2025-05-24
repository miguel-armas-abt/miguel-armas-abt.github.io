// scripts/tabs.js
/**
 * Inicializa el sistema de pestañas (tabs).
 * @param {function(string):void} onTabSelect 
 */
export function initTabs(onTabSelect) {
  const tabs = document.querySelectorAll('#filterTabs .nav-link');
  const saved = localStorage.getItem('selectedTab');

  // Marcar la pestaña guardada (si existe)
  if (saved) {
    tabs.forEach(tab => {
      if (tab.dataset.filter === saved) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#filterTabs .nav-link').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      localStorage.setItem('selectedTab', tab.dataset.filter);
      onTabSelect(tab.dataset.filter);
    });
  });
}
