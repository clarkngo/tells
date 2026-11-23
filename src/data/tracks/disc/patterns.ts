import type { Pattern } from '../../../lib/types';

// Communication styles with the DISC model. Two kinds of question: spot the
// style from behavior, then pick how to adapt your message to it. Each style
// also notes its Insights Discovery color, since the two map closely.
// DISC is a shared vocabulary for working together, not a test of ability.
export const patterns: Pattern[] = [
  { slug: 'high-d', name: 'D: Dominance', hue: 25, live: true,
    blurb: 'Fast-paced and questioning. Wants results, control and a challenge; can come across as blunt. (Fiery Red in Insights.)',
    signals: ['gets to the point', 'decides fast', 'pushes back', 'impatient with detail'] },
  { slug: 'high-i', name: 'i: Influence', hue: 85, live: true,
    blurb: 'Fast-paced and accepting. Enthusiastic, social and persuasive; loves ideas and recognition, less keen on detail. (Sunshine Yellow.)',
    signals: ['thinks out loud', 'stories and energy', 'big picture', 'wants to be liked'] },
  { slug: 'high-s', name: 'S: Steadiness', hue: 150, live: true,
    blurb: 'Reflective and accepting. Calm, loyal and supportive; values stability and harmony, dislikes sudden change. (Earth Green.)',
    signals: ['helps others', 'avoids conflict', 'needs time to adjust', 'steady routine'] },
  { slug: 'high-c', name: 'C: Conscientiousness', hue: 230, live: true,
    blurb: 'Reflective and questioning. Precise, logical and quality-focused; wants accuracy and time to analyze. (Cool Blue.)',
    signals: ['asks for data', 'follows the rules', 'checks for errors', 'writes it down'] },
  { slug: 'adapt-d', name: 'Adapt to D: bottom line first', hue: 15, live: true,
    blurb: 'Lead with the result, be brief, offer options and let them decide. Focus on outcomes, not feelings or process.',
    signals: ['short and direct', 'give options', 'focus on results', "don't ramble"] },
  { slug: 'adapt-i', name: 'Adapt to i: energy and recognition', hue: 70, live: true,
    blurb: 'Be warm and upbeat, talk it through, share the big picture and give credit. Put key details in writing for them.',
    signals: ['be friendly', 'brainstorm together', 'public credit', 'follow up in writing'] },
  { slug: 'adapt-s', name: 'Adapt to S: steady and supportive', hue: 165, live: true,
    blurb: "Slow down, explain why and how it affects people, give time to adjust and ask for their view one-on-one.",
    signals: ['no surprises', 'explain the why', 'reassure', 'give time'] },
  { slug: 'adapt-c', name: 'Adapt to C: facts and detail', hue: 245, live: true,
    blurb: 'Bring data and specifics, send it in writing ahead of time, allow time to analyze and welcome their questions.',
    signals: ['bring evidence', 'send it in advance', 'be precise', 'answer the questions'] },
];
