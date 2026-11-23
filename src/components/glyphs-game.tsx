// Glyphs for the game design track. Same 160×56 canvas and motion classes.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;

// A small raid: dots for players around a boss.
const Boss = ({ x = 80, r = 9 }: { x?: number; r?: number }) => <circle class="g-fill" cx={x} cy={28} r={r} />;

export const gameShapes: Record<string, Shape> = {
  // The fun it delivers
  'fun-challenge': () => (
    <g>
      <path class="g-line" d="M10 48 L50 48 L70 30 L90 30 L110 12 L150 12" />
      {[0, 1, 2].map((i) => <circle class="g-tint g-bs" style={d(i * 0.3)} cx={56 + i * 6} cy={44 - i * 4} r={3} />)}
      <path class="g-draw" pathLength={100} d="M14 44 L50 44 L70 26 L90 26 L110 8 L128 8" />
      <path class="g-fill" d="M140 4 v10 l8 -3 l-8 -3 z" />
    </g>
  ),
  'fun-fellowship': () => (
    <g>
      {[[56, 20], [80, 14], [104, 20]].map(([x, y], i) => (
        <g class="g-bs" style={d(i * 0.3)}>
          <circle class="g-fill" cx={x} cy={y} r={5} />
          <path class="g-fill" d={`M${x - 8} ${y + 22} a8 9 0 0 1 16 0 z`} />
        </g>
      ))}
      <path class="g-flow" d="M56 46 Q80 54 104 46" />
    </g>
  ),
  'fun-discovery': () => (
    <g>
      <path class="g-line" d="M10 48 C40 40 60 50 90 40 S140 30 150 34" />
      <path class="g-line" d="M120 34 L132 10 L144 34" />
      <g class="g-sway" style={v({ '--dx': '60px' })}>
        <circle class="g-stroke" cx={40} cy={24} r={9} />
        <path class="g-stroke" d="M47 31 L55 39" />
      </g>
      <text class="g-fill g-bs" x={132} y={30} font-size="12" text-anchor="middle">?</text>
    </g>
  ),
  'fun-fantasy': () => (
    <g>
      <circle class="g-node" cx={60} cy={20} r={7} />
      <path class="g-node" d="M50 48 a10 12 0 0 1 20 0 z" />
      <path class="g-flow" d="M76 28 H96" />
      <g class="g-bs">
        <path class="g-fill" d="M110 12 l6 -6 l6 6 l6 -6 l6 6 v6 h-30 z" />
        <circle class="g-fill" cx={122} cy={26} r={6} />
        <path class="g-fill" d="M110 50 a12 14 0 0 1 24 0 z" />
      </g>
    </g>
  ),
  'fun-expression': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect class={i === 2 ? 'g-fill g-heap' : 'g-tint'} x={20 + i * 26} y={16} width={20} height={24} rx={3} />)}
      <path class="g-draw" pathLength={100} d="M20 48 C50 44 70 52 100 46 S140 44 146 48" />
    </g>
  ),
  'fun-sensation': () => (
    <g>
      {[0, 1, 2].map((i) => <path class="g-flow" style={d(i * 0.2)} d={`M10 ${18 + i * 10} C40 ${8 + i * 10} 60 ${28 + i * 10} 90 ${18 + i * 10} S140 ${8 + i * 10} 150 ${18 + i * 10}`} />)}
      <circle class="g-ring" cx={80} cy={28} r={20} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
    </g>
  ),

  // What an encounter tests
  'gear-check': () => (
    <g>
      <Boss x={50} r={12} />
      <rect class="g-node" x={80} y={22} width={70} height={12} rx={3} />
      <rect class="g-fill g-sw" x={80} y={22} width={12} height={12} rx={3} style={{ animationDuration: '6s' }} />
      <path class="g-stroke" d="M136 16 V40" />
    </g>
  ),
  'attention-check': () => (
    <g>
      <Boss />
      <circle class="g-ring" cx={80} cy={28} r={24} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
      {[30, 50, 110, 130].map((x, i) => <circle class={i === 3 ? 'g-tint' : 'g-fill g-bs'} style={d(0.4)} cx={x} cy={28} r={4} />)}
      <text class="g-fill" x={80} y={10} font-size="11" text-anchor="middle">!</text>
    </g>
  ),
  'positioning-check': () => (
    <g>
      {[30, 70, 110].map((x) => <circle class="g-tint" cx={x} cy={28} r={12} />)}
      {[0, 1, 2, 3].map((i) => (
        <circle class="g-fill g-sway" style={v({ '--dx': `${[16, 20, -24, 8][i]}px`, '--dy': `${[6, -4, 2, 0][i]}px`, animationDelay: `${i * 0.2}s` })} cx={[14, 50, 134, 146][i]} cy={[22, 32, 26, 40][i]} r={4} />
      ))}
    </g>
  ),
  'coordination-check': () => (
    <g>
      <Boss />
      {[[30, 14], [30, 42], [130, 14], [130, 42]].map(([x, y], i) => (
        <g>
          <path class="g-line g-dash" d={`M${x} ${y} L80 28`} />
          <circle class="g-fill g-bs" style={d(i * 0.6)} cx={x} cy={y} r={5} />
          <text x={x} y={y + 3} font-size="7" text-anchor="middle" fill="var(--bg)">{i + 1}</text>
        </g>
      ))}
    </g>
  ),

  // Feel and systems
  juice: () => (
    <g>
      <circle class="g-fill g-heap" cx={60} cy={28} r={10} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <path class="g-stroke g-bs" style={{ ...d(i * 0.05), transform: `rotate(${a}deg)`, transformOrigin: '60px 28px' }} d="M76 28 h8" />
      ))}
      <path class="g-flow" d="M96 22 h40 M96 34 h28" />
    </g>
  ),
  'forgiving-input': () => (
    <g>
      <path class="g-stroke" d="M10 40 H70" />
      <path class="g-line g-dash" d="M70 40 H84" />
      <path class="g-stroke" d="M104 40 H150" />
      <path class="g-draw" pathLength={100} d="M50 36 C66 10 96 10 112 36" />
      <circle class="g-fill" cx={80} cy={36} r={3} />
    </g>
  ),
  'controlled-randomness': () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect class={i === 6 ? 'g-fill g-bs' : 'g-node'} style={d(i * 0.2)} x={12 + i * 20} y={20} width={16} height={16} rx={3} />
      ))}
      <path class="g-draw" pathLength={100} d="M12 46 L132 46 L132 40" />
    </g>
  ),
  'diminishing-returns': () => (
    <g>
      <path class="g-line" d="M14 48 H150 M14 48 V6" />
      <path class="g-line g-dash" d="M14 12 H150" />
      <path class="g-draw" pathLength={100} d="M14 48 C40 22 80 16 150 14" />
    </g>
  ),
  'difficulty-tuning': () => (
    <g>
      <path class="g-line" d="M10 48 L40 40 L60 36 L70 14 L80 32 L150 20" />
      <path class="g-draw" pathLength={100} d="M10 48 L40 40 L70 32 L100 28 L150 20" />
      <circle class="g-fill g-heap" cx={70} cy={14} r={3} />
    </g>
  ),

  // Design process
  'tissue-test': () => (
    <g>
      {[0, 1, 2, 3].map((i) => <rect class={i === 3 ? 'g-fill g-bs' : 'g-node g-faint'} x={20 + i * 30} y={14} width={22} height={28} rx={3} />)}
      <path class="g-flow" d="M20 48 H130" />
    </g>
  ),
  'one-word-pillar': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <path class="g-flow" style={d(i * 0.15)} d={`M${16 + i * 8} ${8 + i * 10} L80 28`} />)}
      <rect class="g-fill" x={84} y={20} width={56} height={16} rx={4} />
      <text x={112} y={32} font-size="10" font-weight="700" text-anchor="middle" fill="var(--bg)">WORD</text>
    </g>
  ),
  'serve-the-pillars': () => (
    <g>
      {[40, 80, 120].map((x) => <rect class="g-node" x={x - 5} y={14} width={10} height={36} rx={2} />)}
      <path class="g-stroke" d="M24 12 H136" />
      <circle class="g-fill g-move" style={v({ '--dy': '-14px', '--t': '2.6s' })} cx={60} cy={40} r={5} />
      <rect class="g-tint g-move" style={v({ '--dx': '30px', '--t': '2.6s', animationDelay: '1s' })} x={124} y={34} width={10} height={10} rx={2} />
    </g>
  ),
  'chicken-and-pig': () => (
    <g>
      <circle class="g-node g-faint" cx={40} cy={28} r={12} />
      <path class="g-line g-faint" d="M52 28 H70" />
      <circle class="g-fill g-heap" cx={110} cy={28} r={16} />
      <path class="g-draw" pathLength={100} d="M103 28 l5 5 l10 -11" style={{ stroke: 'var(--bg)' }} />
    </g>
  ),
  'scope-down': () => (
    <g>
      <rect class="g-node g-faint" x={12} y={6} width={70} height={44} rx={4} />
      <path class="g-flow" d="M88 28 H108" />
      <rect class="g-fill g-bs" x={116} y={18} width={24} height={20} rx={3} />
    </g>
  ),
};
