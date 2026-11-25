import type { Pattern } from '../../../lib/types';

// Listening basics: an easier warm-up for DISC and hard conversations.
// Name the basic listening move in an everyday conversation.
export const patterns: Pattern[] = [
  { slug: "reflect-back", name: "Reflect back", hue: 0, live: true,
    blurb: "Repeat the gist in your own words so the other person knows you heard them.",
    signals: ["so you're saying", "in other words", "if I've got it right"] },
  { slug: "open-question", name: "Open question", hue: 45, live: true,
    blurb: "Ask questions that can't be answered with yes or no, so the person can say more.",
    signals: ["what was that like", "how did", "tell me more"] },
  { slug: "dont-interrupt", name: "Let them finish", hue: 90, live: true,
    blurb: "Wait until they've finished before speaking, even when you think you know where it's going.",
    signals: ["cut in", "finish their sentence", "waited"] },
  { slug: "feeling-behind-words", name: "Name the feeling", hue: 135, live: true,
    blurb: "Notice and gently name the feeling under what's being said.",
    signals: ["sounds frustrating", "you seem worried", "feeling"] },
  { slug: "clarify-meaning", name: "Clarify", hue: 180, live: true,
    blurb: "Ask what a word or point means instead of guessing.",
    signals: ["what do you mean by", "can you give an example", "when you say"] },
  { slug: "summarise-points", name: "Summarise", hue: 225, live: true,
    blurb: "Pull the main points together at the end so you both agree on what was said.",
    signals: ["to sum up", "the three things", "before we finish"] },
  { slug: "hold-advice", name: "Hold the advice", hue: 270, live: true,
    blurb: "Don't jump in with fixes; sometimes people want to be heard first.",
    signals: ["jumped to solutions", "just wanted to vent", "do you want ideas"] },
  { slug: "body-language", name: "Show you're listening", hue: 315, live: true,
    blurb: "Eye contact, nodding and putting the phone away show you're paying attention.",
    signals: ["phone away", "nodding", "looking at the screen"] },
];
