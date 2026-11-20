/**
 * View rendering logic for the platinum roadmap section.
 */

/**
 * Creates a trophy card element for the roadmap.
 * @param {Object} trophy - The trophy object.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @param {string|null} selectedTrophyName - The name of the currently selected trophy.
 * @param {Function} onSelect - Callback function triggered when a trophy card is clicked.
 * @returns {HTMLElement} The trophy card element.
 */
function createRoadmapTrophyCard(trophy, earnedSet, selectedTrophyName, onSelect) {
  const card = document.createElement('article');
  const isEarned = earnedSet.has(trophy.name);
  const isSelected = selectedTrophyName === trophy.name;
  
  card.className = `tcard ${isEarned ? 'earned' : ''} ${isSelected ? 'selected' : ''}`.trim();
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${trophy.name}${isEarned ? ' (earned)' : ''}`);
  
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
  
  row1.append(name, grade);
  
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge missable';
    missableBadge.textContent = 'missable';
    row1.append(missableBadge);
  }
  
  const line = document.createElement('p');
  line.className = 'tdesc';
  const firstGuideLine = trophy.guide.split('\n')[0];
  line.textContent = firstGuideLine.length > 160 ? `${firstGuideLine.slice(0, 160)}…` : firstGuideLine;
  
  meta.append(row1, line);
  card.append(meta);
  
  return card;
}

/**
 * Renders the roadmap in the provided container.
 * @param {HTMLElement} container - The container element to render into.
 * @param {Object} roadmapDoc - The roadmap documentation object containing trophies and roadmap stages.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @param {string|null} selectedTrophyName - The name of the currently selected trophy.
 * @param {Function} onSelect - Callback function triggered when a trophy card is clicked.
 */
export function renderRoadmap(container, roadmapDoc, earnedSet, selectedTrophyName, onSelect) {
  container.replaceChildren();
  
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = 'Suggested order to the platinum, built from what each official description asks for: story first (chapters and named missions), then the stranger strands, then activities, collectibles and exploration, then the economy and one-off stunts, and finally the 100% cleanup. Each stage counts what you have already marked earned.';
  container.append(intro);
  
  const trophiesByStage = new Map();
  for (const trophy of roadmapDoc.trophies) {
    const stageKey = String(trophy.roadmapStage).split('.')[0];
    if (!trophiesByStage.has(stageKey)) {
      trophiesByStage.set(stageKey, []);
    }
    trophiesByStage.get(stageKey).push(trophy);
  }
  
  for (const stage of roadmapDoc.roadmap) {
    const group = trophiesByStage.get(String(stage.stage)) ?? [];
    const earnedCount = group.filter((t) => earnedSet.has(t.name)).length;
    
    const header = document.createElement('h3');
    header.className = 'stagehead';
    header.textContent = `Stage ${stage.stage} — ${stage.name}`;
    
    const countBadge = document.createElement('span');
    countBadge.className = `badge kind stagecount ${earnedCount === group.length ? 'complete' : ''}`.trim();
    countBadge.textContent = `${earnedCount} / ${group.length} earned`;
    
    header.append(countBadge);
    
    const blurb = document.createElement('p');
    blurb.className = 'stageblurb';
    blurb.textContent = stage.blurb;
    
    container.append(header, blurb);
    
    for (const trophy of group) {
      container.append(createRoadmapTrophyCard(trophy, earnedSet, selectedTrophyName, onSelect));
    }
  }
}
