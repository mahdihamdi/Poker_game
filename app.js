const cards = document.querySelector('#cards');
const search = document.querySelector('#search');
const notice = document.querySelector('#notice');
const energyMin = document.querySelector('#energyMin');
const energyValue = document.querySelector('#energyValue');
const resultCount = document.querySelector('#resultCount');
let activeMood = 'All';

function render() {
  const min = Number(energyMin.value);
  energyValue.textContent = String(min);
  energyMin.setAttribute('aria-valuenow', String(min));
  const visible = window.discover(window.TRACKS, {
    mood: activeMood,
    query: search.value,
    energyMin: min
  });
  resultCount.textContent = `${visible.length} result${visible.length === 1 ? '' : 's'}`;
  cards.innerHTML = visible.length
    ? visible.map(track => `<article class="card">
    <div class="art" style="background:linear-gradient(135deg,${track.colors[0]},${track.colors[1]})">${track.art}</div>
    <h3>${track.title}</h3><p>${track.artist}</p>
    <div class="row"><span class="tag">${track.mood} · ${track.energy}% energy</span><button class="play" data-id="${track.id}" aria-label="Queue ${track.title}">▶</button></div>
  </article>`).join('')
    : '<p class="empty" id="emptyState">No matches. Try another mood, search, or lower the energy minimum.</p>';
}

document.querySelector('#filters').addEventListener('click', event => {
  const button = event.target.closest('[data-mood]');
  if (!button) return;
  activeMood = button.dataset.mood;
  document.querySelectorAll('[data-mood]').forEach(item => item.classList.toggle('selected', item === button));
  render();
});
search.addEventListener('input', render);
energyMin.addEventListener('input', render);
cards.addEventListener('click', event => {
  const play = event.target.closest('[data-id]');
  if (!play) return;
  const track = window.TRACKS.find(item => item.id === Number(play.dataset.id));
  notice.textContent = `Queued “${track.title}” by ${track.artist} (demo only — no audio plays)`;
});
document.querySelector('#surprise').addEventListener('click', () => {
  const pool = window.discover(window.TRACKS, {
    mood: activeMood,
    query: search.value,
    energyMin: Number(energyMin.value)
  });
  const source = pool.length ? pool : window.TRACKS;
  const track = source[Math.floor(Math.random() * source.length)];
  notice.textContent = `Try “${track.title}” by ${track.artist} — ${track.mood.toLowerCase()} mood`;
});
render();
