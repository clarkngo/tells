// Glyphs for the volatility modeling (GARCH) deep-dive track.
// Same 160×56 canvas and motion classes as the other glyph files.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;

// Return bars with calm and turbulent stretches, centered on y = 28.
const rets = [2, -3, 2, -2, 3, -2, 12, -16, 14, -18, 10, -12, 3, -2, 2, -3, 2, -2, 8, -10, 9, -7, 3, -2];
const Returns = ({ cls = 'g-tint' }: { cls?: string }) => (
  <g>
    {rets.map((r, i) => <rect class={cls} x={8 + i * 6} y={r > 0 ? 28 - r : 28} width={4} height={Math.abs(r)} rx={1} />)}
  </g>
);

export const garchShapes: Record<string, Shape> = {
  'volatility-clustering': () => (
    <g>
      <path class="g-line" d="M6 28 H154" />
      {rets.map((r, i) => (
        <rect class="g-fill g-bs" style={d(i * 0.08)} x={8 + i * 6} y={r > 0 ? 28 - r : 28} width={4} height={Math.abs(r)} rx={1} />
      ))}
    </g>
  ),
  'arch-lm-test': () => (
    <g>
      <path class="g-line" d="M10 46 H150" />
      {[30, 24, 19, 15, 12, 10, 8, 7].map((h, i) => (
        <rect class="g-fill g-ps" style={d(i * 0.15)} x={16 + i * 17} y={46 - h} width={10} height={h} rx={2} />
      ))}
      <path class="g-stroke g-dash" d="M10 34 H150" style={{ strokeWidth: 1.5 }} />
    </g>
  ),
  'garch-11': () => (
    <g>
      <Returns />
      <path class="g-draw" pathLength={100} d="M8 26 C30 26 40 26 44 22 C50 10 66 8 76 14 C90 22 96 25 110 24 C118 16 128 16 136 22 C144 25 150 26 154 26" />
    </g>
  ),
  'gjr-garch': () => (
    <g>
      <path class="g-line" d="M80 8 V48 M10 46 H150" />
      <path class="g-stroke" d="M18 10 C40 30 60 44 80 46" />
      <path class="g-tint" d="M80 46 C100 44 124 36 142 26" style={{ fill: 'none', stroke: 'currentColor', strokeOpacity: 0.45, strokeWidth: 2.5 }} />
      <circle class="g-fill g-sway" style={v({ '--dx': '-50px', '--dy': '-30px', '--t': '2.2s' })} cx={74} cy={45} r={4} />
    </g>
  ),
  egarch: () => (
    <g>
      <path class="g-line" d="M10 46 H150 M14 8 V48" />
      <path class="g-draw" pathLength={100} d="M14 44 C40 44 50 40 64 34 C80 28 90 18 110 14 C126 11 140 10 150 10" />
      <path class="g-stroke g-dash" d="M14 44 C60 44 90 36 150 30" style={{ strokeWidth: 1.5, opacity: 0.5 }} />
    </g>
  ),
  'garch-m': () => (
    <g>
      <rect class="g-node" x={10} y={12} width={34} height={32} rx={5} />
      <path class="g-stroke" d="M16 34 C22 34 22 20 27 20 C32 20 32 30 38 30" />
      <path class="g-flow" d="M48 28 H100" />
      {[0, 1, 2, 3].map((i) => <rect class="g-fill g-ps" style={d(i * 0.3)} x={108 + i * 11} y={40 - (i + 1) * 7} width={8} height={(i + 1) * 7} rx={2} />)}
    </g>
  ),
  igarch: () => (
    <g>
      <path class="g-line" d="M10 46 H150" />
      <path class="g-stroke g-dash" d="M20 14 C50 14 60 38 90 40 C120 42 140 42 150 42" style={{ strokeWidth: 1.5, opacity: 0.45 }} />
      <path class="g-draw" pathLength={100} d="M20 14 H150" />
      <circle class="g-fill g-heap" cx={20} cy={14} r={5} />
    </g>
  ),
  'fat-tails': () => (
    <g>
      <path class="g-line" d="M8 48 H152" />
      <path class="g-stroke g-dash" d="M20 48 C50 48 60 8 80 8 C100 8 110 48 140 48" style={{ strokeWidth: 1.5, opacity: 0.5 }} />
      <path class="g-draw" pathLength={100} d="M8 44 C40 42 58 12 80 12 C102 12 120 42 152 44" />
      <circle class="g-fill g-heap" cx={14} cy={44} r={3.5} />
      <circle class="g-fill g-heap" style={d(0.8)} cx={146} cy={44} r={3.5} />
    </g>
  ),
  'arma-garch': () => (
    <g>
      <rect class="g-node" x={10} y={8} width={60} height={18} rx={4} />
      <path class="g-stroke" d="M16 20 l8 -6 l8 6 l8 -6 l8 6 l8 -6" />
      <rect class="g-node" x={10} y={32} width={60} height={18} rx={4} />
      <Returns cls="g-faint g-tint" />
      <path class="g-flow" d="M74 17 H98 V41 H74" />
      <circle class="g-fill g-heap" cx={136} cy={28} r={8} />
    </g>
  ),
  'dcc-garch': () => (
    <g>
      {[[30, 14], [130, 14], [80, 46]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={6} />)}
      <path class="g-stroke g-heap" d="M36 14 H124" style={{ transformBox: 'view-box', transformOrigin: '80px 14px' }} />
      <path class="g-line" d="M34 19 L76 41 M126 19 L84 41" />
      <path class="g-flow" d="M34 19 L76 41" />
      <path class="g-flow" style={d(0.4)} d="M126 19 L84 41" />
    </g>
  ),
  'garch-var': () => (
    <g>
      <path class="g-line" d="M8 48 H152" />
      <path class="g-tint" d="M8 48 C30 46 40 30 60 12 C70 6 80 6 90 12 C110 30 130 46 152 48 z" />
      <path class="g-fill" d="M8 48 C16 47.5 22 46 28 44 V48 z" />
      <path class="g-stroke g-sway" style={v({ '--dx': '8px', '--t': '1.8s' })} d="M28 10 V50" />
    </g>
  ),

  // ---------------- estimation and evaluation ----------------
  mle: () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      <path class="g-stroke" d="M14 46 C50 46 60 10 80 10 C100 10 110 46 146 46" />
      <circle class="g-fill g-sway" style={v({ '--dx': '54px', '--dy': '-29px', '--t': '2.4s' })} cx={26} cy={41} r={5} />
      <path class="g-line g-dash" d="M80 6 V48" />
    </g>
  ),
  'param-constraints': () => (
    <g>
      <path class="g-line" d="M8 14 H72" />
      <path class="g-flow" d="M76 14 C96 14 100 30 112 30" />
      <rect class="g-stroke" x={114} y={10} width={38} height={36} rx={5} />
      {[0, 1, 2].map((i) => (
        <circle class="g-fill g-move" style={v({ '--dx': `${108 - i * 22}px`, '--dy': `${12 + i * 4}px`, '--t': '2.4s', animationDelay: `${i * 0.4}s` })}
          cx={20 + i * 22} cy={14} r={3.5} />
      ))}
    </g>
  ),
  'nelder-mead': () => (
    <g>
      {[44, 30, 16].map((r, i) => <ellipse class="g-line" cx={112} cy={30} rx={r} ry={r * 0.45} style={{ opacity: 0.5 + i * 0.2 }} />)}
      <g class="g-sway" style={v({ '--dx': '64px', '--dy': '6px', '--t': '2.6s' })}>
        <path class="g-tint" d="M24 34 L44 12 L52 40 z" style={{ stroke: 'currentColor', strokeWidth: 2 }} />
        <circle class="g-fill" cx={24} cy={34} r={3} />
      </g>
    </g>
  ),
  'kupiec-test': () => (
    <g>
      {Array.from({ length: 20 }, (_, i) => (
        <rect class={[3, 9, 14, 17].includes(i) ? 'g-fill g-bs' : 'g-node'} style={d((i % 5) * 0.2)}
          x={8 + i * 7.3} y={8} width={5.5} height={14} rx={1.5} />
      ))}
      <path class="g-line" d="M8 44 H152" />
      <rect class="g-fill g-ps" x={20} y={30} width={40} height={14} rx={3} />
      <path class="g-stroke g-dash" d="M70 30 V48" style={{ strokeWidth: 1.5 }} />
      <rect class="g-node" x={90} y={36} width={20} height={8} rx={3} />
    </g>
  ),
  'christoffersen-test': () => (
    <g>
      {Array.from({ length: 20 }, (_, i) => (
        <rect class={i >= 9 && i <= 12 ? 'g-fill g-heap' : 'g-node'} style={d((i - 9) * 0.15)}
          x={8 + i * 7.3} y={20} width={5.5} height={16} rx={1.5} />
      ))}
      <path class="g-stroke" d="M72 44 h32" />
      <path class="g-stroke" d="M72 12 h32" />
    </g>
  ),
  'model-selection': () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-fill" x={22 + i * 44} y={48 - (18 + i * 6)} width={22} height={18 + i * 6} rx={2} />
          <rect class="g-tint g-ps" style={d(0.3 + i * 0.3)} x={22 + i * 44} y={48 - (18 + i * 6) - (4 + i * 8)} width={22} height={4 + i * 8} rx={2} />
        </g>
      ))}
    </g>
  ),
  'out-of-sample': () => (
    <g>
      <path class="g-stroke" d="M8 34 C20 26 30 38 44 30 C58 22 70 36 92 28" />
      <path class="g-line g-dash" d="M96 6 V50" />
      <path class="g-flow" d="M100 28 C114 22 126 34 152 26" />
      <rect class="g-tint" x={100} y={8} width={52} height={40} rx={4} />
    </g>
  ),
};
