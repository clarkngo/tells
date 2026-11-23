// Glyphs for the patterns added after the first release: DSA, system design,
// AI engineering and AI agents. Same 160×56 canvas and classes as Glyph.tsx.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const at = (x: number, y: number) => ({ transformOrigin: `${x}px ${y}px` });
const v = (o: Record<string, string | number>) => o;

// A small rounded box, used as a "service" or "model" in many scenes.
const Box = ({ x, y, w = 26, h = 22, cls = 'g-node' }: { x: number; y: number; w?: number; h?: number; cls?: string }) =>
  <rect class={cls} x={x} y={y} width={w} height={h} rx={5} />;

export const extraShapes: Record<string, Shape> = {
  // ---------------- DSA ----------------
  'fast-slow': () => (
    <g>
      <circle class="g-line" cx={80} cy={28} r={20} />
      <circle class="g-node g-spin" style={v({ ...at(80, 28), '--t': '4s' })} cx={80} cy={8} r={5} />
      <circle class="g-fill g-spin" style={v({ ...at(80, 28), '--t': '2s' })} cx={80} cy={8} r={5} />
    </g>
  ),
  'monotonic-stack': () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect class="g-fill g-bs" style={d(i * 0.35)} x={56 + i * 6} y={44 - i * 10} width={48 - i * 12} height={8} rx={2} />
      ))}
      <path class="g-line" d="M50 52 H110" />
    </g>
  ),
  intervals: () => (
    <g>
      <rect class="g-tint g-sway" style={v({ '--dy': '14px' })} x={20} y={10} width={60} height={8} rx={3} />
      <rect class="g-fill" x={50} y={24} width={56} height={8} rx={3} />
      <rect class="g-tint g-sway" style={v({ '--dy': '-14px' })} x={92} y={38} width={48} height={8} rx={3} />
    </g>
  ),
  dfs: () => {
    const nodes: [number, number][] = [[80, 8], [50, 28], [36, 48], [64, 48], [110, 28], [96, 48], [124, 48]];
    return (
      <g>
        <path class="g-line" d="M80 8 L50 28 L36 48 M50 28 L64 48 M80 8 L110 28 L96 48 M110 28 L124 48" />
        {nodes.map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={5} />)}
        {nodes.map(([x, y], i) => <circle class="g-fill g-bs" style={d(i * 0.22)} cx={x} cy={y} r={5} />)}
      </g>
    );
  },
  'topo-sort': () => (
    <g>
      <path class="g-line" d="M26 28 H134 M26 28 C50 4 86 4 104 24" />
      {[20, 50, 80, 110, 140].map((x, i) => (
        <>
          <circle class="g-node" cx={x} cy={28} r={6} />
          <circle class="g-fill g-bs" style={d(i * 0.3)} cx={x} cy={28} r={6} />
        </>
      ))}
    </g>
  ),
  'union-find': () => (
    <g>
      <g class="g-sway" style={v({ '--dx': '22px' })}>
        <path class="g-line" d="M30 18 L48 30 L30 42" />
        {[[30, 18], [48, 30], [30, 42]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={5} />)}
      </g>
      <g class="g-sway" style={v({ '--dx': '-22px' })}>
        <path class="g-line" d="M130 18 L112 30 L130 42" />
        {[[130, 18], [112, 30], [130, 42]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={5} style={{ opacity: 0.6 }} />)}
      </g>
    </g>
  ),
  backtracking: () => (
    <g>
      <path class="g-line" d="M80 6 L44 28 L28 50 M44 28 L60 50 M80 6 L116 28 L100 50 M116 28 L132 50" />
      <path class="g-draw" pathLength={100} style={{ opacity: 0.45 }} d="M80 6 L44 28 L28 50" />
      <path class="g-draw" pathLength={100} style={d(1.2)} d="M80 6 L116 28 L132 50" />
      <circle class="g-fill" cx={80} cy={6} r={4} />
    </g>
  ),
  'dp-1d': () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <>
          <rect class="g-node" x={8 + i * 18} y={18} width={16} height={16} rx={3} />
          <rect class="g-fill g-bs" style={d(i * 0.22)} x={8 + i * 18} y={18} width={16} height={16} rx={3} />
        </>
      ))}
      <path class="g-line" d="M16 40 C24 50 34 50 42 40 M34 40 C42 50 52 50 60 40" />
    </g>
  ),
  'dp-2d': () => (
    <g>
      {[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => (
        <>
          <rect class="g-node" x={18 + c * 18} y={4 + r * 17} width={15} height={14} rx={2} />
          <rect class="g-fill g-bs" style={d((r + c) * 0.2)} x={18 + c * 18} y={4 + r * 17} width={15} height={14} rx={2} />
        </>
      )))}
    </g>
  ),
  knapsack: () => (
    <g>
      <path class="g-stroke" d="M56 26 V48 Q56 52 60 52 H100 Q104 52 104 48 V26" />
      {[[62, 0], [78, 0.5], [92, 1]].map(([x, t]) => (
        <rect class="g-fill g-move" style={v({ '--dy': '30px', '--t': '2.6s', animationDelay: `${t}s` })}
          x={x} y={4} width={10} height={10} rx={2} />
      ))}
      <rect class="g-node" x={120} y={30} width={14} height={14} rx={2} />
    </g>
  ),
  trie: () => (
    <g>
      <path class="g-line" d="M16 28 L56 12 L96 6 M56 12 L96 20 M16 28 L56 44 L96 38 M56 44 L96 52 M96 20 L136 20" />
      <path class="g-draw" pathLength={100} d="M16 28 L56 12 L96 20 L136 20" />
      {[[16, 28], [56, 12], [56, 44], [96, 6], [96, 20], [96, 38], [96, 52], [136, 20]].map(([x, y]) =>
        <circle class="g-node" cx={x} cy={y} r={4} />)}
    </g>
  ),
  greedy: () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect class="g-node" x={8 + i * 18} y={38} width={16} height={12} rx={3} />)}
      <path class="g-draw" pathLength={100} d="M16 36 Q40 4 70 36 Q100 4 142 36" />
    </g>
  ),

  // ---------------- system design ----------------
  'load-balancer': () => (
    <g>
      <Box x={14} y={17} cls="g-fill" />
      <path class="g-line" d="M40 28 L120 10 M40 28 L120 28 M40 28 L120 46" />
      {[10, 28, 46].map((y) => <Box x={120} y={y - 7} w={24} h={14} />)}
      {[-18, 0, 18].map((dy, i) => (
        <circle class="g-fill g-move" style={v({ '--dx': '74px', '--dy': `${dy}px`, '--t': '2.4s', animationDelay: `${i * 0.8}s` })}
          cx={44} cy={28} r={3.5} />
      ))}
    </g>
  ),
  'consistent-hashing': () => (
    <g>
      <circle class="g-line" cx={80} cy={28} r={21} />
      {[0, 80, 160, 250].map((a) => {
        const r = (a * Math.PI) / 180;
        return <circle class="g-node" cx={80 + 21 * Math.cos(r)} cy={28 + 21 * Math.sin(r)} r={5} />;
      })}
      <circle class="g-fill g-spin" style={v({ ...at(80, 28), '--t': '5s' })} cx={80} cy={7} r={3.5} />
    </g>
  ),
  'fan-out': () => (
    <g>
      <circle class="g-fill" cx={22} cy={28} r={8} />
      {[6, 17, 28, 39, 50].map((y) => <path class="g-line" d={`M30 28 L132 ${y}`} />)}
      {[6, 17, 28, 39, 50].map((y) => <circle class="g-node" cx={138} cy={y} r={4.5} />)}
      {[6, 17, 28, 39, 50].map((y) => (
        <circle class="g-fill g-move" style={v({ '--dx': '100px', '--dy': `${y - 28}px` })} cx={32} cy={28} r={3} />
      ))}
    </g>
  ),
  'search-index': () => (
    <g>
      {[10, 22, 34, 46].map((y, i) => <path class="g-line" d={`M14 ${y} H${120 - i * 14}`} />)}
      <g class="g-sway" style={v({ '--dx': '80px', '--dy': '12px', '--t': '3s' })}>
        <circle class="g-stroke" cx={30} cy={20} r={9} />
        <path class="g-stroke" d="M37 27 L45 35" />
      </g>
    </g>
  ),
  'blob-storage': () => (
    <g>
      <path class="g-stroke" d="M56 22 V46 Q80 56 104 46 V22" />
      <ellipse class="g-stroke" cx={80} cy={22} rx={24} ry={6} />
      {[[66, 0], [86, 0.8]].map(([x, t]) => (
        <rect class="g-fill g-move" style={v({ '--dy': '22px', '--t': '2.4s', animationDelay: `${t}s` })}
          x={x} y={-2} width={10} height={12} rx={2} />
      ))}
    </g>
  ),
  idempotency: () => (
    <g>
      {[0, 0.7, 1.4].map((t) => (
        <circle class="g-fill g-move" style={v({ '--dx': '80px', '--t': '2.1s', animationDelay: `${t}s` })} cx={18} cy={28} r={4} />
      ))}
      <Box x={100} y={16} w={30} h={24} />
      <path class="g-stroke" d="M107 28 L113 34 L124 22" />
    </g>
  ),
  'circuit-breaker': () => (
    <g>
      <path class="g-flow" d="M8 34 H64" />
      <circle class="g-fill" cx={66} cy={34} r={4} />
      <path class="g-stroke g-flip" style={at(66, 34)} d="M66 34 L96 34" />
      <circle class="g-node" cx={98} cy={34} r={4} />
      <path class="g-line" d="M102 34 H152" />
    </g>
  ),
  consensus: () => {
    const pts: [number, number][] = [[80, 6], [102, 20], [94, 48], [66, 48], [58, 20]];
    return (
      <g>
        {pts.slice(1).map(([x, y]) => <path class="g-flow" d={`M80 6 L${x} ${y}`} />)}
        {pts.slice(1).map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={5} />)}
        <circle class="g-fill g-heap" cx={80} cy={6} r={5} />
      </g>
    );
  },
  websockets: () => (
    <g>
      <Box x={10} y={17} />
      <Box x={124} y={17} />
      <path class="g-line" d="M38 24 H122 M38 32 H122" />
      <circle class="g-fill g-move" style={v({ '--dx': '76px' })} cx={42} cy={24} r={3} />
      <circle class="g-fill g-move" style={v({ '--dx': '-76px', animationDelay: '1.2s' })} cx={118} cy={32} r={3} />
    </g>
  ),
  'bloom-filter': () => (
    <g>
      {Array.from({ length: 12 }, (_, i) => <rect class="g-node" x={8 + i * 12.2} y={22} width={10} height={12} rx={2} />)}
      {[[1, 0], [5, 0], [9, 0], [3, 1.3], [7, 1.3], [10, 1.3]].map(([i, t]) => (
        <rect class="g-fill g-bs" style={d(t)} x={8 + i * 12.2} y={22} width={10} height={12} rx={2} />
      ))}
    </g>
  ),
  'geo-index': () => (
    <g>
      <rect class="g-line" x={40} y={4} width={80} height={48} rx={3} />
      <path class="g-line" d="M80 4 V52 M40 28 H120 M100 4 V28 M80 16 H120" />
      <circle class="g-stroke g-ring" cx={104} cy={11} r={14} />
      <circle class="g-fill" cx={104} cy={11} r={3.5} />
    </g>
  ),
  cqrs: () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect class="g-fill g-bs" style={d(i * 0.3)} x={12 + i * 16} y={8} width={12} height={12} rx={2} />)}
      <path class="g-flow" d="M50 22 V30 M50 30 H120 V36" />
      <Box x={108} y={36} w={26} h={16} />
      <Box x={24} y={36} w={26} h={16} cls="g-node g-faint" />
    </g>
  ),

  // ---------------- AI engineering ----------------
  rag: () => (
    <g>
      {[0, 1, 2].map((i) => <rect class="g-node" x={10 + i * 6} y={8 + i * 6} width={26} height={32} rx={3} />)}
      <path class="g-line" d="M28 30 H42 M28 36 H40" />
      <rect class="g-fill g-move" style={v({ '--dx': '72px', '--t': '2.6s' })} x={30} y={24} width={14} height={4} rx={1} />
      <rect class="g-fill g-move" style={v({ '--dx': '72px', '--t': '2.6s', animationDelay: '0.4s' })} x={30} y={32} width={10} height={4} rx={1} />
      <Box x={110} y={14} w={36} h={28} cls="g-stroke" />
    </g>
  ),
  'fine-tuning': () => (
    <g>
      {[12, 28, 44].map((y, i) => (
        <>
          <path class="g-line" d={`M30 ${y} H130`} />
          <circle class="g-fill g-sway" style={v({ '--dx': `${[60, -40, 30][i]}px`, '--t': `${2 + i * 0.4}s` })}
            cx={[40, 110, 70][i]} cy={y} r={5} />
        </>
      ))}
    </g>
  ),
  prompting: () => (
    <g>
      <path class="g-stroke" d="M30 8 H130 Q136 8 136 14 V38 Q136 44 130 44 H60 L46 52 L48 44 H30 Q24 44 24 38 V14 Q24 8 30 8 Z" />
      <path class="g-draw" pathLength={100} d="M36 20 H120" />
      <path class="g-draw" pathLength={100} style={d(0.5)} d="M36 32 H96" />
    </g>
  ),
  'structured-output': () => (
    <g>
      <path class="g-stroke" d="M48 6 Q40 6 40 14 V22 Q40 28 34 28 Q40 28 40 34 V42 Q40 50 48 50" />
      <path class="g-stroke" d="M112 6 Q120 6 120 14 V22 Q120 28 126 28 Q120 28 120 34 V42 Q120 50 112 50" />
      {[14, 28, 42].map((y, i) => (
        <>
          <rect class="g-node" x={52} y={y - 4} width={22} height={8} rx={2} />
          <rect class="g-fill g-bs" style={d(i * 0.35)} x={80} y={y - 4} width={28} height={8} rx={2} />
        </>
      ))}
    </g>
  ),
  evals: () => (
    <g>
      {[10, 28, 46].map((y, i) => (
        <>
          <path class="g-line" d={`M60 ${y} H132`} />
          <path class="g-draw" pathLength={100} style={d(i * 0.4)} d={`M30 ${y} L36 ${y + 6} L48 ${y - 6}`} />
        </>
      ))}
    </g>
  ),
  'semantic-cache': () => (
    <g>
      <circle class="g-tint" cx={110} cy={28} r={20} />
      <circle class="g-fill g-heap" cx={110} cy={28} r={6} />
      <circle class="g-fill g-move" style={v({ '--dx': '80px', '--dy': '14px' })} cx={22} cy={14} r={4} />
      <circle class="g-fill g-move" style={v({ '--dx': '80px', '--dy': '-14px', animationDelay: '1s' })} cx={22} cy={42} r={4} />
    </g>
  ),
  'model-routing': () => (
    <g>
      <circle class="g-fill" cx={18} cy={28} r={6} />
      <path class="g-line" d="M24 28 H56 L104 14 M56 28 L104 44" />
      <Box x={106} y={6} w={18} h={16} />
      <Box x={106} y={32} w={36} h={22} />
      {[0, 0.8].map((t) => (
        <circle class="g-fill g-move" style={v({ '--dx': '80px', '--dy': '-14px', animationDelay: `${t}s` })} cx={26} cy={28} r={3} />
      ))}
      <circle class="g-fill g-move" style={v({ '--dx': '80px', '--dy': '14px', animationDelay: '1.6s' })} cx={26} cy={28} r={3} />
    </g>
  ),
  guardrails: () => (
    <g>
      <path class="g-stroke" d="M100 6 L118 12 V28 Q118 44 100 52 Q82 44 82 28 V12 Z" />
      <circle class="g-fill g-sway" style={v({ '--dx': '52px', '--t': '1.4s' })} cx={20} cy={20} r={4} />
      <circle class="g-fill g-sway" style={v({ '--dx': '52px', '--t': '1.4s', animationDelay: '0.7s', opacity: 0.6 })} cx={20} cy={38} r={4} />
    </g>
  ),
  'batch-inference': () => (
    <g>
      {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => (
        <rect class="g-fill g-move" style={v({ '--dx': '72px', '--t': '2.8s', animationDelay: `${c * 0.12}s` })}
          x={14 + c * 11} y={12 + r * 11} width={8} height={8} rx={1.5} />
      )))}
      <Box x={110} y={8} w={40} h={40} cls="g-stroke" />
    </g>
  ),
  streaming: () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect class="g-fill g-bs" style={d(i * 0.14)} x={14 + i * 17} y={22} width={[12, 8, 14, 10, 6, 12, 9, 13][i]} height={10} rx={2} />
      ))}
    </g>
  ),

  // ---------------- AI agents ----------------
  'tool-use': () => (
    <g>
      <circle class="g-fill" cx={30} cy={28} r={10} />
      <path class="g-line" d="M42 28 H112" />
      <path class="g-stroke" d="M122 18 a8 8 0 1 0 8 12 L144 44 M130 30 L136 24" />
      <circle class="g-fill g-sway" style={v({ '--dx': '64px', '--t': '1.6s' })} cx={46} cy={28} r={3.5} />
    </g>
  ),
  'agent-loop': () => (
    <g>
      <circle class="g-flow" cx={80} cy={28} r={20} />
      <circle class="g-fill g-spin" style={v({ ...at(80, 28), '--t': '3s' })} cx={80} cy={8} r={5} />
      <circle class="g-node" cx={80} cy={28} r={5} />
    </g>
  ),
  'prompt-chaining': () => (
    <g>
      <path class="g-line" d="M36 28 H50 M76 28 H90 M116 28 H130" />
      {[10, 50, 90, 130].map((x, i) => (
        <>
          <Box x={x} y={18} w={26} h={20} />
          <rect class="g-fill g-bs" style={d(i * 0.4)} x={x} y={18} width={26} height={20} rx={5} />
        </>
      ))}
    </g>
  ),
  routing: () => (
    <g>
      <circle class="g-fill" cx={20} cy={28} r={7} />
      <path class="g-line" d="M27 28 H60 M60 28 L120 8 M60 28 L120 28 M60 28 L120 48" />
      {[8, 28, 48].map((y, i) => (
        <>
          <path class="g-stroke g-bs" style={d(i * 0.85)} d={`M27 28 H60 L120 ${y}`} />
          <circle class="g-node" cx={128} cy={y} r={6} />
        </>
      ))}
    </g>
  ),
  parallelization: () => (
    <g>
      <path class="g-line" d="M20 28 L40 10 H120 L140 28 M20 28 L40 28 H120 L140 28 M20 28 L40 46 H120 L140 28" />
      <circle class="g-fill" cx={18} cy={28} r={5} />
      <circle class="g-fill" cx={142} cy={28} r={5} />
      {[10, 28, 46].map((y) => (
        <circle class="g-fill g-move" style={v({ '--dx': '76px' })} cx={42} cy={y} r={3.5} />
      ))}
    </g>
  ),
  'orchestrator-workers': () => (
    <g>
      <circle class="g-fill" cx={80} cy={10} r={7} />
      {[36, 80, 124].map((x) => <path class="g-flow" d={`M80 16 L${x} 40`} />)}
      {[36, 80, 124].map((x, i) => <circle class="g-node g-heap" style={d(i * 0.4)} cx={x} cy={44} r={6} />)}
    </g>
  ),
  'evaluator-optimizer': () => (
    <g>
      <Box x={20} y={17} w={30} h={22} cls="g-fill" />
      <Box x={110} y={17} w={30} h={22} />
      <path class="g-flow" d="M50 22 Q80 4 110 22" />
      <path class="g-flow" d="M110 34 Q80 52 50 34" />
      <path class="g-stroke" d="M118 28 L123 33 L132 23" />
    </g>
  ),
  'agent-memory': () => (
    <g>
      <circle class="g-fill" cx={28} cy={28} r={9} />
      <ellipse class="g-stroke" cx={112} cy={12} rx={22} ry={5} />
      <path class="g-stroke" d="M90 12 V44 Q112 54 134 44 V12" />
      {[22, 32, 42].map((y, i) => <path class="g-stroke g-bs" style={d(i * 0.4)} d={`M98 ${y} H126`} />)}
      <circle class="g-fill g-sway" style={v({ '--dx': '52px', '--t': '1.8s' })} cx={40} cy={28} r={3} />
    </g>
  ),
  'human-in-the-loop': () => (
    <g>
      <path class="g-line" d="M14 40 H146" />
      <circle class="g-node" cx={22} cy={40} r={5} />
      <circle class="g-node" cx={138} cy={40} r={5} />
      <circle class="g-fill" cx={80} cy={10} r={5} />
      <path class="g-fill" d="M70 28 Q70 18 80 18 Q90 18 90 28 Z" />
      <path class="g-draw" pathLength={100} d="M72 40 L78 46 L90 34" />
      <circle class="g-fill g-move" style={v({ '--dx': '108px', '--t': '3s' })} cx={24} cy={40} r={3} />
    </g>
  ),
  sandboxing: () => (
    <g>
      <rect class="g-stroke g-dash" x={44} y={6} width={72} height={44} rx={6} />
      <circle class="g-fill g-sway" style={v({ '--dx': '48px', '--dy': '-20px', '--t': '1.3s' })} cx={58} cy={38} r={5} />
    </g>
  ),
};
