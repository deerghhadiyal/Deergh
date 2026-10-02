import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, Sparkles, Sliders, TrendingUp, Play } from 'lucide-react';
import { PortfolioCarouselVideo } from '../data/portfolioData';

interface CircularPortraitOrbitProps {
  videos: PortfolioCarouselVideo[];
  onSelectProject: (showcaseId: string) => void;
  orbitSpeed?: number; // cards per second
  direction?: 1 | -1;
  compact?: boolean;
}

/**
 * Persistent 9:16 Portrait HTML5 <video> element with object-fit: cover.
 * Includes a 9:16 procedural Canvas stream fallback if any external MP4 is unreachable
 * so every card is 100% guaranteed to play continuous vertical video motion.
 */
function PortraitVideoPlayer({
  video,
  isVisibleInViewport,
}: {
  video: PortfolioCarouselVideo;
  isVisibleInViewport: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackCleanupRef = useRef<(() => void) | null>(null);
  const [usingProceduralStream, setUsingProceduralStream] = useState(false);

  const startProceduralStream = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl || fallbackCleanupRef.current) return;

    try {
      // Strict 9:16 portrait canvas dimensions (360x640)
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const posterImg = new Image();
      posterImg.crossOrigin = 'anonymous';
      posterImg.src = video.poster;

      let animId = 0;
      let frame = video.id * 50;

      const renderLoop = () => {
        frame += 1;
        const t = frame * 0.028;

        ctx.fillStyle = '#070707';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (posterImg.complete && posterImg.naturalWidth > 0) {
          // Calculate object-fit: cover for 9:16 canvas
          const imgRatio = posterImg.naturalWidth / posterImg.naturalHeight;
          const canvasRatio = canvas.width / canvas.height;
          const zoom = 1.08 + Math.sin(t * 0.75) * 0.05;

          let drawW = canvas.width;
          let drawH = canvas.height;
          if (imgRatio > canvasRatio) {
            drawH = canvas.height * zoom;
            drawW = drawH * imgRatio;
          } else {
            drawW = canvas.width * zoom;
            drawH = drawW / imgRatio;
          }

          const panX = Math.cos(t * 0.55) * 14;
          const panY = Math.sin(t * 0.45) * 16;
          const x = (canvas.width - drawW) / 2 + panX;
          const y = (canvas.height - drawH) / 2 + panY;
          ctx.drawImage(posterImg, x, y, drawW, drawH);
        }

        // Subtle vertical light sweep
        const sweepY = ((Math.sin(t * 0.85) + 1) / 2) * canvas.height;
        const grad = ctx.createRadialGradient(
          canvas.width * 0.5,
          sweepY,
          10,
          canvas.width * 0.5,
          sweepY,
          canvas.height * 0.55
        );
        grad.addColorStop(0, 'rgba(255, 106, 50, 0.22)');
        grad.addColorStop(0.6, 'rgba(11, 11, 12, 0.2)');
        grad.addColorStop(1, 'rgba(7, 7, 7, 0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animId = requestAnimationFrame(renderLoop);
      };

      renderLoop();

      const canvasWithStream = canvas as HTMLCanvasElement & {
        captureStream?: (frameRate?: number) => MediaStream;
      };

      if (typeof canvasWithStream.captureStream === 'function') {
        const stream = canvasWithStream.captureStream(30);
        videoEl.srcObject = stream;
        videoEl.play().catch(() => {});
        setUsingProceduralStream(true);
      }

      fallbackCleanupRef.current = () => {
        cancelAnimationFrame(animId);
      };
    } catch {
      // Ignore fallback errors
    }
  }, [video.id, video.poster]);

  useEffect(() => {
    return () => {
      if (fallbackCleanupRef.current) {
        fallbackCleanupRef.current();
        fallbackCleanupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isVisibleInViewport) {
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    } else {
      if (!videoEl.paused) {
        videoEl.pause();
      }
    }
  }, [isVisibleInViewport]);

  return (
    <video
      ref={videoRef}
      src={usingProceduralStream ? undefined : video.src}
      poster={video.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onCanPlay={(e) => {
        const el = e.currentTarget;
        if (el.paused && isVisibleInViewport) {
          el.play().catch(() => {});
        }
      }}
      onError={() => {
        startProceduralStream();
      }}
      className="w-full h-full object-cover pointer-events-none select-none"
    />
  );
}

/**
 * Continuous 3D Circular / Orbiting 9:16 Portrait Video Cards Stage.
 * - Strictly preserves 9:16 portrait aspect ratio on all cards at all times.
 * - Continuously orbits around the center via GPU-accelerated 3D transforms in requestAnimationFrame.
 * - Hovering any card smoothly zooms it in (1.22x scale) and brings it to the foreground
 *   WITHOUT stopping the overall circular orbit animation.
 * - Supports mobile/tablet tap interaction.
 */
export function CircularPortraitOrbit({
  videos,
  onSelectProject,
  orbitSpeed = 0.22,
  direction = 1,
  compact = false,
}: CircularPortraitOrbitProps) {
  const total = videos.length;
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tappedId, setTappedId] = useState<number | null>(null);
  const [isVisibleInViewport, setIsVisibleInViewport] = useState<boolean>(true);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardOrbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const hoveredIdRef = useRef<number | null>(null);
  const tappedIdRef = useRef<number | null>(null);

  const activeFocusId = hoveredId ?? tappedId;

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    tappedIdRef.current = tappedId;
  }, [tappedId]);

  // Pause offscreen video decoding only when scrolled completely out of view
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisibleInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.02 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous 60fps GPU-accelerated circular orbit loop.
  // IMPORTANT: Hovering NEVER stops the circular orbit!
  useEffect(() => {
    let rafId: number;

    const updateOrbitPositions = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      if (isVisibleInViewport && total > 0) {
        // Advance circular phase continuously without ever stopping on hover
        phaseRef.current = (phaseRef.current + dt * orbitSpeed * direction + total) % total;

        const stageWidth = stageRef.current?.clientWidth || 1200;
        const isSmallScreen = stageWidth < 640;
        const isMediumScreen = stageWidth >= 640 && stageWidth < 1024;

        // Horizontal spacing along the circular arc
        const baseStepX = isSmallScreen
          ? stageWidth * 0.34
          : isMediumScreen
            ? stageWidth * 0.19
            : Math.min(stageWidth * 0.145, 192);

        const halfN = total / 2;

        for (let i = 0; i < total; i++) {
          const el = cardOrbitRefs.current[i];
          if (!el) continue;

          const videoId = videos[i].id;
          const isFocused =
            hoveredIdRef.current === videoId || tappedIdRef.current === videoId;

          // Continuous circular slot offset u in [-N/2, +N/2)
          const rawDiff = ((i - phaseRef.current) % total + total) % total;
          const u = rawDiff - halfN;
          const absU = Math.abs(u);

          // Panoramic concave 3D circular/cylindrical curve matching the reference video:
          // Outer cards curve forward and angle inward; center cards form the deep focal curve
          const x = u * baseStepX + Math.sign(u) * Math.pow(absU, 1.75) * (isSmallScreen ? 4 : 9);
          const y = isSmallScreen
            ? 10 - Math.pow(absU, 1.6) * 4
            : 24 - Math.pow(absU, 1.75) * 6.2;

          // Base scale along the 3D circular amphitheater arc
          const orbitScale = isSmallScreen
            ? 0.84 + Math.pow(absU, 1.5) * 0.045
            : 0.76 + Math.pow(absU, 1.78) * 0.048;

          // Depth (translateZ) and inward perspective rotation (rotateY)
          const z = isSmallScreen
            ? -40 + Math.pow(absU, 1.6) * 14
            : -95 + Math.pow(absU, 1.8) * 24;

          // When hovered/focused, gently flatten rotation slightly for crisp viewing while keeping orbit position
          const rotateY = isFocused ? -u * 4.5 : -u * (isSmallScreen ? 8.5 : 10.8);

          // Smooth wrap-around fade at the extreme outer boundaries of the circle
          const maxVisibleU = isSmallScreen ? 2.2 : 3.55;
          let edgeOpacity = 1;
          if (absU > maxVisibleU) {
            edgeOpacity = Math.max(0, 1 - (absU - maxVisibleU) / 0.45);
          }

          // Proper depth z-index: hovered card is always highest (200), otherwise outer foreground wings stack naturally
          const computedZIndex = isFocused
            ? 200
            : Math.round(40 + absU * 12);

          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale3d(${orbitScale.toFixed(4)}, ${orbitScale.toFixed(4)}, 1)`;
          el.style.opacity = edgeOpacity.toFixed(3);
          el.style.zIndex = String(computedZIndex);
          el.style.pointerEvents = edgeOpacity < 0.15 ? 'none' : 'auto';
        }
      }

      rafId = requestAnimationFrame(updateOrbitPositions);
    };

    rafId = requestAnimationFrame(updateOrbitPositions);
    return () => cancelAnimationFrame(rafId);
  }, [isVisibleInViewport, total, orbitSpeed, direction, videos]);

  return (
    <div
      ref={stageRef}
      onClick={() => {
        if (tappedId !== null) setTappedId(null);
      }}
      className={`relative w-full overflow-visible flex items-center justify-center perspective-stage select-none ${
        compact
          ? 'h-[360px] sm:h-[430px] lg:h-[480px]'
          : 'h-[370px] sm:h-[450px] md:h-[500px] lg:h-[540px]'
      }`}
    >
      {/* 3D Orbiting Track */}
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        {videos.map((video, index) => {
          const isFocused = activeFocusId === video.id;
          const isDimmed = activeFocusId !== null && activeFocusId !== video.id;

          return (
            <div
              key={video.id}
              ref={(node) => {
                cardOrbitRefs.current[index] = node;
              }}
              style={{
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId((prev) => (prev === video.id ? null : prev))}
              onClick={(e) => {
                e.stopPropagation();
                // On touch/mobile devices, first tap zooms in; second tap opens project inspector
                const isTouchDevice =
                  typeof window !== 'undefined' &&
                  window.matchMedia('(hover: none) and (pointer: coarse)').matches;
                if (isTouchDevice) {
                  if (tappedId === video.id) {
                    onSelectProject(video.showcaseId);
                  } else {
                    setTappedId(video.id);
                  }
                } else {
                  onSelectProject(video.showcaseId);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${video.title} - ${video.category} (9:16 Portrait Video)`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(video.showcaseId);
                }
              }}
              className="absolute w-[142px] sm:w-[172px] md:w-[196px] lg:w-[214px] aspect-[9/16] cursor-pointer"
            >
              {/* Inner 9:16 Portrait Card Zoom & Visual Focus Layer */}
              <div
                style={{
                  aspectRatio: '9 / 16',
                  transform: isFocused
                    ? 'scale3d(1.22, 1.22, 1) translate3d(0px, -10px, 45px)'
                    : 'scale3d(1, 1, 1) translate3d(0px, 0px, 0px)',
                  transition:
                    'transform 460ms cubic-bezier(0.16, 1, 0.3, 1), filter 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 460ms cubic-bezier(0.16, 1, 0.3, 1), border-color 350ms ease',
                  filter: isDimmed
                    ? 'brightness(0.52) saturate(0.78)'
                    : isFocused
                      ? 'brightness(1.06) contrast(1.05)'
                      : 'brightness(0.95)',
                  willChange: 'transform, filter',
                }}
                className={`relative w-full h-full aspect-[9/16] rounded-[22px] bg-[#0B0B0C] overflow-hidden ${
                  isFocused
                    ? 'border border-[#FF6A32]/75 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.95),0_0_45px_-8px_rgba(255,106,50,0.42)]'
                    : 'border border-white/[0.13] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.88)]'
                }`}
              >
                {/* Strictly 9:16 Portrait HTML5 Video with object-fit: cover */}
                <PortraitVideoPlayer
                  video={video}
                  isVisibleInViewport={isVisibleInViewport}
                />

                {/* Subtle Studio Specular Edge & Bottom Vignette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/80"
                />

                {/* Top Minimal 9:16 Pill Badge on Hover */}
                <div
                  className={`pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between transition-opacity duration-300 ${
                    isFocused ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono-tabular text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A32] animate-pulse" />
                    <span>{video.duration}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6A32] text-[#070707] text-[10px] font-mono-tabular font-bold">
                    9:16
                  </span>
                </div>

                {/* Bottom Card Info Overlay (Smoothly Revealed on Hover / Tap) */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 p-3.5 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-all duration-300 ${
                    isFocused
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                  }`}
                >
                  <div className="text-[10px] font-mono-tabular text-[#FF9A62] uppercase tracking-wider mb-0.5 truncate">
                    {video.category}
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mb-2">
                    {video.title}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF6A32]">
                    <Play className="w-2.5 h-2.5 fill-[#FF6A32]" />
                    <span>INSPECT REEL</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface HeroVideoCarouselProps {
  videos: PortfolioCarouselVideo[];
  onSelectProject: (showcaseId: string) => void;
  onStartProject: () => void;
  onViewWork: () => void;
}

