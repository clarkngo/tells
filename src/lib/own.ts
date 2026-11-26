// Your own scenarios: after learning a pattern you write a short situation where
// it's the answer. Nothing here can grade free text, so the checks are:
//   1. you tick which of the pattern's signals it shows and say what rules out
//      its closest look-alike,
//   2. you mark the words that give it away (the tell must be in the text),
//   3. a day or more later it comes back as a question; if you still pick the
//      right pattern from your own words, it carried a real tell.
// Kept in this browser only, separate from drill answers so it never moves stars.

export interface OwnCheck { at: number; picked: string }

export interface Own {
  id: string;
  track: string;
  slug: string;
  text: string;
  /** Phrases from `text` that give it away. */
  tells: string[];
  /** Signals of the pattern you said it shows. */
  signals: string[];
  /** The look-alike you ruled out, and how. */
  rival: string;
  ruleOut: string;
  /** Three look-alikes used as wrong choices when it comes back. */
  decoys: string[];
  at: number;
  checks: OwnCheck[];
}

const KEY = 'tells:v1:own';
export const OWN_CHANGED = 'tells:own-changed';
/** How long before a new scenario comes back as a question. */
export const QUIZ_AFTER = 20 * 60 * 60 * 1000;

export function loadOwn(): Own[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(all: Own[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    dispatchEvent(new Event(OWN_CHANGED));
  } catch {
    /* storage unavailable: not kept */
  }
}

/** Adds a new scenario, or replaces one with the same id (an edit resets its checks). */
export function putOwn(o: Own) {
  const all = loadOwn().filter((x) => x.id !== o.id);
  save([...all, o]);
}

export function removeOwn(id: string) {
  save(loadOwn().filter((x) => x.id !== id));
}

export function recordCheck(id: string, picked: string) {
  save(loadOwn().map((x) => (x.id === id ? { ...x, checks: [...x.checks, { at: Date.now(), picked }] } : x)));
}

export type OwnState = 'waiting' | 'ready' | 'passed' | 'rewrite';

/** waiting: too new to test · ready: due a test · passed: last test right · rewrite: last test wrong. */
export function stateOf(o: Own, now = Date.now()): OwnState {
  const last = o.checks[o.checks.length - 1];
  if (last) return last.picked === o.slug ? 'passed' : 'rewrite';
  return now - o.at >= QUIZ_AFTER ? 'ready' : 'waiting';
}

/** Scenarios in a track ready to test. */
export const readyIn = (track: string, all = loadOwn()) => all.filter((o) => o.track === track && stateOf(o) === 'ready');

/** The prompt for the Copy for Claude button. */
export function claudePrompt(o: { text: string; tells: string[]; ruleOut: string }, info: {
  trackName: string; name: string; blurb: string; signals: string[]; rivals: string[]; rival?: string;
}) {
  return [
    `I'm practising pattern recognition (${info.trackName}). I wrote this scenario as an example of "${info.name}": ${info.blurb}`,
    `Signals of this pattern: ${info.signals.join('; ')}.`,
    `Look-alikes it shouldn't be: ${info.rivals.join(', ')}.`,
    '',
    `My scenario: "${o.text.trim()}"`,
    o.tells.length ? `The words I think give it away: ${o.tells.map((t) => `"${t}"`).join(', ')}.` : '',
    info.rival && o.ruleOut.trim() ? `Why I think it isn't ${info.rival}: ${o.ruleOut.trim()}` : '',
    '',
    `Please tell me, briefly: 1) does it clearly fit "${info.name}"? 2) are those words the real giveaway? 3) could it be read as one of the look-alikes, and what one change would make it unambiguous?`,
  ].filter((l, i, a) => l !== '' || (a[i - 1] ?? '') !== '').join('\n');
}
