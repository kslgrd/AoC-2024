const file = Bun.file(import.meta.dir + "/inputs/day5.txt");
const input = await file.text();

// 47|53, means that if an update includes both page number 47 and page number 53,
// then page number 47 must be printed at some point before page number 53.
// (47 doesn't necessarily need to be immediately before 53; other pages are allowed to be between them.)
const [orderingRules, updateSets] = input.split("\n\n");
