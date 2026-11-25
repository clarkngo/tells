// Side by side: two patterns that got mixed up, with what to listen for in each.
// Signals both patterns share are marked, since they can't tell the two apart.

interface P { slug: string; name: string; hue: number; blurb: string; signals: string[] }

export default function TellApart({ a, b, times, tags }: { a: P; b: P; times?: number; tags?: [string, string] }) {
  const norm = (s: string) => s.toLowerCase().trim();
  const shared = new Set(a.signals.map(norm).filter((s) => b.signals.map(norm).includes(s)));
  const col = (p: P, tag?: string) => (
    <div class="apart-col" style={{ '--h': p.hue }}>
      {tag && <p class="apart-tag mono">{tag}</p>}
      <p class="pname">{p.name}</p>
      <p class="apart-blurb">{p.blurb}</p>
      {p.signals.length > 0 && (
        <ul class="apart-signals">
          {p.signals.map((s) => (
            <li class={shared.has(norm(s)) ? 'shared' : ''} title={shared.has(norm(s)) ? 'Both patterns have this signal' : undefined}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
  return (
    <div class="apart">
      <div class="apart-cols">
        {col(a, tags?.[0])}
        {col(b, tags?.[1])}
      </div>
      {shared.size > 0 && <p class="muted apart-note">Struck-through signals show up in both, so they can't settle it on their own.</p>}
      {times && times > 1 ? <p class="muted apart-note">You've mixed these two up {times} times.</p> : null}
    </div>
  );
}
