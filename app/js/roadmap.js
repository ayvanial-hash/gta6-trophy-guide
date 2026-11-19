// The platinum roadmap: the suggested order, grouped by stage, each stage with a live
// progress count and every trophy card showing its first guide line. Built from the
// official descriptions: story chapters and named missions first, then side work,
// activities, collectibles, the economy, and the 100% cleanup.
export function renderRoadmap(container, doc, earned, selected, onSelect) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = 'Suggested order to the platinum, built from what each official description asks for: story first (chapters and named missions), then the stranger strands, then activities, collectibles and exploration, then the economy and one-off stunts, and finally the 100% cleanup. Each stage counts what you have already marked earned.';
  container.append(intro);
  const byStage = new Map();
  for (const t of doc.trophies) {
    const key = String(t.roadmapStage).split('.')[0];
    if (!byStage.has(key)) byStage.set(key, []);
    byStage.get(key).push(t);
  }
  for (const stage of doc.roadmap) {
    const group = byStage.get(String(stage.stage)) ?? [];
    const done = group.filter((t) => earned.has(t.name)).length;
    const head = document.createElement('h3');
    head.className = 'stagehead';
    head.textContent = 'Stage ' + stage.stage + ' — ' + stage.name;
    const count = document.createElement('span');
    count.className = 'badge kind stagecount' + (done === group.length ? ' complete' : '');
    count.textContent = done + ' / ' + group.length + ' earned';
    head.append(count);
    const blurb = document.createElement('p');
    blurb.className = 'stageblurb';
    blurb.textContent = stage.blurb;
    container.append(head, blurb);
    for (const t of group) {
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
      row1.append(name, grade);
      if (t.missable) {
        const m = document.createElement('span');
        m.className = 'badge missable';
        m.textContent = 'missable';
        row1.append(m);
      }
      const line = document.createElement('p');
      line.className = 'tdesc';
      const first = t.guide.split('\n')[0];
      line.textContent = first.slice(0, 160) + (first.length > 160 ? '…' : '');
      meta.append(row1, line);
      card.append(meta);
      container.append(card);
    }
  }
}
