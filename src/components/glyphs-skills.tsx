// Glyphs for security, databases, cloud and DevOps, product thinking and
// negotiation. Same 160×56 canvas and motion classes as the other glyph files.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const Tx = ({ x, y, s, fs = 8, cls = 'g-fill' }: { x: number; y: number; s: string; fs?: number; cls?: string }) => (
  <text x={x} y={y} font-size={fs} text-anchor="middle" class={cls}>{s}</text>
);
const Db = ({ x, y = 14 }: { x: number; y?: number }) => (
  <g>
    <path class="g-node" d={`M${x} ${y} v26 a16 5 0 0 0 32 0 v-26`} />
    <ellipse class="g-tint" cx={x + 16} cy={y} rx={16} ry={5} />
  </g>
);
const Box = ({ x, y, w, h, cls = 'g-node' }: { x: number; y: number; w: number; h: number; cls?: string }) => (
  <rect class={cls} x={x} y={y} width={w} height={h} rx={3} />
);
const Person = ({ x, y = 22, cls = 'g-node' }: { x: number; y?: number; cls?: string }) => (
  <g>
    <circle class={cls} cx={x} cy={y} r={4.5} />
    <path class={cls} d={`M${x - 8} ${y + 18} a8 8 0 0 1 16 0 z`} />
  </g>
);
const Lock = ({ x, y, cls = 'g-fill' }: { x: number; y: number; cls?: string }) => (
  <g>
    <path class="g-stroke" d={`M${x + 3} ${y} v-4 a5 5 0 0 1 10 0 v4`} />
    <rect class={cls} x={x} y={y} width={16} height={12} rx={2} />
  </g>
);
const Bubble = ({ x, y, w, h, cls = 'g-node' }: { x: number; y: number; w: number; h: number; cls?: string }) => (
  <path class={cls} d={`M${x + 4} ${y} h${w - 8} q4 0 4 4 v${h - 8} q0 4 -4 4 h${-(w - 16)} l-6 6 v-6 h-2 q-4 0 -4 -4 v${-(h - 8)} q0 -4 4 -4 z`} />
);
const Check = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
  <path class="g-draw" style={d(delay)} pathLength={100} d={`M${x} ${y} l4 4 l8 -9`} />
);

