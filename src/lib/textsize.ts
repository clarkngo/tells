// Drill text size: a scale on the question, choices and explanation, saved in
// this browser. Base.astro applies the saved size before the page paints.
export const SIZES = [
  { scale: 0.92, label: 'Small' },
  { scale: 1, label: 'Medium' },
  { scale: 1.12, label: 'Large' },
  { scale: 1.26, label: 'Extra large' },
];
const KEY = 'tells:v1:textsize';

export function loadSize(): number {
  try {
    const raw = localStorage.getItem(KEY);
    const i = Number(raw);
    return raw !== null && Number.isInteger(i) && i >= 0 && i < SIZES.length ? i : 1;
  } catch {
    return 1;
  }
}

export function applySize(i: number) {
  document.documentElement.style.setProperty('--ts', String(SIZES[i].scale));
  try {
    localStorage.setItem(KEY, String(i));
  } catch {
    /* storage unavailable: the size just isn't remembered */
  }
}
