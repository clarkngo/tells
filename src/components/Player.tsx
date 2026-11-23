import { useEffect, useState } from 'preact/hooks';
import { PROFILE_CHANGED, levelOf, loadProfile, titleOf, xpForLevel, type Profile } from '../lib/profile';
import { SOUND_CHANGED, isMuted, setMuted } from '../lib/sfx';
import { MUSIC_CHANGED, TRACKS, currentTrack, initMusic, isMusicOn, nextTrack, setMusicOn } from '../lib/music';

// Header widget: level ring (fills toward the next level), music toggle, next-track button and a mute toggle.
export default function Player() {
  const [p, setP] = useState<Profile | null>(null);
  const [muted, setM] = useState(false);
  const [music, setMusic] = useState(false);
  const [trackNo, setTrackNo] = useState(0);
  useEffect(() => {
    const r = () => setP(loadProfile());
    const m = () => setM(isMuted());
    const mu = () => {
      setMusic(isMusicOn());
      setTrackNo(currentTrack());
    };
    r();
    m();
    mu();
    initMusic();
    addEventListener(PROFILE_CHANGED, r);
    addEventListener(SOUND_CHANGED, m);
    addEventListener(MUSIC_CHANGED, mu);
    addEventListener('storage', r);
    return () => {
      removeEventListener(PROFILE_CHANGED, r);
      removeEventListener(SOUND_CHANGED, m);
      removeEventListener(MUSIC_CHANGED, mu);
      removeEventListener('storage', r);
    };
  }, []);
  if (!p) return null;

  const lv = levelOf(p.xp);
  const lo = xpForLevel(lv);
  const frac = (p.xp - lo) / (xpForLevel(lv + 1) - lo);
  const C = 2 * Math.PI * 13;

  return (
    <div class="player">
      <span class="lv" key={lv} title={`${titleOf(lv)} · ${p.xp.toLocaleString()} XP`}
        aria-label={`Level ${lv}, ${titleOf(lv)}, ${Math.round(frac * 100)}% to next level`}>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="13" class="lv-bg" />
          <circle cx="16" cy="16" r="13" class="lv-fg" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - frac) }} />
        </svg>
        <b>{lv}</b>
      </span>
      <button type="button" class={`mute music ${music ? 'on' : ''}`} aria-pressed={music}
        aria-label={music ? 'Turn background music off' : 'Turn background music on'}
        title={music ? `Music on: ${TRACKS[trackNo].title}` : 'Music off'} onClick={() => setMusicOn(!music)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 17V5l11-2v12" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round" />
          <circle cx="6.5" cy="17" r="2.5" fill="currentColor" />
          <circle cx="17.5" cy="15" r="2.5" fill="currentColor" />
          {!music && <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />}
        </svg>
      </button>
      {music && TRACKS.length > 1 && (
        <button type="button" class="mute" onClick={nextTrack}
          aria-label={`Switch music to ${TRACKS[(trackNo + 1) % TRACKS.length].title}`}
          title={`Now playing: ${TRACKS[trackNo].title}. Switch to ${TRACKS[(trackNo + 1) % TRACKS.length].title}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l10 7-10 7z" fill="currentColor" />
            <path d="M18 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      )}
      <button type="button" class="mute" aria-pressed={muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        title={muted ? 'Sound off' : 'Sound on'} onClick={() => setMuted(!muted)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          {muted
            ? <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />}
        </svg>
      </button>
    </div>
  );
}
