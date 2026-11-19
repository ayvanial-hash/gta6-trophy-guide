// Persistent state: earned trophies, the spoiler setting, and progress export/import.
// Everything lives in localStorage so progress survives reloads; export/import round-trips
// through a JSON file and import only accepts names the official list holds.
const EARNED_KEY = 'gta6-trophies-earned-v2';
const SPOILER_KEY = 'gta6-spoiler-mode-v2';

export function loadEarned() {
  try {
    const list = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    if (!Array.isArray(list)) return new Set();
    return new Set(list.filter((n) => typeof n === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort()));
}

export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoiler(on) {
  localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
}

export function exportProgress(earned) {
  const payload = JSON.stringify({
    app: 'Leonida Legend — GTA VI trophy tracker',
    version: 2,
    exported: new Date().toISOString(),
    earned: [...earned].sort(),
  }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Merges an exported file into what the tracker already holds, keeping only names on the
// official list; v1 files (a bare array or an {earned} object) import too.
export async function importProgress(file, current = new Set(), knownNames = null) {
  const data = JSON.parse(await file.text());
  const list = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(list)) throw new Error('not a progress file');
  const merged = new Set(current);
  for (const name of list) {
    if (typeof name !== 'string') continue;
    if (knownNames && !knownNames.includes(name)) continue;
    merged.add(name);
  }
  return merged;
}
