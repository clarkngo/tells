// Glyphs for the engineering judgment track. Same 160×56 canvas and motion classes.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;

// A door frame with a leaf that swings (open) or stays shut.
const Door = ({ x, swing }: { x: number; swing: boolean }) => (
  <g>
    <rect class="g-node" x={x} y={8} width={28} height={42} rx={2} />
    <rect class={swing ? 'g-fill g-flip' : 'g-fill'} style={swing ? { transformOrigin: `${x}px 28px` } : undefined} x={x + 2} y={10} width={24} height={38} rx={2} />
  </g>
);

export const engShapes: Record<string, Shape> = {
  // Getting it right
  'clarify-first': () => (
    <g>
      <rect class="g-node" x={14} y={12} width={52} height={32} rx={4} />
      <text class="g-fill g-bs" x={40} y={34} font-size="18" font-weight="700" text-anchor="middle">?</text>
      <path class="g-flow" d="M72 28 H96" />
      <rect class="g-tint" x={102} y={12} width={44} height={32} rx={4} />
      <path class="g-draw" pathLength={100} d="M110 28 l8 8 l18 -16" />
    </g>
  ),
  'timebox-then-ask': () => (
    <g>
      <circle class="g-node" cx={40} cy={28} r={18} />
      <path class="g-stroke g-spin" style={v({ transformOrigin: '40px 28px', '--t': '3s' })} d="M40 28 V14" />
      <path class="g-flow" d="M64 28 H92" />
      <circle class="g-fill g-bs" cx={112} cy={22} r={6} />
      <path class="g-fill g-bs" d="M102 46 a10 11 0 0 1 20 0 z" />
      <path class="g-stroke" d="M130 14 q8 -6 14 2 q4 6 -6 10 v4" />
    </g>
  ),
  'small-changes': () => (
    <g>
      <rect class="g-node g-faint" x={10} y={10} width={44} height={36} rx={3} />
      <path class="g-flow" d="M60 28 H76" />
      {[0, 1, 2, 3].map((i) => <rect class="g-fill g-bs" style={d(i * 0.25)} x={84 + i * 18} y={18} width={14} height={20} rx={2} />)}
    </g>
  ),
  'prove-it-works': () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g>
          <circle class="g-tint" cx={30 + i * 50} cy={28} r={12} />
          <path class="g-draw" pathLength={100} style={{ ...d(i * 0.4), stroke: 'var(--bg)' }} d={`M${24 + i * 50} 28 l5 5 l9 -10`} />
        </g>
      ))}
    </g>
  ),
  'own-the-mistake': () => (
    <g>
      <circle class="g-fill" cx={36} cy={20} r={7} />
      <path class="g-fill" d="M24 50 a12 13 0 0 1 24 0 z" />
      <path class="g-stroke" d="M50 22 l10 -8" />
      <path class="g-line g-dash" d="M70 34 H96" />
      <path class="g-stroke g-faint" d="M108 18 l16 20 M124 18 l-16 20" />
      <path class="g-draw" pathLength={100} d="M104 28 l10 10 l30 -26" />
    </g>
  ),

  // Design choices
  yagni: () => (
    <g>
      <rect class="g-fill" x={20} y={18} width={24} height={20} rx={3} />
      {[0, 1, 2, 3].map((i) => <rect class="g-node g-faint g-dash" x={56 + i * 24} y={18} width={20} height={20} rx={3} />)}
      <path class="g-stroke g-heap" d="M60 46 H146" />
    </g>
  ),
  'rule-of-three': () => (
    <g>
      {[0, 1, 2].map((i) => <rect class={i === 2 ? 'g-tint g-bs' : 'g-tint'} style={d(0.6)} x={14} y={6 + i * 16} width={34} height={12} rx={2} />)}
      <path class="g-flow" d="M56 28 H84" />
      <rect class="g-fill g-heap" x={96} y={16} width={50} height={24} rx={4} />
      <text x={121} y={32} font-size="10" font-weight="700" text-anchor="middle" fill="var(--bg)">×3</text>
    </g>
  ),
  'boring-tech': () => (
    <g>
      <rect class="g-fill" x={20} y={14} width={50} height={28} rx={4} />
      {[0, 1, 2].map((i) => <path class="g-line" d={`M28 ${22 + i * 6} H62`} style={{ stroke: 'var(--bg)' }} />)}
      <g class="g-faint">
        <path class="g-stroke g-spin" style={v({ transformOrigin: '118px 28px', '--t': '2s' })} d="M118 12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 l12 -4 z" />
      </g>
    </g>
  ),
  'measure-first': () => (
    <g>
      {[14, 30, 10, 44, 18].map((h, i) => <rect class={i === 3 ? 'g-fill g-ps' : 'g-tint g-ps'} style={d(i * 0.15)} x={20 + i * 22} y={50 - h} width={14} height={h} rx={2} />)}
      <path class="g-line" d="M12 50 H136" />
      <path class="g-stroke g-bs" style={d(0.8)} d="M91 2 v4" />
    </g>
  ),
  'build-vs-buy': () => (
    <g>
      {[0, 1, 2].map((i) => <rect class="g-fill g-bs" style={d(i * 0.3)} x={22} y={36 - i * 12} width={30} height={10} rx={2} />)}
      <text class="g-fill" x={80} y={33} font-size="11" text-anchor="middle">vs</text>
      <rect class="g-tint" x={108} y={14} width={34} height={30} rx={4} />
      <path class="g-stroke" d="M114 14 v-4 h22 v4" />
    </g>
  ),

  // Risk and delivery
  'two-way-door': () => (
    <g>
      <Door x={40} swing />
      <path class="g-flow" d="M80 22 H120" />
      <path class="g-flow" style={d(0.6)} d="M120 34 H80" />
    </g>
  ),
  'one-way-door': () => (
    <g>
      <Door x={40} swing={false} />
      <circle class="g-node" cx={62} cy={30} r={2} />
      <path class="g-flow" d="M80 28 H124" />
      <path class="g-stroke" d="M120 22 l8 6 l-8 6" />
      <path class="g-stroke g-faint" d="M136 18 v20" />
    </g>
  ),
  'ship-behind-flag': () => (
    <g>
      <path class="g-stroke" d="M18 50 V8" />
      <path class="g-fill g-sway" style={v({ '--dx': '0px', '--dy': '2px' })} d="M18 8 h24 l-6 7 l6 7 h-24 z" />
      {[0, 1, 2, 3, 4, 5].map((i) => <circle class={i < 2 ? 'g-fill' : 'g-tint g-bs'} style={d(0.4 + i * 0.3)} cx={62 + i * 16} cy={32} r={5} />)}
    </g>
  ),
  'mitigate-first': () => (
    <g>
      <path class="g-line" d="M10 40 L40 40 L52 12 L64 40" />
      <path class="g-draw" pathLength={100} d="M64 40 L150 40" />
      <path class="g-stroke g-heap" d="M64 20 a12 12 0 1 0 0 0.1" style={{ fill: 'none' }} />
      <path class="g-fill" d="M58 14 l6 -4 l0 8 z" />
    </g>
  ),
  'raise-risk-early': () => (
    <g>
      <path class="g-line" d="M10 44 H150" />
      {[30, 70, 110, 140].map((x) => <path class="g-line" d={`M${x} 40 v8`} />)}
      <path class="g-fill g-bs" d="M30 34 l10 -20 l10 20 z" />
      <text x={40} y={31} font-size="10" font-weight="700" text-anchor="middle" fill="var(--bg)">!</text>
      <path class="g-stroke g-faint" d="M140 14 v20" />
    </g>
  ),

  // Senior and team
  'write-it-down': () => (
    <g>
      <rect class="g-node" x={50} y={6} width={44} height={46} rx={3} />
      {[0, 1, 2, 3].map((i) => <path class="g-draw" pathLength={100} style={d(i * 0.3)} d={`M58 ${16 + i * 9} H${i === 3 ? 74 : 86}`} />)}
      <path class="g-fill g-sway" style={v({ '--dx': '10px' })} d="M104 40 l20 -24 l4 4 l-20 24 l-6 2 z" />
    </g>
  ),
  'disagree-and-commit': () => (
    <g>
      <path class="g-flow" d="M14 16 L60 28" />
      <path class="g-flow" style={d(0.5)} d="M14 40 L60 28" />
      <circle class="g-tint" cx={14} cy={16} r={5} />
      <circle class="g-tint" cx={14} cy={40} r={5} />
      <path class="g-fill" d="M60 22 H140 l8 6 l-8 6 H60 z" />
    </g>
  ),
  'negotiate-scope': () => (
    <g>
      <path class="g-stroke" d="M80 46 V18 M30 18 H130" />
      <path class="g-fill" d="M72 50 h16 l-8 -6 z" />
      <rect class="g-fill" x={22} y={22} width={18} height={14} rx={2} />
      <rect class="g-tint g-move" style={v({ '--dx': '18px', '--dy': '-14px', '--t': '2.8s' })} x={120} y={22} width={14} height={14} rx={2} />
      <rect class="g-tint" x={102} y={22} width={14} height={14} rx={2} />
    </g>
  ),
  'multiply-others': () => (
    <g>
      <circle class="g-fill" cx={30} cy={28} r={8} />
      {[[80, 12], [80, 28], [80, 44], [130, 12], [130, 28], [130, 44]].map(([x, y], i) => (
        <g>
          <path class="g-flow" style={d(i * 0.15)} d={`M${i < 3 ? 38 : 86} ${i < 3 ? 28 : [12, 28, 44][i - 3]} L${x - 6} ${y}`} />
          <circle class="g-tint g-bs" style={d(i * 0.2)} cx={x} cy={y} r={5} />
        </g>
      ))}
    </g>
  ),
  'pay-down-debt': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect class={i < 2 ? 'g-node g-faint' : 'g-fill'} x={20 + i * 26} y={50 - (5 - i) * 8} width={20} height={(5 - i) * 8} rx={2} />)}
      <path class="g-draw" pathLength={100} d="M16 10 C60 14 100 30 146 44" />
    </g>
  ),
};
