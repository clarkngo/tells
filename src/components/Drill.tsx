import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Pattern, Problem, Term } from '../lib/types';
import { findTerms, makeMatcher, type TermHit } from '../lib/glossary';
import { chooseRound, type Slot } from '../lib/schedule';
import { loadAttempts, repeatWeight, saveAttempt, waitingMisses, type Attempt } from '../lib/storage';
import { sfx, buzz } from '../lib/sfx';
import { addXp, submitBest, titleOf } from '../lib/profile';
import { burst, centerOf, confetti, floatText, shake, toast } from '../lib/fx';
import Glyph from './Glyph';
import TellApart from './TellApart';
import { SIZES, applySize, loadSize } from '../lib/textsize';
import { LOW_SCORE, type Basics } from '../lib/related';
import { markMixDone } from '../lib/mix';
import { addWish, copyText, wishText, type Wish } from '../lib/wishes';

/** What to offer after a low score (worked out at build time from lib/related). */
export interface Suggest {
  trackName: string;
  easier: { slug: string; name: string }[];
  /** A basics track that doesn't exist yet: saved as a wish when nothing easier exists. */
  basics: Basics | null;
}
const BASE = import.meta.env.BASE_URL;

type Mode = 'sprint' | 'focus' | 'zen';
type Phase = 'setup' | 'ask' | 'mark' | 'reveal' | 'done';
interface Round { problem: Problem; choices: string[]; seen: number; slot: Slot } // seen = earlier attempts at this question
interface Marks { found: Set<number>; total: number; extra: number }
interface Result { problem: Problem; picked: string | null; ms: number; marks?: Marks; peeked?: boolean; conf?: Conf }
type Conf = NonNullable<Attempt['conf']>;
interface Token { text: string; word: boolean; tell: number } // tell = index into problem.tells, or -1

interface Props {
  track: string;
  patterns: Pattern[];
  problems: Problem[];
  glossary?: Term[];
  count?: number;
  seconds?: number;
  setup?: boolean;
  drillHref?: string;
  suggest?: Suggest;
  /** Fix-my-misses round across tracks: pattern slugs and problem ids are
   *  namespaced `track::slug`; maps each track slug to its short name. */
  review?: Record<string, string>;
  /** Review rounds: each question's schedule slot (defaults to retry). */
  slots?: Record<string, Slot>;
  /** Daily mix: the track stays hidden until the question is answered. */
  mix?: boolean;
}

/** `track::slug` → [track, slug]; a plain slug belongs to `fallback`. */
function unpack(s: string, fallback: string): [string, string] {
  const i = s.indexOf('::');
  return i < 0 ? [fallback, s] : [s.slice(0, i), s.slice(i + 2)];
}

const MODES: Record<Mode, { label: string; desc: string; timed: boolean }> = {
  sprint: { label: 'Sprint', desc: '10 questions, all patterns, 20s each. Speed scores.', timed: true },
  focus: { label: 'Focus', desc: 'One pattern against its look-alikes, then mark the tells', timed: true },
  zen: { label: 'Zen', desc: 'No timer. Read slowly, think about the tells', timed: false },
};

// Recall first: the choices stay hidden until you've named the pattern in your
// head and said whether you're sure. Recalling beats recognising, and the
// sure/guess answer steers review (see needsRetry in lib/storage). On by default.
const RECALL_KEY = 'tells:v1:recall';
function loadRecall() {
  try { return localStorage.getItem(RECALL_KEY) !== '0'; } catch { return true; }
}
function saveRecall(on: boolean) {
  try { localStorage.setItem(RECALL_KEY, on ? '1' : '0'); } catch { /* not kept */ }
}

