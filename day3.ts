const file = Bun.file(import.meta.dir + "/inputs/day3.txt");
const input = await file.text();

type Instruction = {
  val1: number;
  val2: number;
};

const convertInputToInstructions = (input: string): Instruction[] => {
  const instructionPattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
  return [...input.matchAll(instructionPattern)].map((parsed) => {
    const [, val1, val2] = parsed;
    return {
      val1: parseInt(val1, 10),
      val2: parseInt(val2, 10),
    };
  });
};

const processInstructions = (instructions: Instruction[]) =>
  instructions.reduce((acc, { val1, val2 }) => {
    return acc + val1 * val2;
  }, 0);

const part1 = convertInputToInstructions(input);

console.log(
  `Part 1: sum of 'mul' instructions = ${processInstructions(part1)}`
);

// Part 2: toggle processing based off `do()` and `don't()` commands
const flowControlledInput = input
  .split("do()") // break into segments everywhere work should start
  .map((inputSeg) => inputSeg.split("don't()")[0]) // cut off everything after we should stop
  .join("");

const part2 = convertInputToInstructions(flowControlledInput);

console.log(
  `Part 2: sum of 'mul' instructions w/ process control = ${processInstructions(
    part2
  )}`
);
