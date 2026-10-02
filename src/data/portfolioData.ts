import heroEditingSuiteImg from '../assets/images/hero_editing_suite_1790528737920.jpg';
import showcaseHacksEditImg from '../assets/images/showcase_hacks_edit_1790528752374.jpg';
import showcaseViralRetentionImg from '../assets/images/showcase_viral_retention_1790528765326.jpg';
import showcaseColorGradeImg from '../assets/images/showcase_color_grade_1790528777648.jpg';
import reelTalkingHeadImg from '../assets/images/reel_talking_head_creator_1790941012242.jpg';
import reelSportsRunnerImg from '../assets/images/reel_sports_runner_action_1790941029854.jpg';
import reelCarSpeedRampImg from '../assets/images/reel_car_speed_ramp_1790941042144.jpg';
import reelDocumentaryImg from '../assets/images/reel_documentary_cinematic_1790941054742.jpg';

export interface PortfolioCarouselVideo {
  id: number;
  title: string;
  category: string;
  src: string;
  poster: string;
  duration: string;
  retentionMetric: string;
  software: string;
  description: string;
  showcaseId: string;
}

/**
 * 9:16 Portrait Video Cards for the Continuous Circular/Orbiting 3D Stage.
 * Every card strictly renders in a 9:16 portrait aspect ratio with object-fit: cover.
 */
export const portfolioVideos: PortfolioCarouselVideo[] = [
  {
    id: 1,
    title: 'Studio Talking Head Hook',
    category: 'Talking Head • Reels',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: reelTalkingHeadImg,
    duration: '00:58',
    retentionMetric: '94.2% Retention',
    software: 'Premiere Pro • After Effects • CapCut',
    description:
      'High-retention 9:16 talking-head studio edit featuring 3-second visual hooks, dynamic captions, and layered SFX.',
    showcaseId: 'hacks-edit-latest',
  },
  {
    id: 2,
    title: 'Lifestyle Creator Viral Cut',
    category: 'Short Video Editing',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: showcaseHacksEditImg,
    duration: '00:48',
    retentionMetric: '92.8% Watch Time',
    software: 'CapCut Pro • Premiere Pro',
    description:
      'Fast-paced vertical creator storytelling with seamless J-cuts, kinetic typography, and retention b-roll.',
    showcaseId: 'hacks-edit-latest',
  },
  {
    id: 3,
    title: 'Product & Brand Hook Reel',
    category: 'Content Strategy',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: reelCarSpeedRampImg,
    duration: '00:42',
    retentionMetric: '96.0% Beat Sync',
    software: 'After Effects • DaVinci Resolve • CapCut',
    description:
      'Precision optical-flow speed ramping, bass-synced impact cuts, motion blur compositing, and automotive color grading.',
    showcaseId: 'car-speed-ramp',
  },
  {
    id: 4,
    title: 'Golden Hour Athlete Action',
    category: 'Sports Brand • Hacks',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    poster: reelSportsRunnerImg,
    duration: '00:45',
    retentionMetric: '91.8% Watch-Through',
    software: 'Premiere Pro • After Effects • Audition',
    description:
      'High-adrenaline 9:16 sports brand page reel engineered with whip transitions, riser sound design, and kinetic callouts.',
    showcaseId: 'sports-brand-edit',
  },
  {
    id: 5,
    title: 'Misty Forest Documentary',
    category: 'Documentary • Grade',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: reelDocumentaryImg,
    duration: '01:15',
    retentionMetric: '89.6% Avg View',
    software: 'DaVinci Resolve • Premiere Pro • Audition',
    description:
      'Atmospheric vertical documentary pacing with archival overlays, 3D camera projection, emotional soundscapes, and filmic grading.',
    showcaseId: 'documentary-story',
  },
  {
    id: 6,
    title: 'Neon Studio Creator Cut',
    category: 'Talking Head • CapCut',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    poster: heroEditingSuiteImg,
    duration: '00:52',
    retentionMetric: '93.4% 3s Hold',
    software: 'CapCut Pro • After Effects',
    description:
      'Clean creator talking-head cut eliminating dead air with J/L cuts, custom motion graphics callouts, and retention b-roll.',
    showcaseId: 'hacks-edit-latest',
  },
  {
    id: 7,
    title: 'Executive Authority Short',
    category: 'Growth Optimization',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    poster: showcaseViralRetentionImg,
    duration: '00:55',
    retentionMetric: '95.1% Completion',
    software: 'Premiere Pro • DaVinci Resolve',
    description:
      'Founder & executive talking-head vertical reel engineered to build brand trust and maximize organic subscriber conversion.',
    showcaseId: 'documentary-story',
  },
  {
    id: 8,
    title: 'Midnight Tunnel Car Edit',
    category: 'Car Edit • Speed Ramp',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: showcaseColorGradeImg,
    duration: '00:38',
    retentionMetric: '97.2% Replay Rate',
    software: 'After Effects • CapCut Pro • DaVinci Resolve',
    description:
      'Seamless loop 9:16 automotive speed-ramp edit with custom turbo foley, halation glow, and frame-accurate beat locks.',
    showcaseId: 'car-speed-ramp',
  },
];

