import { problemsData, type Problem } from './problemsData';

export interface ProblemLevelConfig {
  level: 1 | 2 | 3;
  levelTitle: 'LEVEL 1 — BEGINNER' | 'LEVEL 2 — INTERMEDIATE' | 'LEVEL 3 — ADVANCED';
  subtitle: string;
  purpose: string;
  problemId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recommendedTime: string;
  shortDesc: string;
  characteristics: string[];
  targetMindset: string;
}

export interface ConceptExplanation {
  whatIsIt: string;
  whyHelp: string;
  whenUseful: string;
  howMoves: string;
  patternRecognition: string;
  eli5Analogy: string;
}

export interface ProblemGroup {
  id: string;
  concept: string;
  pattern: string;
  title: string;
  description: string;
  conceptExplanation: ConceptExplanation;
  levels: {
    1: ProblemLevelConfig;
    2: ProblemLevelConfig;
    3: ProblemLevelConfig;
  };
}

export const problemGroupsData: ProblemGroup[] = [
  // 1. TWO POINTERS
  {
    id: 'two-pointers',
    concept: 'Two Pointers',
    pattern: 'Converging & Dual Pointer Movement',
    title: 'Two Pointers Pattern',
    description: 'Optimize O(N^2) nested loop search spaces into linear O(N) by moving two index pointers inward or at varying speeds.',
    conceptExplanation: {
      whatIsIt: 'Two Pointers is a technique where two memory indices iterate through a data structure (usually an array or string) simultaneously to find target combinations or bound ranges.',
      whyHelp: 'Brute-force checking all pairs requires nested loops taking O(N^2) time. Two Pointers leverages array order or invariant properties to skip unnecessary comparisons in O(N) time.',
      whenUseful: 'Use when working with sorted arrays, palindromes, pair sum targets, container boundaries, or fast-slow cycle detection.',
      howMoves: 'Pointers can move inward from opposite ends (left++, right--), move in tandem from left to right (reader-writer), or move at different speeds (fast-slow).',
      patternRecognition: 'Look for phrases like "sorted array", "pair with target sum", "in-place swap", "container boundaries", or "find cycle".',
      eli5Analogy: 'Two people starting at opposite ends of a row of numbered books walking toward each other until their page numbers add up to a target.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand how two pointers move inward on a sorted structure to evaluate pair targets.',
        problemId: 'two-sum',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Pair With Target Sum',
        characteristics: [
          'Straightforward input structure',
          'Direct application of left & right pointers',
          'Minimal edge case handling required'
        ],
        targetMindset: '"I understand how opposite pointers converge to find a matching target value."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Apply two pointers to a multi-variable geometric boundary optimization problem.',
        problemId: 'container-with-most-water',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Container With Most Water',
        characteristics: [
          'Area calculation bottlenecked by shorter height',
          'Decision logic for moving the shorter pointer',
          'Handling dynamic height updates'
        ],
        targetMindset: '"I can recognize how moving the limiting pointer maximizes container capacity."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Recognize and combine two pointers with dynamic bounds to solve complex 2D elevation trapping.',
        problemId: 'trapping-rain-water',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Trapping Rain Water',
        characteristics: [
          'Dual max boundary tracking (left_max & right_max)',
          'Complex elevation map calculations',
          'High optimization constraints requiring O(1) space'
        ],
        targetMindset: '"I can recognize this pattern even when the problem requires tracking multiple dynamic maximum bounds simultaneously."'
      }
    }
  },

  // 2. BINARY SEARCH
  {
    id: 'binary-search',
    concept: 'Binary Search',
    pattern: 'Logarithmic Search Space Reduction',
    title: 'Binary Search Pattern',
    description: 'Systematically halve the search space at each step to find targets or optimal boundary conditions in O(log N) time.',
    conceptExplanation: {
      whatIsIt: 'Binary Search repeatedly divides a sorted search interval in half by comparing the middle element to the target value.',
      whyHelp: 'Linear scanning takes O(N) time. Binary Search eliminates half the remaining elements in every comparison, resulting in O(log N) time complexity.',
      whenUseful: 'Use whenever data is sorted, or when searching for a threshold value across a monotonic range.',
      howMoves: 'Maintain low, mid, and high pointers. Update low = mid + 1 or high = mid - 1 based on the comparison invariant.',
      patternRecognition: 'Look for "sorted array", "find target in O(log N)", "first/last occurrence", or "minimize maximum value".',
      eli5Analogy: 'Opening a physical dictionary right in the middle to quickly determine whether a word comes in the front half or back half.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Master basic binary search on a sorted array without duplicates.',
        problemId: 'binary-search',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Binary Search Target',
        characteristics: [
          'Simple sorted array without duplicate elements',
          'Standard low, mid, high boundary update',
          'Direct return of target index or -1'
        ],
        targetMindset: '"I know how to halve search ranges using low, mid, and high pointers."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Modify binary search to find boundary start and end ranges when duplicate elements exist.',
        problemId: 'find-first-last-position',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'First & Last Position in Sorted Array',
        characteristics: [
          'Duplicate elements in sorted array',
          'Two separate binary search passes for left & right bounds',
          'Handling target not present or single occurrence'
        ],
        targetMindset: '"I can adapt binary search to lock onto boundary edges rather than stopping at the first match."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Apply binary search on a rotated sorted array by identifying which half maintains the sorted invariant.',
        problemId: 'search-in-rotated-sorted-array',
        difficulty: 'Hard',
        recommendedTime: '20 mins',
        shortDesc: 'Search in Rotated Sorted Array',
        characteristics: [
          'Disrupted array order due to unknown pivot rotation',
          'Evaluating sorted half condition before updating pointers',
          'Complex nested condition checks'
        ],
        targetMindset: '"I can apply binary search invariants even when the array is rotated or conditionally partitioned."'
      }
    }
  },

  // 3. SLIDING WINDOW
  {
    id: 'sliding-window',
    concept: 'Sliding Window',
    pattern: 'Contiguous Subarray / Substring Window Expansion & Contraction',
    title: 'Sliding Window Pattern',
    description: 'Maintain a dynamic dynamic contiguous range over arrays or strings to track rolling statistics without recomputing bounds.',
    conceptExplanation: {
      whatIsIt: 'Sliding Window uses two pointers defining a window [left, right] that expands by moving right and contracts by moving left based on constraints.',
      whyHelp: 'Recomputing window sums or character frequency maps for every subarray takes O(N * K) time. Sliding window reuses past results in O(N) time.',
      whenUseful: 'Use for contiguous subarray or substring problems involving maximum/minimum sum, distinct characters, or substring matching.',
      howMoves: 'Expand right pointer to include elements until constraint is violated, then shrink left pointer to restore validity.',
      patternRecognition: 'Look for "contiguous subarray", "longest substring with K distinct characters", "fixed size window K", or "minimum window containing target".',
      eli5Analogy: 'Looking through a moving magnifying glass window over a long strip of film.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand fixed-size window sliding to calculate rolling maximum sums.',
        problemId: 'max-sum-subarray-k',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Maximum Sum Subarray of Size K',
        characteristics: [
          'Fixed window size K',
          'Simple addition when sliding right and subtraction when dropping left',
          'Direct comparison of max window sum'
        ],
        targetMindset: '"I understand how to maintain a rolling sum by adding the new element and removing the old element."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Manage a dynamic variable-length window tracked by character frequency maps.',
        problemId: 'longest-substring-without-repeating',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Longest Substring Without Repeating Characters',
        characteristics: [
          'Dynamic window size expansion & contraction',
          'Hash Set / Frequency Map for unique character tracking',
          'Shrinking left index to eliminate duplicates'
        ],
        targetMindset: '"I can dynamically adjust window boundaries to satisfy unique character constraints."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Solve complex multi-string character matching by finding the minimum valid window substring.',
        problemId: 'minimum-window-substring',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Minimum Window Substring',
        characteristics: [
          'Dual character frequency maps (target count vs current window count)',
          'Forming & expanding valid state before shrinking to optimize minimum length',
          'Multiple edge cases with duplicate required characters'
        ],
        targetMindset: '"I can use sliding window to minimize search intervals under complex multi-character requirement constraints."'
      }
    }
  },

  // 4. HASH MAP & HASHING
  {
    id: 'hash-map',
    concept: 'Hash Map & Hashing',
    pattern: 'O(1) Key-Value Frequency Mapping & Constant Lookup',
    title: 'Hash Map Pattern',
    description: 'Store key-value pairs in memory for instant O(1) average time lookups, frequency counts, and pair matching.',
    conceptExplanation: {
      whatIsIt: 'Hash Map maps keys to memory locations using a hash function, providing O(1) time insertion, deletion, and lookup.',
      whyHelp: 'Searching an array linearly takes O(N) time. Storing visited elements in a Hash Map turns lookups into instantaneous O(1) checks.',
      whenUseful: 'Use for frequency counting, pair finding, anagram grouping, subarray sums, and cached memoization.',
      howMoves: 'Insert items into map (key -> value or key -> index). Query map.has(key) or map.get(key) during iteration.',
      patternRecognition: 'Look for "count frequencies", "find duplicate", "group items by property", "pair sum lookup", or "constant time lookup".',
      eli5Analogy: 'Using a coat check ticket: hand over your coat (key) and instantly retrieve your exact items (value) without searching every hanger.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand character frequency table comparisons.',
        problemId: 'valid-anagram',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Valid Anagram',
        characteristics: [
          'Single frequency count array/map',
          'Increment counts for string 1 and decrement for string 2',
          'Check zero balance invariant'
        ],
        targetMindset: '"I can count and compare item frequencies using a Hash Map."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Group multiple collections by transforming elements into canonical hash keys.',
        problemId: 'group-anagrams',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Group Anagrams',
        characteristics: [
          'Sorted string or character-count key generation',
          'Map of key -> list of matching words',
          'Collection & flattening of grouped values'
        ],
        targetMindset: '"I can transform raw items into canonical hash keys to group related data."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Combine prefix sums with Hash Map lookups to count continuous target subarrays in linear time.',
        problemId: 'subarray-sum-equals-k',
        difficulty: 'Hard',
        recommendedTime: '20 mins',
        shortDesc: 'Subarray Sum Equals K',
        characteristics: [
          'Prefix sum accumulation',
          'Hash Map storing frequency of previously seen prefix sums',
          'Checking map for (current_prefix_sum - K)'
        ],
        targetMindset: '"I can combine prefix sums with hash map history to solve complex contiguous array problems in linear time."'
      }
    }
  },

  // 5. LINKED LISTS
  {
    id: 'linked-list',
    concept: 'Linked Lists',
    pattern: 'Sequential Node Pointer Manipulation',
    title: 'Linked List Pattern',
    description: 'Manipulate memory node pointers sequentially without contiguous array allocation.',
    conceptExplanation: {
      whatIsIt: 'A Linked List is a linear data structure where elements are stored in nodes, and each node points to the next node in memory via a pointer reference.',
      whyHelp: 'Arrays require contiguous memory and costly O(N) shifts for insertions/deletions. Linked lists allow O(1) insertions/deletions at known pointer nodes.',
      whenUseful: 'Use when modeling queues/stacks, handling dynamic node additions/deletions, or performing in-place list transformations.',
      howMoves: 'Traverse list using pointer references (curr = curr.next). Maintain prev, curr, and next pointers during structural modifications.',
      patternRecognition: 'Look for "ListNode head", "reverse list", "detect cycle", "merge sorted lists", "reorder nodes", or "dummy node".',
      eli5Analogy: 'A treasure hunt where each clue box contains a prize and a written note pointing to where the next clue box is located.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Master in-place pointer reversal using prev, curr, and next pointers.',
        problemId: 'reverse-linked-list',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Reverse Linked List',
        characteristics: [
          'Iterative prev, curr, next pointer updates',
          'In-place modification without extra memory allocation',
          'Returning new head pointer'
        ],
        targetMindset: '"I know how to safely change pointer references without losing the rest of the list."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Use Floyd Cycle Detection (fast & slow pointers) to locate the exact start node of a memory cycle.',
        problemId: 'linked-list-cycle-ii',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Linked List Cycle II (Cycle Start Node)',
        characteristics: [
          'Fast & slow pointer meeting point detection',
          'Mathematical distance proof to locate cycle entry node',
          'Handling non-cyclical terminal null lists'
        ],
        targetMindset: '"I can use fast and slow pointers to detect structural cycles and mathematical entry points."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Merge K sorted linked lists using divide-and-conquer or Min-Heap priority queues.',
        problemId: 'merge-k-sorted-lists',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Merge K Sorted Lists',
        characteristics: [
          'Priority Queue / Min-Heap for head node tracking across K lists',
          'Divide-and-conquer pair merges taking O(N log K) time',
          'Complex edge cases with empty lists or single node lists'
        ],
        targetMindset: '"I can combine linked list pointer merges with heaps to efficiently consolidate multiple sorted structures."'
      }
    }
  },

  // 6. TREES & BST
  {
    id: 'trees-bst',
    concept: 'Trees & BST',
    pattern: 'Hierarchical Traversals (DFS/BFS) & BST Invariants',
    title: 'Trees & Binary Search Trees Pattern',
    description: 'Traverse and manipulate hierarchical tree structures using Depth-First Search (DFS) recursion or Breadth-First Search (BFS) queues.',
    conceptExplanation: {
      whatIsIt: 'A Tree is a non-linear hierarchical data structure consisting of nodes connected by edges, starting from a single root node. A Binary Search Tree (BST) enforces that left_child < parent < right_child.',
      whyHelp: 'Trees represent hierarchical relationships (file systems, HTML DOM) and allow fast O(log N) search, insertion, and deletion when balanced.',
      whenUseful: 'Use for structural hierarchies, ancestor queries, range queries, expression evaluation, and sorted traversals.',
      howMoves: 'Use DFS (Inorder, Preorder, Postorder) via recursion or stack, or BFS (level-order) via a queue.',
      patternRecognition: 'Look for "TreeNode root", "maximum depth", "invert tree", "valid BST", "path sum", or "lowest common ancestor".',
      eli5Analogy: 'A family tree or computer file system folders starting from C: drive branching into subfolders.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand recursive tree traversal by swapping left and right subtrees.',
        problemId: 'invert-binary-tree',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Invert Binary Tree',
        characteristics: [
          'Simple base case (root == null)',
          'Recursive left and right subtree calls',
          'In-place child node swapping'
        ],
        targetMindset: '"I understand how recursive calls visit and modify left and right subtrees."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Validate whether a tree satisfies BST invariants across all deep ancestor subtrees.',
        problemId: 'validate-binary-search-tree',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Validate Binary Search Tree',
        characteristics: [
          'Tracking valid bounds (min_allowed, max_allowed) down the recursive stack',
          'Inorder traversal BST property check',
          'Handling integer overflow boundary values'
        ],
        targetMindset: '"I can enforce global search invariants across deep hierarchical recursive trees."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Serialize a complete binary tree structure into a flat string and reconstruct the exact tree back.',
        problemId: 'serialize-deserialize-binary-tree',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Serialize and Deserialize Binary Tree',
        characteristics: [
          'Encoding structural null pointers into string tokens',
          'Level-order BFS queue or preorder DFS string parsing',
          'Reconstructing pointers while preserving complete tree topology'
        ],
        targetMindset: '"I can encode and decode complex pointer trees to and from flat text streams without losing topology."'
      }
    }
  },

  // 7. DYNAMIC PROGRAMMING
  {
    id: 'dynamic-programming',
    concept: 'Dynamic Programming',
    pattern: 'Overlapping Subproblems & Optimal Substructure',
    title: 'Dynamic Programming Pattern',
    description: 'Break complex optimization problems into smaller overlapping subproblems, caching results to eliminate exponential redundant work.',
    conceptExplanation: {
      whatIsIt: 'Dynamic Programming (DP) solves complex problems by breaking them down into simpler subproblems, storing subproblem answers (memoization/tabulation) so each subproblem is solved only once.',
      whyHelp: 'Naive recursion causes exponential O(2^N) time due to re-computing identical subproblems. DP reduces complexity to polynomial O(N) or O(N * W) time.',
      whenUseful: 'Use for optimization problems (max profit, min cost, fewest steps), counting distinct ways, or sequence alignment.',
      howMoves: 'Define DP state representation (e.g. dp[i]). Establish base cases. Derive state transition recurrence relation.',
      patternRecognition: 'Look for "minimum/maximum steps or cost", "count total distinct ways", "overlapping subproblems", or "knapsack choices".',
      eli5Analogy: 'Writing down 1+1+1+1+1 = 5 on paper. If someone adds +1 at the end, you instantly say 6 because you remembered the previous subtotal instead of recounting from scratch.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand 1D linear DP recurrence relations and base case initialization.',
        problemId: 'climbing-stairs',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Climbing Stairs',
        characteristics: [
          'Linear 1D DP table or 2-variable state tracking',
          'Recurrence: dp[i] = dp[i-1] + dp[i-2]',
          'Direct base case setup for step 1 and step 2'
        ],
        targetMindset: '"I understand how the answer to a larger step builds directly on the cached answers of smaller subproblems."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Solve unbounded knapsack optimization by building a 1D DP array for target amounts.',
        problemId: 'coin-change',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Coin Change (Minimum Coins)',
        characteristics: [
          'Unbounded coin selection subproblems',
          'Min-cost transition: dp[i] = min(dp[i], 1 + dp[i - coin])',
          'Handling unreachable target amounts (returning -1)'
        ],
        targetMindset: '"I can construct dynamic transition tables to find optimal minimum choices among multiple decision branches."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Construct a 2D DP matrix for sequence edit operations (insert, delete, replace).',
        problemId: 'edit-distance',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Edit Distance (Levenshtein Distance)',
        characteristics: [
          '2D DP grid: dp[i][j] representing word1[0..i] and word2[0..j]',
          'Three choice branches: min(insert, delete, replace) + 1',
          'Complex boundary conditions and 2D grid initialization'
        ],
        targetMindset: '"I can solve 2D grid sequence alignment problems by evaluating multiple structural modification choices."'
      }
    }
  },

  // 8. GRAPHS & TRAVERSALS
  {
    id: 'graphs-traversals',
    concept: 'Graphs & Traversals',
    pattern: 'Graph Adjacency Networks, BFS Shortest Paths & DFS Topological Sort',
    title: 'Graphs & Network Traversals Pattern',
    description: 'Model network connections using adjacency lists, finding shortest paths via BFS and detecting cycles/dependencies via DFS.',
    conceptExplanation: {
      whatIsIt: 'A Graph consists of vertices (nodes) connected by edges (directed or undirected, weighted or unweighted). Traversals visit connected nodes systematically.',
      whyHelp: 'Graphs represent real-world networks (social connections, street routing, task dependencies, grid maps). Traversals solve reachability and shortest paths.',
      whenUseful: 'Use for network routing, social graphs, island matrix grids, prerequisite scheduling, and shortest path finding.',
      howMoves: 'BFS uses a FIFO queue to explore layer-by-layer (shortest path). DFS uses recursion/stack to go deep down a branch before backtracking. Track visited nodes.',
      patternRecognition: 'Look for "grid matrix of 1s and 0s", "prerequisites list", "shortest transformation path", "connected components", or "topological sort".',
      eli5Analogy: 'Exploring a maze: BFS searches all corridors 1 step away, then 2 steps away. DFS runs down one corridor as far as possible before turning back.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Understand 2D grid matrix traversal and visited cell tracking.',
        problemId: 'flood-fill',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Flood Fill Grid',
        characteristics: [
          '4-directional cardinal grid exploration (up, down, left, right)',
          'Replacing initial color with target color',
          'Base case guard against out-of-bounds or already filled cells'
        ],
        targetMindset: '"I understand how to explore connected grid neighbors using recursive DFS or BFS."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Count distinct connected components in a 2D grid matrix.',
        problemId: 'number-of-islands',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Number of Islands',
        characteristics: [
          'Iterating through 2D grid to launch new island traversals',
          'Sinking visited island land cells (\'1\' -> \'0\')',
          'Counting total separate graph traversals launched'
        ],
        targetMindset: '"I can use graph traversal to identify and isolate separate connected components in a network."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Detect directed graph cycles and compute valid linear dependency orderings (Topological Sort).',
        problemId: 'course-schedule-ii',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Course Schedule II (Topological Sort)',
        characteristics: [
          'Building adjacency list & in-degree array from edge pairs',
          'Kahn\'s algorithm using BFS queue for zero in-degree nodes',
          'Cycle detection if topological ordering cannot include all vertices'
        ],
        targetMindset: '"I can build graph structures from edge pairs and compute valid execution orderings while detecting circular dependencies."'
      }
    }
  },

  // 9. STACKS & QUEUES
  {
    id: 'stacks-queues',
    concept: 'Stacks & Queues',
    pattern: 'LIFO Memory Stack & Monotonic Range Bounds',
    title: 'Stacks & Queues Pattern',
    description: 'Use Last-In-First-Out (LIFO) stacks or First-In-First-Out (FIFO) queues for nested evaluations and monotonic boundary tracking.',
    conceptExplanation: {
      whatIsIt: 'A Stack is a LIFO (Last-In, First-Out) container. A Queue is a FIFO (First-In, First-Out) container. Monotonic stacks maintain elements in sorted order.',
      whyHelp: 'Matching nested brackets or finding the next greater element naive approach takes O(N^2). Monotonic stacks process elements in O(N) time.',
      whenUseful: 'Use for parentheses validation, expression evaluation, undo history, next greater element, and sliding window maximums.',
      howMoves: 'Push items onto stack. When a closing or smaller/larger condition arrives, pop items from stack to evaluate range constraints.',
      patternRecognition: 'Look for "matching parentheses", "next greater element", "histogram area", "daily temperatures", or "undo operations".',
      eli5Analogy: 'A stack of cafeteria plates: the last plate placed on top is the first one taken off.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Master matching nested closing structures using a LIFO stack.',
        problemId: 'valid-parentheses',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Valid Parentheses',
        characteristics: [
          'Push opening brackets onto stack',
          'Pop and check matching type when encountering closing brackets',
          'Check empty stack condition at end'
        ],
        targetMindset: '"I know how to use a LIFO stack to process and validate nested structures."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Use a Monotonic Decreasing Stack to find the next greater element index in linear time.',
        problemId: 'daily-temperatures',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Daily Temperatures (Monotonic Stack)',
        characteristics: [
          'Maintaining stack of indices with decreasing temperature values',
          'Popping stack when current day is warmer to calculate index difference',
          'Achieving linear O(N) time instead of nested O(N^2) loops'
        ],
        targetMindset: '"I can use a monotonic stack to efficiently find the next greater element for all array positions."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Calculate largest rectangular area under a histogram using a monotonic stack to determine left and right boundaries.',
        problemId: 'largest-rectangle-histogram',
        difficulty: 'Hard',
        recommendedTime: '25 mins',
        shortDesc: 'Largest Rectangle in Histogram',
        characteristics: [
          'Monotonic increasing stack storing bar heights & indices',
          'Computing left and right expansion bounds when a shorter bar is popped',
          'Handling dummy zero bar sentinel to flush remaining stack elements'
        ],
        targetMindset: '"I can use monotonic stacks to compute complex geometric boundary ranges across non-uniform data structures."'
      }
    }
  },

  // 10. SORTING & PARTITIONING
  {
    id: 'sorting-partitioning',
    concept: 'Sorting & Partitioning',
    pattern: 'Custom Order Comparators, In-Place Partitioning & Merge Overlaps',
    title: 'Sorting & Partitioning Pattern',
    description: 'Arrange elements into ordered sequences or partition memory ranges to simplify search, interval merges, and selection operations.',
    conceptExplanation: {
      whatIsIt: 'Sorting rearranges elements in a specific order (ascending/descending). Partitioning groups elements around a pivot value (e.g., QuickSelect, Dutch National Flag).',
      whyHelp: 'Unsorted data requires O(N) or O(N^2) checking. Sorting first takes O(N log N) time, but transforms complex overlap or pair problems into simple adjacent comparisons.',
      whenUseful: 'Use for merging intervals, finding median/top-K elements, custom string sorting, and 3-way partitioning.',
      howMoves: 'Sort input array by custom key. Iterate through sorted array to compare adjacent elements (array[i] vs array[i-1]).',
      patternRecognition: 'Look for "merge overlapping intervals", "sort colors 0, 1, 2", "Kth largest element", "custom sort order", or "adjacent comparison".',
      eli5Analogy: 'Sorting a hand of playing cards by number so you can instantly spot pairs, runs, and missing numbers.'
    },
    levels: {
      1: {
        level: 1,
        levelTitle: 'LEVEL 1 — BEGINNER',
        subtitle: 'Learn the Basic Pattern',
        purpose: 'Master 3-way in-place array partitioning (Dutch National Flag algorithm).',
        problemId: 'sort-colors',
        difficulty: 'Easy',
        recommendedTime: '10 mins',
        shortDesc: 'Sort Colors (Dutch National Flag)',
        characteristics: [
          'Three pointers (low, mid, high)',
          'In-place element swaps without allocating extra array memory',
          'Single pass O(N) partitioning'
        ],
        targetMindset: '"I know how to partition an array in-place around pivot values using three pointers."'
      },
      2: {
        level: 2,
        levelTitle: 'LEVEL 2 — INTERMEDIATE',
        subtitle: 'Apply the Pattern Independently',
        purpose: 'Sort intervals by start time and merge overlapping ranges.',
        problemId: 'merge-intervals',
        difficulty: 'Medium',
        recommendedTime: '15 mins',
        shortDesc: 'Merge Intervals',
        characteristics: [
          'Sorting intervals array by custom start index x[0]',
          'Adjacent interval overlap check: merged.last.end >= current.start',
          'Dynamic max end-time update'
        ],
        targetMindset: '"I can sort complex objects to convert multi-interval overlap checks into simple adjacent linear scans."'
      },
      3: {
        level: 3,
        levelTitle: 'LEVEL 3 — ADVANCED',
        subtitle: 'Master the Pattern Independently',
        purpose: 'Find the Kth largest element in an unsorted array using QuickSelect linear average time or Min-Heap selection.',
        problemId: 'kth-largest-element-array',
        difficulty: 'Hard',
        recommendedTime: '20 mins',
        shortDesc: 'Kth Largest Element in an Array',
        characteristics: [
          'QuickSelect partition algorithm with O(N) average time',
          'Min-Heap priority queue of size K',
          'Optimizing space and time bounds without full O(N log N) sorting'
        ],
        targetMindset: '"I can select order statistics without sorting the entire array by leveraging QuickSelect or Heap partitions."'
      }
    }
  }
];

