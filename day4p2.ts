const file = Bun.file(import.meta.dir + "/inputs/day4.txt");
const input = await file.text();

// convert word search to a 2D grid so we can easily traverse it
const grid = input.split("\n").map((row) => row.split(""));
const maxX = grid.length - 1;
const maxY = grid[0].length - 1;

const anchorLetter = "A";
const cornerLetters = ["M", "S"];

type Coordinate = [number, number];

const checkCoordForMatch = (coord: Coordinate) => {
  // fail fast if we'll hit the boundary of the grid
  if (matchCrossesGridBoundary(coord)) return false;
  return formsAnXMas(coord);
};

const matchCrossesGridBoundary = ([initX, initY]: Coordinate) => {
  if (initX === 0 || initX === maxX) return true;
  if (initY === 0 || initY === maxY) return true;
  return false;
};

const formsAnXMas = ([initX, initY]: Coordinate) => {
  const topLeft = grid[initY - 1][initX - 1];
  const topRight = grid[initY - 1][initX + 1];
  const bottomLeft = grid[initY + 1][initX - 1];
  const bottomRight = grid[initY + 1][initX + 1];
  const mas1 = spellsMas(topLeft, bottomRight);
  const mas2 = spellsMas(topRight, bottomLeft);
  return mas1 && mas2;
};

const spellsMas = (letterA: string, letterB: string) => {
  if (!cornerLetters.includes(letterA)) return false;
  if (!cornerLetters.includes(letterB)) return false;
  if (letterA === letterB) return false;
  return true;
};

// get coords for every instance of the first letter of the word
const anchorLetterMatches = grid.reduce<Coordinate[]>((acc, row, yCoord) => {
  const matches = row
    .map((letter, xCoord) => {
      if (letter !== anchorLetter) return null;
      return [xCoord, yCoord] as Coordinate;
    })
    .filter((c) => c !== null);
  return [...acc, ...matches];
}, []);

const matches = anchorLetterMatches
  .map((coord) => checkCoordForMatch(coord))
  .filter(Boolean);

console.log(`Part 2: X-MAS appears ${matches.length} times.`);
