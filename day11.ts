const file = Bun.file(import.meta.dir + "/inputs/day11.txt");
const input = await file.text();

// Puzzle: https://adventofcode.com/2024/day/11

const stones = input.split(" ");

const blink = (stones: string[]) => stones.flatMap(onBlink);

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

const repeatBlink = (stones: string[], count: number) =>
  [...Array(count)].reduce((acc) => blink(acc), stones);

console.log(
  `Part 1: we have ${
    repeatBlink(stones, 25).length
  } stones after blinking 25 times.`
);
