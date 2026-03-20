import type { BlockType } from '../game/types';

export const BLOCK_INFO: Record<BlockType, { icon: string; color: string; label: string }> = {
  right: { icon: '➡️', color: '#3ECFB2', label: 'みぎへ'   },
  left:  { icon: '⬅️', color: '#FF5FA0', label: 'ひだりへ' },
  down:  { icon: '⬇️', color: '#FFD94A', label: 'したへ'   },
  up:    { icon: '⬆️', color: '#A78BFA', label: 'うえへ'   },
  jump:  { icon: '🌟', color: '#FB923C', label: 'ジャンプ' },
};

const BLOCKS = Object.entries(BLOCK_INFO) as [BlockType, (typeof BLOCK_INFO)[BlockType]][];

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
      {BLOCKS.map(([type, info]) => (
        <button
          key={type}
          onClick={() => onAdd(type)}
          disabled={disabled}
          aria-label={info.label}
          style={{
            background: info.color,
            border: '3px solid #2D1B4E',
            borderRadius: 999,
            boxShadow: disabled ? '0 2px 0 rgba(45,27,78,0.3)' : '0 6px 0 rgba(45,27,78,0.35)',
            padding: '9px 18px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'Cherry Bomb One', cursive",
            fontSize: 15,
            color: '#2D1B4E',
            opacity: disabled ? 0.5 : 1,
            transition: 'transform 0.08s, box-shadow 0.08s',
            userSelect: 'none',
            width: '100%',
          }}
          onPointerDown={(e) => {
            if (!disabled) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(4px) scale(0.93)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 0 rgba(45,27,78,0.35)';
            }
          }}
          onPointerUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 0 rgba(45,27,78,0.35)';
          }}
          onPointerLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 0 rgba(45,27,78,0.35)';
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>{info.icon}</span>
          <span>{info.label}</span>
        </button>
      ))}
    </div>
  );
}
