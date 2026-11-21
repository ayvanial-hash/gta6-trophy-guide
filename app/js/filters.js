/**
 * Filter state management and utility functions for filtering trophies.
 */

/**
 * Global state for trophy filters.
 */
export const filters = { 
  search: '', 
  kind: 'all', 
  grade: 'all', 
  missableOnly: false, 
  hideEarned: false, 
  spoiler: false 
};

/**
 * Normalizes text for search by removing punctuation and converting to lowercase.
 * This ensures that a search query for "ass drug" matches "A**-Drug".
 * @param {string} text - The text to normalize.
 * @returns {string} The normalized text.
 */
function normalize(text) {
  return text.toLowerCase().replace(/["’‘“”*]/g, '');
}

/**
 * Binds UI filter elements to the filter state.
 * @param {Function} onChange - Callback function to call when a filter changes.
 */
export function bindFilters(onChange) {
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => { 
    filters.search = normalize(searchInput.value); 
    onChange(); 
  });
  
  const dropdownFilters = [['kindfilter', 'kind'], ['gradefilter', 'grade']];
  for (const [id, key] of dropdownFilters) {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { 
      filters[key] = el.value; 
      onChange(); 
    });
  }
  
  const checkboxFilters = [['missablefilter', 'missableOnly'], ['hideearned', 'hideEarned'], ['spoiler', 'spoiler']];
  for (const [id, key] of checkboxFilters) {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { 
      filters[key] = el.checked; 
      onChange(); 
    });
  }
}

/**
 * Filters the list of trophies based on current filter state.
 * @param {Array<Object>} trophies - The list of all trophies.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @returns {Array<Object>} The filtered list of trophies.
 */
export function getVisibleTrophies(trophies, earnedSet) {
  return trophies.filter((t) => {
    if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (filters.hideEarned && earnedSet.has(t.name)) return false;
    
    if (filters.search) {
      const searchableText = `${t.name} ${t.description} ${t.kind} ${t.guide}`;
      if (!normalize(searchableText).includes(filters.search)) return false;
    }
    
    return true;
  });
}

/**
 * Checks if a trophy's content should be hidden due to spoiler mode.
 * Spoiler mode hides the name and description of story trophies until they are earned.
 * @param {Object} trophy - The trophy to check.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @returns {boolean} True if the trophy is spoiled, false otherwise.
 */
export function isSpoiled(trophy, earnedSet) {
  return filters.spoiler && trophy.kind === 'story' && !earnedSet.has(trophy.name);
}

// Leonida Legend refresh pass: filtering logic module
