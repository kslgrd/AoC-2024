const file = Bun.file(import.meta.dir + "/inputs/day5.txt");
const input = await file.text();

// 47|53, means that if an update includes both page number 47 and page number 53,
// then page number 47 must be printed at some point before page number 53.
// (47 doesn't necessarily need to be immediately before 53; other pages are allowed to be between them.)
const [orderingRules, updateSets] = input.split("\n\n");

type Graph = Map<number, Set<number>>;

// Organize the data into a directed graph so I can traverse it
const createGraph = (edges: number[][]) => {
  const graph: Graph = new Map();

  const addNode = (node: number) => {
    if (!graph.has(node)) graph.set(node, new Set());
    return graph.get(node) as Set<number>;
  };

  const addEdge = (nodeA: number, nodeB: number) => {
    const adjacentSet = addNode(nodeA);
    addNode(nodeB);
    adjacentSet.add(nodeB);
  };

  edges.forEach(([a, b]) => addEdge(a, b));
  return graph;
};

const edges = orderingRules
  .split("\n")
  .map((edge) => edge.split("|").map((v) => parseInt(v, 10)));

const pageGraph = createGraph(edges);

// Topologically sort all the nodes of the supplied graph, praying that it's acyclic...
const topSortGraph = (graph: Graph) => {
  // Because all nodes have the same in-degree (I deleted the code, but take my word for it), we don't know where to start...
  // We'll just arbitrarily start traversing
  const nodes = [...graph.keys()];

  // Keep track of visited nodes to avoid infinite recursion loops (I think 🤔)
  const visitedNodes = new Set();
  const orderedNodes: number[] = [];

  // Helper method to let us recursively traverse each node of the graph
  // By keeping track of which nodes we've already visited, we should eventually find
  // the very last node in the graph (the one with all its neighbors already visited)
  const traverseGraphFromNode = (node: number) => {
    visitedNodes.add(node);
    const neighbors = graph.get(node) as Set<number>;
    for (const neighbor of neighbors) {
      if (!visitedNodes.has(neighbor)) {
        traverseGraphFromNode(neighbor);
      }
    }
    // after traversing all adjacent nodes, prepend this node to our ordered array (all adjacent nodes have to come after it)
    orderedNodes.unshift(node);
  };

  // Traverse the graph until we (hopefully) find the end, then spool our way back add items to our ordered array
  nodes.forEach((node) => {
    if (!visitedNodes.has(node)) {
      traverseGraphFromNode(node);
    }
  });

  return orderedNodes;
};

// Pages sorted into the proper order...
const sortedPages = topSortGraph(pageGraph);
console.log(sortedPages);

// Part 1:
