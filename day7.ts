const file = Bun.file(import.meta.dir + "/inputs/day7.txt");
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
  let result = numbers[0];
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === "+") {
      result += numbers[i + 1];
    } else if (operations[i] === "*") {
      result *= numbers[i + 1];
    }
  }
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
    if (allOperationCombs.find((ops) => calculate(nums, ops) === total)) {
      acc += total;
    }
    return acc;
  }, 0);
};

console.log(
  `Part 1: sum of possible operations ${solve(["*", "+"], calibrations)}`
);
