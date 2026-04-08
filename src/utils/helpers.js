export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=70', quote: '"The mountains are calling, and I must go." — John Muir' },
  { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=700&q=70', quote: '"In every walk with nature, one receives far more than he seeks."' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=70', quote: '"Look deep into nature and you will understand everything better." — Einstein' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=70', quote: '"The clearest way into the universe is through a forest wilderness."' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=70', quote: '"Not all those who wander are lost." — J.R.R. Tolkien' },
  { url: 'https://images.unsplash.com/photo-1414609245224-aea2271f48c2?w=700&q=70', quote: '"Be still and know." — Ancient Wisdom' },
  { url: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=700&q=70', quote: '"Every moment is a fresh beginning." — T.S. Eliot' },
  { url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=700&q=70', quote: '"Nature never hurries, yet everything is accomplished."' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=70', quote: '"Adopt the pace of nature: her secret is patience." — Emerson' },
  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=70', quote: '"Life is either a daring adventure or nothing." — Helen Keller' },
  { url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=700&q=70', quote: '"The poetry of the earth is never dead." — Keats' },
  { url: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?w=700&q=70', quote: '"There is beauty in simplicity." — Anonymous' },
];

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function dateKey(y, m, d) { 
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; 
}

export function parseKey(k) { 
  const [y,m,d] = k.split('-').map(Number); 
  return {y, m: m-1, d}; 
}

export function compareDates(a, b) {
  if (!a || !b) return 0;
  const [ay,am,ad] = a.split('-').map(Number);
  const [by,bm,bd] = b.split('-').map(Number);
  if (ay !== by) return ay - by;
  if (am !== bm) return am - bm;
  return ad - bd;
}

export function formatDisplayDate(k) {
  if (!k) return '';
  const {y,m,d} = parseKey(k);
  return `${MONTHS[m]} ${d}, ${y}`;
}

export function loadNotes() {
  try { return JSON.parse(localStorage.getItem('wall-cal-notes') || '{}'); } catch { return {}; }
}

export function saveNotesToLocal(n) {
  try { localStorage.setItem('wall-cal-notes', JSON.stringify(n)); } catch {}
}