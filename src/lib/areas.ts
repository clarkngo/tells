// Areas group tracks on the map so the sky stays readable as tracks are added.
// The map shows one cluster per area; tapping it zooms in to that area's suns.
// A track missing from this list lands in "More", so a new track never vanishes.

export interface Area {
  id: string;
  name: string;
  tracks: string[];
}

export const AREAS: Area[] = [
  { id: 'coding', name: 'Coding', tracks: ['dsa', 'dsa-basics', 'debugging', 'debugging-basics', 'engineering-judgment', 'dev-workflow-basics'] },
  { id: 'web', name: 'Web', tracks: ['system-design', 'web-basics', 'backend', 'frontend', 'web-page-basics'] },
  { id: 'systems', name: 'Systems', tracks: ['cloud-devops', 'security', 'databases'] },
  { id: 'ai', name: 'AI', tracks: ['ai-engineering', 'llm-basics', 'context-engineering', 'ai-agents', 'ai-901', 'ml-basics'] },
  { id: 'data', name: 'Data', tracks: ['data-science', 'stats-basics', 'garch', 'time-series-basics'] },
  { id: 'thinking', name: 'Thinking', tracks: ['first-principles', 'thinking-basics', 'spec-driven', 'requirements-basics', 'product-thinking'] },
  { id: 'people', name: 'People', tracks: ['disc', 'listening-basics', 'hard-conversations', 'negotiation', 'sociomateriality', 'tech-org-basics'] },
  { id: 'play', name: 'Play', tracks: ['game-design', 'play-basics'] },
];

/** Areas holding the given tracks, in area order, with leftovers in "More". */
export function groupByArea<T extends { slug: string }>(tracks: T[]): { id: string; name: string; tracks: T[] }[] {
  const bySlug = new Map(tracks.map((t) => [t.slug, t]));
  const used = new Set<string>();
  const out = AREAS.map((a) => {
    const ts = a.tracks.flatMap((s) => (bySlug.has(s) ? [bySlug.get(s)!] : []));
    ts.forEach((t) => used.add(t.slug));
    return { id: a.id, name: a.name, tracks: ts };
  }).filter((a) => a.tracks.length);
  const rest = tracks.filter((t) => !used.has(t.slug));
  if (rest.length) out.push({ id: 'more', name: 'More', tracks: rest });
  return out;
}
