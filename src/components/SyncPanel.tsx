import { useEffect, useState } from 'preact/hooks';
import { exportCode, importCode, type ImportSummary } from '../lib/sync';
import { loadAttempts, CHANGED } from '../lib/storage';
import { loadProfile, PROFILE_CHANGED } from '../lib/profile';

export default function SyncPanel() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState({ answers: 0, xp: 0 });
  const [copied, setCopied] = useState(false);
  const [paste, setPaste] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportSummary | null>(null);
  const [error, setError] = useState('');

  const refresh = () => {
    setStats({ answers: loadAttempts().length, xp: loadProfile().xp });
    exportCode().then(setCode).catch(() => setCode(''));
  };
  useEffect(() => {
    refresh();
    addEventListener(CHANGED, refresh);
    addEventListener(PROFILE_CHANGED, refresh);
    return () => {
      removeEventListener(CHANGED, refresh);
      removeEventListener(PROFILE_CHANGED, refresh);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.getElementById('export-code') as HTMLTextAreaElement | null;
      el?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const doImport = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      setResult(await importCode(paste));
      setPaste('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.');
    }
    setBusy(false);
  };

  const nothingNew = result && !result.answers && !result.xp && !result.days && !result.bests;

  return (
    <div class="sync">
      <section class="card sync-card">
        <h2>1 · Copy from this device</h2>
        <p class="muted">
          {stats.answers} answers · {stats.xp.toLocaleString()} XP on this device. Copy the code and send it to
          yourself (Notes, email, a message).
        </p>
        <textarea id="export-code" readOnly rows={4} value={code} onFocus={(e) => e.currentTarget.select()} />
        <button class="btn primary" onClick={copy} disabled={!code}>
          {copied ? 'Copied ✓' : 'Copy progress code'}
        </button>
      </section>

      <section class="card sync-card">
        <h2>2 · Paste on the other device</h2>
        <p class="muted">
          Importing adds to what's here. Answers, XP, practice days and best scores combine, and importing the same
          code twice never counts anything double.
        </p>
        <textarea rows={4} placeholder="tells1.…" value={paste} onInput={(e) => setPaste(e.currentTarget.value)} />
        <button class="btn primary" onClick={doImport} disabled={busy || !paste.trim()}>
          {busy ? 'Importing…' : 'Import and merge'}
        </button>
        {error && <p class="sync-msg bad" role="alert">{error}</p>}
        {result && (
          <p class="sync-msg good" role="status">
            {nothingNew
              ? 'Already up to date: nothing new in that code.'
              : `Merged: +${result.answers} answers, +${result.xp.toLocaleString()} XP, +${result.days} practice days` +
                (result.bests ? `, ${result.bests} new best scores` : '') +
                '.'}
          </p>
        )}
      </section>
      <p class="muted small">
        Tip: to keep every device in step, import on each device the code from the others. Codes contain only your
        answers and scores.
      </p>
    </div>
  );
}
