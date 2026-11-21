/**
 * Main application entry point.
 * Loads trophy data, initializes UI components, manages state, and handles user interactions.
 */

import { loadEarned, saveEarned, loadSpoiler, saveSpoiler, exportProgress, importProgress } from './js/state.js';
import { filters, bindFilters, getVisibleTrophies } from './js/filters.js';
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
const detailPane = document.getElementById('detail');
const progressFill = document.getElementById('progressfill');
const progressText = document.getElementById('progress');
const shownCount = document.getElementById('showncount');
const spoilerBox = document.getElementById('spoiler');

let trophyData;
try {
  const response = await fetch('data/trophies.json');
  trophyData = await response.json();
  if (!Array.isArray(trophyData.trophies) || trophyData.trophies.length !== 55) {
    throw new Error(`Expected 55 trophies, got ${trophyData.trophies?.length ?? 0}`);
  }
} catch (err) {
  progressText.textContent = `Trophy data failed to load: ${err.message}`;
  throw err;
}

let earnedSet = loadEarned();
let selectedTrophyName = null;
let currentTab = TAB_ORDER.includes(sessionStorage.getItem(TAB_KEY)) ? sessionStorage.getItem(TAB_KEY) : 'checklist';

spoilerBox.checked = loadSpoiler();
filters.spoiler = spoilerBox.checked;

/**
 * Updates the progress bar and text.
 */
function updateProgress() {
  const percentage = Math.round((earnedSet.size / trophyData.trophies.length) * 100);
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${earnedSet.size} of ${trophyData.trophies.length} earned · ${percentage}%`;
}

/**
 * Returns the currently selected trophy object.
 * @returns {Object|null} The selected trophy object, or null.
 */
function getSelectedTrophy() {
  return trophyData.trophies.find((t) => t.name === selectedTrophyName) ?? null;
}

/**
 * Renders the active view.
 */
function render() {
  for (const [tabName, pane] of Object.entries(panes)) {
    pane.classList.toggle('hidden', tabName !== currentTab);
  }
  
  const visibleTrophies = getVisibleTrophies(trophyData.trophies, earnedSet);
  
  if (currentTab === 'checklist') {
    renderChecklist(panes.checklist, visibleTrophies, earnedSet, selectedTrophyName, selectTrophy, toggleTrophy);
  } else if (currentTab === 'roadmap') {
    renderRoadmap(panes.roadmap, trophyData, earnedSet, selectedTrophyName, selectTrophy);
  } else if (currentTab === 'missables') {
    renderMissables(panes.missables, trophyData.trophies, earnedSet, selectedTrophyName, selectTrophy);
  }
  
  renderDetail(detailPane, getSelectedTrophy(), earnedSet);
  
  shownCount.textContent = currentTab === 'checklist'
    ? `Showing ${visibleTrophies.length} of ${trophyData.trophies.length} trophies`
    : '';
    
  updateProgress();
}

/**
 * Selects a trophy and switches to the checklist view.
 * @param {string} trophyName - The name of the trophy to select.
 */
function selectTrophy(trophyName) {
  selectedTrophyName = trophyName;
  if (currentTab !== 'checklist') { 
    currentTab = 'checklist'; 
    setActiveTab(); 
  }
  render();
  document.getElementById('detailpane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Toggles the earned status of a trophy.
 * @param {string} trophyName - The name of the trophy.
 * @param {boolean} isEarned - Whether the trophy is earned.
 */
function toggleTrophy(trophyName, isEarned) {
  if (isEarned) {
    earnedSet.add(trophyName);
  } else {
    earnedSet.delete(trophyName);
  }
  saveEarned(earnedSet);
  render();
}

/**
 * Sets the active tab styling.
 */
function setActiveTab() {
  for (const tabButton of document.querySelectorAll('.tab')) {
    const isSelected = tabButton.dataset.tab === currentTab;
    tabButton.classList.toggle('active', isSelected);
    tabButton.setAttribute('aria-selected', String(isSelected));
  }
}

for (const tabButton of document.querySelectorAll('.tab')) {
  tabButton.addEventListener('click', () => { 
    currentTab = tabButton.dataset.tab; 
    sessionStorage.setItem(TAB_KEY, currentTab); 
    setActiveTab(); 
    render(); 
  });
}

bindFilters(render);
spoilerBox.addEventListener('change', () => { 
  filters.spoiler = spoilerBox.checked; 
  saveSpoiler(spoilerBox.checked); 
  render(); 
});

document.getElementById('exportbtn').addEventListener('click', () => exportProgress(earnedSet));

document.getElementById('importinput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earnedSet = await importProgress(file, earnedSet, trophyData.trophies.map((t) => t.name));
    saveEarned(earnedSet);
    render();
  } catch (err) {
    alert(`Import failed: ${err.message}`);
  } finally {
    event.target.value = '';
  }
});

document.getElementById('resetbtn').addEventListener('click', () => {
  if (!confirm('Clear all earned marks?')) return;
  earnedSet = new Set();
  saveEarned(earnedSet);
  render();
});

// Keyboard shortcuts: "/" focuses search, 1-4 switch tabs.
document.addEventListener('keydown', (event) => {
  if (event.target.matches('input, select, textarea')) return;
  
  if (event.key === '/') { 
    event.preventDefault(); 
    document.getElementById('search').focus(); 
  }
  
  const tabIndex = Number(event.key);
  if (tabIndex >= 1 && tabIndex <= TAB_ORDER.length) {
    currentTab = TAB_ORDER[tabIndex - 1];
    sessionStorage.setItem(TAB_KEY, currentTab);
    setActiveTab();
    render();
  }
});

setActiveTab();
render();

// Leonida Legend refresh pass: module wiring verified
