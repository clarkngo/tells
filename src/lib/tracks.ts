// Loads every track at build time and validates it. Any bad entry fails the build.
import { z } from 'astro/zod';
import type { Pattern, Problem, Track } from './types';
import { patterns as dsaPatterns } from '../data/tracks/dsa/patterns';
import { patterns as sdPatterns } from '../data/tracks/system-design/patterns';
import { patterns as aiEngPatterns } from '../data/tracks/ai-engineering/patterns';
import { patterns as agentPatterns } from '../data/tracks/ai-agents/patterns';
import { patterns as debugPatterns } from '../data/tracks/debugging/patterns';
import { patterns as dsPatterns } from '../data/tracks/data-science/patterns';
import { patterns as fpPatterns } from '../data/tracks/first-principles/patterns';

const problemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  prompt: z.string().min(20),
  tells: z.array(z.string().min(1)).min(1),
  constraints: z.string().optional(),
  answer: z.string(),
  decoys: z.array(z.string()).length(3),
  why: z.string(),
  trap: z.string(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  leetcode: z.string().url().optional(),
});

function loadProblems(files: Record<string, unknown>): Problem[] {
  return Object.entries(files).flatMap(([file, data]) =>
    z.array(problemSchema).parse(data, { path: [file] }),
  );
}

function check(slug: string, patterns: Pattern[], problems: Problem[]) {
  const live = new Set(patterns.filter((p) => p.live).map((p) => p.slug));
  const ids = new Set<string>();
  const errors: string[] = [];
  for (const p of problems) {
    const where = `[${slug}/${p.id}]`;
    if (ids.has(p.id)) errors.push(`${where} duplicate id`);
    ids.add(p.id);
    if (!live.has(p.answer)) errors.push(`${where} answer "${p.answer}" is not a live pattern`);
    for (const d of p.decoys) if (!live.has(d)) errors.push(`${where} decoy "${d}" is not a live pattern`);
    if (new Set([p.answer, ...p.decoys]).size !== 4) errors.push(`${where} answer and decoys must be 4 distinct patterns`);
    for (const t of p.tells) if (!p.prompt.includes(t)) errors.push(`${where} tell "${t}" not found in prompt`);
  }
  if (errors.length) throw new Error(`Problem bank errors:\n${errors.join('\n')}`);
}

function makeTrack(
  meta: Pick<Track, 'slug' | 'name' | 'short' | 'tagline'>,
  patterns: Pattern[],
  files: Record<string, unknown>,
): Track {
  const problems = loadProblems(files);
  check(meta.slug, patterns, problems);
  return { ...meta, patterns, problems };
}

export const dsa = makeTrack(
  { slug: 'dsa', name: 'Data structures & algorithms', short: 'DSA',
    tagline: 'Read a coding problem, name the algorithm pattern.' },
  dsaPatterns,
  import.meta.glob('../data/tracks/dsa/problems/*.json', { eager: true, import: 'default' }),
);

export const systemDesign = makeTrack(
  { slug: 'system-design', name: 'System design', short: 'System design',
    tagline: 'Read a scenario, name the building block it needs.' },
  sdPatterns,
  import.meta.glob('../data/tracks/system-design/problems/*.json', { eager: true, import: 'default' }),
);

export const aiEngineering = makeTrack(
  { slug: 'ai-engineering', name: 'AI engineering', short: 'AI eng',
    tagline: 'Read an LLM product problem, name the technique it needs.' },
  aiEngPatterns,
  import.meta.glob('../data/tracks/ai-engineering/problems/*.json', { eager: true, import: 'default' }),
);

export const aiAgents = makeTrack(
  { slug: 'ai-agents', name: 'AI agents', short: 'Agents',
    tagline: 'Read an agent scenario, name the design pattern it calls for.' },
  agentPatterns,
  import.meta.glob('../data/tracks/ai-agents/problems/*.json', { eager: true, import: 'default' }),
);

export const debugging = makeTrack(
  { slug: 'debugging', name: 'Systems debugging', short: 'Debugging',
    tagline: 'Read a production symptom, name the likely cause or the move to make.' },
  debugPatterns,
  import.meta.glob('../data/tracks/debugging/problems/*.json', { eager: true, import: 'default' }),
);

export const dataScience = makeTrack(
  { slug: 'data-science', name: 'Data science', short: 'Data science',
    tagline: 'Read a use case, name the model, algorithm or statistical method it needs.' },
  dsPatterns,
  import.meta.glob('../data/tracks/data-science/problems/*.json', { eager: true, import: 'default' }),
);

export const firstPrinciples = makeTrack(
  { slug: 'first-principles', name: 'First principles', short: 'Principles',
    tagline: 'Read a situation, name the law of engineering that explains it.' },
  fpPatterns,
  import.meta.glob('../data/tracks/first-principles/problems/*.json', { eager: true, import: 'default' }),
);

export const tracks: Track[] = [dsa, systemDesign, aiEngineering, aiAgents, dataScience, debugging, firstPrinciples];
