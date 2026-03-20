import type { Level } from './types';

export const LEVELS: Level[] = [
  // ────────────────────────────────────────────────────
  // Lv1: 広いフィールド。右と下だけで行ける
  // ────────────────────────────────────────────────────
  {
    id: 1,
    title: 'レベル1',
    grid: [
      ['start', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'goal',  'empty'],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 3, row: 3 },
    stars3: 6,
    stars2: 8,
    maxCommands: 10,
  },

  // ────────────────────────────────────────────────────
  // Lv2: 中央に壁ブロック。回り道が必要
  // ────────────────────────────────────────────────────
  {
    id: 2,
    title: 'レベル2',
    grid: [
      ['start', 'empty', 'empty', 'fruit_strawberry', 'empty'],
      ['empty', 'wall',  'wall',  'empty',             'empty'],
      ['empty', 'wall',  'wall',  'empty',             'empty'],
      ['empty', 'empty', 'empty', 'empty',             'goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 12,
  },

  // ────────────────────────────────────────────────────
  // Lv3: 壁の列。ジャンプが必要！
  // ────────────────────────────────────────────────────
  {
    id: 3,
    title: 'レベル3',
    grid: [
      ['start', 'empty', 'wall', 'fruit_grape', 'goal' ],
      ['empty', 'empty', 'wall', 'empty',       'empty'],
      ['empty', 'empty', 'wall', 'empty',       'empty'],
      ['empty', 'empty', 'empty','empty',       'empty'],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 0 },
    stars3: 3,
    stars2: 5,
    maxCommands: 8,
  },

  // ────────────────────────────────────────────────────
  // Lv4: 2マスの壁。下から回る
  // 最短: 下×2 右×3 下 = 6手
  // ────────────────────────────────────────────────────
  {
    id: 4,
    title: 'レベル4',
    grid: [
      ['start', 'empty', 'wall',  'empty', 'empty'],
      ['empty', 'empty', 'wall',  'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'goal',  'empty'],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 3, row: 3 },
    stars3: 6,
    stars2: 8,
    maxCommands: 10,
  },

  // ────────────────────────────────────────────────────
  // Lv5: くだものを拾いながらゴールへ
  // 最短: 右×3（いちご取る） 下×3 右 = 7手
  // ────────────────────────────────────────────────────
  {
    id: 5,
    title: 'レベル5',
    grid: [
      ['start', 'empty', 'empty', 'fruit_strawberry', 'empty'],
      ['empty', 'wall',  'wall',  'empty',             'empty'],
      ['empty', 'wall',  'wall',  'empty',             'empty'],
      ['empty', 'empty', 'empty', 'empty',             'goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 11,
  },

  // ────────────────────────────────────────────────────
  // Lv6: 下の行に壁の列。右端を下るルート
  // 最短: 右×3（ぶどう取る） 下×3 右 = 7手
  // ────────────────────────────────────────────────────
  {
    id: 6,
    title: 'レベル6',
    grid: [
      ['start', 'empty', 'empty', 'empty',      'empty'],
      ['empty', 'empty', 'empty', 'empty',      'empty'],
      ['wall',  'wall',  'wall',  'wall',       'empty'],
      ['empty', 'empty', 'empty', 'fruit_grape','goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 11,
  },

  // ────────────────────────────────────────────────────
  // Lv7: 四隅に壁。中央を通るルートを探す
  // 最短: 右×2 下×2 右×2 下 = 7手
  // ────────────────────────────────────────────────────
  {
    id: 7,
    title: 'レベル7',
    grid: [
      ['start', 'empty', 'empty', 'empty',           'wall' ],
      ['empty', 'empty', 'empty', 'empty',           'wall' ],
      ['wall',  'wall',  'empty', 'empty',           'empty'],
      ['empty', 'empty', 'empty', 'fruit_strawberry','goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 11,
  },

  // ────────────────────────────────────────────────────
  // Lv8: ジグザグ壁。正確な計画が必要
  // 最短: 下 右 下×2 右×3 下 = 8手
  // ────────────────────────────────────────────────────
  {
    id: 8,
    title: 'レベル8',
    grid: [
      ['start', 'empty', 'wall',  'empty', 'empty'],
      ['empty', 'empty', 'wall',  'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'wall',  'empty', 'empty', 'goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 12,
  },

  // ────────────────────────────────────────────────────
  // Lv9: 左下が壁で埋まる。くだもの取りながらゴール
  // 最短: 右×3（いちご取る） 下×3 右 = 7手
  // ────────────────────────────────────────────────────
  {
    id: 9,
    title: 'レベル9',
    grid: [
      ['start', 'empty',           'empty', 'empty', 'empty'],
      ['wall',  'empty',           'empty', 'empty', 'empty'],
      ['wall',  'wall',            'empty', 'empty', 'empty'],
      ['wall',  'wall',            'empty', 'fruit_strawberry', 'goal' ],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 7,
    stars2: 9,
    maxCommands: 11,
  },

  // ────────────────────────────────────────────────────
  // Lv10: ジャンプ必須！壁を飛び越えてゴールへ
  // 最短: 右 ジャンプ(右) 下×3 右 = 6手
  // ────────────────────────────────────────────────────
  {
    id: 10,
    title: 'レベル10',
    grid: [
      ['start', 'empty', 'wall',  'empty', 'empty'],
      ['empty', 'wall',  'wall',  'empty', 'wall' ],
      ['wall',  'empty', 'wall',  'empty', 'wall' ],
      ['wall',  'fruit_grape', 'empty', 'empty', 'goal'],
    ],
    start: { col: 0, row: 0 },
    goal:  { col: 4, row: 3 },
    stars3: 6,
    stars2: 8,
    maxCommands: 9,
  },
];
