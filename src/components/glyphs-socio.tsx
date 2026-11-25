// Glyphs for the sociomateriality track. Same 160×56 canvas and motion classes.
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
// A small screen.
const Screen = ({ x, y, cls = 'g-tint' }: { x: number; y: number; cls?: string }) => (
  <g class={cls}>
    <rect x={x} y={y} width={26} height={18} rx={2} />
    <path d={`M${x + 9} ${y + 22} h8`} style={{ stroke: 'currentColor', strokeWidth: 2 }} />
  </g>
);

export const socioShapes: Record<string, Shape> = {
  // Core sociomaterial ideas
  entanglement: () => (
    <g>
      <path class="g-flow" d="M20 28 C50 4 70 52 100 28 S140 4 150 28" />
      <path class="g-draw" pathLength={100} d="M20 28 C50 52 70 4 100 28 S140 52 150 28" />
      {[48, 84, 122].map((x, i) => <circle class="g-fill g-heap" style={d(i * 0.3)} cx={x} cy={28} r={4} />)}
    </g>
  ),
  imbrication: () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect class={i % 2 ? 'g-tint g-bs' : 'g-fill g-bs'} style={d(i * 0.35)} x={22 + i * 26} y={34 - i * 7} width={40} height={12} rx={3} />
      ))}
    </g>
  ),
  affordance: () => (
    <g>
      <rect class="g-node" x={60} y={14} width={40} height={28} rx={4} />
      <P x={24} y={14} />
      <P x={136} y={14} cls="g-tint" />
      <path class="g-flow" d="M36 28 H58" />
      <path class="g-line g-dash g-faint" d="M102 28 H124" />
      <circle class="g-fill g-bs" cx={80} cy={28} r={5} />
    </g>
  ),
  constraint: () => (
    <g>
      <P x={24} y={14} />
      <path class="g-flow" d="M38 28 H74" />
      <rect class="g-fill" x={80} y={8} width={8} height={40} rx={2} />
      <path class="g-draw" pathLength={100} d="M74 34 C70 50 110 52 112 28 H140" />
    </g>
  ),

  // Practice and agency
  'technology-in-practice': () => (
    <g>
      <Screen x={67} y={4} cls="g-fill" />
      <path class="g-flow" d="M70 30 L30 44" />
      <path class="g-flow" style={d(0.5)} d="M90 30 L130 44" />
      <circle class="g-tint g-ring" cx={30} cy={44} r={7} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
      <rect class="g-tint" x={122} y={38} width={16} height={12} rx={2} />
    </g>
  ),
  'mangle-of-practice': () => (
    <g>
      <path class="g-line" d="M30 28 a20 14 0 1 0 40 0 a20 14 0 1 0 -40 0 M90 28 a20 14 0 1 0 40 0 a20 14 0 1 0 -40 0" />
      <circle class="g-fill g-spin" style={v({ transformOrigin: '50px 28px', '--t': '3s' })} cx={50} cy={14} r={5} />
      <rect class="g-tint g-spin" style={v({ transformOrigin: '110px 28px', '--t': '3s', animationDirection: 'reverse' })} x={105} y={9} width={10} height={10} rx={2} />
    </g>
  ),
  performativity: () => (
    <g>
      <path class="g-line g-dash" d="M14 44 L60 14" />
      <path class="g-draw" pathLength={100} d="M14 44 C30 40 44 26 60 16" />
      <path class="g-flow" d="M70 28 H92" />
      <circle class="g-node" cx={120} cy={28} r={16} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path class="g-fill g-spin" style={v({ transformOrigin: '120px 28px', '--t': '4s', transform: `rotate(${i * 60}deg)` })} d="M117 8 h6 v6 h-6 z" />)}
    </g>
  ),

  // Actor-network ideas
  inscription: () => (
    <g>
      <rect class="g-node" x={70} y={10} width={44} height={36} rx={4} />
      {[0, 1, 2].map((i) => <path class="g-draw" pathLength={100} style={d(i * 0.3)} d={`M78 ${20 + i * 9} H${i === 2 ? 94 : 106}`} />)}
      <path class="g-fill g-sway" style={v({ '--dx': '14px' })} d="M30 40 l20 -24 l4 4 l-20 24 l-6 2 z" />
    </g>
  ),
  'ant-translation': () => (
    <g>
      <circle class="g-fill g-heap" cx={80} cy={28} r={8} />
      {[[20, 10], [20, 46], [140, 10], [140, 46], [80, 4]].map(([x, y], i) => (
        <g>
          <path class="g-flow" style={d(i * 0.2)} d={`M${x} ${y} L80 28`} />
          <circle class="g-tint" cx={x} cy={y} r={4} />
        </g>
      ))}
    </g>
  ),
  'black-boxing': () => (
    <g>
      {[[40, 14], [52, 30], [36, 40], [60, 18], [48, 44]].map(([x, y], i) => (
        <circle class="g-node g-faint" cx={x} cy={y} r={3} />
      ))}
      <path class="g-flow" d="M72 28 H92" />
      <rect class="g-fill g-bs" x={100} y={12} width={36} height={32} rx={3} />
      <path class="g-line" d="M86 28 H100 M136 28 H152" />
    </g>
  ),

  // Neighbouring lenses
  'sociotechnical-systems': () => (
    <g>
      <P x={46} y={12} cls="g-tint" />
      <rect class="g-fill" x={98} y={12} width={30} height={30} rx={4} />
      <path class="g-line" d="M60 46 L80 50 L104 46" />
      <path class="g-stroke" d="M80 50 V8" />
      <path class="g-fill g-sway" style={v({ '--dx': '0px', '--dy': '2px' })} d="M74 8 h12 l-6 -6 z" />
    </g>
  ),
  'technological-determinism': () => (
    <g>
      <rect class="g-fill" x={14} y={16} width={30} height={24} rx={3} />
      <path class="g-flow" d="M50 28 H96" />
      <path class="g-stroke" d="M92 22 l8 6 l-8 6" />
      {[0, 1, 2].map((i) => <circle class="g-tint g-bs" style={d(0.6 + i * 0.2)} cx={118 + i * 14} cy={28} r={5} />)}
    </g>
  ),
  scot: () => (
    <g>
      {[[24, 10], [24, 46], [136, 28]].map(([x, y], i) => <circle class="g-tint" cx={x} cy={y} r={5} />)}
      <path class="g-flow" d="M30 12 L72 26 M30 44 L72 30 M130 28 L90 28" />
      <circle class="g-node" cx={80} cy={28} r={10} />
      <circle class="g-fill g-heap" cx={80} cy={28} r={5} />
    </g>
  ),
  infrastructure: () => (
    <g>
      <P x={50} y={6} cls="g-tint" />
      <P x={110} y={6} cls="g-tint" />
      <path class="g-line" d="M10 42 H150" />
      <path class="g-flow" d="M10 48 H150" />
      <path class="g-line g-dash g-faint" d="M10 54 H150" />
    </g>
  ),
  'boundary-object': () => (
    <g>
      <circle class="g-node g-faint" cx={44} cy={28} r={20} />
      <circle class="g-node g-faint" cx={116} cy={28} r={20} />
      <rect class="g-fill g-heap" x={72} y={18} width={16} height={20} rx={3} />
      <circle class="g-tint" cx={34} cy={28} r={4} />
      <circle class="g-tint" cx={126} cy={28} r={4} />
    </g>
  ),
  'workaround-bricolage': () => (
    <g>
      <rect class="g-node" x={60} y={10} width={40} height={36} rx={3} />
      <path class="g-line" d="M10 28 H56" />
      <path class="g-draw" pathLength={100} d="M40 28 C40 0 120 0 120 28 H150" />
      <rect class="g-fill g-bs" x={108} y={34} width={14} height={14} rx={1} style={{ transform: 'rotate(-8deg)', transformOrigin: '115px 41px' }} />
    </g>
  ),
};