export interface ServiceItem {
  index: string;
  title: string;
  description: string;
  deliverables: string;
  turnaround: string;
}

export interface FeatureReason {
  title: string;
  description: string;
  metric: string;
}

export interface TimelineCutMarker {
  time: string;
  label: string;
  detail: string;
}

export interface VideoShowcaseItem {
  id: string;
  category: 'hacks-edit' | 'car-speed' | 'sports-brand' | 'documentary';
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  videoSrc: string;
  aspect: '16:9';
  featuredSpan?: boolean;
  duration: string;
  fps: string;
  resolution: string;
  avgRetention: string;
  hookRate: string;
  softwareUsed: string;
  defaultYoutubeUrl: string;
  colorFilterRaw: string;
  colorFilterGraded: string;
  timelineMarkers: TimelineCutMarker[];
}

export interface WorkProcessItem {
  index: string;
  label: string;
  title: string;
  description: string;
  keyTechniques: string;
  targetOutcome: string;
}

export const HERO_IMAGE = reelTalkingHeadImg;

export const SOCIAL_LINKS = {
  youtubeChannel: 'https://youtube.com/@deerghhadiyal',
  youtubeHandle: '@deerghhadiyal',
  hacksEditLabel: 'youtube.com/@deerghhadiyal',
  instagramUrl: 'https://www.instagram.com/deergh_hadiyal/',
  instagramHandle: '@deergh_hadiyal',
  instagramClean: 'instagram.com/deergh_hadiyal',
  email: 'deerghhadiyal@gmail.com',
};

