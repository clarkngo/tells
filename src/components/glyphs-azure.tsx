// Glyphs for the Azure AI Fundamentals (AI-901) track.
// Same 160×56 canvas and motion classes as the other glyph files.
// few-shot and rag reuse the glyphs from the AI tracks.
type Shape = () => preact.JSX.Element;

const d = (s: number) => ({ animationDelay: `${s}s` });
const v = (o: Record<string, string | number>) => o;

// A person: head and shoulders.
const Person = ({ x, y = 20, cls = 'g-node' }: { x: number; y?: number; cls?: string }) => (
  <g class={cls}>
    <circle cx={x} cy={y} r={5} />
    <path d={`M${x - 8} ${y + 20} a8 9 0 0 1 16 0 z`} />
  </g>
);
// Lines of text.
const Lines = ({ x, y, w, n = 3, gap = 8, cls = 'g-line' }: { x: number; y: number; w: number; n?: number; gap?: number; cls?: string }) => (
  <g>{Array.from({ length: n }, (_, i) => <path class={cls} d={`M${x} ${y + i * gap} h${i === n - 1 ? w * 0.6 : w}`} />)}</g>
);
// A picture frame with hills.
const Pic = ({ x, y, w = 44, h = 36 }: { x: number; y: number; w?: number; h?: number }) => (
  <g>
    <rect class="g-node" x={x} y={y} width={w} height={h} rx={3} />
    <path class="g-tint" d={`M${x + 2} ${y + h - 2} l${w * 0.3} ${-h * 0.4} l${w * 0.2} ${h * 0.2} l${w * 0.2} ${-h * 0.25} l${w * 0.26} ${h * 0.45} z`} />
    <circle class="g-tint" cx={x + w * 0.75} cy={y + h * 0.28} r={4} />
  </g>
);
// A sound wave of bars.
const Wave = ({ x, hs, cls = 'g-fill g-ps' }: { x: number; hs: number[]; cls?: string }) => (
  <g>{hs.map((h, i) => <rect class={cls} style={d(i * 0.1)} x={x + i * 6} y={28 - h / 2} width={3.5} height={h} rx={1.5} />)}</g>
);
const wave = [6, 14, 22, 12, 28, 18, 8, 16, 24, 10];

