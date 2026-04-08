// exporting our month and day arrays so we don't have to retype them everywhere
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// pointing these to the local public/images folder now
export const HERO_IMAGES = [
  { url: '/images/jan.png', quote: '"The mountains are calling, and I must go." — John Muir' },
  { url: '/images/feb.png', quote: '"In every walk with nature, one receives far more than he seeks."' },
  { url: '/images/mar.png', quote: '"Look deep into nature and you will understand everything better." — Einstein' },
  { url: '/images/apr.png', quote: '"The clearest way into the universe is through a forest wilderness."' },
  { url: '/images/may.png', quote: '"Not all those who wander are lost." — J.R.R. Tolkien' },
  { url: '/images/jun.png', quote: '"Be still and know." — Ancient Wisdom' },
  { url: '/images/jul.png', quote: '"Every moment is a fresh beginning." — T.S. Eliot' },
  { url: '/images/aug.png', quote: '"Nature never hurries, yet everything is accomplished."' },
  { url: '/images/sep.png', quote: '"Adopt the pace of nature: her secret is patience." — Emerson' },
  { url: '/images/oct.png', quote: '"Life is either a daring adventure or nothing." — Helen Keller' },
  { url: '/images/nov.png', quote: '"The poetry of the earth is never dead." — Keats' },
  { url: '/images/dec.png', quote: '"There is beauty in simplicity." — Anonymous' },
];

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// creating a standard format for our dates so they are easy to compare
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

// safely grabbing the notes from local storage so the app doesn't crash on load
export function loadNotes() {
  try { return JSON.parse(localStorage.getItem('wall-cal-notes') || '{}'); } catch { return {}; }
}

export function saveNotesToLocal(n) {
  try { localStorage.setItem('wall-cal-notes', JSON.stringify(n)); } catch {}
}