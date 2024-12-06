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
const isValidUpdate = (update: number[]) =>
  rules.every((r) => validateRule(update, r));

const validateRule = (update: number[], rule: number[]) => {
  const [firstPage, secondPage] = rule;
  const firstPageIndex = update.indexOf(firstPage);
  const secondPageIndex = update.indexOf(secondPage);
  // if both pages from the rule aren't in the update set, order doesn't matter
  if (firstPageIndex === -1 || secondPageIndex === -1) {
    return true;
  }
  return firstPageIndex < secondPageIndex;
};

const { correct, incorrect } = updates.reduce<{
  correct: number[][];
  incorrect: number[][];
}>(
  (acc, update) => {
    if (isValidUpdate(update)) {
      acc.correct.push(update);
    } else {
      acc.incorrect.push(update);
    }
    return acc;
  },
  { correct: [], incorrect: [] }
);

const getMiddleValue = (arr: number[]) => {
  return arr[Math.floor(arr.length / 2)];
};

const solve = (updates: number[][]) => {
  return updates.map(getMiddleValue).reduce((acc, v) => acc + v);
};

console.log(
  `Part 1: sum of middle values from correct updates: ${solve(correct)}`
);

const fixUpdate = (update: number[]) => {
  do {
    for (const rule of rules) {
      if (validateRule(update, rule)) continue;
      const [firstPage, secondPage] = rule;
      const firstPageIndex = update.indexOf(firstPage);
      const secondPageIndex = update.indexOf(secondPage);
      movePage(update, firstPageIndex, secondPageIndex);
    }
  } while (!isValidUpdate(update));
  return update;
};

const movePage = (update: number[], fromIndex: number, toIndex: number) => {
  // doing this in place actually makes my life easier...
  const page = update[fromIndex];
  update.splice(fromIndex, 1);
  update.splice(toIndex, 0, page);
};

const fixed = incorrect.map(fixUpdate);

console.log(`Part 2: sum of middle values from fixed updates: ${solve(fixed)}`);
