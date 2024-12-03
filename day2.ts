const file = Bun.file(import.meta.dir + "/inputs/day2.txt");
const input = await file.text();

// (your puzzle input) consists of many reports, one report per line. Each report is a list of numbers called levels that are separated by spaces.

// [...] a report only counts as safe if both of the following are true:

// - The levels are either all increasing or all decreasing.
// - Any two adjacent levels differ by at least one and at most three.

const reports = input
  .split("\n")
  .map((row) => row.split(" ").map((v) => parseInt(v, 10)));

enum ValueChange {
  INCREASE = 1,
  DECREASE = -1,
  STATIC = 0,
}

// Part 1: How many reports are safe?
const isSafeReport = (report: number[]) => {
  let levelsAreIncreasing: boolean | undefined = undefined;
  for (let i = 1; i < report.length; i++) {
    const curr = report[i];
    const prev = report[i - 1];
    // must be increasing or decreasing
    if (curr === prev) return false;

    const diff = curr - prev;
    const valueIsIncreasing = curr - prev > 0 ? true : false;
    if (levelsAreIncreasing === undefined)
      levelsAreIncreasing = valueIsIncreasing;
    // level changes can't switch directions
    if (levelsAreIncreasing !== valueIsIncreasing) return false;
    if (Math.abs(diff) > 3) return false;
  }
  return true;
};

console.log(`There are ${reports.filter(isSafeReport).length} safe reports.`);
