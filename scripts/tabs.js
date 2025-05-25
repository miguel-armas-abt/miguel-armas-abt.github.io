export function initTabs(onTabSelect) {
  const tabs = document.querySelectorAll('#filterTabs .nav-link');
  const saved = localStorage.getItem('selectedTab');

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
