import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, waitingMisses, type Attempt } from '../lib/storage';

/** Questions whose latest answer was wrong, timed out or peeked: the ones waiting for a retry. */
export const waitingCount = (attempts: Attempt[]) => waitingMisses(attempts).length;

// Header button to the progress map, on every page. A dot shows when misses are
// waiting for a retry.
export default function MapLink({ href, current }: { href: string; current: boolean }) {
  const [waiting, setWaiting] = useState(0);
  useEffect(() => {
    const r = () => setWaiting(waitingCount(loadAttempts()));
    r();
    addEventListener(CHANGED, r);
    return () => removeEventListener(CHANGED, r);
  }, []);
  const label = `Progress map${waiting ? `, ${waiting} misses waiting` : ''}`;
  return (
    <a class="map-link" href={href} aria-label={label} title={label} aria-current={current ? 'page' : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2" class="ml-sun" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-25 12 12)" class="ml-orbit" />
        <circle cx="19.6" cy="8.4" r="1.9" class="ml-planet" />
      </svg>
      <span>Map</span>
      {waiting > 0 && <i class="ml-dot" aria-hidden="true" />}
    </a>
  );
}
