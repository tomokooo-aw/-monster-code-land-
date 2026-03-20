'use client';

import { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import type { BlockType, Direction, Position } from './game/types';

/* ── 進捗データ ── */
interface LevelProgress {
  stars: number;   // ベストスター数 (0-3)
  fruits: number;  // ベスト取得くだもの数
}

const STORAGE_KEY = 'mcl-progress';

function loadProgress(levelCount: number): LevelProgress[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: LevelProgress[] = JSON.parse(saved);
      return Array.from({ length: levelCount }, (_, i) => parsed[i] ?? { stars: 0, fruits: 0 });
    }
  } catch {}
  return Array.from({ length: levelCount }, () => ({ stars: 0, fruits: 0 }));
}
import { LEVELS } from './game/levels';
import { computePath, initialExecState, type PathStep } from './game/engine';
import GameBoard from './components/GameBoard';
import BlockPalette from './components/BlockPalette';
import CommandQueue from './components/CommandQueue';
import { ManualModal, ResultModal } from './components/Modals';
import Particles from './components/Particles';
import { FUWA_COLORS, type FuwaColorKey } from './components/FuwaMon';

type Phase = 'idle' | 'running' | 'goal_reached' | 'shaking' | 'won' | 'lost';

interface State {
  levelIndex: number;
  commands: BlockType[];
  phase: Phase;
  animStep: number;
  path: PathStep[];
  playerPos: Position;
  playerFacing: Direction;
  collectedFruits: string[];
  stars: number;
  failedStep: number;
  showManual: boolean;
  manualPage: number;
}

type Action =
  | { type: 'ADD_COMMAND'; block: BlockType }
  | { type: 'REMOVE_COMMAND'; index: number }
  | { type: 'RUN' }
  | { type: 'TICK' }
  | { type: 'SHOW_WON' }
  | { type: 'SHOW_LOST' }
  | { type: 'RESET' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'SET_LEVEL'; index: number }
  | { type: 'SHOW_MANUAL' }
  | { type: 'HIDE_MANUAL' }
  | { type: 'SET_MANUAL_PAGE'; page: number };

function calcStars(steps: number, stars3: number, stars2: number): number {
  if (steps <= stars3) return 3;
  if (steps <= stars2) return 2;
  return 1;
}

function makeInitial(levelIndex: number): State {
  const exec = initialExecState(LEVELS[levelIndex]);
  return {
    levelIndex,
    commands: [],
    phase: 'idle',
    animStep: 0,
    path: [],
    playerPos: exec.position,
    playerFacing: exec.facing,
    collectedFruits: [],
    stars: 0,
    failedStep: 0,
    showManual: false,
    manualPage: 0,
  };
}

function reducer(state: State, action: Action): State {
  const level = LEVELS[state.levelIndex];

  switch (action.type) {
    case 'ADD_COMMAND': {
      if (state.phase !== 'idle') return state;
      if (state.commands.length >= level.maxCommands) return state;
      return { ...state, commands: [...state.commands, action.block] };
    }
    case 'REMOVE_COMMAND': {
      if (state.phase !== 'idle') return state;
      return { ...state, commands: state.commands.filter((_, i) => i !== action.index) };
    }
    case 'RUN': {
      if (state.phase !== 'idle' || state.commands.length === 0) return state;
      const path = computePath(state.commands, level);
      const exec = initialExecState(level);
      return { ...state, phase: 'running', path, animStep: 0, playerPos: exec.position, playerFacing: exec.facing, collectedFruits: [] };
    }
    case 'TICK': {
      if (state.phase !== 'running') return state;
      const { animStep, path } = state;
      if (animStep >= path.length) {
        return { ...state, phase: 'shaking', failedStep: path.length };
      }
      const step = path[animStep];
      const nextStep = animStep + 1;
      if (step.hitWall || step.outOfBounds) {
        return { ...state, phase: 'shaking', animStep: nextStep, failedStep: nextStep };
      }
      if (step.reachedGoal) {
        const stars = calcStars(nextStep, level.stars3, level.stars2);
        return { ...state, phase: 'goal_reached', animStep: nextStep, playerPos: step.state.position, playerFacing: step.state.facing, collectedFruits: step.state.collectedFruits, stars };
      }
      return { ...state, animStep: nextStep, playerPos: step.state.position, playerFacing: step.state.facing, collectedFruits: step.state.collectedFruits };
    }
    case 'SHOW_WON': {
      if (state.phase !== 'goal_reached') return state;
      return { ...state, phase: 'won' };
    }
    case 'SHOW_LOST': {
      if (state.phase !== 'shaking') return state;
      return { ...state, phase: 'lost' };
    }
    case 'RESET':      return makeInitial(state.levelIndex);
    case 'NEXT_LEVEL': return makeInitial(Math.min(state.levelIndex + 1, LEVELS.length - 1));
    case 'SET_LEVEL':  return makeInitial(action.index);
    case 'SHOW_MANUAL': return { ...state, showManual: true };
    case 'HIDE_MANUAL': return { ...state, showManual: false };
    case 'SET_MANUAL_PAGE': return { ...state, manualPage: action.page };
    default: return state;
  }
}

