/**
 * View rendering logic for the trophy checklist.
 */

import { isSpoiled } from './filters.js';

/**
 * Creates the trophy header row containing the name, grade, missable status, and kind.
 * @param {Object} trophy - The trophy object.
 * @returns {HTMLElement} The header row element.
 */
function createTrophyHeader(trophy) {
  const row = document.createElement('div');
  row.className = 'trow1';
  
  const name = document.createElement('p');
  name.className = 'tname';
  name.textContent = trophy.name;
  row.append(name);
  
  const grade = document.createElement('span');
  grade.className = `badge ${trophy.grade}`;
  grade.textContent = trophy.grade;
  row.append(grade);
  
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge missable';
    missableBadge.textContent = 'missable';
    row.append(missableBadge);
  }
  
  const kind = document.createElement('span');
  kind.className = 'badge kind';
  kind.textContent = trophy.kind;
  row.append(kind);
  
  return row;
}

/**
 * Creates the trophy description line.
 * @param {Object} trophy - The trophy object.
 * @returns {HTMLElement} The description line element.
 */
function createDescriptionLine(trophy) {
  const desc = document.createElement('p');
  desc.className = 'tdesc';
  desc.textContent = trophy.count ? `${trophy.description} (${trophy.count})` : trophy.description;
  return desc;
}

/**
 * Creates a trophy card element.
 * @param {Object} trophy - The trophy object.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @param {string|null} selectedTrophyName - The name of the currently selected trophy.
 * @param {Function} onSelect - Callback function triggered when a trophy card is clicked.
 * @param {Function} onToggle - Callback function triggered when the checkbox is toggled.
 * @returns {HTMLElement} The trophy card element.
 */
function createTrophyCard(trophy, earnedSet, selectedTrophyName, onSelect, onToggle) {
  const card = document.createElement('article');
  const isEarned = earnedSet.has(trophy.name);
  const isSelected = selectedTrophyName === trophy.name;
  
  card.className = `tcard ${isEarned ? 'earned' : ''} ${isSelected ? 'selected' : ''}`.trim();
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${trophy.name}${isEarned ? ' (earned)' : ''}`);
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isEarned;
  checkbox.setAttribute('aria-label', `Mark ${trophy.name} earned`);
  checkbox.addEventListener('click', (e) => e.stopPropagation());
  checkbox.addEventListener('change', () => onToggle(trophy.name, checkbox.checked));
  
  const meta = document.createElement('div');
  meta.className = 'tmeta';
  meta.append(createTrophyHeader(trophy), createDescriptionLine(trophy));
  
  card.append(checkbox, meta);
  
  // Apply the spoiled class if the trophy is story-related and not yet earned
  if (isSpoiled(trophy, earnedSet)) {
    card.classList.add('spoiled');
  }
  
  card.addEventListener('click', () => onSelect(trophy.name));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { 
      e.preventDefault(); 
      onSelect(trophy.name); 
    }
  });
  
  return card;
}

/**
 * Renders the trophy checklist in the provided container.
 * @param {HTMLElement} targetContainer - The container element to render into.
 * @param {Array<Object>} trophies - The list of trophies to render.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 * @param {string|null} selectedTrophyName - The name of the currently selected trophy.
 * @param {Function} onSelect - Callback function triggered when a trophy card is clicked.
 * @param {Function} onToggle - Callback function triggered when the checkbox is toggled.
 */
export function renderChecklist(targetContainer, trophies, earnedSet, selectedTrophyName, onSelect, onToggle) {
  targetContainer.replaceChildren();
  
  for (const trophy of trophies) {
    targetContainer.append(createTrophyCard(trophy, earnedSet, selectedTrophyName, onSelect, onToggle));
  }
  
  if (!trophies.length) {
    const message = document.createElement('p');
    message.className = 'stageblurb';
    message.textContent = 'No trophies match the current filters — clear the search or pick another kind.';
    targetContainer.append(message);
  }
}

// Leonida Legend refresh pass: checklist management module
