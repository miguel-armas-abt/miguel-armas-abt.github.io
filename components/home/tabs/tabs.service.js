export function getSavedTab() {
    return localStorage.getItem('selectedTab');
}

export function setSavedTab(filter) {
    localStorage.setItem('selectedTab', filter);
}
