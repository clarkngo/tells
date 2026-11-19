import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Pattern, Problem } from '../lib/types';
import { saveAttempt } from '../lib/storage';
import { sfx, buzz } from '../lib/sfx';
import { addXp, submitBest, titleOf } from '../lib/profile';
import { burst, centerOf, confetti, floatText, shake, toast } from '../lib/fx';
import Glyph from './Glyph';

type Mode = 'sprint' | 'focus' | 'zen';
type Phase = 'setup' | 'ask' | 'mark' | 'reveal' | 'done';
interface Round { problem: Problem; choices: string[] }
interface Marks { found: Set<number>; total: number; extra: number }
interface Result { problem: Problem; picked: string | null; ms: number; marks?: Marks }
interface Token { text: string; word: boolean; tell: number } // tell = index into problem.tells, or -1

interface Props {
  track: string;
  patterns: Pattern[];
  problems: Problem[];
  count?: number;
  seconds?: number;
  setup?: boolean;
  drillHref?: string;
}

const MODES: Record<Mode, { label: string; desc: string; timed: boolean }> = {
  sprint: { label: 'Sprint', desc: '10 questions, all patterns, 20s each. Speed scores.', timed: true },
  focus: { label: 'Focus', desc: 'One pattern against its look-alikes, then mark the tells', timed: true },
  zen: { label: 'Zen', desc: 'No timer. Read slowly, think about the tells', timed: false },
};

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

