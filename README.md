# Tells

**Every problem has a tell.** A pattern-recognition trainer for coding interviews: read a short problem, catch the signal, and name the pattern in under 20 seconds. It's the warm-up before LeetCode, not a replacement for it.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/tells/
npm run build    # type-checks, validates the problem bank, builds to dist/
```

## Content

Content is organised into **tracks** under `src/data/tracks/<track>/`. Right now there are two: `dsa` (algorithm patterns) and `system-design` (building blocks such as caches, queues and sharding). Each track gets its own `/<track>/drill/` and `/<track>/patterns/` pages. Register a new track in `src/lib/tracks.ts`.

Each track contains:

- `patterns.ts`: each pattern's slug, name, hue, blurb and signals. `live: true` puts it in the drills.
- `problems/*.json`: the quiz bank. Each problem lists its `tells`, which must appear word-for-word in its `prompt`. Its `answer` and three `decoys` must all be live patterns. `src/lib/tracks.ts` checks these rules and fails the build if one is broken.

Write prompts in your own words; don't copy problem statements.

## Deploy

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**. The site is served from `/tells/`; if you rename the repo, update `base` in `astro.config.mjs`.
