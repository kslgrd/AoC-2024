const file = Bun.file(import.meta.dir + "/inputs/day8.txt");
const input = await file.text();

type Grid = ReturnType<typeof build2dGrid>;
type AntennaeMap = ReturnType<typeof mapAntennae>;
type Coord = { row: number; col: number };

const OPEN = ".";
const ANTI_NODE = "#";

const build2dGrid = (input: string) =>
  input.split("\n").map((row) => row.split(""));

const mapAntennae = (grid: Grid) => {
  const antennae = new Map<string, Coord[]>();
  grid.forEach((cols, row) =>
    cols.forEach((val, col) => {
      if (val !== OPEN) {
        if (!antennae.has(val)) antennae.set(val, []);
        antennae.get(val)?.push({ row, col });
      }
    })
  );
  return antennae;
};

const calculateAntiNodeCoords = (antennaeCoords: Coord[]) => {
  const antennaePairs = getCoordPairs(antennaeCoords);
  return antennaePairs.flatMap(calculateOffsetCoords);
};

const getCoordPairs = (coords: Coord[]) => {
  const pairs: [Coord, Coord][] = [];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      pairs.push([coords[i], coords[j]]);
    }
  }
  return pairs;
};

const getGreatestCommonDenominator = (a: number, b: number): number =>
  b === 0 ? a : getGreatestCommonDenominator(b, a % b);

const calculateOffsetCoords = ([
  { row: rowA, col: colA },
  { row: rowB, col: colB },
]: [Coord, Coord]): [Coord, Coord] => {
  const dx = colB - colA;
  const dy = rowB - rowA;
  const g = getGreatestCommonDenominator(Math.abs(dx), Math.abs(dy));
  const stepX = dx / g;
  const stepY = dy / g;

  return [
    { row: rowA - stepY, col: colA - stepX },
    { row: rowB + stepY, col: colB + stepX },
  ];
};

const mapAntiNodesToGrid = (grid: Grid, antennaeMap: AntennaeMap) => {
  const maxRow = grid.length - 1;
  const maxCol = grid[0].length - 1;
  const clonedGrid: Grid = JSON.parse(JSON.stringify(grid));
  [...antennaeMap.entries()].forEach(([antennaValue, coords]) => {
    const antiNodeCoords = calculateAntiNodeCoords(coords);
    for (const { row, col } of antiNodeCoords) {
      if (row < 0 || row > maxRow || col < 0 || col > maxCol) {
        console.log(`${row}|${col} falls off the grid`);
      } else if (clonedGrid[row][col] === antennaValue) {
        console.log(`${row}|${col} already contains ${clonedGrid[row][col]}`);
      } else {
        clonedGrid[row][col] = ANTI_NODE;
      }
    }
  });
  return clonedGrid;
};

const countAntiNodes = (grid: Grid) =>
  grid.reduce((acc, cols) => {
    const antiNodeCount = cols.filter((v) => v === ANTI_NODE).length;
    return (acc += antiNodeCount);
  }, 0);

const solve = (grid: Grid) => {
  const antennaeMap = mapAntennae(grid);
  const antiNodeGrid = mapAntiNodesToGrid(grid, antennaeMap);
  return countAntiNodes(antiNodeGrid);
};

console.log(
  `Part 1: there are ${solve(build2dGrid(input))} antinodes in the grid`
);
