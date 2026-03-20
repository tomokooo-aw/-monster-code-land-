import type { BlockType } from '../game/types';

export const BLOCK_INFO: Record<BlockType, { icon: string; color: string; label: string }> = {
  left:  { icon: '⬅️', color: '#FF5FA0', label: 'ひだりへ' },
  right: { icon: '➡️', color: '#3ECFB2', label: 'みぎへ'   },
  up:    { icon: '⬆️', color: '#9B8DFF', label: 'うえへ'   },
  down:  { icon: '⬇️', color: '#FFD94A', label: 'したへ'   },
  jump:  { icon: '🌟', color: '#FF8B6B', label: 'ジャンプ' },
};

// 表示順 × テキストカラー
const BLOCKS: { type: BlockType; textColor: string }[] = [
  { type: 'left',  textColor: 'white'   },
  { type: 'right', textColor: '#2D1B4E' },
  { type: 'up',    textColor: 'white'   },
  { type: 'down',  textColor: '#2D1B4E' },
  { type: 'jump',  textColor: 'white'   },
];

interface Props {
  onAdd: (block: BlockType) => void;
  disabled: boolean;
}

export default function BlockPalette({ onAdd, disabled }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h2
        style={{
          fontFamily: "'Cherry Bomb One', cursive",
          fontSize: 18,
          color: '#FF5FA0',
          textAlign: 'center',
          margin: '0 0 4px',
          textShadow: '1px 1px 0 rgba(194,24,91,0.25)',
        }}
      >
        ブロック
      </h2>

      <div
        className="block-palette"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {BLOCKS.map(({ type, textColor }) => {
          const info = BLOCK_INFO[type];
          const isJump = type === 'jump';
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              disabled={disabled}
              aria-label={info.label}
              style={{
                gridColumn: isJump ? 'span 2' : undefined,
                background: info.color,
                border: '4px solid #2D1B4E',
                borderRadius: 18,
                boxShadow: disabled ? '0 2px 0 #2D1B4E' : '0 5px 0 #2D1B4E',
                padding: isJump ? '10px 0' : '10px 0',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: 14,
                color: textColor,
                opacity: disabled ? 0.5 : 1,
                transition: 'transform 0.08s, box-shadow 0.08s',
                userSelect: 'none',
                minHeight: 80,
              }}
              onPointerDown={(e) => {
                if (!disabled) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(5px) scale(0.93)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0px 0 #2D1B4E';
                }
              }}
              onPointerUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = disabled ? '0 2px 0 #2D1B4E' : '0 5px 0 #2D1B4E';
              }}
              onPointerLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = disabled ? '0 2px 0 #2D1B4E' : '0 5px 0 #2D1B4E';
              }}
            >
              <span style={{ fontSize: 42, lineHeight: 1 }}>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
