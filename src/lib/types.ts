export interface Pattern {
  slug: string;
  name: string;
  hue: number;
  blurb: string;
  signals: string[];
  live: boolean;
}

export interface Problem {
  id: string;
  prompt: string;
  tells: string[];
  constraints?: string;
  answer: string;
  decoys: string[];
  why: string;
  trap: string;
  difficulty: 1 | 2 | 3;
  leetcode?: string;
}

export interface Track {
  slug: string;
  name: string;
  short: string; // nav label
  tagline: string;
  patterns: Pattern[];
  problems: Problem[];
}
