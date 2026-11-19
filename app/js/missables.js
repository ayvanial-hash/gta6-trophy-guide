// The missables view: every trophy the official descriptions flag as one-off, choice-bound or chain-bound.
export function renderMissables(container, trophies, earned, selected, onSelect) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = 'Trophies whose official descriptions describe a single event, a chain that resets, or a choice with consequences — the ones to plan for rather than grind. Each note below is drawn from the description’s own wording.';
  container.append(intro);
  const miss = trophies.filter((t) => t.missable);
  if (!miss.length) {
    const p = document.createElement('p');
    p.textContent = 'No missable trophies in the current filters.';
    container.append(p);
  }
  for (const t of miss) {
    const card = document.createElement('article');
    card.className = 'tcard' + (earned.has(t.name) ? ' earned' : '') + (selected === t.name ? ' selected' : '');
    card.addEventListener('click', () => onSelect(t.name));
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
    const m = document.createElement('span');
    m.className = 'badge missable';
    m.textContent = 'missable';
    row1.append(name, grade, m);
    const note = document.createElement('p');
    note.className = 'tdesc';
    note.textContent = t.missableNote;
    meta.append(row1, note);
    card.append(meta);
    container.append(card);
  }
}
