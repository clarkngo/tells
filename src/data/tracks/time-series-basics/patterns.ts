import type { Pattern } from '../../../lib/types';

// Time series basics: an easier warm-up for GARCH.
// Name the basic feature of data measured over time.
export const patterns: Pattern[] = [
  { slug: "trend-line", name: "Trend", hue: 0, live: true,
    blurb: "A steady rise or fall over a long stretch of time.",
    signals: ["over the years", "steadily rising", "long-term"] },
  { slug: "seasonal-cycle", name: "Seasonality", hue: 45, live: true,
    blurb: "A pattern that repeats at the same time each day, week or year.",
    signals: ["every December", "weekends", "repeats each year"] },
  { slug: "random-noise", name: "Noise", hue: 90, live: true,
    blurb: "Random ups and downs that don't mean anything on their own.",
    signals: ["random", "day-to-day wiggle", "doesn't mean much"] },
  { slug: "moving-average", name: "Moving average", hue: 135, live: true,
    blurb: "Averaging the last few points to smooth out noise and see the shape.",
    signals: ["7-day average", "smooth", "rolling"] },
  { slug: "past-predicts", name: "Yesterday predicts today", hue: 180, live: true,
    blurb: "Today's value tends to be close to yesterday's; values are linked to recent ones.",
    signals: ["close to yesterday", "carries over", "depends on the last"] },
  { slug: "volatility-swings", name: "Volatility", hue: 225, live: true,
    blurb: "How big the swings are. Calm periods and wild periods tend to come in clusters.",
    signals: ["big swings", "calm then wild", "how much it jumps"] },
  { slug: "outlier-spike", name: "Outlier", hue: 270, live: true,
    blurb: "A single point far from the rest, often from a one-off event or an error.",
    signals: ["one huge spike", "one-off", "typo in the data"] },
  { slug: "percent-change", name: "Percent change", hue: 315, live: true,
    blurb: "Comparing change as a percentage so different sizes can be compared fairly.",
    signals: ["percent", "returns", "from 10 to 20"] },
];