export const EXPERIENCE_PILLARS = [
  {
    code: '01',
    title: 'Talking Head',
    detail: 'Zero-dead-air dialogue cuts, kinetic captions, and b-roll retention callouts.',
  },
  {
    code: '02',
    title: 'Documentary',
    detail: 'Cinematic narrative pacing, spatial sound design, and archival motion graphics.',
  },
  {
    code: '03',
    title: 'Speed Ramp',
    detail: 'Optical-flow velocity curves, frame-blended whip pans, and beat-locked transitions.',
  },
  {
    code: '04',
    title: 'Car Edit',
    detail: 'High-impact automotive reels, engine audio layering, and rolling LUT color grades.',
  },
  {
    code: '05',
    title: 'YT VIDEO & LONG FORM CONTENT',
    detail: 'Engaging long-form YouTube videos crafted with cinematic storytelling, smooth transitions, and dynamic visuals.',
  },
  {
    code: '06',
    title: 'GAMING EDIT',
    detail: 'Specialized in high-energy Minecraft and GTA video editing with cinematic cuts, effects, and engaging storytelling.',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'Gaming Video Editing',
    description:
      'High-energy editing for Minecraft, GTA, and gameplay content with cinematic cuts, memes, effects, and engaging storytelling.',
    deliverables: 'Full YouTube Video, Highlights, Captions, SFX, Motion Graphics',
    turnaround: '2–4 Days',
  },
  {
    index: '02',
    title: 'Cinematic Video Editing',
    description:
      'Story-driven edits with smooth pacing, cinematic transitions, color grading, sound design, and impactful visual moments.',
    deliverables: 'Cinematic Edit, Color Grade, Transitions, Sound Design',
    turnaround: '2–5 Days',
  },
  {
    index: '03',
    title: 'Motion & Graphics',
    description:
      'Custom animations, speed-ramp transitions, and visual effects that elevate your talking-head, documentary, and sports brand content.',
    deliverables: 'After Effects Compositing · Kinetic Typography · Visual Callouts',
    turnaround: '4K 60fps Render',
  },
  {
    index: '04',
    title: 'Reels & Sound',
    description:
      'Fast-paced short-form content designed to capture attention quickly with punchy cuts, captions, effects, and trending editing styles.',
    deliverables: 'YouTube Shorts, Instagram Reels, Captions, SFX, Transitions',
    turnaround: '1-2 Days',
  },
  {
    index: '05',
    title: 'Color Grading & Sound Design',
    description:
      'Professional visual and audio enhancement to give your videos a polished, cinematic, and immersive feel.',
    deliverables: 'Color Correction, Color Grading, SFX, Audio Mixing, Music Sync',
    turnaround: '1–3 Days',
  },
  {
    index: '06',
    title: 'YouTube Content Editing',
    description:
      'Complete YouTube editing focused on storytelling, viewer retention, pacing, B-roll, captions, memes, and engaging visual effects.',
    deliverables: 'Long-Form Video, B-Roll, Captions, SFX, Motion Graphics, Thumbnail-ready Frames',
    turnaround: 'AS PER PROJECT SCOPE',
  },
];

export const WHY_CHOOSE_ME: FeatureReason[] = [
  {
    title: 'Retention-Focused Editing',
    description: 'I edit around pacing, hooks, and visual storytelling to keep viewers engaged from the first second.',
    metric: 'High-Retention Approach',
  },
  {
    title: 'Gaming Specialist',
    description: 'Specialized in Minecraft & GTA content with energetic cuts, cinematic moments, memes, SFX, and gameplay storytelling.',
    metric: 'Minecraft + GTA',
  },
  {
    title: 'Cinematic Visuals',
    description: 'I combine motion graphics, transitions, color grading, and sound design to create polished visuals.',
    metric: '4K-Ready Workflow',
  },
  {
    title: 'Fast Turnaround',
    description: 'Efficient editing workflow designed to deliver quality content without unnecessary delays.',
    metric: '2–7 Day Delivery',
  },
  {
    title: 'Detail-Oriented Editing',
    description: 'Every cut, sound effect, transition, caption, and visual element is carefully timed to the content.',
    metric: 'Frame-by-Frame Precision',
  },
  {
    title: 'Creator-Focused Workflow',
    description: 'I adapt my editing style to your brand, audience, and content goals instead of using a one-size-fits-all template.',
    metric: '100% Custom Edits',
  },
];

