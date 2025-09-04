import type { Puzzle, Grid } from "@/types";

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

// --- Sudoku Transformation Logic ---

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function transformGrid(grid: Grid, numberMap: number[], rowSwaps: number[], colSwaps: number[]): Grid {
    let newGrid = grid.map(row => [...row]);

    // Apply number remap
    newGrid = newGrid.map(row => row.map(cell => cell === null ? null : numberMap[cell - 1]));

    // Apply row and column swaps
    let swappedGrid = newGrid.map(row => [...row]);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            swappedGrid[i][j] = newGrid[rowSwaps[i]][colSwaps[j]];
        }
    }
    
    return swappedGrid;
}

export const transformPuzzle = (puzzle: Puzzle): Puzzle => {
    // 1. Create a random mapping for numbers 1-9
    const numberMap = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // 2. Create random permutations for rows and columns within their 3x3 blocks
    const rowGroup1 = shuffleArray([0, 1, 2]);
    const rowGroup2 = shuffleArray([3, 4, 5]);
    const rowGroup3 = shuffleArray([6, 7, 8]);
    const finalRowSwaps = [...rowGroup1, ...rowGroup2, ...rowGroup3];

    const colGroup1 = shuffleArray([0, 1, 2]);
    const colGroup2 = shuffleArray([3, 4, 5]);
    const colGroup3 = shuffleArray([6, 7, 8]);
    const finalColSwaps = [...colGroup1, ...colGroup2, ...colGroup3];

    // 3. Create random permutations for the 3x3 row and column blocks themselves
    const rowBlockSwaps = shuffleArray([0, 1, 2]);
    const finalRowSwapsWithBlock = rowBlockSwaps.flatMap(block => {
        if (block === 0) return finalRowSwaps.slice(0, 3);
        if (block === 1) return finalRowSwaps.slice(3, 6);
        return finalRowSwaps.slice(6, 9);
    });
    
    const colBlockSwaps = shuffleArray([0, 1, 2]);
    const finalColSwapsWithBlock = colBlockSwaps.flatMap(block => {
        if (block === 0) return finalColSwaps.slice(0, 3);
        if (block === 1) return finalColSwaps.slice(3, 6);
        return finalColSwaps.slice(6, 9);
    });

    const newPuzzleGrid = transformGrid(puzzle.puzzle, numberMap, finalRowSwapsWithBlock, finalColSwapsWithBlock);
    const newSolutionGrid = transformGrid(puzzle.solution, numberMap, finalRowSwapsWithBlock, finalColSwapsWithBlock);

    return {
        ...puzzle,
        puzzle: newPuzzleGrid,
        solution: newSolutionGrid
    };
};
