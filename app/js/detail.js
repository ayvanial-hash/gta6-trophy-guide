/**
 * View rendering logic for the trophy detail pane.
 */

import { isSpoiled } from './filters.js';

const FALLBACK_SOURCES = [
  { name: 'Official trophy description (PlayStation), as listed by Exophase and PSNProfiles' },
];

/**
 * Creates the sources section for the trophy detail.
 * @param {Object} trophy - The trophy object.
 * @returns {HTMLElement} The sources section element.
 */
function createSourcesSection(trophy) {
  const section = document.createElement('div');
  section.className = 'source';
  
  const title = document.createElement('h3');
  title.textContent = 'Sources';
  
  const list = document.createElement('ul');
  const sources = trophy.sources ?? FALLBACK_SOURCES;
  
  for (const source of sources) {
    const li = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.rel = 'noopener';
      li.append(link);
    } else {
      li.textContent = source.name;
    }
    list.append(li);
  }
  
  const note = document.createElement('p');
  note.className = 'sourcenote';
  note.textContent = 'Every fact above is this entry’s own wording — no guide’s text is copied; a link opens only when you follow it.';
  
  section.append(title, list, note);
  return section;
}

/**
 * Renders the trophy detail pane in the provided container.
 * @param {HTMLElement} container - The container element to render into.
 * @param {Object|null} trophy - The trophy object to render, or null.
 * @param {Set<string>} earnedSet - The set of earned trophy names.
 */
export function renderDetail(container, trophy, earnedSet) {
  container.replaceChildren();
  
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Select a trophy to read its guide.';
    container.append(hint);
    return;
  }
  
  const spoiled = isSpoiled(trophy, earnedSet);
  
  const header = document.createElement('h2');
  header.textContent = spoiled ? '??? (spoiler hidden — earn it first)' : trophy.name;
  
  const badges = document.createElement('div');
  badges.className = 'trow1';
  
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${trophy.grade}`;
  gradeBadge.textContent = trophy.count ? `${trophy.grade} · ${trophy.count}` : trophy.grade;
  badges.append(gradeBadge);
  
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = trophy.kind;
  badges.append(kindBadge);
  
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge missable';
    missableBadge.textContent = 'missable';
    badges.append(missableBadge);
  }
  
  const roadmapStage = document.createElement('p');
  roadmapStage.className = 'stageblurb';
  roadmapStage.textContent = `Roadmap stage ${trophy.roadmapStage}`;
  
  const officialDescription = document.createElement('blockquote');
  officialDescription.className = 'official';
  officialDescription.textContent = spoiled
    ? 'Official description hidden by spoiler mode.'
    : `Official description: ${trophy.description}`;
    
  const guideBody = document.createElement('div');
  guideBody.className = 'guidebody';
  guideBody.textContent = spoiled
    ? 'This is a story trophy and spoiler mode is on. Its guide stays hidden until you mark it earned.'
    : trophy.guide;
    
  container.append(header, badges, roadmapStage, officialDescription, guideBody);
  
  if (spoiled) return;
  
  if (trophy.steps && trophy.steps.length) {
    const stepsHeader = document.createElement('h3');
    stepsHeader.textContent = 'How to do it';
    
    const stepsList = document.createElement('ol');
    stepsList.className = 'steps';
    
    for (const step of trophy.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      stepsList.append(li);
    }
    container.append(stepsHeader, stepsList);
  }
  
  if (trophy.missable && trophy.missableNote) {
    const missableNote = document.createElement('div');
    missableNote.className = 'missnote';
    missableNote.textContent = `Missable — ${trophy.missableNote}`;
    container.append(missableNote);
  }
  
  container.append(createSourcesSection(trophy));
}

// Leonida Legend refresh pass: detail view module