export const VIDEO_SHOWCASE: VideoShowcaseItem[] = [
  {
    id: 'hacks-edit-latest',
    category: 'hacks-edit',
    categoryLabel: 'HACKS EDIT • Talking Head',
    title: 'Latest Upload — High-Velocity Talking Head & Viral Hook',
    subtitle: 'Check out my most recent 16:9 widescreen edit from the HACKS EDIT series',
    description:
      'Fast-paced 16:9 talking-head and entertainment editing combining frame-accurate speed ramps, kinetic captioning, layered whoosh/impact sound design, and zero-dead-air storytelling.',
    thumbnail: showcaseHacksEditImg,
    videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspect: '16:9',
    featuredSpan: true,
    duration: '00:58',
    fps: '60 fps',
    resolution: '3840x2160 4K',
    avgRetention: '94.2%',
    hookRate: '88.5%',
    softwareUsed: 'Premiere Pro · After Effects · CapCut',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.55) contrast(0.85) brightness(0.95)',
    colorFilterGraded: 'saturate(1.22) contrast(1.14) brightness(1.02)',
    timelineMarkers: [
      {
        time: '00:00–00:03',
        label: 'Visual + Sonic Hook',
        detail: 'Immediate 16:9 motion cut paired with sub-bass drop and central kinetic title.',
      },
      {
        time: '00:04–00:19',
        label: 'Talking-Head Pattern Interrupts',
        detail: 'Visual angle or b-roll state change every 1.8 seconds to reset viewer attention.',
      },
      {
        time: '00:20–00:45',
        label: 'Escalating Tension & SFX',
        detail: 'Layered riser audio, dynamic zoom tracking, and custom motion callouts.',
      },
      {
        time: '00:46–00:58',
        label: 'Seamless Loop Payoff',
        detail: 'Resolution cut engineered to flow directly back into frame 00:00 for replay boost.',
      },
    ],
  },
  {
    id: 'car-speed-ramp',
    category: 'car-speed',
    categoryLabel: 'Car Edit • Speed Ramp',
    title: 'Featured Work — Automotive 16:9 Speed Ramp & Beat Sync',
    subtitle: 'High-impact widescreen car edit with optical flow speed ramps and LUT grading',
    description:
      'Engineered with razor-sharp velocity curves in After Effects and CapCut, syncing widescreen automotive shots to heavy percussive stems with custom engine audio sweetening and halation glow.',
    thumbnail: showcaseColorGradeImg,
    videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    aspect: '16:9',
    featuredSpan: false,
    duration: '00:42',
    fps: '60 fps',
    resolution: '3840x2160 4K',
    avgRetention: '96.0%',
    hookRate: '91.4%',
    softwareUsed: 'After Effects · DaVinci Resolve · CapCut',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.45) contrast(0.80) brightness(0.92)',
    colorFilterGraded: 'saturate(1.25) contrast(1.18) brightness(1.04)',
    timelineMarkers: [
      {
        time: '00:00–00:03',
        label: 'Exhaust Roar & Flash Frame',
        detail: 'L-cut turbo spool audio leading into a 400% optical-flow speed ramp entry.',
      },
      {
        time: '00:04–00:24',
        label: 'Graph-Editor Velocity Curves',
        detail: 'Custom ease-in/ease-out time remapping locked to every snare and sub-bass transient.',
      },
      {
        time: '00:25–00:42',
        label: 'Split-Tone Night Grade',
        detail: 'Warm sodium-orange highlights (#FF6A32) balanced against deep carbon-black shadows.',
      },
    ],
  },
  {
    id: 'sports-brand-edit',
    category: 'sports-brand',
    categoryLabel: 'Sports Brand Page • Commercial',
    title: 'Sports Brand Page — High-Energy Widescreen Athlete Reel',
    subtitle: 'Trending 16:9 sports & brand content optimized for maximum engagement',
    description:
      'Built for competitive sports brand pages and commercial campaigns. Combines crowd-roar soundscapes, dynamic speed-ramped action cuts, and bold kinetic stat overlays.',
    thumbnail: showcaseViralRetentionImg,
    videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    aspect: '16:9',
    featuredSpan: false,
    duration: '00:45',
    fps: '60 fps',
    resolution: '3840x2160 4K',
    avgRetention: '91.8%',
    hookRate: '86.0%',
    softwareUsed: 'Premiere Pro · After Effects · Audition',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.5) contrast(0.82) sepia(0.08)',
    colorFilterGraded: 'saturate(1.18) contrast(1.16) brightness(1.03)',
    timelineMarkers: [
      {
        time: '00:00–00:02',
        label: 'Curiosity Gap Opener',
        detail: 'High-contrast athlete freeze-frame and kinetic brand callout in the first 48 frames.',
      },
      {
        time: '00:03–00:28',
        label: 'Rhythmic Pacing & Speed Ramps',
        detail: 'Action trimmed to peak impact frames; synced to 128 BPM percussive stadium stem.',
      },
      {
        time: '00:29–00:45',
        label: 'High-Impact Brand Climax',
        detail: 'Speed-ramped finisher with optical glow and stereo-widened sound design.',
      },
    ],
  },
  {
    id: 'documentary-story',
    category: 'documentary',
    categoryLabel: 'Documentary • Cinematic Narrative',
    title: 'Studio Quality — 16:9 Documentary Storytelling & Grade',
    subtitle: 'Professional widescreen documentary editing with cinematic color grading',
    description:
      'Full narrative assembly and look development in Premiere Pro and DaVinci Resolve—blending talking-head interviews, 3D parallax archival stills, atmospheric sound design, and -14 LUFS mastering.',
    thumbnail: heroEditingSuiteImg,
    videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspect: '16:9',
    featuredSpan: false,
    duration: '01:15',
    fps: '24 fps',
    resolution: '3840x2160 4K',
    avgRetention: '89.6%',
    hookRate: '84.2%',
    softwareUsed: 'DaVinci Resolve · Premiere Pro · Audition',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.45) contrast(0.80) brightness(0.92)',
    colorFilterGraded: 'saturate(1.25) contrast(1.18) brightness(1.04)',
    timelineMarkers: [
      {
        time: 'Act 01',
        label: 'Cold Open Mystery Hook',
        detail: 'Tense documentary sound bed with talking-head voiceover and 3D archival camera push.',
      },
      {
        time: 'Act 02',
        label: 'CST & Filmic Split-Tone',
        detail: 'Color Space Transform from Log to Rec.709 with warm skin tones and rich shadow contrast.',
      },
      {
        time: 'Mix Bus',
        label: 'Spatial Foley & Dialogue Clarity',
        detail: 'Multiband compression, EQ carving at 3kHz for vocal presence, and custom room tone.',
      },
    ],
  },
];

