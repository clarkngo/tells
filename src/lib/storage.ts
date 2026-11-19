// Progress lives only in this browser. Every access is guarded so the site
// still works when storage is blocked (private mode, previews, etc.).
export interface Attempt {
  track: string;
  id: string;
  answer: string;
  picked: string | null; // null = ran out of time
  ms: number;
  at: number;
}

const KEY = 'tells:v1:attempts';
const MAX = 2000;
export const CHANGED = 'tells:attempts-changed';

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempt(a: Attempt) {
  try {
    const all = loadAttempts();
    all.push(a);
    localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX)));
    dispatchEvent(new Event(CHANGED));
  } catch {
    /* storage unavailable: progress just isn't kept */
  }
}
