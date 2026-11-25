// Vocabulary for the ml-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "feature", aliases: ["features"], def: "An input the model uses, like a house's size or a word count." },
  { term: "model", aliases: ["models"], def: "A program whose behaviour was learned from data." },
  { term: "weights", def: "The numbers a model learns during training." },
  { term: "accuracy", def: "The share of predictions that are right." },
  { term: "recall", def: "Of all the real positive cases, the share the model caught." },
  { term: "supervised learning", def: "Learning from examples that include the right answers." },
  { term: "prompt", aliases: ["prompts"], def: "The text you give a generative model to tell it what to produce." },
  { term: "decision tree", def: "A model that makes a prediction by asking a series of yes-or-no questions." },
  { term: "churn", def: "Customers leaving a service." },
];
