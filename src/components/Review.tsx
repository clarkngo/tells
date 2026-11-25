import { useEffect, useState } from 'preact/hooks';
import type { Pattern, Problem, Term } from '../lib/types';
import { loadAttempts, waitingMisses } from '../lib/storage';
import Drill from './Drill';
import type { Cousins } from '../lib/cousins';

interface TrackData { slug: string; short: string; patterns: Pattern[]; problems: Problem[]; glossary: Term[]; cousins?: Record<string, Cousins> }
interface Ready { patterns: Pattern[]; problems: Problem[]; glossary: Term[]; cousins: Record<string, Cousins>; names: Record<string, string> }

const ROUND = 10;
const ns = (t: string, s: string) => `${t}::${s}`;

// Fix my misses: one untimed round of the questions you last got wrong or peeked
// at, from every track. Only the tracks with misses are fetched.
export default function Review({ base }: { base: string }) {
  const [ready, setReady] = useState<Ready | null>(null);
  const [state, setState] = useState<'loading' | 'empty' | 'error' | 'ready'>('loading');

  useEffect(() => {
    const misses = waitingMisses(loadAttempts());
    if (!misses.length) return setState('empty');
    const slugs = [...new Set(misses.map((m) => m.track))];
    Promise.all(slugs.map((s) => fetch(`${base}review/${s}.json`).then((r) => (r.ok ? (r.json() as Promise<TrackData>) : null)).catch(() => null)))
      .then((list) => {
        const byTrack = new Map(list.filter((t): t is TrackData => !!t).map((t) => [t.slug, t]));
        const out: Ready = { patterns: [], problems: [], glossary: [], cousins: {}, names: {} };
        const used = new Set<string>();
        // Newest misses first; questions that no longer exist are skipped.
        for (const m of misses) {
          if (out.problems.length >= ROUND) break;
          const t = byTrack.get(m.track);
          const p = t?.problems.find((q) => q.id === m.id);
          if (!t || !p) continue;
          out.problems.push({ ...p, id: ns(t.slug, p.id), answer: ns(t.slug, p.answer), decoys: p.decoys.map((d) => ns(t.slug, d)) });
          if (!used.has(t.slug)) {
            used.add(t.slug);
            out.names[t.slug] = t.short;
            out.patterns.push(...t.patterns.map((x) => ({ ...x, slug: ns(t.slug, x.slug) })));
            out.glossary.push(...t.glossary);
            for (const [k, v] of Object.entries(t.cousins ?? {})) out.cousins[ns(t.slug, k)] = v;
          }
        }
        if (!out.problems.length) return setState(byTrack.size < slugs.length ? 'error' : 'empty');
        setReady(out);
        setState('ready');
      });
  }, []);

  if (state === 'loading') return <div class="drill skeleton">Finding your misses…</div>;
  if (state === 'error') {
    return (
      <div class="drill"><div class="done">
        <p class="eyebrow">Couldn't load your misses</p>
        <p class="muted">Check your connection and try again.</p>
        <div class="row"><button type="button" class="btn primary big" onClick={() => location.reload()}>Try again</button></div>
      </div></div>
    );
  }
  if (state === 'empty' || !ready) {
    return (
      <div class="drill"><div class="done">
        <p class="eyebrow">Nothing to fix</p>
        <p class="big-points">All clear</p>
        <p class="muted">Every question you've missed, peeked at or guessed has since been answered right. Misses show up here as you drill.</p>
        <div class="row">
          <a class="btn primary big" href={base}>Pick a track</a>
          <a class="btn" href={`${base}map/`}>See your map →</a>
        </div>
      </div></div>
    );
  }
  return <Drill track="review" patterns={ready.patterns} problems={ready.problems} glossary={ready.glossary} cousins={ready.cousins} review={ready.names} count={ROUND} />;
}
