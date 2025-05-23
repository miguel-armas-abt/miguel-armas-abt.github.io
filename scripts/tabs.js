/**
 * Inicializa el sistema de pestañas (tabs).
 * @param {function(string):void} onTabSelect 
 */
export function initTabs(onTabSelect) {
  const tabs = document.querySelectorAll('#filterTabs .nav-link');
  const saved = localStorage.getItem('selectedTab') || 'fundamentals';

  tabs.forEach(tab => {
    if (tab.dataset.filter === saved) tab.classList.add('active');
    tab.addEventListener('click', () => {
      document.querySelector('#filterTabs .active').classList.remove('active');
      tab.classList.add('active');
      localStorage.setItem('selectedTab', tab.dataset.filter);
      onTabSelect(tab.dataset.filter);
    });
  });

  // Carga inicial
  onTabSelect(saved);
}
