export type CellType =
  | 'empty'
  | 'start'
  | 'goal'
  | 'wall'
  | 'fruit_strawberry'
  | 'fruit_grape';

export type Direction = 'right' | 'left' | 'down' | 'up';
export type BlockType = 'right' | 'left' | 'down' | 'up' | 'jump';

export interface Position {
  col: number;
  row: number;
}

export interface Level {
  id: number;
  title: string;
  grid: CellType[][];
  start: Position;
  goal: Position;
  stars3: number;
  stars2: number;
  maxCommands: number;
}
