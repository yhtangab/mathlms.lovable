/** Share of a video a student must actually play (not skip) before the mark is awarded. */
export const REQUIRED_COVERAGE = 0.9;
/** Largest gap between two position samples still counted as continuous playback (allows up to 2x speed). */
const MAX_STEP_SECONDS = 2.5;

export type VideoSource = { kind: 'youtube'; id: string } | { kind: 'file'; url: string };

/** Recognise links that can be played and tracked inside the app: YouTube or a direct video file. */
export function parseVideoSource(raw: string): VideoSource | null {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const idOk = (id: string | null | undefined): id is string => Boolean(id && /^[\w-]{11}$/.test(id));
  if (host === 'youtu.be') { const id = url.pathname.split('/')[1]; return idOk(id) ? { kind: 'youtube', id } : null; }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (idOk(v)) return { kind: 'youtube', id: v };
    const [, section, id] = url.pathname.split('/');
    return section && ['embed', 'shorts', 'live'].includes(section) && idOk(id) ? { kind: 'youtube', id } : null;
  }
  if (/\.(mp4|webm|ogg|m4v)$/i.test(url.pathname)) return { kind: 'file', url: url.toString() };
  return null;
}

/**
 * Records which whole seconds of a video were actually played. Jumps (seeking ahead)
 * are not counted, so a student cannot skip to the end to earn the mark.
 */
export function createWatchTracker() {
  const watched = new Set<number>();
  let last: number | null = null;
  return {
    /** Feed the current playback position while the video is playing. */
    tick(position: number) {
      if (last !== null) {
        const step = position - last;
        if (step > 0 && step <= MAX_STEP_SECONDS) for (let s = Math.floor(last); s < Math.floor(position); s++) watched.add(s);
      }
      last = position;
    },
    /** Call on pause, buffering or seeking so the next position starts a new stretch. */
    pause() { last = null; },
    coverage(duration: number) { return duration > 0 ? Math.min(1, watched.size / Math.floor(duration)) : 0; },
    reset() { watched.clear(); last = null; },
  };
}
