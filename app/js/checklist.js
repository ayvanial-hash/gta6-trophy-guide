// The checklist: one card per trophy with its checkbox, grade badge and flags.
import { filters, isSpoiled } from './filters.js';

export function renderChecklist(container, trophies, earned, selected, onSelect, onToggle) {
  container.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    shown++;
    const card = document.createElement('article');
    card.className = 'tcard' + (earned.has(t.name) ? ' earned' : '') + (selected === t.name ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => onToggle(t.name, box.checked));
    const meta = document.createElement('div');
    meta.className = 'tmeta';
    const row1 = document.createElement('div');
    row1.className = 'trow1';
    const name = document.createElement('p');
    name.className = 'tname';
    name.textContent = t.name;
    const grade = document.createElement('span');
    grade.className = 'badge ' + t.grade;
    grade.textContent = t.grade;
    row1.append(name, grade);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'badge missable';
      m.textContent = 'missable';
      row1.append(m);
    }
    const kind = document.createElement('span');
    kind.className = 'badge kind';
    kind.textContent = t.kind;
    row1.append(kind);
    const desc = document.createElement('p');
    desc.className = 'tdesc';
    desc.textContent = t.description + (t.count ? ' (' + t.count + ')' : '');
    meta.append(row1, desc);
    card.append(box, meta);
    if (isSpoiled(t, earned)) card.classList.add('spoiled');
    card.addEventListener('click', () => onSelect(t.name));
    container.append(card);
  }
  if (!shown) {
    const p = document.createElement('p');
    p.className = 'stageblurb';
    p.textContent = 'No trophies match the current filters.';
    container.append(p);
  }
}
