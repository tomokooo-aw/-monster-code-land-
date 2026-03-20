/** Web Audio API を使ったシングルトン効果音モジュール */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    ctx = new (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return ctx;
}

/** 最初のユーザー操作時に呼ぶ（iOS等のブラウザはジェスチャー後でないと音が出ない） */
export function resumeAudio(): void {
  const c = getCtx();
  if (c && c.state === 'suspended') c.resume();
}

/** 周波数スイープを1本生成するヘルパー */
function sweep(
  freqStart: number,
  freqEnd: number,
  duration: number,
  opts?: {
    type?: OscillatorType;
    gain?: number;
    startTime?: number; // ctx.currentTime からの遅延（秒）
    fadeIn?: number;
  }
): void {
  const c = getCtx();
  if (!c) return;

  const { type = 'sine', gain = 0.28, startTime = 0, fadeIn = 0.01 } = opts ?? {};

  const osc  = c.createOscillator();
  const amp  = c.createGain();
  osc.connect(amp);
  amp.connect(c.destination);

  const t = c.currentTime + startTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, t);
  osc.frequency.linearRampToValueAtTime(freqEnd, t + duration);

  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(gain, t + fadeIn);
  amp.gain.linearRampToValueAtTime(0, t + duration);

  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// ─────────────────────────────────────────
// 効果音
// ─────────────────────────────────────────

/** 移動: 短くかわいいポップ音（440Hz→550Hz、0.1秒） */
export function playMove(): void {
  sweep(440, 550, 0.1, { gain: 0.22 });
}

/** ジャンプ: 上昇する音（300Hz→800Hz、0.3秒） */
export function playJump(): void {
  sweep(300, 800, 0.3, { gain: 0.28 });
}

/** くだもの取得: キラキラ3段階（600→900→1200Hz、0.3秒） */
export function playFruit(): void {
  sweep(600,  900,  0.12, { gain: 0.28, startTime: 0.00 });
  sweep(900,  1100, 0.12, { gain: 0.28, startTime: 0.10 });
  sweep(1100, 1400, 0.10, { gain: 0.22, startTime: 0.20 });
}

/** ゴールクリア: ファンファーレ（ド→ミ→ソ→高ド、各0.15秒） */
export function playGoal(): void {
  const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    sweep(freq, freq, 0.18, { gain: 0.35, startTime: i * 0.15 });
  });
}

/** ミス: 低くなる残念な音（400Hz→200Hz、0.4秒） */
export function playMiss(): void {
  sweep(400, 200, 0.4, { type: 'sawtooth', gain: 0.18 });
}
