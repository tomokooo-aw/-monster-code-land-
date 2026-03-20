'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  emoji: string;
  size: number;
  tx: string;
  ty: string;
  rot: number;
  duration: number;
  delay: number;
}

const EMOJIS = ['🌸','🦄','⭐','🌈','💖','🦋','🍭','🍬','🌟','💫','🌺','🎀','🍦','🍩','👑','🌼','💎','🎪'];

interface Props {
  active: boolean;
  origin?: { x: number; y: number } | null;
}

export default function Particles({ active, origin }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [finished, setFinished] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!active || !origin) {
      setParticles([]);
      setFinished(new Set());
      return;
    }
    setFinished(new Set());
    const count = 50 + Math.floor(Math.random() * 11); // 50〜60個
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 20 + Math.random() * 20, // 20〜40px
        tx: `${Math.round(-300 + Math.random() * 600)}px`,  // -300〜300px
        ty: `${Math.round(-400 + Math.random() * 500)}px`,  // -400〜100px（主に上方向）
        rot: -360 + Math.random() * 720,
        duration: 1 + Math.random() * 0.5, // 1〜1.5s
        delay: Math.random() * 0.08,
      }))
    );
  }, [active, origin]);

  if (!active || !origin || particles.length === 0) return null;

  const visible = particles.filter((p) => !finished.has(p.id));

  return (
    <>
      {visible.map((p) => (
        <div
          key={p.id}
          onAnimationEnd={() =>
            setFinished((prev) => {
              const next = new Set(prev);
              next.add(p.id);
              return next;
            })
          }
          style={{
            position: 'fixed',
            left: origin.x,
            top: origin.y,
            fontSize: p.size,
            lineHeight: 1,
            pointerEvents: 'none',
            zIndex: 200,
            animation: `burst ${p.duration}s ${p.delay}s ease-out forwards`,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': `${p.rot}deg`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </>
  );
}
