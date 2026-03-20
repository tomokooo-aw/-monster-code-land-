import { useRef, useEffect, type RefObject } from 'react';
import type { CellType, Level, Position } from '../game/types';

const CELL_BASE = 72;
const GAP  = 3; // px gap between cells

interface Props {
  level: Level;
  playerPos: Position;
  collectedFruits: string[];
  isRunning: boolean;
  isShaking: boolean;
  isJumping: boolean;
  cellSize?: number;
  jumpKey: number;
  goalRef?: RefObject<HTMLDivElement | null>;
}

function posKey(col: number, row: number) {
  return `${col},${row}`;
}

function WallMonster() {
  return (
    <svg viewBox="0 0 40 40" width={46} height={46}>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#5B21B6" stroke="#2D1B4E" strokeWidth="2.5" />
      {/* Glowing eyes */}
      <circle cx="13" cy="16" r="6" fill="#FF5FA0" />
      <circle cx="27" cy="16" r="6" fill="#FF5FA0" />
      <circle cx="13" cy="16" r="3.5" fill="#2D1B4E" />
      <circle cx="27" cy="16" r="3.5" fill="#2D1B4E" />
      <circle cx="14.5" cy="14.5" r="1.2" fill="white" />
      <circle cx="28.5" cy="14.5" r="1.2" fill="white" />
      {/* Angry brows */}
      <line x1="7" y1="9" x2="19" y2="12" stroke="#2D1B4E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="12" x2="33" y2="9" stroke="#2D1B4E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M 9 27 Q 20 35 31 27" fill="#2D1B4E" />
      {/* Fangs */}
      <polygon points="14,27 17,33 20,27" fill="white" />
      <polygon points="22,27 25,33 28,27" fill="white" />
    </svg>
  );
}

const CELL_BG: Record<CellType, string> = {
  empty:            'linear-gradient(145deg, #FFF5FB 0%, #FFDDF0 100%)',
  start:            'linear-gradient(145deg, #C6F6D5 0%, #A7F3D0 100%)',
  goal:             'linear-gradient(145deg, #FEF9C3 0%, #FDE68A 100%)',
  wall:             'linear-gradient(145deg, #5B21B6 0%, #3B0764 100%)',
  fruit_strawberry: 'linear-gradient(145deg, #FFF5FB 0%, #FFDDF0 100%)',
  fruit_grape:      'linear-gradient(145deg, #FFF5FB 0%, #FFDDF0 100%)',
};

export default function GameBoard({ level, playerPos, collectedFruits, isRunning, isShaking, isJumping, jumpKey, goalRef, cellSize = CELL_BASE }: Props) {
  const { grid } = level;
  const CELL = cellSize;
  const CELL_SIZE = CELL - GAP * 2;
  const imgSize = Math.min(54, CELL - 14);
  const jumpRef = useRef<HTMLDivElement>(null);

  // Web Animations API でジャンプアニメーションを確実に再生
  useEffect(() => {
    if (!isJumping || !jumpRef.current) return;
    const anim = jumpRef.current.animate(
      [
        { transform: 'scale(1) translateY(0)' },
        { transform: 'scale(1.1, 0.9) translateY(0)', offset: 0.3 },
        { transform: 'scale(0.9, 1.1) translateY(-60px)', offset: 0.5 },
        { transform: 'scale(1.1, 0.9) translateY(0)', offset: 0.7 },
        { transform: 'scale(0.95, 1.05) translateY(-15px)', offset: 0.85 },
        { transform: 'scale(1) translateY(0)' },
      ],
      { duration: 650, easing: 'ease-in-out' }
    );
    return () => anim.cancel();
  }, [isJumping, jumpKey]);

  return (
    // 外側コンテナ: overflow: visible でジャンプアニメーションをクリップしない
    <div
      style={{
        position: 'relative',
        width: 5 * CELL,
        height: 4 * CELL,
        border: '4px solid #2D1B4E',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(194,24,91,0.18), 6px 6px 0 #2D1B4E',
        flexShrink: 0,
      }}
    >
      {/* グリッドセル専用レイヤー: overflow:hidden でセルを角丸にクリップ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          overflow: 'hidden',
          background: '#FFB3D1',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = posKey(c, r);
            const isCollected = collectedFruits.includes(key);
            const isStart = cell === 'start';
            const isGoal  = cell === 'goal';
            return (
              <div
                key={key}
                ref={isGoal ? goalRef : undefined}
                className={isStart ? 'start-cell-glow' : isGoal ? 'goal-cell-glow' : undefined}
                style={{
                  position: 'absolute',
                  left: c * CELL + GAP,
                  top:  r * CELL + GAP,
                  width:  CELL_SIZE,
                  height: CELL_SIZE,
                  background: CELL_BG[cell],
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cell === 'wall' && <WallMonster />}
                {cell === 'goal' && (
                  <span className="goal-blink" style={{ fontSize: 36, lineHeight: 1 }}>⭐</span>
                )}
                {cell === 'fruit_strawberry' && !isCollected && (
                  <span className="fruit-bounce" style={{ fontSize: 32 }}>🍓</span>
                )}
                {cell === 'fruit_grape' && !isCollected && (
                  <span className="fruit-bounce" style={{ fontSize: 32 }}>🍇</span>
                )}
                {(cell === 'fruit_strawberry' || cell === 'fruit_grape') && isCollected && (
                  <span style={{ fontSize: 20, opacity: 0.3 }}>✨</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── フワモン キャラクター（グリッドの外側レイヤー → クリップされない） ── */}
      {/* 外側 div: 位置トランジション（left/top） + シェイク */}
      <div
        className={isShaking ? 'fuwa-shake' : undefined}
        style={{
          position: 'absolute',
          left: playerPos.col * CELL + GAP,
          top:  playerPos.row * CELL + GAP,
          width:  CELL_SIZE,
          height: CELL_SIZE,
          zIndex: 10,
          pointerEvents: 'none',
          transition: isRunning
            ? 'left 0.45s cubic-bezier(0.34,1.56,0.64,1), top 0.45s cubic-bezier(0.34,1.56,0.64,1)'
            : 'none',
        }}
      >
        {/* 内側 div: ジャンプアニメーション（Web Animations API で制御） */}
        <div
          ref={jumpRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fuwa-mon.png" alt="フワモン" style={{ width: imgSize, height: imgSize, objectFit: 'contain' }} />

          {/* 着地ほこりエフェクト（左） */}
          {isJumping && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '8%',
                fontSize: 14,
                pointerEvents: 'none',
                animation: 'dustPuff 0.28s ease-out 0.5s both',
                '--dust-dx': '-18px',
              } as React.CSSProperties}
            >✨</span>
          )}
          {/* 着地ほこりエフェクト（右） */}
          {isJumping && (
            <span
              style={{
                position: 'absolute',
                right: 0,
                bottom: '8%',
                fontSize: 14,
                pointerEvents: 'none',
                animation: 'dustPuff 0.28s ease-out 0.5s both',
                '--dust-dx': '18px',
              } as React.CSSProperties}
            >✨</span>
          )}
        </div>
      </div>

      {/* ── 💥 衝突エフェクト ── */}
      {isShaking && (
        <div
          className="boom-pop"
          style={{
            position: 'absolute',
            left: playerPos.col * CELL + GAP,
            top:  playerPos.row * CELL + GAP,
            width:  CELL_SIZE,
            height: CELL_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            pointerEvents: 'none',
            fontSize: 44,
            lineHeight: 1,
          }}
        >
          💥
        </div>
      )}
    </div>
  );
}