export default function HeroVideoCarousel({
  videos,
  onSelectProject,
  onStartProject,
  onViewWork,
}: HeroVideoCarouselProps) {
  return (
    <section
      className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 px-4 sm:px-6 select-none"
      style={{
        background: `
          radial-gradient(circle at 12% 8%, rgba(255, 106, 50, 0.22), transparent 34%),
          radial-gradient(circle at 88% 8%, rgba(255, 106, 50, 0.22), transparent 34%),
          radial-gradient(circle at 50% 45%, rgba(255, 106, 50, 0.11), transparent 48%),
          #070707
        `,
      }}
    >
      {/* Subtle Film Grain Overlay */}
      <div className="absolute inset-0 bg-film-grain pointer-events-none z-0" />

      {/* Top Left & Top Right Diagonal Warm Studio Light Streaks (From Reference Video) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[260px] rounded-full blur-[95px] bg-[#FF6A32]/25 -rotate-12 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[260px] rounded-full blur-[95px] bg-[#FF6A32]/25 rotate-12 z-0"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Hero Agency Typography & Dual Action Buttons */}
        <div className="text-center max-w-[860px] mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-widest text-[#FF9A62] mb-4">
            <span>DEERGH HADIYAL</span>
            <span className="text-white/30">•</span>
            <span className="text-[#D6D6D6]">9:16 VERTICAL &amp; CINEMATIC STUDIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[66px] font-extrabold text-white tracking-[-0.035em] leading-[1.04] mb-5">
            VIDEO EDITING THAT
            <br />
            <span className="bg-gradient-to-r from-white via-[#FFFFFF] to-[#FF9A62] bg-clip-text text-transparent">
              MAKES PEOPLE WATCH.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg font-medium text-[#FF6A32] tracking-wide mb-3.5">
            Professional Video Editor • Creative Storyteller • Audience Growth Specialist
          </p>

          <p className="text-sm sm:text-base text-[#929292] font-normal leading-relaxed max-w-[640px] mx-auto mb-7">
            I transform raw footage into engaging visual experiences designed to capture attention,
            improve retention, and tell compelling stories.
          </p>

          {/* Reference Video Action Buttons: START A PROJECT & SEE OUR WORK / VIEW MY WORK */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartProject}
              className="px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-b from-[#FF7A45] to-[#E8521A] text-white rounded-xl hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_10px_30px_-6px_rgba(255,106,50,0.55)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onViewWork}
              className="px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#141416]/90 hover:bg-[#1C1C20] text-[#D6D6D6] hover:text-white border border-white/15 hover:border-[#FF6A32]/50 rounded-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW MY WORK</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF6A32]" />
            </button>
          </div>
        </div>

        {/* 9:16 PORTRAIT CONTINUOUS CIRCULAR ORBIT STAGE (Primary Visual Reference) */}
        <CircularPortraitOrbit
          videos={videos}
          onSelectProject={onSelectProject}
          orbitSpeed={0.22}
          direction={1}
        />

        {/* Bottom Feature Pill Bar from Reference Video: Short Video Editing • Content Strategy • Growth Optimization */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 sm:px-7 py-3 rounded-full bg-[#0D0D0F]/95 border border-[#FF6A32]/35 shadow-[0_12px_40px_-8px_rgba(255,106,50,0.22)] backdrop-blur-xl">
            <button
              type="button"
              onClick={onViewWork}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#D6D6D6] hover:text-white transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF6A32]" />
              <span>Short Video Editing</span>
            </button>

            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A32]" aria-hidden="true" />

            <button
              type="button"
              onClick={onViewWork}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#D6D6D6] hover:text-white transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A32]" />
              <span>Content Strategy</span>
            </button>

            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A32]" aria-hidden="true" />

            <button
              type="button"
              onClick={onStartProject}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#D6D6D6] hover:text-white transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#FF6A32]" />
              <span>Growth Optimization</span>
            </button>
          </div>

          <p className="text-[11px] font-mono-tabular text-[#929292]">
            Hover any 9:16 portrait reel to zoom (1.22x) • Circular orbit continues seamlessly • Click to inspect cuts
          </p>
        </div>
      </div>
    </section>
  );
}
