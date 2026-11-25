// Daily mix: one untimed round drawn from every track you've started, with the
// track name hidden until you answer. Mixing topics makes you work out which
// kind of problem it is, not just which pattern inside a known track.
import { chooseRound, type Plan } from './schedule';
import type { Attempt } from './storage';
import { dayKey } from './profile';

export const MIX_SIZE = 10;
/** Most tracks fetched for one mix, so a long history never means 40 downloads. */
export const MIX_TRACKS = 8;
const DONE_KEY = 'tells:v1:mix-day';

/** Tracks with at least one answer, most recently practised first. */
export function startedTracks(all: Attempt[]): string[] {
  const last = new Map<string, number>();
  for (const a of all) last.set(a.track, Math.max(last.get(a.track) ?? 0, a.at));
  return [...last.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

/**
 * Picks the questions: each track's own schedule ranks its questions (misses,
 * then new, then due), and the deck takes one from each track in turn, so it
 * spreads across as many tracks as it can.
 */
export function pickMix(
  pools: { track: string; ids: string[] }[],
  all: Attempt[],
  size = MIX_SIZE,
  shuffle: <T>(xs: T[]) => T[] = (xs) => xs,
): { track: string; plan: Plan }[] {
  const per = Math.ceil(size / Math.max(1, pools.length));
  const queues = shuffle(pools).map((p) => ({
    track: p.track,
    plans: chooseRound(p.ids, all.filter((a) => a.track === p.track), per, shuffle),
  }));
  const out: { track: string; plan: Plan }[] = [];
  for (let k = 0; out.length < size; k++) {
    let took = false;
    for (const q of queues) {
      if (out.length >= size) break;
      const plan = q.plans[k];
      if (!plan) continue;
      out.push({ track: q.track, plan });
      took = true;
    }
    if (!took) break;
  }
  return out;
}

export function mixDoneToday(): boolean {
  try { return localStorage.getItem(DONE_KEY) === dayKey(); } catch { return false; }
}

export function markMixDone() {
  try { localStorage.setItem(DONE_KEY, dayKey()); } catch { /* not kept */ }
}
