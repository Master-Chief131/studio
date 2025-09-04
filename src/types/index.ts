export type User = {
  username: string;
  role: 'admin' | 'player';
};

export type Grid = (number | null)[][];

export type Puzzle = {
  level: number;
  puzzle: Grid;
  solution: Grid;
};

export type PhotoData = {
  imageUrl: string;
  message: string;
};

export type Photos = {
  [level: string]: PhotoData;
};
