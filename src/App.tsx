import React, { useState, useEffect } from 'react';
import {
  Play,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  Sliders,
  Film,
  ArrowUpRight,
  Printer,
  Eye,
  Volume2,
  VolumeX,
  Mail,
  RotateCw,
} from 'lucide-react';
import HeroVideoCarousel, { CircularPortraitOrbit } from './components/HeroVideoCarousel';
import {
  portfolioVideos,
  SOCIAL_LINKS,
  EXPERIENCE_PILLARS,
  SERVICES,
  WHY_CHOOSE_ME,
  VIDEO_SHOWCASE,
  WORK_PROCESS,
  TECHNICAL_SKILLS,
  VideoShowcaseItem,
  downloadPortfolioDossier,
} from './data/portfolioData';

function extractYouTubeEmbedUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?autoplay=1&rel=0`;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
      if (url.pathname.startsWith('/shorts/')) {
        const shortsId = url.pathname.split('/shorts/')[1]?.split('/')[0];
        if (shortsId) return `https://www.youtube.com/embed/${shortsId}?autoplay=1&rel=0`;
      }
      if (url.pathname.startsWith('/embed/')) {
        return trimmed;
      }
    }
  } catch {
    return null;
  }
  return null;
}

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}

function ResilientImage({ src, alt, className = '', style, fallbackLabel }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#111214] via-[#0B0B0C] to-[#070707] text-center p-6 ${className}`}
        style={style}
      >
        <Film className="w-8 h-8 text-[#FF6A32] mb-2 opacity-80" />
        <span className="text-xs font-medium text-[#D6D6D6]">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      style={style}
    />
  );
}

