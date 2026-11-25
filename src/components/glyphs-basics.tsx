// Glyphs for the four basics tracks (data structures, statistics, machine
// learning, developer workflow). Same 160×56 canvas and motion classes.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Bars from the bottom of the canvas; `hi` marks one to highlight.
const Bars = ({ hs, x0 = 30, w = 14, gap = 6, hi = -1, cls = 'g-node' }: { hs: number[]; x0?: number; w?: number; gap?: number; hi?: number; cls?: string }) => (
  <g>
    {hs.map((h, i) => <rect class={i === hi ? 'g-fill g-heap' : cls} x={x0 + i * (w + gap)} y={50 - h} width={w} height={h} rx={2} />)}
  </g>
);

export const basicsShapes: Record<string, Shape> = {
  // ---------- Data structures basics ----------
  'array-index': () => (
    <g>
      {range(6).map((i) => <rect class={i === 3 ? 'g-fill g-bs' : 'g-node'} x={22 + i * 20} y={16} width={18} height={18} rx={2} />)}
      {range(6).map((i) => <text x={31 + i * 20} y={46} font-size="8" text-anchor="middle" class="g-fill g-faint">{i}</text>)}
    </g>
  ),
  'hash-map-lookup': () => (
    <g>
      <rect class="g-node" x={18} y={18} width={40} height={20} rx={4} />
      <text x={38} y={32} font-size="9" text-anchor="middle" class="g-fill">key</text>
      <path class="g-flow" d="M62 28 H96" />
      <rect class="g-fill g-bs" style={d(0.4)} x={100} y={18} width={42} height={20} rx={4} />
    </g>
  ),
  'hash-set-membership': () => (
    <g>
      <circle class="g-node" cx={80} cy={28} r={22} />
      {[[70, 22], [88, 20], [76, 36], [92, 34]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3.5} />)}
      <circle class="g-fill g-move" style={v({ '--dx': '44px', '--t': '2.6s' })} cx={20} cy={28} r={4} />
      <path class="g-draw" pathLength={100} d="M118 28 l6 6 l12 -14" />
    </g>
  ),
  'stack-lifo': () => (
    <g>
      {range(3).map((i) => <rect class="g-node" x={56} y={44 - i * 10} width={48} height={8} rx={2} />)}
      <rect class="g-fill g-move" style={v({ '--dy': '-14px', '--t': '2.2s' })} x={56} y={14} width={48} height={8} rx={2} />
    </g>
  ),
  'queue-fifo': () => (
    <g>
      <path class="g-line" d="M14 40 H146" />
      {range(5).map((i) => (
        <circle class={i === 4 ? 'g-fill g-move' : 'g-tint g-move'} style={v({ '--dx': '22px', '--t': '2.4s' })} cx={30 + i * 22} cy={28} r={7} />
      ))}
      <path class="g-flow" d="M138 28 h14" />
    </g>
  ),
  'linked-list-chain': () => (
    <g>
      {range(4).map((i) => (
        <g>
          <rect class={i === 0 ? 'g-fill' : 'g-node'} x={10 + i * 38} y={18} width={22} height={20} rx={3} />
          {i < 3 && <path class="g-flow" style={d(i * 0.2)} d={`M${34 + i * 38} 28 h12`} />}
        </g>
      ))}
    </g>
  ),
  'tree-hierarchy': () => (
    <g>
      <path class="g-line" d="M80 12 L50 28 M80 12 L110 28 M50 28 L36 46 M50 28 L64 46 M110 28 L96 46 M110 28 L124 46" />
      <circle class="g-fill" cx={80} cy={12} r={6} />
      {[[50, 28], [110, 28]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={5} />)}
      {[36, 64, 96, 124].map((x, i) => <circle class="g-node g-bs" style={d(i * 0.2)} cx={x} cy={46} r={4} />)}
    </g>
  ),
  'heap-priority': () => (
    <g>
      <path class="g-line" d="M80 12 L56 30 M80 12 L104 30 M56 30 L44 46 M56 30 L68 46 M104 30 L92 46" />
      <circle class="g-fill g-heap" cx={80} cy={12} r={7} />
      {[[56, 30], [104, 30], [44, 46], [68, 46], [92, 46]].map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={5} />)}
      <path class="g-flow" d="M90 10 H130" />
    </g>
  ),
  'graph-network': () => (
    <g>
      <path class="g-line" d="M30 16 L70 40 L110 14 L140 38 L70 40 M30 16 L110 14 M30 16 L30 44 L70 40" />
      {[[30, 16], [70, 40], [110, 14], [140, 38], [30, 44]].map(([x, y], i) => <circle class={i === 1 ? 'g-fill g-heap' : 'g-tint'} cx={x} cy={y} r={5} />)}
    </g>
  ),
  'constant-time': () => (
    <g>
      <path class="g-line" d="M14 48 H150 M14 48 V8" />
      <path class="g-draw" pathLength={100} d="M14 36 H150" />
    </g>
  ),
  'log-time': () => (
    <g>
      <path class="g-line" d="M14 48 H150 M14 48 V8" />
      <path class="g-draw" pathLength={100} d="M14 48 C24 30 50 24 150 20" />
    </g>
  ),
  'linear-time': () => (
    <g>
      <path class="g-line" d="M14 48 H150 M14 48 V8" />
      <path class="g-draw" pathLength={100} d="M14 48 L150 12" />
    </g>
  ),
  'quadratic-time': () => (
    <g>
      <path class="g-line" d="M14 48 H150 M14 48 V8" />
      <path class="g-draw" pathLength={100} d="M14 48 C80 48 110 40 140 6" />
    </g>
  ),

  // ---------- Statistics basics ----------
  'mean-average': () => (
    <g>
      <Bars hs={[14, 30, 22, 40, 18, 26]} x0={28} />
      <path class="g-stroke g-dash" d="M20 25 H146" />
    </g>
  ),
  'median-middle': () => (
    <g>
      <Bars hs={[10, 16, 24, 32, 44]} x0={34} w={14} gap={8} hi={2} />
    </g>
  ),
  'mode-most-common': () => (
    <g>
      <Bars hs={[12, 20, 42, 24, 14, 8]} x0={28} hi={2} />
    </g>
  ),
  'standard-deviation': () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      <path class="g-draw" pathLength={100} d="M10 48 C50 48 60 10 80 10 S110 48 150 48" />
      <path class="g-stroke g-sway" style={v({ '--dx': '-8px' })} d="M58 30 H44 m4 -4 l-4 4 l4 4" />
      <path class="g-stroke g-sway" style={v({ '--dx': '8px' })} d="M102 30 H116 m-4 -4 l4 4 l-4 4" />
    </g>
  ),
  'percentile-rank': () => (
    <g>
      <rect class="g-node" x={14} y={22} width={132} height={12} rx={6} />
      <rect class="g-tint" x={14} y={22} width={106} height={12} rx={6} />
      <path class="g-stroke g-bs" d="M120 14 V42" />
      <text x={120} y={52} font-size="8" text-anchor="middle" class="g-fill">80%</text>
    </g>
  ),
  'skewed-data': () => (
    <g>
      <Bars hs={[34, 42, 26, 16, 10, 7, 5, 4, 3]} x0={16} w={12} gap={3} cls="g-tint" />
      <path class="g-draw" pathLength={100} d="M16 14 C30 4 40 12 60 30 S120 46 150 47" />
    </g>
  ),
  'outlier-point': () => (
    <g>
      {[[30, 34], [38, 30], [44, 38], [52, 32], [36, 40], [48, 26], [58, 36]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3} />)}
      <circle class="g-fill g-heap" cx={136} cy={12} r={5} />
      <circle class="g-ring" cx={136} cy={12} r={10} style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }} />
    </g>
  ),
  'correlation-link': () => (
    <g>
      {[[24, 44], [40, 38], [52, 40], [66, 30], [80, 32], [96, 24], [110, 20], [126, 16], [138, 10]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3} />)}
      <path class="g-draw" pathLength={100} d="M18 46 L144 8" />
    </g>
  ),
  confounder: () => (
    <g>
      <circle class="g-fill g-heap" cx={80} cy={12} r={7} />
      <path class="g-flow" d="M74 18 L44 38 M86 18 L116 38" />
      <circle class="g-tint" cx={40} cy={42} r={7} />
      <circle class="g-tint" cx={120} cy={42} r={7} />
      <path class="g-line g-dash" d="M48 42 H112" />
    </g>
  ),
  'sampling-bias': () => (
    <g>
      <circle class="g-node" cx={60} cy={28} r={22} />
      {[[48, 20], [66, 16], [56, 34], [72, 32], [46, 32], [62, 42], [74, 22]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={2.5} />)}
      <circle class="g-stroke" cx={72} cy={24} r={8} style={{ fill: 'none' }} />
      <path class="g-flow" d="M82 24 H112" />
      <circle class="g-fill g-bs" cx={128} cy={24} r={10} />
    </g>
  ),
  'small-sample': () => (
    <g>
      {[[50, 30], [80, 22], [110, 34]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={4} />)}
      <path class="g-stroke g-sway" style={v({ '--dy': '10px', '--dx': '0px', '--t': '1.2s' })} d="M30 24 H130" />
    </g>
  ),
  'base-rate': () => (
    <g>
      {range(40).map((i) => <circle class={i === 27 ? 'g-fill g-heap' : 'g-node'} cx={20 + (i % 10) * 13} cy={12 + Math.floor(i / 10) * 11} r={3.4} />)}
    </g>
  ),

  // ---------- Machine learning basics ----------
  'classification-task': () => (
    <g>
      <circle class="g-fill g-move" style={v({ '--dx': '60px', '--dy': '-12px', '--t': '2.6s' })} cx={24} cy={28} r={5} />
      {[14, 28, 42].map((y, i) => <rect class={i === 0 ? 'g-tint' : 'g-node'} x={110} y={y - 6} width={36} height={12} rx={3} />)}
    </g>
  ),
  'regression-task': () => (
    <g>
      {[[24, 42], [40, 40], [56, 32], [72, 30], [90, 24], [108, 22], [124, 14]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3} />)}
      <path class="g-line" d="M16 46 L146 10" />
      <circle class="g-fill g-bs" cx={140} cy={12} r={5} />
    </g>
  ),
  'clustering-task': () => (
    <g>
      {[[36, 20], [126, 22], [80, 40]].map(([cx, cy], k) => (
        <g>
          <circle class="g-line g-dash" cx={cx} cy={cy} r={15} style={{ fill: 'none' }} />
          {range(4).map((i) => <circle class="g-fill g-bs" style={d(k * 0.3)} cx={cx + [-6, 5, -2, 6][i]} cy={cy + [-4, -5, 6, 4][i]} r={2.8} />)}
        </g>
      ))}
    </g>
  ),
  'labeled-data': () => (
    <g>
      {range(3).map((i) => (
        <g>
          <rect class="g-node" x={18 + i * 44} y={12} width={30} height={30} rx={3} />
          <path class="g-fill g-bs" style={d(i * 0.3)} d={`M${40 + i * 44} 36 h14 l4 5 l-4 5 h-14 z`} />
        </g>
      ))}
    </g>
  ),
  'inference-step': () => (
    <g>
      <circle class="g-tint g-move" style={v({ '--dx': '30px', '--t': '2s' })} cx={16} cy={28} r={5} />
      <rect class="g-node" x={60} y={14} width={40} height={28} rx={5} />
      <path class="g-flow" d="M104 28 H130" />
      <circle class="g-fill g-bs" cx={142} cy={28} r={6} />
    </g>
  ),
  'train-test-split': () => (
    <g>
      <rect class="g-tint" x={14} y={20} width={104} height={16} rx={3} />
      <rect class="g-fill g-move" style={v({ '--dx': '8px', '--t': '2s' })} x={122} y={20} width={24} height={16} rx={3} />
      <path class="g-line g-dash" d="M120 12 V44" />
    </g>
  ),
  'overfit-model': () => (
    <g>
      {[[20, 38], [38, 22], [56, 40], [74, 18], [92, 36], [110, 16], [128, 34], [146, 20]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3} />)}
      <path class="g-draw" pathLength={100} d="M20 38 L38 22 L56 40 L74 18 L92 36 L110 16 L128 34 L146 20" />
    </g>
  ),
  'underfit-model': () => (
    <g>
      {[[20, 44], [40, 30], [60, 18], [80, 12], [100, 16], [120, 28], [140, 44]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={3} />)}
      <path class="g-draw" pathLength={100} d="M14 30 H146" />
    </g>
  ),
  'leaky-data': () => (
    <g>
      <rect class="g-node" x={20} y={18} width={50} height={26} rx={4} />
      <rect class="g-node g-faint" x={100} y={18} width={44} height={26} rx={4} />
      <path class="g-flow" d="M100 30 C86 30 86 30 72 30" />
      <circle class="g-fill g-move" style={v({ '--dx': '-26px', '--t': '1.8s' })} cx={96} cy={30} r={3.5} />
    </g>
  ),
  'imbalanced-classes': () => (
    <g>
      {range(30).map((i) => <circle class={i === 22 ? 'g-fill g-heap' : 'g-tint'} cx={22 + (i % 10) * 13} cy={14 + Math.floor(i / 10) * 13} r={3.5} />)}
    </g>
  ),
  'biased-training-data': () => (
    <g>
      {range(12).map((i) => <circle class={i % 6 === 5 ? 'g-fill' : 'g-tint'} cx={20 + (i % 6) * 12} cy={20 + Math.floor(i / 6) * 14} r={4} />)}
      <g class="g-flip" style={{ transformOrigin: '120px 30px' }}>
        <path class="g-line" d="M96 34 L144 26" />
        <path class="g-stroke" d="M120 30 V46" />
      </g>
    </g>
  ),
  'generative-task': () => (
    <g>
      <path class="g-line g-faint" d="M20 16 H140 M20 28 H130 M20 40 H100" />
      <path class="g-draw" pathLength={100} d="M20 16 H140 M20 28 H130 M20 40 H100" />
      <rect class="g-fill g-bs" x={104} y={34} width={3} height={12} />
    </g>
  ),

  // ---------- Developer workflow basics ----------
  'git-commit': () => (
    <g>
      <path class="g-line" d="M14 28 H146" />
      {[30, 62, 94].map((x) => <circle class="g-tint" cx={x} cy={28} r={6} />)}
      <circle class="g-fill g-heap" cx={126} cy={28} r={7} />
    </g>
  ),
  'git-branch': () => (
    <g>
      <path class="g-line" d="M14 40 H146" />
      <path class="g-draw" pathLength={100} d="M40 40 C60 40 60 16 84 16 H140" />
      {[40, 100].map((x) => <circle class="g-tint" cx={x} cy={40} r={5} />)}
      <circle class="g-fill g-bs" cx={120} cy={16} r={5} />
    </g>
  ),
  'pull-request': () => (
    <g>
      <path class="g-line" d="M14 40 H146" />
      <path class="g-line" d="M30 40 C50 40 50 14 72 14 H100" />
      <path class="g-flow" d="M100 14 C120 14 120 40 136 40" />
      <circle class="g-fill g-heap" cx={136} cy={40} r={6} />
    </g>
  ),
  'code-review': () => (
    <g>
      <rect class="g-node" x={20} y={8} width={70} height={42} rx={4} />
      <path class="g-line" d="M28 18 H80 M28 26 H72 M28 34 H78 M28 42 H66" />
      <path class="g-tint" d="M28 31 H78 V37 H28 Z" />
      <path class="g-fill g-bs" d="M100 14 h40 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h-30 l-8 6 v-6 h-2 a4 4 0 0 1 -4 -4 v-14 a4 4 0 0 1 4 -4 z" />
    </g>
  ),
  'merge-conflict': () => (
    <g>
      <path class="g-line" d="M14 14 C60 14 70 28 80 28 M14 42 C60 42 70 28 80 28" />
      <path class="g-stroke g-heap" d="M88 20 L104 36 M104 20 L88 36" />
      <path class="g-line g-dash" d="M112 28 H150" />
    </g>
  ),
  'git-revert': () => (
    <g>
      <path class="g-line" d="M14 36 H146" />
      {[30, 66, 102].map((x, i) => <circle class={i === 2 ? 'g-node g-faint' : 'g-tint'} cx={x} cy={36} r={5} />)}
      <path class="g-draw" pathLength={100} d="M102 30 C102 10 70 10 66 26" />
      <circle class="g-fill g-bs" cx={134} cy={36} r={6} />
    </g>
  ),
  'unit-test': () => (
    <g>
      <rect class="g-node" x={60} y={10} width={40} height={36} rx={6} />
      <path class="g-draw" pathLength={100} d="M68 28 l8 8 l16 -16" style={{ strokeWidth: 3 }} />
    </g>
  ),
  'continuous-integration': () => (
    <g>
      <g class="g-spin" style={{ transformOrigin: '80px 28px' }}>
        <path class="g-stroke" d="M80 8 A20 20 0 0 1 100 28" />
        <path class="g-stroke" d="M80 48 A20 20 0 0 1 60 28" />
        <path class="g-fill" d="M100 28 l-5 -6 h10 z M60 28 l5 6 h-10 z" />
      </g>
      <path class="g-draw" pathLength={100} d="M72 28 l6 6 l10 -12" />
    </g>
  ),
  'staging-environment': () => (
    <g>
      <rect class="g-tint" x={20} y={14} width={46} height={30} rx={4} />
      <path class="g-flow" d="M70 29 H92" />
      <rect class="g-node" x={96} y={14} width={46} height={30} rx={4} />
      <circle class="g-fill g-bs" cx={43} cy={29} r={5} />
    </g>
  ),
  'feature-toggle': () => (
    <g>
      <rect class="g-node" x={56} y={16} width={48} height={24} rx={12} />
      <circle class="g-fill g-move" style={v({ '--dx': '24px', '--t': '2.4s' })} cx={68} cy={28} r={9} />
    </g>
  ),
  'good-question': () => (
    <g>
      <path class="g-node" d="M40 10 h80 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -6 6 h-56 l-12 8 v-8 h-12 a6 6 0 0 1 -6 -6 v-20 a6 6 0 0 1 6 -6 z" />
      <path class="g-line" d="M48 20 H96 M48 28 H88" />
      <text x={110} y={31} font-size="14" font-weight="700" text-anchor="middle" class="g-fill g-bs">?</text>
    </g>
  ),
  'read-the-error': () => (
    <g>
      <path class="g-line" d="M18 14 H110 M18 24 H96" />
      <path class="g-fill" d="M18 32 H118 V38 H18 Z" />
      <path class="g-line" d="M18 46 H90" />
      <g class="g-sway" style={v({ '--dx': '-20px' })}>
        <circle class="g-stroke" cx={128} cy={30} r={9} style={{ fill: 'none' }} />
        <path class="g-stroke" d="M135 37 L144 46" />
      </g>
    </g>
  ),
};
