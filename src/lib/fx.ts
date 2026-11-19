// Visual effects drawn in a fixed overlay. All decorative (aria-hidden) and
// skipped (or reduced to a fade) when the viewer prefers reduced motion.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function layer(): HTMLElement {
  let el = document.getElementById('fx-layer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.append(el);
  }
  return el;
}

function spawn(cls: string, css: string, life: number, text?: string) {
  const s = document.createElement('span');
  s.className = cls;
  s.style.cssText = css;
  if (text) s.textContent = text;
  layer().append(s);
  setTimeout(() => s.remove(), life);
}

export function centerOf(el: Element | null | undefined) {
  const r = el?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top } : null;
}

export function burst(x: number, y: number, hue: number, n = 14) {
  if (reduced()) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 40 + Math.random() * 70;
    spawn('spark', `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--h:${hue + (Math.random() * 40 - 20)}`, 800);
  }
}

export function floatText(x: number, y: number, text: string, cls = '') {
  spawn(`float-text ${cls}`, `left:${x}px;top:${y}px`, 1100, text);
}

export function confetti(n = 120) {
  if (reduced()) return;
  for (let i = 0; i < n; i++) {
    const dur = 1.6 + Math.random() * 1.2;
    spawn(
      'confetti',
      `left:${Math.random() * 100}vw;--dx:${Math.random() * 160 - 80}px;--rot:${Math.random() * 900 - 450}deg;` +
        `--h:${Math.floor(Math.random() * 360)};animation-duration:${dur}s;animation-delay:${Math.random() * 0.3}s`,
      (dur + 0.4) * 1000,
    );
  }
}

export function shake(el: Element | null | undefined) {
  if (!el || reduced()) return;
  el.classList.remove('shake');
  void (el as HTMLElement).offsetWidth; // restart the animation
  el.classList.add('shake');
}

export function toast(title: string, sub = '') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<strong></strong><span></span>`;
  el.querySelector('strong')!.textContent = title;
  el.querySelector('span')!.textContent = sub;
  document.body.append(el);
  setTimeout(() => el.remove(), 2800);
}
