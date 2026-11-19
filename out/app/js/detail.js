// The detail pane: official name/description/grade, the cited guide, steps, missable note.
import { isSpoiled } from './filters.js';

export function renderDetail(container, t, earned) {
  container.replaceChildren();
  if (!t) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Select a trophy to read its guide.';
    container.append(hint);
    return;
  }
  const spoiled = isSpoiled(t, earned);
  const h = document.createElement('h2');
  h.textContent = spoiled ? '??? (spoiler hidden — earn it first)' : t.name;
  const badges = document.createElement('div');
  badges.className = 'trow1';
  const grade = document.createElement('span');
  grade.className = 'badge ' + t.grade;
  grade.textContent = t.grade + (t.count ? ' · ' + t.count : '');
  badges.append(grade);
  const kind = document.createElement('span');
  kind.className = 'badge kind';
  kind.textContent = t.kind;
  badges.append(kind);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'badge missable';
    m.textContent = 'missable';
    badges.append(m);
  }
  const stage = document.createElement('p');
  stage.className = 'stageblurb';
  stage.textContent = 'Roadmap stage ' + t.roadmapStage;
  const official = document.createElement('blockquote');
  official.className = 'official';
  official.textContent = spoiled
    ? 'Official description hidden by spoiler mode.'
    : 'Official description: ' + t.description;
  const body = document.createElement('div');
  body.className = 'guidebody';
  body.textContent = spoiled
    ? 'This is a story trophy and spoiler mode is on. Its guide stays hidden until you mark it earned.'
    : t.guide;
  container.append(h, badges, stage, official, body);
  if (spoiled) return;
  if (t.steps && t.steps.length) {
    const sh = document.createElement('h3');
    sh.textContent = 'How to do it';
    const ol = document.createElement('ol');
    ol.className = 'steps';
    for (const s of t.steps) {
      const li = document.createElement('li');
      li.textContent = s;
      ol.append(li);
    }
    container.append(sh, ol);
  }
  if (t.missable && t.missableNote) {
    const note = document.createElement('div');
    note.className = 'missnote';
    note.textContent = 'Missable — ' + t.missableNote;
    container.append(note);
  }
  const src = document.createElement('p');
  src.className = 'source';
  src.textContent = 'Sources: the official description above (PlayStation, as listed by Exophase and PSNProfiles), plus this entry’s own reading of it. No other guide’s text is copied.';
  container.append(src);
}
