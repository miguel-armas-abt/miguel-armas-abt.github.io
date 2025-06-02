export function isDarkMode() {
    return localStorage.getItem('darkMode') === 'true';
}

export function setDarkMode(active) {
    localStorage.setItem('darkMode', active);
}
