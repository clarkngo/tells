// Progress lives only in this browser. Every access is guarded so the site
// still works when storage is blocked (private mode, previews, etc.).
export interface Attempt {
  track: string;
  id: string;
  answer: string;
  picked: string | null; // null = ran out of time
  ms: number;
  at: number;
  peeked?: true; // looked at a choice's definition before answering
}

const KEY = 'tells:v1:attempts';
const MAX = 5000;
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

/** The latest attempt at each question that was wrong, timed out or peeked, newest first: the misses waiting for a retry. */
export function waitingMisses(attempts: Attempt[]): Attempt[] {
  const last = new Map<string, Attempt>();
  for (const a of attempts) last.set(`${a.track}:${a.id}`, a);
  return [...last.values()].filter((a) => a.picked !== a.answer || a.peeked).sort((a, b) => b.at - a.at);
}

// Repeats still count toward mastery, but less each time: a question's first
// attempt is worth 1, the second 0.5, then 0.25, never below 0.1.
const REPEAT_DECAY = 0.5;
const MIN_WEIGHT = 0.1;
export const repeatWeight = (prior: number) => Math.max(MIN_WEIGHT, REPEAT_DECAY ** prior);

/** How many times each question id has been answered, from the given attempts. */
export function seenCounts(attempts: Attempt[]): Map<string, number> {
  const seen = new Map<string, number>();
  for (const a of attempts) seen.set(a.id, (seen.get(a.id) ?? 0) + 1);
  return seen;
}

/** Replaces the whole attempt history (used by import). */
export function replaceAttempts(all: Attempt[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX)));
    dispatchEvent(new Event(CHANGED));
  } catch {
    /* storage unavailable */
  }
}
