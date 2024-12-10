const file = Bun.file(import.meta.dir + "/inputs/day9.txt");
const input = await file.text();

// Puzzle: https://adventofcode.com/2024/day/9

type DiscMap = ReturnType<typeof getDiscMap>;
type DiscBlocks = (number | null)[];

const getDiscMap = (input: string) =>
  input.split("").map((v) => parseInt(v, 10));

const getDiscBlocks = (discMap: DiscMap): DiscBlocks => {
  const discBlocks = [];
  for (let i = 0; i < discMap.length; i += 2) {
    const fileBlocks = discMap[i];
    const freeSpaceBlocks = discMap[i + 1];
    discBlocks.push(...Array(fileBlocks).fill(i / 2));
    if (freeSpaceBlocks) {
      discBlocks.push(...Array(freeSpaceBlocks).fill(null));
    }
  }
  return discBlocks;
};

const fragLeft = (discBlocks: DiscBlocks): DiscBlocks => {
  const clonedBlocks: DiscBlocks = JSON.parse(JSON.stringify(discBlocks));
  for (let i = 0; i < clonedBlocks.length; i++) {
    if (clonedBlocks[i] === null) {
      const lastFileBlockIndex = clonedBlocks.findLastIndex((v) => v !== null);
      // prevent back-tracking
      if (lastFileBlockIndex < i) break;
      // swap
      clonedBlocks[i] = clonedBlocks[lastFileBlockIndex];
      clonedBlocks[lastFileBlockIndex] = null;
    }
  }
  return clonedBlocks;
};

const calculateCheckSum = (discBlocks: DiscBlocks) =>
  discBlocks.reduce<number>((acc, block, i) => {
    if (block === null) return acc;
    return acc + block * i;
  }, 0);

const solve = (input: string) => {
  const discMap = getDiscMap(input);
  const discBlocks = getDiscBlocks(discMap);
  const sortedDiscBlocks = fragLeft(discBlocks);
  return calculateCheckSum(sortedDiscBlocks);
};

console.log(`Part 1: ${solve(input)}`);
