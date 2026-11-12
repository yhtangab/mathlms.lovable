import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { REQUIRED_COVERAGE, createWatchTracker, parseVideoSource } from '@/lib/video-watch';

interface YTPlayer { getCurrentTime(): number; getDuration(): number; getPlayerState(): number; destroy(): void }
interface YTNamespace { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer }
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void; __hlcYouTube?: Promise<YTNamespace> };

function loadYouTube(): Promise<YTNamespace> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  w.__hlcYouTube ??= new Promise(resolve => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => { previous?.(); if (w.YT) resolve(w.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return w.__hlcYouTube;
}

export interface PlayableVideo { id: string; title: string; url: string }

/** Plays a chapter video inside the page and calls onComplete once the student has watched it through. */
export function ChapterVideoPlayer({ video, completed, canEarn, onComplete }: { video: PlayableVideo; completed: boolean; canEarn: boolean; onComplete: (videoId: string) => Promise<void> }) {
  const source = parseVideoSource(video.url);
  const hostRef = useRef<HTMLDivElement>(null);
  const tracker = useRef(createWatchTracker());
  const done = useRef(completed);
  const [watched, setWatched] = useState(0);
  done.current = completed;

  const finish = async (duration: number) => {
    const coverage = tracker.current.coverage(duration);
    setWatched(coverage);
    if (!canEarn || done.current) return;
    if (coverage < REQUIRED_COVERAGE) {
      toast.info(`You watched ${Math.round(coverage * 100)}% of this video. Watch it all the way through, without skipping, to earn the mark.`);
      return;
    }
    done.current = true;
    try { await onComplete(video.id); } catch (e) { done.current = false; toast.error(e instanceof Error ? e.message : 'Could not save your mark'); }
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    tracker.current.reset();
    setWatched(0);
    if (source?.kind !== 'youtube' || !hostRef.current) return;
    const host = hostRef.current;
    const mount = document.createElement('div');
    host.appendChild(mount);
    let player: YTPlayer | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    void loadYouTube().then(YT => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId: source.id, width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
        playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
        events: { onStateChange: (e: { data: number }) => { if (e.data === 0 && player) void finishRef.current(player.getDuration()); } },
      });
      timer = setInterval(() => {
        if (!player?.getPlayerState) return;
        if (player.getPlayerState() === 1) {
          tracker.current.tick(player.getCurrentTime());
          setWatched(tracker.current.coverage(player.getDuration()));
        } else tracker.current.pause();
      }, 500);
    });
    return () => { cancelled = true; clearInterval(timer); player?.destroy(); host.replaceChildren(); };
  }, [source?.kind, source?.kind === 'youtube' ? source.id : video.url]);

  const pct = Math.round(watched * 100);
  return (
    <div>
      {source?.kind === 'youtube' && <div ref={hostRef} className="aspect-video w-full overflow-hidden rounded-xl bg-foreground [&_iframe]:h-full [&_iframe]:w-full" />}
      {source?.kind === 'file' && (
        <video key={video.url} controls controlsList="nodownload" playsInline className="aspect-video w-full rounded-xl bg-foreground" src={source.url}
          onTimeUpdate={e => { const v = e.currentTarget; if (!v.paused && !v.seeking) { tracker.current.tick(v.currentTime); setWatched(tracker.current.coverage(v.duration)); } }}
          onSeeking={() => tracker.current.pause()} onPause={() => tracker.current.pause()}
          onEnded={e => void finish(e.currentTarget.duration)} />
      )}
      {!source && (
        <div className="grid aspect-video w-full place-items-center rounded-xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          <div><p>This link can't be played inside HLC Math.</p><a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-primary underline">Open video <ExternalLink className="h-4 w-4" /></a></div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <h3 className="mr-auto font-semibold">{video.title}</h3>
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Watched · 1 mark earned</span>
        ) : canEarn && source ? (
          <span className="rounded-full bg-muted px-3 py-1 font-semibold text-muted-foreground">Watched {pct}% · finish to earn 1 mark</span>
        ) : null}
      </div>
      {!completed && canEarn && source && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>}
    </div>
  );
}
