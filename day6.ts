const file = Bun.file(import.meta.dir + "/inputs/day6.txt");
const input = await file.text();

type Grid = ReturnType<typeof build2dGrid>;
type Coord = { row: number; col: number };
// Purposefully ordered to capture the guard's Zoolander-esque inability to turn left
enum Direction {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
}

type LookupTable = (Coord | null)[][];
type GridDirectionalLookup = {
  [key in Direction]: LookupTable;
};

// Initialize the grid and build some lookup tables to efficiently find obstacles
const build2dGrid = (input: string) =>
  input.split("\n").map((row) => row.split(""));

const grid = build2dGrid(input);
const rows = grid.length;
const cols = grid[0].length;
const directions = Object.values(Direction);
const startingDirection = Direction.UP; // I cheated and looked at the input
const obstacle = "#";

// Generate lookup tables that'll map every point on the grid to the position of the
// nearest obstacle it'll hit when traveling in the provided direction
// ... there has to be a better way to write this code, but _whatever_
const lookupTables = directions.reduce<GridDirectionalLookup>((acc, d) => {
  const lookupTable = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  ) as LookupTable;

  // iterate through each column and build the lookup table for traveling up/down
  if (d === Direction.UP || d === Direction.DOWN) {
    for (let col = 0; col < cols; col++) {
      let obstaclePosition: Coord | null = null;
      if (d === Direction.UP) {
        // Start at the top, if we hit an obstacle note its position
        // Anything beneath that will hit it if they're going up
        for (let row = 0; row < rows; row++) {
          if (grid[row][col] === obstacle) obstaclePosition = { row, col };
          lookupTable[row][col] = obstaclePosition;
        }
      } else {
        // Start at the bottom instead, but follow the same basic rules
        for (let row = rows - 1; row >= 0; row--) {
          if (grid[row][col] === obstacle) obstaclePosition = { row, col };
          lookupTable[row][col] = obstaclePosition;
        }
      }
    }
  }

  // iterate through each row and build the lookup table for traveling left/right
  if (d === Direction.LEFT || d === Direction.RIGHT) {
    for (let row = 0; row < rows; row++) {
      let obstaclePosition: Coord | null = null;
      if (d === Direction.LEFT) {
        for (let col = 0; col < cols; col++) {
          if (grid[row][col] === obstacle) obstaclePosition = { row, col };
          lookupTable[row][col] = obstaclePosition;
        }
      } else {
        for (let col = cols - 1; col >= 0; col--) {
          if (grid[row][col] === obstacle) obstaclePosition = { row, col };
          lookupTable[row][col] = obstaclePosition;
        }
      }
    }
  }

  acc[d] = lookupTable;
  return acc;
}, {} as GridDirectionalLookup);

const findInitialPosition = (grid: Grid): Coord => {
  let initialPosition: Coord | undefined = undefined;
  grid.forEach((cols, row) => {
    cols.forEach((v, col) => {
      if (v === startingDirection) {
        initialPosition = { row, col };
      }
    });
  });
  if (!initialPosition) throw new Error("Couldn't find initial position");
  return initialPosition;
};

const findObstacleInPath = (direction: Direction, { row, col }: Coord) =>
  lookupTables[direction][row][col];

const nextDirection = (direction: Direction) => {
  let nextIndex = directions.indexOf(direction) + 1;
  if (nextIndex === directions.length) nextIndex = 0;
  return directions[nextIndex];
};

const positionsInPath = (start: Coord, end: Coord) => {
  const positions: Coord[] = [];
  const { row: r1, col: c1 } = start;
  const { row: r2, col: c2 } = end;

  // we're traveling along a row
  if (r1 === r2) {
    const step = c2 > c1 ? 1 : -1;
    for (let col = c1 + step; col !== c2; col += step) {
      positions.push({ col, row: r1 });
    }
    // or along a column
  } else {
    const step = r2 > r1 ? 1 : -1;
    for (let row = r1 + step; row !== r2; row += step) {
      positions.push({ col: c1, row });
    }
  }
  return positions;
};

const solve = (grid: Grid) => {
  let direction = startingDirection;
  let guardPosition = findInitialPosition(grid);

  // Use a map and a set so I don't have to care about duplicates
  const visited = new Map<number, Set<number>>();
  const markVisited = (coords: Coord[]) => {
    for (const { row, col } of coords) {
      if (!visited.has(row)) visited.set(row, new Set<number>());
      visited.get(row)?.add(col);
    }
    return coords;
  };

  while (true) {
    console.log(
      `Moving ${direction} from row ${guardPosition.row}, col ${guardPosition.col}`
    );
    const obstaclePosition = findObstacleInPath(direction, guardPosition);
    // The guard has left the room
    if (obstaclePosition === null) {
      // Pain in the ass... which cells does he visit on his way out?
      // Hack this in because I know he's going down...
      if (direction === Direction.DOWN) {
        markVisited(
          positionsInPath(guardPosition, {
            col: guardPosition.col,
            row: rows,
          })
        );
      }
      console.log("👋 Bye guard!");
      break;
    }
    console.log(
      `- Obstacle in path at row ${obstaclePosition.row}, col ${obstaclePosition.col}`
    );

    direction = nextDirection(direction);
    const visitedPositions = markVisited(
      positionsInPath(guardPosition, obstaclePosition)
    );
    guardPosition = visitedPositions[visitedPositions.length - 1];
  }

  return [...visited.entries()].reduce((acc, [, cols]) => acc + cols.size, 0);
};

console.log(`Part 1: The guard visited ${solve(grid)} unique points`);
