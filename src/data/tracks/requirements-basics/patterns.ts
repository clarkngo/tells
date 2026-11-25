import type { Pattern } from '../../../lib/types';

// Requirements basics: an easier warm-up for spec-driven development.
// Name the basic move for working out what should be built.
export const patterns: Pattern[] = [
  { slug: "user-need", name: "Start from the need", hue: 0, live: true,
    blurb: "Describe the problem the user has, not the solution someone has already picked.",
    signals: ["the user needs", "problem, not the feature", "so that"] },
  { slug: "acceptance-check", name: "Acceptance criteria", hue: 45, live: true,
    blurb: "Write down how you'll know it's done: checks anyone can test.",
    signals: ["done when", "given, when, then", "how we'll know"] },
  { slug: "scope-boundary", name: "Scope", hue: 90, live: true,
    blurb: "Say clearly what's in and what's out, so the work doesn't keep growing.",
    signals: ["out of scope", "not this time", "keeps growing"] },
  { slug: "edge-case-ask", name: "Edge cases", hue: 135, live: true,
    blurb: "Ask what happens in the unusual cases: empty, too many, wrong, at the same time.",
    signals: ["what if it's empty", "unusual case", "what if both"] },
  { slug: "vague-word", name: "Vague words", hue: 180, live: true,
    blurb: "Words like 'fast', 'easy' or 'secure' mean different things to different people; pin them down.",
    signals: ["fast", "user-friendly", "what does that mean exactly"] },
  { slug: "must-vs-nice", name: "Must-have or nice-to-have", hue: 225, live: true,
    blurb: "Sort what's essential from what would be nice, so the important part ships first.",
    signals: ["must have", "nice to have", "if there's time"] },
  { slug: "who-is-user", name: "Who is it for?", hue: 270, live: true,
    blurb: "Name who will use it, because different users need different things.",
    signals: ["which users", "admins or customers", "who is this for"] },
  { slug: "ask-why-request", name: "Ask why", hue: 315, live: true,
    blurb: "When someone asks for a feature, ask why, to find the real goal behind it.",
    signals: ["why do you want", "the real reason", "behind the request"] },
];
