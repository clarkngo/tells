// Glyphs for the hard conversations track. Same 160×56 canvas and motion classes.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;

// A simple person: head and shoulders.
const P = ({ x, y = 14, cls = 'g-fill' }: { x: number; y?: number; cls?: string }) => (
  <g class={cls}>
    <circle cx={x} cy={y} r={6} />
    <path d={`M${x - 10} ${y + 30} a10 12 0 0 1 20 0 z`} />
  </g>
);
// A speech bubble.
const Bubble = ({ x, y, w = 34, cls = 'g-tint' }: { x: number; y: number; w?: number; cls?: string }) => (
  <path class={cls} d={`M${x} ${y} h${w} a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h${-w + 12} l-8 6 v-6 h-4 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z`} />
);

export const talkShapes: Record<string, Shape> = {
  // Conflict
  'talk-directly': () => (
    <g>
      <P x={40} y={16} />
      <P x={120} y={16} cls="g-tint" />
      <path class="g-flow" d="M56 26 H104" />
      {[20, 140].map((x) => <circle class="g-node g-faint" cx={x} cy={50} r={3} />)}
    </g>
  ),
  'interests-not-positions': () => (
    <g>
      <path class="g-line" d="M10 22 H150" />
      <rect class="g-tint" x={24} y={8} width={30} height={14} rx={3} />
      <rect class="g-tint" x={106} y={8} width={30} height={14} rx={3} />
      <path class="g-flow" d="M39 26 V36 Q39 44 70 44 M121 26 V36 Q121 44 90 44" />
      <circle class="g-fill g-heap" cx={80} cy={44} r={7} />
    </g>
  ),
  'lower-the-temperature': () => (
    <g>
      <rect class="g-node" x={70} y={4} width={12} height={40} rx={6} />
      <circle class="g-node" cx={76} cy={46} r={8} />
      <rect class="g-fill g-move" style={v({ '--dy': '8px', '--t': '3s' })} x={73} y={14} width={6} height={30} rx={3} />
      <circle class="g-fill" cx={76} cy={46} r={5} />
      {[0, 1, 2].map((i) => <path class="g-flow" style={d(i * 0.3)} d={`M${100 + i * 14} 10 q4 8 0 16 q-4 8 0 16`} />)}
    </g>
  ),
  'shared-goal': () => (
    <g>
      <P x={24} y={16} cls="g-tint" />
      <P x={136} y={16} cls="g-tint" />
      <path class="g-flow" d="M40 28 L70 28 M120 28 L90 28" />
      <circle class="g-node" cx={80} cy={28} r={12} />
      <circle class="g-fill g-heap" cx={80} cy={28} r={5} />
    </g>
  ),

  // Giving feedback
  'sbi-feedback': () => (
    <g>
      {['S', 'B', 'I'].map((t, i) => (
        <g class="g-bs" style={d(i * 0.4)}>
          <rect class="g-fill" x={16 + i * 48} y={18} width={32} height={20} rx={4} />
          <text x={32 + i * 48} y={32} font-size="11" font-weight="700" text-anchor="middle" fill="var(--bg)">{t}</text>
        </g>
      ))}
      <path class="g-line" d="M48 28 H64 M96 28 H112" />
    </g>
  ),
  'ask-their-view-first': () => (
    <g>
      <P x={34} y={20} />
      <Bubble x={52} y={6} w={20} cls="g-fill" />
      <text x={66} y={20} font-size="11" font-weight="700" text-anchor="middle" fill="var(--bg)">?</text>
      <P x={124} y={20} cls="g-tint" />
      <Bubble x={96} y={4} w={10} cls="g-node g-faint" />
    </g>
  ),
  'praise-specifically': () => (
    <g>
      <circle class="g-node" cx={80} cy={28} r={20} />
      <circle class="g-tint" cx={80} cy={28} r={12} />
      <circle class="g-fill g-heap" cx={80} cy={28} r={4} />
      <path class="g-flow" d="M14 10 L60 24" />
      <path class="g-fill g-bs" d="M130 14 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 z" />
    </g>
  ),
  'make-a-clear-request': () => (
    <g>
      <rect class="g-node" x={20} y={10} width={74} height={36} rx={4} />
      <path class="g-line g-faint" d="M28 20 H86 M28 28 H70" />
      <path class="g-stroke" d="M28 37 H60" />
      <path class="g-flow" d="M100 28 H120" />
      <path class="g-fill g-bs" d="M124 16 h20 l8 12 l-8 12 h-20 z" />
    </g>
  ),

  // Taking feedback
  'listen-dont-defend': () => (
    <g>
      <path class="g-fill" d="M70 12 a16 16 0 0 1 28 10 c0 10 -10 12 -10 22 a6 6 0 0 1 -12 0" />
      <path class="g-stroke" d="M82 20 a6 6 0 0 1 8 6" style={{ stroke: 'var(--bg)' }} />
      {[0, 1, 2].map((i) => <path class="g-flow" style={d(i * 0.25)} d={`M${20 + i * 12} ${18 + i * 6} H60`} />)}
      <rect class="g-node g-faint" x={112} y={18} width={30} height={20} rx={3} />
    </g>
  ),
  'ask-for-examples': () => (
    <g>
      <rect class="g-node g-faint" x={14} y={10} width={50} height={36} rx={4} />
      <circle class="g-stroke g-sway" style={v({ '--dx': '60px', '--t': '3s' })} cx={34} cy={26} r={10} />
      <path class="g-stroke g-sway" style={v({ '--dx': '60px', '--t': '3s' })} d="M41 33 L49 41" />
      <rect class="g-fill" x={100} y={18} width={14} height={14} rx={2} />
    </g>
  ),
  'find-the-grain-of-truth': () => (
    <g>
      {[[20, 20], [36, 34], [52, 14], [70, 40], [90, 22], [110, 36], [128, 16], [142, 40]].map(([x, y], i) => (
        <circle class={i === 4 ? 'g-fill g-heap' : 'g-node g-faint'} cx={x} cy={y} r={i === 4 ? 5 : 4} />
      ))}
      <circle class="g-ring" cx={90} cy={22} r={12} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
    </g>
  ),
  'close-the-loop': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M50 28 a30 18 0 1 1 30 18" />
      <path class="g-fill" d="M76 40 l8 6 l-8 6 z" />
      <circle class="g-tint" cx={50} cy={28} r={5} />
    </g>
  ),

  // Pushback and devil's advocate
  steelman: () => (
    <g>
      <Bubble x={16} y={14} w={30} cls="g-node g-faint" />
      <path class="g-flow" d="M60 26 H84" />
      <g class="g-heap">
        <Bubble x={94} y={10} w={44} cls="g-fill" />
      </g>
    </g>
  ),
  'agree-on-criteria': () => (
    <g>
      <rect class="g-node" x={50} y={8} width={60} height={40} rx={4} />
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-tint" x={58} y={14 + i * 11} width={8} height={8} rx={2} />
          <path class="g-draw" pathLength={100} style={{ ...d(i * 0.4), stroke: 'var(--bg)' }} d={`M59 ${18 + i * 11} l2 2 l4 -4`} />
          <path class="g-line" d={`M72 ${18 + i * 11} H102`} />
        </g>
      ))}
      <path class="g-flow" d="M14 28 H44 M146 28 H116" />
    </g>
  ),
  'concede-the-point': () => (
    <g>
      <path class="g-stroke" d="M40 50 V10" />
      <path class="g-fill g-sway" style={v({ '--dx': '0px', '--dy': '3px' })} d="M40 10 h30 v18 h-30 z" />
      <path class="g-flow" d="M84 30 H110" />
      <P x={130} y={16} cls="g-tint" />
    </g>
  ),
  'hold-your-ground': () => (
    <g>
      <rect class="g-fill" x={66} y={10} width={12} height={40} rx={2} />
      <path class="g-line" d="M40 50 H104" />
      {[0, 1, 2].map((i) => <path class="g-flow" style={d(i * 0.3)} d={`M${120 + i * 4} ${16 + i * 12} H84`} />)}
    </g>
  ),

  // The expert in the room
  'bottom-line-first': () => (
    <g>
      <rect class="g-fill g-bs" x={40} y={6} width={80} height={12} rx={3} />
      {[0, 1, 2].map((i) => <rect class="g-node g-faint" x={40} y={22 + i * 10} width={80 - i * 16} height={6} rx={2} />)}
    </g>
  ),
  'say-i-dont-know': () => (
    <g>
      <P x={50} y={14} />
      <Bubble x={68} y={4} w={24} cls="g-tint" />
      <text class="g-fill" x={84} y={18} font-size="11" font-weight="700" text-anchor="middle">?</text>
      <path class="g-flow" d="M104 36 H130" />
      <circle class="g-fill g-bs" style={d(0.8)} cx={140} cy={36} r={5} />
    </g>
  ),
  'ask-what-its-for': () => (
    <g>
      <rect class="g-tint" x={20} y={18} width={30} height={20} rx={3} />
      <path class="g-flow" d="M54 28 H96" />
      <circle class="g-node" cx={118} cy={28} r={16} />
      <circle class="g-tint" cx={118} cy={28} r={9} />
      <circle class="g-fill g-heap" cx={118} cy={28} r={3} />
      <text class="g-fill" x={75} y={20} font-size="10" text-anchor="middle">why?</text>
    </g>
  ),
  'coach-with-questions': () => (
    <g>
      <P x={30} y={16} cls="g-tint" />
      {[0, 1, 2].map((i) => <text class="g-fill g-bs" style={d(i * 0.35)} x={56 + i * 18} y={22 - i * 4} font-size="12" font-weight="700">?</text>)}
      <P x={130} y={16} />
      <circle class="g-fill g-bs" style={d(1.2)} cx={130} cy={2} r={2} />
    </g>
  ),
};
