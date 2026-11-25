// Glyphs for the second set of basics tracks (LLMs, the web, web pages,
// debugging, clear thinking, requirements, time series, listening, game
// design). Same 160×56 canvas and motion classes as glyphs-basics.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const Tx = ({ x, y, s, fs = 8, cls = 'g-fill' }: { x: number; y: number; s: string; fs?: number; cls?: string }) => (
  <text x={x} y={y} font-size={fs} text-anchor="middle" class={cls}>{s}</text>
);
const Person = ({ x, y = 24, cls = 'g-node' }: { x: number; y?: number; cls?: string }) => (
  <g>
    <circle class={cls} cx={x} cy={y} r={5} />
    <path class={cls} d={`M${x - 9} ${y + 20} a9 9 0 0 1 18 0 z`} />
  </g>
);
const Bubble = ({ x, y, w, h, cls = 'g-node' }: { x: number; y: number; w: number; h: number; cls?: string }) => (
  <path class={cls} d={`M${x + 4} ${y} h${w - 8} q4 0 4 4 v${h - 8} q0 4 -4 4 h${-(w - 16)} l-6 6 v-6 h-2 q-4 0 -4 -4 v${-(h - 8)} q0 -4 4 -4 z`} />
);
const Check = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
  <path class="g-draw" style={d(delay)} pathLength={100} d={`M${x} ${y} l4 4 l8 -9`} />
);
const Server = ({ x }: { x: number }) => (
  <g>{range(3).map((i) => <rect class="g-node" x={x} y={12 + i * 11} width={28} height={9} rx={2} />)}</g>
);
const Lines = ({ x, y, n = 3, w = 30, gap = 6 }: { x: number; y: number; n?: number; w?: number; gap?: number }) => (
  <g>{range(n).map((i) => <path class="g-line" d={`M${x} ${y + i * gap} h${i === n - 1 ? w * 0.6 : w}`} />)}</g>
);
const Doc = ({ x, y, cls = 'g-node' }: { x: number; y: number; cls?: string }) => (
  <g>
    <rect class={cls} x={x} y={y} width={26} height={34} rx={3} />
    <Lines x={x + 5} y={y + 9} n={3} w={16} gap={7} />
  </g>
);

