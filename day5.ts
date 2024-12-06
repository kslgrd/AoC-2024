const file = Bun.file(import.meta.dir + "/inputs/day5.txt");
const input = await file.text();

// 47|53, means that if an update includes both page number 47 and page number 53,
// then page number 47 must be printed at some point before page number 53.
// (47 doesn't necessarily need to be immediately before 53; other pages are allowed to be between them.)
const [orderingRules, updateSets] = input.split("\n\n");

const toInt = (v: string) => parseInt(v, 10);

const rules = orderingRules.split("\n").map((r) => r.split("|").map(toInt));
const updates = updateSets.split("\n").map((s) => s.split(",").map(toInt));

// To hell with it, just check every rule for each update set:
const isValidUpdate = (update: number[]) => {
  return rules.every(([firstPage, secondPage]) => {
    const firstPageIndex = update.indexOf(firstPage);
    const secondPageIndex = update.indexOf(secondPage);
    // if both pages from the rule aren't in the update set, order doesn't matter
    if (firstPageIndex === -1 || secondPageIndex === -1) {
      return true;
    }
    return firstPageIndex < secondPageIndex;
  });
};

const correctUpdates = updates.reduce<number[][]>((acc, update) => {
  if (isValidUpdate(update)) acc.push(update);
  return acc;
}, []);

const getMiddleValue = (arr: number[]) => {
  return arr[Math.floor(arr.length / 2)];
};

const solvePart1 = () => {
  return correctUpdates.map(getMiddleValue).reduce((acc, v) => acc + v);
};

console.log(
  `Part 1: sum of middle values from correct updates: ${solvePart1()}`
);
