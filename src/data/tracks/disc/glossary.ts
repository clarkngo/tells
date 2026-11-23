// Words used in DISC questions. Definitions describe the idea, never which
// pattern a question is about.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: 'DISC', def: 'A four-style model of how people prefer to act and communicate: Dominance, Influence, Steadiness and Conscientiousness. Based on William Marston\'s 1928 work.' },
  { term: 'Dominance', aliases: ['high-D', 'high D'], def: 'The D style: direct, fast-paced, results-focused, likes control and challenge.' },
  { term: 'Influence', aliases: ['high-i', 'high i'], def: 'The i style: enthusiastic, social, optimistic, likes recognition and new ideas.' },
  { term: 'Steadiness', aliases: ['high-S', 'high S'], def: 'The S style: calm, patient, supportive, likes stability and harmony.' },
  { term: 'Conscientiousness', aliases: ['high-C', 'high C'], def: 'The C style: precise, analytical, quality-focused, likes accuracy and clear standards.' },
  { term: 'fast-paced', aliases: ['outspoken'], def: 'One DISC axis: D and i act and speak quickly and assertively.' },
  { term: 'reflective', aliases: ['moderate-paced'], def: 'The other end of that axis: S and C are more measured and think before acting.' },
  { term: 'questioning', def: 'One DISC axis: D and C are task-focused and quick to challenge.' },
  { term: 'accepting', aliases: ['people-oriented'], def: 'The other end of that axis: i and S are warmer and focus on people.' },
  { term: 'blend', aliases: ['blends'], def: 'Most people have two strong styles, written like "Di" or "SC". The first letter is the stronger.' },
  { term: 'flex', aliases: ['flexing', 'style flexing'], def: 'Adjusting how you communicate to fit someone else\'s style, without changing who you are.' },
  { term: 'stressor', aliases: ['stressors'], def: 'What wears a style down: D, losing control; i, being ignored; S, sudden change or conflict; C, being wrong or rushed.' },
  { term: 'Insights Discovery', aliases: ['Insights'], def: 'A similar color model: Fiery Red ≈ D, Sunshine Yellow ≈ i, Earth Green ≈ S, Cool Blue ≈ C.' },
  { term: 'Fiery Red', def: 'Insights Discovery color closest to DISC D.' },
  { term: 'Sunshine Yellow', def: 'Insights Discovery color closest to DISC i.' },
  { term: 'Earth Green', def: 'Insights Discovery color closest to DISC S.' },
  { term: 'Cool Blue', def: 'Insights Discovery color closest to DISC C.' },
  { term: 'micromanaged', aliases: ['micromanaging'], def: 'Being watched and directed in fine detail instead of being trusted with the goal.' },
  { term: 'pre-read', def: 'Material sent before a meeting so people arrive prepared.' },
  { term: 'one-on-one', def: 'A private conversation between two people, usually a manager and a team member.' },
  { term: 'all-hands', def: 'A meeting of the whole team or company.' },
];
