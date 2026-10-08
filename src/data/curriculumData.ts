export interface RelatedProblem {
  id: string;
  title: string;
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  whatToLearn: string;
  whyImportant: string;
  keyTopics: string[];
  importantConcepts: string[];
  recommendedOrder: string;
  prerequisites: string[];
  relatedProblemIds: RelatedProblem[];
  visualizerTopicId?: string;
  visualizerTopicTitle?: string;
  outcomeCapability: string;
  realWorldApplications: string[];
  commonMistakes: string[];
  suggestedNextStep: string;
}

export const dsaRoadmapStages: RoadmapStage[] = [
  // 1. PROGRAMMING FOUNDATIONS
  {
    id: 'programming-foundations',
    stageNumber: 1,
    title: 'Programming Foundations',
    whatToLearn: 'Variables, data types, control flow (if-else, loops), function signatures, stack frames, scoping, and value vs reference memory semantics.',
    whyImportant: 'Serves as the bedrock of software engineering. All code logic, memory allocation, and execution flows depend on these fundamental primitives.',
    keyTopics: ['Variables & Data Types', 'Control Flow (If/Else & Loops)', 'Function Call Stack & Stack Frames', 'Scope & Memory Allocation'],
    importantConcepts: ['Stack frame allocation and automatic deallocation', 'Pass-by-value vs pass-by-reference semantics', 'Loop termination conditions and bounds', 'Variable mutability vs immutability'],
    recommendedOrder: 'Stage 1 of 12 (Start Here)',
    prerequisites: ['None (Entry Point)'],
    relatedProblemIds: [
      { id: 'two-sum', title: 'Two Sum' },
      { id: 'group-anagrams', title: 'Group Anagrams' }
    ],
    visualizerTopicId: 'arrays',
    visualizerTopicTitle: 'Memory & Array Visualizer',
    outcomeCapability: 'Write structured function logic, trace CPU function call stack frames, and manage transient memory values cleanly.',
    realWorldApplications: ['Writing backend business logic', 'Managing thread execution call stacks', 'Validating API request schemas'],
    commonMistakes: ['Off-by-one loop boundary conditions', 'Mutating uninitialized reference variables', 'Infinite loop execution without exit conditions'],
    suggestedNextStep: 'Stage 2: Arrays & Strings'
  },

  // 2. ARRAYS & STRINGS
  {
    id: 'arrays-strings',
    stageNumber: 2,
    title: 'Arrays & Strings',
    whatToLearn: 'Contiguous memory layout, indexed O(1) random access, dynamic array resizing, string immutability, character encoding (ASCII/Unicode), and array scans.',
    whyImportant: 'Arrays are the fundamental linear data structure in hardware memory. Instant indexing makes them the core building block for high-speed algorithms.',
    keyTopics: ['1D & 2D Contiguous Arrays', 'Dynamic Arrays (ArrayList / Vector)', 'String Manipulation & Immutability', 'Character Frequency Tables'],
    importantConcepts: ['O(1) random access via memory address formula', 'O(N) insertion & deletion element shift overhead', 'Cache line friendliest contiguous layout', 'Two-pointer array convergence'],
    recommendedOrder: 'Stage 2 of 12',
    prerequisites: ['Stage 1: Programming Foundations'],
    relatedProblemIds: [
      { id: 'two-sum', title: 'Two Sum' },
      { id: 'group-anagrams', title: 'Group Anagrams' }
    ],
    visualizerTopicId: 'arrays',
    visualizerTopicTitle: 'Array Operations Visualizer',
    outcomeCapability: 'Manipulate multi-dimensional data grids, implement character frequency hashing, and eliminate linear scan inefficiencies.',
    realWorldApplications: ['Database buffer pool frames', 'Image pixel manipulation matrices', 'High-throughput text search engines'],
    commonMistakes: ['Array Index Out of Bounds errors', 'Re-allocating immutable string instances inside tight loops', 'Ignoring element shift costs on middle insertions'],
    suggestedNextStep: 'Stage 3: Linked Lists'
  },

  // 3. LINKED LISTS
  {
    id: 'linked-lists',
    stageNumber: 3,
    title: 'Linked Lists',
    whatToLearn: 'Dynamic memory allocation via node pointers, singly and doubly linked lists, pointer re-linking, dummy head nodes, and cycle detection.',
    whyImportant: 'Teaches raw pointer management without requiring contiguous memory blocks, enabling dynamic linear structures with O(1) head insertion/deletion.',
    keyTopics: ['Singly Linked List Nodes', 'Doubly Linked Lists & Dummy Heads', 'Pointer Traversal & Reversal', 'Floyd\'s Cycle Detection Algorithm'],
    importantConcepts: ['O(1) insertion & deletion at head node', 'O(N) sequential pointer traversal', 'Slow & fast hare pointer technique', 'In-place memory pointer re-assignment'],
    recommendedOrder: 'Stage 3 of 12',
    prerequisites: ['Stage 2: Arrays & Strings'],
    relatedProblemIds: [
      { id: 'linked-list-cycle-ii', title: 'Linked List Cycle II' },
      { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists' }
    ],
    visualizerTopicId: 'bst',
    visualizerTopicTitle: 'Pointer & Node Visualizer',
    outcomeCapability: 'Manipulate node memory addresses safely, detect circular references in O(1) space, and build dynamic list structures.',
    realWorldApplications: ['LRU Cache doubly linked lists', 'Browser back/forward navigation buffers', 'OS free-memory allocation blocks'],
    commonMistakes: ['Losing head pointer reference (NullPointer / Segmentation Fault)', 'Creating infinite loops by misconfiguring next pointers', 'Forgetting dummy head node optimization'],
    suggestedNextStep: 'Stage 4: Stacks & Queues'
  },

  // 4. STACKS & QUEUES
  {
    id: 'stacks-queues',
    stageNumber: 4,
    title: 'Stacks & Queues',
    whatToLearn: 'LIFO (Last-In-First-Out) and FIFO (First-In-First-Out) linear structures, monotonic stacks, priority queues, and double-ended queues (deque).',
    whyImportant: 'Essential for managing function call stacks, expression evaluation, asynchronous event queues, and BFS/DFS graph traversals.',
    keyTopics: ['Stack (Push, Pop, Peek - LIFO)', 'Queue (Enqueue, Dequeue - FIFO)', 'Monotonic Stack Pattern', 'Deque & Circular Buffers'],
    importantConcepts: ['O(1) push and pop time complexity', 'Monotonic stack maintaining sorted element order', 'Call stack expression evaluation', 'Queue buffer flow management'],
    recommendedOrder: 'Stage 4 of 12',
    prerequisites: ['Stage 2: Arrays & Strings', 'Stage 3: Linked Lists'],
    relatedProblemIds: [
      { id: 'valid-parentheses', title: 'Valid Parentheses' },
      { id: 'daily-temperatures', title: 'Daily Temperatures' },
      { id: 'largest-rectangle-histogram', title: 'Largest Rectangle in Histogram' }
    ],
    visualizerTopicId: 'arrays',
    visualizerTopicTitle: 'Stack & Queue Visualizer',
    outcomeCapability: 'Solve nested symbol matching problems, track next-greater elements using monotonic stacks, and construct task queues.',
    realWorldApplications: ['Browser history undo/redo stacks', 'CPU process scheduling queues', 'Compiler syntax tree parser stacks'],
    commonMistakes: ['Popping from an empty stack (EmptyStackException)', 'Confusing LIFO and FIFO processing order', 'Memory leakage by not clearing un-popped elements'],
    suggestedNextStep: 'Stage 5: Hashing'
  },

  // 5. HASHING
  {
    id: 'hashing',
    stageNumber: 5,
    title: 'Hashing',
    whatToLearn: 'Hash functions, hash map and set data structures, collision resolution (chaining vs open addressing), and O(1) average constant time lookups.',
    whyImportant: 'Replaces expensive linear O(N) searching scans with instant O(1) constant time lookups, enabling massive algorithmic speedups.',
    keyTopics: ['Hash Maps & Hash Sets', 'Hash Functions & Modulo Arithmetic', 'Collision Resolution (Chaining vs Open Addressing)', 'Prefix Sum + Hash Map Pattern'],
    importantConcepts: ['O(1) average lookup and insertion time', 'Load factor and dynamic bucket rehashing', 'Hash code uniform distribution', 'Memory footprint vs query speed trade-off'],
    recommendedOrder: 'Stage 5 of 12',
    prerequisites: ['Stage 2: Arrays & Strings'],
    relatedProblemIds: [
      { id: 'two-sum', title: 'Two Sum' },
      { id: 'group-anagrams', title: 'Group Anagrams' },
      { id: 'subarray-sum-equals-k', title: 'Subarray Sum Equals K' }
    ],
    visualizerTopicId: 'arrays',
    visualizerTopicTitle: 'Hash Table Visualizer',
    outcomeCapability: 'Construct O(1) key-value lookups, track element frequency counts, and solve pair complement search problems in linear time.',
    realWorldApplications: ['Database primary key hash indexes', 'Redis in-memory caching', 'Compiler symbol lookup tables'],
    commonMistakes: ['Ignoring worst-case O(N) time when hash collisions spike', 'Using mutable objects as map keys', 'Accidentally overwriting duplicate keys'],
    suggestedNextStep: 'Stage 6: Searching & Sorting'
  },

  // 6. SEARCHING & SORTING
  {
    id: 'searching-sorting',
    stageNumber: 6,
    title: 'Searching & Sorting',
    whatToLearn: 'Binary search on sorted spaces, comparison sorting (Bubble, Insertion, Quick, Merge Sort), non-comparison sorting (Counting Sort), and monotonic spaces.',
    whyImportant: 'Sorting organizes data to enable O(log N) logarithmic binary searches and optimizes downstream algorithmic processing.',
    keyTopics: ['Binary Search & Monotonic Search Spaces', 'Merge Sort & Quick Sort (O(N log N))', 'Bubble / Insertion Sort (O(N^2))', 'Custom Comparators & Stable Sorting'],
    importantConcepts: ['Binary search low + (high-low)/2 mid calculation', 'Divide-and-conquer array partitioning', 'Sort stability preserving original order', 'Logarithmic search space halving'],
    recommendedOrder: 'Stage 6 of 12',
    prerequisites: ['Stage 2: Arrays & Strings', 'Stage 5: Hashing'],
    relatedProblemIds: [
      { id: 'binary-search', title: 'Binary Search' },
      { id: 'find-first-last-position', title: 'First & Last Position' },
      { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Array' }
    ],
    visualizerTopicId: 'sorting',
    visualizerTopicTitle: 'Sorting & Binary Search Engine',
    outcomeCapability: 'Implement O(log N) binary search on sorted/rotated arrays, master divide-and-conquer partitioning, and write custom comparators.',
    realWorldApplications: ['Search engine result ranking', 'E-commerce price sorting', 'Database B-Tree index range scans'],
    commonMistakes: ['Integer overflow when computing (low + high) / 2', 'Infinite loops caused by wrong boundary updates', 'Applying binary search on unsorted arrays'],
    suggestedNextStep: 'Stage 7: Recursion'
  },

  // 7. RECURSION
  {
    id: 'recursion',
    stageNumber: 7,
    title: 'Recursion',
    whatToLearn: 'Base cases, recursive call stack frames, subproblem reduction, backtracking state space trees, and combinatorial search.',
    whyImportant: 'Provides the essential mental model for tackling tree, graph, dynamic programming, and combinatorial search problems.',
    keyTopics: ['Base Cases & Recursive Step', 'Call Stack Depth & Stack Overflow', 'Backtracking State Space Trees', 'Permutations & Subsets'],
    importantConcepts: ['Mathematical induction base case verification', 'Recursion stack memory overhead', 'Backtracking state restoration (push/pop state)', 'Branching factor & search tree depth'],
    recommendedOrder: 'Stage 7 of 12',
    prerequisites: ['Stage 1: Programming Foundations', 'Stage 4: Stacks & Queues'],
    relatedProblemIds: [
      { id: 'climbing-stairs', title: 'Climbing Stairs' },
      { id: 'flood-fill', title: 'Flood Fill / Path Search' },
      { id: 'valid-parentheses', title: 'Valid Brackets' }
    ],
    visualizerTopicId: 'recursion',
    visualizerTopicTitle: 'Recursion & Backtracking Tree Visualizer',
    outcomeCapability: 'Write elegant recursive algorithms, construct backtracking state space trees, and handle recursive return values.',
    realWorldApplications: ['Directory tree file system traversals', 'Sudoku & Maze solvers', 'JSON / XML document parser tree generation'],
    commonMistakes: ['Missing base cases causing StackOverflowError', 'Forgetting to undo state changes during backtracking', 'Redundant recursive calculations without memoization'],
    suggestedNextStep: 'Stage 8: Trees'
  },

  // 8. TREES
  {
    id: 'trees',
    stageNumber: 8,
    title: 'Trees',
    whatToLearn: 'Binary Trees, Binary Search Trees (BST), Tree Traversals (Inorder, Preorder, Postorder, BFS Level-Order), Heaps / Priority Queues, and Trie prefix trees.',
    whyImportant: 'Trees model hierarchical data, file systems, HTML DOMs, and provide guaranteed O(log N) search/insert operations when balanced.',
    keyTopics: ['Binary Search Tree (BST) Invariant', 'DFS Traversals (Inorder, Preorder, Postorder)', 'BFS Level-Order Traversal using Queue', 'Min-Heap / Max-Heap & Priority Queue'],
    importantConcepts: ['BST Invariant: Left < Root < Right', 'Inorder traversal of BST yields sorted values', 'Heap array indexing formula (2i + 1, 2i + 2)', 'Tree height & balance factor'],
    recommendedOrder: 'Stage 8 of 12',
    prerequisites: ['Stage 7: Recursion', 'Stage 4: Stacks & Queues'],
    relatedProblemIds: [
      { id: 'invert-binary-tree', title: 'Invert Binary Tree' },
      { id: 'validate-binary-search-tree', title: 'Validate BST' },
      { id: 'serialize-deserialize-binary-tree', title: 'Binary Tree Path Sum' }
    ],
    visualizerTopicId: 'bst',
    visualizerTopicTitle: 'BST & Tree Traversal Visualizer',
    outcomeCapability: 'Traverse hierarchical trees recursively and iteratively, validate BST invariants, and utilize Heaps for top-K priority queries.',
    realWorldApplications: ['HTML DOM layout rendering engines', 'File system directory trees', 'Database B+ Tree indexing'],
    commonMistakes: ['Assuming a binary tree is automatically a BST', 'Forgetting to handle null node base cases', 'Degenerating BST into a linear list by inserting sorted items without balancing'],
    suggestedNextStep: 'Stage 9: Graphs'
  },

  // 9. GRAPHS
  {
    id: 'graphs',
    stageNumber: 9,
    title: 'Graphs',
    whatToLearn: 'Graph representations (Adjacency List vs Matrix), BFS for unweighted shortest paths, DFS for connected components, Topological Sort, and Dijkstra\'s algorithm.',
    whyImportant: 'Graphs model complex real-world networks, social relationships, route planning, dependency graphs, and recommendation engines.',
    keyTopics: ['Adjacency List & Matrix Representations', 'BFS for Shortest Path in Unweighted Graphs', 'DFS for Connected Components & Cycle Detection', 'Topological Sort (Kahn\'s Algorithm)', 'Dijkstra\'s Shortest Path Algorithm'],
    importantConcepts: ['Visited set state to prevent infinite loops', 'Queue for BFS level-by-level exploration', 'Recursion/Stack for DFS path discovery', 'In-degree counting for Topological Sort'],
    recommendedOrder: 'Stage 9 of 12',
    prerequisites: ['Stage 8: Trees', 'Stage 4: Stacks & Queues', 'Stage 7: Recursion'],
    relatedProblemIds: [
      { id: 'flood-fill', title: 'Find Path If Exists' },
      { id: 'number-of-islands', title: 'Number of Islands' },
      { id: 'course-schedule-ii', title: 'Word Ladder / Course Schedule' }
    ],
    visualizerTopicId: 'bst',
    visualizerTopicTitle: 'Graph Network Traversal Visualizer',
    outcomeCapability: 'Represent graphs via adjacency lists, implement BFS shortest path queries, detect cycles, and resolve task build dependencies.',
    realWorldApplications: ['GPS navigation shortest path routing', 'Social network recommendation graphs', 'Build systems (Webpack/Make) dependency resolution'],
    commonMistakes: ['Forgetting to mark nodes visited before enqueueing', 'Confusing directed vs undirected edge connections', 'Using BFS on weighted graphs without priority queues'],
    suggestedNextStep: 'Stage 10: Greedy'
  },

  // 10. GREEDY
  {
    id: 'greedy',
    stageNumber: 10,
    title: 'Greedy',
    whatToLearn: 'Greedy choice property, optimal substructure, activity selection, interval scheduling, and fractional knapsack optimization.',
    whyImportant: 'Solves complex optimization problems efficiently in O(N log N) time by making locally optimal decisions at each step without backtracking.',
    keyTopics: ['Greedy Choice Property', 'Interval Scheduling & Overlapping Intervals', 'Activity Selection & Sorting by End Times', 'Huffman Coding & Fractional Knapsack'],
    importantConcepts: ['Locally optimal choice leads to globally optimal solution', 'Sorting input by finish time / ratio', 'Proving greedy correctness', 'No backtracking once choice is made'],
    recommendedOrder: 'Stage 10 of 12',
    prerequisites: ['Stage 6: Searching & Sorting'],
    relatedProblemIds: [
      { id: 'merge-intervals', title: 'Merge Intervals' },
      { id: 'sort-colors', title: 'Sort Colors' },
      { id: 'kth-largest-element-array', title: 'Kth Largest Element' }
    ],
    visualizerTopicId: 'sorting',
    visualizerTopicTitle: 'Greedy Choice Engine',
    outcomeCapability: 'Identify problems where local optimal choices guarantee global optimum, merge interval overlaps, and optimize resource schedules.',
    realWorldApplications: ['Bandwidth packet scheduling', 'Data compression (Huffman coding)', 'Task & CPU resource allocation'],
    commonMistakes: ['Applying greedy choices to problems requiring Dynamic Programming', 'Failing to sort intervals before processing', 'Assuming local choice is globally optimal without proof'],
    suggestedNextStep: 'Stage 11: Dynamic Programming'
  },

  // 11. DYNAMIC PROGRAMMING
  {
    id: 'dynamic-programming',
    stageNumber: 11,
    title: 'Dynamic Programming',
    whatToLearn: 'Overlapping subproblems, optimal substructure, Top-Down Memoization, Bottom-Up Tabulation, and 1D/2D state space optimization.',
    whyImportant: 'Converts exponential O(2^N) brute-force recursive algorithms into fast linear O(N) or polynomial O(N^2) execution time.',
    keyTopics: ['Top-Down Memoization (Recursion + Cache)', 'Bottom-Up Tabulation (Iterative DP Table)', '1D & 2D State Transitions', '0/1 Knapsack & Unbounded Knapsack', 'Space Optimization (Rolling Array)'],
    importantConcepts: ['State definition dp[i][j]', 'Recurrence relation formula', 'Base case initialization', 'Memoization lookup table'],
    recommendedOrder: 'Stage 11 of 12',
    prerequisites: ['Stage 7: Recursion', 'Stage 5: Hashing'],
    relatedProblemIds: [
      { id: 'climbing-stairs', title: 'Climbing Stairs DP' },
      { id: 'coin-change', title: 'Coin Change Minimum DP' },
      { id: 'edit-distance', title: 'Edit Distance String DP' }
    ],
    visualizerTopicId: 'recursion',
    visualizerTopicTitle: 'DP State Transition Visualizer',
    outcomeCapability: 'Formulate DP state transition equations, convert recursive solutions to iterative tables, and optimize space complexity.',
    realWorldApplications: ['DNA sequence alignment (Needleman-Wunsch)', 'Diff algorithms (Git diff / LCS)', 'Financial portfolio optimization'],
    commonMistakes: ['Incorrect DP table index offset base cases', 'Forgetting to memoize subproblem calls', 'Confusing 0/1 Knapsack vs Unbounded Knapsack'],
    suggestedNextStep: 'Stage 12: Advanced DSA'
  },

  // 12. ADVANCED DSA
  {
    id: 'advanced-dsa',
    stageNumber: 12,
    title: 'Advanced DSA',
    whatToLearn: 'Union-Find (Disjoint Set Union - DSU), Segment Trees, Fenwick Trees (Binary Indexed Trees), Trie prefix trees, and Monotonic Queue sliding window optimization.',
    whyImportant: 'Prepares software engineers for high-level system design, complex competitive programming, and senior tech interview scenarios.',
    keyTopics: ['Disjoint Set Union (DSU) with Path Compression', 'Trie (Prefix Tree) for Auto-complete', 'Segment Trees & Range Query Updates', 'Fenwick Tree (Binary Indexed Tree)', 'Monotonic Queue (Sliding Window Maximum)'],
    importantConcepts: ['Path compression & rank heuristics (near O(1) DSU)', 'Prefix tree character branching', 'Range query log N updates', 'Amortized O(1) monotonic queue operations'],
    recommendedOrder: 'Stage 12 of 12 (Mastery Level)',
    prerequisites: ['Stage 8: Trees', 'Stage 9: Graphs', 'Stage 11: Dynamic Programming'],
    relatedProblemIds: [
      { id: 'minimum-window-substring', title: 'Minimum Window Substring' },
      { id: 'largest-rectangle-histogram', title: 'Largest Rectangle in Histogram' },
      { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Array' }
    ],
    visualizerTopicId: 'bst',
    visualizerTopicTitle: 'Advanced Data Structures Engine',
    outcomeCapability: 'Build fast auto-complete prefix trees, perform Range Minimum Queries (RMQ) in O(log N), and solve dynamic connectivity using DSU.',
    realWorldApplications: ['Search engine auto-complete suggestions', 'Network router IP routing prefix lookups', 'Real-time leaderboard rank queries'],
    commonMistakes: ['Omitting path compression in DSU (causing linear tree degradation)', 'Allocating excessive node memory in Tries', 'Using Segment Trees when a simple Prefix Sum array suffices'],
    suggestedNextStep: 'DSA Roadmap Complete! Practice real interview scenarios & Crime Lab debugging.'
  }
];
