// Entry point: loads the trophy data, wires filters, tabs, checklist, detail and roadmap together.
import { loadEarned, saveEarned, loadSpoiler, saveSpoiler, exportProgress, importProgress } from './js/state.js';
import { filters, bindFilters, visibleTrophies } from './js/filters.js';
import { renderChecklist } from './js/checklist.js';
import { renderDetail } from './js/detail.js';
import { renderRoadmap } from './js/roadmap.js';
import { renderMissables } from './js/missables.js';

const doc = await (await fetch('data/trophies.json')).json();
let earned = loadEarned();
let selected = null;
let tab = 'checklist';

const panes = {
  checklist: document.getElementById('checklist'),
  roadmap: document.getElementById('roadmap'),
  missables: document.getElementById('missables'),
  about: document.getElementById('about'),
};
const detail = document.getElementById('detail');
const progressfill = document.getElementById('progressfill');
const progress = document.getElementById('progress');

const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = loadSpoiler();
filters.spoiler = spoilerBox.checked;

function updateProgress() {
  const pct = Math.round((earned.size / doc.trophies.length) * 100);
  progressfill.style.width = pct + '%';
  progress.textContent = earned.size + ' of ' + doc.trophies.length + ' earned · ' + pct + '%';
}

function currentTrophy() {
  return doc.trophies.find((t) => t.name === selected) ?? null;
}

function render() {
  for (const [name, pane] of Object.entries(panes)) {
    pane.classList.toggle('hidden', name !== tab);
  }
  const shown = visibleTrophies(doc.trophies, earned);
  if (tab === 'checklist') renderChecklist(panes.checklist, shown, earned, selected, select, toggle);
  else if (tab === 'roadmap') renderRoadmap(panes.roadmap, doc, earned, selected, select);
  else if (tab === 'missables') renderMissables(panes.missables, shown, earned, selected, select);
  renderDetail(detail, tab === 'checklist' ? currentTrophy() : currentTrophy(), earned);
  updateProgress();
}

function select(name) {
  selected = name;
  if (tab !== 'checklist') { tab = 'checklist'; setActiveTab(); }
  render();
}

function toggle(name, on) {
  if (on) earned.add(name); else earned.delete(name);
  saveEarned(earned);
  render();
}

function setActiveTab() {
  for (const b of document.querySelectorAll('.tab')) {
    b.classList.toggle('active', b.dataset.tab === tab);
  }
}

for (const b of document.querySelectorAll('.tab')) {
  b.addEventListener('click', () => { tab = b.dataset.tab; setActiveTab(); render(); });
}

bindFilters(render);
spoilerBox.addEventListener('change', () => { filters.spoiler = spoilerBox.checked; saveSpoiler(spoilerBox.checked); render(); });

document.getElementById('exportbtn').addEventListener('click', () => exportProgress(earned));
document.getElementById('importinput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = await importProgress(file);
    saveEarned(earned);
    render();
  } catch (err) {
    alert('Import failed: ' + err.message);
  }
});
document.getElementById('resetbtn').addEventListener('click', () => {
  if (!confirm('Clear all earned marks?')) return;
  earned = new Set();
  saveEarned(earned);
  render();
});

render();
