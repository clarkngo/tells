// Cousin patterns: the same idea showing up in different tracks. After a reveal
// the drill names the shared idea and links the cousins, so a pattern learned in
// one field carries over to the others. Each pattern is in at most one group, and
// every group spans at least two tracks (checked at build time below).
import { tracks } from './tracks';

/** [shared idea, ["track/slug", …]] */
const GROUPS: [string, string[]][] = [
  // Shipping and change
  ['Try it on a small slice first, so being wrong is cheap.',
    ['cloud-devops/canary-release', 'product-thinking/fake-door-test', 'thinking-basics/small-test-first', 'engineering-judgment/ship-behind-flag', 'dev-workflow-basics/feature-toggle']],
  ['Stop the damage first; work out why afterwards.',
    ['cloud-devops/quick-rollback', 'dev-workflow-basics/git-revert', 'engineering-judgment/mitigate-first', 'cloud-devops/blue-green-deploy']],
  ['Change one small thing at a time, so you know what did it.',
    ['engineering-judgment/small-changes', 'debugging-basics/one-change-at-a-time', 'dev-workflow-basics/git-commit']],
  ['Same code, different setup: make the setup a thing you can see and rebuild.',
    ['debugging/config-drift', 'debugging-basics/works-on-my-machine', 'cloud-devops/immutable-infra', 'cloud-devops/infra-as-code']],
  ['Ask what changed just before it broke.',
    ['debugging/recent-change', 'debugging-basics/what-changed-last']],
  ['Read the error before guessing.',
    ['debugging-basics/error-message-clue', 'dev-workflow-basics/read-the-error']],
  ['Halve the search each step.',
    ['debugging-basics/narrow-it-down', 'dsa/binary-search']],
  ['Name the belief you never checked.',
    ['debugging-basics/check-assumption-bug', 'thinking-basics/hidden-assumption']],
  ['Look at what it actually does before deciding why.',
    ['engineering-judgment/measure-first', 'databases/explain-plan', 'debugging-basics/print-values', 'cloud-devops/three-signals', 'debugging/distributed-tracing']],

  // Load, failure and capacity
  ['When something is struggling, back off instead of piling on.',
    ['cloud-devops/retry-backoff', 'debugging/thundering-herd', 'system-design/circuit-breaker']],
  ['Cap how often something can happen.',
    ['security/brute-force', 'system-design/rate-limiting', 'frontend/debounce']],
  ['Near full, waits explode: add room before you hit the wall.',
    ['cloud-devops/autoscaling', 'web-basics/too-much-traffic', 'first-principles/utilization-knee', 'debugging/resource-exhaustion']],
  ['Only send work to what says it is healthy.',
    ['cloud-devops/health-checks', 'system-design/load-balancer']],
  ['Watch what users feel, not every internal number.',
    ['cloud-devops/symptom-alerts', 'cloud-devops/slo-error-budget', 'first-principles/tail-latency']],
  ['Reuse a few expensive things, and always give them back.',
    ['backend/connection-pool', 'debugging/resource-leak']],
  ['Distance costs time: move the data closer.',
    ['system-design/cdn', 'web-basics/round-trip-delay', 'first-principles/latency-numbers']],
  ['Move slow work off the path the user waits on.',
    ['ai-engineering/batch-inference', 'backend/background-job', 'system-design/message-queue', 'frontend/web-worker']],
  ['Send results as they come instead of all at the end.',
    ['ai-engineering/streaming', 'system-design/websockets']],
  ['Split the work to run at once; the part that cannot split sets the limit.',
    ['ai-agents/parallelization', 'ai-agents/orchestrator-workers', 'first-principles/amdahls-law']],
  ['Only handle the slice that is in view.',
    ['frontend/virtualization', 'backend/cursor-pagination']],
  ['Load only what is needed, when it is needed.',
    ['frontend/code-splitting', 'frontend/islands', 'web-page-basics/script-load-order', 'context-engineering/just-in-time-context']],

  // Data
  ['Keep a ready copy so the slow work happens once, and watch for it going stale.',
    ['system-design/cache', 'web-basics/keep-a-copy', 'ai-engineering/semantic-cache', 'context-engineering/prompt-caching', 'frontend/swr', 'debugging/stale-cache']],
  ['Shape a separate copy just for reading.',
    ['databases/denormalize-read', 'system-design/cqrs']],
  ['Build a lookup ahead of time so you never scan everything.',
    ['backend/db-index', 'databases/missing-index', 'system-design/search-index', 'dsa-basics/hash-map-lookup']],
  ['One query per item: fetch them together instead.',
    ['backend/n-plus-one', 'databases/query-in-a-loop']],
  ['All of it happens, or none of it does.',
    ['backend/transactions', 'databases/transaction-atomic', 'backend/outbox']],
  ['Two writers on one thing: decide who wins before they collide.',
    ['backend/optimistic-locking', 'databases/row-lock-for-update', 'databases/isolation-level', 'debugging/race-condition']],
  ['Everyone waiting on someone else to let go.',
    ['databases/deadlock', 'debugging/lock-contention']],
  ['Copies cannot all agree at once while the network is split.',
    ['first-principles/cap-theorem', 'system-design/read-replicas', 'system-design/consensus']],
  ['Agree the shape between two sides, and keep it stable.',
    ['spec-driven/contract-first', 'backend/api-versioning', 'backend/expand-contract', 'first-principles/hyrums-law', 'ai-engineering/structured-output']],
  ['Pages built ahead of time or per request.',
    ['web-basics/static-or-dynamic', 'frontend/ssg', 'frontend/ssr']],
  ['The name a computer looks up before it can connect.',
    ['web-basics/dns-lookup', 'debugging/dns']],

  // Security
  ['Keep data from being read as instructions.',
    ['security/sql-injection', 'security/cross-site-scripting', 'context-engineering/delimiters']],
  ['Give each part only the access its job needs.',
    ['security/least-privilege', 'ai-agents/sandboxing']],
  ['Keep secrets and settings out of the code.',
    ['security/secrets-in-code', 'cloud-devops/env-config']],
  ['Who sent this request, and can you trust the proof?',
    ['security/session-hijack', 'web-basics/cookie-session', 'backend/jwt', 'backend/oauth']],

  // AI
  ['Give the model the facts instead of trusting its memory.',
    ['ai-engineering/rag', 'ai-901/rag', 'llm-basics/ground-in-sources', 'llm-basics/made-up-facts']],
  ['Nothing is remembered unless you send it back each time.',
    ['llm-basics/stateless-model', 'ai-901/chat-history', 'ai-agents/agent-memory']],
  ['Too much to fit: keep the gist and drop the rest.',
    ['llm-basics/context-window-limit', 'context-engineering/compaction']],
  ['Show a few worked examples of what you want.',
    ['ai-901/few-shot', 'context-engineering/few-shot']],
  ['Tell the model who it is and who it is talking to.',
    ['ai-901/system-prompt', 'context-engineering/role-and-audience']],
  ['The dial between safe and surprising.',
    ['ai-901/temperature', 'llm-basics/temperature-dial']],
  ['Meaning as numbers, so similar things sit close together.',
    ['llm-basics/meaning-vectors', 'ai-901/embedding-model']],
  ['It writes one likely piece at a time.',
    ['llm-basics/predict-next-word', 'ai-901/next-token']],
  ['Teach the model your task with your own examples.',
    ['ai-engineering/fine-tuning', 'ai-901/fine-tuning']],
  ['Send easy work to a small, fast model.',
    ['llm-basics/bigger-vs-faster', 'ai-901/small-model', 'ai-engineering/model-routing', 'ai-agents/routing']],
  ['The model asks your code to do something, then carries on.',
    ['ai-agents/tool-use', 'llm-basics/calls-a-tool', 'ai-901/ai-agent', 'ai-agents/agent-loop']],
  ['Check what goes in and comes out before it reaches anyone.',
    ['ai-engineering/guardrails', 'ai-901/content-filters']],
  ['A person checks before it lands.',
    ['ai-agents/human-in-the-loop', 'dev-workflow-basics/code-review']],
  ['Break the big job into steps you can check.',
    ['ai-agents/prompt-chaining', 'spec-driven/task-breakdown', 'thinking-basics/split-into-parts']],

  // Specs and checking
  ['Decide how you will check it before you build it.',
    ['requirements-basics/acceptance-check', 'spec-driven/acceptance-criteria', 'spec-driven/tests-as-spec', 'ai-engineering/evals']],
  ['Show it works; do not just say so.',
    ['engineering-judgment/prove-it-works', 'dev-workflow-basics/unit-test', 'spec-driven/verify-against-spec', 'dev-workflow-basics/continuous-integration']],
  ['Decide what you will not build.',
    ['product-thinking/say-no-to-feature', 'engineering-judgment/yagni', 'spec-driven/non-goals', 'engineering-judgment/negotiate-scope', 'requirements-basics/scope-boundary']],
  ['Find the smallest thing that is still worth having.',
    ['product-thinking/mvp-scope', 'game-design/scope-down', 'requirements-basics/must-vs-nice']],
  ['One clear goal that every decision is checked against.',
    ['product-thinking/north-star-metric', 'game-design/one-word-pillar', 'game-design/serve-the-pillars', 'thinking-basics/define-the-goal']],
  ['Keep it written where others, and future you, can find it.',
    ['engineering-judgment/write-it-down', 'context-engineering/structured-notes', 'spec-driven/living-spec']],

  // Numbers and evidence
  ['A number you aim at stops telling the truth.',
    ['first-principles/goodharts-law', 'product-thinking/vanity-metric', 'tech-org-basics/measure-changes-behavior', 'sociomateriality/performativity']],
  ['Split people at random, so the only difference is the change.',
    ['product-thinking/run-an-ab-test', 'data-science/ab-test', 'data-science/multi-armed-bandit']],
  ['Moving together does not mean one causes the other.',
    ['thinking-basics/cause-or-correlation', 'stats-basics/correlation-link', 'stats-basics/confounder']],
  ['Start from how common it is before the details.',
    ['stats-basics/base-rate', 'thinking-basics/base-rate-check', 'data-science/bayes-theorem']],
  ['Who got counted decides what you see.',
    ['stats-basics/sampling-bias', 'ml-basics/biased-training-data', 'ai-901/fairness']],
  ['One point far from the rest: a mistake, or the story?',
    ['stats-basics/outlier-point', 'time-series-basics/outlier-spike', 'data-science/anomaly-detection']],
  ['Judge a model on data it never learned from.',
    ['ml-basics/overfit-model', 'ml-basics/train-test-split', 'garch/out-of-sample']],
  ['How much it swings, and calm or wild spells that bunch together.',
    ['garch/volatility-clustering', 'time-series-basics/volatility-swings', 'stats-basics/standard-deviation']],
  ['Split a series into trend, season and noise.',
    ['data-science/time-series', 'time-series-basics/trend-line', 'time-series-basics/seasonal-cycle', 'time-series-basics/random-noise']],
  ['Predict a yes-or-no label.',
    ['ml-basics/classification-task', 'data-science/logistic-regression']],
  ['Predict a number.',
    ['ml-basics/regression-task', 'data-science/linear-regression']],
  ['Group similar things with no labels given.',
    ['ml-basics/clustering-task', 'data-science/k-means']],

  // Data structures
  ['Always hand back the most important item next.',
    ['dsa-basics/heap-priority', 'dsa/heap-top-k']],
  ['Last in, first out.',
    ['dsa-basics/stack-lifo', 'dsa/monotonic-stack']],
  ['First in, first out, one ring at a time.',
    ['dsa-basics/queue-fifo', 'dsa/bfs']],
  ['Things joined by links: walk them.',
    ['dsa-basics/graph-network', 'dsa/dfs']],

  // People
  ['Look past what is asked for to why it is wanted.',
    ['negotiation/find-their-interests', 'hard-conversations/interests-not-positions', 'product-thinking/job-to-be-done', 'requirements-basics/user-need', 'requirements-basics/ask-why-request', 'hard-conversations/ask-what-its-for']],
  ['Ask, then listen, before you tell.',
    ['listening-basics/open-question', 'hard-conversations/ask-their-view-first', 'hard-conversations/coach-with-questions', 'product-thinking/talk-to-users']],
  ['Show you heard before you answer.',
    ['listening-basics/reflect-back', 'hard-conversations/listen-dont-defend', 'listening-basics/summarise-points']],
  ['Pin down what is meant before acting on it.',
    ['listening-basics/clarify-meaning', 'engineering-judgment/clarify-first', 'spec-driven/clarify-first', 'requirements-basics/vague-word', 'hard-conversations/ask-for-examples']],
  ['Leave the pause; the other person fills it.',
    ['negotiation/use-silence', 'listening-basics/dont-interrupt']],
  ['Name the feeling before the facts.',
    ['listening-basics/feeling-behind-words', 'hard-conversations/lower-the-temperature']],
  ['Make it a problem you solve together.',
    ['hard-conversations/shared-goal', 'negotiation/expand-the-pie', 'hard-conversations/agree-on-criteria']],
  ['Lead with the answer.',
    ['hard-conversations/bottom-line-first', 'disc/adapt-d']],
  ['Admit it plainly; trust goes up, not down.',
    ['hard-conversations/say-i-dont-know', 'engineering-judgment/own-the-mistake']],

  // Tools and organisations (the basics track and its theory)
  ['People and tools shape each other.',
    ['first-principles/conways-law', 'tech-org-basics/shape-each-other', 'sociomateriality/entanglement', 'sociomateriality/sociotechnical-systems']],
  ['When the system does not fit, people route around it.',
    ['tech-org-basics/workaround', 'sociomateriality/workaround-bricolage']],
  ['The designer\'s rules travel inside the tool.',
    ['tech-org-basics/built-in-rule', 'sociomateriality/inscription']],
  ['Same tool, used differently by different groups.',
    ['tech-org-basics/same-tool-different-use', 'sociomateriality/technology-in-practice']],
  ['What a tool makes possible.',
    ['tech-org-basics/opens-a-possibility', 'sociomateriality/affordance']],
  ['What a tool rules out.',
    ['tech-org-basics/tool-blocks-goal', 'sociomateriality/constraint']],
  ['Early choices harden into layers that are hard to undo.',
    ['tech-org-basics/locked-in-choice', 'sociomateriality/imbrication']],
  ['It works, so nobody looks inside.',
    ['tech-org-basics/it-just-works', 'sociomateriality/black-boxing']],
  ['One thing different groups each read their own way.',
    ['tech-org-basics/shared-object', 'sociomateriality/boundary-object']],
  ['Everything has to pass through one point.',
    ['tech-org-basics/must-go-through', 'sociomateriality/ant-translation']],
  ['The work nobody sees until it stops.',
    ['tech-org-basics/invisible-work', 'sociomateriality/infrastructure']],

  // Play
  ['Every action gets a satisfying response.',
    ['play-basics/feedback-juice', 'game-design/juice']],
  ['Hard enough to matter, easy enough to keep going.',
    ['play-basics/difficulty-curve', 'game-design/difficulty-tuning']],
  ['Luck that feels fair.',
    ['play-basics/fair-randomness', 'game-design/controlled-randomness']],
];

