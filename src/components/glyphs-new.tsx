// Glyphs for the frontend, backend, prompt & context engineering and spec-driven tracks.
// Same 160×56 canvas and motion classes as the other glyph files.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const at = (x: number, y: number) => ({ transformOrigin: `${x}px ${y}px` });
const v = (o: Record<string, string | number>) => o;
const Box = ({ x, y, w = 26, h = 22, cls = 'g-node' }: { x: number; y: number; w?: number; h?: number; cls?: string }) =>
  <rect class={cls} x={x} y={y} width={w} height={h} rx={4} />;
const Lines = ({ x, y, n, w = 30, gap = 7 }: { x: number; y: number; n: number; w?: number; gap?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <path class="g-line" d={`M${x} ${y + i * gap} h${i % 3 === 2 ? w * 0.6 : w}`} />)}</g>
);
const Db = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path class="g-node" d={`M${x} ${y + 5} v26 a14 5 0 0 0 28 0 v-26`} />
    <ellipse class="g-node" cx={x + 14} cy={y + 5} rx={14} ry={5} />
  </g>
);
const Check = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) =>
  <path class="g-draw" pathLength={100} style={d(delay)} d={`M${x} ${y} l4 4 l8 -9`} />;

export const newShapes: Record<string, Shape> = {
  // ---------------- prompt & context engineering ----------------
  'few-shot': () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g class="g-faint">
          <Box x={10} y={6 + i * 16} w={18} h={10} />
          <path class="g-line" d={`M32 ${11 + i * 16} h10`} />
          <Box x={46} y={6 + i * 16} w={18} h={10} cls="g-tint" />
        </g>
      ))}
      <Box x={92} y={20} w={22} h={14} />
      <path class="g-line" d="M118 27 h10" />
      <rect class="g-fill g-bs" x={132} y={20} width={22} height={14} rx={4} />
    </g>
  ),
  'chain-of-thought': () => (
    <g>
      <path class="g-line" d="M10 46 H40 V34 H70 V22 H100 V10 H136" />
      <path class="g-draw" pathLength={100} d="M10 46 H40 V34 H70 V22 H100 V10 H136" />
      {[[40, 46], [70, 34], [100, 22]].map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={3.5} />)}
      <circle class="g-fill g-heap" cx={144} cy={10} r={5} />
    </g>
  ),
  'role-and-audience': () => (
    <g>
      <circle class="g-fill" cx={24} cy={20} r={7} />
      <path class="g-fill" d="M10 48 a14 12 0 0 1 28 0 z" />
      <circle class="g-node" cx={136} cy={22} r={6} />
      <path class="g-node" d="M124 48 a12 10 0 0 1 24 0 z" />
      <g class="g-move" style={v({ '--dx': '66px', '--t': '2.6s' })}>
        <rect class="g-tint" x={46} y={12} width={26} height={14} rx={6} />
        <path class="g-stroke" d="M51 19 h16" />
      </g>
    </g>
  ),
  delimiters: () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g class="g-bs" style={d(i * 0.5)}>
          <path class="g-stroke" d={`M${16 + i * 46} 14 l-6 14 l6 14 M${44 + i * 46} 14 l6 14 l-6 14`} />
          <rect class="g-tint" x={18 + i * 46} y={18} width={24} height={20} rx={3} />
        </g>
      ))}
    </g>
  ),
  'clear-instructions': () => (
    <g>
      <Lines x={14} y={12} n={5} w={92} />
      <rect class="g-tint g-heap" x={10} y={22} width={100} height={8} rx={3} />
      <circle class="g-fill" cx={134} cy={28} r={12} />
      <path class="g-draw" pathLength={100} style={{ stroke: 'var(--surface)' }} d="M128 28 l4 4 l8 -9" />
    </g>
  ),
  'context-ordering': () => (
    <g>
      {Array.from({ length: 9 }, (_, i) => <rect class="g-node" x={8 + i * 12} y={14} width={9} height={28} rx={2} />)}
      <rect class="g-fill g-sway" style={v({ '--dx': '60px', '--t': '2.4s' })} x={56} y={14} width={9} height={28} rx={2} />
      <path class="g-line" d="M124 28 h8" />
      <circle class="g-stroke" cx={144} cy={28} r={9} />
      <circle class="g-fill" cx={144} cy={28} r={3} />
    </g>
  ),
  'just-in-time-context': () => (
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <rect class="g-node g-faint" x={8 + (i % 4) * 16} y={6 + Math.floor(i / 4) * 16} width={12} height={12} rx={2} />
      ))}
      <rect class="g-stroke" x={112} y={10} width={40} height={36} rx={5} />
      <rect class="g-fill g-move" style={v({ '--dx': '98px', '--dy': '0px', '--t': '2.4s' })} x={24} y={22} width={12} height={12} rx={2} />
    </g>
  ),
  compaction: () => (
    <g>
      <rect class="g-stroke" x={8} y={8} width={144} height={40} rx={6} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect class="g-tint g-sway" style={v({ '--dx': `${-i * 11}px`, '--t': '2.6s' })} x={20 + i * 11} y={16} width={7} height={24} rx={2} />
      ))}
      <rect class="g-fill g-heap" x={128} y={16} width={14} height={24} rx={3} />
    </g>
  ),
  'structured-notes': () => (
    <g>
      <rect class="g-stroke g-bs" x={8} y={10} width={44} height={36} rx={5} />
      <path class="g-line g-dash" d="M58 28 h28" />
      <rect class="g-node" x={92} y={4} width={56} height={48} rx={4} />
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-node" x={98} y={12 + i * 13} width={8} height={8} rx={2} />
          <path class="g-line" d={`M112 ${16 + i * 13} h28`} />
          <Check x={99} y={15 + i * 13} delay={i * 0.6} />
        </g>
      ))}
    </g>
  ),
  'context-isolation': () => (
    <g>
      <rect class="g-stroke" x={8} y={10} width={46} height={36} rx={6} />
      <rect class="g-node" x={108} y={6} width={44} height={44} rx={6} />
      <path class="g-flow" d="M56 22 H106" />
      {Array.from({ length: 6 }, (_, i) => <rect class="g-tint" x={114 + (i % 3) * 12} y={12 + Math.floor(i / 3) * 16} width={9} height={12} rx={2} />)}
      <circle class="g-fill g-move" style={v({ '--dx': '-58px', '--dy': '0px', '--t': '2.4s' })} cx={106} cy={36} r={4} />
    </g>
  ),
  'prompt-caching': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect class="g-fill" x={8 + i * 22} y={18} width={20} height={20} rx={3} />)}
      <rect class="g-node g-bs" x={120} y={18} width={32} height={20} rx={3} />
      <path class="g-stroke" d="M8 46 H116" />
    </g>
  ),

  // ---------------- spec-driven development ----------------
  'spec-first': () => (
    <g>
      <rect class="g-node" x={12} y={6} width={36} height={44} rx={4} />
      <Lines x={18} y={14} n={5} w={24} />
      <path class="g-flow" d="M54 28 H96" />
      <g class="g-bs" style={d(0.6)}>
        <path class="g-stroke" d="M112 16 l-10 12 l10 12 M136 16 l10 12 l-10 12 M128 14 l-8 28" />
      </g>
    </g>
  ),
  'acceptance-criteria': () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-node" x={30} y={8 + i * 15} width={11} height={11} rx={2} />
          <path class="g-line" d={`M48 ${13.5 + i * 15} h80`} />
          <Check x={31.5} y={13 + i * 15} delay={i * 0.5} />
        </g>
      ))}
    </g>
  ),
  'clarify-first': () => (
    <g>
      <path class="g-node" d="M20 10 h60 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-44 l-10 8 v-8 h-6 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6 z" />
      <path class="g-draw" pathLength={100} d="M44 20 c0 -6 12 -6 12 0 c0 5 -6 5 -6 10" />
      <circle class="g-fill" cx={50} cy={35} r={1.8} />
      <path class="g-flow" d="M92 28 H120" />
      <rect class="g-tint g-bs" style={d(0.8)} x={124} y={16} width={28} height={24} rx={4} />
    </g>
  ),
  'plan-then-build': () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g>
          <rect class="g-stroke g-dash" x={14 + i * 34} y={10} width={26} height={36} rx={3} style={{ strokeWidth: 1.5 }} />
          <rect class="g-fill g-ps" style={d(0.4 + i * 0.35)} x={18 + i * 34} y={14} width={18} height={28} rx={2} />
        </g>
      ))}
    </g>
  ),
  'task-breakdown': () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect class="g-fill g-split" style={v({ '--dx': `${(i - 1.5) * 14}px` })} x={44 + i * 18} y={14} width={18} height={28} rx={i === 0 ? 4 : i === 3 ? 4 : 0} />
      ))}
    </g>
  ),
  'tests-as-spec': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g>
          <circle class="g-node" cx={24 + i * 28} cy={28} r={9} />
          <circle class="g-fill g-bs" style={d(i * 0.4)} cx={24 + i * 28} cy={28} r={9} />
        </g>
      ))}
    </g>
  ),
  'contract-first': () => (
    <g>
      <rect class="g-stroke" x={70} y={8} width={20} height={40} rx={3} />
      <path class="g-line g-dash" d="M80 12 V44" />
      <g class="g-sway" style={v({ '--dx': '20px', '--t': '2.2s' })}>
        <Box x={22} y={16} w={26} h={24} />
        <path class="g-stroke" d="M48 22 h4 M48 34 h4" />
      </g>
      <g class="g-sway" style={v({ '--dx': '-20px', '--t': '2.2s' })}>
        <Box x={112} y={16} w={26} h={24} cls="g-tint" />
        <path class="g-stroke" d="M108 22 h4 M108 34 h4" />
      </g>
    </g>
  ),
  'non-goals': () => (
    <g>
      <circle class="g-stroke" cx={64} cy={28} r={22} />
      {[[56, 22], [70, 20], [60, 34], [74, 33]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={3.5} />)}
      <circle class="g-node g-sway" style={v({ '--dx': '-18px', '--t': '1.6s' })} cx={118} cy={24} r={4} />
      <path class="g-stroke" d="M128 36 l10 10 M138 36 l-10 10" />
    </g>
  ),
  'living-spec': () => (
    <g>
      <rect class="g-node" x={14} y={8} width={36} height={40} rx={4} />
      <Lines x={20} y={16} n={4} w={24} />
      <rect class="g-node" x={110} y={8} width={36} height={40} rx={4} />
      <path class="g-stroke" d="M120 18 l-5 6 l5 6 M136 18 l5 6 l-5 6" />
      <path class="g-flow" d="M56 20 H104" />
      <path class="g-flow" d="M104 36 H56" />
      <circle class="g-fill g-heap" cx={32} cy={44} r={3} />
      <circle class="g-fill g-heap" cx={128} cy={44} r={3} />
    </g>
  ),
  'verify-against-spec': () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-node" x={12} y={8 + i * 15} width={34} height={10} rx={2} />
          <rect class="g-tint" x={114} y={8 + i * 15} width={34} height={10} rx={2} />
          <path class="g-draw" pathLength={100} style={d(i * 0.5)} d={`M48 ${13 + i * 15} H112`} />
        </g>
      ))}
    </g>
  ),

  // ---------------- frontend ----------------
  ssr: () => (
    <g>
      <Box x={10} y={10} w={34} h={36} />
      <path class="g-line" d="M16 20 h22 M16 28 h22 M16 36 h22" />
      <rect class="g-stroke" x={108} y={8} width={44} height={40} rx={5} />
      <g class="g-move" style={v({ '--dx': '66px', '--t': '2.4s' })}>
        <rect class="g-fill" x={50} y={18} width={22} height={20} rx={3} />
      </g>
    </g>
  ),
  ssg: () => (
    <g>
      <rect class="g-node" x={22} y={6} width={30} height={36} rx={4} />
      <rect class="g-node" x={16} y={10} width={30} height={36} rx={4} />
      <rect class="g-fill" x={10} y={14} width={30} height={36} rx={4} />
      {[0, 1, 2].map((i) => (
        <rect class="g-tint g-move" style={v({ '--dx': `${70 + i * 20}px`, '--dy': `${(i - 1) * 14}px`, '--t': '2.6s', animationDelay: `${i * 0.3}s` })}
          x={50} y={20} width={16} height={18} rx={3} />
      ))}
    </g>
  ),
  islands: () => (
    <g>
      <rect class="g-stroke" x={10} y={6} width={140} height={44} rx={6} />
      <rect class="g-tint" x={18} y={12} width={60} height={8} rx={2} />
      <rect class="g-tint" x={18} y={26} width={124} height={4} rx={2} />
      <rect class="g-tint" x={18} y={34} width={90} height={4} rx={2} />
      <rect class="g-fill g-heap" x={96} y={11} width={46} height={10} rx={3} />
      <rect class="g-fill g-heap" style={d(0.8)} x={116} y={33} width={26} height={10} rx={3} />
    </g>
  ),
  'code-splitting': () => (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g>
          <rect class="g-node" x={12 + i * 24} y={12} width={18} height={32} rx={3} />
          <rect class="g-fill g-ps" style={d(i * 0.4)} x={12 + i * 24} y={12} width={18} height={32} rx={3} />
        </g>
      ))}
    </g>
  ),
  virtualization: () => (
    <g>
      <g class="g-sway" style={v({ '--dy': '-48px', '--t': '3s' })}>
        {Array.from({ length: 12 }, (_, i) => <rect class="g-tint" x={44} y={4 + i * 8} width={72} height={5} rx={2} />)}
      </g>
      <rect class="g-stroke" x={38} y={14} width={84} height={28} rx={4} />
    </g>
  ),
  debounce: () => (
    <g>
      <path class="g-line" d="M8 40 H152" />
      {Array.from({ length: 8 }, (_, i) => <path class="g-stroke g-bs" style={d(i * 0.12)} d={`M${14 + i * 10} 40 v-10`} />)}
      <circle class="g-fill g-bs" style={d(1.4)} cx={136} cy={30} r={7} />
    </g>
  ),
  'optimistic-ui': () => (
    <g>
      <path class="g-fill g-heap" d="M40 44 C14 28 18 10 32 12 C36 13 39 16 40 19 C41 16 44 13 48 12 C62 10 66 28 40 44 z" />
      <path class="g-flow" d="M72 28 H118" />
      <Box x={122} y={14} w={30} h={28} />
    </g>
  ),
  swr: () => (
    <g>
      <rect class="g-fill" x={62} y={18} width={36} height={20} rx={4} />
      <g class="g-spin" style={{ ...at(80, 28), ...v({ '--t': '3s' }) }}>
        <path class="g-stroke" d="M56 18 A26 26 0 0 1 104 18" />
        <path class="g-stroke" d="M104 38 A26 26 0 0 1 56 38" />
        <path class="g-fill" d="M104 18 l-7 -1 l5 -6 z" />
      </g>
    </g>
  ),
  'offline-first': () => (
    <g>
      <rect class="g-stroke" x={12} y={8} width={26} height={42} rx={5} />
      {[0, 1, 2].map((i) => <rect class="g-fill g-bs" style={d(i * 0.4)} x={18} y={14 + i * 10} width={14} height={6} rx={2} />)}
      <path class="g-line g-dash" d="M44 28 H108" />
      <path class="g-node" d="M114 38 a8 8 0 0 1 2 -16 a12 12 0 0 1 22 -2 a8 8 0 0 1 4 18 z" />
    </g>
  ),
  'image-optimization': () => (
    <g>
      <rect class="g-stroke" x={10} y={6} width={60} height={44} rx={4} />
      <path class="g-tint" d="M14 46 l16 -18 l12 12 l8 -8 l16 14 z" />
      <path class="g-flow" d="M76 28 H104" />
      <rect class="g-fill g-heap" x={112} y={18} width={26} height={20} rx={3} />
    </g>
  ),
  'web-worker': () => (
    <g>
      <path class="g-line" d="M8 16 H152 M8 40 H152" />
      {[0, 1, 2, 3].map((i) => <circle class="g-fill g-shuttle" style={d(i * 0.35)} cx={14 + i * 34} cy={16} r={3.5} />)}
      <rect class="g-fill g-heap" x={64} y={32} width={44} height={16} rx={4} />
    </g>
  ),

  // ---------------- backend ----------------
  'db-index': () => (
    <g>
      <path class="g-line" d="M80 10 L44 28 M80 10 L116 28 M44 28 L26 46 M44 28 L62 46 M116 28 L98 46 M116 28 L134 46" />
      <path class="g-draw" pathLength={100} d="M80 10 L116 28 L98 46" />
      {[[80, 10], [44, 28], [116, 28], [26, 46], [62, 46], [134, 46]].map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={4.5} />)}
      <circle class="g-fill g-heap" cx={98} cy={46} r={4.5} />
    </g>
  ),
  'n-plus-one': () => (
    <g>
      <Box x={10} y={16} w={26} h={24} />
      <Db x={122} y={10} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle class="g-fill g-move" style={v({ '--dx': '76px', '--t': '2s', animationDelay: `${i * 0.25}s` })} cx={44} cy={20 + i * 4} r={3} />
      ))}
    </g>
  ),
  transactions: () => (
    <g>
      <path class="g-stroke" d="M30 8 h-10 v40 h10 M130 8 h10 v40 h-10" />
      <rect class="g-node" x={36} y={18} width={36} height={20} rx={3} />
      <rect class="g-node" x={88} y={18} width={36} height={20} rx={3} />
      <rect class="g-fill g-bs" x={36} y={18} width={36} height={20} rx={3} />
      <rect class="g-fill g-bs" x={88} y={18} width={36} height={20} rx={3} />
    </g>
  ),
  'optimistic-locking': () => (
    <g>
      <rect class="g-node" x={64} y={14} width={32} height={28} rx={4} />
      <circle class="g-fill" cx={80} cy={28} r={5} />
      <circle class="g-fill g-sway" style={v({ '--dx': '38px', '--t': '2s' })} cx={20} cy={22} r={5} />
      <circle class="g-node g-sway" style={v({ '--dx': '-22px', '--t': '1s' })} cx={140} cy={34} r={5} />
      <path class="g-stroke" d="M122 22 l8 8 M130 22 l-8 8" />
    </g>
  ),
  'cursor-pagination': () => (
    <g>
      <Cells8 />
      <path class="g-fill g-sw" d="M10 48 l6 -8 l6 8 z" />
    </g>
  ),
  outbox: () => (
    <g>
      <Db x={10} y={10} />
      <rect class="g-stroke" x={44} y={30} width={26} height={18} rx={3} />
      <rect class="g-node" x={116} y={14} width={36} height={28} rx={4} />
      <path class="g-line" d="M122 22 h24 M122 30 h24" />
      <g class="g-move" style={v({ '--dx': '62px', '--dy': '-16px', '--t': '2.4s' })}>
        <rect class="g-fill" x={50} y={34} width={14} height={10} rx={2} />
      </g>
    </g>
  ),
  'background-job': () => (
    <g>
      <path class="g-stroke" d="M10 20 H52 M52 20 l-6 -5 M52 20 l-6 5" />
      <path class="g-stroke" d="M52 36 H10 M10 36 l6 -5 M10 36 l6 5" />
      <path class="g-flow" d="M58 28 H98" />
      <g class="g-spin" style={{ ...at(124, 28), ...v({ '--t': '3s' }) }}>
        <circle class="g-stroke" cx={124} cy={28} r={12} style={{ strokeDasharray: '6 4' }} />
        <circle class="g-fill" cx={124} cy={16} r={3} />
      </g>
    </g>
  ),
  'connection-pool': () => (
    <g>
      <Box x={8} y={12} w={28} h={32} />
      <Db x={124} y={10} />
      {[0, 1, 2, 3].map((i) => <path class="g-flow" style={d(i * 0.2)} d={`M40 ${17 + i * 7} H120`} />)}
    </g>
  ),
  'expand-contract': () => (
    <g>
      <rect class="g-node" x={20} y={10} width={24} height={36} rx={3} />
      <rect class="g-tint g-bs" style={{ animationDuration: '3.2s' }} x={50} y={10} width={24} height={36} rx={3} />
      <rect class="g-fill g-ps" x={80} y={10} width={24} height={36} rx={3} style={{ animationDuration: '3.2s' }} />
      <rect class="g-node" x={110} y={10} width={24} height={36} rx={3} />
    </g>
  ),
  'api-versioning': () => (
    <g>
      <Box x={110} y={6} w={40} h={18} />
      <Box x={110} y={32} w={40} h={18} cls="g-tint" />
      <circle class="g-node" cx={20} cy={14} r={6} />
      <circle class="g-fill" cx={20} cy={42} r={6} />
      <path class="g-flow" d="M28 14 H106" />
      <path class="g-flow" d="M28 42 H106" />
    </g>
  ),
  jwt: () => (
    <g>
      <rect class="g-node" x={14} y={16} width={34} height={24} rx={3} />
      <rect class="g-tint" x={50} y={16} width={44} height={24} rx={3} />
      <rect class="g-fill" x={96} y={16} width={22} height={24} rx={3} />
      <circle class="g-stroke" cx={138} cy={28} r={11} />
      <Check x={132} y={28} />
    </g>
  ),
  oauth: () => (
    <g>
      <Box x={8} y={14} w={32} h={28} />
      <Box x={120} y={14} w={32} h={28} cls="g-tint" />
      <g class="g-move" style={v({ '--dx': '64px', '--t': '2.6s' })}>
        <circle class="g-stroke" cx={54} cy={28} r={6} />
        <path class="g-stroke" d="M60 28 h14 M70 28 v5 M74 28 v4" />
      </g>
    </g>
  ),
};

function Cells8() {
  return (
    <g class="g-cells">
      {Array.from({ length: 8 }, (_, i) => <rect x={8 + i * 18} y={14} width={16} height={22} rx={3} />)}
    </g>
  );
}
