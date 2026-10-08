export type DSALevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface DSATopicNote {
  id: string;
  title: string;
  category: string;
  level: DSALevel;
  whatItIs: string;
  whyUsed: string;
  howItWorks: string;
  syntax: string;
  codeExamples: CodeSnippetExample[];
  importantRules: string[];
  commonMistakes: string[];
  realWorldUse: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  relatedConcepts: string[];
  practiceQuestions: PracticeQuestion[];
  dsaConnection: string;
}

export const DSA_CATEGORIES = [
  'Foundations & Complexity Analysis',
  'Arrays & Dynamic Scaling',
  'Strings & Pattern Matching',
  'Two Pointers Technique',
  'Sliding Window Pattern',
  'Prefix Sum & Range Queries',
  'Hashing & Hash Maps',
  'Linked Lists',
  'Stacks & Queues',
  'Recursion & Backtracking',
  'Sorting Algorithms',
  'Searching Algorithms & Binary Search',
  'Trees & Binary Search Trees (BST)',
  'Heaps & Priority Queues',
  'Graphs (BFS & DFS)',
  'Shortest Path Algorithms (Dijkstra & Bellman-Ford)',
  'Disjoint Set Union (DSU / Union-Find)',
  'Greedy Algorithms',
  'Dynamic Programming (1D & 2D)',
  'Bit Manipulation',
  'Trie (Prefix Tree)',
  'Advanced Graph Algorithms (Tarjan & Topological Sort)',
  'Segment Trees & Fenwick Trees (BIT)',
  'System Design Algorithms (LRU Cache, Rate Limiter)'
] as const;

export type DSACategory = typeof DSA_CATEGORIES[number];

export const DSA_CATEGORY_TOPIC_MAP: Record<DSACategory, string[]> = {
  'Foundations & Complexity Analysis': ['Time Complexity & Big-O Notation', 'Space Complexity & Auxiliary Memory'],
  'Arrays & Dynamic Scaling': ['Arrays & Contiguous Memory Layout', 'Kadane Algorithm (Max Subarray)'],
  'Strings & Pattern Matching': ['Strings & Frequency Counting', 'KMP Algorithm & Z-Algorithm'],
  'Two Pointers Technique': ['Two Pointers Pattern (2-Sum, Trapping Rainwater)'],
  'Sliding Window Pattern': ['Sliding Window (Fixed & Variable Length)'],
  'Prefix Sum & Range Queries': ['Prefix Sum Arrays & 2D Matrix Sum'],
  'Hashing & Hash Maps': ['Hash Tables & Collision Resolution (Chaining vs Open Addressing)'],
  'Linked Lists': ['Singly & Doubly Linked Lists', 'Floyd Cycle Detection (Fast & Slow Pointers)'],
  'Stacks & Queues': ['Stacks (LIFO) & Monotonic Stacks', 'Queues (FIFO) & Circular Queue'],
  'Recursion & Backtracking': ['Recursion Call Stack & Backtracking (N-Queens, Subsets)'],
  'Sorting Algorithms': ['Bubble, Insertion, Selection Sort', 'Merge Sort & Quick Sort Invariants'],
  'Searching Algorithms & Binary Search': ['Linear Search vs Binary Search', 'Binary Search on Answer Space'],
  'Trees & Binary Search Trees (BST)': ['Tree Traversals (Inorder, Preorder, Postorder, BFS)', 'BST Insertion, Deletion & Validation'],
  'Heaps & Priority Queues': ['Min-Heap & Max-Heap Implementation', 'Kth Largest Element & Top K Frequent'],
  'Graphs (BFS & DFS)': ['Graph Representation (Adjacency Matrix & List)', 'BFS (Shortest Path in Unweighted) & DFS'],
  'Shortest Path Algorithms (Dijkstra & Bellman-Ford)': ['Dijkstra Algorithm for Weighted Graphs', 'Bellman-Ford & Negative Cycle Detection'],
  'Disjoint Set Union (DSU / Union-Find)': ['Disjoint Set Union with Path Compression & Rank'],
  'Greedy Algorithms': ['Greedy Choice Property & Fractional Knapsack', 'Interval Scheduling & Activity Selection'],
  'Dynamic Programming (1D & 2D)': ['DP Fundamentals (Memoization vs Tabulation)', '0/1 Knapsack & Longest Common Subsequence (LCS)'],
  'Bit Manipulation': ['Bitwise Operators (AND, OR, XOR, Shifts)', 'Single Number & Power of Two Check'],
  'Trie (Prefix Tree)': ['Trie Implementation (Insert, Search, StartsWith)'],
  'Advanced Graph Algorithms (Tarjan & Topological Sort)': ['Topological Sort (Kahn Algorithm & DFS)', 'Bridges & Articulation Points (Tarjan)'],
  'Segment Trees & Fenwick Trees (BIT)': ['Segment Tree for Range Minimum/Sum Queries', 'Binary Indexed Tree (Fenwick Tree)'],
  'System Design Algorithms (LRU Cache, Rate Limiter)': ['LRU Cache Design (Hash Map + Doubly Linked List)']
};

