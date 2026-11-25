import type { APIRoute } from 'astro';
import { tracks } from '../../lib/tracks';
import type { Track } from '../../lib/types';

// One track's questions, fetched by the Fix my misses page only for the tracks
// that have misses waiting, so no page has to ship every track's questions.
export function getStaticPaths() {
  return tracks.map((t) => ({ params: { track: t.slug }, props: { t } }));
}

export const GET: APIRoute = ({ props }) => {
  const { t } = props as { t: Track };
  return new Response(JSON.stringify({
    slug: t.slug,
    name: t.name,
    short: t.short,
    patterns: t.patterns,
    problems: t.problems,
    glossary: t.glossary,
  }));
};
