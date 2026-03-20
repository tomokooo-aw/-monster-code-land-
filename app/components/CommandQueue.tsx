import type { BlockType } from '../game/types';
import { BLOCK_INFO } from './BlockPalette';

interface Props {
  commands: BlockType[];
  activeIndex: number;
  onRemove: (index: number) => void;
  disabled: boolean;
}

export default function CommandQueue({ commands, activeIndex, onRemove, disabled }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2
          style={{
            fontFamily: "'Cherry Bomb One', cursive",
            fontSize: 20,
            color: '#2D1B4E',
            margin: 0,
            textShadow: 'none',
          }}
        >
          コマンド
        </h2>
        <span
          style={{
            fontFamily: "'Cherry Bomb One', cursive",
            fontSize: 12,
            color: '#FF5FA0',
            fontWeight: 700,
          }}
        >
          {disabled ? '' : 'タップでさくじょ'}
        </span>
      </div>
      <div
        style={{
          minHeight: 68,
          background: 'rgba(255,255,255,0.92)',
          border: '3px solid #FF5FA0',
          borderRadius: 14,
          padding: '8px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          boxShadow: '4px 4px 0 #2D1B4E',
        }}
      >
        {commands.length === 0 && (
          <span
            style={{
              color: '#FFADD8',
              fontFamily: "'Cherry Bomb One', cursive",
              fontSize: 14,
              alignSelf: 'center',
              fontWeight: 700,
            }}
          >
            ブロックをえらんでね ✨
          </span>
        )}
        {commands.map((cmd, i) => {
          const info = BLOCK_INFO[cmd];
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => !disabled && onRemove(i)}
              disabled={disabled}
              title="タップでさくじょ"
              style={{
                background: info.color,
                border: `3px solid #2D1B4E`,
                borderRadius: 10,
                padding: '4px 7px',
                cursor: disabled ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                transform: isActive ? 'scale(1.25)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: isActive
                  ? '0 0 0 3px #FFD94A, 3px 3px 0 #2D1B4E'
                  : '2px 2px 0 #2D1B4E',
                minWidth: 46,
                outline: 'none',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{info.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontWeight: 900,
                  color: '#2D1B4E',
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