export interface CousinLink { track: string; short: string; slug: string; name: string; hue: number; live: boolean }
export interface Cousins { idea: string; others: CousinLink[] }

const byTrack = new Map(tracks.map((t) => [t.slug, t]));

function resolve(ref: string): CousinLink | null {
  const [track, slug] = ref.split('/');
  const t = byTrack.get(track);
  const p = t?.patterns.find((x) => x.slug === slug);
  return t && p ? { track, short: t.short, slug, name: p.name, hue: p.hue, live: p.live } : null;
}

// Build-time check: a typo or a renamed pattern fails the build loudly.
const seen = new Set<string>();
for (const [idea, refs] of GROUPS) {
  for (const r of refs) {
    if (!resolve(r)) throw new Error(`cousins: unknown pattern ${r} (${idea})`);
    if (seen.has(r)) throw new Error(`cousins: ${r} is in two groups`);
    seen.add(r);
  }
  if (new Set(refs.map((r) => r.split('/')[0])).size < 2) throw new Error(`cousins: "${idea}" stays in one track`);
}

/** For one track: pattern slug → its shared idea and its cousins in other tracks. */
export function cousinsFor(track: string): Record<string, Cousins> {
  const out: Record<string, Cousins> = {};
  for (const [idea, refs] of GROUPS) {
    for (const r of refs) {
      const [t, slug] = r.split('/');
      if (t !== track) continue;
      const others = refs.filter((x) => x.split('/')[0] !== track).map((x) => resolve(x)!);
      out[slug] = { idea, others };
    }
  }
  return out;
}
