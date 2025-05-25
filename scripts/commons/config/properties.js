let _config = null;

export async function loadConfig() {
  const res = await fetch('/config.json');
  if (!res.ok) {
    throw new Error(`Error loading config.json: ${res.status}`);
  }
  _config = await res.json();
}

export function getConfig() {
  if (!_config) {
    throw new Error('Config not loaded. First call to loadConfig().');
  }
  return _config;
}