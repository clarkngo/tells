// Vocabulary for the stats-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "histogram", def: "A bar chart showing how many values fall in each range." },
  { term: "scatter plot", def: "A chart with one dot per item, placed by two measurements." },
  { term: "coefficient", def: "A number summarizing a relationship, often between -1 and 1." },
  { term: "survey", aliases: ["surveys"], def: "Asking a group of people questions to learn about them." },
  { term: "dataset", def: "A collection of records used for analysis." },
  { term: "trend line", def: "A line drawn through data to show its general direction." },
  { term: "false positive", aliases: ["false alarm"], def: "A test or alarm saying yes when the true answer is no." },
  { term: "accuracy", def: "The share of cases a test or model gets right." },
];
