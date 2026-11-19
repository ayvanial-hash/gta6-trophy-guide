// Filter state and matching: text search (quote-normalised), kind, grade, missable-only,
// hide-earned, and spoiler mode, which hides story trophies' names and guides until earned.
export const filters = { search: '', kind: 'all', grade: 'all', missableOnly: false, hideEarned: false, spoiler: false };

// Curly quotes and asterisks off so a search for "ass drug" or "ts ass" finds the
// asterisked trophy without typing its exact punctuation.
function normalize(text) {
  return text.toLowerCase().replace(/["’‘“”*]/g, '');
}

export function bindFilters(onChange) {
  const q = document.getElementById('search');
  q.addEventListener('input', () => { filters.search = normalize(q.value); onChange(); });
  for (const [id, key] of [['kindfilter', 'kind'], ['gradefilter', 'grade']]) {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { filters[key] = el.value; onChange(); });
  }
  for (const [id, key] of [['missablefilter', 'missableOnly'], ['hideearned', 'hideEarned'], ['spoiler', 'spoiler']]) {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { filters[key] = el.checked; onChange(); });
  }
}

export function visibleTrophies(trophies, earned) {
  return trophies.filter((t) => {
    if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (filters.hideEarned && earned.has(t.name)) return false;
    if (filters.search) {
      const hay = normalize(t.name + ' ' + t.description + ' ' + t.kind + ' ' + t.guide);
      if (!hay.includes(filters.search)) return false;
    }
    return true;
  });
}

// Spoiler mode hides the name and description of story trophies until they are earned.
export function isSpoiled(t, earned) {
  return filters.spoiler && t.kind === 'story' && !earned.has(t.name);
}
