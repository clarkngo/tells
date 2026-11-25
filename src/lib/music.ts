// Background music: off by default; the visitor's on/off choice and chosen track
// are saved in localStorage. Pages are full reloads, so each track's playback
// position is carried across them in sessionStorage.
const ON_KEY = 'tells:v1:music';
const TRACK_KEY = 'tells:v1:music-track';
const POS_KEY = 'tells:music-pos';
export const MUSIC_CHANGED = 'tells:music-changed';
const VOLUME = 0.25;

export const TRACKS = [
  { id: 'study', file: 'study-music.mp3', title: 'Study music' },
  { id: 'lofi', file: 'lofi-90s.mp3', title: 'Lofi 90s' },
];

let el: HTMLAudioElement | null = null;
let elTrack = -1;

export function isMusicOn(): boolean {
  try {
    return localStorage.getItem(ON_KEY) === '1'; // unset means off
  } catch {
    return false;
  }
}

export function currentTrack(): number {
  try {
    const i = Number(localStorage.getItem(TRACK_KEY));
    return Number.isInteger(i) && i >= 0 && i < TRACKS.length ? i : 0;
  } catch {
    return 0;
  }
}

const posKey = (i: number) => `${POS_KEY}:${TRACKS[i].id}`;

function savePos() {
  try {
    if (el && elTrack >= 0) sessionStorage.setItem(posKey(elTrack), String(el.currentTime));
  } catch {
    /* ignore */
  }
}

let hooked = false;
function audio(): HTMLAudioElement {
  const i = currentTrack();
  if (el && elTrack === i) return el;
  if (el) {
    savePos();
    el.pause();
  }
  el = new Audio(`${import.meta.env.BASE_URL}audio/${TRACKS[i].file}`);
  elTrack = i;
  el.loop = true;
  el.volume = VOLUME;
  el.preload = 'none';
  try {
    const pos = Number(sessionStorage.getItem(posKey(i)));
    if (pos > 0) el.currentTime = pos;
  } catch {
    /* ignore */
  }
  if (!hooked) {
    hooked = true;
    addEventListener('pagehide', savePos);
  }
  return el;
}

// Browsers block audio until the visitor interacts with the page, so if
// playing fails, try again on the first tap or key press.
function play() {
  const a = audio();
  a.play().catch(() => {
    const retry = () => {
      if (isMusicOn() && el === a) a.play().catch(() => {});
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

/** Switches to the next track (and plays it if music is on). */
export function nextTrack() {
  try {
    localStorage.setItem(TRACK_KEY, String((currentTrack() + 1) % TRACKS.length));
  } catch {
    /* ignore */
  }
  if (isMusicOn()) play();
  dispatchEvent(new Event(MUSIC_CHANGED));
}

/** Resume music on page load if the visitor turned it on earlier. */
export function initMusic() {
  if (isMusicOn()) play();
}
