// Workplace vocabulary for the drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: 'one-on-one', aliases: ['1:1', 'one-on-ones'], def: 'A regular private meeting between two people, often a manager and a report.' },
  { term: 'skip-level', def: "A meeting with your manager's manager." },
  { term: 'peer', aliases: ['peers'], def: 'A colleague at about the same level, not your manager or report.' },
  { term: 'stakeholder', aliases: ['stakeholders'], def: 'Someone with an interest in the outcome of the work.' },
  { term: 'exec', aliases: ['execs', 'executives'], def: 'A senior leader who makes or approves major decisions.' },
  { term: 'VP', def: 'Vice president: a senior leader over a large group.' },
  { term: 'performance review', aliases: ['performance reviews'], def: 'A formal review of how someone did over a period, often tied to pay or promotion.' },
  { term: '360 review', def: 'Feedback collected from peers, reports and managers, not only your boss.' },
  { term: 'devil’s advocate', aliases: ["devil's advocate"], def: 'Someone arguing the opposite side on purpose to test an idea.' },
  { term: 'launch', aliases: ['launches'], def: 'Releasing a product or feature to users.' },
  { term: 'OKR', aliases: ['OKRs'], def: 'Objectives and key results: a way to set goals with measurable results.' },
  { term: 'A/B test', def: 'An experiment that shows two versions to different users and compares results.' },
  { term: 'churn', def: 'Customers leaving or cancelling over a period.' },
  { term: 'all-hands', def: 'A meeting of the whole company or org.' },
  { term: 'status update', aliases: ['status updates'], def: 'A short report on where work stands.' },
  { term: 'code review', def: 'Teammates reading a change to catch bugs and share knowledge before it merges.' },
  { term: 'on-call', def: 'Being the person paged to respond when the system has problems.' },
  { term: 'handoff', def: 'Passing work from one person or team to another.' },
  { term: 'PM', aliases: ['product manager', 'product managers'], def: 'The person who decides what a product should do and in what order.' },
  { term: 'designer', aliases: ['designers'], def: 'The person who shapes how a product looks and works for users.' },
  { term: 'mentee', def: 'Someone being guided by a mentor.' },
];
