import type { CSSProperties } from 'react';

function btnStyle(bg: string, textColor = '#2D1B4E'): CSSProperties {
  return {
    background: bg,
    border: '3px solid #2D1B4E',
    borderRadius: 14,
    boxShadow: '4px 4px 0 #2D1B4E',
    padding: '10px 22px',
    fontFamily: "'Cherry Bomb One', cursive",
    fontWeight: 900,
    fontSize: 16,
    color: textColor,
    cursor: 'pointer',
  };
}

const OVERLAY: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(194,24,91,0.55)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 16,
};

const CARD: CSSProperties = {
  background: 'white',
  borderRadius: 22,
  border: '4px solid #FF5FA0',
  boxShadow: '8px 8px 0 #2D1B4E',
  padding: '28px 32px',
  maxWidth: 480,
  width: '100%',
  fontFamily: "'Cherry Bomb One', cursive",
};

/* ─── Manual Modal ─── */

interface ManualModalProps {
  page: number;
  onChangePage: (page: number) => void;
  onClose: () => void;
}

export function ManualModal({ page, onChangePage, onClose }: ManualModalProps) {
  return (
    <div style={OVERLAY}>
      <div style={CARD}>
        <h2
          style={{
            fontFamily: "'Cherry Bomb One', cursive",
            fontSize: 28,
            color: '#FF5FA0',
            marginTop: 0,
            textAlign: 'center',
            textShadow: '2px 2px 0 #FFD94A',
          }}
        >
          {page === 0 ? '🎮 あそびかた' : '🧩 ブロックのせつめい'}
        </h2>

        {page === 0 ? (
          <div style={{ lineHeight: 1.9, fontSize: 16, color: '#2D1B4E' }}>
            <div style={{ marginBottom: 14, fontSize: 18 }}>
              <span style={{ fontSize: 26 }}>🧡</span> フワモンを{' '}
              <span style={{ fontSize: 22 }}>⭐</span> ゴール まで はこぼう！
            </div>
            <div
              style={{
                background: '#FFF0F8',
                borderRadius: 14,
                padding: '12px 18px',
                marginBottom: 14,
                border: '2px solid #FFB3D1',
              }}
            >
              <div>① みぎの <b>ブロック</b> をえらぶ</div>
              <div>② コマンドに ならべる</div>
              <div>③ <b>「▶ すすめ！」</b> ボタンをおす</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              🍓🍇 くだものをとると ボーナス！
            </div>
            <div>
              ⭐ すくないブロックで ゴールするほど<br />
              たくさんの ほしが もらえるよ！
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(
              [
                { icon: '➡️', label: 'みぎへ',   desc: '1マス みぎに すすむ',               color: '#3ECFB2' },
                { icon: '⬅️', label: 'ひだりへ', desc: '1マス ひだりに すすむ',             color: '#FF5FA0' },
                { icon: '⬇️', label: 'したへ',   desc: '1マス したに すすむ',               color: '#FFD94A' },
                { icon: '⬆️', label: 'うえへ',   desc: '1マス うえに すすむ',               color: '#A78BFA' },
                { icon: '🌟', label: 'ジャンプ', desc: '2マス とびこえる！ かべも こえられる', color: '#FB923C' },
              ] as const
            ).map((b) => (
              <div
                key={b.label}
                style={{
                  background: b.color,
                  borderRadius: 12,
                  border: '3px solid #2D1B4E',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: '3px 3px 0 #2D1B4E',
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#2D1B4E' }}>{b.label}</div>
                  <div style={{ fontSize: 13, color: '#2D1B4E' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
          <button onClick={() => onChangePage(page === 0 ? 1 : 0)} style={btnStyle('#3ECFB2')}>
            {page === 0 ? 'つぎへ →' : '← もどる'}
          </button>
          <button onClick={onClose} style={btnStyle('#FF5FA0', 'white')}>
            とじる ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Result Modal ─── */

interface ResultModalProps {
  type: 'won' | 'lost';
  stars: number;
  fruitsCollected?: number;
  failedStep?: number;
  onRetry: () => void;
  onNext?: () => void;
  hasNext: boolean;
}

export function ResultModal({ type, stars, fruitsCollected, failedStep, onRetry, onNext, hasNext }: ResultModalProps) {
  return (
    <div style={OVERLAY}>
      <div style={{ ...CARD, textAlign: 'center' }}>
        {type === 'won' ? (
          <>
            <div style={{ fontSize: 72, marginBottom: 4, lineHeight: 1 }}>🎉</div>
            <h2
              style={{
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: 36,
                color: '#FF5FA0',
                margin: '0 0 16px',
                textShadow: '3px 3px 0 #FFD94A',
              }}
            >
              クリア！
            </h2>
            <div style={{ fontSize: 44, marginBottom: 12, letterSpacing: 4 }}>
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    opacity: i < stars ? 1 : 0.2,
                    transition: 'opacity 0.3s',
                    display: 'inline-block',
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p style={{ fontSize: 17, color: '#2D1B4E', marginBottom: fruitsCollected != null && fruitsCollected > 0 ? 10 : 22, fontWeight: 700 }}>
              {stars === 3
                ? 'かんぺき！すごいね！🎊'
                : stars === 2
                ? 'よくできました！👏'
                : 'ゴール！つぎはもっとすくないブロックで！'}
            </p>
            {fruitsCollected != null && fruitsCollected > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FFF0F8',
                  border: '3px solid #FFB3D1',
                  borderRadius: 14,
                  padding: '6px 18px',
                  marginBottom: 18,
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontSize: 18,
                  color: '#C2185B',
                  boxShadow: '3px 3px 0 #FFB3D1',
                }}
              >
                <span>くだもの</span>
                <span style={{ fontSize: 22 }}>🍓🍇</span>
                <span>× {fruitsCollected}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 72, marginBottom: 4, lineHeight: 1 }}>😢</div>
            <h2
              style={{
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: 30,
                color: '#3ECFB2',
                margin: '0 0 12px',
                textShadow: '3px 3px 0 #2D1B4E',
              }}
            >
              もういっかい！
            </h2>
            {failedStep != null && failedStep > 0 && (
              <div
                style={{
                  display: 'inline-block',
                  background: '#FFE055',
                  border: '3px solid #2D1B4E',
                  borderRadius: 12,
                  padding: '4px 16px',
                  fontSize: 18,
                  fontFamily: "'Cherry Bomb One', cursive",
                  color: '#2D1B4E',
                  boxShadow: '3px 3px 0 #2D1B4E',
                  marginBottom: 14,
                }}
              >
                💥 {failedStep}てめで まちがえたよ！
              </div>
            )}
            <p style={{ fontSize: 16, color: '#2D1B4E', marginBottom: 22, fontWeight: 700, lineHeight: 1.8 }}>
              フワモンが まよっちゃった！<br />
              もう一度 チャレンジしてね！
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onRetry} style={btnStyle('#FFD94A')}>
            🔄 もういちど
          </button>
          {type === 'won' && hasNext && onNext && (
            <button onClick={onNext} style={btnStyle('#FF5FA0', 'white')}>
              つぎへ →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
