// Finds glossary terms in a piece of text. Matching ignores case and only counts
// whole words, so "ARCH" doesn't match inside "GARCH".
import type { Term } from './types';

export interface TermMatcher {
  re: RegExp | null;
  byKey: Map<string, Term>;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function makeMatcher(glossary: Term[]): TermMatcher {
  const byKey = new Map<string, Term>();
  for (const t of glossary) for (const k of [t.term, ...(t.aliases ?? [])]) byKey.set(k.toLowerCase(), t);
  if (!byKey.size) return { re: null, byKey };
  // Longest first, so "log-likelihood" wins over "likelihood".
  const keys = [...byKey.keys()].sort((a, b) => b.length - a.length).map(escape);
  return { re: new RegExp(`(?<![A-Za-z0-9])(?:${keys.join('|')})(?![A-Za-z0-9])`, 'giu'), byKey };
}

export interface TermHit {
  start: number;
  end: number;
  term: Term;
}

/** The first appearance of each distinct term, in order. */
export function findTerms(text: string, m: TermMatcher): TermHit[] {
  if (!m.re) return [];
  const seen = new Set<Term>();
  const hits: TermHit[] = [];
  for (const x of text.matchAll(m.re)) {
    const term = m.byKey.get(x[0].toLowerCase());
    if (!term || seen.has(term)) continue;
    seen.add(term);
    hits.push({ start: x.index ?? 0, end: (x.index ?? 0) + x[0].length, term });
  }
  return hits;
}
