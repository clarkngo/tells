// Glyphs for the data science, systems debugging and first principles tracks.
// Same 160×56 canvas and motion classes as the other glyph files.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const at = (x: number, y: number) => ({ transformOrigin: `${x}px ${y}px` });
const v = (o: Record<string, string | number>) => o;
const Box = ({ x, y, w = 26, h = 22, cls = 'g-node' }: { x: number; y: number; w?: number; h?: number; cls?: string }) =>
  <rect class={cls} x={x} y={y} width={w} height={h} rx={5} />;

// Scatter points reused by a few data science glyphs.
const pts: [number, number][] = [[22, 44], [34, 40], [46, 38], [56, 31], [70, 30], [82, 24], [96, 22], [108, 17], [122, 14], [136, 9]];

export const moreShapes: Record<string, Shape> = {
  // ---------------- data science ----------------
  'linear-regression': () => (
    <g>
      {pts.map(([x, y], i) => <circle class="g-node" cx={x} cy={y + (i % 2 ? 4 : -3)} r={3.5} />)}
      <path class="g-draw" pathLength={100} d="M14 48 L146 6" />
    </g>
  ),
  'logistic-regression': () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      <path class="g-draw" pathLength={100} d="M12 46 C60 46 64 10 80 10 M80 10 C96 10 100 8 148 8" style={{ animationDuration: '3s' }} />
      {[[24, 48], [44, 48], [58, 48], [102, 8], [118, 8], [136, 8]].map(([x, y], i) =>
        <circle class={i < 3 ? 'g-node' : 'g-fill'} cx={x} cy={y} r={3.5} />)}
    </g>
  ),
  'gradient-boosting': () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g class="g-bs" style={d(i * 0.45)}>
          <path class="g-line" d={`M${30 + i * 50} 12 L${18 + i * 50} 30 M${30 + i * 50} 12 L${42 + i * 50} 30 M${18 + i * 50} 30 L${12 + i * 50} 46 M${18 + i * 50} 30 L${24 + i * 50} 46`} />
          <circle class="g-fill" cx={30 + i * 50} cy={12} r={4} />
          {[[18, 30], [42, 30], [12, 46], [24, 46]].map(([x, y]) => <circle class="g-node" cx={x + i * 50} cy={y} r={3} />)}
        </g>
      ))}
    </g>
  ),
  'k-means': () => (
    <g>
      {[[30, 18], [40, 26], [24, 30], [34, 36], [100, 12], [112, 18], [106, 26], [124, 38], [132, 44], [118, 46]].map(([x, y]) =>
        <circle class="g-node" cx={x} cy={y} r={3.5} />)}
      <circle class="g-fill g-sway" style={v({ '--dx': '-48px', '--dy': '12px', '--t': '2.6s' })} cx={80} cy={16} r={5} />
      <circle class="g-fill g-sway" style={v({ '--dx': '-26px', '--dy': '-26px', '--t': '2.6s' })} cx={134} cy={42} r={5} />
      <circle class="g-fill g-sway" style={v({ '--dx': '45px', '--dy': '32px', '--t': '2.6s' })} cx={80} cy={10} r={5} />
    </g>
  ),
  pca: () => (
    <g>
      {[[40, 42], [52, 36], [64, 34], [72, 28], [86, 26], [96, 20], [108, 18], [120, 12], [58, 40], [100, 24]].map(([x, y]) =>
        <circle class="g-node" cx={x} cy={y} r={3} />)}
      <g class="g-flip" style={{ ...at(80, 28), animationDirection: 'alternate-reverse' }}>
        <path class="g-stroke" d="M30 46 L130 10" />
        <path class="g-line" d="M74 18 L86 38" />
      </g>
    </g>
  ),
  'ab-test': () => (
    <g>
      <circle class="g-fill" cx={18} cy={28} r={6} />
      <path class="g-line" d="M24 28 L50 14 H70 M24 28 L50 42 H70" />
      <rect class="g-node" x={76} y={8} width={70} height={12} rx={3} />
      <rect class="g-node" x={76} y={36} width={70} height={12} rx={3} />
      <rect class="g-tint g-ps" style={{ transformOrigin: 'left', transformBox: 'fill-box' }} x={76} y={8} width={44} height={12} rx={3} />
      <rect class="g-fill g-ps" style={{ transformOrigin: 'left', transformBox: 'fill-box' }} x={76} y={36} width={58} height={12} rx={3} />
    </g>
  ),
  'bayes-theorem': () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      <path class="g-stroke" style={{ opacity: 0.4 }} d="M14 48 C50 48 50 20 80 20 C110 20 110 48 146 48" />
      <path class="g-draw" pathLength={100} d="M50 48 C80 48 86 6 100 6 C114 6 118 48 140 48" />
    </g>
  ),
  'time-series': () => (
    <g>
      <path class="g-stroke" d="M8 34 L20 24 L32 30 L44 18 L56 26 L68 14 L80 22" />
      <path class="g-draw" pathLength={100} style={{ strokeDasharray: '4 4' }} d="M80 22 L92 10 L104 18 L116 6 L128 14 L140 4" />
      <path class="g-tint" d="M80 22 L140 0 V24 L80 30 Z" />
      <path class="g-line" d="M80 4 V52" />
    </g>
  ),
  'anomaly-detection': () => (
    <g>
      <path class="g-line" d="M8 32 Q20 26 32 32 T56 32 T80 32 T104 32 T128 32 T152 32" />
      <circle class="g-fill g-heap" cx={92} cy={10} r={5} />
      <circle class="g-stroke g-ring" cx={92} cy={10} r={14} />
    </g>
  ),
  'collaborative-filtering': () => (
    <g>
      {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4, 5].map((c) => (
        <rect class={(r * 7 + c * 3) % 5 === 0 ? 'g-fill' : 'g-node'} style={{ opacity: (r * 7 + c * 3) % 5 === 0 ? 0.85 : 1 }}
          x={36 + c * 15} y={4 + r * 12.5} width={12} height={10} rx={2} />
      )))}
      <rect class="g-fill g-bs" x={36 + 4 * 15} y={4 + 2 * 12.5} width={12} height={10} rx={2} />
      <rect class="g-stroke g-bs" x={34 + 4 * 15} y={2 + 2 * 12.5} width={16} height={14} rx={3} />
    </g>
  ),
  'survival-analysis': () => (
    <g>
      <path class="g-line" d="M14 6 V50 H150" />
      <path class="g-draw" pathLength={100} d="M14 8 H40 V16 H62 V26 H90 V34 H120 V40 H148" />
      {[50, 104, 134].map((x, i) => <path class="g-stroke" d={`M${x} ${[12, 30, 37][i]} v8`} />)}
    </g>
  ),
  'multi-armed-bandit': () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <>
          <rect class="g-node" x={18 + i * 34} y={8} width={24} height={40} rx={4} />
          <rect class="g-fill g-ps" style={d(i * 0.2)}
            x={22 + i * 34} y={44 - [10, 30, 16, 6][i]} width={16} height={[10, 30, 16, 6][i]} rx={2} />
        </>
      ))}
    </g>
  ),

  // ---------------- systems debugging ----------------
  'recent-change': () => (
    <g>
      <path class="g-line" d="M8 44 H152" />
      <path class="g-stroke" d="M8 40 L60 40 L66 12 L72 40 L80 14 L86 40 L152 40" style={{ opacity: 0.8 }} />
      <path class="g-flow" d="M60 6 V50" />
      <circle class="g-fill g-heap" cx={60} cy={6} r={4} />
    </g>
  ),
  'config-drift': () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <>
          <Box x={12 + i * 28} y={14} w={22} h={28} cls={i === 3 ? 'g-fill g-heap' : 'g-node'} />
          <path class="g-line" d={`M${16 + i * 28} 22 H${30 + i * 28} M${16 + i * 28} 30 H${28 + i * 28}`} />
        </>
      ))}
    </g>
  ),
  'resource-exhaustion': () => (
    <g>
      <rect class="g-stroke" x={40} y={14} width={76} height={28} rx={4} />
      <rect class="g-stroke" x={116} y={22} width={6} height={12} rx={1} />
      <rect class="g-fill g-ps" style={{ transformOrigin: 'left', transformBox: 'fill-box', animationDuration: '3s' }} x={44} y={18} width={68} height={20} rx={2} />
    </g>
  ),
  'resource-leak': () => (
    <g>
      <path class="g-line" d="M8 50 H152" />
      <path class="g-draw" pathLength={100} d="M8 46 L36 38 L40 46 L70 34 L74 46 L110 26 L114 46 L148 14" />
    </g>
  ),
  'race-condition': () => (
    <g>
      <path class="g-line" d="M10 14 H120 M10 42 H120" />
      <circle class="g-fill g-move" style={v({ '--dx': '108px', '--dy': '14px', '--t': '2s' })} cx={14} cy={14} r={4} />
      <circle class="g-fill g-move" style={v({ '--dx': '108px', '--dy': '-14px', '--t': '2.2s', opacity: 0.6 })} cx={14} cy={42} r={4} />
      <Box x={124} y={16} w={26} h={24} />
    </g>
  ),
  'lock-contention': () => (
    <g>
      <rect class="g-stroke" x={110} y={22} width={22} height={18} rx={3} />
      <path class="g-stroke" d="M114 22 V16 Q121 8 128 16 V22" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle class="g-fill g-bs" style={{ ...d(i * 0.25), opacity: 0.5 + i * 0.1 }} cx={96 - i * 16} cy={31} r={5} />
      ))}
    </g>
  ),
  'stale-cache': () => (
    <g>
      <Box x={14} y={16} w={30} h={24} cls="g-fill" />
      <Box x={66} y={16} w={30} h={24} cls="g-node g-faint" />
      <Box x={118} y={16} w={30} h={24} />
      <path class="g-line" d="M44 28 H66 M96 28 H118" />
      <circle class="g-node g-sway" style={v({ '--dx': '-52px', '--t': '1.6s' })} cx={110} cy={28} r={3.5} />
    </g>
  ),
  dns: () => (
    <g>
      <text class="g-fill" x={10} y={33} style={{ font: '600 12px var(--mono)' }}>api.</text>
      <path class="g-flow" d="M44 29 H98" />
      <text x={102} y={33} style={{ font: '12px var(--mono)', fill: 'var(--muted)' }}>?.?.?</text>
      <circle class="g-fill g-move" style={v({ '--dx': '50px' })} cx={46} cy={29} r={3} />
    </g>
  ),
  'clock-skew': () => (
    <g>
      {[50, 110].map((x, i) => (
        <>
          <circle class="g-stroke" cx={x} cy={28} r={20} />
          <path class="g-stroke g-spin" style={v({ ...at(x, 28), '--t': i ? '5s' : '4s' })} d={`M${x} 28 V12`} />
          <circle class="g-fill" cx={x} cy={28} r={2.5} />
        </>
      ))}
    </g>
  ),
  'thundering-herd': () => (
    <g>
      <Box x={124} y={16} w={26} h={24} cls="g-fill g-heap" />
      {[6, 14, 22, 30, 38, 46].map((y) => (
        <circle class="g-fill g-move" style={v({ '--dx': '100px', '--dy': `${28 - y}px`, '--t': '1.6s' })} cx={14} cy={y + 4} r={3} />
      ))}
    </g>
  ),
  'noisy-neighbor': () => (
    <g>
      <rect class="g-line" x={20} y={8} width={120} height={40} rx={6} />
      <rect class="g-fill g-sway" style={v({ '--dx': '30px', '--t': '1.8s' })} x={28} y={16} width={56} height={24} rx={4} />
      <rect class="g-node" x={104} y={16} width={28} height={24} rx={4} />
    </g>
  ),
  'distributed-tracing': () => (
    <g>
      {[[8, 100], [20, 40], [62, 30], [96, 40]].map(([x, w], i) => (
        <rect class={i === 2 ? 'g-fill' : 'g-tint'} x={x + (i === 0 ? 0 : 6)} y={6 + i * 12} width={w + (i === 0 ? 44 : 0)} height={8} rx={2} />
      ))}
      <path class="g-flow" d="M8 2 V54" />
      <path class="g-stroke g-sway" style={v({ '--dx': '140px', '--t': '3s' })} d="M10 2 V54" />
    </g>
  ),

  // ---------------- first principles ----------------
  'littles-law': () => (
    <g>
      <rect class="g-stroke" x={44} y={12} width={72} height={32} rx={6} />
      {[0, 1, 2, 3].map((i) => <circle class="g-fill" style={{ opacity: 0.5 }} cx={56 + i * 16} cy={28} r={4} />)}
      <circle class="g-fill g-move" style={v({ '--dx': '30px', '--t': '1.6s' })} cx={10} cy={28} r={4} />
      <circle class="g-fill g-move" style={v({ '--dx': '30px', '--t': '1.6s', animationDelay: '0.8s' })} cx={120} cy={28} r={4} />
    </g>
  ),
  'amdahls-law': () => (
    <g>
      <rect class="g-fill" x={12} y={22} width={40} height={12} rx={2} />
      {[0, 1, 2, 3].map((i) => (
        <rect class="g-tint g-ps" style={{ ...d(i * 0.1), transformOrigin: 'left', transformBox: 'fill-box' }} x={56} y={6 + i * 12} width={92 - i * 18} height={8} rx={2} />
      ))}
    </g>
  ),
  'cap-theorem': () => (
    <g>
      <path class="g-line" d="M80 8 L40 48 H120 Z" />
      <circle class="g-fill g-bs" cx={80} cy={8} r={6} />
      <circle class="g-fill g-bs" style={d(0.9)} cx={40} cy={48} r={6} />
      <circle class="g-fill g-bs" style={d(1.8)} cx={120} cy={48} r={6} />
      <path class="g-stroke" style={{ strokeDasharray: '3 4' }} d="M60 22 L100 34" />
    </g>
  ),
  'latency-numbers': () => (
    <g>
      {[4, 14, 40, 120].map((w, i) => (
        <rect class="g-fill g-ps" style={{ ...d(i * 0.25), transformOrigin: 'left', transformBox: 'fill-box', opacity: 0.55 + i * 0.15 }}
          x={20} y={6 + i * 12} width={w} height={8} rx={2} />
      ))}
    </g>
  ),
  'tail-latency': () => (
    <g>
      <path class="g-line" d="M8 48 H152" />
      <path class="g-tint" d="M10 48 C24 48 28 8 44 8 C62 8 70 40 100 44 C120 46 140 46 150 47 V48 Z" />
      <path class="g-stroke" d="M10 48 C24 48 28 8 44 8 C62 8 70 40 100 44 C120 46 140 46 150 47" />
      <circle class="g-fill g-heap" cx={138} cy={46} r={4} />
    </g>
  ),
  'utilization-knee': () => (
    <g>
      <path class="g-line" d="M14 6 V50 H150" />
      <path class="g-draw" pathLength={100} d="M14 48 C70 48 104 46 118 38 C130 30 136 14 140 4" />
      <path class="g-line g-dash" d="M120 6 V50" />
    </g>
  ),
  amortization: () => (
    <g>
      <rect class="g-fill" x={10} y={18} width={22} height={20} rx={3} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect class="g-tint g-bs" style={d(i * 0.12)} x={38 + i * 11.5} y={22} width={8} height={12} rx={2} />
      ))}
      <path class="g-flow" d="M10 44 H150" />
    </g>
  ),
  'conways-law': () => (
    <g>
      {[22, 80, 138].map((x) => <circle class="g-fill" cx={x} cy={10} r={5} />)}
      <path class="g-line" d="M27 10 H75 M85 10 H133" />
      <path class="g-flow" d="M22 16 V30 M80 16 V30 M138 16 V30" />
      {[10, 68, 126].map((x) => <Box x={x} y={32} w={24} h={18} />)}
      <path class="g-line" d="M34 41 H68 M92 41 H126" />
    </g>
  ),
  'hyrums-law': () => (
    <g>
      <Box x={60} y={6} w={40} h={18} cls="g-stroke" />
      {[24, 56, 88, 120].map((x, i) => (
        <>
          <path class="g-line" d={`M${x + 8} 44 L80 24`} />
          <circle class="g-fill g-heap" style={d(i * 0.3)} cx={x + 8} cy={46} r={5} />
        </>
      ))}
      <circle class="g-fill" cx={98} cy={9} r={2.5} />
    </g>
  ),
  'goodharts-law': () => (
    <g>
      <circle class="g-line" cx={44} cy={28} r={20} />
      <circle class="g-line" cx={44} cy={28} r={11} />
      <circle class="g-fill" cx={44} cy={28} r={3} />
      <path class="g-line" d="M90 48 H150" />
      <rect class="g-fill g-ps" x={98} y={10} width={12} height={38} rx={2} />
      <rect class="g-tint g-ps" style={{ ...d(0.3), animationDirection: 'reverse' }} x={122} y={20} width={12} height={28} rx={2} />
    </g>
  ),
};
