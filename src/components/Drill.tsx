import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Pattern, Problem } from '../lib/types';
import { saveAttempt } from '../lib/storage';
import Glyph from './Glyph';

type Mode = 'sprint' | 'focus' | 'zen';
type Phase = 'setup' | 'ask' | 'reveal' | 'done';
interface Round { problem: Problem; choices: string[] }
interface Result { problem: Problem; picked: string | null; ms: number }

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
  sprint: { label: 'Sprint', desc: '10 questions, all patterns, 20s each', timed: true },
  focus: { label: 'Focus', desc: 'One pattern against its look-alikes', timed: true },
  zen: { label: 'Zen', desc: 'No timer. Read slowly, think about the tells', timed: false },
};

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
  const startRef = useRef(0);
  const answeredRef = useRef(false);

  const limit = setup ? (MODES[mode].timed ? 20 : 0) : seconds;

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
    openQuestion();
  }

  // Reset the per-question guards synchronously, so a key pressed right after
  // the render is never dropped.
  function openQuestion() {
    answeredRef.current = false;
    startRef.current = performance.now();
    setElapsed(0);
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

  function answer(choice: string | null) {
    if (answeredRef.current || !round) return;
    answeredRef.current = true;
    const ms = Math.round(performance.now() - startRef.current);
    setResults((r) => [...r, { problem: round.problem, picked: choice, ms }]);
    saveAttempt({ track, id: round.problem.id, answer: round.problem.answer, picked: choice, ms, at: Date.now() });
    setPicked(choice);
    setPhase('reveal');
  }

  function next() {
    if (idx + 1 >= rounds.length) setPhase('done');
    else {
      setIdx(idx + 1);
      setPicked(null);
      openQuestion();
    }
  }

  // Timer: runs only while a question is open.
  useEffect(() => {
    if (phase !== 'ask' || !round) return;
    const t = setInterval(() => {
      const e = performance.now() - startRef.current;
      setElapsed(e);
      if (limit && e >= limit * 1000) answer(null);
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
          <button type="button" class="btn primary" onClick={() => start()}>Start drill →</button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const right = results.filter((r) => r.picked === r.problem.answer);
    const avg = right.length ? right.reduce((s, r) => s + r.ms, 0) / right.length / 1000 : 0;
    const misses = results.filter((r) => r.picked !== r.problem.answer);
    return (
      <div class="drill">
        <div class="done">
          <p class="eyebrow">Drill complete</p>
          <p class="score"><span>{right.length}</span>/{results.length}</p>
          <p class="muted">{avg ? `Average spot time on correct answers: ${avg.toFixed(1)}s` : 'Keep going. Speed comes after accuracy.'}</p>
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
            <button type="button" class="btn primary" onClick={() => start()}>Run it again</button>
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
  const correct = picked === p.answer;
  const left = limit ? Math.max(0, 1 - elapsed / (limit * 1000)) : 1;

  return (
    <div class="drill">
      <div class="drill-head">
        <span class="mono">Q{idx + 1}<span class="muted">/{rounds.length}</span></span>
        {limit > 0 && !revealed && <span class="mono muted">{Math.ceil(limit - elapsed / 1000)}s</span>}
      </div>
      <div class="timer" aria-hidden="true">
        <div class={`timer-fill ${left < 0.25 ? 'low' : ''}`} style={{ transform: `scaleX(${revealed ? 0 : left})` }} />
      </div>

      <p class="prompt">{revealed ? highlight(p.prompt, p.tells) : p.prompt}</p>
      {p.constraints && <p class="chip mono">{p.constraints}</p>}

      <div class="choices">
        {round.choices.map((slug, i) => {
          const pat = bySlug.get(slug)!;
          const state = !revealed ? '' : slug === p.answer ? 'right' : slug === picked ? 'wrong' : 'dim';
          return (
            <button type="button" class={`choice ${state}`} style={{ '--h': pat.hue }}
              disabled={revealed} onClick={() => answer(slug)}>
              <kbd>{i + 1}</kbd>
              <span class="dot" />
              {pat.name}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div class="reveal">
          <p class={`verdict ${correct ? 'ok' : 'bad'}`} role="status">
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
