// Vocabulary for the web-page-basics drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "element", aliases: ["elements"], def: "One piece of the page, written as an HTML tag such as <p> or <button>." },
  { term: "CSS", def: "The language that sets colours, fonts, sizes and layout." },
  { term: "selector", aliases: ["selectors"], def: "The part of a CSS rule or JS lookup that says which elements it applies to." },
  { term: "class", aliases: ["classes"], def: "A label added to elements so CSS and JavaScript can target them." },
  { term: "screen reader", def: "Software that reads the page aloud for people who can't see it." },
  { term: "media query", def: "A CSS rule that only applies at certain screen sizes." },
];
