// Persistent state: earned trophies, spoiler setting, and the selected trophy.
// Everything lives in localStorage so progress survives reloads.
const EARNED_KEY = 'gta6-trophies-earned-v1';
const SPOILER_KEY = 'gta6-spoiler-mode-v1';

export function loadEarned() {
  try { return new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]')); }
  catch { return new Set(); }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoiler(on) {
  localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
}

export function exportProgress(earned) {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importProgress(file) {
  const data = JSON.parse(await file.text());
  const list = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(list)) throw new Error('not a progress file');
  return new Set(list);
}
