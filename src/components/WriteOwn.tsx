import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadAttempts } from '../lib/storage';
import { copyText } from '../lib/wishes';
import {
  OWN_CHANGED, claudePrompt, loadOwn, putOwn, recordCheck, removeOwn, stateOf, type Own,
} from '../lib/own';
import { sfx } from '../lib/sfx';

export interface WritePattern { slug: string; name: string; blurb: string; signals: string[]; hue: number }

interface Props {
  track: string;
  trackName: string;
  patterns: WritePattern[];
  /** Pattern slug → its look-alikes, most common decoy first (worked out at build time). */
  lookalikes: Record<string, string[]>;
}

const MIN_TEXT = 60;
const MIN_RULE = 10;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Tok { text: string; start: number; word: boolean }
const tokens = (text: string): Tok[] =>
  [...text.matchAll(/\S+|\s+/g)].map((m) => ({ text: m[0], start: m.index ?? 0, word: /\S/.test(m[0]) }));

/** Runs of marked words (joined across the spaces between them) as phrases of the text. */
function phrases(text: string, toks: Tok[], marked: Set<number>): string[] {
  const out: string[] = [];
  let from = -1;
  let to = -1;
  // Trailing punctuation isn't part of the tell ("query," → "query").
  const flush = () => { if (from >= 0) out.push(text.slice(from, to).replace(/[.,;:!?)"'”’]+$/, '')); from = -1; };
  toks.forEach((t, i) => {
    if (!t.word) return;
    if (marked.has(i)) {
      if (from < 0) from = t.start;
      to = t.start + t.text.length;
    } else flush();
  });
  flush();
  return out;
}

/** The look-alike you mix up most with this pattern, else the commonest decoy. */
function rivalOf(track: string, slug: string, likes: string[]): string | undefined {
  const n = new Map<string, number>();
  for (const a of loadAttempts()) {
    if (a.track !== track || !a.picked || a.picked === a.answer) continue;
    const other = a.answer === slug ? a.picked : a.picked === slug ? a.answer : null;
    if (other) n.set(other, (n.get(other) ?? 0) + 1);
  }
  const top = [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return top ?? likes[0];
}

/** Words of four letters or more from the signals, for a gentle hint only. */
const signalWords = (signals: string[]) =>
  [...new Set(signals.join(' ').toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? [])];

// Write your own scenario for a pattern, mark its tell, check it against the
// pattern's signals and closest look-alike, and test it on yourself later.
export default function WriteOwn({ track, trackName, patterns, lookalikes }: Props) {
  const bySlug = useMemo(() => new Map(patterns.map((p) => [p.slug, p])), [patterns]);
  const [slug, setSlug] = useState(patterns[0]?.slug ?? '');
  const [text, setText] = useState('');
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [ruleOut, setRuleOut] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mine, setMine] = useState<Own[]>([]);
  const [quiz, setQuiz] = useState<{ o: Own; choices: string[]; picked: string | null } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const p = q.get('p');
    if (p && bySlug.has(p)) setSlug(p);
    const r = () => setMine(loadOwn().filter((o) => o.track === track));
    r();
    addEventListener(OWN_CHANGED, r);
    if (q.get('quiz')) setTimeout(() => document.getElementById('mine')?.scrollIntoView(), 0);
    return () => removeEventListener(OWN_CHANGED, r);
  }, []);

  const pat = bySlug.get(slug);
  const likes = (lookalikes[slug] ?? []).filter((s) => bySlug.has(s));
  const rival = useMemo(() => rivalOf(track, slug, likes), [slug]);
  const rivalPat = rival ? bySlug.get(rival) : undefined;
  const toks = useMemo(() => tokens(text), [text]);
  const tells = phrases(text, toks, marked);
  const named = !!pat && text.toLowerCase().includes(pat.name.toLowerCase());
  const words = pat ? signalWords(pat.signals) : [];
  const anySignalWord = words.some((w) => text.toLowerCase().includes(w));

  const problems = [
    text.trim().length < MIN_TEXT && `Write at least ${MIN_TEXT} characters (${text.trim().length} so far).`,
    named && `Don't name the pattern: "${pat!.name}" gives the answer away.`,
    !tells.length && 'Tap the words that give it away.',
    !ticked.size && 'Tick at least one signal it shows.',
    rivalPat && ruleOut.trim().length < MIN_RULE && `Say what rules out ${rivalPat.name}.`,
  ].filter(Boolean) as string[];

  function reset(next = slug) {
    setSlug(next);
    setText('');
    setMarked(new Set());
    setTicked(new Set());
    setRuleOut('');
    setEditing(null);
    setTried(false);
  }

  function info(p: WritePattern, r?: string) {
    return {
      trackName, name: p.name, blurb: p.blurb, signals: p.signals,
      rivals: (lookalikes[p.slug] ?? []).slice(0, 3).map((s) => bySlug.get(s)?.name ?? s),
      rival: r ? bySlug.get(r)?.name : undefined,
    };
  }

  async function copy(key: string, body: string) {
    const ok = await copyText(body);
    setCopied(ok ? key : null);
    if (ok) setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  }

  function save() {
    setTried(true);
    if (problems.length || !pat) return;
    const decoys = [...new Set([...(rival ? [rival] : []), ...likes])].filter((s) => s !== slug).slice(0, 3);
    putOwn({
      id: editing ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      track, slug, text: text.trim(), tells, signals: [...ticked], rival: rival ?? '', ruleOut: ruleOut.trim(),
      decoys, at: Date.now(), checks: [],
    });
    sfx.tap(true);
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function edit(o: Own) {
    setSlug(o.slug);
    setText(o.text);
    // Re-mark the saved tells on the fresh tokens.
    const ts = tokens(o.text);
    const m = new Set<number>();
    for (const t of o.tells) {
      const s = o.text.indexOf(t);
      ts.forEach((k, i) => { if (k.word && k.start >= s && k.start < s + t.length) m.add(i); });
    }
    setMarked(m);
    setTicked(new Set(o.signals));
    setRuleOut(o.ruleOut);
    setEditing(o.id);
    setQuiz(null);
    setTried(false);
    document.getElementById('write')?.scrollIntoView({ behavior: 'smooth' });
  }

  function startQuiz(o: Own) {
    setQuiz({ o, choices: shuffle([o.slug, ...o.decoys.filter((d) => bySlug.has(d))]), picked: null });
    setTimeout(() => document.getElementById('own-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }

  function pick(s: string) {
    if (!quiz || quiz.picked) return;
    recordCheck(quiz.o.id, s);
    if (s === quiz.o.slug) sfx.correct(1);
    else sfx.wrong();
    setQuiz({ ...quiz, picked: s });
  }

  if (!pat) return <p class="muted">No live patterns in this track yet.</p>;

  const order: Record<string, number> = { ready: 0, rewrite: 1, waiting: 2, passed: 3 };
  const list = [...mine].sort((a, b) => order[stateOf(a)] - order[stateOf(b)] || b.at - a.at);

  return (
    <div class="own">
      <section class="own-form drill" id="write">
        <label class="own-field">
          <span>Pattern</span>
          <select value={slug} onChange={(e) => reset((e.target as HTMLSelectElement).value)} disabled={!!editing}>
            {patterns.map((p) => <option value={p.slug}>{p.name}</option>)}
          </select>
        </label>
        <p class="own-blurb" style={{ '--h': pat.hue }}><strong class="pname">{pat.name}</strong> {pat.blurb}</p>

        <label class="own-field">
          <span>1 · Your scenario</span>
          <textarea rows={4} value={text} placeholder="A short, real-sounding situation where this is the answer. Don't name the pattern."
            onInput={(e) => { setText((e.target as HTMLTextAreaElement).value); setMarked(new Set()); }} />
          {named && <em class="own-warn">Don't name the pattern: it gives the answer away.</em>}
          {text.trim().length >= MIN_TEXT && !anySignalWord && (
            <em class="muted">None of the usual signal words appear yet. That's fine if you described them in your own words.</em>
          )}
        </label>

        {text.trim().length >= 20 && (
          <div class="own-field">
            <span>2 · Tap the words that give it away</span>
            <p class="prompt marking own-mark">
              {toks.map((t, i) => t.word
                ? <button type="button" class={`word ${marked.has(i) ? 'on' : ''}`} aria-pressed={marked.has(i)}
                    onClick={() => setMarked((m) => { const n = new Set(m); n.has(i) ? n.delete(i) : n.add(i); return n; })}>{t.text}</button>
                : t.text)}
            </p>
          </div>
        )}

        <fieldset class="own-field">
          <legend>3 · Which signals does it show?</legend>
          {pat.signals.map((s) => (
            <label class="own-check">
              <input type="checkbox" checked={ticked.has(s)}
                onChange={() => setTicked((t) => { const n = new Set(t); n.has(s) ? n.delete(s) : n.add(s); return n; })} />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>

        {rivalPat && (
          <label class="own-field">
            <span>4 · Could it be <strong class="pname" style={{ '--h': rivalPat.hue }}>{rivalPat.name}</strong> instead? What rules that out?</span>
            <em class="muted">{rivalPat.blurb}</em>
            <input type="text" value={ruleOut} placeholder={`The detail that makes it ${pat.name}, not ${rivalPat.name}`}
              onInput={(e) => setRuleOut((e.target as HTMLInputElement).value)} />
          </label>
        )}

        {tried && problems.length > 0 && <ul class="own-todo">{problems.map((p) => <li>{p}</li>)}</ul>}
        <div class="row">
          <button type="button" class="btn primary" onClick={save}>{editing ? 'Save changes' : 'Save scenario'}</button>
          <button type="button" class="btn" disabled={text.trim().length < 20}
            onClick={() => copy('form', claudePrompt({ text, tells, ruleOut }, info(pat, rival)))}>
            {copied === 'form' ? 'Copied' : 'Copy for Claude'}
          </button>
          {editing && <button type="button" class="btn ghost" onClick={() => reset()}>Cancel</button>}
          {saved && <span class="own-saved" role="status">Saved. It comes back as a question tomorrow.</span>}
        </div>
        <p class="muted own-note">Copy for Claude gives you a ready-made request to paste into Claude for a second opinion. Nothing leaves this device unless you paste it.</p>
      </section>

      <section class="own-list" id="mine">
        <h2>Your scenarios <span class="muted">({mine.length})</span></h2>
        {!mine.length && <p class="muted">None yet. Each one you save comes back as a question the next day: if you still pick the right pattern from your own words, it carried a real tell.</p>}
        {quiz && (
          <div class="drill own-quiz" id="own-quiz">
            <p class="eyebrow">Your own scenario · which pattern?</p>
            <p class="prompt">{quiz.o.text}</p>
            <div class="choices">
              {quiz.choices.map((s) => {
                const p = bySlug.get(s)!;
                const st = !quiz.picked ? '' : s === quiz.o.slug ? 'right' : s === quiz.picked ? 'wrong' : 'dim';
                return <button type="button" class={`choice ${st}`} style={{ '--h': p.hue }} disabled={!!quiz.picked} onClick={() => pick(s)}><span class="dot" />{p.name}</button>;
              })}
            </div>
            {quiz.picked && (quiz.picked === quiz.o.slug ? (
              <p class="verdict ok" role="status">Still recognisable: it carries a real tell.</p>
            ) : (
              <div role="status">
                <p class="verdict bad">You picked {bySlug.get(quiz.picked)?.name}. The tell isn't sharp enough yet.</p>
                {quiz.o.ruleOut && <p class="muted">Your note said: {quiz.o.ruleOut}</p>}
                <button type="button" class="btn" onClick={() => edit(quiz.o)}>Rewrite it</button>
              </div>
            ))}
            {quiz.picked && <p><button type="button" class="btn ghost" onClick={() => setQuiz(null)}>Done</button></p>}
          </div>
        )}
        {list.map((o) => {
          const st = stateOf(o);
          const p = bySlug.get(o.slug);
          if (st === 'ready') {
            return (
              <div class="own-item ready">
                <p><span class="own-badge ready">Ready to test</span> <span class="muted">Pattern hidden until you answer.</span></p>
                <button type="button" class="btn primary" onClick={() => startQuiz(o)}>Test it</button>
              </div>
            );
          }
          return (
            <div class={`own-item ${st}`}>
              <p class="own-head">
                <span class="pname" style={{ '--h': p?.hue ?? 0 }}>{p?.name ?? o.slug}</span>
                <span class={`own-badge ${st}`}>{st === 'waiting' ? 'Comes back tomorrow' : st === 'passed' ? 'Passed' : 'Rewrite'}</span>
              </p>
              <p>{markTells(o.text, o.tells)}</p>
              <div class="row">
                {st === 'rewrite' && <button type="button" class="btn" onClick={() => edit(o)}>Rewrite</button>}
                {st !== 'rewrite' && <button type="button" class="btn ghost" onClick={() => edit(o)}>Edit</button>}
                {p && <button type="button" class="btn ghost" onClick={() => copy(o.id, claudePrompt(o, info(p, o.rival)))}>{copied === o.id ? 'Copied' : 'Copy for Claude'}</button>}
                <button type="button" class="btn ghost" onClick={() => { if (confirm('Delete this scenario?')) removeOwn(o.id); }}>Delete</button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function markTells(text: string, tells: string[]) {
  const out: (string | preact.JSX.Element)[] = [];
  let pos = 0;
  const hits = tells.map((t) => [text.indexOf(t, 0), t.length] as const).filter(([i]) => i >= 0).sort((a, b) => a[0] - b[0]);
  for (const [i, n] of hits) {
    if (i < pos) continue;
    out.push(text.slice(pos, i), <mark class="tell">{text.slice(i, i + n)}</mark>);
    pos = i + n;
  }
  out.push(text.slice(pos));
  return out;
}
