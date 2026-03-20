export const FUWA_COLORS = {
  orange: { body: '#FB923C', inner: '#FED7AA', label: 'オレンジ' },
  pink:   { body: '#FF5FA0', inner: '#FBCFE8', label: 'ピンク'   },
  teal:   { body: '#3ECFB2', inner: '#A7F3D0', label: 'ティール' },
  purple: { body: '#A78BFA', inner: '#DDD6FE', label: 'むらさき' },
  yellow: { body: '#FFD94A', inner: '#FEF9C3', label: 'きいろ'   },
} as const;

export type FuwaColorKey = keyof typeof FUWA_COLORS;

interface Props {
  colorKey: FuwaColorKey;
  size?: number;
}

export default function FuwaMon({ colorKey, size = 60 }: Props) {
  const { body, inner } = FUWA_COLORS[colorKey];

  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      style={{ display: 'block', filter: 'drop-shadow(1px 2px 0px rgba(45,27,78,0.35))' }}
    >
      {/* ─ Ears (drawn first so head overlaps base) ─ */}
      <ellipse cx={12} cy={9} rx={6} ry={8} fill={body} stroke="#2D1B4E" strokeWidth={2.2} />
      <ellipse cx={32} cy={9} rx={6} ry={8} fill={body} stroke="#2D1B4E" strokeWidth={2.2} />
      {/* Ear inner */}
      <ellipse cx={12} cy={10} rx={3.2} ry={4.8} fill={inner} />
      <ellipse cx={32} cy={10} rx={3.2} ry={4.8} fill={inner} />

      {/* ─ Body blob ─ */}
      <ellipse cx={22} cy={30} rx={14} ry={11} fill={body} stroke="#2D1B4E" strokeWidth={2.2} />
      {/* Head */}
      <circle cx={22} cy={19} r={15} fill={body} stroke="#2D1B4E" strokeWidth={2.2} />

      {/* Belly patch */}
      <ellipse cx={22} cy={32} rx={7} ry={5.5} fill={inner} opacity={0.75} />

      {/* ─ Eyes ─ */}
      <circle cx={15} cy={18} r={6} fill="white" stroke="#2D1B4E" strokeWidth={1.6} />
      <circle cx={29} cy={18} r={6} fill="white" stroke="#2D1B4E" strokeWidth={1.6} />
      {/* Pupils */}
      <circle cx={16.5} cy={19} r={3.4} fill="#2D1B4E" />
      <circle cx={30.5} cy={19} r={3.4} fill="#2D1B4E" />
      {/* Eye sparkles */}
      <circle cx={18.5} cy={17} r={1.3} fill="white" />
      <circle cx={32.5} cy={17} r={1.3} fill="white" />

      {/* ─ Blush ─ */}
      <ellipse cx={8}  cy={24} rx={4.5} ry={3} fill="#FF9CAE" opacity={0.6} />
      <ellipse cx={36} cy={24} rx={4.5} ry={3} fill="#FF9CAE" opacity={0.6} />

      {/* ─ Smile ─ */}
      <path
        d="M 14 26 Q 22 34 30 26"
        fill="none"
        stroke="#2D1B4E"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </svg>
  );
}
