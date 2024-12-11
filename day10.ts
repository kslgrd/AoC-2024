const file = Bun.file(import.meta.dir + "/inputs/day10.txt");
const input = await file.text();

// Puzzle: https://adventofcode.com/2024/day/10

type Grid = ReturnType<typeof build2dGrid>;
type Coord = { row: number; col: number };

const build2dGrid = (input: string) =>
  input.split("\n").map((row) => row.split("").map((v) => parseInt(v, 10)));

const findTrailheads = (grid: Grid): Coord[] =>
  grid.reduce<Coord[]>((acc, cols, row) => {
    cols.forEach((v, col) => {
      if (v === 0) acc.push({ row, col });
    });
    return acc;
  }, []);

// Depth-first search from the provided coord to find all complete paths
const findPaths = (grid: Grid, fromCoord: Coord, accPath: Coord[] = []) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];
  // Add the provided coord to our accumulated path
  const pathWithCurrentStep = [...accPath, fromCoord];
  const { row, col } = fromCoord;
  // Hey, we found a path! Return the completed path
  if (grid[row][col] === 9) {
    console.log(prettyPrintPath(grid, pathWithCurrentStep), "\n\n");
    return [pathWithCurrentStep];
  }

  // Collect the path for all possible next steps
  const paths: Coord[][] = [];
  for (const [dx, dy] of directions) {
    const nextRow = row + dy;
    const nextCol = col + dx;
    if (
      nextRow >= 0 &&
      nextRow < rows &&
      nextCol >= 0 &&
      nextCol < cols &&
      grid[nextRow][nextCol] === grid[row][col] + 1
    ) {
      // Hey! We can take another step along our path in this direction, neat!
      // This'll keep going until it finds every path that'll lead to a 9, or a return an empty array
      const newPaths = findPaths(
        grid,
        { row: nextRow, col: nextCol },
        pathWithCurrentStep
      );
      paths.push(...newPaths);
    }
  }
  // Return any complete paths we found via depth-first search
  return paths;
};

const prettyPrintPath = (grid: Grid, path: Coord[]) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const output = Array.from({ length: rows }, () => Array(cols).fill("."));
  for (const { row, col } of path) {
    output[row][col] = grid[row][col];
  }
  return output.map((c) => c.join("")).join("\n");
};

// Score is the number of reachable peaks (many paths will lead to the same peak)
const scorePaths = (paths: Coord[][]) => {
  const reachablePeaks = new Map<number, Set<number>>();
  for (const path of paths) {
    const peak = path[path.length - 1];
    if (!reachablePeaks.has(peak.row)) reachablePeaks.set(peak.row, new Set());
    reachablePeaks.get(peak.row)?.add(peak.col);
  }
  return [...reachablePeaks.values()]
    .map((v) => v.size)
    .reduce((acc, v) => acc + v);
};

const ratePaths = (paths: Coord[][]) => paths.length;

const solve = (input: string) => {
  const grid = build2dGrid(input);
  const trailheads = findTrailheads(grid);
  return trailheads
    .map((trailhead) => findPaths(grid, trailhead))
    .reduce<{ ratings: number[]; scores: number[] }>(
      (acc, paths) => {
        acc.ratings.push(ratePaths(paths));
        acc.scores.push(scorePaths(paths));
        return acc;
      },
      { ratings: [], scores: [] }
    );
};

const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v);
const { ratings, scores } = solve(input);

console.log(
  `Part 1: the sum of scores for all discovered trailheads is ${sum(scores)}`
);

console.log(
  `Part 2: the sum of ratings for all discovered trailheads is ${sum(ratings)}`
);
