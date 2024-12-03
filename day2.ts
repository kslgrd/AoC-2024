const file = Bun.file(import.meta.dir + "/inputs/day2.txt");
const input = await file.text();

// (your puzzle input) consists of many reports, one report per line. Each report is a list of numbers called levels that are separated by spaces.

// [...] a report only counts as safe if both of the following are true:

// - The levels are either all increasing or all decreasing.
// - Any two adjacent levels differ by at least one and at most three.

const reports = input
  .split("\n")
  .map((row) => row.split(" ").map((v) => parseInt(v, 10)));

const validateLevel = (
  levelsAreIncreasing: boolean,
  curr: number,
  prev: number
) => {
  // must be increasing or decreasing
  if (curr === prev) return false;

  const diff = curr - prev;
  const valueIsIncreasing = curr > prev ? true : false;

  // level changes can't switch directions
  if (levelsAreIncreasing !== valueIsIncreasing) return false;
  if (Math.abs(diff) > 3) return false;
  return true;
};

const isSafeReport =
  (enableDampener = false) =>
  (report: number[]) => {
    let levelsAreIncreasing: boolean | undefined = undefined;
    for (let i = 1; i < report.length; i++) {
      const curr = report[i];
      const prev = report[i - 1];
      if (levelsAreIncreasing === undefined) levelsAreIncreasing = curr > prev;

      const isValidLevel = validateLevel(levelsAreIncreasing, curr, prev);
      if (!isValidLevel) {
        console.log(
          "Index",
          i,
          "is invalid for",
          report,
          enableDampener ? "Retry enabled" : "No retry"
        );
        return enableDampener ? retryAtFailedValue(report, i) : false;
      }
    }
    if (enableDampener === false) console.log("VALID AFTER DAMPENED");
    return true;
  };

const retryAtFailedValue = (
  report: number[],
  invalidLevelIndex: number
): boolean => {
  const isSafeUndampened = isSafeReport(false);

  // It's most likely that the removing the current index will fix it, but removing any previous one _could_ also...
  // might as well try them all!
  const indexesToRemove = [...Array(invalidLevelIndex + 1).keys()].reverse();
  console.log("Try removing indexes in this order", indexesToRemove);

  return indexesToRemove
    .map((i) => removeValueAtIndex(report, i))
    .some(isSafeUndampened);
};

const removeValueAtIndex = (report: number[], index: number) => {
  const filteredReport = [...report];
  filteredReport.splice(index, 1);
  console.log("Retrying with", filteredReport);
  return filteredReport;
};

// Part 1: How many reports are safe?
// console.log(`There are ${reports.filter(isSafeReport()).length} safe reports.`);

console.log(
  `There are ${
    reports.filter(isSafeReport(true)).length
  } safe dampened reports.`
);
