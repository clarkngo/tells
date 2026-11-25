// Vocabulary for the dev-workflow-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "git", def: "The tool most teams use to track changes to code." },
  { term: "main", def: "The shared branch that holds the team's agreed, working code." },
  { term: "diff", def: "A view of exactly which lines changed." },
  { term: "deploy", aliases: ["deployed", "redeploying"], def: "Putting a version of the code onto the servers users reach." },
  { term: "production", def: "The live system real users use." },
  { term: "stack trace", def: "The list of function calls that were running when an error happened." },
  { term: "repository", aliases: ["repo"], def: "The project's code and its whole change history." },
  { term: "pipeline", def: "A set of automated steps run on each change." },
  { term: "lint", aliases: ["lints"], def: "Automatically checking code for style problems and common mistakes." },
];
