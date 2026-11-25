// Vocabulary for the debugging-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "bug", aliases: ["bugs"], def: "A mistake that makes a program behave wrongly." },
  { term: "stack trace", def: "The list of function calls printed with an error, showing where it happened." },
  { term: "breakpoint", aliases: ["breakpoints"], def: "A marker that pauses the program at a line so you can look at values." },
  { term: "log", aliases: ["logs", "logging"], def: "Messages a program prints or saves about what it's doing." },
  { term: "production", def: "The live system real users use." },
  { term: "regression", def: "Something that used to work and broke after a change." },
];
