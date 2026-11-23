import { useEffect, useMemo, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, type Attempt } from '../lib/storage';
import { planAll, type Slot } from '../lib/schedule';
import { mastery } from './Stars';
import Glyph from './Glyph';
import { copyText, loadWishes, removeWish, wishText, WISHES_CHANGED, type Wish } from '../lib/wishes';

const wishKey = (w: Wish) => `${w.forTrack}>${w.slug}`;

// A night-sky view of progress. All tracks are suns; open one and its patterns
// orbit it as planets. Stars make things brighter, a pulse means questions
// missed last time are waiting, moons are single questions, and red arcs join
// patterns you've mixed up.

export interface MapPattern { slug: string; name: string; hue: number; blurb: string }
export interface MapTrack {
  slug: string;
  name: string;
  short: string;
  patterns: MapPattern[];
  questions: { id: string; answer: string }[];
}

interface PStat {
  stars: number;
  hint: string;
  answered: number;
  slots: Record<Slot, number>;
  moons: Slot[];
}
interface TStat {
  stars: number;
  max: number;
  answered: number;
  slots: Record<Slot, number>;
  pats: Map<string, PStat>;
  /** "a|b" (sorted) → times one was picked when the other was right. */
  pairs: Map<string, number>;
}

const emptySlots = (): Record<Slot, number> => ({ retry: 0, new: 0, due: 0, later: 0 });

function trackStats(t: MapTrack, all: Attempt[]): TStat {
  const mine = all.filter((a) => a.track === t.slug);
  const plans = planAll(t.questions.map((q) => q.id), mine);
  const slots = emptySlots();
  const pats = new Map<string, PStat>();
  let stars = 0;
  for (const p of t.patterns) {
    const m = mastery(mine.filter((a) => a.answer === p.slug && !a.peeked));
    const s = emptySlots();
    const moons: Slot[] = [];
    for (const q of t.questions) {
      if (q.answer !== p.slug) continue;
      const slot = plans.get(q.id)?.slot ?? 'new';
      s[slot]++;
      slots[slot]++;
      moons.push(slot);
    }
    stars += m.stars;
    pats.set(p.slug, { stars: m.stars, hint: m.n ? m.hint : 'Not started', answered: m.n, slots: s, moons });
  }
  const pairs = new Map<string, number>();
  for (const a of mine) {
    if (a.peeked || !a.picked || a.picked === a.answer) continue;
    const k = [a.answer, a.picked].sort().join('|');
    pairs.set(k, (pairs.get(k) ?? 0) + 1);
  }
  return { stars, max: t.patterns.length * 3, answered: mine.length, slots, pats, pairs };
}

const TAU = Math.PI * 2;
const at = (i: number, n: number, r: number): [number, number] => {
  const a = (i / n) * TAU - Math.PI / 2;
  return [Math.cos(a) * r, Math.sin(a) * r];
};

/** Planet layout: one ring for small tracks, two staggered rings for big ones. */
function layout(n: number) {
  const two = n > 14;
  const size = n > 26 ? 18 : two ? 24 : 34;
  return {
    size,
    pos: (i: number) => at(i, n, two ? (i % 2 ? 400 : 250) : 330),
  };
}

// Fixed background stars (same every render).
const SKY = (() => {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 90 }, () => ({ x: r() * 1000 - 500, y: r() * 1000 - 500, r: 0.6 + r() * 1.6, d: r() * 4 }));
})();

