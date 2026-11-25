// Vocabulary for the time-series-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "time series", def: "Measurements of the same thing taken at regular times." },
  { term: "average", aliases: ["mean"], def: "The sum of values divided by how many there are." },
  { term: "forecast", aliases: ["forecasts"], def: "A prediction of future values." },
  { term: "return", aliases: ["returns"], def: "The percent change in a price over a period." },
  { term: "volatility", def: "How much values swing up and down." },
];