export default function App() {
  const [activeVideoFilter, setActiveVideoFilter] = useState<
    'all' | 'hacks-edit' | 'car-speed' | 'sports-brand' | 'documentary'
  >('all');
  const [showcaseOrbitDirection, setShowcaseOrbitDirection] = useState<1 | -1>(1);
  const [showcaseHoveredCardId, setShowcaseHoveredCardId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoShowcaseItem | null>(null);
  const [gradeSplit, setGradeSplit] = useState<number>(74);
  const [activeMarkerIdx, setActiveMarkerIdx] = useState<number>(0);
  const [customYoutubeInput, setCustomYoutubeInput] = useState<string>('');
  const [customEmbeds, setCustomEmbeds] = useState<Record<string, string>>({});
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [isMutedPreview, setIsMutedPreview] = useState<boolean>(true);
  const [playheadProgress, setPlayheadProgress] = useState<number>(22);

  // Portfolio Dossier Modal state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [dossierDownloaded, setDossierDownloaded] = useState<boolean>(false);

  // Interactive Project Estimator & Contact Copy state
  const [selectedServiceType, setSelectedServiceType] = useState<string>('Short-Form Editing');
  const [selectedFormatTag, setSelectedFormatTag] = useState<string>('Talking Head');
  const [monthlyVolume, setMonthlyVolume] = useState<'4' | '12' | '24'>('12');
  const [turnaroundSpeed, setTurnaroundSpeed] = useState<'standard' | 'priority'>('standard');
  const [clientName, setClientName] = useState<string>('');
  const [clientChannel, setClientChannel] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
        setIsDossierOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle playhead movement when lightbox preview is active
  useEffect(() => {
    if (!selectedVideo || !isPlayingPreview) return;
    const interval = window.setInterval(() => {
      setPlayheadProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 220);
    return () => window.clearInterval(interval);
  }, [selectedVideo, isPlayingPreview]);

  const filteredVideos =
    activeVideoFilter === 'all'
      ? VIDEO_SHOWCASE
      : VIDEO_SHOWCASE.filter((v) => v.category === activeVideoFilter);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleTriggerDossierDownload = () => {
    downloadPortfolioDossier();
    setDossierDownloaded(true);
    window.setTimeout(() => setDossierDownloaded(false), 3000);
  };

  const handleApplyCustomEmbed = (videoId: string) => {
    const embedUrl = extractYouTubeEmbedUrl(customYoutubeInput);
    if (embedUrl) {
      setCustomEmbeds((prev) => ({ ...prev, [videoId]: embedUrl }));
      setCustomYoutubeInput('');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCarouselProject = (showcaseId: string) => {
    const found = VIDEO_SHOWCASE.find((v) => v.id === showcaseId) || VIDEO_SHOWCASE[0];
    setSelectedVideo(found);
    setActiveMarkerIdx(0);
  };

  const generatedBriefText = `Hi Deergh! I'd love to collaborate on 9:16 video editing for my channel.
• Primary Service: ${selectedServiceType}
• Editing Style / Format: ${selectedFormatTag}
• Volume: ${monthlyVolume} videos / month
• Turnaround: ${turnaroundSpeed === 'priority' ? '24h Express Priority' : '24–48h Standard'}
${clientName ? `• Name: ${clientName}\n` : ''}${clientChannel ? `• Channel / Handle: ${clientChannel}\n` : ''}${projectNotes ? `• Project Details: ${projectNotes}` : ''}`.trim();

  return (
    <div className="min-h-screen bg-[#070707] text-[#D6D6D6] flex flex-col">
      {/* Header: Sticky Studio Top Bar */}
      <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 py-4 no-print">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-6">
          <a
            href="#"
            className="font-display text-xl font-extrabold tracking-tight text-white hover:text-[#FF6A32] transition-colors whitespace-nowrap"
          >
            DEERGH<span className="text-[#FF6A32]">.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#D6D6D6]">
            <a
              href="#services"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Services
            </a>
            <a
              href="#portfolio"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Portfolio
            </a>
            <a
              href="#videos"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Videos
            </a>
            <a
              href="#process"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Work Process
            </a>
            <a
              href="#skills"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="hover:text-[#FF6A32] transition-colors duration-150 whitespace-nowrap"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-[#FF6A32] text-[#070707] rounded-lg hover:bg-[#FF9A62] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              START A PROJECT ↗
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero with Continuous 3D Circular Orbiting 9:16 Portrait Video Cards */}
        <HeroVideoCarousel
          videos={portfolioVideos}
          onSelectProject={handleOpenCarouselProject}
          onStartProject={() => scrollToSection('contact')}
          onViewWork={() => scrollToSection('videos')}
        />

        <div className="section-divider-glow" aria-hidden="true" />

        {/* Experience & Core Formats Strip (Talking Head, Documentary, Speed Ramp, Car Edit, CapCut, HACKS & Sports Brand Page) */}
        <section className="py-12 px-6 bg-[#070707] border-b border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32] mb-1.5">
                  Specialized 9:16 &amp; Cinematic Formats
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Experience Across DIFFERENT NICHES
                </h2>
              </div>
              <span className="text-xs font-mono-tabular text-[#929292]">
                Premiere Pro • After Effects • DaVinci Resolve • CapCut
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXPERIENCE_PILLARS.map((exp) => (
                <div
                  key={exp.code}
                  onClick={() => {
                    setSelectedFormatTag(exp.title);
                    scrollToSection('contact');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedFormatTag(exp.title);
                      scrollToSection('contact');
                    }
                  }}
                  className="group p-5 rounded-2xl bg-[#0B0B0C] border border-white/[0.07] hover:border-[#FF6A32]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FF6A32] mb-2">
                      <span>{exp.code}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-[#FF9A62] transition-colors mb-1.5">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                      {exp.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section (#services) */}
        <section id="services" className="py-20 px-6 bg-[#070707]">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32] mb-2">
                Services &amp; Capabilities
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Services
              </h2>
              <p className="text-sm sm:text-base text-[#929292] mt-3 leading-relaxed">
                Every 9:16 vertical frame is cut with platform algorithms and viewer psychology in
                mind—from talking-head hooks and documentary narratives to high-velocity car speed
                ramps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.index}
                  onClick={() => {
                    setSelectedServiceType(service.title);
                    scrollToSection('contact');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedServiceType(service.title);
                      scrollToSection('contact');
                    }
                  }}
                  className="group bg-[#0B0B0C] border border-white/[0.08] hover:border-[#FF6A32]/45 hover:bg-[#111214] rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-mono-tabular text-sm font-semibold text-[#FF6A32]">
                        {service.index}.
                      </span>
                      <span className="font-mono-tabular text-xs text-[#929292]">
                        {service.turnaround}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2.5 group-hover:text-[#FF9A62] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#929292] leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-2 text-xs text-[#D6D6D6]">
                    <span className="truncate">{service.deliverables}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FF6A32] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Me Strip */}
            <div className="mt-16 bg-[#0B0B0C] border border-white/[0.08] border-l-4 border-l-[#FF6A32] rounded-2xl p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF9A62] mb-1">
                    The Studio Standard
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white">Why Choose Me</h3>
                </div>
                <p className="text-xs font-mono-tabular text-[#929292]">
                  YouTube Shorts · TikTok · Instagram Reels · Snapchat
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {WHY_CHOOSE_ME.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-base font-semibold text-white">
                        <span className="text-[#FF6A32] font-mono-tabular mr-2">✓</span>
                        {item.title}
                      </h4>
                      <span className="text-xs font-mono-tabular text-[#FF9A62] whitespace-nowrap">
                        {item.metric}
                      </span>
                    </div>
                    <p className="text-sm text-[#929292] leading-relaxed pl-5">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider-glow" aria-hidden="true" />

        {/* My Professional Portfolio PDF / Dossier Section (#portfolio) */}
        <section id="portfolio" className="py-20 px-6 bg-[#0B0B0C]">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32] mb-2">
              Credentials &amp; Capabilities Deck
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              My Professional Portfolio
            </h2>

            <div className="bg-[#111214] border border-white/10 hover:border-[#FF6A32]/40 transition-colors rounded-2xl p-8 sm:p-12 max-w-[640px] mx-auto shadow-2xl">
              <div className="text-xs font-mono-tabular text-[#FF9A62] mb-3">
                DEERGH_HADIYAL_PORTFOLIO · STUDIO DOSSIER
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Download My Portfolio
              </h3>
              <p className="text-sm sm:text-base text-[#929292] leading-relaxed mb-8">
                Access my complete professional portfolio showcasing my services, expertise in
                Talking Head, Documentary, Speed Ramp, Car Edits, CapCut &amp; After Effects, and
                contact information. Perfect for sharing with potential clients and collaborators.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleTriggerDossierDownload}
                  className="px-6 py-3.5 text-sm font-semibold bg-[#FF6A32] hover:bg-[#FF9A62] text-[#070707] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {dossierDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Portfolio Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF Portfolio</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="px-6 py-3.5 text-sm font-semibold bg-white/[0.04] text-white border border-white/15 hover:border-[#FF6A32]/50 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#FF6A32]" />
                  <span>Preview &amp; Print PDF</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider-glow" aria-hidden="true" />

        {/* Video Showcase Section (#videos) — Upgraded to 9:16 Portrait Circular Orbit + 9:16 Portrait Showcase Cards */}
        <section
          id="videos"
          className="py-20 px-6 relative overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 50% 28%, rgba(255, 106, 50, 0.14), transparent 46%),
              #070707
            `,
          }}
        >
          <div className="max-w-[1320px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32] mb-2">
                  9:16 Vertical Showreel &amp; Interactive Orbit
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  Video Showcase
                </h2>
                <p className="text-sm sm:text-base text-[#929292] mt-3 leading-relaxed">
                  Explore my 9:16 portrait edits from the{' '}
                  <span className="text-white font-medium">HACKS EDIT</span> channel, Talking Head
                  reels, Speed Ramp Car Edits, Sports Brand Pages, and Vertical Documentaries.
                  Hover over any orbiting 9:16 card to smoothly zoom in (1.22x) while the circular
                  motion continues.
                </p>
              </div>

              {/* Orbit Direction & Category Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={() => setShowcaseOrbitDirection((d) => (d === 1 ? -1 : 1))}
                  className="px-3.5 py-2 text-xs font-mono-tabular font-medium bg-[#0B0B0C] hover:bg-[#111214] text-[#D6D6D6] hover:text-white border border-white/10 hover:border-[#FF6A32]/50 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#FF6A32]" />
                  <span>Reverse Orbit</span>
                </button>

                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0B0B0C] border border-white/10 rounded-xl">
                  {(
                    [
                      { id: 'all', label: 'All 9:16 Reels' },
                      { id: 'hacks-edit', label: 'HACKS EDIT & Talking Head' },
                      { id: 'car-speed', label: 'Car Edit & Speed Ramp' },
                      { id: 'sports-brand', label: 'Sports Brand' },
                      { id: 'documentary', label: 'Documentary' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveVideoFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                        activeVideoFilter === tab.id
                          ? 'bg-[#FF6A32] text-[#070707] font-semibold'
                          : 'text-[#929292] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive 3D Circular Orbiting 9:16 Portrait Stage inside #videos */}
            <div className="mb-16">
              <CircularPortraitOrbit
                videos={portfolioVideos}
                onSelectProject={handleOpenCarouselProject}
                orbitSpeed={0.2}
                direction={showcaseOrbitDirection}
                compact
              />
            </div>

            {/* 2-Column 16:9 Widescreen Detailed Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVideos.map((video) => {
                const activeEmbedUrl = customEmbeds[video.id];
                const isCardHovered = showcaseHoveredCardId === video.id;
                const isCardDimmed =
                  showcaseHoveredCardId !== null && showcaseHoveredCardId !== video.id;

                return (
                  <article
                    key={video.id}
                    onMouseEnter={() => setShowcaseHoveredCardId(video.id)}
                    onMouseLeave={() =>
                      setShowcaseHoveredCardId((prev) => (prev === video.id ? null : prev))
                    }
                    style={{
                      transform: isCardHovered
                        ? 'scale3d(1.03, 1.03, 1) translate3d(0, -4px, 0)'
                        : 'scale3d(1, 1, 1)',
                      transition:
                        'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease, filter 350ms ease, border-color 350ms ease',
                      opacity: isCardDimmed ? 0.65 : 1,
                      zIndex: isCardHovered ? 30 : 1,
                    }}
                    className="group relative rounded-[22px] overflow-hidden bg-[#0B0B0C] border border-white/[0.09] hover:border-[#FF6A32]/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between"
                  >
                    {/* 16:9 Widescreen Video Container */}
                    <div
                      style={{ aspectRatio: '16 / 9' }}
                      className="relative w-full aspect-video bg-black overflow-hidden"
                    >
                      {activeEmbedUrl ? (
                        <iframe
                          src={activeEmbedUrl}
                          title={video.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div
                          onClick={() => {
                            setSelectedVideo(video);
                            setActiveMarkerIdx(0);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedVideo(video);
                              setActiveMarkerIdx(0);
                            }
                          }}
                          className="w-full h-full relative cursor-pointer"
                        >
                          <video
                            src={video.videoSrc}
                            poster={video.thumbnail}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />

                          {/* Top 16:9 Metadata Badge */}
                          <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tabular text-white/90">
                            <span className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 truncate max-w-[75%]">
                              {video.categoryLabel}
                            </span>
                            <span className="bg-[#FF6A32] text-[#070707] font-bold px-2.5 py-0.5 rounded-full">
                              16:9
                            </span>
                          </div>

                          {/* Center Play / Inspect Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#FF6A32]/95 text-[#070707] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                              <Play className="w-6 h-6 fill-[#070707] ml-0.5" />
                            </div>
                          </div>

                          {/* Bottom Hook & Retention Metrics Inside 16:9 Frame */}
                          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-[#FF9A62]">
                            <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                              3s Hook: {video.hookRate}
                            </span>
                            <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                              Retention: {video.avgRetention}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Details Body Below 16:9 Player */}
                    <div
                      onClick={() => {
                        setSelectedVideo(video);
                        setActiveMarkerIdx(0);
                      }}
                      className="p-6 space-y-2.5 cursor-pointer"
                    >
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#FF9A62] transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                        {video.description}
                      </p>
                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#FF6A32]">
                        <span className="inline-flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Inspect Cut Breakdown</span>
                        </span>
                        <span className="font-mono-tabular text-[#D6D6D6]">{video.duration}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Channel CTA Footer */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#929292]">
                Want to see more 9:16 Shorts and Reels? Visit my YouTube channel for the complete
                collection.
              </p>
              <a
                href={SOCIAL_LINKS.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-sm font-semibold bg-[#FF6A32] text-[#070707] rounded-lg hover:bg-[#FF9A62] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Visit YouTube Channel (@deerghhadiyal)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <div className="section-divider-glow" aria-hidden="true" />

        {/* My Work Process & Technical Skills Section (#process & #skills) */}
        <section id="process" className="py-20 px-6 bg-[#0B0B0C]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Cols: My Work Process */}
            <div className="lg:col-span-7">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32] mb-2">
                Post-Production Methodology
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
                My Work Process
              </h2>

              <div className="space-y-6">
                {WORK_PROCESS.map((step) => (
                  <div
                    key={step.index}
                    className="bg-[#111214] border border-white/[0.08] hover:border-[#FF6A32]/35 transition-colors rounded-2xl p-7"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FF6A32] mb-2">
                      <span>
                        {step.index} · {step.label}
                      </span>
                      <span className="text-[#929292]">{step.targetOutcome}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#929292] leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="text-xs font-mono-tabular text-[#D6D6D6] pt-3 border-t border-white/[0.07]">
                      Techniques: {step.keyTechniques}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Technical Skills (#skills) */}
            <div id="skills" className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF9A62] mb-2">
                  Tools &amp; Ecosystem
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
                  Technical Skills
                </h2>

                <div className="space-y-8 border-t border-white/[0.08] pt-6">
                  {TECHNICAL_SKILLS.map((group) => (
                    <div key={group.category} className="border-b border-white/[0.08] pb-6">
                      <h3 className="text-sm font-mono-tabular font-semibold text-[#FF6A32] mb-2">
                        {group.category}
                      </h3>
                      <p className="text-base text-white leading-relaxed">
                        {group.items.map((item, i) => (
                          <React.Fragment key={item}>
                            <span>{item}</span>
                            {i < group.items.length - 1 && (
                              <span className="mx-2.5 text-[#FF6A32]" aria-hidden="true">
                                •
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-[#111214] border border-white/[0.08]">
                <div className="text-xs font-mono-tabular text-[#FF6A32] mb-2">
                  Master Output Standards
                </div>
                <p className="text-sm text-[#D6D6D6] leading-relaxed">
                  H.264 / Apple ProRes 422 HQ · 1080x1920 (9:16 Vertical Portrait) · Rec.709 Color
                  Space · -14 LUFS Normalized Stereo Master
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider-glow" aria-hidden="true" />

        {/* Contact Section (#contact) */}
        <section id="contact" className="py-20 px-6 bg-[#070707]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Cols: Direct Contact & Social Links */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#FF6A32]">
                Direct Channels &amp; Collaborations
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Let&apos;s Create Together
              </h2>
              <p className="text-base text-[#929292] leading-relaxed">
                Ready to transform your video content and grow your audience? Reach out through my
                email or social channels and let&apos;s discuss how I can help take your channel to
                the next level.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: 'email-direct',
                    label: 'Email Address',
                    value: SOCIAL_LINKS.email,
                    href: `mailto:${SOCIAL_LINKS.email}`,
                    copyValue: SOCIAL_LINKS.email,
                  },
                  {
                    id: 'yt-main',
                    label: 'YouTube Channel',
                    value: '@deerghhadiyal',
                    href: SOCIAL_LINKS.youtubeChannel,
                    copyValue: SOCIAL_LINKS.youtubeChannel,
                  },
                  {
                    id: 'yt-hacks',
                    label: 'HACKS EDIT Series',
                    value: 'youtube.com/@deerghhadiyal',
                    href: SOCIAL_LINKS.youtubeChannel,
                    copyValue: SOCIAL_LINKS.youtubeChannel,
                  },
                  {
                    id: 'ig-main',
                    label: 'Instagram',
                    value: '@deergh_hadiyal',
                    href: SOCIAL_LINKS.instagramUrl,
                    copyValue: SOCIAL_LINKS.instagramUrl,
                  },
                  {
                    id: 'ig-profile',
                    label: 'Instagram Profile',
                    value: 'instagram.com/deergh_hadiyal',
                    href: SOCIAL_LINKS.instagramUrl,
                    copyValue: SOCIAL_LINKS.instagramUrl,
                  },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0B0B0C] border border-white/[0.08] hover:border-[#FF6A32]/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-[#929292]">{channel.label}</div>
                      <a
                        href={channel.href}
                        target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={
                          channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'
                        }
                        className="text-sm sm:text-base font-semibold text-white hover:text-[#FF6A32] truncate block transition-colors"
                      >
                        {channel.value}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyText(channel.id, channel.copyValue)}
                        className="px-3 py-1.5 text-xs font-medium text-[#D6D6D6] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        {copiedKey === channel.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#FF6A32]" />
                            <span className="text-[#FF6A32]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={channel.href}
                        target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={
                          channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'
                        }
                        className="p-2 text-[#D6D6D6] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-colors"
                        aria-label={`Open ${channel.label}`}
                      >
                        {channel.href.startsWith('mailto:') ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Interactive Project Brief Builder */}
            <div className="lg:col-span-7 bg-[#0B0B0C] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-mono-tabular text-[#FF6A32]">
                    Interactive Project Planner
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Start a Project With Deergh
                  </h3>
                </div>
                <span className="text-xs font-mono-tabular text-[#929292]">
                  Email &amp; Instagram DM Ready
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono-tabular text-[#929292] mb-2">
                    01. Select Editing Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {EXPERIENCE_PILLARS.map((exp) => (
                      <button
                        key={exp.title}
                        type="button"
                        onClick={() => setSelectedFormatTag(exp.title)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer truncate ${
                          selectedFormatTag === exp.title
                            ? 'bg-[#FF6A32] text-[#070707] border-[#FF6A32] font-semibold'
                            : 'bg-[#111214] text-[#D6D6D6] border-white/10 hover:border-white/25'
                        }`}
                      >
                        {exp.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tabular text-[#929292] mb-2">
                    02. Select Primary Service
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICES.map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => setSelectedServiceType(s.title)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer truncate ${
                          selectedServiceType === s.title
                            ? 'bg-white text-[#070707] border-white font-semibold'
                            : 'bg-[#111214] text-[#D6D6D6] border-white/10 hover:border-white/25'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tabular text-[#929292] mb-2">
                      03. Monthly Video Volume
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { val: '4', label: '4 Videos' },
                          { val: '12', label: '12 Videos' },
                          { val: '24', label: '24+ Videos' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setMonthlyVolume(opt.val)}
                          className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                            monthlyVolume === opt.val
                              ? 'bg-[#FF6A32] text-[#070707] border-[#FF6A32] font-semibold'
                              : 'bg-[#111214] text-[#D6D6D6] border-white/10 hover:border-white/25'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tabular text-[#929292] mb-2">
                      04. Delivery Cadence
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTurnaroundSpeed('standard')}
                        className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          turnaroundSpeed === 'standard'
                            ? 'bg-white text-[#070707] border-white font-semibold'
                            : 'bg-[#111214] text-[#D6D6D6] border-white/10 hover:border-white/25'
                        }`}
                      >
                        24–48h Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setTurnaroundSpeed('priority')}
                        className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          turnaroundSpeed === 'priority'
                            ? 'bg-[#FF6A32] text-[#070707] border-[#FF6A32] font-semibold'
                            : 'bg-[#111214] text-[#D6D6D6] border-white/10 hover:border-white/25'
                        }`}
                      >
                        24h Express
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="creator-name"
                      className="block text-xs font-mono-tabular text-[#929292] mb-1.5"
                    >
                      Your Name / Brand
                    </label>
                    <input
                      id="creator-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Alex Rivera"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#111214] border border-white/10 rounded-lg text-white placeholder:text-[#929292]/50 focus:outline-none focus:border-[#FF6A32]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="creator-channel"
                      className="block text-xs font-mono-tabular text-[#929292] mb-1.5"
                    >
                      Channel Link or Handle
                    </label>
                    <input
                      id="creator-channel"
                      type="text"
                      value={clientChannel}
                      onChange={(e) => setClientChannel(e.target.value)}
                      placeholder="e.g., @alexcreates"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#111214] border border-white/10 rounded-lg text-white placeholder:text-[#929292]/50 focus:outline-none focus:border-[#FF6A32]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="project-notes"
                    className="block text-xs font-mono-tabular text-[#929292] mb-1.5"
                  >
                    Editing Style Reference or Goals And Other Niche You Want
                  </label>
                  <textarea
                    id="project-notes"
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Tell me about your raw footage, talking head / documentary / speed ramp goals..."
                    className="w-full px-3.5 py-2 text-sm bg-[#111214] border border-white/10 rounded-lg text-white placeholder:text-[#929292]/50 focus:outline-none focus:border-[#FF6A32]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopyText('project-brief', generatedBriefText)}
                    className="px-5 py-3 text-sm font-semibold bg-[#FF6A32] text-[#070707] rounded-lg hover:bg-[#FF9A62] transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'project-brief' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Brief Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Project Brief</span>
                      </>
                    )}
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${SOCIAL_LINKS.email}?subject=${encodeURIComponent(
                        `Video Editing Inquiry — ${selectedFormatTag}`
                      )}&body=${encodeURIComponent(generatedBriefText)}`}
                      className="px-5 py-3 text-sm font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <Mail className="w-4 h-4 text-[#FF6A32]" />
                      <span>Email Deergh</span>
                    </a>

                    <a
                      href={SOCIAL_LINKS.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 text-sm font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <span>Instagram DM</span>
                      <ArrowUpRight className="w-4 h-4 text-[#FF6A32]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#070707] border-t border-white/[0.08] py-8 px-6 text-center text-xs text-[#929292] no-print">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Deergh Hadiyal | Video Editor &amp; Content Creator | All rights reserved</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#D6D6D6]">
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="hover:text-[#FF6A32] transition-colors"
            >
              {SOCIAL_LINKS.email}
            </a>
            <a
              href={SOCIAL_LINKS.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6A32] transition-colors"
            >
              YouTube (@deerghhadiyal)
            </a>
            <a
              href={SOCIAL_LINKS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6A32] transition-colors"
            >
              Instagram (@deergh_hadiyal)
            </a>
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal for 9:16 Portrait Video Showcase & Timeline Breakdown */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print"
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
        >
          <div className="w-full max-w-[1040px] bg-[#0B0B0C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#070707]">
              <div className="min-w-0">
                <div className="text-xs font-mono-tabular text-[#FF6A32]">
                  {selectedVideo.categoryLabel} · 16:9 Widescreen · {selectedVideo.fps}
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-[#D6D6D6] hover:text-white bg-white/5 hover:bg-white/15 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close video inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 7 Cols: 16:9 Widescreen Player */}
              <div className="lg:col-span-7 bg-black flex flex-col items-center justify-center p-5">
                <div
                  style={{ aspectRatio: '16 / 9' }}
                  className="relative w-full aspect-video rounded-[18px] overflow-hidden border border-white/15 shadow-2xl bg-[#070707]"
                >
                  {customEmbeds[selectedVideo.id] ? (
                    <iframe
                      src={customEmbeds[selectedVideo.id]}
                      title={selectedVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <video
                        src={selectedVideo.videoSrc}
                        poster={selectedVideo.thumbnail}
                        autoPlay
                        muted={isMutedPreview}
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tabular text-white">
                        <span className="bg-black/75 px-2.5 py-1 rounded-full border border-white/10">
                          16:9 MASTER
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsMutedPreview((m) => !m)}
                          className="p-2 bg-black/75 rounded-full border border-white/10 text-white hover:text-[#FF6A32] cursor-pointer"
                          aria-label={isMutedPreview ? 'Unmute video' : 'Mute video'}
                        >
                          {isMutedPreview ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-[#FF6A32]" />
                          )}
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 pointer-events-none">
                        <div className="text-[10px] font-mono-tabular text-[#FF6A32] mb-0.5">
                          {selectedVideo.timelineMarkers[activeMarkerIdx]?.time} ·{' '}
                          {selectedVideo.timelineMarkers[activeMarkerIdx]?.label}
                        </div>
                        <p className="text-xs text-white leading-snug">
                          {selectedVideo.timelineMarkers[activeMarkerIdx]?.detail}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right 5 Cols: Cut-by-Cut Timeline Breakdown & Live Video Embedder */}
              <div className="lg:col-span-5 p-6 bg-[#0B0B0C] border-l border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono-tabular text-[#FF6A32] mb-1">
                      Frame-Accurate 16:9 Anatomy · Hook: {selectedVideo.hookRate} · Retention:{' '}
                      {selectedVideo.avgRetention}
                    </div>
                    <h4 className="font-display text-lg font-bold text-white">
                      Retention Timeline Markers
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {selectedVideo.timelineMarkers.map((marker, idx) => (
                      <button
                        key={marker.time}
                        type="button"
                        onClick={() => {
                          setActiveMarkerIdx(idx);
                          setPlayheadProgress((idx + 1) * 25);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                          activeMarkerIdx === idx
                            ? 'bg-[#FF6A32]/10 border-[#FF6A32] text-white'
                            : 'bg-[#111214] border-white/10 text-[#D6D6D6] hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FF6A32] mb-1">
                          <span>{marker.time}</span>
                          <span>Cut 0{idx + 1}</span>
                        </div>
                        <div className="text-sm font-semibold text-white mb-1">
                          {marker.label}
                        </div>
                        <div className="text-xs text-[#929292] leading-relaxed">
                          {marker.detail}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Scrubber & Custom YouTube Short URL Loader */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlayingPreview((p) => !p)}
                        className="px-3 py-1.5 text-xs font-mono-tabular font-semibold bg-[#FF6A32] text-[#070707] rounded cursor-pointer whitespace-nowrap"
                      >
                        {isPlayingPreview ? 'Pause Scrubber' : 'Resume Scrubber'}
                      </button>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6A32] transition-all duration-150"
                          style={{ width: `${playheadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono-tabular text-[#929292]">
                        {selectedVideo.duration}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={customYoutubeInput}
                        onChange={(e) => setCustomYoutubeInput(e.target.value)}
                        placeholder="Paste any YouTube Short URL from @deerghhadiyal..."
                        className="flex-1 px-3 py-1.5 text-xs bg-[#111214] border border-white/15 rounded text-white placeholder:text-[#929292]/60 focus:outline-none focus:border-[#FF6A32]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCustomEmbed(selectedVideo.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#FF6A32] text-[#070707] rounded hover:bg-[#FF9A62] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Load 9:16 Short
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href={selectedVideo.defaultYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 text-xs font-semibold bg-[#FF6A32] text-[#070707] rounded-lg hover:bg-[#FF9A62] transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Watch Full Channel on YouTube (@deerghhadiyal)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable / Downloadable Portfolio Dossier Preview Modal */}
      {isDossierOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Deergh Hadiyal Portfolio Dossier"
        >
          <div className="w-full max-w-[860px] bg-[#0B0B0C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto">
            <div className="px-6 py-4 bg-[#070707] border-b border-white/10 flex items-center justify-between gap-4 no-print">
              <div className="text-xs font-mono-tabular text-[#FF6A32]">
                DEERGH_HADIYAL_PORTFOLIO.PDF · PRINT &amp; DOWNLOAD VIEW
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleTriggerDossierDownload}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#FF6A32] hover:bg-[#FF9A62] text-[#070707] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 text-[#D6D6D6] hover:text-white bg-white/5 rounded-lg cursor-pointer"
                  aria-label="Close dossier preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white">DEERGH HADIYAL</h2>
                  <p className="text-base text-[#FF6A32] font-semibold mt-1">
                    Video Editor &amp; Content Creator
                  </p>
                </div>
                <div className="text-xs font-mono-tabular text-[#929292] space-y-1 sm:text-right">
                  <div>Email: {SOCIAL_LINKS.email}</div>
                  <div>YouTube: youtube.com/@deerghhadiyal</div>
                  <div>Instagram: instagram.com/deergh_hadiyal</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#FF6A32] mb-2">
                  Executive Summary
                </h3>
                <p className="text-sm text-[#D6D6D6] leading-relaxed">
                  Professional video editor specializing in 9:16 Talking Head edits, Documentary
                  storytelling, Speed Ramp car edits, CapCut &amp; After Effects hybrid workflows,
                  and high-performing Sports Brand Pages / HACKS EDIT viral content.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#FF6A32] mb-3">
                  Core Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <div
                      key={s.index}
                      className="p-4 rounded-xl bg-[#111214] border border-white/10"
                    >
                      <div className="text-sm font-bold text-white mb-1">
                        {s.index}. {s.title}
                      </div>
                      <p className="text-xs text-[#929292] mb-2">{s.description}</p>
                      <div className="text-[11px] font-mono-tabular text-[#FF9A62]">
                        {s.deliverables}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 text-xs text-[#929292] space-y-2">
                <div>
                  <strong className="text-[#FF6A32]">Software:</strong> Adobe Premiere Pro · DaVinci
                  Resolve · After Effects · CapCut Pro · Adobe Audition
                </div>
                <div>
                  <strong className="text-[#FF6A32]">Specializations:</strong> Talking Head ·
                  Documentary · Speed Ramp · Car Edit · HACKS EDIT &amp; Sports Brand Page ·
                  Short-Form Video (9:16) · Motion Graphics · Color Grading
                </div>
                <div>
                  <strong className="text-[#FF6A32]">Platforms:</strong> YouTube · Instagram ·
                  TikTok · Snapchat · Twitter · LinkedIn
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
