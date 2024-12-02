const file = Bun.file(import.meta.dir + "/inputs/day1.txt");
const input = await file.text();

// Process the Day 1 input into two lists of numbers
const { left, right } = input
  .split("\n")
  .reduce<{ left: number[]; right: number[] }>(
    (acc, row) => {
      const [left, right] = row.split("   ");
      return {
        left: [...acc.left, parseInt(left, 10)],
        right: [...acc.right, parseInt(right, 10)],
      };
    },
    { left: [], right: [] }
  );

left.sort();
right.sort();

const sum = (values: number[]) => values.reduce((acc, value) => acc + value);

const diffs = left.map((val, index) => Math.abs(val - right[index]));

console.log(`Part 1: ${sum(diffs)}`);

const simScores = left.map((value) => {
  const matches = right.filter((rValue) => rValue === value);
  return value * matches.length;
});

console.log(`Part 2: ${sum(simScores)}`);
