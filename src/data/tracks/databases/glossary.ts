// Vocabulary for the databases drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "index", aliases: ["indexes"], def: "A sorted structure that lets the database find rows without scanning the whole table." },
  { term: "join", aliases: ["joins"], def: "Combining rows from two tables that match on a key." },
  { term: "transaction", aliases: ["transactions"], def: "A group of changes that succeed or fail together." },
  { term: "lock", aliases: ["locks"], def: "A claim on rows or tables that makes other transactions wait." },
  { term: "ORM", def: "A library that maps database rows to objects in code." },
  { term: "NULL", def: "SQL's marker for a missing value." },
];