const COLOR_KEYS = Object.keys(FUWA_COLORS) as FuwaColorKey[];

export default function Home() {
  const [state, dispatch] = useReducer(reducer, makeInitial(0));
  const [playerColor, setPlayerColor] = useState<FuwaColorKey>('orange');
  const goalRef = useRef<HTMLDivElement>(null);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState<LevelProgress[]>(() => loadProgress(LEVELS.length));

  // フックより前に計算（useRef の初期値に使うため）
  const totalFruits = progress.reduce((sum, p) => sum + p.fruits, 0);

  const fruitCountRef = useRef<HTMLSpanElement>(null);
  const prevTotalFruits = useRef(totalFruits);

  useEffect(() => {
    if (state.phase !== 'running') return;
    // ジャンプ直後はアニメーション完了を待つため750ms、それ以外は650ms
    const justExecuted = state.commands[state.animStep - 1];
    const delay = justExecuted === 'jump' ? 750 : 650;
    const timer = setTimeout(() => dispatch({ type: 'TICK' }), delay);
    return () => clearTimeout(timer);
  }, [state.phase, state.animStep]);

  useEffect(() => {
    if (state.phase !== 'goal_reached') return;
    // ゴールセルの画面座標を取得してバースト起点に設定
    if (goalRef.current) {
      const rect = goalRef.current.getBoundingClientRect();
      setBurstOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    // 移動アニメーション（450ms）+ ゴール演出待ち（550ms）= 計1000ms後にモーダル
    const timer = setTimeout(() => dispatch({ type: 'SHOW_WON' }), 1000);
    return () => clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'shaking') return;
    const timer = setTimeout(() => dispatch({ type: 'SHOW_LOST' }), 1200);
    return () => clearTimeout(timer);
  }, [state.phase]);

  // クリア時に進捗を更新・保存
  useEffect(() => {
    if (state.phase !== 'won') return;
    setProgress((prev) => {
      const next = [...prev];
      const cur = next[state.levelIndex] ?? { stars: 0, fruits: 0 };
      next[state.levelIndex] = {
        stars:  Math.max(cur.stars,  state.stars),
        fruits: Math.max(cur.fruits, state.collectedFruits.length),
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [state.phase]);

  // 果物合計が増えたときにヘッダーの数字をぴょんと跳ねさせる
  useEffect(() => {
    if (totalFruits > prevTotalFruits.current && fruitCountRef.current) {
      fruitCountRef.current.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
        { duration: 300, easing: 'ease-out' }
      );
    }
    prevTotalFruits.current = totalFruits;
  }, [totalFruits]);

  const handleAdd = useCallback((block: BlockType) => dispatch({ type: 'ADD_COMMAND', block }), []);
  const handleRemove = useCallback((index: number) => dispatch({ type: 'REMOVE_COMMAND', index }), []);

  const isRunning = state.phase === 'running' || state.phase === 'goal_reached';
  const isShaking = state.phase === 'shaking';
  const isDisabled = isRunning || isShaking;
  const activeIndex = (isRunning || isShaking) ? state.animStep - 1 : -1;
  const isJumping = isRunning && activeIndex >= 0 && state.commands[activeIndex] === 'jump';
  const level = LEVELS[state.levelIndex];
  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const maxStars   = LEVELS.length * 3;

  // Level buttons: split into 2 rows of 5
  const topRow    = LEVELS.slice(0, 5);
  const bottomRow = LEVELS.slice(5, 10);

  return (
    <>
      <Particles active={state.phase === 'goal_reached' || state.phase === 'won'} origin={burstOrigin} />

      {state.showManual && (
        <ManualModal
          page={state.manualPage}
          onChangePage={(page) => dispatch({ type: 'SET_MANUAL_PAGE', page })}
          onClose={() => dispatch({ type: 'HIDE_MANUAL' })}
        />
      )}
      {state.phase === 'won' && (
        <ResultModal
          type="won"
          stars={state.stars}
          fruitsCollected={state.collectedFruits.length}
          onRetry={() => dispatch({ type: 'RESET' })}
          onNext={() => dispatch({ type: 'NEXT_LEVEL' })}
          hasNext={state.levelIndex < LEVELS.length - 1}
        />
      )}
      {state.phase === 'lost' && (
        <ResultModal type="lost" stars={0} failedStep={state.failedStep} onRetry={() => dispatch({ type: 'RESET' })} hasNext={false} />
      )}

      {/* ════════════════════════════════════════
          Page background — pastel rainbow
      ════════════════════════════════════════ */}
      <div className="page-root">
        {/* ── キラキラ浮遊絵文字 背景レイヤー ── */}
        <div className="float-bg" aria-hidden="true">
          {([
            { e: '🌸', top: '2%',  left: '5%',  dur: '8s',  delay: '0s',   size: '22px' },
            { e: '💖', top: '5%',  left: '20%', dur: '10s', delay: '1.2s', size: '18px' },
            { e: '⭐', top: '3%',  left: '38%', dur: '7s',  delay: '2.5s', size: '26px' },
            { e: '🦋', top: '7%',  left: '55%', dur: '12s', delay: '0.5s', size: '20px' },
            { e: '🌈', top: '4%',  left: '72%', dur: '9s',  delay: '3s',   size: '24px' },
            { e: '🍭', top: '6%',  left: '88%', dur: '11s', delay: '1.8s', size: '18px' },
            { e: '🦄', top: '18%', left: '2%',  dur: '13s', delay: '0.8s', size: '28px' },
            { e: '🌟', top: '14%', left: '14%', dur: '9s',  delay: '2s',   size: '20px' },
            { e: '💎', top: '20%', left: '30%', dur: '7s',  delay: '1s',   size: '16px' },
            { e: '🌺', top: '16%', left: '46%', dur: '10s', delay: '3.5s', size: '24px' },
            { e: '🎀', top: '22%', left: '62%', dur: '8s',  delay: '0.3s', size: '18px' },
            { e: '🍬', top: '18%', left: '78%', dur: '11s', delay: '2.8s', size: '22px' },
            { e: '👑', top: '12%', left: '93%', dur: '9s',  delay: '1.5s', size: '20px' },
            { e: '💫', top: '32%', left: '8%',  dur: '7s',  delay: '4s',   size: '24px' },
            { e: '🍦', top: '38%', left: '24%', dur: '12s', delay: '0.7s', size: '18px' },
            { e: '🎪', top: '44%', left: '40%', dur: '9s',  delay: '1.3s', size: '26px' },
            { e: '🌸', top: '36%', left: '56%', dur: '8s',  delay: '3.2s', size: '20px' },
            { e: '⭐', top: '42%', left: '72%', dur: '10s', delay: '2.2s', size: '22px' },
            { e: '🍩', top: '34%', left: '88%', dur: '7s',  delay: '0.9s', size: '18px' },
            { e: '🌼', top: '48%', left: '96%', dur: '11s', delay: '3.8s', size: '24px' },
            { e: '🦋', top: '55%', left: '4%',  dur: '9s',  delay: '1.6s', size: '20px' },
            { e: '👑', top: '62%', left: '18%', dur: '8s',  delay: '4.5s', size: '28px' },
            { e: '🌈', top: '58%', left: '34%', dur: '11s', delay: '0.4s', size: '16px' },
            { e: '🦄', top: '65%', left: '50%', dur: '7s',  delay: '2.7s', size: '22px' },
            { e: '🎀', top: '52%', left: '66%', dur: '10s', delay: '1.1s', size: '18px' },
            { e: '💎', top: '68%', left: '80%', dur: '13s', delay: '3.6s', size: '24px' },
            { e: '🌺', top: '60%', left: '93%', dur: '8s',  delay: '0.6s', size: '20px' },
            { e: '🍭', top: '73%', left: '7%',  dur: '10s', delay: '2.4s', size: '26px' },
            { e: '🌟', top: '80%', left: '23%', dur: '7s',  delay: '1.9s', size: '18px' },
            { e: '🍬', top: '76%', left: '42%', dur: '9s',  delay: '4.1s', size: '22px' },
            { e: '💖', top: '88%', left: '58%', dur: '8s',  delay: '0.2s', size: '20px' },
            { e: '💫', top: '83%', left: '74%', dur: '11s', delay: '3.3s', size: '16px' },
            { e: '🍦', top: '92%', left: '88%', dur: '7s',  delay: '1.7s', size: '24px' },
            { e: '🎪', top: '87%', left: '12%', dur: '10s', delay: '2.6s', size: '18px' },
            { e: '🌼', top: '94%', left: '50%', dur: '9s',  delay: '0.7s', size: '22px' },
            { e: '🍩', top: '70%', left: '40%', dur: '8s',  delay: '5s',   size: '16px' },
          ] as const).map((item, i) => (
            <span
              key={i}
              className="float-item"
              style={{
                top: item.top,
                left: item.left,
                '--dur': item.dur,
                '--delay': item.delay,
                '--size': item.size,
              } as React.CSSProperties}
            >
              {item.e}
            </span>
          ))}
        </div>

        {/* ── Header ── */}
        <header className="game-header">
          {/* Title + star counter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1
              style={{
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: 'clamp(22px, 4.5vw, 38px)',
                color: 'white',
                margin: 0,
                textShadow: '2px 2px 0 #C2185B, 4px 5px 0 rgba(194,24,91,0.25)',
                letterSpacing: 2,
                lineHeight: 1.25,
              }}
            >
              🌸 モンスターコードランド
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* スターバッジ */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.88)',
                  border: '3px solid #2D1B4E',
                  borderRadius: 999,
                  padding: '4px 14px',
                  boxShadow: '3px 3px 0 #2D1B4E',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>⭐</span>
                <span style={{ fontFamily: "'Cherry Bomb One', cursive", fontSize: 16, color: '#2D1B4E', letterSpacing: 1 }}>
                  {totalStars} / {maxStars}
                </span>
              </div>
              {/* 果物バッジ */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.88)',
                  border: '3px solid #2D1B4E',
                  borderRadius: 999,
                  padding: '4px 14px',
                  boxShadow: '3px 3px 0 #2D1B4E',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>🍓</span>
                <span style={{ fontFamily: "'Cherry Bomb One', cursive", fontSize: 16, color: '#2D1B4E', letterSpacing: 1 }}>
                  ×
                </span>
                <span
                  ref={fruitCountRef}
                  style={{ fontFamily: "'Cherry Bomb One', cursive", fontSize: 16, color: '#2D1B4E', display: 'inline-block' }}
                >
                  {totalFruits}
                </span>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="header-right">
            {/* Level buttons: row1 1-5, row2 6-10 */}
            <div className="level-btn-row">
              {topRow.map((lv, i) => (
                <LevelBtn key={i} index={i} current={state.levelIndex} label={String(i + 1)} onSelect={(idx) => dispatch({ type: 'SET_LEVEL', index: idx })} />
              ))}
            </div>
            <div className="level-btn-row">
              {bottomRow.map((lv, i) => (
                <LevelBtn key={i + 5} index={i + 5} current={state.levelIndex} label={String(i + 6)} onSelect={(idx) => dispatch({ type: 'SET_LEVEL', index: idx })} />
              ))}
              <button
                onClick={() => dispatch({ type: 'SHOW_MANUAL' })}
                style={{
                  background: 'linear-gradient(135deg, #C084FC 0%, #7C3AED 100%)',
                  border: '3px solid #2D1B4E',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 13,
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 5px 0 #2D1B4E',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.08s, box-shadow 0.08s',
                }}
                onPointerDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(3px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 0 #2D1B4E';
                }}
                onPointerUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 5px 0 #2D1B4E';
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 5px 0 #2D1B4E';
                }}
              >
                📖 せつめいしょ
              </button>
            </div>
          </div>
        </header>

        {/* ── Game area ── */}
        <div className="game-area">
          {/* ── Left: grid + queue + controls ── */}
          <div className="game-left-col">
            {/* Level title badge */}
            <div
              style={{
                background: '#FF5FA0',
                border: '3px solid #2D1B4E',
                borderRadius: 10,
                padding: '4px 14px',
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: 16,
                color: 'white',
                textShadow: '1px 1px 0 #C2185B',
                boxShadow: '3px 3px 0 #2D1B4E',
                alignSelf: 'flex-start',
              }}
            >
              {level.title}
            </div>

            <GameBoard
              level={level}
              playerPos={state.playerPos}
              collectedFruits={state.collectedFruits}
              isRunning={isRunning}
              isShaking={isShaking}
              isJumping={isJumping}
              jumpKey={state.animStep}
              goalRef={goalRef}
            />

            <CommandQueue
              commands={state.commands}
              activeIndex={activeIndex}
              onRemove={handleRemove}
              disabled={isDisabled}
            />

            <div className="cmd-count-row">
              {state.commands.length} / {level.maxCommands} コマンド
            </div>

            {/* Run + Reset */}
            <div className="run-reset-row">
              <button
                onClick={() => dispatch({ type: 'RUN' })}
                disabled={isDisabled || state.commands.length === 0}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #FF5FA0 0%, #FF3D8A 100%)',
                  border: '4px solid #2D1B4E',
                  borderRadius: 999,
                  boxShadow: isDisabled || state.commands.length === 0 ? '0 2px 0 #2D1B4E' : '0 7px 0 #2D1B4E',
                  padding: '12px',
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 20,
                  color: 'white',
                  textShadow: '1px 2px 0 #C2185B',
                  cursor: isDisabled || state.commands.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: isDisabled || state.commands.length === 0 ? 0.5 : 1,
                  letterSpacing: 1,
                  transition: 'transform 0.08s, box-shadow 0.08s',
                }}
                onPointerDown={(e) => {
                  if (!isDisabled && state.commands.length > 0) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(5px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 0 #2D1B4E';
                  }
                }}
                onPointerUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 7px 0 #2D1B4E';
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 7px 0 #2D1B4E';
                }}
              >
                ▶ すすめ！
              </button>
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                style={{
                  background: 'linear-gradient(135deg, #FFE055 0%, #FFD94A 100%)',
                  border: '4px solid #2D1B4E',
                  borderRadius: 999,
                  boxShadow: '0 7px 0 #2D1B4E',
                  padding: '12px 18px',
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 20,
                  color: '#2D1B4E',
                  cursor: 'pointer',
                  transition: 'transform 0.08s, box-shadow 0.08s',
                }}
                onPointerDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(5px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 0 #2D1B4E';
                }}
                onPointerUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 7px 0 #2D1B4E';
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 7px 0 #2D1B4E';
                }}
              >
                🔄
              </button>
            </div>
          </div>

          {/* ── Right: palette + color picker + hint ── */}
          <div className="game-right-col">
            <BlockPalette onAdd={handleAdd} disabled={isDisabled} />

            {/* ── カラーピッカー ── */}
            <div>
              <div
                style={{
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 15,
                  color: '#FF5FA0',
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                フワモンのいろ
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {COLOR_KEYS.map((key) => {
                  const { body } = FUWA_COLORS[key];
                  const isSelected = key === playerColor;
                  return (
                    <button
                      key={key}
                      title={FUWA_COLORS[key].label}
                      onClick={() => setPlayerColor(key)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: body,
                        border: isSelected ? '3px solid #2D1B4E' : '2px solid rgba(45,27,78,0.3)',
                        boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #2D1B4E' : 'none',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        padding: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Stars hint */}
            <div
              className="stars-hint"
              style={{
                padding: '10px 12px',
                background: '#FFF0F8',
                borderRadius: 12,
                border: '2px solid #FFB3D1',
                fontSize: 12,
                color: '#2D1B4E',
                fontWeight: 800,
                lineHeight: 1.9,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 13,
                  color: '#FF5FA0',
                  marginBottom: 2,
                }}
              >
                ほしのめやす
              </div>
              <div>⭐⭐⭐ {level.stars3}こ 以下</div>
              <div>⭐⭐　 {level.stars2}こ 以下</div>
              <div>⭐　　 それ 以上</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Level button subcomponent ── */
function LevelBtn({
  index, current, label, onSelect,
}: {
  index: number; current: number; label: string; onSelect: (i: number) => void;
}) {
  const isActive = index === current;
  return (
    <button
      onClick={() => onSelect(index)}
      style={{
        background: isActive ? '#FF5FA0' : 'rgba(255,255,255,0.88)',
        border: `3px solid ${isActive ? '#2D1B4E' : '#FFB3D1'}`,
        borderRadius: 999,
        width: 36,
        height: 36,
        fontFamily: "'Cherry Bomb One', cursive",
        fontSize: 13,
        color: isActive ? 'white' : '#C2185B',
        cursor: 'pointer',
        boxShadow: isActive ? '0 4px 0 #2D1B4E' : '0 3px 0 rgba(194,24,91,0.2)',
        textShadow: isActive ? '1px 1px 0 #C2185B' : 'none',
        padding: 0,
        lineHeight: 1,
        transform: isActive ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}
