const file = Bun.file(import.meta.dir + "/inputs/day11.txt");
const input = await file.text();

// Puzzle: https://adventofcode.com/2024/day/11

const stones = input.split(" ");

const onBlink = (stone: string): string[] => {
  // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
  if (stone === "0") return ["1"];
  // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
  // The left half of the digits are engraved on the new left stone
  // The right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
  if (stone.length % 2 == 0) {
    const midpoint = stone.length / 2;
    return [
      stone.substring(0, midpoint),
      String(parseInt(stone.substring(midpoint))),
    ];
  }
  // If none of the other rules apply, the stone is replaced by a new stone;
  // the old stone's number multiplied by 2024 is engraved on the new stone.
  return [String(parseInt(stone, 10) * 2024)];
};

const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v);

// We only care about the number of stones so we can probably speed things up a lot with memoization
const blinkStoneCountMemo = new Map<string, number>();

const getStoneCountAfterBlinks = (stone: string, blinks: number): number => {
  if (blinks === 0) return 1;
  const key = `${stone}|${blinks}`;
  const cached = blinkStoneCountMemo.get(key);
  if (cached) return cached;
  // Recursively call the function until we hit zero
  // Map it because `onBlink` will return two results for numbers with an even amount of digits
  const counts = onBlink(stone).map((s) =>
    getStoneCountAfterBlinks(s, blinks - 1)
  );
  const count = sum(counts);
  // Cache so we never have to go through that hot mess ever again
  blinkStoneCountMemo.set(key, count);
  return count;
};

const solve = (stones: string[], blinks: number) => {
  const stoneCounts = stones.map((s) => getStoneCountAfterBlinks(s, blinks));
  return sum(stoneCounts);
};

const startTime = new Date().getMilliseconds();
console.log(
  `Part 1: we have ${solve(stones, 25)} stones after blinking 25 times.`
);

console.log(
  `Part 2: we have ${solve(stones, 75)} stones after blinking 75 times.`
);
const endTime = new Date().getMilliseconds();

console.log(
  `Processed in ${endTime - startTime}ms. There are ${
    blinkStoneCountMemo.size
  } entries in the cache.`
);
