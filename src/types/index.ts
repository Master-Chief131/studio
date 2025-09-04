

export type User = {
  username: string;
  role: 'admin' | 'player';
};

export type Cell = {
  row: number;
  col: number;
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
  description: string;
};

export type Photos = {
  [level: string]: PhotoData;
};

export type HelpQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export type GameState = {
    lives: number;
    isGameOver: boolean;
}
