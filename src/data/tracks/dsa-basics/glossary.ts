// Vocabulary for the dsa-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "index", aliases: ["indexes"], def: "A position number in a list, usually starting at 0." },
  { term: "key", aliases: ["keys"], def: "The label you look something up by, like a name or a code." },
  { term: "node", aliases: ["nodes"], def: "One item in a linked structure, holding a value and links to other items." },
  { term: "pointer", aliases: ["pointers"], def: "A stored reference to where another item is." },
  { term: "Big-O", def: "A way to describe how the work grows as the data gets bigger." },
  { term: "binary search", def: "Finding an item in sorted data by checking the middle and discarding half each time." },
  { term: "breadth-first search", def: "Exploring a network level by level: all neighbours first, then their neighbours." },
  { term: "cache", def: "A store of recent results kept so they can be reused quickly." },
  { term: "sorted", def: "Arranged in order, such as smallest to largest or A to Z." },
  { term: "recursion", def: "A function solving a problem by calling itself on a smaller piece." },
];