export const WORK_PROCESS: WorkProcessItem[] = [
  {
    index: '01',
    label: 'DISCOVER',
    title: 'Understand the Vision',
    description:
      'I first understand your content, target audience, references, and editing style before starting the project.',
    keyTechniques: 'Brief Analysis, Reference Study, Audience Research',
    targetOutcome: 'A clear editing direction aligned with your vision.',
  },
  {
    index: '02',
    label: 'PLAN',
    title: 'Build the Story',
    description:
      ' I organize the footage and create a strong structure with the right pacing, hooks, and visual flow.',
    keyTechniques: 'Storyboarding, Timeline Planning, Beat Mapping',
    targetOutcome: 'A well-structured edit with engaging pacing.',
  },
  {
    index: '03',
    label: 'EDIT',
    title: 'Bring It to Life',
    description:
      'I transform raw footage into an engaging video using precise cuts, transitions, effects, and storytelling.',
    keyTechniques: 'Dynamic Cuts, B-Roll, Zooms, Transitions, Captions',
    targetOutcome: 'A polished and engaging first cut.',
  },
  {
    index: '04',
    label: ' ENHANCE',
    title: 'Add the Cinematic Touch',
    description:
      'I enhance the edit with motion graphics, color grading, sound design, and carefully timed effects.',
    keyTechniques: 'Motion Graphics, Color Grading, SFX, Sound Design',
    targetOutcome: 'A professional, cinematic, and immersive video.',
  },
  {
    index: '05',
    label: 'DELIVER',
    title: ' Final Polish & Delivery',
    description:
      ' I review every detail, apply feedback, optimize the final video, and deliver it in the required format.',
    keyTechniques: 'Quality Control, Revisions, Export Optimization',
    targetOutcome: 'A ready-to-publish final video.',
  },
];

export const TECHNICAL_SKILLS = [
  {
    category: 'Software',
    items: [
      'Adobe Premiere Pro',
      'DaVinci Resolve',
      'After Effects',
      'CapCut Pro',
    ],
  },
  {
    category: 'Experience & Specializations',
    items: [
      'Talking Head Edits',
      'Documentary Storytelling',
      'Speed Ramp Mastery',
      'Car Edits',
      'Gaming Video Editing',
      'Short-Form Video (9:16)',
      'Motion Graphics',
      'REAL ESTATE & SPORTS BRAND PAGES',
    ],
  },
  {
    category: 'Platforms',
    items: ['YouTube', 'Instagram', 'TikTok', 'Snapchat', 'Twitter', 'LinkedIn'],
  },
];

