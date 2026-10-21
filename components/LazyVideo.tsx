"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
  poster?: string;
  /**
   * How far ahead to start loading (in CSS pixels). Default is roughly
   * one full viewport, so the fetch kicks off before the user scrolls there.
   */
  prefetchRootMargin?: string;
  /** Pause when video is this far outside the viewport (saves CPU). */
  pauseRootMargin?: string;
};

/**
 * Lazy-loads an autoplaying muted video with a loading shimmer. The download
 * starts BEFORE the video enters the viewport, so by the time the user
 * scrolls to it there is usually no visible wait. On very slow connections
 * a spinner is shown until the first frame is decodable.
 *
 * Returns a fragment (shimmer + video). Place inside any `relative` parent;
 * both children use `absolute inset-0` so they fill it.
 */
export default function LazyVideo({
  src,
  className,
  poster,
  prefetchRootMargin = "800px",
  pauseRootMargin = "200px",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Begin the fetch early (pre-viewport). Set once, stays true.
  const [shouldLoad, setShouldLoad] = useState(false);
  // Close enough to be playing?
  const [inViewport, setInViewport] = useState(false);
  // At least one frame decoded?
  const [ready, setReady] = useState(false);

  // Pre-fetch observer — one-shot, triggers download well ahead of time
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: prefetchRootMargin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefetchRootMargin]);

  // Playback observer — tighter margin, flips play/pause
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInViewport(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInViewport(e.isIntersecting);
      },
      { rootMargin: pauseRootMargin, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pauseRootMargin]);

  // Drive play / pause from state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inViewport && ready) {
      v.play().catch(() => { /* autoplay may be blocked — ignore */ });
    } else if (!inViewport && !v.paused) {
      v.pause();
    }
  }, [inViewport, ready]);

  return (
    <>
      {/* Shimmer placeholder shown until the first frame is ready */}
      {!ready && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden bg-gradient-to-br from-emerald-900/50 via-emerald-800/40 to-emerald-900/50 z-[1]"
        >
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-7 w-7 rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        poster={poster}
        className={className}
        muted
        loop
        playsInline
        preload={shouldLoad ? "auto" : "none"}
        onCanPlay={() => setReady(true)}
        onLoadedData={() => setReady(true)}
      />
    </>
  );
}
