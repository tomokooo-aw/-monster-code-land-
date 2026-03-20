export const FUWA_COLORS = {
  orange: { body: '#FF8B6B', inner: '#FFD0C0', label: 'オレンジ' },
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
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{ display: 'block', filter: 'drop-shadow(1px 2px 2px rgba(45,27,78,0.3))' }}
    >
      <defs>
        {/* 耳の虹グラデーション（ピンク→水色→黄色） */}
        <linearGradient id="fuwaEarGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FF9EC0" />
          <stop offset="50%"  stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#FFD94A" />
        </linearGradient>
        {/* ボディのふわふわ光沢 */}
        <radialGradient id="fuwaBodyShine" cx="38%" cy="28%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* ─── 左ふわふわ耳 ─── */}
      <circle cx="9"  cy="14" r="5.5" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="14" cy="10" r="5.2" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="7"  cy="9"  r="5"   fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="12" cy="6"  r="4.5" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      {/* 左耳インナー（虹） */}
      <circle cx="9"  cy="14" r="3.0" fill="url(#fuwaEarGrad)" />
      <circle cx="14" cy="10" r="2.8" fill="url(#fuwaEarGrad)" />
      <circle cx="7"  cy="9"  r="2.8" fill="url(#fuwaEarGrad)" />
      <circle cx="12" cy="6"  r="2.5" fill="url(#fuwaEarGrad)" />

      {/* ─── 右ふわふわ耳 ─── */}
      <circle cx="55" cy="14" r="5.5" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="50" cy="10" r="5.2" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="57" cy="9"  r="5"   fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      <circle cx="52" cy="6"  r="4.5" fill={body} stroke="#2D1B4E" strokeWidth="1.8" />
      {/* 右耳インナー（虹） */}
      <circle cx="55" cy="14" r="3.0" fill="url(#fuwaEarGrad)" />
      <circle cx="50" cy="10" r="2.8" fill="url(#fuwaEarGrad)" />
      <circle cx="57" cy="9"  r="2.8" fill="url(#fuwaEarGrad)" />
      <circle cx="52" cy="6"  r="2.5" fill="url(#fuwaEarGrad)" />

      {/* ─── ボディ ─── */}
      <ellipse cx="32" cy="53" rx="16" ry="11" fill={body} stroke="#2D1B4E" strokeWidth="2" />
      {/* ─── 頭（ふっくら丸） ─── */}
      <circle cx="32" cy="26" r="19" fill={body} stroke="#2D1B4E" strokeWidth="2" />
      {/* 光沢ハイライト */}
      <circle cx="32" cy="26" r="19" fill="url(#fuwaBodyShine)" />

      {/* ─── お腹（薄ピンクの丸模様） ─── */}
      <ellipse cx="32" cy="54" rx="10.5" ry="7.5" fill={inner} opacity="0.92" />

      {/* ─── 目（大きめ・ぬいぐるみ風） ─── */}
      {/* 白目 */}
      <circle cx="22.5" cy="24" r="7.5" fill="white" stroke="#2D1B4E" strokeWidth="1.5" />
      <circle cx="41.5" cy="24" r="7.5" fill="white" stroke="#2D1B4E" strokeWidth="1.5" />
      {/* 黒目 */}
      <circle cx="24"   cy="25" r="4.8" fill="#1A1A2E" />
      <circle cx="43"   cy="25" r="4.8" fill="#1A1A2E" />
      {/* メインハイライト */}
      <circle cx="26.5" cy="22.5" r="2"   fill="white" />
      <circle cx="45.5" cy="22.5" r="2"   fill="white" />
      {/* サブハイライト */}
      <circle cx="22.5" cy="27"   r="1.1" fill="white" opacity="0.65" />
      <circle cx="41.5" cy="27"   r="1.1" fill="white" opacity="0.65" />

      {/* ─── ほっぺ ─── */}
      <ellipse cx="11" cy="33" rx="6"   ry="3.5" fill="#FF9CAE" opacity="0.55" />
      <ellipse cx="53" cy="33" rx="6"   ry="3.5" fill="#FF9CAE" opacity="0.55" />

      {/* ─── にっこり笑顔 ─── */}
      <path
        d="M 21 35 Q 32 46 43 35"
        fill="none"
        stroke="#2D1B4E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
