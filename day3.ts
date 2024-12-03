const file = Bun.file(import.meta.dir + "/inputs/day3.txt");
const input = await file.text();

const instructionPattern = /(mul)\((\d{1,3}),(\d{1,3})\)/g;
const instructions = [...input.matchAll(instructionPattern)].map((parsed) => {
  const [, command, val1, val2] = parsed;
  return {
    command,
    val1: parseInt(val1, 10),
    val2: parseInt(val2, 10),
  };
});

const step1 = instructions.reduce((acc, { val1, val2 }) => {
  return acc + val1 * val2;
}, 0);

console.log(`Step 1: sum of 'mul' instructions = ${step1}`);
