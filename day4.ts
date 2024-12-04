const file = Bun.file(import.meta.dir + "/inputs/day4.txt");
const input = await file.text();

// convert word search to a 2D grid so we can easily traverse it
const grid = input.split("\n").map((row) => row.split(""));
const maxX = grid.length - 1;
const maxY = grid[0].length - 1;

const word = "XMAS";
const letters = word.split("");

type Coordinate = [number, number];

const checkCoordInDirection = (
  coord: Coordinate,
  direction: [number, number]
) => {
  // fail fast if we'll hit the boundary of the grid
  if (wordCrossesGridBoundary(coord, direction)) return false;
  return matchesWordInDirection(coord, direction);
};

const wordCrossesGridBoundary = (
  [initX, initY]: Coordinate,
  [deltaX, deltaY]: [number, number]
) => {
  const xFinal = initX + deltaX * (word.length - 1);
  const yFinal = initY + deltaY * (word.length - 1);
  if (xFinal < 0 || xFinal > maxX) return true;
  if (yFinal < 0 || yFinal > maxY) return true;
  return false;
};

const matchesWordInDirection = (
  [initX, initY]: Coordinate,
  [deltaX, deltaY]: [number, number]
) => {
  // Start at 1 because we already know the first letter matches
  for (let i = 1; i < letters.length; i++) {
    const xCoord = initX + i * deltaX;
    const yCoord = initY + i * deltaY;
    if (letters[i] !== grid[yCoord][xCoord]) return false;
  }
  return true;
};

// get coords for every instance of the first letter of the word
const firstLetterMatches = grid.reduce<Coordinate[]>((acc, row, yCoord) => {
  const matches = row
    .map((letter, xCoord) => {
      if (letter !== letters[0]) return null;
      return [xCoord, yCoord] as Coordinate;
    })
    .filter((c) => c !== null);
  return [...acc, ...matches];
}, []);

// [x,y] delta to travel in each direction to find matches
const directions: [number, number][] = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [-1, -1], // leftUp
  [-1, 1], // leftDown
  [1, 0], // right
  [1, -1], // rightUp
  [1, 1], // rightDown
];

const matches = firstLetterMatches.flatMap((coord) => {
  return directions
    .map((direction) => checkCoordInDirection(coord, direction))
    .filter(Boolean);
});

console.log(`Part 1: XMAS appears ${matches.length} times.`);