export const basics2Shapes: Record<string, Shape> = {
  // ---------- How LLMs work ----------
  'token-pieces': () => (
    <g>
      {[['un', 30, 18], ['believ', 62, 34], ['able', 108, 26]].map(([s, x, w], i) => (
        <g class="g-bs" style={d(i * 0.3)}>
          <rect class="g-tint" x={+x - +w / 2} y={18} width={+w} height={20} rx={4} />
          <Tx x={+x} y={32} s={s as string} fs={10} />
        </g>
      ))}
    </g>
  ),
  'context-window-limit': () => (
    <g>
      {range(8).map((i) => <rect class={i < 3 ? 'g-node g-faint' : 'g-node'} x={8 + i * 18} y={20} width={14} height={16} rx={2} />)}
      <rect class="g-stroke" x={58} y={14} width={96} height={28} rx={5} />
      <path class="g-flow" d="M50 28 H6" />
    </g>
  ),
  'temperature-dial': () => (
    <g>
      <Bars hs={[30, 14, 8, 4]} x0={20} />
      <path class="g-line" d="M100 40 H150" />
      <circle class="g-fill g-sway" style={v({ '--dx': '44px', '--t': '2.2s' })} cx={103} cy={40} r={5} />
      <Tx x={103} y={24} s="cold" fs={7} cls="g-fill g-faint" />
      <Tx x={147} y={24} s="hot" fs={7} cls="g-fill g-faint" />
    </g>
  ),
  'meaning-vectors': () => (
    <g>
      <path class="g-line" d="M30 50 V8 M30 50 H150" />
      <path class="g-draw" pathLength={100} d="M30 50 L110 16" />
      <path class="g-draw" style={d(0.3)} pathLength={100} d="M30 50 L120 22" />
      <circle class="g-fill" cx={110} cy={16} r={4} />
      <circle class="g-fill" cx={120} cy={22} r={4} />
      <circle class="g-tint" cx={62} cy={44} r={4} />
    </g>
  ),
  'made-up-facts': () => (
    <g>
      <Bubble x={30} y={8} w={100} h={32} />
      <Lines x={42} y={18} n={2} w={56} gap={10} />
      <Tx x={114} y={30} s="?" fs={18} cls="g-fill g-bs" />
    </g>
  ),
  'knowledge-cutoff': () => (
    <g>
      <path class="g-line" d="M10 34 H150" />
      {range(5).map((i) => <circle class="g-fill" cx={18 + i * 18} cy={34} r={4} />)}
      {range(3).map((i) => <circle class="g-node g-faint" cx={114 + i * 16} cy={34} r={4} />)}
      <path class="g-stroke g-dash" d="M104 10 V48" />
      <Tx x={130} y={18} s="?" fs={12} cls="g-fill g-bs" />
    </g>
  ),
  'predict-next-word': () => (
    <g>
      {range(3).map((i) => <rect class="g-node" x={8 + i * 30} y={18} width={26} height={20} rx={3} />)}
      <path class="g-flow" d="M100 28 H118" />
      <rect class="g-fill g-bs" x={122} y={18} width={30} height={20} rx={3} />
    </g>
  ),
  'prompt-wording': () => (
    <g>
      <rect class="g-node" x={14} y={12} width={70} height={32} rx={4} />
      <Lines x={22} y={22} n={2} w={50} gap={10} />
      <path class="g-draw" pathLength={100} d="M22 38 h46" />
      <path class="g-flow" d="M90 28 H112" />
      <rect class="g-fill g-bs" style={d(0.5)} x={118} y={16} width={32} height={24} rx={4} />
    </g>
  ),
  'stateless-model': () => (
    <g>
      <rect class="g-node" x={108} y={14} width={40} height={28} rx={6} />
      {range(3).map((i) => <rect class="g-tint g-move" style={v({ '--dx': '84px', '--t': '2.6s', ...d(i * 0.15) })} x={12} y={14 + i * 10} width={22} height={7} rx={2} />)}
    </g>
  ),
  'ground-in-sources': () => (
    <g>
      <Doc x={16} y={11} />
      <path class="g-flow" d="M48 28 H76" />
      <Bubble x={82} y={10} w={60} h={30} />
      <Check x={104} y={24} delay={0.4} />
    </g>
  ),
  'bigger-vs-faster': () => (
    <g>
      <path class="g-line" d="M10 18 H150 M10 44 H150" />
      <circle class="g-fill g-move" style={v({ '--dx': '100px', '--t': '3.6s' })} cx={24} cy={18} r={9} />
      <circle class="g-tint g-move" style={v({ '--dx': '110px', '--t': '1.6s' })} cx={20} cy={44} r={5} />
    </g>
  ),
  'calls-a-tool': () => (
    <g>
      <rect class="g-node" x={12} y={14} width={40} height={28} rx={6} />
      <path class="g-flow" d="M56 22 H100" />
      <path class="g-flow" d="M100 34 H56" />
      <circle class="g-stroke" cx={124} cy={28} r={11} />
      <circle class="g-fill g-heap" cx={124} cy={28} r={4} />
    </g>
  ),

  // ---------- How the web works ----------
  'client-and-server': () => (
    <g>
      <rect class="g-node" x={12} y={14} width={36} height={24} rx={3} />
      <path class="g-line" d="M8 42 H52" />
      <path class="g-flow" d="M56 22 H112" />
      <path class="g-flow" style={d(0.4)} d="M112 34 H56" />
      <Server x={120} />
    </g>
  ),
  'dns-lookup': () => (
    <g>
      <rect class="g-node" x={8} y={18} width={58} height={20} rx={4} />
      <Tx x={37} y={31} s="name.com" fs={8} />
      <path class="g-flow" d="M70 28 H90" />
      <rect class="g-fill g-bs" style={d(0.3)} x={94} y={18} width={58} height={20} rx={4} />
      <Tx x={123} y={31} s="1.2.3.4" fs={8} cls="g-node g-bs" />
    </g>
  ),
  'http-request': () => (
    <g>
      <path class="g-line" d="M10 46 H150" />
      <g class="g-move" style={v({ '--dx': '96px', '--t': '2.6s' })}>
        <rect class="g-node" x={12} y={14} width={34} height={24} rx={2} />
        <path class="g-line" d="M12 14 L29 28 L46 14" />
      </g>
      <Tx x={140} y={30} s="GET" fs={9} />
    </g>
  ),
  'status-code': () => (
    <g>
      {['200', '404', '500'].map((s, i) => (
        <g>
          <rect class={i === 1 ? 'g-fill g-heap' : 'g-node'} x={14 + i * 46} y={16} width={40} height={24} rx={5} />
          <Tx x={34 + i * 46} y={32} s={s} fs={10} cls={i === 1 ? 'g-node' : 'g-fill'} />
        </g>
      ))}
    </g>
  ),
  'https-encryption': () => (
    <g>
      <path class="g-stroke" d="M70 26 v-6 a10 10 0 0 1 20 0 v6" />
      <rect class="g-fill" x={64} y={26} width={32} height={22} rx={4} />
      <circle class="g-tint g-ring" cx={80} cy={30} r={24} />
    </g>
  ),
  'keep-a-copy': () => (
    <g>
      <Doc x={40} y={11} />
      <g class="g-bs" style={d(0.3)}><Doc x={94} y={11} cls="g-tint" /></g>
      <path class="g-flow" d="M70 28 H90" />
    </g>
  ),
  'stores-data': () => (
    <g>
      <path class="g-node" d="M60 14 v28 a20 6 0 0 0 40 0 v-28" />
      <ellipse class="g-tint" cx={80} cy={14} rx={20} ry={6} />
      <path class="g-line" d="M60 24 a20 6 0 0 0 40 0 M60 33 a20 6 0 0 0 40 0" />
      <rect class="g-fill g-move" style={v({ '--dx': '24px', '--t': '2.4s' })} x={22} y={24} width={12} height={8} rx={2} />
    </g>
  ),
  'web-api': () => (
    <g>
      <rect class="g-node" x={10} y={16} width={36} height={24} rx={4} />
      <path class="g-flow" d="M50 28 H96" />
      <rect class="g-tint" x={100} y={12} width={50} height={32} rx={4} />
      <Tx x={125} y={33} s="{ }" fs={14} cls="g-fill g-bs" />
    </g>
  ),
  'cookie-session': () => (
    <g>
      <rect class="g-node" x={8} y={14} width={34} height={26} rx={3} />
      <Server x={124} />
      <g class="g-sway" style={v({ '--dx': '64px', '--t': '2s' })}>
        <circle class="g-fill" cx={60} cy={28} r={9} />
        <circle class="g-node" cx={57} cy={25} r={1.8} />
        <circle class="g-node" cx={63} cy={31} r={1.8} />
      </g>
    </g>
  ),
  'round-trip-delay': () => (
    <g>
      <circle class="g-node" cx={16} cy={28} r={8} />
      <circle class="g-node" cx={144} cy={28} r={8} />
      <path class="g-line g-dash" d="M26 28 H134" />
      <circle class="g-fill g-sway" style={v({ '--dx': '100px', '--t': '2.4s' })} cx={30} cy={28} r={5} />
    </g>
  ),
  'static-or-dynamic': () => (
    <g>
      {range(3).map((i) => <rect class="g-tint" x={8 + i * 22} y={16} width={18} height={26} rx={2} />)}
      <path class="g-line" d="M80 10 V48" />
      {[10, 20, 6].map((h, i) => (
        <g>
          <rect class="g-node" x={90 + i * 22} y={16} width={18} height={26} rx={2} />
          <rect class="g-fill g-ps" style={d(i * 0.3)} x={93 + i * 22} y={39 - h} width={12} height={h} />
        </g>
      ))}
    </g>
  ),
  'too-much-traffic': () => (
    <g>
      {range(6).map((i) => <circle class="g-tint g-move" style={v({ '--dx': '84px', '--t': '1.6s', ...d(i * 0.2) })} cx={14} cy={12 + i * 6.5} r={3} />)}
      <Server x={116} />
      <circle class="g-fill g-heap" cx={130} cy={50} r={3} />
    </g>
  ),

  // ---------- HTML, CSS and JavaScript ----------
  'html-tags': () => (
    <g>
      <Tx x={44} y={22} s="<h1>" fs={10} />
      <Tx x={44} y={40} s="<p>" fs={10} cls="g-fill g-faint" />
      <rect class="g-fill g-bs" x={74} y={13} width={66} height={12} rx={2} />
      <Lines x={74} y={34} n={2} w={66} gap={6} />
    </g>
  ),
  'dom-tree': () => (
    <g>
      <path class="g-line" d="M80 14 L48 30 M80 14 L112 30 M48 30 L34 46 M48 30 L62 46 M112 30 L112 46" />
      <rect class="g-fill" x={70} y={8} width={20} height={12} rx={2} />
      {[[48, 30], [112, 30]].map(([x, y]) => <rect class="g-tint" x={x - 9} y={y - 5} width={18} height={10} rx={2} />)}
      {[34, 62, 112].map((x, i) => <rect class="g-node g-bs" style={d(i * 0.2)} x={x - 7} y={42} width={14} height={9} rx={2} />)}
    </g>
  ),
  'css-cascade': () => (
    <g>
      {range(3).map((i) => <rect class={i === 2 ? 'g-fill g-bs' : 'g-node'} style={i === 2 ? d(0.4) : undefined} x={30 + i * 18} y={10 + i * 8} width={70} height={22} rx={4} />)}
    </g>
  ),
  'box-model': () => (
    <g>
      <rect class="g-stroke g-dash" x={38} y={4} width={84} height={48} rx={3} />
      <rect class="g-node" x={48} y={11} width={64} height={34} rx={2} />
      <rect class="g-tint" x={54} y={16} width={52} height={24} rx={2} />
      <rect class="g-fill g-heap" x={66} y={22} width={28} height={12} rx={2} />
    </g>
  ),
  'flex-layout': () => (
    <g>
      <rect class="g-stroke" x={14} y={10} width={132} height={36} rx={4} />
      <rect class="g-fill" x={22} y={18} width={30} height={20} rx={3} />
      <rect class="g-tint g-sway" style={v({ '--dx': '22px' })} x={56} y={18} width={30} height={20} rx={3} />
      <rect class="g-tint g-sway" style={v({ '--dx': '44px' })} x={60} y={18} width={30} height={20} rx={3} />
    </g>
  ),
  'fits-small-screens': () => (
    <g>
      <rect class="g-node" x={8} y={10} width={84} height={38} rx={3} />
      {range(3).map((i) => <rect class="g-tint" x={14 + i * 26} y={16} width={22} height={26} rx={2} />)}
      <rect class="g-node" x={114} y={4} width={32} height={48} rx={5} />
      {range(3).map((i) => <rect class="g-fill g-bs" style={d(i * 0.25)} x={119} y={10 + i * 13} width={22} height={10} rx={2} />)}
    </g>
  ),
  'event-handler': () => (
    <g>
      <rect class="g-node" x={50} y={16} width={60} height={24} rx={6} />
      <circle class="g-tint g-ring" cx={86} cy={30} r={22} />
      <path class="g-fill" d="M86 30 l0 16 l4 -4 l4 8 l3 -1.5 l-4 -8 l6 0 z" />
    </g>
  ),
  'update-the-dom': () => (
    <g>
      {range(3).map((i) => <rect class="g-node" x={40} y={8 + i * 11} width={80} height={8} rx={2} />)}
      <rect class="g-fill g-ps" x={40} y={41} width={80} height={8} rx={2} />
    </g>
  ),
  'wait-for-data': () => (
    <g>
      <circle class="g-line" cx={80} cy={28} r={14} />
      <path class="g-stroke g-spin" style={v({ transformOrigin: '80px 28px', '--t': '1.2s' })} d="M80 14 a14 14 0 0 1 14 14" />
    </g>
  ),
  'form-controls': () => (
    <g>
      <rect class="g-node" x={10} y={10} width={84} height={16} rx={3} />
      <path class="g-stroke g-bs" d="M18 13 v10" />
      <rect class="g-node" x={10} y={34} width={14} height={14} rx={2} />
      <Check x={13} y={40} />
      <rect class="g-fill" x={104} y={30} width={46} height={18} rx={9} />
    </g>
  ),
  'alt-text-labels': () => (
    <g>
      <rect class="g-node" x={16} y={10} width={52} height={36} rx={3} />
      <path class="g-tint" d="M18 44 l16 -18 l12 12 l8 -8 l12 14 z" />
      <circle class="g-fill" cx={56} cy={20} r={4} />
      <Bubble x={84} y={12} w={62} h={24} />
      <Lines x={92} y={20} n={2} w={44} gap={7} />
    </g>
  ),
  'script-load-order': () => (
    <g>
      {range(3).map((i) => (
        <g class="g-bs" style={d(i * 0.4)}>
          <rect class={i === 0 ? 'g-fill' : 'g-tint'} x={16 + i * 46} y={16} width={38} height={24} rx={4} />
          <Tx x={35 + i * 46} y={32} s={String(i + 1)} fs={11} cls={i === 0 ? 'g-node' : 'g-fill'} />
        </g>
      ))}
    </g>
  ),

  // ---------- Debugging basics ----------
  'error-message-clue': () => (
    <g>
      <rect class="g-node" x={20} y={8} width={120} height={40} rx={4} />
      <circle class="g-fill" cx={34} cy={20} r={6} />
      <Tx x={34} y={23.5} s="!" fs={9} cls="g-node" />
      <path class="g-line" d="M46 20 H128 M32 32 H120" />
      <rect class="g-tint g-bs" x={28} y={36} width={60} height={7} rx={2} />
    </g>
  ),
  'reproduce-first': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M98 18 a18 14 0 1 0 4 14" />
      <path class="g-fill" d="M96 12 l8 6 l-9 3 z" />
      <circle class="g-fill g-heap" cx={80} cy={28} r={5} />
    </g>
  ),
  'narrow-it-down': () => (
    <g>
      <rect class="g-tint" x={16} y={10} width={128} height={9} rx={2} />
      <rect class="g-tint g-bs" style={d(0.3)} x={80} y={24} width={64} height={9} rx={2} />
      <rect class="g-fill g-bs" style={d(0.6)} x={112} y={38} width={32} height={9} rx={2} />
    </g>
  ),
  'print-values': () => (
    <g>
      <rect class="g-node" x={24} y={8} width={112} height={40} rx={4} />
      <Tx x={36} y={24} s=">" fs={10} />
      <path class="g-line" d="M44 21 H96" />
      <Tx x={62} y={40} s="x = 3" fs={10} cls="g-fill g-bs" />
    </g>
  ),
  'check-assumption-bug': () => (
    <g>
      <Check x={56} y={28} />
      <Tx x={100} y={36} s="?" fs={22} cls="g-fill g-bs" />
    </g>
  ),
  'what-changed-last': () => (
    <g>
      <rect class="g-node" x={14} y={8} width={56} height={40} rx={3} />
      <rect class="g-node" x={90} y={8} width={56} height={40} rx={3} />
      <Lines x={20} y={17} n={4} w={44} gap={8} />
      <Lines x={96} y={17} n={4} w={44} gap={8} />
      <rect class="g-fill g-bs" x={94} y={22} width={48} height={6} rx={2} />
    </g>
  ),
  'rubber-duck': () => (
    <g>
      <ellipse class="g-tint" cx={56} cy={38} rx={22} ry={11} />
      <circle class="g-fill" cx={70} cy={22} r={9} />
      <path class="g-fill" d="M78 21 l9 2 l-9 3 z" />
      <Bubble x={96} y={6} w={52} h={22} />
      <Lines x={104} y={13} n={2} w={34} gap={6} />
    </g>
  ),
  'one-change-at-a-time': () => (
    <g>
      {range(4).map((i) => (
        <g>
          <rect class="g-node" x={26 + i * 30} y={20} width={20} height={16} rx={8} />
          <circle class={i === 2 ? 'g-fill g-sway' : 'g-tint'} style={i === 2 ? v({ '--dx': '10px', '--t': '1.6s' }) : undefined} cx={31 + i * 30} cy={28} r={5} />
        </g>
      ))}
    </g>
  ),
  'off-by-one': () => (
    <g>
      {range(6).map((i) => <rect class={i === 5 ? 'g-fill g-heap' : 'g-node'} x={22 + i * 20} y={20} width={16} height={16} rx={2} />)}
      <path class="g-stroke" d="M22 14 v-4 h96 v4" />
    </g>
  ),
  'wrong-input-data': () => (
    <g>
      <rect class="g-node" x={110} y={14} width={38} height={28} rx={4} />
      <circle class="g-tint g-move" style={v({ '--dx': '84px', '--t': '2.4s' })} cx={16} cy={20} r={4} />
      <rect class="g-fill g-move" style={v({ '--dx': '84px', '--t': '2.4s', ...d(0.8) })} x={12} y={32} width={8} height={8} />
    </g>
  ),
  'works-on-my-machine': () => (
    <g>
      <rect class="g-node" x={18} y={10} width={48} height={32} rx={3} />
      <rect class="g-node" x={94} y={10} width={48} height={32} rx={3} />
      <Check x={36} y={26} />
      <path class="g-draw" style={d(0.4)} pathLength={100} d="M112 20 l12 12 M124 20 l-12 12" />
    </g>
  ),
  'fix-root-cause': () => (
    <g>
      <path class="g-line" d="M20 30 H140" />
      <path class="g-fill" d="M80 30 l-8 -14 h16 z" />
      <path class="g-draw" pathLength={100} d="M80 30 v10 M80 36 l-14 12 M80 36 l14 12 M80 40 v12" />
    </g>
  ),

  // ---------- Clear thinking basics ----------
  'hidden-assumption': () => (
    <g>
      <path class="g-line" d="M10 22 H150" />
      <path class="g-fill" d="M72 22 l8 -14 l8 14 z" />
      <path class="g-tint g-bs" d="M60 22 l20 30 l24 -30 z" />
    </g>
  ),
  'cause-or-correlation': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M14 48 L64 24" />
      <path class="g-draw" pathLength={100} d="M96 48 L146 24" />
      <circle class="g-fill g-bs" style={d(0.6)} cx={80} cy={12} r={6} />
      <path class="g-flow" d="M74 14 L48 26 M86 14 L112 26" />
    </g>
  ),
  'split-into-parts': () => (
    <g>
      {range(4).map((i) => <rect class={i === 0 ? 'g-fill' : 'g-tint'} x={60 + (i % 2) * 20} y={10 + Math.floor(i / 2) * 18} width={20} height={18} rx={2} />)}
      <rect class="g-tint g-sway" style={v({ '--dx': '40px' })} x={80} y={10} width={20} height={18} rx={2} />
      <rect class="g-tint g-sway" style={v({ '--dx': '-40px' })} x={60} y={28} width={20} height={18} rx={2} />
    </g>
  ),
  'define-the-goal': () => (
    <g>
      <circle class="g-node" cx={120} cy={28} r={20} />
      <circle class="g-tint" cx={120} cy={28} r={12} />
      <circle class="g-fill" cx={120} cy={28} r={4} />
      <path class="g-stroke g-move" style={v({ '--dx': '72px', '--t': '2.4s' })} d="M18 28 h24 m-6 -5 l6 5 l-6 5" />
    </g>
  ),
  'second-order-effect': () => (
    <g>
      {range(4).map((i) => <rect class={i === 0 ? 'g-fill' : 'g-tint g-bs'} style={i ? d(i * 0.35) : undefined} x={30 + i * 28} y={14} width={8} height={30} rx={1} transform={`rotate(${i === 0 ? 20 : 0} ${34 + i * 28} 44)`} />)}
    </g>
  ),
  'base-rate-check': () => (
    <g>
      {range(20).map((i) => <circle class={i === 3 || i === 14 ? 'g-fill g-heap' : 'g-node'} cx={26 + (i % 10) * 12} cy={20 + Math.floor(i / 10) * 16} r={4} />)}
    </g>
  ),
  'work-backwards': () => (
    <g>
      <path class="g-line" d="M134 48 V10" />
      <path class="g-fill" d="M134 10 l18 6 l-18 6 z" />
      <path class="g-draw" pathLength={100} d="M126 38 H24 m8 -6 l-8 6 l8 6" />
    </g>
  ),
  'falsify-it': () => (
    <g>
      {range(4).map((i) => <Check x={20 + i * 22} y={28} />)}
      <g class="g-sway" style={v({ '--dx': '-24px' })}>
        <circle class="g-stroke" cx={124} cy={24} r={10} />
        <path class="g-stroke" d="M131 31 l9 9" />
        <path class="g-stroke" d="M120 20 l8 8 M128 20 l-8 8" />
      </g>
    </g>
  ),
  'sunk-cost-pull': () => (
    <g>
      <path class="g-line" d="M20 40 H60 M100 40 H140" />
      <path class="g-tint" d="M60 40 h40 v14 h-40 z" />
      {range(3).map((i) => <circle class="g-fill g-move" style={v({ '--dy': '30px', '--t': '2.2s', ...d(i * 0.4) })} cx={70 + i * 10} cy={10} r={4} />)}
    </g>
  ),
  'small-test-first': () => (
    <g>
      <rect class="g-fill g-bs" x={30} y={30} width={14} height={14} rx={2} />
      <path class="g-flow" d="M50 37 H74" />
      <rect class="g-tint g-bs" style={d(0.7)} x={80} y={10} width={50} height={34} rx={3} />
    </g>
  ),
  'other-explanations': () => (
    <g>
      <circle class="g-fill" cx={24} cy={28} r={6} />
      <path class="g-flow" d="M32 26 L100 12 M32 28 H100 M32 30 L100 44" />
      {[12, 28, 44].map((y, i) => <Tx x={112} y={y + 4} s="?" fs={12} cls="g-fill g-bs" />)}
    </g>
  ),
  'ask-for-evidence': () => (
    <g>
      <Doc x={34} y={11} />
      <circle class="g-stroke g-sway" style={v({ '--dx': '10px', '--dy': '6px' })} cx={60} cy={26} r={10} />
      <Bubble x={96} y={10} w={40} h={26} />
      <Tx x={116} y={28} s="?" fs={14} />
    </g>
  ),

  // ---------- Requirements basics ----------
  'user-need': () => (
    <g>
      <Person x={46} y={26} />
      <Bubble x={70} y={6} w={62} h={26} cls="g-tint" />
      <circle class="g-fill g-heap" cx={101} cy={19} r={5} />
    </g>
  ),
  'acceptance-check': () => (
    <g>
      {range(3).map((i) => (
        <g>
          <rect class="g-node" x={40} y={8 + i * 15} width={11} height={11} rx={2} />
          <Check x={41} y={13 + i * 15} delay={i * 0.4} />
          <path class="g-line" d={`M58 ${14 + i * 15} H120`} />
        </g>
      ))}
    </g>
  ),
  'scope-boundary': () => (
    <g>
      <rect class="g-stroke g-dash" x={20} y={8} width={80} height={40} rx={5} />
      {[[40, 20], [62, 34], [80, 18]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={5} />)}
      <circle class="g-tint g-sway" style={v({ '--dx': '-14px' })} cx={136} cy={28} r={5} />
    </g>
  ),
  'edge-case-ask': () => (
    <g>
      <path class="g-line" d="M20 28 H140" />
      {range(5).map((i) => <circle class="g-node" cx={44 + i * 18} cy={28} r={4} />)}
      <circle class="g-fill g-heap" cx={20} cy={28} r={5} />
      <circle class="g-fill g-heap" style={d(0.8)} cx={140} cy={28} r={5} />
    </g>
  ),
  'vague-word': () => (
    <g>
      <Tx x={46} y={33} s="fast?" fs={14} cls="g-fill g-faint" />
      <path class="g-flow" d="M76 28 H96" />
      <Tx x={124} y={33} s="< 1s" fs={13} cls="g-fill g-bs" />
    </g>
  ),
  'must-vs-nice': () => (
    <g>
      <rect class="g-fill g-ps" x={50} y={10} width={22} height={40} rx={2} />
      <rect class="g-tint g-ps" style={d(0.4)} x={88} y={34} width={22} height={16} rx={2} />
    </g>
  ),
  'who-is-user': () => (
    <g>
      <Person x={44} />
      <Person x={80} cls="g-fill" />
      <Person x={116} />
      <circle class="g-tint g-ring" cx={80} cy={32} r={21} />
    </g>
  ),
  'ask-why-request': () => (
    <g>
      {range(3).map((i) => <Tx x={36 + i * 44} y={22 + i * 10} s="why?" fs={11 - i} cls="g-fill g-bs" />)}
    </g>
  ),

  // ---------- Time series basics ----------
  'trend-line': () => (
    <g>
      <path class="g-line" d="M10 46 L30 42 L44 46 L62 34 L78 38 L96 26 L112 30 L130 16 L150 20" />
      <path class="g-draw" pathLength={100} d="M10 48 L150 14" />
    </g>
  ),
  'seasonal-cycle': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M5 28 q15 -22 30 0 t30 0 t30 0 t30 0 t30 0" />
    </g>
  ),
  'random-noise': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M10 28 L18 22 L26 33 L34 25 L42 30 L50 20 L58 34 L66 26 L74 31 L82 23 L90 29 L98 35 L106 24 L114 30 L122 22 L130 31 L138 26 L150 29" />
    </g>
  ),
  'moving-average': () => (
    <g>
      <path class="g-line" d="M10 40 L20 30 L30 44 L40 26 L50 38 L60 22 L70 34 L80 18 L90 30 L100 16 L110 28 L120 14 L130 24 L150 12" />
      <path class="g-draw" pathLength={100} d="M10 38 C50 34 90 26 150 16" />
    </g>
  ),
  'past-predicts': () => (
    <g>
      <path class="g-line" d="M20 30 L50 26 L80 32 L110 28" />
      {[[20, 30], [50, 26], [80, 32], [110, 28]].map(([x, y]) => <circle class="g-tint" cx={x} cy={y} r={4} />)}
      <path class="g-flow" d="M114 28 H136" />
      <circle class="g-fill g-bs" cx={140} cy={29} r={5} />
    </g>
  ),
  'volatility-swings': () => (
    <g>
      <path class="g-draw" pathLength={100} d="M10 28 L18 26 L26 30 L34 27 L42 29 L50 27 L58 29 L66 16 L74 42 L82 10 L90 46 L98 14 L106 40 L114 26 L122 30 L130 27 L150 28" />
    </g>
  ),
  'outlier-spike': () => (
    <g>
      <path class="g-line" d="M10 40 L40 38 L60 41 L76 39 L84 10 L92 40 L120 38 L150 40" />
      <circle class="g-fill g-heap" cx={84} cy={10} r={5} />
    </g>
  ),
  'percent-change': () => (
    <g>
      <rect class="g-tint" x={30} y={36} width={22} height={14} rx={2} />
      <rect class="g-fill g-ps" x={62} y={22} width={22} height={28} rx={2} />
      <Tx x={122} y={36} s="+100%" fs={13} cls="g-fill g-bs" />
    </g>
  ),

  // ---------- Listening basics ----------
  'reflect-back': () => (
    <g>
      <Bubble x={14} y={8} w={56} h={26} />
      <Bubble x={90} y={8} w={56} h={26} cls="g-tint" />
      <path class="g-flow" d="M70 44 H104" />
      <path class="g-flow" style={d(0.4)} d="M104 50 H70" />
    </g>
  ),
  'open-question': () => (
    <g>
      <Bubble x={20} y={10} w={40} h={28} />
      <Tx x={40} y={29} s="?" fs={14} />
      <Lines x={76} y={16} n={3} w={66} gap={10} />
      <rect class="g-fill g-sway" style={v({ '--dx': '40px' })} x={76} y={34} width={26} height={4} rx={2} />
    </g>
  ),
  'dont-interrupt': () => (
    <g>
      <Bubble x={12} y={8} w={96} h={24} />
      <path class="g-draw" pathLength={100} d="M22 20 H96" />
      <Bubble x={118} y={22} w={30} h={20} cls="g-tint g-faint" />
    </g>
  ),
  'feeling-behind-words': () => (
    <g>
      <Bubble x={44} y={6} w={72} h={36} />
      <path class="g-fill g-heap" d="M80 34 l-10 -10 a6 6 0 0 1 10 -8 a6 6 0 0 1 10 8 z" />
    </g>
  ),
  'clarify-meaning': () => (
    <g>
      <rect class="g-node" x={24} y={18} width={70} height={20} rx={4} />
      <Tx x={59} y={31} s="'soon'" fs={9} />
      <g class="g-sway" style={v({ '--dx': '-30px' })}>
        <circle class="g-stroke" cx={118} cy={24} r={11} />
        <path class="g-stroke" d="M126 32 l10 10" />
      </g>
    </g>
  ),
  'summarise-points': () => (
    <g>
      {range(3).map((i) => <circle class="g-tint g-move" style={v({ '--dx': '76px', '--dy': `${(1 - i) * 14}px`, '--t': '2.4s' })} cx={24} cy={14 + i * 14} r={5} />)}
      <rect class="g-fill" x={104} y={18} width={40} height={20} rx={4} />
    </g>
  ),
  'hold-advice': () => (
    <g>
      <circle class="g-tint g-faint" cx={60} cy={22} r={12} />
      <rect class="g-node" x={54} y={34} width={12} height={8} rx={2} />
      <rect class="g-fill g-bs" x={98} y={14} width={7} height={26} rx={2} />
      <rect class="g-fill g-bs" x={112} y={14} width={7} height={26} rx={2} />
    </g>
  ),
  'body-language': () => (
    <g class="g-sway" style={v({ '--dy': '4px', '--t': '0.9s' })}>
      <circle class="g-node" cx={80} cy={24} r={16} />
      <circle class="g-fill" cx={74} cy={21} r={2} />
      <circle class="g-fill" cx={86} cy={21} r={2} />
      <path class="g-stroke" d="M74 30 q6 5 12 0" />
    </g>
  ),

  // ---------- Game design basics ----------
  'core-loop': () => (
    <g>
      <circle class="g-flow" cx={80} cy={28} r={18} />
      {range(3).map((i) => {
        const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        return <circle class={i === 0 ? 'g-fill g-heap' : 'g-node'} cx={80 + 18 * Math.cos(a)} cy={28 + 18 * Math.sin(a)} r={5} />;
      })}
    </g>
  ),
  'clear-goal': () => (
    <g>
      <path class="g-line" d="M10 48 H150" />
      <path class="g-line" d="M120 48 V10" />
      <path class="g-fill g-heap" d="M120 10 l20 7 l-20 7 z" />
      <circle class="g-tint g-move" style={v({ '--dx': '80px', '--t': '2.6s' })} cx={24} cy={42} r={5} />
    </g>
  ),
  'feedback-juice': () => (
    <g>
      <path class="g-fill" d="M80 14 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z" />
      <circle class="g-stroke g-ring" cx={80} cy={28} r={26} />
    </g>
  ),
  'difficulty-curve': () => (
    <g>
      <path class="g-line" d="M14 50 H150 M14 50 V6" />
      <path class="g-draw" pathLength={100} d="M14 46 C60 44 100 34 146 10" />
    </g>
  ),
  'meaningful-choice': () => (
    <g>
      <path class="g-line" d="M14 28 H64 L110 12 M64 28 L110 44" />
      <circle class="g-fill g-heap" cx={118} cy={12} r={6} />
      <rect class="g-tint g-heap" style={d(0.8)} x={112} y={38} width={12} height={12} rx={2} />
      <circle class="g-fill" cx={64} cy={28} r={4} />
    </g>
  ),
  'reward-loop': () => (
    <g>
      <path class="g-fill g-heap" d="M80 8 l5.5 12 l13 1.5 l-9.5 9 l2.5 13 l-11.5 -6.5 l-11.5 6.5 l2.5 -13 l-9.5 -9 l13 -1.5 z" />
    </g>
  ),
  'rules-limits': () => (
    <g>
      {range(3).map((i) => <path class={i === 2 ? 'g-fill g-bs' : 'g-fill'} d={`M${48 + i * 32} 38 l-10 -10 a6 6 0 0 1 10 -8 a6 6 0 0 1 10 8 z`} />)}
    </g>
  ),
  'fair-randomness': () => (
    <g>
      <rect class="g-node g-spin" style={v({ transformOrigin: '60px 28px', '--t': '3s' })} x={46} y={14} width={28} height={28} rx={5} />
      <rect class="g-node" x={88} y={14} width={28} height={28} rx={5} />
      {[[95, 21], [102, 28], [109, 35]].map(([x, y]) => <circle class="g-fill" cx={x} cy={y} r={2.5} />)}
    </g>
  ),
};

function Bars({ hs, x0 = 30, w = 14, gap = 6 }: { hs: number[]; x0?: number; w?: number; gap?: number }) {
  return <g>{hs.map((h, i) => <rect class={i === 0 ? 'g-fill g-ps' : 'g-tint g-ps'} style={d(i * 0.15)} x={x0 + i * (w + gap)} y={50 - h} width={w} height={h} rx={2} />)}</g>;
}
