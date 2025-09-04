import type { Puzzle } from "@/types";

// Puzzles from https://sandiway.arizona.edu/sudoku/examples.html
export const puzzles: Puzzle[] = [
  {
    level: 1, // Easy
    puzzle: [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  {
    level: 2, // Medium
    puzzle: [
        [null, null, null, 6, null, null, null, null, 4],
        [null, null, 8, null, null, 2, 7, null, null],
        [7, null, 9, null, null, null, null, null, null],
        [null, null, null, null, 8, null, null, 7, 1],
        [null, 5, null, null, null, null, null, 6, null],
        [6, 8, null, null, 2, null, null, null, null],
        [null, null, null, null, null, null, 8, null, 5],
        [null, null, 1, 9, null, null, 3, null, null],
        [2, null, null, null, null, 7, null, null, null],
    ],
    solution: [
        [1, 2, 5, 6, 7, 8, 9, 3, 4],
        [3, 6, 8, 4, 9, 2, 7, 5, 1],
        [7, 4, 9, 5, 1, 3, 6, 8, 2],
        [9, 3, 2, 7, 8, 6, 5, 4, 1],
        [4, 5, 7, 3, 1, 9, 2, 6, 8],
        [6, 8, 1, 2, 5, 4, 3, 9, 7],
        [9, 7, 6, 1, 3, 2, 8, 4, 5],
        [8, 7, 4, 5, 6, 1, 3, 2, 9],
        [2, 1, 3, 8, 4, 7, 5, 9, 6],
    ],
  },
  {
    level: 3, // Hard
    puzzle: [
        [null, 2, null, null, null, null, null, null, null],
        [null, null, null, 6, null, null, null, null, 3],
        [null, 7, 4, null, 8, null, null, null, null],
        [null, null, null, null, null, 3, null, null, 2],
        [null, 8, null, null, 4, null, null, 1, null],
        [6, null, null, 5, null, null, null, null, null],
        [null, null, null, null, 1, null, 7, 8, null],
        [5, null, null, null, null, 9, null, null, null],
        [null, null, null, null, null, null, null, 4, null],
    ],
    solution: [
        [1, 2, 6, 4, 3, 7, 9, 5, 8],
        [8, 9, 5, 6, 2, 1, 4, 7, 3],
        [3, 7, 4, 9, 8, 5, 1, 2, 6],
        [4, 5, 7, 1, 9, 3, 8, 6, 2],
        [9, 8, 3, 2, 4, 6, 5, 1, 7],
        [6, 1, 2, 5, 7, 8, 3, 9, 4],
        [2, 6, 9, 3, 1, 4, 7, 8, 5],
        [5, 4, 8, 7, 6, 9, 2, 3, 1],
        [7, 3, 1, 8, 5, 2, 6, 4, 9],
    ],
  },
  {
    level: 4, // Very Hard
    puzzle: [
        [8, null, null, null, null, null, null, null, null],
        [null, null, 3, 6, null, null, null, null, null],
        [null, 7, null, null, 9, null, 2, null, null],
        [null, 5, null, null, null, 7, null, null, null],
        [null, null, null, null, 4, 5, 7, null, null],
        [null, null, null, 1, null, null, null, 3, null],
        [null, null, 1, null, null, null, null, 6, 8],
        [null, null, 8, 5, null, null, null, 1, null],
        [null, 9, null, null, null, null, 4, null, null],
    ],
    solution: [
        [8, 1, 2, 7, 5, 3, 6, 4, 9],
        [9, 4, 3, 6, 8, 2, 1, 7, 5],
        [6, 7, 5, 4, 9, 1, 2, 8, 3],
        [1, 5, 4, 2, 3, 7, 8, 9, 6],
        [3, 6, 9, 8, 4, 5, 7, 2, 1],
        [2, 8, 7, 1, 6, 9, 5, 3, 4],
        [5, 2, 1, 9, 7, 4, 3, 6, 8],
        [4, 3, 8, 5, 2, 6, 9, 1, 7],
        [7, 9, 6, 3, 1, 8, 4, 5, 2],
    ],
  },
  {
    level: 5, // Expert
    puzzle: [
        [null, null, 5, 3, null, null, null, null, null],
        [8, null, null, null, null, null, null, 2, null],
        [null, 7, null, null, 1, null, 5, null, null],
        [4, null, null, null, null, 5, 3, null, null],
        [null, 1, null, null, 7, null, null, null, 6],
        [null, null, 3, 2, null, null, null, 8, null],
        [null, 6, null, 5, null, null, null, null, 9],
        [null, null, 4, null, null, null, null, 3, null],
        [null, null, null, null, null, 9, 7, null, null],
    ],
    solution: [
        [1, 4, 5, 3, 2, 7, 6, 9, 8],
        [8, 3, 9, 6, 5, 4, 1, 2, 7],
        [6, 7, 2, 9, 1, 8, 5, 4, 3],
        [4, 9, 6, 1, 8, 5, 3, 7, 2],
        [2, 1, 8, 4, 7, 3, 9, 5, 6],
        [7, 5, 3, 2, 9, 6, 4, 8, 1],
        [3, 6, 7, 5, 4, 2, 8, 1, 9],
        [9, 8, 4, 7, 6, 1, 2, 3, 5],
        [5, 2, 1, 8, 3, 9, 7, 6, 4],
    ],
  },
];

export const getPuzzle = (level: number): Puzzle | undefined => {
  return puzzles.find((p) => p.level === level);
};