export function downloadPortfolioDossier() {
  const dossierHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Deergh Hadiyal — Professional Video Editing Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #070707;
      color: #D6D6D6;
      line-height: 1.6;
      padding: 48px 24px;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      background: #0B0B0C;
      border: 1px solid rgba(255, 106, 50, 0.3);
      border-radius: 14px;
      padding: 48px;
    }
    .header {
      border-bottom: 1px solid rgba(255, 106, 50, 0.25);
      padding-bottom: 28px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 {
      font-size: 36px;
      color: #FFFFFF;
      letter-spacing: -0.03em;
      margin-bottom: 6px;
    }
    .tagline {
      font-size: 18px;
      color: #FF6A32;
      font-weight: 600;
    }
    .contact-meta {
      font-size: 13px;
      color: #929292;
      text-align: right;
    }
    .contact-meta a {
      color: #FF9A62;
      text-decoration: none;
    }
    h2 {
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #FF6A32;
      margin: 32px 0 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 8px;
    }
    .summary {
      font-size: 15px;
      color: #D6D6D6;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .card {
      background: #111214;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 18px;
      border-radius: 10px;
    }
    .card h3 {
      font-size: 16px;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .card p {
      font-size: 13px;
      color: #929292;
    }
    .meta-line {
      font-size: 12px;
      color: #FF9A62;
      margin-top: 8px;
    }
    .skill-row {
      margin-bottom: 12px;
      font-size: 14px;
    }
    .skill-row strong {
      color: #FF6A32;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
      color: #929292;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { background: #ffffff; color: #111111; padding: 0; }
      .page { background: #ffffff; border: none; padding: 24px; }
      h1, .card h3 { color: #111111; }
      .summary, .card p, .contact-meta { color: #3f3f46; }
      .card { border-color: #e4e4e7; background: #fafafa; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1>DEERGH HADIYAL</h1>
        <div class="tagline">Professional Video Editor • Creative Storyteller • Audience Growth Specialist</div>
      </div>
      <div class="contact-meta">
        <div>Email: <a href="mailto:deerghhadiyal@gmail.com">deerghhadiyal@gmail.com</a></div>
        <div>YouTube: <a href="https://youtube.com/@deerghhadiyal">@deerghhadiyal</a></div>
        <div>Instagram: <a href="https://www.instagram.com/deergh_hadiyal/">@deergh_hadiyal</a></div>
      </div>
    </div>

    <p class="summary">
      I transform raw footage into engaging 9:16 vertical and cinematic visual experiences designed to capture attention, improve retention, and tell compelling stories. Specializing in Talking Head, Documentary, Speed Ramp, Car Edits, CapCut & After Effects workflows, and HACKS EDIT / Sports Brand Pages.
    </p>

    <h2>Core Experience & Editing Formats</h2>
    <div class="grid">
      ${EXPERIENCE_PILLARS.map(
        (exp) => `
      <div class="card">
        <h3>${exp.code}. ${exp.title}</h3>
        <p>${exp.detail}</p>
      </div>`
      ).join('')}
    </div>

    <h2>Core Services & Capabilities</h2>
    <div class="grid">
      ${SERVICES.map(
        (s) => `
      <div class="card">
        <h3>${s.index}. ${s.title}</h3>
        <p>${s.description}</p>
        <div class="meta-line">${s.deliverables}</div>
      </div>`
      ).join('')}
    </div>

    <h2>Technical Stack & Platforms</h2>
    <div class="skill-row"><strong>Software:</strong> Adobe Premiere Pro · DaVinci Resolve · After Effects · CapCut Pro · Adobe Audition</div>
    <div class="skill-row"><strong>Specializations:</strong> Talking Head · Documentary · Speed Ramp · Car Edit · HACKS EDIT & Sports Brand Page · Short-Form Video (9:16) · Motion Graphics · Color Grading</div>
    <div class="skill-row"><strong>Platforms:</strong> YouTube · Instagram · TikTok · Snapchat · Twitter · LinkedIn</div>

    <div class="footer">
      <span>© 2026 Deergh Hadiyal · Video Editor & Content Creator</span>
      <span>deerghhadiyal@gmail.com · youtube.com/@deerghhadiyal</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([dossierHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Deergh_Hadiyal_Portfolio.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
