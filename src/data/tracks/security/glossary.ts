// Vocabulary for the security drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "CVE", def: "A public ID for a known security flaw in a piece of software." },
  { term: "MFA", aliases: ["two-factor"], def: "Multi-factor authentication: a second proof, like a code or key, on top of a password." },
  { term: "CSP", aliases: ["Content Security Policy"], def: "A header that tells the browser which scripts and sources a page may load." },
  { term: "salt", def: "Random data added to each password before hashing so identical passwords hash differently." },
  { term: "IDOR", def: "Insecure direct object reference: accessing someone else's object by changing its ID." },
  { term: "SameSite", def: "A cookie setting that stops the browser sending the cookie on requests from other sites." },
];
