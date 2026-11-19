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
};

export default function Glyph({ slug, hue }: { slug: string; hue: number }) {
  const Shape = shapes[slug];
  return (
    <svg class="glyph" style={{ '--h': hue }} viewBox="0 0 160 56" aria-hidden="true">
      {Shape ? <Shape /> : <Cells />}
    </svg>
  );
}