// Combo multipliers: 3 in a row ×1.5, 5 ×2, 8 ×3.
const MULTS: [number, number][] = [[8, 3], [5, 2], [3, 1.5]];
const multOf = (combo: number) => MULTS.find(([n]) => combo >= n)?.[1] ?? 1;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function highlight(text: string, tells: string[]) {
  const ranges: [number, number][] = [];
  for (const t of tells) {
    for (let i = text.indexOf(t); i !== -1; i = text.indexOf(t, i + t.length)) ranges.push([i, i + t.length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  const out: (string | preact.JSX.Element)[] = [];
  let pos = 0;
  merged.forEach(([s, e], i) => {
    if (s > pos) out.push(text.slice(pos, s));
    out.push(<mark class="tell" style={{ animationDelay: `${i * 0.12}s` }}>{text.slice(s, e)}</mark>);
    pos = e;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

// Split a prompt into words and whitespace, tagging each piece with the tell it
// falls inside (if any). Tells are guaranteed to appear in the prompt.
function tokenize(text: string, tells: string[]): Token[] {
  const ranges = tells.map((t) => {
    const i = text.indexOf(t);
    return [i, i + t.length] as const;
  });
  const out: Token[] = [];
  for (const m of text.matchAll(/\S+|\s+/g)) {
    const s = m.index ?? 0;
    const e = s + m[0].length;
    out.push({ text: m[0], word: /\S/.test(m[0]), tell: ranges.findIndex(([a, b]) => s < b && e > a) });
  }
  return out;
}

function scoreMarks(tokens: Token[], selected: Set<number>, total: number): Marks {
  const found = new Set<number>();
  let extra = 0;
  selected.forEach((i) => {
    const t = tokens[i].tell;
    if (t >= 0) found.add(t);
    else extra++;
  });
  return { found, total, extra };
}

// Reveal view for Focus mode: group each tell's words into one span and mark it
// found or missed; words picked outside any tell are shown as noise.
function markedPrompt(tokens: Token[], selected: Set<number>, marks: Marks) {
  const out: (string | preact.JSX.Element)[] = [];
  for (let i = 0; i < tokens.length; ) {
    const t = tokens[i];
    if (t.tell >= 0) {
      let j = i;
      let text = '';
      while (j < tokens.length && tokens[j].tell === t.tell) text += tokens[j++].text;
      out.push(<span class={`w ${marks.found.has(t.tell) ? 'w-found' : 'w-missed'}`}>{text}</span>);
      i = j;
    } else {
      out.push(t.word && selected.has(i) ? <span class="w w-noise">{t.text}</span> : t.text);
      i++;
    }
  }
  return out;
}

// The prompt with each glossary term's first appearance as a tappable button.
function withTerms(text: string, hits: TermHit[], open: Term | null, toggle: (t: Term) => void) {
  const out: (string | preact.JSX.Element)[] = [];
  let at = 0;
  for (const h of hits) {
    out.push(text.slice(at, h.start));
    out.push(
      <button type="button" class={`term ${open === h.term ? 'on' : ''}`} aria-expanded={open === h.term}
        onMouseDown={(e) => e.preventDefault()} onClick={() => toggle(h.term)}>{text.slice(h.start, h.end)}</button>,
    );
    at = h.end;
  }
  out.push(text.slice(at));
  return out;
}

function rankOf(pct: number, avgSec: number) {
  if (pct === 1) return avgSec && avgSec < 5 ? 'Flawless and fast' : 'Flawless';
  if (pct >= 0.8) return 'Sharp eye';
  if (pct >= 0.6) return 'On the trail';
  return 'Warming up';
}

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setV(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

export default function Drill({ track, patterns, problems, glossary = [], count = 10, seconds = 20, setup = true, drillHref, suggest, review, slots, mix }: Props) {
  const bySlug = useMemo(() => new Map(patterns.map((p) => [p.slug, p])), [patterns]);
  const live = patterns.filter((p) => p.live);

  const [mode, setMode] = useState<Mode>('zen');
  const [focus, setFocus] = useState(live[0]?.slug ?? '');
  const [phase, setPhase] = useState<Phase>(setup && !review ? 'setup' : 'ask');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [marks, setMarks] = useState<Marks | null>(null);
  const [points, setPoints] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [openTerm, setOpenTerm] = useState<Term | null>(null);
  const [recall, setRecall] = useState(loadRecall);
  // Recall step: choices hidden until `conf` is set for this question.
  const [conf, setConf] = useState<Conf | null>(null);
  const confRef = useRef<Conf | null>(null);
  // Low score: an easier round on the missed patterns, easier tracks, or a wish.
  const [easyRound, setEasyRound] = useState(false);
  const [wish, setWish] = useState<Wish | null>(null);
  const [copied, setCopied] = useState(false);
  // Press and hold a choice to see what the pattern means. It marks the question
  // as peeked: no points, and it doesn't count toward stars.
  const [peek, setPeek] = useState<Pattern | null>(null);
  const peekedRef = useRef(false);
  const holdRef = useRef<{ timer: number; fired: boolean }>({ timer: 0, fired: false });
  const matcher = useMemo(() => makeMatcher(glossary), [glossary]);
  const startRef = useRef(0);
  const answeredRef = useRef(false);
  const comboRef = useRef(0);
  const pointsRef = useRef(0);
  const tickRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());

  // The immersive phone layout: the drill page and the fix-my-misses page.
  const full = setup || !!review;
  const limit = review ? 0 : setup ? (MODES[mode].timed ? 20 : 0) : seconds;
  const marking = setup && !review && mode === 'focus';

  /** The easiest questions whose answer is one of `pats`: difficulty 1, topped up with 2s. */
  function easyPool(pats: Set<string>) {
    const mine = problems.filter((p) => pats.has(p.answer));
    const d1 = mine.filter((p) => p.difficulty === 1);
    const pool = d1.length >= Math.min(count, mine.length) ? d1 : mine.filter((p) => p.difficulty <= 2);
    return pool.length >= 3 ? pool : mine;
  }

  function build(m: Mode, f: string, easy?: Set<string>): Round[] {
    if (review) {
      // Every question given, untimed, in a fresh order. Misses are all retries;
      // the daily mix passes each question's slot.
      const all = loadAttempts();
      return shuffle(problems).slice(0, count).map((problem) => {
        const [t, id] = unpack(problem.id, track);
        const seen = all.filter((a) => a.track === t && a.id === id).length;
        return { problem, choices: shuffle([problem.answer, ...problem.decoys]), seen, slot: slots?.[problem.id] ?? ('retry' as Slot) };
      });
    }
    const pool = easy
      ? easyPool(easy)
      : m === 'focus'
        ? problems.filter((p) => p.answer === f || p.decoys.includes(f))
        : problems;
    // Spaced repetition: recent misses come back first, then new questions,
    // then right answers that are due for a check (see lib/schedule.ts).
    const byId = new Map(pool.map((p) => [p.id, p]));
    const plans = chooseRound([...byId.keys()], loadAttempts().filter((a) => a.track === track), count, shuffle);
    return shuffle(plans).map((plan) => {
      const problem = byId.get(plan.id)!;
      return { problem, choices: shuffle([problem.answer, ...problem.decoys]), seen: plan.seen, slot: plan.slot };
    });
  }

  function start(m = mode, f = focus, easy?: Set<string>) {
    setRounds(build(m, f, easy));
    setEasyRound(!!easy);
    setWish(null);
    setCopied(false);
    setIdx(0);
    setResults([]);
    setPicked(null);
    comboRef.current = 0;
    pointsRef.current = 0;
    setCombo(0);
    setBestCombo(0);
    setPoints(0);
    setNewBest(false);
    openQuestion();
  }

  // Reset the per-question guards synchronously, so a key pressed right after
  // the render is never dropped.
  function openQuestion() {
    answeredRef.current = false;
    startRef.current = performance.now();
    tickRef.current = 0;
    setElapsed(0);
    setSelected(new Set());
    setMarks(null);
    setOpenTerm(null);
    setPeek(null);
    peekedRef.current = false;
    confRef.current = null;
    setConf(null);
    setPhase('ask');
  }

  // Pick up ?focus=<slug> from pattern cards, and auto-start embedded drills.
  useEffect(() => {
    if (!setup || review) {
      start(review ? 'zen' : 'sprint');
      return;
    }
    const f = new URLSearchParams(location.search).get('focus');
    if (f && bySlug.get(f)?.live) {
      setMode('focus');
      setFocus(f);
    }
  }, []);

  const round = rounds[idx];
  const tokens = useMemo(() => (round ? tokenize(round.problem.prompt, round.problem.tells) : []), [round]);
  const hits = useMemo(() => (round ? findTerms(round.problem.prompt, matcher) : []), [round, matcher]);

  function award(n: number) {
    pointsRef.current += n;
    setPoints(pointsRef.current);
    const { before, after } = addXp(n);
    if (after > before) {
      setTimeout(() => {
        sfx.levelUp();
        toast(`Level ${after}`, titleOf(after));
        confetti(70);
      }, 350);
    }
  }

  function answer(choice: string | null) {
    if (answeredRef.current || !round) return;
    answeredRef.current = true;
    const ms = Math.round(performance.now() - startRef.current);
    const right = choice === round.problem.answer;
    const peeked = peekedRef.current;
    const c = recall ? confRef.current ?? undefined : undefined;
    clearTimeout(holdRef.current.timer);
    setPeek(null);
    setResults((r) => [...r, { problem: round.problem, picked: choice, ms, peeked, ...(c ? { conf: c } : {}) }]);
    const [realTrack, id] = unpack(round.problem.id, track);
    saveAttempt({
      track: realTrack, id, answer: unpack(round.problem.answer, track)[1], picked: choice && unpack(choice, track)[1],
      ms, at: Date.now(), ...(peeked ? { peeked: true as const } : {}), ...(c ? { conf: c } : {}),
    });

    if (right && peeked) {
      // Right, but after looking: no points, and the run neither grows nor breaks.
      award(0);
      sfx.tap(true);
      const target = centerOf(btnRefs.current.get(round.problem.answer));
      if (target) floatText(target.x, target.top, 'peeked, +0', 'cold');
    } else if (right) {
      const c = comboRef.current + 1;
      comboRef.current = c;
      setCombo(c);
      setBestCombo((b) => Math.max(b, c));
      const speed = limit ? Math.max(0, 1 - ms / (limit * 1000)) : 0.5;
      const gained = Math.round((100 + 100 * speed) * multOf(c));
      award(gained);
      sfx.correct(c);
      buzz(12);
      const target = centerOf(btnRefs.current.get(round.problem.answer));
      if (target) {
        burst(target.x, target.y, bySlug.get(round.problem.answer)!.hue, 10 + Math.min(c, 10) * 2);
        floatText(target.x, target.top, `+${gained}`, c >= 3 ? 'hot' : '');
      }
    } else {
      const lost = comboRef.current;
      comboRef.current = 0;
      setCombo(0);
      award(0);
      sfx.wrong();
      buzz([25, 40, 25]);
      shake(cardRef.current);
      const card = centerOf(cardRef.current);
      if (lost >= 3 && card) floatText(card.x, card.top + 40, `${lost} in a row, reset`, 'cold');
    }
    setPicked(choice);
    setPhase(marking ? 'mark' : 'reveal');
  }

  function sayConf(v: Conf) {
    if (confRef.current || answeredRef.current) return;
    confRef.current = v;
    setConf(v);
    sfx.tap(v === 'sure');
  }

  function toggleWord(i: number) {
    sfx.tap(!selected.has(i));
    setSelected((prev) => {
      const nextSel = new Set(prev);
      if (nextSel.has(i)) nextSel.delete(i);
      else nextSel.add(i);
      return nextSel;
    });
  }

  function checkMarks() {
    if (!round) return;
    const m = scoreMarks(tokens, selected, round.problem.tells.length);
    const perfect = m.found.size === m.total && !m.extra;
    setMarks(m);
    setResults((r) => r.map((res, i) => (i === r.length - 1 ? { ...res, marks: m } : res)));
    const gained = Math.max(0, m.found.size * 25 - m.extra * 10) + (perfect ? 50 : 0);
    award(gained);
    const card = centerOf(cardRef.current);
    if (perfect) {
      sfx.allTells();
      if (card) floatText(card.x, card.top + 40, `All tells! +${gained}`, 'hot');
    } else if (gained && card) {
      sfx.tap(true);
      floatText(card.x, card.top + 40, `+${gained}`);
    }
    setPhase('reveal');
  }

  function finish() {
    const perfect = results.length > 0 && results.every((r) => r.picked === r.problem.answer);
    const best = setup && !review && pointsRef.current > 0 && submitBest(`${track}:${mode}`, pointsRef.current);
    setNewBest(best);
    // Low score with no easier track to point to: put a basics track on the wishlist.
    const clean = results.filter((r) => r.picked === r.problem.answer && !r.peeked).length;
    if (setup && !review && suggest?.basics && !suggest.easier.length && results.length >= 5 && clean / results.length < LOW_SCORE) {
      const missed = [...new Set(results.filter((r) => r.picked !== r.problem.answer || r.peeked).map((r) => r.problem.answer))];
      setWish(addWish({
        ...suggest.basics,
        forTrack: track,
        forName: suggest.trackName,
        patterns: missed.map((m) => bySlug.get(m)?.name ?? m),
      }));
    }
    setPhase('done');
    if (best || perfect) {
      sfx.fanfare();
      confetti(perfect ? 160 : 110);
    } else sfx.finish();
  }

  function next() {
    if (idx + 1 >= rounds.length) finish();
    else {
      setIdx(idx + 1);
      setPicked(null);
      openQuestion();
    }
  }

  // Timer: runs only while a question is open. Ticks during the last 5 seconds.
  useEffect(() => {
    if (phase !== 'ask' || !round) return;
    const t = setInterval(() => {
      const e = performance.now() - startRef.current;
      setElapsed(e);
      if (!limit) return;
      const remain = Math.ceil(limit - e / 1000);
      if (remain <= 5 && remain > 0 && remain !== tickRef.current) {
        tickRef.current = remain;
        sfx.tick();
      }
      if (e >= limit * 1000) answer(null);
    }, 100);
    return () => clearInterval(t);
  }, [phase, idx, rounds]);

  // Phones: while a question is open on the drill page, the card takes the whole
  // screen (see .drilling in global.css), the answer area scrolls inside it, and
  // the action button stays pinned at the bottom.
  const bodyRef = useRef<HTMLDivElement>(null);
  const inQuestion = full && (phase === 'ask' || phase === 'mark' || phase === 'reveal');
  useEffect(() => {
    document.documentElement.classList.toggle('drilling', inQuestion);
    return () => document.documentElement.classList.remove('drilling');
  }, [inQuestion]);
  // New question: back to the top. Answered: bring the explanation into view.
  useEffect(() => {
    const b = bodyRef.current;
    if (!b) return;
    if (phase === 'ask') b.scrollTop = 0;
    else if (phase === 'reveal' || phase === 'mark') {
      requestAnimationFrame(() => b.querySelector('.reveal')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  }, [phase, idx]);

  // Swipe left to go on, once the answer is shown. The card follows the finger.
  const swipeRef = useRef<{ x: number; y: number; dx: number; horiz: boolean | null } | null>(null);
  const leavingRef = useRef(false);
  function swipeTo(dx: number, animate: boolean) {
    const b = bodyRef.current;
    if (!b) return;
    b.style.transition = animate ? 'transform 0.18s ease-out, opacity 0.18s ease-out' : 'none';
    b.style.transform = dx ? `translateX(${dx}px)` : '';
    b.style.opacity = dx ? String(Math.max(0.3, 1 + dx / 400)) : '';
  }
  function goNext() {
    if (leavingRef.current) return;
    leavingRef.current = true;
    swipeTo(-innerWidth, true);
    setTimeout(() => {
      leavingRef.current = false;
      swipeTo(0, false);
      next();
    }, 180);
  }
  const touch = {
    onTouchStart: (e: TouchEvent) => {
      if (phase !== 'reveal' || e.touches.length !== 1) return;
      swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, horiz: null };
    },
    onTouchMove: (e: TouchEvent) => {
      const s = swipeRef.current;
      if (!s) return;
      const dx = e.touches[0].clientX - s.x;
      const dy = e.touches[0].clientY - s.y;
      if (s.horiz === null && Math.hypot(dx, dy) > 10) s.horiz = Math.abs(dx) > Math.abs(dy) * 1.3;
      if (!s.horiz) return;
      s.dx = Math.min(0, dx);
      swipeTo(s.dx * 0.8, false);
    },
    onTouchEnd: () => {
      const s = swipeRef.current;
      swipeRef.current = null;
      if (!s || !s.horiz) return;
      if (s.dx < -70) goNext();
      else swipeTo(0, true);
    },
  };

  // Keyboard: 1–4 to answer, Enter / Space for next. The ref always holds this
  // render's handler, so fast key presses never see stale state.
  const onKey = useRef<(e: KeyboardEvent) => void>(() => {});
  onKey.current = (e) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (phase === 'ask' && round && recall && !confRef.current) {
      if (e.key === 'Enter' || e.key.toLowerCase() === 's') { e.preventDefault(); sayConf('sure'); }
      else if (e.key.toLowerCase() === 'g') sayConf('guess');
    } else if (phase === 'ask' && round) {
      const n = Number(e.key);
      if (n >= 1 && n <= round.choices.length) answer(round.choices[n - 1]);
    } else if (phase === 'mark' && e.key === 'Enter') {
      if ((e.target as HTMLElement)?.classList?.contains('word')) return; // keyboard toggling a word
      e.preventDefault();
      checkMarks();
    } else if (phase === 'reveal' && (e.key === 'Enter' || e.key === ' ')) {
      if (tag === 'A') return; // let a focused link open
      e.preventDefault();
      next();
    }
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => onKey.current(e);
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, []);

  if (phase === 'setup') {
    return (
      <div class="drill">
        <div class="setup">
          <h2>Pick a mode</h2>
          <div class="modes" role="radiogroup">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button type="button" role="radio" aria-checked={mode === m}
                class={`mode ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>
                <strong>{MODES[m].label}</strong>
                <span>{MODES[m].desc}</span>
              </button>
            ))}
          </div>
          {mode === 'focus' && (
            <label class="focus-pick">
              Pattern
              <select value={focus} onChange={(e) => setFocus((e.target as HTMLSelectElement).value)}>
                {live.map((p) => <option value={p.slug}>{p.name}</option>)}
              </select>
            </label>
          )}
          <label class="recall-pick">
            <input type="checkbox" checked={recall} onChange={(e) => {
              const on = (e.target as HTMLInputElement).checked;
              setRecall(on);
              saveRecall(on);
            }} />
            <span><strong>Recall first</strong> Name the pattern in your head before the choices show, and say if you're sure. Lucky guesses come back for another go.</span>
          </label>
          <p class="muted scoring-hint">
            100 points per correct answer, up to +100 more for speed. Answers in a row multiply them: 3 → ×1.5, 5 → ×2, 8 → ×3.
          </p>
          <button type="button" class="btn primary big" onClick={() => start()}>Start drill →</button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const right = results.filter((r) => r.picked === r.problem.answer);
    const avg = right.length ? right.reduce((s, r) => s + r.ms, 0) / right.length / 1000 : 0;
    const misses = results.filter((r) => r.picked !== r.problem.answer || r.peeked || r.conf === 'guess');
    const sure = results.filter((r) => r.conf === 'sure');
    const guess = results.filter((r) => r.conf === 'guess');
    const rightOf = (rs: Result[]) => rs.filter((r) => r.picked === r.problem.answer && !r.peeked).length;
    const peeks = results.filter((r) => r.peeked).length;
    const pct = results.length ? right.length / results.length : 0;
    const ms = results.flatMap((r) => (r.marks ? [r.marks] : []));
    const clean = results.filter((r) => r.picked === r.problem.answer && !r.peeked).length;
    const low = setup && !review && !!suggest && results.length >= 5 && clean / results.length < LOW_SCORE;
    const missedPats = new Set(misses.map((r) => r.problem.answer));
    const easyN = low && !easyRound ? Math.min(count, easyPool(missedPats).length) : 0;
    return (
      <div class="drill">
        <div class="done">
          {newBest && <p class="new-best">New personal best</p>}
          <p class="eyebrow">{rankOf(pct, avg)}</p>
          <p class="big-points"><CountUp to={points} /> <span>pts</span></p>
          <div class="done-stats">
            <div><strong>{right.length}/{results.length}</strong><span>correct</span></div>
            <div><strong>{avg ? `${avg.toFixed(1)}s` : '–'}</strong><span>avg spot</span></div>
            <div><strong>{bestCombo}</strong><span>best run</span></div>
            {peeks > 0 && <div><strong>{peeks}</strong><span>peeked</span></div>}
            {ms.length > 0 && (
              <div>
                <strong>{ms.reduce((s, m) => s + m.found.size, 0)}/{ms.reduce((s, m) => s + m.total, 0)}</strong>
                <span>tells found</span>
              </div>
            )}
          </div>
          {sure.length + guess.length > 0 && (
            <p class="calib">
              {sure.length > 0 && <span>Sure: <strong>{rightOf(sure)}/{sure.length}</strong> right</span>}
              {guess.length > 0 && <span>Not sure: <strong>{rightOf(guess)}/{guess.length}</strong> right</span>}
              <span class="muted">{calibNote(rightOf(sure), sure.length, rightOf(guess), guess.length)}</span>
            </p>
          )}
          {misses.length > 0 && (
            <div class="misses">
              <h3>Review these</h3>
              {misses.map((r) => {
                const ans = bySlug.get(r.problem.answer)!;
                const you = r.picked ? bySlug.get(r.picked)?.name : 'Out of time';
                if (r.picked === r.problem.answer) {
                  return (
                    <div class="miss">
                      <p>{highlight(r.problem.prompt, r.problem.tells)}</p>
                      <p class="miss-line"><span class="muted">{r.peeked ? 'Peeked' : 'Guessed right'}</span> → <span class="pname" style={{ '--h': ans.hue }}>{ans.name}</span></p>
                    </div>
                  );
                }
                return (
                  <div class="miss">
                    <p>{highlight(r.problem.prompt, r.problem.tells)}</p>
                    <p class="miss-line">
                      {r.conf === 'sure' && <span class="sure-tag">was sure</span>}
                      <span class="strike">{you}</span> → <span class="pname" style={{ '--h': ans.hue }}>{ans.name}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {low && (
            <div class="easier">
              <h3>Tough round. Step down a level?</h3>
              <div class="row">
                {easyN >= 3 && (
                  <button type="button" class="btn" onClick={() => start(mode, focus, missedPats)}>
                    {easyN} easier questions on what you missed
                  </button>
                )}
                {suggest!.easier.map((t) => <a class="btn" href={`${BASE}${t.slug}/drill/`}>{t.name} drill →</a>)}
              </div>
              {wish && (
                <div class="wish">
                  <p>
                    There's no easier track for this yet, so <strong>{wish.title}</strong> is on your wishlist
                    {wish.asks > 1 ? ` (asked ${wish.asks} times)` : ''}. Paste this to Claude to have it built:
                  </p>
                  <p class="wish-text mono">{wishText(wish)}</p>
                  <div class="row">
                    <button type="button" class="btn" onClick={async () => setCopied(await copyText(wishText(wish)))}>
                      {copied ? 'Copied' : 'Copy request'}
                    </button>
                    <a class="btn" href={`${BASE}map/`}>See your wishlist on the map →</a>
                  </div>
                </div>
              )}
            </div>
          )}
          {mix ? <MixNext /> : review ? <ReviewNext /> : <div class="row">
            <button type="button" class="btn primary big" onClick={() => start()} autoFocus>One more round</button>
            {setup
              ? <button type="button" class="btn" onClick={() => setPhase('setup')}>Change mode</button>
              : drillHref && <a class="btn" href={drillHref}>Full drill →</a>}
          </div>}
        </div>
      </div>
    );
  }

  if (!round) return <div class="drill"><p class="muted">No problems match this mode yet.</p></div>;

  const p = round.problem;
  const ans = bySlug.get(p.answer)!;
  const revealed = phase === 'reveal';
  const answered = phase !== 'ask';
  const correct = picked === p.answer;
  const left = limit ? Math.max(0, 1 - elapsed / (limit * 1000)) : 1;
  const mult = multOf(combo);
  // Wrong pick: offer a side-by-side of the two patterns. Opens by itself once
  // the same pair has been mixed up before.
  const mixed = revealed && picked && !correct ? bySlug.get(picked) ?? null : null;
  const hidden = phase === 'ask' && recall && !conf;
  const last = results[results.length - 1];
  // Said "sure" and got it wrong: the error most worth fixing, so say so and open
  // the side-by-side. Said "not sure" and got it right: it comes back to check.
  const sureMiss = answered && last?.conf === 'sure' && !correct;
  const luckyGuess = answered && last?.conf === 'guess' && correct && !last.peeked;
  const mixTimes = mixed ? mixCount(unpack(p.id, track)[0], unpack(p.answer, track)[1], unpack(mixed.slug, track)[1]) : 0;

  return (
    <div class={`drill ${full ? 'drill-live' : ''}`} ref={cardRef}
      onTouchStart={touch.onTouchStart} onTouchMove={touch.onTouchMove} onTouchEnd={touch.onTouchEnd} onTouchCancel={touch.onTouchEnd}>
      {full && (
        <div class="drill-top">
          <a class="dt-btn" href={BASE} aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5M6.5 10v9h11v-9" /></svg>
          </a>
          <div class="dt-steps" role="img" aria-label={`Question ${idx + 1} of ${rounds.length}`}>
            {rounds.map((_, i) => {
              const r = results[i];
              const cls = r ? (r.picked === r.problem.answer && !r.peeked ? 'ok' : 'bad') : i === idx ? 'now' : '';
              return <i class={cls} />;
            })}
          </div>
          <TextSizeButton cls="dt-btn" />
          <a class="dt-btn" href={`${BASE}map/`} aria-label="Progress map">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3.2" /><ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-25 12 12)" />
            </svg>
          </a>
        </div>
      )}
      <div class="drill-body" ref={bodyRef}>
      <div class="drill-head">
        <span class="qhead">
          <span class="mono">Q{idx + 1}<span class="muted">/{rounds.length}</span></span>
          {review && (!mix || answered) && <span class="fresh track-chip">{review[unpack(p.id, track)[0]] ?? unpack(p.id, track)[0]}</span>}
          {round.slot === 'retry'
            ? <span class="fresh retry" title="You missed or peeked at this one last time. It comes back until you get it right.">Missed last time</span>
            : round.seen === 0
            ? <span class="fresh new" title="First time seeing this question: full mastery point">New</span>
            : <span class="fresh" title={`You've answered this ${round.seen === 1 ? 'once' : `${round.seen} times`} before. Repeats earn fewer mastery points.`}>
                Repeat · mastery ×{repeatWeight(round.seen)}
              </span>}
        </span>
        <span class="hud">
          {combo >= 2 && (
            <span key={combo} class={`combo ${combo >= 8 ? 'c3' : combo >= 5 ? 'c2' : combo >= 3 ? 'c1' : ''}`}>
              {combo} in a row{mult > 1 && <b> ×{mult}</b>}
            </span>
          )}
          <span class="mono pts" key={points}>{points.toLocaleString()} pts</span>
          <TextSizeButton cls="ts-head" />
          {limit > 0 && !answered && <span class="mono muted">{Math.ceil(limit - elapsed / 1000)}s</span>}
        </span>
      </div>
      <div class="timer" aria-hidden="true">
        <div class={`timer-fill ${left < 0.25 ? 'low' : ''}`} style={{ transform: `scaleX(${answered ? 0 : left})` }} />
      </div>

      {phase === 'mark' ? (
        <p class="prompt marking">
          {tokens.map((t, i) => t.word
            ? <button type="button" class={`word ${selected.has(i) ? 'on' : ''}`} aria-pressed={selected.has(i)}
                onMouseDown={(e) => e.preventDefault()} onClick={() => toggleWord(i)}>{t.text}</button>
            : t.text)}
        </p>
      ) : (
        <p class="prompt">
          {!revealed ? withTerms(p.prompt, hits, openTerm, (t) => { setPeek(null); setOpenTerm((o) => (o === t ? null : t)); }) : marks ? markedPrompt(tokens, selected, marks) : highlight(p.prompt, p.tells)}
        </p>
      )}
      {!revealed && phase !== 'mark' && peek && (
        <div class="term-def peek-def" role="note" style={{ '--h': peek.hue }}>
          <p><strong class="pname">{peek.name}</strong> {peek.blurb} <span class="muted">Peeked: this one won't score.</span></p>
          <button type="button" class="term-close" aria-label="Close definition" onClick={() => setPeek(null)}>×</button>
        </div>
      )}
      {!revealed && phase !== 'mark' && openTerm && (
        <div class="term-def" role="note">
          <p><strong>{openTerm.term}</strong> {openTerm.def}</p>
          <button type="button" class="term-close" aria-label="Close definition" onClick={() => setOpenTerm(null)}>×</button>
        </div>
      )}
      {p.constraints && <p class="chip mono">{p.constraints}</p>}

      {hidden ? (
        <div class="recall" role="group" aria-label="Recall first">
          <p>Name the pattern in your head. <span class="muted">Then say if you're sure.</span></p>
          <div class="recall-btns">
            <button type="button" class="btn primary" onClick={() => sayConf('sure')}>I've got it <kbd>S</kbd></button>
            <button type="button" class="btn" onClick={() => sayConf('guess')}>Not sure <kbd>G</kbd></button>
          </div>
        </div>
      ) : (
      <div class="choices">
        {round.choices.map((slug, i) => {
          const pat = bySlug.get(slug)!;
          const state = !answered ? '' : slug === p.answer ? 'right' : slug === picked ? 'wrong' : 'dim';
          return (
            <button type="button" class={`choice ${state}`} style={{ '--h': pat.hue }}
              ref={(el) => { if (el) btnRefs.current.set(slug, el); }}
              disabled={answered}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                clearTimeout(holdRef.current.timer);
                holdRef.current.fired = false;
                holdRef.current.timer = window.setTimeout(() => {
                  holdRef.current.fired = true;
                  peekedRef.current = true;
                  setOpenTerm(null);
                  setPeek(pat);
                  sfx.tap(true);
                  buzz(8);
                }, 450);
              }}
              onPointerUp={() => clearTimeout(holdRef.current.timer)}
              onPointerLeave={() => clearTimeout(holdRef.current.timer)}
              onPointerCancel={() => clearTimeout(holdRef.current.timer)}
              onContextMenu={(e) => e.preventDefault()}
              onClick={() => {
                if (holdRef.current.fired) { holdRef.current.fired = false; return; }
                answer(slug);
              }}>
              <kbd>{i + 1}</kbd>
              <span class="dot" />
              {pat.name}
            </button>
          );
        })}
      </div>
      )}

      {phase === 'mark' && (
        <div class="reveal mark-step">
          <p class={`verdict ${correct ? 'ok' : 'bad'}`} role="status">
            {correct ? (results[results.length - 1]?.peeked ? 'Right, after peeking. No points for the pick.' : 'Right pattern.') : picked ? `Not quite. It's ${ans.name}.` : `Time's up. It's ${ans.name}.`}
          </p>
          <p>
            Now tap the words that point to <span class="pname" style={{ '--h': ans.hue }}>{ans.name}</span>.
            <span class="muted"> There {p.tells.length === 1 ? 'is 1 tell' : `are ${p.tells.length} tells`}; one word from each is enough. +25 each, −10 per extra word.</span>
          </p>
        </div>
      )}

      {revealed && (
        <div class="reveal">
          {marks && (
            <p class="tell-score" role="status">
              Tells: <strong>{marks.found.size} of {marks.total}</strong> found
              {marks.extra > 0 && <span class="muted"> · {marks.extra} extra {marks.extra === 1 ? 'word' : 'words'}</span>}
              <span class="legend"><span class="w w-found">found</span><span class="w w-missed">missed</span>{marks.extra > 0 && <span class="w w-noise">extra</span>}</span>
            </p>
          )}
          <p class={`verdict ${correct ? 'ok' : 'bad'}`} role={marks ? undefined : 'status'}>
            {correct
              ? results[results.length - 1]?.peeked
                ? 'Right, after peeking. No points this time.'
                : `Spotted in ${((results[results.length - 1]?.ms ?? 0) / 1000).toFixed(1)}s`
              : picked ? `Not quite. It's ${ans.name}.` : `Time's up. It's ${ans.name}.`}
          </p>
          {sureMiss && <p class="conf-note sure-miss">You were sure, so this is the one most worth a close look. It comes back first.</p>}
          {luckyGuess && <p class="conf-note">Right, but you weren't sure. It comes back soon to check it's learned.</p>}
          <div class="reveal-card" style={{ '--h': ans.hue }}>
            <Glyph slug={unpack(ans.slug, track)[1]} hue={ans.hue} />
            <div>
              <p class="pname">{ans.name}</p>
              <p>{p.why}</p>
            </div>
          </div>
          <p class="trap"><span class="label">Trap</span>{p.trap}</p>
          {mixed && (
            <details class="apart-wrap" open={mixTimes > 1 || sureMiss}>
              <summary>How to tell <strong>{ans.name}</strong> from <strong>{mixed.name}</strong></summary>
              <TellApart a={ans} b={mixed} times={mixTimes} tags={['right answer', 'you picked']} />
            </details>
          )}
          {hits.length > 0 && (
            <details class="terms">
              <summary>Terms in this question <span class="muted">({hits.length})</span></summary>
              <dl>
                {hits.map((h) => (<><dt>{h.term.term}</dt><dd>{h.term.def}</dd></>))}
              </dl>
            </details>
          )}
          {p.leetcode && <p><a class="btn ghost" href={p.leetcode} target="_blank" rel="noopener">Solve it on LeetCode ↗</a></p>}
        </div>
      )}
      </div>
      {phase === 'mark' && (
        <div class="drill-foot">
          <button type="button" class="btn primary" onClick={checkMarks}>
            Check {selected.size > 0 && <span class="mono">({selected.size})</span>} <kbd>↵</kbd>
          </button>
        </div>
      )}
      {revealed && (
        <div class="drill-foot">
          <button type="button" class="btn primary" onClick={() => (full ? goNext() : next())} autoFocus>
            {idx + 1 >= rounds.length ? 'See results' : 'Next'} <kbd>↵</kbd>
          </button>
          {full && <span class="swipe-hint" aria-hidden="true">or swipe ←</span>}
        </div>
      )}
    </div>
  );
}

// End of a daily mix: today's mix is done; another one draws fresh questions.
function MixNext() {
  useEffect(markMixDone, []);
  return (
    <>
      <p class="muted review-left">Today's mix is done. Another one draws the next questions each track needs.</p>
      <div class="row">
        <button type="button" class="btn primary big" onClick={() => location.reload()} autoFocus>Another mix</button>
        <a class="btn" href={`${BASE}map/`}>See your map →</a>
        <a class="btn" href={BASE}>Home</a>
      </div>
    </>
  );
}

// End of a fix-my-misses round: what's still waiting, worked out fresh from storage.
function ReviewNext() {
  const left = waitingMisses(loadAttempts()).length;
  return (
    <>
      <p class="muted review-left">
        {left ? `${left} ${left === 1 ? 'miss is' : 'misses are'} still waiting.` : 'Nothing left to fix. Every miss is cleared.'}
      </p>
      <div class="row">
        {left > 0 && <button type="button" class="btn primary big" onClick={() => location.reload()} autoFocus>Fix the next {Math.min(left, 10)}</button>}
        <a class={`btn ${left ? '' : 'primary big'}`} href={`${BASE}map/`}>See your map →</a>
        <a class="btn" href={BASE}>Home</a>
      </div>
    </>
  );
}

/** One line on how well "sure" matched being right, this round. */
function calibNote(sr: number, sn: number, gr: number, gn: number) {
  if (sn && sr < sn) return 'Some sure answers were wrong: those come back first.';
  if (gn && gr === gn) return 'Every unsure one was right. Trust yourself a bit more.';
  if (sn && sr === sn) return 'When you were sure, you were right.';
  return '';
}

/** Times `a` and `b` were confused either way in one track, from saved attempts. */
function mixCount(track: string, a: string, b: string) {
  return loadAttempts().filter((x) => x.track === track && ((x.answer === a && x.picked === b) || (x.answer === b && x.picked === a))).length;
}

// One tap steps the drill text through four sizes, then back to the smallest.
function TextSizeButton({ cls }: { cls: string }) {
  const [i, setI] = useState(loadSize);
  const nextI = (i + 1) % SIZES.length;
  return (
    <button type="button" class={`ts-btn ${cls}`} data-size={i}
      aria-label={`Text size: ${SIZES[i].label}. Tap for ${SIZES[nextI].label}.`} title={`Text size: ${SIZES[i].label}`}
      onClick={() => { applySize(nextI); setI(nextI); }}>
      <span class="ts-a1">A</span><span class="ts-a2">A</span>
    </button>
  );
}
