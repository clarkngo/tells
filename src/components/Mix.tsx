import { useEffect, useState } from 'preact/hooks';
import type { Pattern, Problem, Term } from '../lib/types';
import type { Slot } from '../lib/schedule';
import { loadAttempts } from '../lib/storage';
import { MIX_SIZE, MIX_TRACKS, pickMix, startedTracks } from '../lib/mix';
import Drill from './Drill';
import type { Cousins } from '../lib/cousins';

interface TrackData { slug: string; short: string; patterns: Pattern[]; problems: Problem[]; glossary: Term[]; cousins?: Record<string, Cousins> }
interface Ready { patterns: Pattern[]; problems: Problem[]; glossary: Term[]; cousins: Record<string, Cousins>; names: Record<string, string>; slots: Record<string, Slot> }

const ns = (t: string, s: string) => `${t}::${s}`;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Daily mix page: questions from every track you've started, track hidden until
// you answer (see lib/mix.ts). Uses the same per-track JSON as Fix my misses.
export default function Mix({ base }: { base: string }) {
  const [ready, setReady] = useState<Ready | null>(null);
  const [state, setState] = useState<'loading' | 'few' | 'error' | 'ready'>('loading');

  useEffect(() => {
    const all = loadAttempts();
    const slugs = startedTracks(all).slice(0, MIX_TRACKS);
    if (slugs.length < 2) return setState('few');
    Promise.all(slugs.map((s) => fetch(`${base}review/${s}.json`).then((r) => (r.ok ? (r.json() as Promise<TrackData>) : null)).catch(() => null)))
      .then((list) => {
        const got = list.filter((t): t is TrackData => !!t);
        if (got.length < 2) return setState(got.length < slugs.length ? 'error' : 'few');
        const byTrack = new Map(got.map((t) => [t.slug, t]));
        const live = (t: TrackData) => new Set(t.patterns.filter((p) => p.live).map((p) => p.slug));
        const picks = pickMix(
          got.map((t) => {
            const ok = live(t);
            return { track: t.slug, ids: t.problems.filter((p) => ok.has(p.answer)).map((p) => p.id) };
          }),
          all, MIX_SIZE, shuffle,
        );
        const out: Ready = { patterns: [], problems: [], glossary: [], cousins: {}, names: {}, slots: {} };
        const used = new Set<string>();
        for (const { track, plan } of picks) {
          const t = byTrack.get(track)!;
          const p = t.problems.find((q) => q.id === plan.id)!;
          const id = ns(t.slug, p.id);
          out.problems.push({ ...p, id, answer: ns(t.slug, p.answer), decoys: p.decoys.map((d) => ns(t.slug, d)) });
          out.slots[id] = plan.slot;
          if (!used.has(t.slug)) {
            used.add(t.slug);
            out.names[t.slug] = t.short;
            out.patterns.push(...t.patterns.map((x) => ({ ...x, slug: ns(t.slug, x.slug) })));
            out.glossary.push(...t.glossary);
            for (const [k, v] of Object.entries(t.cousins ?? {})) out.cousins[ns(t.slug, k)] = v;
          }
        }
        setReady(out);
        setState('ready');
      });
  }, []);

  if (state === 'loading') return <div class="drill skeleton">Shuffling your tracks…</div>;
  if (state === 'error') {
    return (
      <div class="drill"><div class="done">
        <p class="eyebrow">Couldn't load the mix</p>
        <p class="muted">Check your connection and try again.</p>
        <div class="row"><button type="button" class="btn primary big" onClick={() => location.reload()}>Try again</button></div>
      </div></div>
    );
  }
  if (state === 'few' || !ready) {
    return (
      <div class="drill"><div class="done">
        <p class="eyebrow">Not enough to mix yet</p>
        <p class="big-points">Start two tracks</p>
        <p class="muted">The daily mix draws from every track you've practised. Answer a few questions in at least two tracks and it's ready.</p>
        <div class="row">
          <a class="btn primary big" href={base}>Pick a track</a>
          <a class="btn" href={`${base}map/`}>See your map →</a>
        </div>
      </div></div>
    );
  }
  return <Drill track="mix" patterns={ready.patterns} problems={ready.problems} glossary={ready.glossary} cousins={ready.cousins}
    review={ready.names} slots={ready.slots} mix count={MIX_SIZE} />;
}