export const azureShapes: Record<string, Shape> = {
  // Responsible AI
  fairness: () => (
    <g>
      <path class="g-line" d="M80 10 V50 M62 50 H98" />
      <path class="g-stroke" d="M40 12 H120" />
      <circle class="g-fill" cx={80} cy={10} r={3} />
      <g class="g-sway" style={v({ '--dy': '5px' })}>
        <path class="g-line" d="M40 12 L30 32 M40 12 L50 32" />
        <path class="g-tint" d="M28 32 a12 7 0 0 0 24 0 z" />
        <circle class="g-fill" cx={40} cy={28} r={3} />
      </g>
      <g class="g-sway" style={v({ '--dy': '-5px' })}>
        <path class="g-line" d="M120 12 L110 32 M120 12 L130 32" />
        <path class="g-tint" d="M108 32 a12 7 0 0 0 24 0 z" />
        <circle class="g-fill" cx={120} cy={28} r={3} />
      </g>
    </g>
  ),
  'reliability-safety': () => (
    <g>
      <path class="g-node" d="M80 6 L104 14 V30 C104 42 92 50 80 52 C68 50 56 42 56 30 V14 Z" />
      <path class="g-draw" pathLength={100} d="M69 29 L77 37 L92 21" />
      <path class="g-flow" d="M10 28 H48 M112 28 H150" />
    </g>
  ),
  'privacy-security': () => (
    <g>
      <rect class="g-node" x={62} y={24} width={36} height={26} rx={4} />
      <path class="g-stroke" d="M70 24 V17 a10 10 0 0 1 20 0 V24" />
      <circle class="g-fill g-heap" cx={80} cy={35} r={3.5} />
      <path class="g-fill" d="M78.5 37 h3 v7 h-3 z" />
      {[20, 34, 126, 140].map((x, i) => <circle class="g-tint g-bs" style={d(i * 0.4)} cx={x} cy={28} r={4} />)}
    </g>
  ),
  inclusiveness: () => (
    <g>
      <circle class="g-tint" cx={80} cy={28} r={26} />
      {[50, 70, 90, 110].map((x, i) => <g class="g-bs" style={d(i * 0.3)}><Person x={x} y={18} cls="g-fill" /></g>)}
    </g>
  ),
  transparency: () => (
    <g>
      <rect class="g-node g-faint" x={56} y={8} width={48} height={40} rx={4} />
      <circle class="g-stroke g-faint" cx={80} cy={28} r={9} />
      {[0, 60, 120, 180, 240, 300].map((a) => <path class="g-line" style={{ transform: `rotate(${a}deg)`, transformOrigin: '80px 28px' }} d="M80 16 V12" />)}
      <g class="g-sway" style={v({ '--dx': '30px' })}>
        <circle class="g-stroke" cx={38} cy={24} r={11} />
        <path class="g-stroke" d="M46 32 L56 42" />
      </g>
    </g>
  ),
  accountability: () => (
    <g>
      <rect class="g-node" x={22} y={14} width={44} height={30} rx={3} />
      <Lines x={28} y={21} w={32} n={2} gap={7} />
      <path class="g-draw" pathLength={100} d="M28 38 c4 -6 6 4 10 -2 s6 4 10 -2 s4 2 8 0" />
      <path class="g-flow" d="M70 28 H100" />
      <Person x={124} y={16} cls="g-fill" />
    </g>
  ),

  // Models
  'reasoning-model': () => (
    <g>
      <circle class="g-node" cx={20} cy={28} r={6} />
      <path class="g-draw" pathLength={100} d="M26 28 C40 8 50 8 60 28 S80 48 92 28 S112 8 124 28 L134 28" />
      {[60, 92, 124].map((x, i) => <circle class="g-fill g-bs" style={d(0.4 + i * 0.5)} cx={x} cy={28} r={3} />)}
      <circle class="g-fill" cx={144} cy={28} r={7} />
    </g>
  ),
  'small-model': () => (
    <g>
      <rect class="g-node g-faint" x={14} y={8} width={56} height={40} rx={6} />
      <Lines x={22} y={18} w={40} n={3} gap={9} />
      <rect class="g-node" x={104} y={16} width={24} height={30} rx={4} />
      <rect class="g-fill g-heap" x={110} y={24} width={12} height={12} rx={2} />
      <path class="g-flow" d="M74 28 H98" />
    </g>
  ),
  'embedding-model': () => (
    <g>
      <Lines x={10} y={16} w={36} n={3} gap={10} />
      <path class="g-flow" d="M52 28 H74" />
      <path class="g-line" d="M84 48 H150 M84 48 V6" />
      {[[100, 36], [106, 30], [112, 38], [132, 14], [138, 20], [128, 22]].map(([x, y], i) => (
        <circle class={`g-fill g-bs`} style={d(i * 0.2)} cx={x} cy={y} r={3.5} />
      ))}
    </g>
  ),
  'multimodal-model': () => (
    <g>
      <Pic x={8} y={2} w={30} h={18} />
      <Wave x={10} hs={[4, 10, 6, 10, 4]} cls="g-fill" />
      <path class="g-line" d="M8 46 h30 M8 52 h20" />
      <path class="g-flow" d="M44 15 L74 28 M44 42 L74 28" />
      <rect class="g-node" x={78} y={14} width={28} height={28} rx={6} />
      <circle class="g-fill g-heap" cx={92} cy={28} r={5} />
      <path class="g-flow" d="M110 28 H130" />
      <Lines x={134} y={20} w={20} n={3} gap={8} />
    </g>
  ),
  'image-generation': () => (
    <g>
      <Lines x={10} y={18} w={38} n={3} gap={9} />
      <path class="g-flow" d="M54 28 H84" />
      <g class="g-bs"><Pic x={94} y={8} w={52} h={40} /></g>
      <path class="g-fill g-heap" d="M90 10 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" />
    </g>
  ),

  'next-token': () => (
    <g>
      {[0, 1, 2, 3].map((i) => <rect class="g-node" x={8 + i * 26} y={20} width={22} height={16} rx={3} />)}
      <rect class="g-fill g-bs" x={112} y={20} width={22} height={16} rx={3} />
      {[0, 1, 2].map((i) => <rect class="g-tint" x={140} y={10 + i * 13} width={14} height={9} rx={2} />)}
      <path class="g-flow" d="M112 44 C90 54 40 54 18 40" />
    </g>
  ),
  'model-catalog': () => (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect class={i === 4 ? 'g-fill g-heap' : 'g-node'} x={12 + (i % 3) * 46} y={6 + Math.floor(i / 3) * 24} width={40} height={20} rx={3} />
      ))}
    </g>
  ),

  // Configuration and deployment
  temperature: () => (
    <g>
      <path class="g-line" d="M14 28 H72" />
      <circle class="g-fill g-sway" style={v({ '--dx': '48px' })} cx={18} cy={28} r={6} />
      <path class="g-stroke" d="M90 28 H150" style={{ opacity: 0.35 }} />
      <path class="g-draw" pathLength={100} d="M90 28 C98 10 104 46 112 22 S124 6 130 34 S144 40 150 18" />
    </g>
  ),
  'max-tokens': () => (
    <g>
      {Array.from({ length: 14 }, (_, i) => (
        <rect class="g-fill g-bs" style={d(i * 0.12)} x={10 + i * 9} y={22} width={7} height={12} rx={2} />
      ))}
      <path class="g-stroke" d="M136 8 V48" />
      <path class="g-line g-dash" d="M140 28 H156" />
    </g>
  ),
  'deployment-type': () => (
    <g>
      {[22, 62, 102].map((x, i) => (
        <g>
          <rect class={i === 1 ? 'g-fill g-faint' : 'g-node'} x={x} y={10} width={34} height={36} rx={4} />
          <path class="g-line" d={`M${x + 6} 22 h22 M${x + 6} 30 h22 M${x + 6} 38 h14`} />
        </g>
      ))}
      <path class="g-stroke g-sway" style={v({ '--dx': '40px' })} d="M18 6 h42 v44 h-42 z" />
    </g>
  ),

  playground: () => (
    <g>
      <rect class="g-node" x={8} y={4} width={144} height={48} rx={4} />
      <rect class="g-node g-bs" x={16} y={12} width={60} height={9} rx={4} />
      <rect class="g-tint g-bs" style={d(0.6)} x={50} y={26} width={70} height={9} rx={4} />
      <path class="g-line" d="M130 14 h14 M130 26 h14 M130 38 h14" />
      <circle class="g-fill g-sway" style={v({ '--dx': '10px' })} cx={132} cy={26} r={3} />
    </g>
  ),
  'endpoint-auth': () => (
    <g>
      <rect class="g-node" x={104} y={10} width={48} height={36} rx={4} />
      <path class="g-line" d="M112 22 h32 M112 30 h24" />
      <g class="g-sway" style={v({ '--dx': '44px' })}>
        <circle class="g-stroke" cx={22} cy={28} r={8} />
        <path class="g-stroke" d="M30 28 H56 M48 28 v6 M54 28 v5" />
      </g>
    </g>
  ),
  'chat-history': () => (
    <g>
      {[0, 1, 2].map((i) => <rect class="g-node g-faint" x={i % 2 ? 44 : 10} y={6 + i * 12} width={48} height={8} rx={4} />)}
      <rect class="g-fill g-bs" x={10} y={42} width={48} height={8} rx={4} />
      <path class="g-flow" d="M98 28 H124" />
      <rect class="g-node" x={128} y={14} width={24} height={28} rx={6} />
      <path class="g-line g-dash" d="M8 3 H96 V53 H8 Z" />
    </g>
  ),

  // Prompts and agents
  'system-prompt': () => (
    <g>
      <rect class="g-fill g-faint" x={10} y={6} width={140} height={12} rx={3} />
      {[0, 1, 2].map((i) => (
        <rect class="g-node g-bs" style={d(i * 0.5)} x={i % 2 ? 70 : 20} y={24 + i * 9} width={70} height={7} rx={3} />
      ))}
      <path class="g-line g-dash" d="M10 21 H150" />
    </g>
  ),
  'ai-agent': () => (
    <g>
      <circle class="g-node" cx={80} cy={28} r={12} />
      <circle class="g-fill g-heap" cx={80} cy={28} r={5} />
      {[[24, 12], [24, 44], [136, 12], [136, 44]].map(([x, y], i) => (
        <g>
          <path class="g-flow" d={`M80 28 L${x} ${y}`} />
          <rect class="g-node" x={x - 9} y={y - 7} width={18} height={14} rx={3} />
          <rect class="g-fill g-bs" style={d(i * 0.6)} x={x - 4} y={y - 2} width={8} height={4} rx={1} />
        </g>
      ))}
    </g>
  ),
  'content-filters': () => (
    <g>
      <path class="g-stroke" d="M80 6 V50" />
      {[0, 1, 2, 3].map((i) => <path class="g-line" d={`M76 ${12 + i * 11} h8`} />)}
      <circle class="g-fill g-move" style={v({ '--dx': '120px', '--t': '2.6s' })} cx={20} cy={18} r={4} />
      <rect class="g-fill g-move" style={v({ '--dx': '52px', '--t': '2.6s', animationDelay: '0.9s' })} x={16} y={34} width={8} height={8} rx={1} />
      <path class="g-stroke" d="M64 32 l8 8 M72 32 l-8 8" />
    </g>
  ),

  // Text analysis
  'key-phrases': () => (
    <g>
      <Lines x={10} y={12} w={70} n={5} gap={8} />
      {[0, 1, 2].map((i) => <rect class="g-fill g-bs" style={d(i * 0.4)} x={100} y={10 + i * 14} width={[42, 30, 36][i]} height={9} rx={4.5} />)}
    </g>
  ),
  'entity-recognition': () => (
    <g>
      <path class="g-line" d="M10 22 h20 M76 22 h18 M126 22 h24 M10 38 h40 M96 38 h54" />
      {[[34, 22, 38], [98, 22, 24], [54, 38, 38]].map(([x, y, w], i) => (
        <g>
          <rect class="g-tint" x={x} y={y - 5} width={w} height={10} rx={3} />
          <path class="g-draw" pathLength={100} style={d(i * 0.4)} d={`M${x} ${y + 7} h${w}`} />
        </g>
      ))}
    </g>
  ),
  'pii-detection': () => (
    <g>
      <path class="g-line" d="M10 18 h30 M10 38 h50 M112 38 h38 M120 18 h30" />
      <rect class="g-fill g-ps" x={46} y={13} width={68} height={10} rx={2} />
      <rect class="g-fill g-ps" style={d(0.3)} x={66} y={33} width={40} height={10} rx={2} />
    </g>
  ),
  'sentiment-analysis': () => (
    <g>
      <path class="g-line" d="M20 44 A60 60 0 0 1 140 44" />
      <path class="g-tint" d="M20 44 A60 60 0 0 1 50 4 L80 44 Z" />
      <path class="g-fill g-faint" d="M110 4 A60 60 0 0 1 140 44 L80 44 Z" />
      <path class="g-stroke g-flip" style={{ transformOrigin: '80px 44px' }} d="M80 44 L112 18" />
      <circle class="g-fill" cx={80} cy={44} r={4} />
    </g>
  ),
  summarization: () => (
    <g>
      <rect class="g-node" x={10} y={4} width={44} height={48} rx={3} />
      <Lines x={16} y={12} w={32} n={5} gap={8} />
      <path class="g-flow" d="M60 28 H96" />
      <rect class="g-node" x={104} y={16} width={44} height={24} rx={3} />
      <path class="g-draw" pathLength={100} d="M110 24 h32 M110 32 h20" />
    </g>
  ),
  translation: () => (
    <g>
      <rect class="g-node" x={14} y={8} width={44} height={28} rx={6} />
      <text class="g-fill" x={36} y={27} font-size="14" text-anchor="middle">あ</text>
      <rect class="g-node" x={102} y={20} width={44} height={28} rx={6} />
      <text class="g-fill" x={124} y={39} font-size="14" text-anchor="middle">A</text>
      <path class="g-flow" d="M62 22 C78 22 84 34 98 34" />
    </g>
  ),

  // Speech
  'speech-to-text': () => (
    <g>
      <Wave x={10} hs={wave} />
      <path class="g-flow" d="M72 28 H96" />
      <path class="g-draw" pathLength={100} d="M104 20 h46 M104 28 h40 M104 36 h28" />
    </g>
  ),
  'text-to-speech': () => (
    <g>
      <Lines x={10} y={20} w={44} n={3} gap={8} />
      <path class="g-flow" d="M60 28 H84" />
      <Wave x={92} hs={wave} />
    </g>
  ),

  // Vision
  'image-analysis': () => (
    <g>
      <Pic x={10} y={6} w={56} h={44} />
      {[0, 1, 2].map((i) => <rect class="g-fill g-bs" style={d(i * 0.4)} x={82} y={10 + i * 14} width={[50, 36, 44][i]} height={9} rx={4.5} />)}
    </g>
  ),
  ocr: () => (
    <g>
      <rect class="g-node" x={10} y={6} width={60} height={44} rx={3} />
      <text class="g-fill" x={40} y={34} font-size="16" font-weight="700" text-anchor="middle">Ab</text>
      <path class="g-stroke g-sway" style={v({ '--dy': '30px' })} d="M10 12 H70" />
      <path class="g-flow" d="M76 28 H100" />
      <path class="g-draw" pathLength={100} d="M108 22 h40 M108 32 h28" />
    </g>
  ),
  'object-detection': () => (
    <g>
      <Pic x={10} y={4} w={140} h={48} />
      <rect class="g-stroke g-bs" x={24} y={14} width={34} height={30} rx={2} />
      <rect class="g-stroke g-bs" style={d(0.6)} x={96} y={10} width={28} height={36} rx={2} />
    </g>
  ),

  // Information extraction
  'document-extraction': () => (
    <g>
      <rect class="g-node" x={10} y={4} width={46} height={48} rx={3} />
      <Lines x={16} y={12} w={34} n={2} gap={8} />
      <rect class="g-tint" x={16} y={30} width={34} height={8} rx={2} />
      <rect class="g-tint" x={16} y={42} width={20} height={6} rx={2} />
      <path class="g-flow" d="M60 28 H86" />
      {[0, 1, 2].map((i) => (
        <g>
          <rect class="g-node" x={94} y={8 + i * 14} width={18} height={10} rx={2} />
          <rect class="g-fill g-bs" style={d(i * 0.4)} x={116} y={8 + i * 14} width={32} height={10} rx={2} />
        </g>
      ))}
    </g>
  ),
  'av-extraction': () => (
    <g>
      {[0, 1, 2].map((i) => <rect class="g-node" x={10 + i * 22} y={8} width={18} height={14} rx={2} />)}
      <Wave x={10} hs={[6, 12, 8, 16, 10, 6, 12, 8, 14, 6]} cls="g-fill g-faint" />
      <path class="g-line" d="M10 34 V50" />
      <path class="g-flow" d="M80 28 H100" />
      {[0, 1, 2].map((i) => <rect class="g-fill g-bs" style={d(i * 0.4)} x={108} y={10 + i * 14} width={40} height={9} rx={2} />)}
    </g>
  ),
};