function Label({ text, y, cls, max = 14, x = 0, anchor = 'middle' }: {
  text: string; y: number; cls: string; max?: number; x?: number; anchor?: 'start' | 'middle' | 'end';
}) {
  const lines: string[] = [];
  for (const w of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  const shown = lines.length > 2 ? [lines[0], lines.slice(1).join(' ').slice(0, max - 1) + '…'] : lines;
  return (
    <text class={`map-label ${cls}`} y={y} text-anchor={anchor}>
      {shown.map((l, i) => <tspan x={x} dy={i ? '1.15em' : 0}>{l}</tspan>)}
    </text>
  );
}

function StarArc({ r, stars }: { r: number; stars: number }) {
  if (!stars) return null;
  const c = TAU * r;
  return <circle r={r} class="map-arc" stroke-dasharray={`${(c * stars) / 3} ${c}`} transform="rotate(-90)" />;
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

export default function SkyMap({ tracks, base }: { tracks: MapTrack[]; base: string }) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState('');
  const [sel, setSel] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [selWish, setSelWish] = useState('');

  useEffect(() => {
    const refresh = () => setAttempts(loadAttempts());
    const refreshWishes = () => setWishes(loadWishes());
    refreshWishes();
    addEventListener(WISHES_CHANGED, refreshWishes);
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      setView(tracks.some((t) => t.slug === h) ? h : '');
      setSel('');
    };
    refresh();
    fromHash();
    addEventListener(CHANGED, refresh);
    addEventListener('popstate', fromHash);
    return () => {
      removeEventListener(CHANGED, refresh);
      removeEventListener(WISHES_CHANGED, refreshWishes);
      removeEventListener('popstate', fromHash);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (sel) setSel('');
      else if (selWish) setSelWish('');
      else if (view) go('');
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const stats = useMemo(() => new Map(tracks.map((t) => [t.slug, trackStats(t, attempts)])), [attempts]);

  const go = (slug: string) => {
    history.pushState(null, '', slug ? `#${slug}` : location.pathname + location.search);
    setView(slug);
    setSel('');
  };

  // On a phone the detail panel sits below the sky: bring it into view on a tap.
  useEffect(() => {
    if ((!sel && !selWish) || innerWidth >= 720) return;
    document.querySelector('.map-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [sel, selWish]);

  const track = tracks.find((t) => t.slug === view);
  const key = (fn: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div class="map">
      <div class="map-bar">
        {track ? (
          <button class="btn" onClick={() => go('')}>← All tracks</button>
        ) : (
          <span class="muted">Tap a sun to open its track.</span>
        )}
        <Legend />
      </div>
      <svg class="map-sky" viewBox="-500 -500 1000 1000" role="group"
        aria-label={track ? `${track.name}: its patterns as planets` : 'Every track as a sun'}
        onClick={(e) => { if (e.target === e.currentTarget) setSel(''); }}>
        <defs>
          <radialGradient id="mapHalo"><stop offset="0" stop-color="var(--map-sun)" stop-opacity=".6" /><stop offset="1" stop-color="var(--map-sun)" stop-opacity="0" /></radialGradient>
          <filter id="mapGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g class="map-stars" aria-hidden="true">
          {SKY.map((s) => <circle cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `${s.d}s` }} />)}
        </g>
        <g key={view} class="map-scene">
          {track ? (
            <TrackSky track={track} st={stats.get(track.slug)!} sel={sel} setSel={setSel} keyOf={key} />
          ) : (
            <Universe tracks={tracks} stats={stats} go={go} keyOf={key} wishes={wishes} selWish={selWish} setSelWish={setSelWish} />
          )}
        </g>
      </svg>
      {track ? (
        <TrackDetail track={track} st={stats.get(track.slug)!} sel={sel} setSel={setSel} base={base} />
      ) : (
        <UniverseDetail tracks={tracks} stats={stats} go={go} wishes={wishes} selWish={selWish} setSelWish={setSelWish} />
      )}
    </div>
  );
}

type KeyOf = (fn: () => void) => (e: KeyboardEvent) => void;

function Universe({ tracks, stats, go, keyOf, wishes, selWish, setSelWish }: {
  tracks: MapTrack[]; stats: Map<string, TStat>; go: (s: string) => void; keyOf: KeyOf;
  wishes: Wish[]; selWish: string; setSelWish: (k: string) => void;
}) {
  // Wished-for tracks that don't exist yet: faint dashed suns between the core
  // and the track they would help, joined to it by a dashed line.
  const built = new Set(tracks.map((t) => t.slug));
  const perParent = new Map<string, number>();
  const ghosts = wishes.filter((w) => !built.has(w.slug)).flatMap((w) => {
    const i = tracks.findIndex((t) => t.slug === w.forTrack);
    if (i < 0) return [];
    const k = perParent.get(w.forTrack) ?? 0;
    perParent.set(w.forTrack, k + 1);
    const [gx, gy] = at(i + 0.5, tracks.length, 215 - k * 52);
    return [{ w, x: gx, y: gy, p: at(i, tracks.length, 360) }];
  });
  const total = [...stats.values()].reduce((s, t) => s + t.stars, 0);
  const max = [...stats.values()].reduce((s, t) => s + t.max, 0);
  return (
    <>
      {tracks.map((t, i) => {
        const [x, y] = at(i, tracks.length, 360);
        const st = stats.get(t.slug)!;
        return <line class={`map-path ${st.answered ? 'lit' : ''}`} x1={0} y1={0} x2={x} y2={y} />;
      })}
      {ghosts.map(({ w, x, y, p }) => <line class="map-wish-line" x1={x} y1={y} x2={p[0]} y2={p[1]} />)}
      <g class="map-core">
        <circle r={110} fill="url(#mapHalo)" style={{ opacity: 0.25 + (0.75 * total) / (max || 1) }} />
        <circle r={54} class="map-core-body" />
        <text class="map-big" y={4} text-anchor="middle">{total}</text>
        <text class="map-small" y={26} text-anchor="middle">of {max} ★</text>
      </g>
      {tracks.map((t, i) => {
        const [x, y] = at(i, tracks.length, 360);
        const st = stats.get(t.slug)!;
        const frac = st.stars / (st.max || 1);
        return (
          <g class={`map-node map-sun ${st.slots.retry ? 'retry' : ''} ${st.answered ? 'started' : ''}`}
            transform={`translate(${x} ${y})`} role="button" tabIndex={0}
            aria-label={`${t.name}: ${st.stars} of ${st.max} stars${st.slots.retry ? `, ${st.slots.retry} to retry` : ''}. Open.`}
            onClick={() => go(t.slug)} onKeyDown={keyOf(() => go(t.slug))}>
            <circle r={62} class="map-hit" />
            <circle r={70} fill="url(#mapHalo)" class="map-halo" style={{ opacity: frac }} />
            {t.patterns.map((p, j) => {
              const [px, py] = at(j, t.patterns.length, 50);
              const s = st.pats.get(p.slug)!.stars;
              return <circle cx={px} cy={py} r={t.patterns.length > 24 ? 2.6 : 3.6} class={`map-dot s${s}`} style={{ '--h': p.hue }} />;
            })}
            <circle r={32} class="map-body" />
            <circle r={32} class="map-fill" style={{ opacity: frac ? 0.2 + 0.8 * frac : 0 }} />
            <text class="map-num" y={7} text-anchor="middle">{st.stars}</text>
            <Label text={t.short} x={(x / 360) * 64} y={(y / 360) * 64 + (y > 120 ? 20 : y < -120 ? -8 : 6)}
              anchor={x > 60 ? 'start' : x < -60 ? 'end' : 'middle'} cls="sun" />
          </g>
        );
      })}
      {ghosts.map(({ w, x, y }) => {
        const k = wishKey(w);
        const on = selWish === k;
        return (
          <g class={`map-node map-wish ${on ? 'sel' : ''}`} transform={`translate(${x} ${y})`} role="button" tabIndex={0}
            aria-label={`Wished-for track: ${w.title}, to help with ${w.forName}`} aria-pressed={on}
            onClick={() => setSelWish(on ? '' : k)} onKeyDown={keyOf(() => setSelWish(on ? '' : k))}>
            <circle r={34} class="map-hit" />
            <circle r={20} class="map-body" />
            <text class="map-num" y={7} text-anchor="middle">?</text>
            {on && <Label text={w.title} y={42} cls="planet" max={18} />}
          </g>
        );
      })}
    </>
  );
}

function TrackSky({ track, st, sel, setSel, keyOf }: {
  track: MapTrack; st: TStat; sel: string; setSel: (s: string) => void; keyOf: KeyOf;
}) {
  const n = track.patterns.length;
  const { size, pos } = layout(n);
  const index = new Map(track.patterns.map((p, i) => [p.slug, i]));
  const pairs = [...st.pairs.entries()].filter(([k]) => k.split('|').every((s) => index.has(s)));
  const frac = st.stars / (st.max || 1);
  const labels = n <= 20;
  return (
    <>
      {[...new Set(track.patterns.map((_, i) => Math.round(Math.hypot(...pos(i)))))].map((r) => (
        <circle r={r} class="map-orbit" />
      ))}
      {pairs.map(([k, c]) => {
        const [a, b] = k.split('|');
        const [x1, y1] = pos(index.get(a)!);
        const [x2, y2] = pos(index.get(b)!);
        const hot = sel && (a === sel || b === sel);
        const cls = sel ? (hot ? 'hot' : 'dim') : '';
        return (
          <path class={`map-mix ${cls}`} style={{ strokeWidth: 1.5 + Math.min(c, 6) * 0.9 }}
            d={`M${x1} ${y1} Q${((x1 + x2) / 2) * 0.35} ${((y1 + y2) / 2) * 0.35} ${x2} ${y2}`}>
            <title>{`Mixed up ${plural(c, 'time')}`}</title>
          </path>
        );
      })}
      <g class={`map-node map-center ${sel === '' ? 'sel' : ''}`} role="button" tabIndex={0}
        aria-label={`${track.name}: ${st.stars} of ${st.max} stars`}
        onClick={() => setSel('')} onKeyDown={keyOf(() => setSel(''))}>
        <circle r={150} fill="url(#mapHalo)" style={{ opacity: 0.2 + 0.8 * frac }} />
        <circle r={70} class="map-body" />
        <circle r={70} class="map-fill" style={{ opacity: frac ? 0.2 + 0.8 * frac : 0 }} />
        <Label text={track.short} y={-4} cls="center" max={12} />
        <text class="map-small" y={30} text-anchor="middle">{st.stars}/{st.max} ★</text>
      </g>
      {track.patterns.map((p, i) => {
        const [x, y] = pos(i);
        const ps = st.pats.get(p.slug)!;
        const on = sel === p.slug;
        const dim = sel && !on && !pairs.some(([k]) => k.split('|').includes(sel) && k.split('|').includes(p.slug));
        return (
          <g class={`map-node map-planet s${ps.stars} ${ps.slots.retry ? 'retry' : ''} ${on ? 'sel' : ''} ${dim ? 'dim' : ''}`}
            style={{ '--h': p.hue }} transform={`translate(${x} ${y})`} role="button" tabIndex={0}
            aria-label={`${p.name}: ${ps.stars} of 3 stars${ps.slots.retry ? `, ${ps.slots.retry} to retry` : ''}`}
            aria-pressed={on} onClick={() => setSel(on ? '' : p.slug)} onKeyDown={keyOf(() => setSel(on ? '' : p.slug))}>
            <circle r={size + 22} class="map-hit" />
            {ps.moons.map((m, j) => {
              const [mx, my] = at(j, ps.moons.length, size + 15);
              return <circle cx={mx} cy={my} r={n > 26 ? 2.4 : 3.2} class={`map-moon ${m}`} />;
            })}
            <circle r={size} class="map-body" filter={ps.stars === 3 ? 'url(#mapGlow)' : undefined} />
            <StarArc r={size + 6} stars={ps.stars} />
            {(labels || on) && <Label text={p.name} y={y > 120 ? -(size + 34) : size + 40} cls="planet" />}
          </g>
        );
      })}
    </>
  );
}

function Legend() {
  return (
    <ul class="map-legend" aria-label="Legend">
      <li><span class="lg lg-star" />brighter = more ★</li>
      <li><span class="lg lg-retry" />missed last time</li>
      <li><span class="lg lg-due" />due for review</li>
      <li><span class="lg lg-mix" />mixed up</li>
    </ul>
  );
}

function SlotCounts({ s }: { s: Record<Slot, number> }) {
  return (
    <div class="stats map-stats">
      <div class="stat"><span class="stat-v">{s.retry}</span><span class="stat-l">to retry</span></div>
      <div class="stat"><span class="stat-v">{s.due}</span><span class="stat-l">due</span></div>
      <div class="stat"><span class="stat-v">{s.new}</span><span class="stat-l">new</span></div>
      <div class="stat"><span class="stat-v">{s.later}</span><span class="stat-l">resting</span></div>
    </div>
  );
}

function UniverseDetail({ tracks, stats, go, wishes, selWish, setSelWish }: {
  tracks: MapTrack[]; stats: Map<string, TStat>; go: (s: string) => void;
  wishes: Wish[]; selWish: string; setSelWish: (k: string) => void;
}) {
  const all = [...stats.values()];
  const answered = all.reduce((s, t) => s + t.answered, 0);
  const slots = emptySlots();
  for (const t of all) for (const k of Object.keys(slots) as Slot[]) slots[k] += t.slots[k];
  const waiting = tracks
    .map((t) => ({ t, n: stats.get(t.slug)!.slots.retry }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4);
  return (
    <section class="map-detail">
      {answered ? (
        <>
          <h2>{plural(answered, 'answer')} so far</h2>
          <SlotCounts s={slots} />
          {waiting.length > 0 && (
            <p class="map-waiting">
              Misses waiting:{' '}
              {waiting.map((w, i) => (
                <>
                  {i > 0 && ' · '}
                  <button class="linkish" onClick={() => go(w.t.slug)}>{w.t.short} ({w.n})</button>
                </>
              ))}
            </p>
          )}
        </>
      ) : (
        <>
          <h2>The sky is dark for now</h2>
          <p class="muted">Every sun is a track and every dot around it is a pattern. Answer a few questions and they start to glow.</p>
        </>
      )}
      <Wishlist tracks={tracks} wishes={wishes} selWish={selWish} setSelWish={setSelWish} />
    </section>
  );
}

function TrackDetail({ track, st, sel, setSel, base }: {
  track: MapTrack; st: TStat; sel: string; setSel: (s: string) => void; base: string;
}) {
  const name = (slug: string) => track.patterns.find((p) => p.slug === slug)?.name ?? slug;
  const p = track.patterns.find((x) => x.slug === sel);
  const mixes = [...st.pairs.entries()]
    .map(([k, c]) => ({ pair: k.split('|'), c }))
    .filter((m) => !p || m.pair.includes(p.slug))
    .sort((a, b) => b.c - a.c)
    .slice(0, p ? 5 : 3);

  if (p) {
    const ps = st.pats.get(p.slug)!;
    return (
      <section class="map-detail" style={{ '--h': p.hue }}>
        <div class="map-detail-head">
          <Glyph slug={p.slug} hue={p.hue} />
          <div>
            <h2><span class="dot" /> {p.name} <span class="map-stars-txt">{'★'.repeat(ps.stars)}<span class="muted">{'★'.repeat(3 - ps.stars)}</span></span></h2>
            <p class="muted">{p.blurb}</p>
            <p class="mono map-hint">{ps.hint}</p>
          </div>
        </div>
        <SlotCounts s={ps.slots} />
        {mixes.length > 0 && (
          <p class="map-waiting">
            Mixed up with:{' '}
            {mixes.map((m, i) => {
              const other = m.pair[0] === p.slug ? m.pair[1] : m.pair[0];
              return (
                <>
                  {i > 0 && ' · '}
                  <button class="linkish" onClick={() => setSel(other)}>{name(other)} ({m.c})</button>
                </>
              );
            })}
          </p>
        )}
        <a class="btn primary" href={`${base}${track.slug}/drill/?focus=${p.slug}`}>Drill {p.name} →</a>
      </section>
    );
  }
  return (
    <section class="map-detail">
      <h2>{track.name} <span class="muted mono">{st.stars}/{st.max} ★</span></h2>
      {st.answered ? <SlotCounts s={st.slots} /> : <p class="muted">Not started yet. Tap a planet to see what it is.</p>}
      {mixes.length > 0 && (
        <p class="map-waiting">
          Most mixed up:{' '}
          {mixes.map((m, i) => (
            <>
              {i > 0 && ' · '}
              <button class="linkish" onClick={() => setSel(m.pair[0])}>{name(m.pair[0])} ↔ {name(m.pair[1])} ({m.c})</button>
            </>
          ))}
        </p>
      )}
      <div class="row">
        <a class="btn primary" href={`${base}${track.slug}/drill/`}>Drill {track.short} →</a>
        <a class="btn" href={`${base}${track.slug}/patterns/`}>All patterns</a>
      </div>
    </section>
  );
}

function Wishlist({ tracks, wishes, selWish, setSelWish }: {
  tracks: MapTrack[]; wishes: Wish[]; selWish: string; setSelWish: (k: string) => void;
}) {
  const [copied, setCopied] = useState('');
  if (!wishes.length) return null;
  const built = new Map(tracks.map((t) => [t.slug, t]));
  const all = [...wishes].sort((a, b) => b.at - a.at);
  const copyAll = () => all.filter((w) => !built.has(w.slug)).map(wishText).join('\n\n');
  return (
    <div class="wishlist">
      <h3>Wishlist <span class="muted mono">· {all.length}</span></h3>
      <p class="muted">Easier tracks you needed after a tough round. Paste a request to Claude to have it built.</p>
      {all.map((w) => {
        const k = wishKey(w);
        const done = built.get(w.slug);
        return (
          <div class={`wish-item ${selWish === k ? 'on' : ''} ${done ? 'built' : ''}`} onClick={() => setSelWish(k)}>
            <div class="wish-head">
              <strong>{w.title}</strong>
              <span class="muted"> for {w.forName}{w.asks > 1 ? ` · asked ${w.asks}×` : ''}</span>
            </div>
            {done ? (
              <p>Built. <a href={`${import.meta.env.BASE_URL}${done.slug}/drill/`}>Drill {done.short} →</a></p>
            ) : (
              <p class="wish-text mono">{wishText(w)}</p>
            )}
            <div class="row">
              {!done && (
                <button type="button" class="btn" onClick={async (e) => { e.stopPropagation(); if (await copyText(wishText(w))) setCopied(k); }}>
                  {copied === k ? 'Copied' : 'Copy request'}
                </button>
              )}
              <button type="button" class="btn" onClick={(e) => { e.stopPropagation(); removeWish(w.slug, w.forTrack); }}>Remove</button>
            </div>
          </div>
        );
      })}
      {all.filter((w) => !built.has(w.slug)).length > 1 && (
        <button type="button" class="btn" onClick={async () => { if (await copyText(copyAll())) setCopied('*'); }}>
          {copied === '*' ? 'Copied all' : 'Copy all requests'}
        </button>
      )}
    </div>
  );
}