export const skillShapes: Record<string, Shape> = {
  // ---------- Security ----------
  'sql-injection': () => (
    <g>
      <Box x={8} y={18} w={70} h={20} />
      <Tx x={43} y={31} s="' OR 1=1" fs={9} cls="g-fill g-bs" />
      <path class="g-flow" d="M82 28 H108" />
      <Db x={114} />
    </g>
  ),
  'cross-site-scripting': () => (
    <g>
      <Box x={30} y={8} w={100} h={40} />
      <path class="g-line" d="M30 16 H130" />
      <Tx x={80} y={36} s="<script>" fs={11} cls="g-fill g-heap" />
    </g>
  ),
  'csrf-defense': () => (
    <g>
      <Box x={8} y={14} w={40} h={28} cls="g-tint" />
      <path class="g-flow" d="M52 28 H104" />
      <Box x={110} y={14} w={40} h={28} />
      <rect class="g-fill g-bs" x={118} y={23} width={24} height={10} rx={2} />
    </g>
  ),
  'secrets-in-code': () => (
    <g>
      <Tx x={30} y={34} s="{" fs={24} cls="g-fill g-faint" />
      <Tx x={130} y={34} s="}" fs={24} cls="g-fill g-faint" />
      <g class="g-heap">
        <circle class="g-stroke" cx={64} cy={28} r={8} />
        <path class="g-stroke" d="M72 28 H104 M96 28 v6 M102 28 v5" />
      </g>
    </g>
  ),
  'least-privilege': () => (
    <g>
      {range(5).map((i) => <rect class={i === 2 ? 'g-fill g-bs' : 'g-node g-faint'} x={22 + i * 24} y={18} width={18} height={20} rx={3} />)}
    </g>
  ),
  'password-hashing': () => (
    <g>
      <Box x={10} y={18} w={40} h={20} />
      <Tx x={30} y={31} s="pass" fs={9} />
      <path class="g-flow" d="M54 28 H80" />
      <Box x={84} y={18} w={66} h={20} cls="g-tint" />
      <Tx x={117} y={31} s="$2b$12…" fs={9} cls="g-fill g-bs" />
    </g>
  ),
  'broken-access-control': () => (
    <g>
      <Person x={22} />
      <Box x={70} y={10} w={28} h={36} />
      <Box x={116} y={10} w={28} h={36} cls="g-tint" />
      <path class="g-flow" d="M34 30 C70 50 100 50 124 40" />
      <Tx x={130} y={24} s="?" fs={11} cls="g-fill g-bs" />
    </g>
  ),
  'session-hijack': () => (
    <g>
      <Box x={10} y={14} w={34} h={28} />
      <Person x={136} y={18} cls="g-tint" />
      <g class="g-move" style={v({ '--dx': '80px', '--t': '2.4s' })}>
        <circle class="g-fill" cx={50} cy={28} r={8} />
        <circle class="g-node" cx={48} cy={26} r={1.6} />
      </g>
    </g>
  ),
  'brute-force': () => (
    <g>
      <Lock x={120} y={24} />
      {range(5).map((i) => <circle class="g-tint g-move" style={v({ '--dx': '92px', '--t': '1.2s', ...d(i * 0.24) })} cx={18} cy={14 + i * 7} r={3} />)}
    </g>
  ),
  'vulnerable-deps': () => (
    <g>
      <path class="g-line" d="M80 14 L50 30 M80 14 L110 30 M110 30 L96 44 M110 30 L124 44" />
      <rect class="g-node" x={70} y={8} width={20} height={12} rx={2} />
      {[[50, 30], [110, 30], [96, 44]].map(([x, y]) => <rect class="g-node" x={x - 9} y={y - 5} width={18} height={10} rx={2} />)}
      <rect class="g-fill g-heap" x={115} y={39} width={18} height={10} rx={2} />
    </g>
  ),
  'ssrf': () => (
    <g>
      <Person x={18} />
      <path class="g-flow" d="M30 28 H60" />
      <Box x={64} y={14} w={30} h={28} />
      <path class="g-flow" style={d(0.4)} d="M98 28 H118" />
      <rect class="g-stroke g-dash" x={122} y={14} width={30} height={28} rx={3} />
      <rect class="g-fill g-bs" style={d(0.6)} x={130} y={22} width={14} height={12} rx={2} />
    </g>
  ),
  'phishing-mfa': () => (
    <g>
      <path class="g-stroke g-sway" style={v({ '--dy': '6px' })} d="M40 6 V30 a8 8 0 0 1 -16 0 l4 -3" />
      <rect class="g-node" x={98} y={8} width={28} height={42} rx={4} />
      <Tx x={112} y={33} s="482" fs={9} cls="g-fill g-bs" />
    </g>
  ),

  // ---------- Databases and SQL ----------
  'missing-index': () => (
    <g>
      {range(5).map((i) => <path class="g-line" d={`M30 ${10 + i * 9} H130`} />)}
      <rect class="g-tint g-sway" style={v({ '--dy': '36px', '--t': '1.8s' })} x={28} y={6} width={104} height={8} rx={2} />
    </g>
  ),
  'composite-index-order': () => (
    <g>
      <rect class="g-fill" x={40} y={16} width={36} height={24} rx={3} />
      <Tx x={58} y={32} s="a" fs={11} cls="g-node" />
      <rect class="g-tint" x={80} y={16} width={36} height={24} rx={3} />
      <Tx x={98} y={32} s="b" fs={11} />
      <path class="g-draw" pathLength={100} d="M40 48 H116 m-6 -4 l6 4 l-6 4" />
    </g>
  ),
  'covering-index': () => (
    <g>
      <Box x={14} y={10} w={56} h={36} cls="g-node g-faint" />
      <rect class="g-stroke" x={90} y={10} width={56} height={36} rx={3} />
      {range(3).map((i) => <rect class="g-fill g-bs" style={d(i * 0.2)} x={96 + i * 16} y={18} width={12} height={20} rx={2} />)}
    </g>
  ),
  'query-in-a-loop': () => (
    <g>
      <Db x={118} />
      {range(5).map((i) => <path class="g-flow" style={d(i * 0.12)} d={`M18 ${10 + i * 9} H110`} />)}
    </g>
  ),
  'inner-vs-left-join': () => (
    <g>
      <circle class="g-tint" cx={66} cy={28} r={20} />
      <circle class="g-node" cx={94} cy={28} r={20} />
      <circle class="g-fill g-bs" cx={66} cy={28} r={20} style={{ fillOpacity: 0.55 }} />
    </g>
  ),
  'explain-plan': () => (
    <g>
      <path class="g-line" d="M80 12 L50 30 M80 12 L110 30 M50 30 L50 46" />
      <rect class="g-fill" x={66} y={6} width={28} height={12} rx={2} />
      <rect class="g-node" x={36} y={25} width={28} height={10} rx={2} />
      <rect class="g-fill g-heap" x={96} y={25} width={28} height={10} rx={2} />
      <rect class="g-node" x={36} y={42} width={28} height={10} rx={2} />
    </g>
  ),
  'transaction-atomic': () => (
    <g>
      <path class="g-stroke" d="M30 8 h-8 v40 h8 M130 8 h8 v40 h-8" />
      <g class="g-bs">{range(3).map((i) => <rect class="g-fill" x={40 + i * 28} y={18} width={22} height={20} rx={3} />)}</g>
    </g>
  ),
  'isolation-level': () => (
    <g>
      <path class="g-line" d="M10 18 H150 M10 40 H150" />
      <path class="g-stroke" d="M80 8 V50" />
      <circle class="g-fill g-sway" style={v({ '--dx': '50px' })} cx={20} cy={18} r={5} />
      <circle class="g-tint g-sway" style={v({ '--dx': '-50px' })} cx={140} cy={40} r={5} />
    </g>
  ),
  'row-lock-for-update': () => (
    <g>
      {range(4).map((i) => <rect class={i === 1 ? 'g-tint' : 'g-node'} x={20} y={8 + i * 11} width={96} height={8} rx={2} />)}
      <g class="g-heap"><Lock x={124} y={18} /></g>
    </g>
  ),
  'deadlock': () => (
    <g>
      <circle class="g-node" cx={50} cy={28} r={14} />
      <circle class="g-node" cx={110} cy={28} r={14} />
      <path class="g-flow" d="M64 22 C80 12 84 12 96 22" />
      <path class="g-flow" d="M96 34 C84 44 76 44 64 34" />
      <Lock x={42} y={24} cls="g-tint" />
      <Lock x={102} y={24} cls="g-tint" />
    </g>
  ),
  'normalize-schema': () => (
    <g>
      <Box x={14} y={10} w={50} h={36} />
      <Box x={96} y={10} w={50} h={36} />
      <path class="g-line" d="M14 20 H64 M96 20 H146" />
      <path class="g-draw" pathLength={100} d="M64 32 H96" />
      <circle class="g-fill" cx={64} cy={32} r={3} />
      <circle class="g-fill" cx={96} cy={32} r={3} />
    </g>
  ),
  'denormalize-read': () => (
    <g>
      <Box x={10} y={8} w={30} h={18} />
      <Box x={10} y={32} w={30} h={18} />
      <path class="g-flow" d="M44 17 L88 26 M44 41 L88 32" />
      <rect class="g-fill g-bs" style={d(0.4)} x={92} y={14} width={56} height={28} rx={3} />
    </g>
  ),

  // ---------- Cloud and DevOps ----------
  'autoscaling': () => (
    <g>
      {range(3).map((i) => <rect class="g-node" x={30 + i * 22} y={14} width={16} height={34} rx={2} />)}
      {range(2).map((i) => <rect class="g-fill g-ps" style={d(i * 0.3)} x={96 + i * 22} y={14} width={16} height={34} rx={2} />)}
    </g>
  ),
  'blue-green-deploy': () => (
    <g>
      <Box x={92} y={6} w={52} h={18} cls="g-tint" />
      <Box x={92} y={32} w={52} h={18} cls="g-fill" />
      <circle class="g-node" cx={30} cy={28} r={8} />
      <path class="g-stroke g-flip" style={{ transformOrigin: '38px 28px' }} d="M38 28 L86 40" />
    </g>
  ),
  'canary-release': () => (
    <g>
      <Box x={110} y={6} w={40} h={20} cls="g-tint" />
      <Box x={110} y={32} w={40} h={18} cls="g-fill" />
      {range(4).map((i) => <circle class="g-tint g-move" style={v({ '--dx': '86px', '--t': '2s', ...d(i * 0.4) })} cx={16} cy={16} r={3} />)}
      <circle class="g-fill g-move" style={v({ '--dx': '86px', '--dy': '24px', '--t': '2s', ...d(1) })} cx={16} cy={18} r={3} />
    </g>
  ),
  'retry-backoff': () => (
    <g>
      <path class="g-line" d="M10 40 H150" />
      {[14, 24, 44, 84, 144].map((x, i) => <circle class={i === 4 ? 'g-fill g-bs' : 'g-tint g-bs'} style={d(i * 0.3)} cx={x} cy={28} r={4} />)}
    </g>
  ),
  'three-signals': () => (
    <g>
      {range(3).map((i) => <path class="g-line" d={`M10 ${12 + i * 6} H${50 - i * 8}`} />)}
      <path class="g-draw" pathLength={100} d="M62 40 L74 30 L86 36 L98 18" />
      {[[110, 14, 40], [118, 26, 28], [126, 38, 18]].map(([x, y, w], i) => <rect class="g-fill g-bs" style={d(i * 0.2)} x={x} y={y} width={w} height={7} rx={2} />)}
    </g>
  ),
  'infra-as-code': () => (
    <g>
      <Box x={10} y={10} w={50} h={36} />
      {range(3).map((i) => <path class="g-line" d={`M16 ${20 + i * 8} h${36 - i * 8}`} />)}
      <path class="g-flow" d="M64 28 H92" />
      {range(3).map((i) => <rect class="g-fill g-bs" style={d(0.3 + i * 0.2)} x={98 + i * 18} y={14} width={14} height={28} rx={2} />)}
    </g>
  ),
  'health-checks': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M10 30 H52 L60 14 L70 44 L78 30 H150" />
    </g>
  ),
  'immutable-infra': () => (
    <g>
      <rect class="g-node g-faint g-move" style={v({ '--dx': '-50px', '--t': '2.6s' })} x={66} y={14} width={28} height={30} rx={3} />
      <rect class="g-fill g-bs" style={d(0.9)} x={66} y={14} width={28} height={30} rx={3} />
    </g>
  ),
  'quick-rollback': () => (
    <g>
      <path class="g-line" d="M20 40 H140" />
      {[30, 80, 130].map((x, i) => <circle class={i === 2 ? 'g-tint' : 'g-fill'} cx={x} cy={40} r={5} />)}
      <path class="g-draw" pathLength={100} d="M128 32 C110 6 96 6 84 30 m-6 -6 l6 6 l6 -5" />
    </g>
  ),
  'symptom-alerts': () => (
    <g>
      <path class="g-fill" d="M68 38 v-12 a12 12 0 0 1 24 0 v12 l4 4 h-32 z" />
      <circle class="g-fill" cx={80} cy={46} r={3} />
      <circle class="g-stroke g-ring" cx={80} cy={30} r={24} />
    </g>
  ),
  'env-config': () => (
    <g>
      <Box x={14} y={18} w={34} h={20} cls="g-fill" />
      <path class="g-flow" d="M52 28 L96 12 M52 28 H96 M52 28 L96 44" />
      {[12, 28, 44].map((y, i) => <circle class="g-tint g-bs" style={d(i * 0.25)} cx={110} cy={y} r={6} />)}
    </g>
  ),
  'slo-error-budget': () => (
    <g>
      <rect class="g-node" x={20} y={20} width={120} height={16} rx={8} />
      <rect class="g-tint" x={24} y={24} width={112} height={8} rx={4} />
      <circle class="g-fill g-sway" style={v({ '--dx': '-90px', '--t': '3s' })} cx={128} cy={28} r={6} />
      <path class="g-stroke" d="M122 12 V44" />
    </g>
  ),

  // ---------- Product thinking ----------
  'north-star-metric': () => (
    <g>
      <path class="g-fill g-heap" d="M80 10 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z" />
      <path class="g-flow" d="M14 50 L64 30 M146 50 L96 30 M80 54 V44" />
    </g>
  ),
  'vanity-metric': () => (
    <g>
      <rect class="g-stroke g-dash" x={60} y={6} width={22} height={44} rx={2} />
      <rect class="g-fill g-ps" x={96} y={40} width={22} height={10} rx={2} />
    </g>
  ),
  'guardrail-metric': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M14 40 L50 30 L86 24 L146 10" />
      <path class="g-stroke g-dash" d="M14 48 H146" />
      <circle class="g-fill g-heap" cx={110} cy={46} r={4} />
    </g>
  ),
  'mvp-scope': () => (
    <g>
      <rect class="g-stroke g-dash" x={20} y={6} width={120} height={44} rx={4} />
      <rect class="g-fill g-bs" x={34} y={18} width={30} height={20} rx={3} />
    </g>
  ),
  'job-to-be-done': () => (
    <g>
      <path class="g-stroke" d="M24 36 l16 -16 m-4 -4 l8 8" />
      <path class="g-flow" d="M52 28 H96" />
      <circle class="g-node" cx={120} cy={28} r={16} />
      <circle class="g-fill g-heap" cx={120} cy={28} r={6} />
    </g>
  ),
  'talk-to-users': () => (
    <g>
      <Person x={30} y={24} />
      <Person x={130} y={24} cls="g-tint" />
      <Bubble x={46} y={6} w={36} h={18} />
      <Bubble x={84} y={24} w={30} h={16} cls="g-tint g-bs" />
    </g>
  ),
  'run-an-ab-test': () => (
    <g>
      <Tx x={40} y={14} s="A" fs={10} />
      <Tx x={112} y={14} s="B" fs={10} />
      <rect class="g-tint g-ps" x={30} y={30} width={20} height={20} rx={2} />
      <rect class="g-fill g-ps" style={d(0.3)} x={102} y={20} width={20} height={30} rx={2} />
      <path class="g-line" d="M80 8 V50" />
    </g>
  ),
  'fake-door-test': () => (
    <g>
      <rect class="g-node" x={60} y={6} width={36} height={46} rx={2} />
      <circle class="g-fill" cx={89} cy={30} r={2.5} />
      <Tx x={78} y={34} s="?" fs={14} cls="g-fill g-bs" />
      <path class="g-fill g-sway" style={v({ '--dx': '-14px', '--dy': '-6px' })} d="M118 36 l0 14 l4 -4 l3 7 l3 -1.5 l-3 -7 l5 0 z" />
    </g>
  ),
  'user-segment': () => (
    <g>
      {[[24, 18], [36, 30], [26, 40], [44, 16]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={4} />)}
      {[[76, 24], [88, 34], [82, 14]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={4} />)}
      {[[120, 20], [132, 36], [140, 22], [124, 42]].map(([x, y]) => <circle class="g-node" cx={x} cy={y} r={4} />)}
      <path class="g-line g-dash" d="M58 6 V50 M106 6 V50" />
    </g>
  ),
  'retention-first': () => (
    <g>
      <path class="g-node" d="M56 10 h48 l-6 34 h-36 z" />
      <path class="g-tint" d="M60 22 h40 l-4 22 h-32 z" />
      {range(3).map((i) => <circle class="g-fill g-move" style={v({ '--dy': '8px', '--t': '1.6s', ...d(i * 0.5) })} cx={80} cy={44} r={2.5} />)}
    </g>
  ),
  'impact-vs-effort': () => (
    <g>
      <path class="g-line" d="M40 6 V50 H140" />
      <path class="g-line g-dash" d="M90 6 V50 M40 28 H140" />
      <circle class="g-fill g-heap" cx={62} cy={16} r={6} />
      <circle class="g-tint" cx={120} cy={40} r={5} />
    </g>
  ),
  'say-no-to-feature': () => (
    <g>
      <circle class="g-stroke" cx={80} cy={28} r={18} />
      <path class="g-draw" pathLength={100} d="M67 15 L93 41" />
    </g>
  ),

  // ---------- Negotiation and influence ----------
  'anchor-first': () => (
    <g class="g-sway" style={v({ '--dy': '3px', '--t': '1.6s' })}>
      <circle class="g-stroke" cx={80} cy={10} r={4} />
      <path class="g-stroke" d="M80 14 V46 M70 22 H90 M62 36 a18 14 0 0 0 36 0" />
    </g>
  ),
  'batna': () => (
    <g>
      <path class="g-line" d="M14 28 H70 L130 14" />
      <path class="g-stroke g-dash" d="M70 28 L130 44" />
      <path class="g-line" d="M132 44 V30" />
      <path class="g-fill g-heap" d="M132 30 l12 4 l-12 4 z" />
    </g>
  ),
  'reservation-price': () => (
    <g>
      <path class="g-line" d="M10 28 H150" />
      <path class="g-stroke" d="M100 12 V44" />
      <circle class="g-fill g-sway" style={v({ '--dx': '64px', '--t': '2s' })} cx={30} cy={28} r={6} />
    </g>
  ),
  'zopa': () => (
    <g>
      <rect class="g-tint" x={14} y={14} width={86} height={10} rx={3} />
      <rect class="g-node" x={70} y={32} width={76} height={10} rx={3} />
      <rect class="g-fill g-bs" x={70} y={12} width={30} height={32} rx={3} style={{ fillOpacity: 0.5 }} />
    </g>
  ),
  'frame-the-offer': () => (
    <g>
      <rect class="g-stroke" x={44} y={8} width={72} height={40} rx={2} />
      <rect class="g-node" x={52} y={15} width={56} height={26} />
      <Tx x={80} y={33} s="$1/day" fs={11} cls="g-fill g-bs" />
    </g>
  ),
  'find-their-interests': () => (
    <g>
      <Bubble x={24} y={10} w={60} h={26} />
      <Tx x={54} y={27} s="I want X" fs={8} />
      <g class="g-sway" style={v({ '--dx': '-26px' })}>
        <circle class="g-stroke" cx={122} cy={24} r={10} />
        <path class="g-stroke" d="M129 31 l9 9" />
        <Tx x={122} y={27} s="why" fs={7} />
      </g>
    </g>
  ),
  'expand-the-pie': () => (
    <g>
      <g class="g-heap">
        <circle class="g-tint" cx={80} cy={28} r={18} />
        <path class="g-fill" d="M80 28 V10 A18 18 0 0 1 96 36 z" />
      </g>
    </g>
  ),
  'trade-dont-give': () => (
    <g>
      <Person x={20} />
      <Person x={140} />
      <path class="g-flow" d="M34 22 H126" />
      <path class="g-flow" style={d(0.4)} d="M126 36 H34" />
      <rect class="g-fill g-sway" style={v({ '--dx': '64px' })} x={44} y={17} width={10} height={10} rx={2} />
      <circle class="g-tint g-sway" style={v({ '--dx': '-64px' })} cx={116} cy={36} r={5} />
    </g>
  ),
  'use-silence': () => (
    <g>
      <Bubble x={50} y={8} w={60} h={30} />
      {range(3).map((i) => <circle class="g-fill g-bs" style={d(i * 0.4)} cx={68 + i * 12} cy={23} r={3} />)}
    </g>
  ),
  'reciprocity': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M50 20 C70 4 90 4 110 20 m-6 -6 l6 6 l-8 2" />
      <path class="g-draw" style={d(0.6)} pathLength={100} d="M110 36 C90 52 70 52 50 36 m6 6 l-6 -6 l8 -2" />
    </g>
  ),
  'social-proof': () => (
    <g>
      {range(4).map((i) => <Person x={24 + i * 22} cls="g-tint" />)}
      <g class="g-sway" style={v({ '--dx': '-10px' })}><Person x={134} cls="g-fill" /></g>
    </g>
  ),
  'deadline-pressure': () => (
    <g>
      <circle class="g-node" cx={80} cy={28} r={20} />
      <path class="g-stroke g-spin" style={v({ transformOrigin: '80px 28px', '--t': '2s' })} d="M80 28 V13" />
      <circle class="g-fill" cx={80} cy={28} r={3} />
    </g>
  ),
};
