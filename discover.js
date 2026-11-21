function discover(tracks, {mood = 'All', query = '', energyMin = 0} = {}) {
  const needle = String(query).trim().toLowerCase();
  const floor = Number(energyMin) || 0;
  return tracks.filter(track =>
    (mood === 'All' || track.mood === mood) &&
    track.energy >= floor &&
    `${track.title} ${track.artist}`.toLowerCase().includes(needle)
  );
}

if (typeof window !== 'undefined') window.discover = discover;
if (typeof module !== 'undefined' && module.exports) module.exports = { discover };
