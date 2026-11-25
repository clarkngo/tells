import type { Pattern } from '../../../lib/types';

// Game design basics: an easier warm-up for the game design track.
// Name the basic idea that makes a game fun, fair or clear.
export const patterns: Pattern[] = [
  { slug: "core-loop", name: "Core loop", hue: 0, live: true,
    blurb: "The main thing the player does again and again, like jump, collect, upgrade.",
    signals: ["again and again", "every round", "the main action"] },
  { slug: "clear-goal", name: "Clear goal", hue: 45, live: true,
    blurb: "Players should know what they're trying to do and how to win.",
    signals: ["didn't know what to do", "how to win", "goal"] },
  { slug: "feedback-juice", name: "Feedback", hue: 90, live: true,
    blurb: "The game shows and sounds what happened, so actions feel responsive.",
    signals: ["sound", "flash", "felt like nothing happened"] },
  { slug: "difficulty-curve", name: "Difficulty curve", hue: 135, live: true,
    blurb: "The game starts easy and gets harder as the player gets better.",
    signals: ["too hard too soon", "gets harder", "easy first level"] },
  { slug: "meaningful-choice", name: "Meaningful choice", hue: 180, live: true,
    blurb: "Choices matter when each option has a real upside and a downside.",
    signals: ["only one right answer", "trade-off", "both options"] },
  { slug: "reward-loop", name: "Rewards", hue: 225, live: true,
    blurb: "Points, unlocks and progress keep players motivated.",
    signals: ["unlock", "badge", "level up"] },
  { slug: "rules-limits", name: "Rules and limits", hue: 270, live: true,
    blurb: "Limits like time, lives or space create the challenge.",
    signals: ["only three lives", "time limit", "can't"] },
  { slug: "fair-randomness", name: "Fair luck", hue: 315, live: true,
    blurb: "Randomness adds surprise, but too much makes skill pointless.",
    signals: ["dice", "luck", "random"] },
];
