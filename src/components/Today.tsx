import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts } from '../lib/storage';
import { DAILY_GOAL, PROFILE_CHANGED, dayKey, levelOf, loadProfile, streakOf, titleOf, xpForLevel } from '../lib/profile';

// Home-page panel: streak, today's goal ring, and level progress.
export default function Today() {
  const [, force] = useState(0);
  useEffect(() => {
    const r = () => force((n) => n + 1);
    addEventListener(CHANGED, r);
    addEventListener(PROFILE_CHANGED, r);
    return () => {
      removeEventListener(CHANGED, r);
      removeEventListener(PROFILE_CHANGED, r);
    };
  }, []);

  const p = loadProfile();
  const today = dayKey();
  const done = loadAttempts().filter((a) => dayKey(new Date(a.at)) === today).length;
  const streak = streakOf(p.days);
  const lv = levelOf(p.xp);
  const lo = xpForLevel(lv);
  const hi = xpForLevel(lv + 1);
  const goalFrac = Math.min(1, done / DAILY_GOAL);
  const C = 2 * Math.PI * 26;

  return (
    <div class="today">
      <div class="today-goal">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" class="ring-bg" />
          <circle cx="32" cy="32" r="26" class={`ring-fg ${goalFrac >= 1 ? 'full' : ''}`}
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - goalFrac) }} />
        </svg>
        <div>
          <strong>{Math.min(done, DAILY_GOAL)}/{DAILY_GOAL}</strong>
          <span>{goalFrac >= 1 ? 'Daily goal done' : "Today's goal"}</span>
        </div>
      </div>
      <div class="today-streak">
        <svg viewBox="0 0 24 24" aria-hidden="true" class={streak ? 'lit' : ''}>
          <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3-1-3 0-6 1-9.5z" />
        </svg>
        <div>
          <strong>{streak} {streak === 1 ? 'day' : 'days'}</strong>
          <span>{streak ? 'streak' : 'Start a streak today'}</span>
        </div>
      </div>
      <div class="today-level">
        <div class="today-level-top">
          <strong>Level {lv}</strong>
          <span>{titleOf(lv)}</span>
        </div>
        <div class="xpbar"><div style={{ transform: `scaleX(${(p.xp - lo) / (hi - lo)})` }} /></div>
        <span class="mono muted">{(p.xp - lo).toLocaleString()} / {(hi - lo).toLocaleString()} XP to level {lv + 1}</span>
      </div>
    </div>
  );
}
