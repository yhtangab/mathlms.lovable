import { describe, expect, it } from 'vitest';
import { REQUIRED_COVERAGE, createWatchTracker, parseVideoSource } from '@/lib/video-watch';

function play(t: ReturnType<typeof createWatchTracker>, from: number, to: number, step = 0.5) {
  for (let p = from; p <= to + 1e-9; p += step) t.tick(p);
}

describe('video completion tracking', () => {
  it('counts a video watched from start to end as complete', () => {
    const t = createWatchTracker();
    play(t, 0, 120);
    expect(t.coverage(120)).toBeGreaterThanOrEqual(REQUIRED_COVERAGE);
  });
  it('does not count seconds skipped by jumping ahead', () => {
    const t = createWatchTracker();
    play(t, 0, 10);
    play(t, 115, 120); // seek near the end
    expect(t.coverage(120)).toBeLessThan(REQUIRED_COVERAGE);
  });
  it('requires 90% of the video to be played', () => {
    expect(REQUIRED_COVERAGE).toBe(0.9);
    const t = createWatchTracker();
    play(t, 0, 100);
    expect(t.coverage(120)).toBeLessThan(REQUIRED_COVERAGE);
  });
  it('counts double-speed playback', () => {
    const t = createWatchTracker();
    play(t, 0, 60, 1);
    expect(t.coverage(60)).toBeGreaterThanOrEqual(REQUIRED_COVERAGE);
  });
});

describe('video links', () => {
  it('accepts YouTube links in their common forms', () => {
    for (const u of ['https://www.youtube.com/watch?v=tTdou0A5kEk', 'https://youtu.be/tTdou0A5kEk', 'https://www.youtube.com/embed/tTdou0A5kEk', 'https://youtube.com/shorts/tTdou0A5kEk'])
      expect(parseVideoSource(u)).toEqual({ kind: 'youtube', id: 'tTdou0A5kEk' });
  });
  it('accepts direct video files and rejects other pages', () => {
    expect(parseVideoSource('https://example.com/lesson.mp4')?.kind).toBe('file');
    expect(parseVideoSource('https://drive.google.com/file/d/abc/view')).toBeNull();
    expect(parseVideoSource('http://www.youtube.com/watch?v=tTdou0A5kEk')).toBeNull();
  });
});
