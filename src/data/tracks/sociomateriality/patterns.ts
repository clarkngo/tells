import type { Pattern } from '../../../lib/types';

// Sociomateriality: read a situation at work, with technology or in a research
// case, and name the lens or concept that explains it. Attributions point to the
// works most often cited for each idea.
export const patterns: Pattern[] = [
  // Core sociomaterial ideas
  { slug: 'entanglement', name: 'Entanglement', hue: 280, live: true,
    blurb: "The social and the material are inseparable in practice: neither exists first and then meets the other (Orlikowski 2007, building on Barad's idea of intra-action).",
    signals: ['cannot pull apart', 'no separate people and tech', 'performed together', 'one practice'] },
  { slug: 'imbrication', name: 'Imbrication', hue: 295, live: true,
    blurb: 'Human and material agencies stay distinct but interlock in layers over time, like overlapping roof tiles (Leonardi 2011).',
    signals: ['first the routine changed, then the tool', 'layer on layer', 'sequence of changes', 'human and material agency interlock'] },
  { slug: 'affordance', name: 'Affordance', hue: 310, live: true,
    blurb: "A possibility for action that arises between a technology's features and a particular user's goals (Gibson; Markus & Silver 2008).",
    signals: ['lets them do', 'same feature, different use', 'relational possibility', 'for this user'] },
  { slug: 'constraint', name: 'Constraint', hue: 325, live: true,
    blurb: "A technology's perceived limit on someone's goals, which pushes them to change their routine or the technology (Leonardi 2011).",
    signals: ['can no longer', 'stops them reaching a goal', 'forced to change routine', 'perceived limit'] },

  // Practice and agency
  { slug: 'technology-in-practice', name: 'Technology-in-practice', hue: 200, live: true,
    blurb: 'Structures a technology carries are enacted in everyday use, so the same system becomes different technologies-in-practice (Orlikowski 2000).',
    signals: ['same system, different use', 'enacted in use', 'recurrent practice', 'ignores half the features'] },
  { slug: 'mangle-of-practice', name: 'Mangle of practice', hue: 215, live: true,
    blurb: 'Practice is a dance of agency: material resistance meets human accommodation, and goals, machines and people are tuned together (Pickering 1995).',
    signals: ['resistance', 'accommodation', 'kept tuning', 'dance of agency'] },
  { slug: 'performativity', name: 'Performativity', hue: 245, live: true,
    blurb: 'Models and metrics help produce the reality they claim to describe: "an engine, not a camera" (Callon 1998; MacKenzie 2006).',
    signals: ['the model shapes the market', 'self-fulfilling metric', 'engine, not a camera', 'reality bends to the formula'] },

  // Actor-network ideas
  { slug: 'inscription', name: 'Inscription', hue: 20, live: true,
    blurb: 'Designers write a script into an artifact: a program of action that users are expected, or forced, to follow (Akrich 1992; Latour).',
    signals: ['designed to make them', 'built-in script', 'delegated to the object', 'expected user'] },
  { slug: 'ant-translation', name: 'Translation', hue: 35, live: true,
    blurb: 'An actor builds a network by framing a problem, interesting and enrolling others, and making itself an obligatory passage point (Callon 1986).',
    signals: ['enrol allies', 'obligatory passage point', 'problematization', 'interessement'] },
  { slug: 'black-boxing', name: 'Black-boxing', hue: 50, live: true,
    blurb: 'Once a network works, its many parts and past disputes fold into a single unit that people treat by its inputs and outputs (Latour 1987, 1999).',
    signals: ['taken for granted', 'only the output matters', 'once controversial', 'opening the box'] },

  // Neighbouring lenses
  { slug: 'sociotechnical-systems', name: 'Sociotechnical systems', hue: 120, live: true,
    blurb: 'Work has a social subsystem and a technical subsystem; design them together for joint optimization (Trist & Bamforth 1951).',
    signals: ['joint optimization', 'redesign teams and machines together', 'social and technical subsystems', 'autonomous work groups'] },
  { slug: 'technological-determinism', name: 'Technological determinism', hue: 135, live: true,
    blurb: 'The view that a technology by itself causes social outcomes, whatever people do with it.',
    signals: ['the tool will make', 'inevitable', 'technology drives change', 'impact of IT'] },
  { slug: 'scot', name: 'Social construction of technology', hue: 150, live: true,
    blurb: 'Relevant social groups read an artifact differently (interpretive flexibility) until debate reaches closure and the design stabilizes (Pinch & Bijker 1984).',
    signals: ['interpretive flexibility', 'relevant social groups', 'closure', 'competing designs'] },
  { slug: 'infrastructure', name: 'Infrastructure', hue: 165, live: true,
    blurb: 'Infrastructure is relational: embedded in other structures, learned as part of membership, and visible mainly when it breaks (Star & Ruhleder 1996).',
    signals: ['newcomers do not see it', 'embedded', 'installed base', 'visible on breakdown'] },
  { slug: 'boundary-object', name: 'Boundary object', hue: 180, live: true,
    blurb: 'An object flexible enough for several groups to use in their own way, yet robust enough to keep a shared identity (Star & Griesemer 1989).',
    signals: ['different communities', 'coordinate without consensus', 'means different things to each', 'shared yet local'] },
  { slug: 'workaround-bricolage', name: 'Workaround and bricolage', hue: 65, live: true,
    blurb: 'People improvise around a system with what is at hand, tinkering to get work done (Ciborra 1992, 2002).',
    signals: ['sticky notes', 'shadow spreadsheet', 'improvised fix', 'tinkering'] },
];
