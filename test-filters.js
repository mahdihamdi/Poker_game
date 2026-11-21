#!/usr/bin/env node
const { TRACKS } = require('./tracks.js');
const { discover } = require('./discover.js');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} (got ${actual}, expected ${expected})`);
}

let passed = 0;
function check(fn) {
  fn();
  passed += 1;
}

// --- Mood alone ---
check(() => {
  const all = discover(TRACKS, {mood: 'All'});
  assertEqual(all.length, TRACKS.length, 'mood All returns full catalog');
});

check(() => {
  const focus = discover(TRACKS, {mood: 'Focus'});
  assert(focus.every(t => t.mood === 'Focus'), 'mood Focus returns only Focus');
  assertEqual(focus.length, 3, 'Focus mood count');
});

check(() => {
  const energy = discover(TRACKS, {mood: 'Energy'});
  assert(energy.every(t => t.mood === 'Energy'), 'mood Energy returns only Energy');
  assertEqual(energy.length, 2, 'Energy mood count');
});

check(() => {
  const chill = discover(TRACKS, {mood: 'Chill'});
  assert(chill.every(t => t.mood === 'Chill'), 'mood Chill returns only Chill');
  assertEqual(chill.length, 3, 'Chill mood count');
});

// --- Search alone ---
check(() => {
  const byTitle = discover(TRACKS, {query: 'velocity'});
  assertEqual(byTitle.length, 1, 'search alone matches title');
  assertEqual(byTitle[0].title, 'Velocity', 'search alone title value');
});

check(() => {
  const byArtist = discover(TRACKS, {query: 'nova'});
  assertEqual(byArtist.length, 1, 'search alone matches artist');
  assertEqual(byArtist[0].artist, 'Nova Coast', 'search alone artist value');
});

check(() => {
  const partial = discover(TRACKS, {query: 'blue'});
  assertEqual(partial.length, 1, 'search alone matches partial title');
  assertEqual(partial[0].title, 'Deep Blue', 'partial title value');
});

check(() => {
  const whitespace = discover(TRACKS, {query: '  signal  '});
  assertEqual(whitespace.length, 1, 'search trims whitespace');
});

check(() => {
  const emptyQuery = discover(TRACKS, {query: ''});
  assertEqual(emptyQuery.length, TRACKS.length, 'empty query does not filter');
});

// --- energyMin alone ---
check(() => {
  const defaultMin = discover(TRACKS, {energyMin: 0});
  assertEqual(defaultMin.length, TRACKS.length, 'energyMin 0 returns all tracks');
});

check(() => {
  const mid = discover(TRACKS, {energyMin: 50});
  assert(mid.every(t => t.energy >= 50), 'energyMin 50 keeps only energy >= 50');
  assertEqual(mid.length, 3, 'energyMin 50 → Deep Blue, Higher Ground, Velocity');
});

check(() => {
  const atFloor = discover(TRACKS, {energyMin: 88});
  assert(atFloor.every(t => t.energy >= 88), 'energyMin is inclusive at exact boundary');
  assertEqual(atFloor.length, 2, 'energyMin 88 includes Higher Ground and Velocity');
});

check(() => {
  const ceiling = discover(TRACKS, {energyMin: 100});
  assertEqual(ceiling.length, 0, 'energyMin 100 yields zero (no track has energy >= 100)');
});

check(() => {
  const justAboveMax = discover(TRACKS, {energyMin: 97});
  assertEqual(justAboveMax.length, 0, 'energyMin above max catalog energy yields zero');
});

// --- Case-insensitive search ---
check(() => {
  const upperArtist = discover(TRACKS, {query: 'NOVA'});
  assertEqual(upperArtist.length, 1, 'artist search is case-insensitive (upper)');
});

check(() => {
  const mixedTitle = discover(TRACKS, {query: 'VeLoCiTy'});
  assertEqual(mixedTitle.length, 1, 'title search is case-insensitive (mixed)');
});

check(() => {
  const lowerPartial = discover(TRACKS, {query: 'ATLAS'});
  assertEqual(lowerPartial.length, 1, 'partial artist search is case-insensitive');
  assertEqual(lowerPartial[0].artist, 'Atlas Club', 'ATLAS → Atlas Club');
});

// --- All three combined ---
check(() => {
  const chillHigh = discover(TRACKS, {mood: 'Chill', energyMin: 35});
  assert(chillHigh.every(t => t.mood === 'Chill' && t.energy >= 35), 'Chill + energyMin composes');
  assertEqual(chillHigh.length, 1, 'Chill energyMin 35 → Sunset Boulevard only');
});

check(() => {
  const searchEnergy = discover(TRACKS, {query: 'signal', energyMin: 90});
  assertEqual(searchEnergy.length, 1, 'search + energyMin finds Velocity');
  assertEqual(searchEnergy[0].title, 'Velocity', 'search matches title case-insensitively');
});

check(() => {
  const triple = discover(TRACKS, {mood: 'Focus', query: 'deep', energyMin: 50});
  assertEqual(triple.length, 1, 'mood + search + energyMin → Deep Blue');
  assertEqual(triple[0].title, 'Deep Blue', 'triple filter title');
});

check(() => {
  const tripleMiss = discover(TRACKS, {mood: 'Focus', query: 'deep', energyMin: 60});
  assertEqual(tripleMiss.length, 0, 'triple filter with energy too high → empty');
});

check(() => {
  const energyMoodSearch = discover(TRACKS, {mood: 'Energy', query: 'higher', energyMin: 80});
  assertEqual(energyMoodSearch.length, 1, 'Energy + higher + 80 → Higher Ground');
  assertEqual(energyMoodSearch[0].title, 'Higher Ground', 'combined Energy mood title');
});

// --- Empty state (zero results) ---
check(() => {
  const zero = discover(TRACKS, {mood: 'Chill', query: 'velocity', energyMin: 50});
  assertEqual(zero.length, 0, 'impossible mood+search+energy combo yields zero');
});

check(() => {
  const noMatch = discover(TRACKS, {query: 'zzzz-not-a-track'});
  assertEqual(noMatch.length, 0, 'unknown search query yields zero');
});

check(() => {
  const chillTooHigh = discover(TRACKS, {mood: 'Chill', energyMin: 50});
  assertEqual(chillTooHigh.length, 0, 'Chill + energyMin 50 → empty (max Chill energy is 39)');
});

// --- Defaults / omitted options ---
check(() => {
  const defaults = discover(TRACKS);
  assertEqual(defaults.length, TRACKS.length, 'omitted options behave as All / empty / 0');
});

console.log(`All combined-filter tests passed (${passed} checks).`);
