import { useEffect, useRef } from 'react';

const PARTICLES = [
  { left: '7%', top: '18%', size: 4, delay: '-3s', duration: '17s' },
  { left: '17%', top: '72%', size: 3, delay: '-11s', duration: '21s' },
  { left: '31%', top: '37%', size: 5, delay: '-7s', duration: '19s' },
  { left: '52%', top: '83%', size: 3, delay: '-15s', duration: '23s' },
  { left: '68%', top: '21%', size: 4, delay: '-5s', duration: '18s' },
  { left: '82%', top: '61%', size: 5, delay: '-13s', duration: '22s' },
  { left: '94%', top: '34%', size: 3, delay: '-9s', duration: '20s' },
];

export default function CursorEnvironment() {
  const environmentRef = useRef<HTMLDivElement | null>(null);
  const particleFieldRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const brushRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const environment = environmentRef.current;
    const particleField = particleFieldRef.current;
    const orb = orbRef.current;
    const ring = ringRef.current;
    const brush = brushRef.current;
    const trail = trailRef.current;

    if (
      !environment ||
      !particleField ||
      !orb ||
      !ring ||
      !brush ||
      !trail ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    const trailPosition = { x: 0, y: 0 };
    let frameId = 0;
    let rotation = 0;

    const animate = () => {
      frameId = 0;
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      position.x += dx * 0.2;
      position.y += dy * 0.2;
      trailPosition.x += (position.x - trailPosition.x) * 0.14;
      trailPosition.y += (position.y - trailPosition.y) * 0.14;

      const speed = Math.min(Math.hypot(dx, dy), 30);
      rotation += speed * 0.12;

      orb.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${rotation.toFixed(2)}deg) scale(${(1 + speed * 0.0015).toFixed(3)})`;
      brush.style.transform = `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(-50%, -50%)`;
      const parallaxX = ((target.x / window.innerWidth - 0.5) * 18).toFixed(2);
      const parallaxY = ((target.y / window.innerHeight - 0.5) * 14).toFixed(2);
      particleField.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;

      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      if (environment.dataset.active !== 'true') {
        position.x = event.clientX;
        position.y = event.clientY;
        trailPosition.x = event.clientX;
        trailPosition.y = event.clientY;
      }
      target.x = event.clientX;
      target.y = event.clientY;
      environment.dataset.active = 'true';
      if (!frameId) frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerLeave = () => {
      delete environment.dataset.active;
      target.x = position.x;
      target.y = position.y;
      particleField.style.transform = 'translate3d(0, 0, 0)';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={environmentRef} className="cursor-environment" aria-hidden="true">
      <div ref={particleFieldRef} className="cursor-particle-field">
        {PARTICLES.map((particle, index) => (
          <span
            key={particle.left}
            className={`cursor-particle${index % 3 === 0 ? ' cursor-particle-ring' : ''}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
      <div ref={brushRef} className="cursor-brush" />
      <div ref={trailRef} className="cursor-trail" />
      <div ref={ringRef} className="cursor-orb-ring" />
      <div ref={orbRef} className="cursor-orb">
        <span className="cursor-orb-core" />
      </div>
    </div>
  );
}