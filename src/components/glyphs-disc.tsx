// Glyphs for the DISC communication-styles track: the DISC circle with D at top
// left, i top right, S bottom right and C bottom left. "Spot" glyphs light up a
// quadrant; "adapt" glyphs send a message bubble into it.
type Shape = () => preact.JSX.Element;

const CX = 40;
const CY = 28;
const R = 22;
// Quadrant wedges: [start angle, end angle] in degrees, 0 = right, clockwise.
const quads = { d: [180, 270], i: [270, 360], s: [0, 90], c: [90, 180] } as const;
type Q = keyof typeof quads;

const pt = (a: number, r = R, cx = CX) => [cx + r * Math.cos((a * Math.PI) / 180), CY + r * Math.sin((a * Math.PI) / 180)];
const wedge = (q: Q, r = R, cx = CX) => {
  const [a0, a1] = quads[q];
  const [x0, y0] = pt(a0, r, cx);
  const [x1, y1] = pt(a1, r, cx);
  return `M${cx} ${CY} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`;
};
const letters: Record<Q, [string, number, number]> = { d: ['D', -9, -6], i: ['i', 9, -6], s: ['S', 9, 12], c: ['C', -9, 12] };

const Circle = ({ on, cx = CX }: { on: Q; cx?: number }) => (
  <g>
    {(Object.keys(quads) as Q[]).map((q) => (
      <path class={q === on ? 'g-fill g-heap' : 'g-node'} style={q === on ? { transformOrigin: `${cx}px ${CY}px`, transformBox: 'view-box' } : undefined} d={wedge(q, R, cx)} />
    ))}
    {(Object.keys(letters) as Q[]).map((q) => {
      const [t, dx, dy] = letters[q];
      return <text x={cx + dx} y={CY + dy} font-size="10" font-weight="700" text-anchor="middle" fill={q === on ? 'var(--bg)' : 'var(--muted)'}>{t}</text>;
    })}
  </g>
);

// Spot: lines of behavior on the left feed into the circle.
const spot = (q: Q): Shape => () => (
  <g>
    {[0, 1, 2].map((i) => <path class="g-line" d={`M10 ${16 + i * 12} h${[48, 36, 42][i]}`} />)}
    <path class="g-flow" d="M64 28 H92" />
    <Circle on={q} cx={122} />
  </g>
);

// Adapt: a message bubble travels from you to the lit quadrant.
const adapt = (q: Q): Shape => () => (
  <g>
    <circle class="g-node" cx={16} cy={28} r={8} />
    <g class="g-move" style={{ '--dx': '64px', '--t': '2.6s' } as Record<string, string>}>
      <path class="g-fill" d="M28 20 h22 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-14 l-6 5 v-5 h-2 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4 z" />
    </g>
    <Circle on={q} cx={122} />
  </g>
);

export const discShapes: Record<string, Shape> = {
  'high-d': spot('d'),
  'high-i': spot('i'),
  'high-s': spot('s'),
  'high-c': spot('c'),
  'adapt-d': adapt('d'),
  'adapt-i': adapt('i'),
  'adapt-s': adapt('s'),
  'adapt-c': adapt('c'),
};
