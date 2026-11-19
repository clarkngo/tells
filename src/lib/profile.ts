// XP, levels, practice days and personal bests. Browser-only, guarded.
export interface Profile {
  xp: number;
  best: Record<string, number>;
  days: string[]; // YYYY-MM-DD, local time
}

const KEY = 'tells:v1:profile';
export const PROFILE_CHANGED = 'tells:profile-changed';
export const DAILY_GOAL = 20;

export function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (p && typeof p.xp === 'number') return { xp: p.xp, best: p.best ?? {}, days: p.days ?? [] };
  } catch {
    /* fall through */
  }
  return { xp: 0, best: {}, days: [] };
}

function save(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
  dispatchEvent(new Event(PROFILE_CHANGED));
}

// Level n starts at 500·(n−1)² XP: 0, 500, 2000, 4500, 8000, …
export const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 500)) + 1;
export const xpForLevel = (level: number) => 500 * (level - 1) ** 2;

const TITLES = ['Rookie', 'Spotter', 'Tracker', 'Pattern Hunter', 'Sharpshooter', 'Sniper', 'Oracle', 'Grandmaster'];
export const titleOf = (level: number) => TITLES[Math.min(level - 1, TITLES.length - 1)];

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Adds XP (and marks today as practiced). Returns levels before and after. */
export function addXp(n: number): { before: number; after: number } {
  const p = loadProfile();
  const before = levelOf(p.xp);
  p.xp += Math.max(0, Math.round(n));
  const today = dayKey();
  if (!p.days.includes(today)) p.days = [...p.days, today].slice(-400);
  save(p);
  return { before, after: levelOf(p.xp) };
}

/** Consecutive practiced days ending today (or yesterday, if today isn't done yet). */
export function streakOf(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Records a score; returns true if it beats the previous best for this key. */
export function submitBest(key: string, points: number): boolean {
  const p = loadProfile();
  if (points <= (p.best[key] ?? 0)) return false;
  p.best[key] = points;
  save(p);
  return true;
}
