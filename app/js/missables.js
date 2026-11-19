// The missables view: every trophy whose official description flags a single event, a
// chain that resets, or a choice with consequences, with the count earned so far and the
// note drawn from the description's own wording. Ignores the current filters so the full
// missable set is always visible here.
export function renderMissables(container, allTrophies, earned, selected, onSelect) {
  container.replaceChildren();
  const miss = allTrophies.filter((t) => t.missable);
  const done = miss.filter((t) => earned.has(t.name)).length;
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = 'Trophies whose official descriptions describe a single event, a chain that resets, or a choice with consequences — the ones to plan for rather than grind. ' + done + ' of ' + miss.length + ' earned. Each note below is drawn from the description’s own wording.';
  container.append(intro);
  if (!miss.length) {
    const p = document.createElement('p');
    p.textContent = 'No missable trophies found in the data.';
    container.append(p);
    return;
  }
  for (const t of miss) {
    const card = document.createElement('article');
    card.className = 'tcard' + (earned.has(t.name) ? ' earned' : '') + (selected === t.name ? ' selected' : '');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => onSelect(t.name));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(t.name); }
    });
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
    const kind = document.createElement('span');
    kind.className = 'badge kind';
    kind.textContent = t.kind;
    row1.append(name, grade, kind);
    const note = document.createElement('p');
    note.className = 'tdesc';
    note.textContent = t.missableNote;
    meta.append(row1, note);
    card.append(meta);
    container.append(card);
  }
}
