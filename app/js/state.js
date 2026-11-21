/**
 * Persistent state management for trophy progress and user settings.
 * Data is stored in localStorage.
 */

const EARNED_KEY = 'gta6-trophies-earned-v2';
const SPOILER_KEY = 'gta6-spoiler-mode-v2';

/**
 * Loads the set of earned trophy names from localStorage.
 * @returns {Set<string>} A set containing the names of all earned trophies.
 */
export function loadEarned() {
  try {
    const rawData = localStorage.getItem(EARNED_KEY) ?? '[]';
    const parsedList = JSON.parse(rawData);
    if (!Array.isArray(parsedList)) return new Set();
    return new Set(parsedList.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

/**
 * Persists the set of earned trophy names to localStorage.
 * @param {Set<string>} earnedSet - The set of earned trophies.
 */
export function saveEarned(earnedSet) {
  const sortedList = [...earnedSet].sort();
  localStorage.setItem(EARNED_KEY, JSON.stringify(sortedList));
}

/**
 * Checks if spoiler mode is enabled.
 * @returns {boolean} True if spoiler mode is enabled, false otherwise.
 */
export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

/**
 * Sets the spoiler mode preference.
 * @param {boolean} isEnabled - Whether to enable or disable spoiler mode.
 */
export function saveSpoiler(isEnabled) {
  localStorage.setItem(SPOILER_KEY, isEnabled ? 'on' : 'off');
}

/**
 * Exports the current trophy progress as a JSON file.
 * @param {Set<string>} earnedSet - The set of earned trophies.
 */
export function exportProgress(earnedSet) {
  const payload = {
    app: 'Leonida Legend — GTA VI trophy tracker',
    version: 2,
    exported: new Date().toISOString(),
    earned: [...earnedSet].sort(),
  };
  
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'gta6-trophy-progress.json';
  downloadLink.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Imports trophy progress from a JSON file and merges it with the current progress.
 * Only valid trophy names present in the official list are imported.
 * @param {File} file - The uploaded progress JSON file.
 * @param {Set<string>} currentSet - The currently loaded progress set.
 * @param {string[]|null} [validTrophyNames=null] - Optional list of official trophy names to validate against.
 * @returns {Promise<Set<string>>} A promise that resolves to the merged set of earned trophies.
 * @throws {Error} If the file is not a valid progress file.
 */
export async function importProgress(file, currentSet = new Set(), validTrophyNames = null) {
  const data = JSON.parse(await file.text());
  const importedList = Array.isArray(data) ? data : data.earned;
  
  if (!Array.isArray(importedList)) {
    throw new Error('Invalid progress file format.');
  }
  
  const mergedSet = new Set(currentSet);
  
  for (const name of importedList) {
    if (typeof name !== 'string') continue;
    if (validTrophyNames && !validTrophyNames.includes(name)) continue;
    mergedSet.add(name);
  }
  
  return mergedSet;
}

// Leonida Legend refresh pass: state management module
