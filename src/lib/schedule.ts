// Spaced repetition for drill rounds. Picks which questions to show, using only
// the answer history on this device (no clocks, no server).
//
// Each question is in one of four states, by its history in this track:
//   retry  – the last answer was wrong, timed out, peeked or a lucky guess:
//            bring it back soon. Misses you were sure of come back first.
//   new    – never answered.
//   due    – answered right, and enough other answers have happened since that
//            it's time to check it again. The gap grows with each right answer
//            in a row: 10, 30, 90, 270… answers.
//   later  – answered right recently; only used to fill a round.
//
// A round takes retries first (capped, so new questions keep flowing), then
// new questions, then due reviews (most overdue first), then the rest.
import { needsRetry, type Attempt } from './storage';

export type Slot = 'retry' | 'new' | 'due' | 'later';

export interface Plan {
  id: string;
  slot: Slot;
  /** Right answers in a row, counting back from the latest. */
  streak: number;
  /** How far past (positive) or before (negative) its review point it is, in answers. */
  overdue: number;
  /** Times answered before. */
  seen: number;
  /** The latest answer was wrong although you said you were sure. */
  sureMiss?: boolean;
}

const BASE_GAP = 10;
const GROWTH = 3;
const MAX_RETRIES = 4;

export const gapFor = (streak: number) => BASE_GAP * GROWTH ** Math.max(0, streak - 1);

const isRight = (a: Attempt) => !needsRetry(a);

/** Works out each question's state from one track's attempts (oldest first). */
export function planAll(ids: string[], attempts: Attempt[]): Map<string, Plan> {
  const history = new Map<string, number[]>(); // id → indexes into attempts
  attempts.forEach((a, i) => {
    const h = history.get(a.id);
    if (h) h.push(i);
    else history.set(a.id, [i]);
  });
  const total = attempts.length;
  const plans = new Map<string, Plan>();
  for (const id of ids) {
    const h = history.get(id) ?? [];
    if (!h.length) {
      plans.set(id, { id, slot: 'new', streak: 0, overdue: 0, seen: 0 });
      continue;
    }
    let streak = 0;
    for (let k = h.length - 1; k >= 0 && isRight(attempts[h[k]]); k--) streak++;
    const since = total - 1 - h[h.length - 1]; // answers in this track since the last one
    const overdue = since - gapFor(streak);
    const slot: Slot = streak === 0 ? 'retry' : overdue >= 0 ? 'due' : 'later';
    const last = attempts[h[h.length - 1]];
    const sureMiss = last.conf === 'sure' && last.picked !== last.answer;
    plans.set(id, { id, slot, streak, overdue, seen: h.length, ...(sureMiss ? { sureMiss } : {}) });
  }
  return plans;
}

/**
 * Chooses `count` question ids. `shuffle` is passed in so ties are random in the
 * app and fixed in tests.
 */
export function chooseRound(
  ids: string[],
  attempts: Attempt[],
  count: number,
  shuffle: <T>(xs: T[]) => T[] = (xs) => xs,
): Plan[] {
  const plans = [...planAll(ids, attempts).values()];
  const of = (slot: Slot) => shuffle(plans.filter((p) => p.slot === slot));
  // Retries: confident misses first (the ones most worth fixing), then the ones
  // missed longest ago, so a miss never waits forever.
  const retry = of('retry').sort((a, b) => Number(!!b.sureMiss) - Number(!!a.sureMiss) || b.overdue - a.overdue);
  const fresh = of('new');
  const due = of('due').sort((a, b) => b.overdue - a.overdue);
  const later = of('later').sort((a, b) => b.overdue - a.overdue);

  const out = retry.slice(0, MAX_RETRIES);
  for (const group of [fresh, due, retry.slice(MAX_RETRIES), later]) {
    for (const p of group) {
      if (out.length >= count) return out;
      out.push(p);
    }
  }
  return out;
}
