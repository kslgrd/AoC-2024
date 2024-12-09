const file = Bun.file(import.meta.dir + "/inputs/day7.example.txt");
const input = await file.text();

const getCartesianProduct = (arrays: any[][]) =>
  arrays.reduce(
    (acc, curr) => {
      return acc.flatMap((a) => curr.map((b) => [...a, b]));
    },
    [[]]
  );

const getOperatorCombinations = (operators: string[], slotCount: number) =>
  getCartesianProduct(Array(slotCount).fill(operators));

const calculate = (numbers: number[], operations: string[]) => {
  console.log("- Given", numbers, operations);

  const mergeAt = (i: number): [number[], string[]] => {
    let clonedNumbers = [...numbers];
    let clonedOps = [...operations];
    let nextVal = clonedNumbers.splice(i + 1, 1);
    clonedNumbers[i] = parseInt(`${clonedNumbers[i]}${nextVal}`, 10);
    clonedOps.splice(i, 1);
    console.log("- Merging", clonedNumbers, clonedOps);
    return [clonedNumbers, clonedOps];
  };

  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === "||") {
      const [n, o] = mergeAt(i);
      return calculate(n, o);
    }
  }

  if (numbers.length === 1) return numbers[0];

  let result = numbers[0];
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === "+") {
      result += numbers[i + 1];
    } else if (operations[i] === "*") {
      result *= numbers[i + 1];
    }
  }
  console.log(`- Got ${result}`);
  return result;
};

type Calibration = {
  total: number;
  nums: number[];
};
const calibrations: Calibration[] = input.split("\n").map((row) => {
  const [total, nums] = row.split(": ");
  return {
    total: parseInt(total, 10),
    nums: nums.split(" ").map((n) => parseInt(n, 10)),
  };
});

const solve = (operations: string[], calibrations: Calibration[]) => {
  return calibrations.reduce((acc, { total, nums }) => {
    const allOperationCombs = getOperatorCombinations(
      operations,
      nums.length - 1
    );
    console.log(`Looking for ${total}`);
    if (allOperationCombs.find((ops) => calculate(nums, ops) === total)) {
      console.log("- Matched total");
      acc += total;
    }
    return acc;
  }, 0);
};

// console.log(
//   `Part 1: sum of possible operations ${solve(["*", "+"], calibrations)}`
// );

console.log(
  `Part 1: sum of possible operations ${solve(["*", "+", "||"], calibrations)}`
);
