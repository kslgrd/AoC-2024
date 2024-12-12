const file = Bun.file(import.meta.dir + "/inputs/day12.txt");
const input = await file.text();

// Puzzle: https://adventofcode.com/2024/day/12

type Grid = ReturnType<typeof build2dGrid>;
type Coord = { row: number; col: number };
type Plot = Coord[];
type PerimeterCounts = ReturnType<typeof calcGridPerimeterCount>;

const build2dGrid = (input: string) =>
  input.split("\n").map((row) => row.split(""));

const isInGridBoundary = (grid: Grid, { row, col }: Coord) => {
  return row < grid.length && row >= 0 && col < grid[0].length && col >= 0;
};

const getCoordKey = ({ row, col }: Coord) => `${row}|${col}`;

const DIRECTIONS = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

// Get a list of all coords that are part of this plot using flood-fill
const findPlotFromCoord = (
  grid: Grid,
  target: string,
  coord: Coord,
  visited: Set<string>
): Plot => {
  const coordKey = getCoordKey(coord);
  const { row, col } = coord;

  const outOfGridBoundary = !isInGridBoundary(grid, coord);
  const hasBeenVisited = visited.has(coordKey);

  if (outOfGridBoundary || hasBeenVisited) return [];
  if (grid[row][col] !== target) return [];

  visited.add(coordKey);
  const found = [coord];
  // Recursively fill in all directions from our start point
  for (const [dy, dx] of DIRECTIONS) {
    const nextRow = row + dy;
    const nextCol = col + dx;
    found.push(
      ...findPlotFromCoord(
        grid,
        target,
        { row: nextRow, col: nextCol },
        visited
      )
    );
  }

  return found;
};

const mapPlots = (grid: Grid) => {
  const visited = new Set<string>();
  const plots = new Map<string, Coord[]>();
  grid.forEach((cols, row) =>
    cols.forEach((v, col) => {
      const coord = { row, col };
      const coordKey = getCoordKey(coord);
      if (!visited.has(coordKey)) {
        const plotCoords = findPlotFromCoord(grid, v, coord, visited);
        plots.set(`${v}|${coordKey}`, plotCoords);
      }
    })
  );
  return plots;
};

const calcGridPerimeterCount = (grid: Grid) => {
  const perimeters = new Map<string, number>();
  grid.forEach((cols, row) =>
    cols.forEach((v, col) => {
      const coord = { row, col };
      const coordKey = getCoordKey(coord);
      let sharedPerimeterCount = 0;
      for (const [dy, dx] of DIRECTIONS) {
        const nextRow = row + dy;
        const nextCol = col + dx;
        if (
          !isInGridBoundary(grid, { row: nextRow, col: nextCol }) ||
          grid[row][col] !== grid[nextRow][nextCol]
        ) {
          sharedPerimeterCount++;
        }
      }
      perimeters.set(coordKey, sharedPerimeterCount);
    })
  );
  return perimeters;
};

const calcPlotArea = (plot: Plot) => plot.length;

const calcPlotPerimeter = (perimeterCounts: PerimeterCounts, plot: Plot) =>
  plot.reduce((acc, coord) => {
    const perimeterCount = perimeterCounts.get(getCoordKey(coord))!;
    return acc + perimeterCount;
  }, 0);

const solve = (input: string) => {
  const grid = build2dGrid(input);
  const plots = mapPlots(grid);
  const perimeterCounts = calcGridPerimeterCount(grid);
  const priceParams = [...plots.values()].reduce<
    { area: number; perimeter: number }[]
  >((acc, plot) => {
    acc.push({
      area: calcPlotArea(plot),
      perimeter: calcPlotPerimeter(perimeterCounts, plot),
    });
    return acc;
  }, []);
  return priceParams.reduce(
    (acc, { area, perimeter }) => (acc += area * perimeter),
    0
  );
};

const startTime = new Date().getMilliseconds();
console.log(`Part 1: the fencing will cost ${solve(input)}`);
const endTime = new Date().getMilliseconds();
console.log(`Processed in ${endTime - startTime}ms.`);
