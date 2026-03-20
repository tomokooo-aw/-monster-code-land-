import type { BlockType, Direction, Level, Position } from './types';

export interface ExecutionState {
  position: Position;
  facing: Direction;
  collectedFruits: string[];
}

export interface PathStep {
  state: ExecutionState;
  hitWall: boolean;
  reachedGoal: boolean;
  outOfBounds: boolean;
}

const DELTAS: Record<Direction, { dc: number; dr: number }> = {
  right: { dc: 1,  dr: 0  },
  left:  { dc: -1, dr: 0  },
  down:  { dc: 0,  dr: 1  },
  up:    { dc: 0,  dr: -1 },
};

function posKey(pos: Position): string {
  return `${pos.col},${pos.row}`;
}

function movePos(pos: Position, dir: Direction, steps: number): Position {
  return {
    col: pos.col + DELTAS[dir].dc * steps,
    row: pos.row + DELTAS[dir].dr * steps,
  };
}

function inBounds(pos: Position, rows: number, cols: number): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
}

export function initialExecState(level: Level): ExecutionState {
  return { position: level.start, facing: 'right', collectedFruits: [] };
}

export function executeStep(
  block: BlockType,
  state: ExecutionState,
  level: Level
): PathStep {
  const rows = level.grid.length;
  const cols = level.grid[0].length;
  const newFacing: Direction = block === 'jump' ? state.facing : (block as Direction);
  const steps = block === 'jump' ? 2 : 1;
  const target = movePos(state.position, newFacing, steps);

  if (!inBounds(target, rows, cols)) {
    return { state, hitWall: false, reachedGoal: false, outOfBounds: true };
  }

  const cell = level.grid[target.row][target.col];
  if (cell === 'wall') {
    return { state, hitWall: true, reachedGoal: false, outOfBounds: false };
  }

  const newCollected = [...state.collectedFruits];
  const key = posKey(target);
  if ((cell === 'fruit_strawberry' || cell === 'fruit_grape') && !newCollected.includes(key)) {
    newCollected.push(key);
  }

  return {
    state: { position: target, facing: newFacing, collectedFruits: newCollected },
    hitWall: false,
    reachedGoal: cell === 'goal',
    outOfBounds: false,
  };
}

export function computePath(commands: BlockType[], level: Level): PathStep[] {
  const path: PathStep[] = [];
  let current = initialExecState(level);

  for (const cmd of commands) {
    const result = executeStep(cmd, current, level);
    path.push(result);
    if (result.hitWall || result.outOfBounds || result.reachedGoal) break;
    current = result.state;
  }

  return path;
}
