// What to suggest after a low score. Each track lists easier tracks that already
// exist (best first), and a "basics" track that doesn't exist yet. When there's
// no easier track, the basics track goes on the learner's wishlist so it can be
// built later. `slug` is the slug the new track should use, so the wish shows as
// built once a track with that slug ships.

export interface Basics {
  slug: string;
  title: string;
  about: string;
}

export interface Related {
  easier: string[];
  basics: Basics;
}

export const related: Record<string, Related> = {
  dsa: {
    easier: [],
    basics: { slug: 'dsa-basics', title: 'Data structures basics', about: 'arrays, hash maps, stacks, queues, trees and Big-O in plain words' },
  },
  'system-design': {
    easier: ['backend'],
    basics: { slug: 'web-basics', title: 'How the web works', about: 'clients, servers, DNS, HTTP, databases and caches before scaling them' },
  },
  frontend: {
    easier: [],
    basics: { slug: 'web-page-basics', title: 'HTML, CSS and JavaScript basics', about: 'the DOM, layout, events and what the browser does with a page' },
  },
  backend: {
    easier: [],
    basics: { slug: 'web-basics', title: 'How the web works', about: 'clients, servers, DNS, HTTP, databases and caches before scaling them' },
  },
  'ai-engineering': {
    easier: ['ai-901'],
    basics: { slug: 'llm-basics', title: 'How LLMs work', about: 'tokens, context windows, temperature, embeddings and why models hallucinate' },
  },
  'context-engineering': {
    easier: ['ai-engineering'],
    basics: { slug: 'llm-basics', title: 'How LLMs work', about: 'tokens, context windows, temperature, embeddings and why models hallucinate' },
  },
  'ai-agents': {
    easier: ['context-engineering', 'ai-engineering'],
    basics: { slug: 'llm-basics', title: 'How LLMs work', about: 'tokens, context windows, temperature, embeddings and why models hallucinate' },
  },
  'spec-driven': {
    easier: [],
    basics: { slug: 'requirements-basics', title: 'Requirements basics', about: 'user stories, acceptance criteria, edge cases and done-ness' },
  },
  'data-science': {
    easier: [],
    basics: { slug: 'stats-basics', title: 'Statistics basics', about: 'mean and median, spread, distributions, correlation and sampling' },
  },
  garch: {
    easier: ['data-science'],
    basics: { slug: 'time-series-basics', title: 'Time series basics', about: 'returns, trend, seasonality, autocorrelation and stationarity' },
  },
  'ai-901': {
    easier: [],
    basics: { slug: 'ml-basics', title: 'Machine learning basics', about: 'features and labels, training versus inference, and classification versus regression' },
  },
  disc: {
    easier: [],
    basics: { slug: 'listening-basics', title: 'Listening basics', about: 'reflecting, asking open questions and reading what someone needs' },
  },
  'game-design': {
    easier: [],
    basics: { slug: 'play-basics', title: 'Game design basics', about: 'goals, rules, feedback, loops and player choice' },
  },
  'engineering-judgment': {
    easier: [],
    basics: { slug: 'dev-workflow-basics', title: 'Developer workflow basics', about: 'git, pull requests, code review, tests and asking for help well' },
  },
  debugging: {
    easier: ['backend'],
    basics: { slug: 'debugging-basics', title: 'Debugging basics', about: 'reading errors and logs, reproducing a bug and narrowing it down' },
  },
  'first-principles': {
    easier: [],
    basics: { slug: 'thinking-basics', title: 'Clear thinking basics', about: 'assumptions, cause and effect, and breaking a problem into parts' },
  },
};

/** A round below this share of clean right answers counts as a low score. */
export const LOW_SCORE = 0.6;
