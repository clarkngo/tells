import { useEffect, useState } from 'preact/hooks';
import { PROFILE_CHANGED, levelOf, loadProfile, titleOf, xpForLevel, type Profile } from '../lib/profile';
import { SOUND_CHANGED, isMuted, setMuted } from '../lib/sfx';

// Header widget: level ring (fills toward the next level) and a mute toggle.
export default function Player() {
  const [p, setP] = useState<Profile | null>(null);
  const [muted, setM] = useState(false);
  useEffect(() => {
    const r = () => setP(loadProfile());
    const m = () => setM(isMuted());
    r();
    m();
    addEventListener(PROFILE_CHANGED, r);
    addEventListener(SOUND_CHANGED, m);
    addEventListener('storage', r);
    return () => {
      removeEventListener(PROFILE_CHANGED, r);
      removeEventListener(SOUND_CHANGED, m);
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
