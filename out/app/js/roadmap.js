// The platinum roadmap: suggested order, grouped by stage, built from the official descriptions.
export function renderRoadmap(container, doc, earned, selected, onSelect) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'stageblurb';
  intro.textContent = 'Suggested order to the platinum, built from what each official description asks for: story first (chapters and named missions), then the stranger strands, then activities, collectibles and exploration, then the economy and one-off stunts, and finally the 100% cleanup.';
  container.append(intro);
  const byStage = new Map();
  for (const t of doc.trophies) {
    const key = String(t.roadmapStage);
    if (!byStage.has(key)) byStage.set(key, []);
    byStage.get(key).push(t);
  }
  for (const stage of doc.roadmap) {
    const head = document.createElement('h3');
    head.className = 'stagehead';
    head.textContent = 'Stage ' + stage.stage + ' — ' + stage.name;
    const blurb = document.createElement('p');
    blurb.className = 'stageblurb';
    blurb.textContent = stage.blurb;
    container.append(head, blurb);
    for (const t of byStage.get(String(stage.stage)) ?? []) {
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
      row1.append(name, grade);
      if (t.missable) {
        const m = document.createElement('span');
        m.className = 'badge missable';
        m.textContent = 'missable';
        row1.append(m);
      }
      const line = document.createElement('p');
      line.className = 'tdesc';
      line.textContent = t.guide.split('\n')[0].slice(0, 140) + (t.guide.length > 140 ? '…' : '');
      meta.append(row1, line);
      card.append(meta);
      container.append(card);
    }
  }
}
