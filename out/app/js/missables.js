/**
 * View rendering logic for the missable trophies section.
 */

/**
 * Renders the list of missable trophies in the provided container.
 * This view ignores current filters to ensure all missable trophies are always visible.
 * @param {HTMLElement} targetContainer - The container element to render into.
 * @param {Array<Object>} allTrophies - The list of all trophies.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @param {string|null} selectedTrophyName - The name of the currently selected trophy.
 * @param {Function} onSelect - Callback function triggered when a trophy card is clicked.
 */
export function renderMissables(targetContainer, allTrophies, earnedSet, selectedTrophyName, onSelect) {
  targetContainer.replaceChildren();
  
  const missableTrophies = allTrophies.filter((t) => t.missable);
  const earnedCount = missableTrophies.filter((t) => earnedSet.has(t.name)).length;
  
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = `Trophies whose official descriptions describe a single event, a chain that resets, or a choice with consequences — the ones to plan for rather than grind. ${earnedCount} of ${missableTrophies.length} earned. Each note below is drawn from the description’s own wording.`;
  targetContainer.append(intro);
  
  if (!missableTrophies.length) {
    const message = document.createElement('p');
    message.textContent = 'No missable trophies found in the data.';
    targetContainer.append(message);
    return;
  }
  
  for (const trophy of missableTrophies) {
    const card = document.createElement('article');
    const isEarned = earnedSet.has(trophy.name);
    const isSelected = selectedTrophyName === trophy.name;
    
    card.className = `tcard ${isEarned ? 'earned' : ''} ${isSelected ? 'selected' : ''}`.trim();
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Trophy: ${trophy.name}, Grade: ${trophy.grade}, ${isEarned ? 'Earned' : 'Not earned'}`);
    
    card.addEventListener('click', () => onSelect(trophy.name));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        onSelect(trophy.name); 
      }
    });
    
    const meta = document.createElement('div');
    meta.className = 'tmeta';
    
    const row1 = document.createElement('div');
    row1.className = 'trow1';
    
    const name = document.createElement('p');
    name.className = 'tname';
    name.textContent = trophy.name;
    
    const grade = document.createElement('span');
    grade.className = `badge ${trophy.grade}`;
    grade.textContent = trophy.grade;
    
    const kind = document.createElement('span');
    kind.className = 'badge kind';
    kind.textContent = trophy.kind;
    
    row1.append(name, grade, kind);
    
    const note = document.createElement('p');
    note.className = 'tdesc';
    note.textContent = trophy.missableNote;
    
    meta.append(row1, note);
    card.append(meta);
    targetContainer.append(card);
  }
}