/**
 * Data Integrity & Audit Utility function
 * Verifies that:
 * 1. Every problem group has 3 levels (1, 2, 3)
 * 2. Level 1 ID != Level 2 ID != Level 3 ID (No duplicate level assignments!)
 * 3. Every referenced problem exists in problemsData
 */
export function auditProblemGroups(): {
  isValid: boolean;
  totalGroups: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  issues: string[];
} {
  const issues: string[] = [];
  let level1Count = 0;
  let level2Count = 0;
  let level3Count = 0;

  const problemMap = new Map<string, Problem>();
  problemsData.forEach(p => problemMap.set(p.id, p));

  problemGroupsData.forEach(group => {
    const l1 = group.levels[1];
    const l2 = group.levels[2];
    const l3 = group.levels[3];

    if (!l1 || !l2 || !l3) {
      issues.push(`Group "${group.id}" is missing one or more required levels (1, 2, 3).`);
      return;
    }

    level1Count++;
    level2Count++;
    level3Count++;

    // Constraint check: Unique Level Problems
    if (l1.problemId === l2.problemId) {
      issues.push(`Group "${group.id}" has duplicate problemId between Level 1 and Level 2: "${l1.problemId}"`);
    }
    if (l2.problemId === l3.problemId) {
      issues.push(`Group "${group.id}" has duplicate problemId between Level 2 and Level 3: "${l2.problemId}"`);
    }
    if (l1.problemId === l3.problemId) {
      issues.push(`Group "${group.id}" has duplicate problemId between Level 1 and Level 3: "${l1.problemId}"`);
    }

    // Verify existence in problemsData catalog
    [l1, l2, l3].forEach(lvl => {
      if (!problemMap.has(lvl.problemId)) {
        issues.push(`Group "${group.id}" Level ${lvl.level} references missing problemId "${lvl.problemId}".`);
      }
    });
  });

  return {
    isValid: issues.length === 0,
    totalGroups: problemGroupsData.length,
    level1Count,
    level2Count,
    level3Count,
    issues
  };
}