function buildComprehensiveDSANote(category: DSACategory, title: string): DSATopicNote {
  let level: DSALevel = 'Beginner';
  if (
    category.includes('Two Pointers') ||
    category.includes('Sliding Window') ||
    category.includes('Trees') ||
    category.includes('Heaps') ||
    category.includes('Graphs') ||
    category.includes('Sorting') ||
    category.includes('Searching')
  ) {
    level = 'Intermediate';
  }
  if (
    category.includes('Shortest Path') ||
    category.includes('Disjoint') ||
    category.includes('Dynamic Programming') ||
    category.includes('Trie') ||
    category.includes('Advanced Graph') ||
    category.includes('Segment Trees') ||
    category.includes('System Design') ||
    title.includes('Kadane') ||
    title.includes('LRU')
  ) {
    level = 'Advanced';
  }

  return {
    id: `dsa-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    category,
    level,
    whatItIs: `**${title}** is an essential Data Structure / Algorithmic concept used to organize data efficiently and optimize computational performance.`,
    whyUsed: `Reduces time complexity from naive O(N^2) brute-force solutions to logarithmic O(log N) or linear O(N) execution bounds.`,
    howItWorks: `Uses structural memory invariants, pointer manipulation, and recursive/iterative state transitions.`,
    syntax: `// ${title} Conceptual Pseudocode\nclass Solution {\n    public int solve(int[] input) {\n        // Algorithmic pattern\n        return 0;\n    }\n}`,
    codeExamples: [
      {
        title: `${title} Pseudocode & Pattern`,
        code: `// ${title} Implementation Pattern\nfunction process(data) {\n    let result = 0;\n    // Algorithmic steps\n    return result;\n}`,
        explanation: "Line 2: Target variable initialized.\nLine 3: Core traversal / transformation executed in optimal bounds."
      }
    ],
    importantRules: [
      'Always verify base cases (null pointers, empty arrays, single-element collections).',
      'Analyze both time complexity (iterations/operations) and auxiliary space complexity (call stack / extra memory).'
    ],
    commonMistakes: [
      'Off-by-one index bounds errors in array loops and binary search middle calculations.',
      'Failing to handle disconnected components in graph BFS/DFS traversals.'
    ],
    realWorldUse: `Database indexing (B-Trees), network routing (Shortest path), browser history management (Stack), memory allocation (Heaps), search auto-complete (Trie).`,
    timeComplexity: 'O(1), O(log N), O(N), or O(N log N) depending on invariant.',
    spaceComplexity: 'O(1) in-place auxiliary memory to O(N) recursion/storage.',
    relatedConcepts: ['Big-O Notation', 'Data Structures', 'Algorithms', 'Optimization'],
    practiceQuestions: [
      { question: `What is the core advantage of using ${title}?`, answer: `It drastically optimizes time and space bounds over brute force implementations.` }
    ],
    dsaConnection: `Direct requirement for technical coding interviews at FAANG and top product companies.`
  };
}

class DSANotesService {
  private allNotes: DSATopicNote[] = [];

  constructor() {
    this.generateAllNotes();
  }

  private generateAllNotes() {
    const list: DSATopicNote[] = [];
    (Object.keys(DSA_CATEGORY_TOPIC_MAP) as DSACategory[]).forEach((cat) => {
      const topics = DSA_CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveDSANote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): DSATopicNote[] {
    return this.allNotes;
  }

  public getNoteById(id: string): DSATopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): DSATopicNote[] {
    const q = query.toLowerCase().trim();
    return this.allNotes.filter((note) => {
      const matchesCat = categoryFilter === 'All' || note.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || note.level === levelFilter;
      if (!matchesCat || !matchesLevel) return false;
      if (!q) return true;
      return (
        note.title.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q) ||
        note.whatItIs.toLowerCase().includes(q)
      );
    });
  }
}

export const dsaNotesService = new DSANotesService();
