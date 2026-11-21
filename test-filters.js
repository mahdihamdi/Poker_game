#!/usr/bin/env node
const { TRACKS } = require('./tracks.js');
const { discover } = require('./discover.js');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} (got ${actual}, expected ${expected})`);
}

const all = discover(TRACKS);
assertEqual(all.length, TRACKS.length, 'default filters return all tracks');

const focus = discover(TRACKS, {mood: 'Focus'});
assert(focus.every(t => t.mood === 'Focus'), 'mood Focus returns only Focus');
assertEqual(focus.length, 3, 'Focus mood count');

const chillHigh = discover(TRACKS, {mood: 'Chill', energyMin: 35});
assert(chillHigh.every(t => t.mood === 'Chill' && t.energy >= 35), 'Chill + energyMin composes');
assertEqual(chillHigh.length, 1, 'Chill energyMin 35 → Sunset Boulevard only');

const searchEnergy = discover(TRACKS, {query: 'signal', energyMin: 90});
assertEqual(searchEnergy.length, 1, 'search + energyMin finds Velocity');
assertEqual(searchEnergy[0].title, 'Velocity', 'search matches title case-insensitively');

const zero = discover(TRACKS, {mood: 'Chill', query: 'velocity', energyMin: 50});
assertEqual(zero.length, 0, 'impossible combo yields zero results');

const caseInsensitive = discover(TRACKS, {query: 'NOVA'});
assertEqual(caseInsensitive.length, 1, 'artist search is case-insensitive');

const atFloor = discover(TRACKS, {energyMin: 88});
assert(atFloor.every(t => t.energy >= 88), 'energyMin is inclusive');
assertEqual(atFloor.length, 2, 'energyMin 88 includes Higher Ground and Velocity');

console.log('All combined-filter tests passed.');
