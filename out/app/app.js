// Entry point: loads the trophy data, wires filters, tabs, checklist, detail, roadmap and
// missables together, keeps progress and the spoiler setting in localStorage, and drives
// the header progress bar and the shown-trophy counter.
import { loadEarned, saveEarned, loadSpoiler, saveSpoiler, exportProgress, importProgress } from './js/state.js';
import { filters, bindFilters, visibleTrophies } from './js/filters.js';
import { renderChecklist } from './js/checklist.js';
import { renderDetail } from './js/detail.js';
import { renderRoadmap } from './js/roadmap.js';
import { renderMissables } from './js/missables.js';

const TAB_ORDER = ['checklist', 'roadmap', 'missables', 'about'];
const TAB_KEY = 'gta6-last-tab';

const panes = {
  checklist: document.getElementById('checklist'),
  roadmap: document.getElementById('roadmap'),
  missables: document.getElementById('missables'),
  about: document.getElementById('about'),
};
const detail = document.getElementById('detail');
const progressfill = document.getElementById('progressfill');
const progress = document.getElementById('progress');
const showncount = document.getElementById('showncount');
const spoilerBox = document.getElementById('spoiler');

let doc;
try {
  doc = await (await fetch('data/trophies.json')).json();
  if (!Array.isArray(doc.trophies) || doc.trophies.length !== 55) {
    throw new Error('expected 55 trophies, got ' + (doc.trophies?.length ?? 0));
  }
} catch (err) {
  progress.textContent = 'Trophy data failed to load: ' + err.message;
  throw err;
}

let earned = loadEarned();
let selected = null;
let tab = TAB_ORDER.includes(sessionStorage.getItem(TAB_KEY)) ? sessionStorage.getItem(TAB_KEY) : 'checklist';

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
  else if (tab === 'missables') renderMissables(panes.missables, doc.trophies, earned, selected, select);
  renderDetail(detail, currentTrophy(), earned);
  showncount.textContent = tab === 'checklist'
    ? 'Showing ' + shown.length + ' of ' + doc.trophies.length + ' trophies'
    : '';
  updateProgress();
}

function select(name) {
  selected = name;
  if (tab !== 'checklist') { tab = 'checklist'; setActiveTab(); }
  render();
  document.getElementById('detailpane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggle(name, on) {
  if (on) earned.add(name); else earned.delete(name);
  saveEarned(earned);
  render();
}

function setActiveTab() {
  for (const b of document.querySelectorAll('.tab')) {
    b.classList.toggle('active', b.dataset.tab === tab);
    b.setAttribute('aria-selected', String(b.dataset.tab === tab));
  }
}

for (const b of document.querySelectorAll('.tab')) {
  b.addEventListener('click', () => { tab = b.dataset.tab; sessionStorage.setItem(TAB_KEY, tab); setActiveTab(); render(); });
}

bindFilters(render);
spoilerBox.addEventListener('change', () => { filters.spoiler = spoilerBox.checked; saveSpoiler(spoilerBox.checked); render(); });

document.getElementById('exportbtn').addEventListener('click', () => exportProgress(earned));
document.getElementById('importinput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = await importProgress(file, earned, doc.trophies.map((t) => t.name));
    saveEarned(earned);
    render();
  } catch (err) {
    alert('Import failed: ' + err.message);
  } finally {
    e.target.value = '';
  }
});
document.getElementById('resetbtn').addEventListener('click', () => {
  if (!confirm('Clear all earned marks?')) return;
  earned = new Set();
  saveEarned(earned);
  render();
});

// Keyboard shortcuts: "/" focuses search, 1-4 switch tabs.
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  if (e.key === '/') { e.preventDefault(); document.getElementById('search').focus(); }
  const n = Number(e.key);
  if (n >= 1 && n <= TAB_ORDER.length) {
    tab = TAB_ORDER[n - 1];
    sessionStorage.setItem(TAB_KEY, tab);
    setActiveTab();
    render();
  }
});

setActiveTab();
render();
