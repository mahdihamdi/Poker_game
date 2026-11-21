// Fictional sample tracks. Keep this dataset separate so a worker can own recommendation logic.
const TRACKS = [
  {id:1,title:'Midnight Circuit',artist:'North Avenue',mood:'Focus',energy:42,art:'🌃',colors:['#12475e','#201c41']},
  {id:2,title:'Golden Hour Drive',artist:'Nova Coast',mood:'Chill',energy:31,art:'🌅',colors:['#b45f39','#482949']},
  {id:3,title:'Velocity',artist:'Signal Run',mood:'Energy',energy:96,art:'⚡',colors:['#5e224f','#e25a45']},
  {id:4,title:'Deep Blue',artist:'Echo Harbor',mood:'Focus',energy:55,art:'🌊',colors:['#114a78','#111d38']},
  {id:5,title:'Afterglow',artist:'The Satellites',mood:'Chill',energy:24,art:'🌙',colors:['#422a7a','#1c2949']},
  {id:6,title:'Higher Ground',artist:'Atlas Club',mood:'Energy',energy:88,art:'🔥',colors:['#9b311f','#442034']},
  {id:7,title:'Quiet Momentum',artist:'Aster Lane',mood:'Focus',energy:49,art:'🪐',colors:['#25474b','#2a284e']},
  {id:8,title:'Sunset Boulevard',artist:'Coastline',mood:'Chill',energy:39,art:'🌴',colors:['#865d23','#502e4a']}
];

if (typeof window !== 'undefined') window.TRACKS = TRACKS;
if (typeof module !== 'undefined' && module.exports) module.exports = { TRACKS };
