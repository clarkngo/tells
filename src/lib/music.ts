// Background music: off by default, remembered per browser. Pages are full
// reloads, so the playback position is carried across them in sessionStorage.
const ON_KEY = 'tells:v1:music';
const POS_KEY = 'tells:music-pos';
export const MUSIC_CHANGED = 'tells:music-changed';
const VOLUME = 0.25;

let el: HTMLAudioElement | null = null;

export function isMusicOn(): boolean {
  try {
    return localStorage.getItem(ON_KEY) === '1';
  } catch {
    return false;
  }
}

function track(): HTMLAudioElement {
  if (el) return el;
  el = new Audio(`${import.meta.env.BASE_URL}audio/study-music.mp3`);
  el.loop = true;
  el.volume = VOLUME;
  el.preload = 'none';
  try {
    const pos = Number(sessionStorage.getItem(POS_KEY));
    if (pos > 0) el.currentTime = pos;
  } catch {
    /* ignore */
  }
  addEventListener('pagehide', () => {
    try {
      if (el) sessionStorage.setItem(POS_KEY, String(el.currentTime));
    } catch {
      /* ignore */
    }
  });
  return el;
}

// Browsers block audio until the visitor interacts with the page, so if
// playing fails, try again on the first tap or key press.
function play() {
  const a = track();
  a.play().catch(() => {
    const retry = () => {
      if (isMusicOn()) a.play().catch(() => {});
    };
    addEventListener('pointerdown', retry, { once: true });
    addEventListener('keydown', retry, { once: true });
  });
}

export function setMusicOn(on: boolean) {
  try {
    localStorage.setItem(ON_KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
  if (on) play();
  else el?.pause();
  dispatchEvent(new Event(MUSIC_CHANGED));
}

/** Resume music on page load if the visitor turned it on earlier. */
export function initMusic() {
  if (isMusicOn()) play();
}
