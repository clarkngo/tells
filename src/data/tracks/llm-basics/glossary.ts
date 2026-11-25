// Vocabulary for the llm-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "LLM", aliases: ["LLMs"], def: "Large language model: a model trained on lots of text to predict and generate text." },
  { term: "token", aliases: ["tokens"], def: "A small chunk of text, often part of a word, that a model reads and writes." },
  { term: "prompt", aliases: ["prompts"], def: "The text you send to a model, including instructions and any material to use." },
  { term: "embedding", aliases: ["embeddings"], def: "A list of numbers that represents the meaning of a piece of text." },
  { term: "API", def: "A way for one program to send requests to another, such as an app calling a model." },
  { term: "chatbot", def: "An app that talks with people in messages, often built on an LLM." },
];
