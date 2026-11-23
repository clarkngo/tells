import { extraShapes } from './glyphs-extra';
import { moreShapes } from './glyphs-more';
import { newShapes } from './glyphs-new';
import { garchShapes } from './glyphs-garch';

// Small looping animation that shows each pattern's "shape". Colored by --h.
const cells = Array.from({ length: 8 }, (_, i) => 8 + i * 18);

function Cells() {
  return (
    <g class="g-cells">
      {cells.map((x) => <rect x={x} y={18} width={16} height={16} rx={3} />)}
    </g>
  );
}

const shapes: Record<string, () => preact.JSX.Element> = {
  'two-pointers': () => (
    <>
      <Cells />
      <path class="g-fill g-tp-l" d="M10 46 l6 -8 l6 8 z" />
      <path class="g-fill g-tp-r" d="M136 46 l6 -8 l6 8 z" />
    </>
  ),
  'sliding-window': () => (
    <>
      <Cells />
      <rect class="g-stroke g-sw" x={6} y={14} width={56} height={24} rx={5} />
    </>
  ),
  'binary-search': () => (
    <>
      <Cells />
      <rect class="g-tint g-bs" style={{ animationDelay: '0s' }} x={6} y={14} width={148} height={24} rx={5} />
      <rect class="g-tint g-bs" style={{ animationDelay: '0.6s' }} x={78} y={14} width={76} height={24} rx={5} />
      <rect class="g-tint g-bs" style={{ animationDelay: '1.2s' }} x={78} y={14} width={40} height={24} rx={5} />
      <rect class="g-fill g-bs" style={{ animationDelay: '1.8s' }} x={98} y={18} width={16} height={16} rx={3} />
    </>
  ),
  'prefix-sum': () => (
    <g>
      {[6, 10, 18, 22, 30, 38, 44].map((h, i) => (
        <rect class="g-fill g-ps" style={{ animationDelay: `${i * 0.25}s` }}
          x={12 + i * 20} y={50 - h} width={14} height={h} rx={2} />
      ))}
    </g>
  ),
  'heap-top-k': () => (
    <g>
      <path class="g-line" d="M80 12 L56 28 M80 12 L104 28 M56 28 L44 44 M56 28 L68 44 M104 28 L92 44 M104 28 L116 44" />
      {[[56, 28], [104, 28], [44, 44], [68, 44], [92, 44], [116, 44]].map(([x, y]) => (
        <circle class="g-node" cx={x} cy={y} r={5} />
      ))}
      <circle class="g-fill g-heap" cx={80} cy={12} r={7} />
    </g>
  ),
  bfs: () => (
    <g>
      {[0, 0.6, 1.2].map((d) => (
        <circle class="g-stroke g-ring" style={{ animationDelay: `${d}s` }} cx={80} cy={28} r={24} />
      ))}
      <circle class="g-fill" cx={80} cy={28} r={5} />
    </g>
  ),

  // ---- system design ----
  cache: () => (
    <g>
      <circle class="g-node" cx={20} cy={28} r={7} />
      <path class="g-line" d="M28 28 H64" />
      <path class="g-line g-dash" d="M96 28 H124" />
      <rect class="g-node g-faint" x={124} y={14} width={28} height={28} rx={6} />
      <rect class="g-fill g-heap" x={64} y={16} width={32} height={24} rx={6} />
      <circle class="g-fill g-shuttle" cx={30} cy={28} r={3} />
    </g>
  ),
  'message-queue': () => (
    <g>
      <circle class="g-node" cx={16} cy={28} r={7} />
      <path class="g-line" d="M40 16 H128 M40 40 H128" />
      {[0, 1, 2, 3].map((i) => (
        <rect class="g-fill g-bs" style={{ animationDelay: `${(3 - i) * 0.4}s` }}
          x={46 + i * 20} y={20} width={14} height={16} rx={3} />
      ))}
      <circle class="g-fill g-heap" cx={144} cy={28} r={7} />
    </g>
  ),
  sharding: () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g class="g-split" style={{ '--dx': `${(i - 1) * 40}px` }}>
          <rect class="g-fill" x={66} y={10} width={28} height={36} rx={6}
            style={{ opacity: 0.45 + i * 0.25 }} />
        </g>
      ))}
    </g>
  ),
  'read-replicas': () => (
    <g>
      <path class="g-line" d="M36 28 L112 10 M36 28 L112 28 M36 28 L112 46" />
      <circle class="g-fill" cx={30} cy={28} r={9} />
      {[10, 28, 46].map((y, i) => (
        <circle class="g-stroke g-heap" style={{ animationDelay: `${i * 0.3}s` }} cx={118} cy={y} r={6} />
      ))}
    </g>
  ),
  cdn: () => (
    <g>
      <circle class="g-line" cx={80} cy={28} r={22} />
      <path class="g-line" d="M58 28 H102 M80 6 C68 18 68 38 80 50 M80 6 C92 18 92 38 80 50" />
      <circle class="g-fill" cx={80} cy={28} r={4} />
      {[[28, 14], [132, 14], [24, 44], [136, 44]].map(([x, y], i) => (
        <circle class="g-fill g-heap" style={{ animationDelay: `${i * 0.35}s` }} cx={x} cy={y} r={5} />
      ))}
    </g>
  ),
  'rate-limiting': () => (
    <g>
      <path class="g-stroke" d="M96 8 V22 M96 34 V48" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle class="g-fill g-bs" style={{ animationDelay: `${i * 0.3}s` }} cx={16 + i * 16} cy={28} r={4} />
      ))}
      {[0, 1].map((i) => (
        <circle class="g-fill g-bs" style={{ animationDelay: `${0.6 + i * 0.9}s` }} cx={116 + i * 20} cy={28} r={4} />
      ))}
    </g>
  ),
};

export default function Glyph({ slug, hue }: { slug: string; hue: number }) {
  const Shape = shapes[slug] ?? extraShapes[slug] ?? moreShapes[slug] ?? newShapes[slug] ?? garchShapes[slug];
  return (
    <svg class="glyph" style={{ '--h': hue }} viewBox="0 0 160 56" aria-hidden="true">
      {Shape ? <Shape /> : <Cells />}
    </svg>
  );
}