export default function Drill({ track, patterns, problems, count = 10, seconds = 20, setup = true, drillHref }: Props) {
  const bySlug = useMemo(() => new Map(patterns.map((p) => [p.slug, p])), [patterns]);
  const live = patterns.filter((p) => p.live);

  const [mode, setMode] = useState<Mode>('sprint');
  const [focus, setFocus] = useState(live[0]?.slug ?? '');
  const [phase, setPhase] = useState<Phase>(setup ? 'setup' : 'ask');
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
  const startRef = useRef(0);
  const answeredRef = useRef(false);
  const comboRef = useRef(0);
  const pointsRef = useRef(0);
  const tickRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());

  const limit = setup ? (MODES[mode].timed ? 20 : 0) : seconds;
  const marking = setup && mode === 'focus';

  function build(m: Mode, f: string): Round[] {
    const pool = m === 'focus'
      ? problems.filter((p) => p.answer === f || p.decoys.includes(f))
      : problems;
    return shuffle(pool).slice(0, count).map((problem) => ({
      problem,
      choices: shuffle([problem.answer, ...problem.decoys]),
    }));
  }

  function start(m = mode, f = focus) {
    setRounds(build(m, f));
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
    setPhase('ask');
  }

  // Pick up ?focus=<slug> from pattern cards, and auto-start embedded drills.
  useEffect(() => {
    if (!setup) {
      start('sprint');
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
    setResults((r) => [...r, { problem: round.problem, picked: choice, ms }]);
    saveAttempt({ track, id: round.problem.id, answer: round.problem.answer, picked: choice, ms, at: Date.now() });

    if (right) {
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
    const best = setup && pointsRef.current > 0 && submitBest(`${track}:${mode}`, pointsRef.current);
    setNewBest(best);
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

  // Keyboard: 1–4 to answer, Enter / Space for next. The ref always holds this
  // render's handler, so fast key presses never see stale state.
  const onKey = useRef<(e: KeyboardEvent) => void>(() => {});
  onKey.current = (e) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (phase === 'ask' && round) {
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
    const misses = results.filter((r) => r.picked !== r.problem.answer);
    const pct = results.length ? right.length / results.length : 0;
    const ms = results.flatMap((r) => (r.marks ? [r.marks] : []));
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
            {ms.length > 0 && (
              <div>
                <strong>{ms.reduce((s, m) => s + m.found.size, 0)}/{ms.reduce((s, m) => s + m.total, 0)}</strong>
                <span>tells found</span>
              </div>
            )}
          </div>
          {misses.length > 0 && (
            <div class="misses">
              <h3>Review these</h3>
              {misses.map((r) => {
                const ans = bySlug.get(r.problem.answer)!;
                const you = r.picked ? bySlug.get(r.picked)?.name : 'Out of time';
                return (
                  <div class="miss">
                    <p>{highlight(r.problem.prompt, r.problem.tells)}</p>
                    <p class="miss-line">
                      <span class="strike">{you}</span> → <span class="pname" style={{ '--h': ans.hue }}>{ans.name}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <div class="row">
            <button type="button" class="btn primary big" onClick={() => start()} autoFocus>One more round</button>
            {setup
              ? <button type="button" class="btn" onClick={() => setPhase('setup')}>Change mode</button>
              : drillHref && <a class="btn" href={drillHref}>Full drill →</a>}
          </div>
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

  return (
    <div class="drill" ref={cardRef}>
      <div class="drill-head">
        <span class="mono">Q{idx + 1}<span class="muted">/{rounds.length}</span></span>
        <span class="hud">
          {combo >= 2 && (
            <span key={combo} class={`combo ${combo >= 8 ? 'c3' : combo >= 5 ? 'c2' : combo >= 3 ? 'c1' : ''}`}>
              {combo} in a row{mult > 1 && <b> ×{mult}</b>}
            </span>
          )}
          <span class="mono pts" key={points}>{points.toLocaleString()} pts</span>
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
          {!revealed ? p.prompt : marks ? markedPrompt(tokens, selected, marks) : highlight(p.prompt, p.tells)}
        </p>
      )}
      {p.constraints && <p class="chip mono">{p.constraints}</p>}

      <div class="choices">
        {round.choices.map((slug, i) => {
          const pat = bySlug.get(slug)!;
          const state = !answered ? '' : slug === p.answer ? 'right' : slug === picked ? 'wrong' : 'dim';
          return (
            <button type="button" class={`choice ${state}`} style={{ '--h': pat.hue }}
              ref={(el) => { if (el) btnRefs.current.set(slug, el); }}
              disabled={answered} onClick={() => answer(slug)}>
              <kbd>{i + 1}</kbd>
              <span class="dot" />
              {pat.name}
            </button>
          );
        })}
      </div>

      {phase === 'mark' && (
        <div class="reveal mark-step">
          <p class={`verdict ${correct ? 'ok' : 'bad'}`} role="status">
            {correct ? 'Right pattern.' : picked ? `Not quite. It's ${ans.name}.` : `Time's up. It's ${ans.name}.`}
          </p>
          <p>
            Now tap the words that point to <span class="pname" style={{ '--h': ans.hue }}>{ans.name}</span>.
            <span class="muted"> There {p.tells.length === 1 ? 'is 1 tell' : `are ${p.tells.length} tells`}; one word from each is enough. +25 each, −10 per extra word.</span>
          </p>
          <div class="row">
            <button type="button" class="btn primary" onClick={checkMarks}>
              Check {selected.size > 0 && <span class="mono">({selected.size})</span>} <kbd>↵</kbd>
            </button>
          </div>
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
              ? `Spotted in ${((results[results.length - 1]?.ms ?? 0) / 1000).toFixed(1)}s`
              : picked ? `Not quite. It's ${ans.name}.` : `Time's up. It's ${ans.name}.`}
          </p>
          <div class="reveal-card" style={{ '--h': ans.hue }}>
            <Glyph slug={ans.slug} hue={ans.hue} />
            <div>
              <p class="pname">{ans.name}</p>
              <p>{p.why}</p>
            </div>
          </div>
          <p class="trap"><span class="label">Trap</span>{p.trap}</p>
          <div class="row">
            <button type="button" class="btn primary" onClick={next} autoFocus>
              {idx + 1 >= rounds.length ? 'See results' : 'Next'} <kbd>↵</kbd>
            </button>
            {p.leetcode && <a class="btn ghost" href={p.leetcode} target="_blank" rel="noopener">Solve it on LeetCode ↗</a>}
          </div>
        </div>
      )}
    </div>
  );
}
