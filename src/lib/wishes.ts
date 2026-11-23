// Tracks the learner would like built: saved after a low score when no easier
// track exists. Stored only in this browser, like attempts.
export interface Wish {
  /** The slug the new track should use (also the id here). */
  slug: string;
  title: string;
  about: string;
  /** The track that went badly, and its display name. */
  forTrack: string;
  forName: string;
  /** Names of the patterns missed, most recent round last. */
  patterns: string[];
  /** How many low rounds have asked for it. */
  asks: number;
  at: number;
}

const KEY = 'tells:v1:wishes';
export const WISHES_CHANGED = 'tells:wishes-changed';

export function loadWishes(): Wish[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function store(all: Wish[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    dispatchEvent(new Event(WISHES_CHANGED));
  } catch {
    /* storage unavailable */
  }
}

/** Adds a wish, or merges into the same one (same slug and track). */
export function addWish(w: Omit<Wish, 'asks' | 'at'>): Wish {
  const all = loadWishes();
  const old = all.find((x) => x.slug === w.slug && x.forTrack === w.forTrack);
  const next: Wish = old
    ? { ...old, patterns: [...new Set([...old.patterns, ...w.patterns])].slice(-8), asks: old.asks + 1, at: Date.now() }
    : { ...w, patterns: w.patterns.slice(0, 8), asks: 1, at: Date.now() };
  store([...all.filter((x) => x !== old), next]);
  return next;
}

export function removeWish(slug: string, forTrack: string) {
  store(loadWishes().filter((x) => !(x.slug === slug && x.forTrack === forTrack)));
}

/** The request to paste to Claude to get the track built. */
export function wishText(w: Wish) {
  const pats = w.patterns.length ? ` Patterns I keep missing there: ${w.patterns.join(', ')}.` : '';
  return `Build a Tells track "${w.title}" (slug: ${w.slug}): ${w.about}. It should be an easier warm-up for the ${w.forName} track.${pats}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
