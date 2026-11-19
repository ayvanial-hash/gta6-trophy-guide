// The checklist: one card per trophy with its checkbox, grade badge, kind and missable
// flags, and keyboard access (every card is a button-like article; Enter opens its guide).
import { isSpoiled } from './filters.js';

function gradeRow(t) {
  const row = document.createElement('div');
  row.className = 'trow1';
  const name = document.createElement('p');
  name.className = 'tname';
  name.textContent = t.name;
  row.append(name);
  const grade = document.createElement('span');
  grade.className = 'badge ' + t.grade;
  grade.textContent = t.grade;
  row.append(grade);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'badge missable';
    m.textContent = 'missable';
    row.append(m);
  }
  const kind = document.createElement('span');
  kind.className = 'badge kind';
  kind.textContent = t.kind;
  row.append(kind);
  return row;
}

function descriptionLine(t) {
  const desc = document.createElement('p');
  desc.className = 'tdesc';
  desc.textContent = t.description + (t.count ? ' (' + t.count + ')' : '');
  return desc;
}

function card(t, earned, selected, onSelect, onToggle) {
  const card = document.createElement('article');
  card.className = 'tcard' + (earned.has(t.name) ? ' earned' : '') + (selected === t.name ? ' selected' : '');
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', t.name + (earned.has(t.name) ? ' (earned)' : ''));
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
  box.addEventListener('click', (e) => e.stopPropagation());
  box.addEventListener('change', () => onToggle(t.name, box.checked));
  const meta = document.createElement('div');
  meta.className = 'tmeta';
  meta.append(gradeRow(t), descriptionLine(t));
  card.append(box, meta);
  if (isSpoiled(t, earned)) card.classList.add('spoiled');
  card.addEventListener('click', () => onSelect(t.name));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(t.name); }
  });
  return card;
}

export function renderChecklist(container, trophies, earned, selected, onSelect, onToggle) {
  container.replaceChildren();
  for (const t of trophies) container.append(card(t, earned, selected, onSelect, onToggle));
  if (!trophies.length) {
    const p = document.createElement('p');
    p.className = 'stageblurb';
    p.textContent = 'No trophies match the current filters — clear the search or pick another kind.';
    container.append(p);
  }
}
