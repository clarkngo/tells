// Moves progress between devices as a single copyable string.
// Importing merges instead of overwriting:
//  - answers are combined, skipping ones already here
//  - XP is tracked per device and each device keeps its larger value, so XP from
//    other devices adds up but importing the same code twice never double-counts
//  - practice days are combined, best scores keep the higher one
//  - your own scenarios merge by id; the version edited last wins
import { loadAttempts, replaceAttempts, type Attempt } from './storage';
import { loadProfile, saveProfile, sumSources } from './profile';
import { loadOwn, mergeOwn, replaceOwn, type Own } from './own';

// Row: track, id, answer, picked, ms, at, then optional peeked (1/0) and confidence (1 sure, 2 guess).
type Row = [string, string, string, string | null, number, number, (1 | 0)?, (1 | 2)?];
interface Payload {
  v: 1;
  a: Row[];
  best: Record<string, number>;
  days: string[];
  sources: Record<string, number>;
  /** Your own scenarios (absent in older codes). */
  own?: Own[];
}

export interface ImportSummary {
  answers: number;
  xp: number;
  days: number;
  bests: number;
  own: number;
}

function toRow(a: Attempt): Row {
  const row: Row = [a.track, a.id, a.answer, a.picked, a.ms, a.at];
  if (a.conf) row.push(a.peeked ? 1 : 0, a.conf === 'sure' ? 1 : 2);
  else if (a.peeked) row.push(1);
  return row;
}
function fromRow([track, id, answer, picked, ms, at, peeked, conf]: Row): Attempt {
  const a: Attempt = { track, id, answer, picked, ms, at };
  if (peeked) a.peeked = true;
  if (conf) a.conf = conf === 1 ? 'sure' : 'guess';
  return a;
}
const keyOf = (a: Attempt) => `${a.track}|${a.id}|${a.at}`;

function toB64url(bytes: Uint8Array) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}
const canCompress = () => typeof CompressionStream !== 'undefined';

export async function exportCode(): Promise<string> {
  const p = loadProfile();
  const own = loadOwn();
  const payload: Payload = { v: 1, a: loadAttempts().map(toRow), best: p.best, days: p.days, sources: p.sources, ...(own.length ? { own } : {}) };
  const json = new TextEncoder().encode(JSON.stringify(payload));
  if (canCompress()) return 'tells1.' + toB64url(await pipe(json, new CompressionStream('deflate-raw')));
  return 'tells0.' + toB64url(json);
}

async function decode(code: string): Promise<Payload> {
  const clean = code.replace(/\s+/g, '');
  const dot = clean.indexOf('.');
  const tag = clean.slice(0, dot);
  let bytes = fromB64url(clean.slice(dot + 1));
  if (tag === 'tells1') {
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot read compressed codes.');
    bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  } else if (tag !== 'tells0') {
    throw new Error('That does not look like a Tells progress code.');
  }
  const p = JSON.parse(new TextDecoder().decode(bytes));
  if (!p || p.v !== 1 || !Array.isArray(p.a)) throw new Error('That progress code is from an unknown version.');
  return p;
}

export async function importCode(code: string): Promise<ImportSummary> {
  let incoming: Payload;
  try {
    incoming = await decode(code);
  } catch (e) {
    throw e instanceof Error && e.message.includes('Tells') ? e : new Error('That code is incomplete or damaged. Copy it again.');
  }

  // Answers: union, deduped by question + timestamp.
  const mine = loadAttempts();
  const seen = new Set(mine.map(keyOf));
  const fresh = incoming.a.map(fromRow).filter((a) => !seen.has(keyOf(a)));
  if (fresh.length) replaceAttempts([...mine, ...fresh].sort((x, y) => x.at - y.at));

  // Profile: per-device XP max, days union, best max.
  const p = loadProfile();
  const xpBefore = p.xp;
  for (const [id, xp] of Object.entries(incoming.sources ?? {})) {
    if (typeof xp === 'number' && xp > (p.sources[id] ?? 0)) p.sources[id] = xp;
  }
  p.xp = sumSources(p.sources);

  const daySet = new Set(p.days);
  const newDays = (incoming.days ?? []).filter((d) => !daySet.has(d));
  p.days = [...p.days, ...newDays].sort().slice(-400);

  let bests = 0;
  for (const [k, v] of Object.entries(incoming.best ?? {})) {
    if (typeof v === 'number' && v > (p.best[k] ?? 0)) {
      p.best[k] = v;
      bests++;
    }
  }
  saveProfile(p);

  // Own scenarios: merge by id.
  let own = 0;
  if (Array.isArray(incoming.own) && incoming.own.length) {
    const m = mergeOwn(loadOwn(), incoming.own);
    if (m.changed) replaceOwn(m.all);
    own = m.changed;
  }

  return { answers: fresh.length, xp: p.xp - xpBefore, days: newDays.length, bests, own };
}
