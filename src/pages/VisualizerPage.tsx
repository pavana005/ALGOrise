import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Sliders, 
  Eye,
  Layers,
  Shuffle,
  Plus,
  Trash2,
  Search,
  ArrowRight,
  Code,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { TabType } from '../components/layout/Sidebar';
import { useLanguage, type ProgrammingLanguage } from '../context/LanguageContext';
import { triggerMotivationPopup } from '../components/common/MotivationPopup';

export interface VisualizerPageProps {
  onShowDevNotice?: (msg: string) => void;
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
}

export interface PointerMarker {
  label: string;
  index: number;
  color: string;
}

export interface VisualStep {
  array: number[];
  comparingIndices: number[] | null;
  swappingIndices: number[] | null;
  sortedIndices: number[];
  activeIndices: number[];
  pointers?: PointerMarker[];
  description: string;
  totalComparisons: number;
  totalSwaps: number;
  // Specialized DSA Canvas Metadata
  linkedListNodes?: { id: number; val: number; nextId?: number }[];
  stackState?: number[];
  queueState?: number[];
  treeNodes?: { id: number; val: number; leftId?: number; rightId?: number; level?: number }[];
  activeNodeId?: number;
  visitedNodeIds?: number[];
  traversalOrder?: (number | string)[];
  graphNodes?: { id: string; label: string; x: number; y: number }[];
  graphEdges?: { from: string; to: string }[];
  activeEdge?: { from: string; to: string };
  callStack?: { funcName: string; arg: string | number; returnVal?: string | number; isUnwinding?: boolean }[];
  dpTable?: { index: number; value: number | string; formula?: string; isComputing?: boolean; isFinal?: boolean }[];
}

export interface ExampleConfig {
  id: string;
  name: string;
  description: string;
  initialData: number[];
  targetValue?: number;
  windowSize?: number;
  customNodes?: string[];
}

const getAlgorithmCodeSnippet = (subpart: string, category: string, lang: ProgrammingLanguage): string => {
  const snippets: Record<string, Record<string, string>> = {
    'Linear Search': {
      python: `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1`,
      java: `public int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      javascript: `function linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}`,
      c: `int linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      csharp: `public int LinearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.Length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      go: `func linearSearch(arr []int, target int) int {\n    for i, v := range arr {\n        if v == target { return i }\n    }\n    return -1\n}`
    },
    'Binary Search': {
      python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
      java: `public int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      javascript: `function binarySearch(arr, target) {\n    let low = 0, high = arr.length - 1;\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (arr[mid] === target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      c: `int binarySearch(int arr[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      csharp: `public int BinarySearch(int[] arr, int target) {\n    int low = 0, high = arr.Length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      go: `func binarySearch(arr []int, target int) int {\n    low, high := 0, len(arr)-1\n    for low <= high {\n        mid := low + (high-low)/2\n        if arr[mid] == target { return mid }\n        if arr[mid] < target { low = mid + 1 } else { high = mid - 1 }\n    }\n    return -1\n}`
    },
    'Bubble Sort': {
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`,
      java: `public void bubbleSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        boolean swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
      cpp: `void bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
      javascript: `function bubbleSort(arr) {\n    let n = arr.length;\n    for (let i = 0; i < n - 1; i++) {\n        let swapped = false;\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n    return arr;\n}`,
      c: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int swapped = 0;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;\n                swapped = 1;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
      csharp: `public void BubbleSort(int[] arr) {\n    int n = arr.Length;\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
      go: `func bubbleSort(arr []int) {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        swapped := false\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = true\n            }\n        }\n        if !swapped { break }\n    }\n}`
    },
    'Quick Sort': {
      python: `def quick_sort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)\n\ndef partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] < pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1`,
      java: `public void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\nprivate int partition(int[] arr, int low, int high) {\n    int pivot = arr[high], i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;\n        }\n    }\n    int t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;\n    return i + 1;\n}`,
      cpp: `void quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) swap(arr[++i], arr[j]);\n        }\n        swap(arr[i + 1], arr[high]);\n        int pi = i + 1;\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        let pivot = arr[high], i = low - 1;\n        for (let j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++; [arr[i], arr[j]] = [arr[j], arr[i]];\n            }\n        }\n        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n        let pi = i + 1;\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n    return arr;\n}`,
      c: `void quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) { i++; int t=arr[i]; arr[i]=arr[j]; arr[j]=t; }\n        }\n        int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;\n        int pi = i + 1;\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
      csharp: `public void QuickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high], i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) { i++; (arr[i], arr[j]) = (arr[j], arr[i]); }\n        }\n        (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);\n        int pi = i + 1;\n        QuickSort(arr, low, pi - 1);\n        QuickSort(arr, pi + 1, high);\n    }\n}`,
      go: `func quickSort(arr []int, low, high int) {\n    if low < high {\n        pivot := arr[high]\n        i := low - 1\n        for j := low; j < high; j++ {\n            if arr[j] < pivot {\n                i++\n                arr[i], arr[j] = arr[j], arr[i]\n            }\n        }\n        arr[i+1], arr[high] = arr[high], arr[i+1]\n        pi := i + 1\n        quickSort(arr, low, pi-1)\n        quickSort(arr, pi+1, high)\n    }\n}`
    },
    'Two Pointers': {
      python: `def two_sum_sorted(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        curr_sum = arr[left] + arr[right]\n        if curr_sum == target:\n            return [left, right]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []`,
      java: `public int[] twoSumSorted(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) return new int[]{left, right};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}`,
      cpp: `vector<int> twoSumSorted(const vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) return {left, right};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}`,
      javascript: `function twoSumSorted(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left < right) {\n        let sum = arr[left] + arr[right];\n        if (sum === target) return [left, right];\n        else if (sum < target) left++;\n        else right--;\n    }\n    return [];\n}`,
      c: `void twoSumSorted(int arr[], int n, int target, int res[2]) {\n    int left = 0, right = n - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) { res[0] = left; res[1] = right; return; }\n        else if (sum < target) left++;\n        else right--;\n    }\n}`,
      csharp: `public int[] TwoSumSorted(int[] arr, int target) {\n    int left = 0, right = arr.Length - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) return new int[] { left, right };\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[0];\n}`,
      go: `func twoSumSorted(arr []int, target int) []int {\n    left, right := 0, len(arr)-1\n    for left < right {\n        sum := arr[left] + arr[right]\n        if sum == target { return []int{left, right} }\n        if sum < target { left++ } else { right-- }\n    }\n    return nil\n}`
    },
    'In-Place List Reversal': {
      python: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
      java: `public ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      javascript: `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      c: `struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head;\n    while (curr != NULL) {\n        struct ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      csharp: `public ListNode ReverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      go: `func reverseList(head *ListNode) *ListNode {\n    var prev *ListNode\n    curr := head\n    for curr != nil {\n        next := curr.Next\n        curr.Next = prev\n        prev = curr\n        curr = next\n    }\n    return prev\n}`
    }
  };

  if (snippets[subpart] && snippets[subpart][lang]) {
    return snippets[subpart][lang];
  }

  const nameClean = subpart.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  switch (lang) {
    case 'python':
      return `def execute_${nameClean}(data, target=None):\n    # Algorithm execution for ${subpart} in ${category}\n    # Process data and return step states\n    result = []\n    for item in data:\n        if target is not None and item == target:\n            result.append(item)\n    return result`;
    case 'java':
      return `public class ${subpart.replace(/[^a-zA-Z0-9]/g, '')} {\n    public static int execute(int[] data, int target) {\n        // ${subpart} algorithm implementation in Java\n        for (int i = 0; i < data.length; i++) {\n            if (data[i] == target) return i;\n        }\n        return -1;\n    }\n}`;
    case 'cpp':
      return `int execute_${nameClean}(const std::vector<int>& data, int target) {\n    // ${subpart} C++ algorithm logic\n    for (size_t i = 0; i < data.size(); ++i) {\n        if (data[i] == target) return (int)i;\n    }\n    return -1;\n}`;
    case 'javascript':
      return `function execute${subpart.replace(/[^a-zA-Z0-9]/g, '')}(data, target) {\n    // ${subpart} JS implementation\n    return data.findIndex(x => x === target);\n}`;
    case 'c':
      return `int execute_${nameClean}(int data[], int size, int target) {\n    // ${subpart} C code implementation\n    for (int i = 0; i < size; i++) {\n        if (data[i] == target) return i;\n    }\n    return -1;\n}`;
    case 'csharp':
      return `public class ${subpart.replace(/[^a-zA-Z0-9]/g, '')} {\n    public int Execute(int[] data, int target) {\n        // ${subpart} C# logic\n        return System.Array.IndexOf(data, target);\n    }\n}`;
    case 'go':
      return `func execute${subpart.replace(/[^a-zA-Z0-9]/g, '')}(data []int, target int) int {\n    // ${subpart} Go logic\n    for i, v := range data {\n        if v == target { return i }\n    }\n    return -1\n}`;
    default:
      return `// Implementation snippet for ${subpart}`;
  }
};

const getRelatedProblems = (category: string, subpart: string) => {
  if (category === 'SEARCHING' || subpart.includes('Search')) {
    return [
      { id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search' },
      { id: 'find-first-last-position', title: 'First & Last Position in Sorted Array', difficulty: 'Medium', topic: 'Binary Search' },
      { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search' }
    ];
  }
  if (category === 'SORTING' || subpart.includes('Sort')) {
    return [
      { id: 'sort-colors', title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', topic: 'Sorting' },
      { id: 'kth-largest-element-array', title: 'Kth Largest Element in Array', difficulty: 'Medium', topic: 'Heap/Sorting' },
      { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Sorting' }
    ];
  }
  if (category === 'ARRAYS' || subpart.includes('Pointer') || subpart.includes('Window')) {
    return [
      { id: 'container-with-most-water', title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers' },
      { id: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers' },
      { id: 'max-sum-subarray-k', title: 'Maximum Sum Subarray of Size K', difficulty: 'Easy', topic: 'Sliding Window' }
    ];
  }
  if (category === 'STRINGS' || subpart.includes('String') || subpart.includes('Palindrome')) {
    return [
      { id: 'longest-substring-without-repeating', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Strings' },
      { id: 'minimum-window-substring', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Strings' },
      { id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Hash Table' }
    ];
  }
  if (category === 'LINKED_LISTS' || subpart.includes('List')) {
    return [
      { id: 'linked-list-cycle-ii', title: 'Linked List Cycle II', difficulty: 'Medium', topic: 'Linked List' },
      { id: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Linked List' }
    ];
  }
  if (category === 'STACKS_QUEUES' || subpart.includes('Stack') || subpart.includes('Queue')) {
    return [
      { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack' },
      { id: 'daily-temperatures', title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Monotonic Stack' },
      { id: 'largest-rectangle-histogram', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Monotonic Stack' }
    ];
  }
  if (category === 'HASHING' || subpart.includes('Hash')) {
    return [
      { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', topic: 'Hash Table' },
      { id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Hash Table' }
    ];
  }
  if (category === 'TREES_BST' || category === 'HEAPS' || subpart.includes('BST') || subpart.includes('Heap')) {
    return [
      { id: 'invert-binary-tree', title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Trees' },
      { id: 'validate-binary-search-tree', title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST' },
      { id: 'serialize-deserialize-binary-tree', title: 'Serialize & Deserialize Binary Tree', difficulty: 'Hard', topic: 'Trees' }
    ];
  }
  if (category === 'GRAPHS' || subpart.includes('Graph')) {
    return [
      { id: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs' },
      { id: 'course-schedule-ii', title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graphs' },
      { id: 'flood-fill', title: 'Flood Fill', difficulty: 'Easy', topic: 'Graphs' }
    ];
  }
  if (category === 'RECURSION_BACKTRACKING' || subpart.includes('N-Queens')) {
    return [
      { id: 'flood-fill', title: 'Flood Fill (Grid DFS)', difficulty: 'Easy', topic: 'Backtracking' },
      { id: 'course-schedule-ii', title: 'Course Schedule II (DFS Cycle Check)', difficulty: 'Medium', topic: 'Backtracking' }
    ];
  }
  if (category === 'GREEDY' || subpart.includes('Activity')) {
    return [
      { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Greedy' },
      { id: 'kth-largest-element-array', title: 'Kth Largest Element in Array', difficulty: 'Medium', topic: 'Greedy/Selection' }
    ];
  }
  if (category === 'DYNAMIC_PROGRAMMING' || subpart.includes('DP')) {
    return [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming' },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming' },
      { id: 'edit-distance', title: 'Edit Distance', difficulty: 'Hard', topic: 'Dynamic Programming' }
    ];
  }
  return [
    { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays' },
    { id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', topic: 'Searching' }
  ];
};

const getAlgorithmComplexity = (subpart: string, category: string): { best: string; avg: string; worst: string; space: string } => {
  if (subpart.includes('Binary Search')) return { best: 'O(1)', avg: 'O(log N)', worst: 'O(log N)', space: 'O(1)' };
  if (subpart.includes('Jump Search')) return { best: 'O(1)', avg: 'O(√N)', worst: 'O(√N)', space: 'O(1)' };
  if (subpart.includes('Interpolation')) return { best: 'O(1)', avg: 'O(log log N)', worst: 'O(N)', space: 'O(1)' };
  if (subpart.includes('Exponential')) return { best: 'O(1)', avg: 'O(log N)', worst: 'O(log N)', space: 'O(1)' };
  if (subpart.includes('Ternary')) return { best: 'O(1)', avg: 'O(log₃ N)', worst: 'O(log₃ N)', space: 'O(1)' };
  if (subpart.includes('Search')) return { best: 'O(1)', avg: 'O(N)', worst: 'O(N)', space: 'O(1)' };

  if (subpart.includes('Bubble Sort')) return { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)' };
  if (subpart.includes('Selection Sort')) return { best: 'O(N²)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)' };
  if (subpart.includes('Insertion Sort')) return { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)' };
  if (subpart.includes('Merge Sort')) return { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)' };
  if (subpart.includes('Quick Sort')) return { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N²)', space: 'O(log N)' };
  if (subpart.includes('Heap Sort')) return { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)', space: 'O(1)' };
  if (subpart.includes('Shell Sort')) return { best: 'O(N log N)', avg: 'O(N^(4/3))', worst: 'O(N²)', space: 'O(1)' };
  if (subpart.includes('Counting Sort')) return { best: 'O(N + K)', avg: 'O(N + K)', worst: 'O(N + K)', space: 'O(K)' };
  if (subpart.includes('Comb Sort')) return { best: 'O(N log N)', avg: 'O(N² / 2^p)', worst: 'O(N²)', space: 'O(1)' };
  if (subpart.includes('Sort')) return { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N²)', space: 'O(1)' };

  if (category === 'STACKS_QUEUES') return { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(N)' };
  if (category === 'LINKED_LISTS') return { best: 'O(1)', avg: 'O(N)', worst: 'O(N)', space: 'O(1)' };
  if (category === 'TREES_BST') return { best: 'O(N)', avg: 'O(N)', worst: 'O(N)', space: 'O(H)' };
  if (category === 'GRAPHS') return { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' };
  if (category === 'RECURSION_BACKTRACKING') return { best: 'O(N)', avg: 'O(N)', worst: 'O(N)', space: 'O(N)' };
  if (category === 'HEAPS') return { best: 'O(1)', avg: 'O(log N)', worst: 'O(log N)', space: 'O(N)' };
  if (category === 'DYNAMIC_PROGRAMMING') return { best: 'O(N)', avg: 'O(N)', worst: 'O(N)', space: 'O(N)' };

  return { best: 'O(1)', avg: 'O(N)', worst: 'O(N)', space: 'O(1)' };
};

export const VisualizerPage: React.FC<VisualizerPageProps> = ({ onNavigateTab }) => {
  const { preferredLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('SEARCHING');
  const [selectedSubPart, setSelectedSubPart] = useState<string>('Linear Search');
  const [selectedExampleId, setSelectedExampleId] = useState<string>('ex-1');

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(500);

  // Dynamic Inputs for relevant controls
  const [arrayInputText, setArrayInputText] = useState<string>('10, 50, 30, 70, 80, 20');
  const [searchValueInput, setSearchValueInput] = useState<string>('70');
  const [elementInputVal, setElementInputVal] = useState<string>('25');
  const [elementIndexInput, setElementIndexInput] = useState<string>('2');
  const [stackData, setStackData] = useState<number[]>([10, 20, 30]);
  const [queueData, setQueueData] = useState<number[]>([100, 200, 300]);
  const [workingArray, setWorkingArray] = useState<number[]>([10, 50, 30, 70, 80, 20]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMotivationPopup('VISUALIZER', false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Categories list
  const categoriesList = [
    { id: 'SEARCHING', name: 'Searching' },
    { id: 'SORTING', name: 'Sorting' },
    { id: 'ARRAYS', name: 'Arrays' },
    { id: 'STRINGS', name: 'Strings' },
    { id: 'LINKED_LISTS', name: 'Linked Lists' },
    { id: 'STACKS_QUEUES', name: 'Stacks & Queues' },
    { id: 'HASHING', name: 'Hashing' },
    { id: 'TREES_BST', name: 'Trees & BST' },
    { id: 'HEAPS', name: 'Heaps' },
    { id: 'GRAPHS', name: 'Graphs' },
    { id: 'RECURSION_BACKTRACKING', name: 'Recursion & Backtracking' },
    { id: 'GREEDY', name: 'Greedy Algorithms' },
    { id: 'DYNAMIC_PROGRAMMING', name: 'Dynamic Programming' }
  ];

  // Comprehensive Sub-parts Map for Searching (8) and Sorting (14)
  const subPartsMap: Record<string, { id: string; name: string; desc: string }[]> = useMemo(() => ({
    SEARCHING: [
      { id: 'Linear Search', name: 'Linear Search', desc: 'Sequential search element by element.' },
      { id: 'Binary Search', name: 'Binary Search', desc: 'Divide & conquer search on sorted array.' },
      { id: 'Jump Search', name: 'Jump Search', desc: 'Block jumping search by sqrt(N) steps.' },
      { id: 'Interpolation Search', name: 'Interpolation Search', desc: 'Position estimation based on element key values.' },
      { id: 'Exponential Search', name: 'Exponential Search', desc: 'Range bounding via index doubling then binary search.' },
      { id: 'Fibonacci Search', name: 'Fibonacci Search', desc: 'Fibonacci division search without multiplication/division.' },
      { id: 'Ternary Search', name: 'Ternary Search', desc: 'Three-way divide and conquer splitting into 3 ranges.' },
      { id: 'Sentinel Search', name: 'Sentinel Search', desc: 'Search eliminating boundary check in loop using target sentinel.' }
    ],
    SORTING: [
      { id: 'Bubble Sort', name: 'Bubble Sort', desc: 'Repeatedly swap adjacent out-of-order elements.' },
      { id: 'Selection Sort', name: 'Selection Sort', desc: 'Find minimum element in unsorted partition.' },
      { id: 'Insertion Sort', name: 'Insertion Sort', desc: 'Build sorted array one element at a time.' },
      { id: 'Merge Sort', name: 'Merge Sort', desc: 'Divide & conquer recursive subarray merging.' },
      { id: 'Quick Sort', name: 'Quick Sort', desc: 'Partition elements around pivot value.' },
      { id: 'Heap Sort', name: 'Heap Sort', desc: 'Max-heap creation and root element extraction.' },
      { id: 'Shell Sort', name: 'Shell Sort', desc: 'Insertion sort over diminishing gap sequence.' },
      { id: 'Counting Sort', name: 'Counting Sort', desc: 'Non-comparison integer key frequency counting.' },
      { id: 'Radix Sort', name: 'Radix Sort', desc: 'Non-comparison digit-by-digit LSD sorting.' },
      { id: 'Bucket Sort', name: 'Bucket Sort', desc: 'Distribute elements into buckets and sort.' },
      { id: 'Cocktail Shaker Sort', name: 'Cocktail Shaker Sort', desc: 'Bidirectional bubble sort back and forth.' },
      { id: 'Comb Sort', name: 'Comb Sort', desc: 'Bubble sort with gap shrinking factor 1.3.' },
      { id: 'Cycle Sort', name: 'Cycle Sort', desc: 'In-place sorting minimizing memory write operations.' },
      { id: 'Tim Sort', name: 'Tim Sort', desc: 'Hybrid Insertion & Merge sort algorithm (Python standard).' }
    ],
    ARRAYS: [
      { id: 'Array Operations', name: 'Array Mutate & Search', desc: 'Add, remove, update, and search elements.' },
      { id: 'Two Pointers Converging', name: 'Two Pointers', desc: 'Move left and right pointers inward.' },
      { id: 'Sliding Window', name: 'Sliding Window', desc: 'Slide contiguous window frame across array.' }
    ],
    STRINGS: [
      { id: 'String Char Search', name: 'String Search & Compare', desc: 'Search character and compare positions.' },
      { id: 'Palindrome Check', name: 'Palindrome Check', desc: 'Compare start and end characters inward.' }
    ],
    LINKED_LISTS: [
      { id: 'Linked List Node Mutate', name: 'Linked List Nodes', desc: 'Add, remove, insert, and search list nodes.' },
      { id: 'Linked List Reverse', name: 'In-Place List Reversal', desc: 'Reverse pointer direction of each node.' }
    ],
    STACKS_QUEUES: [
      { id: 'Stack Operations', name: 'Stack (LIFO)', desc: 'Push, Pop, and Peek stack top.' },
      { id: 'Queue Operations', name: 'Queue (FIFO)', desc: 'Enqueue, Dequeue, and Peek queue head.' }
    ],
    HASHING: [
      { id: 'Hash Table Operations', name: 'Hash Map Key-Value', desc: 'Add, search, and remove key/value entries.' }
    ],
    TREES_BST: [
      { id: 'BST Node Operations', name: 'BST Insert, Delete & Search', desc: 'Insert, delete, and search BST nodes.' }
    ],
    HEAPS: [
      { id: 'Heap Operations', name: 'Heap Operations', desc: 'Insert, delete, heapify, and extract min/max.' }
    ],
    GRAPHS: [
      { id: 'Graph Graph Traversal', name: 'Graph Traversal', desc: 'Add/remove nodes & edges, select start node and traverse.' }
    ],
    RECURSION_BACKTRACKING: [
      { id: 'Recursion Call Stack', name: 'Recursion Stack', desc: 'Visualize recursive call stack unwinding.' },
      { id: 'N-Queens Backtracking', name: 'N-Queens Backtracking', desc: 'Backtrack queen placements on board.' }
    ],
    GREEDY: [
      { id: 'Activity Selection', name: 'Activity Selection', desc: 'Greedily select non-overlapping intervals.' }
    ],
    DYNAMIC_PROGRAMMING: [
      { id: 'Fibonacci DP Tabulation', name: 'Fibonacci DP', desc: 'Compute DP table entries iteratively.' }
    ]
  }), []);

  // Initial example dataset configurations
  const examplesMap: Record<string, ExampleConfig[]> = useMemo(() => ({
    'Linear Search': [{ id: 'ex-1', name: 'Target 70', description: 'Search 70 in unsorted array.', initialData: [10, 50, 30, 70, 80, 20], targetValue: 70 }],
    'Binary Search': [{ id: 'ex-1', name: 'Target 40', description: 'Binary search on sorted array.', initialData: [10, 20, 30, 40, 50, 60, 70], targetValue: 40 }],
    'Jump Search': [{ id: 'ex-1', name: 'Target 56', description: 'Jump search in sorted array.', initialData: [5, 12, 23, 34, 45, 56, 67, 78, 89], targetValue: 56 }],
    'Interpolation Search': [{ id: 'ex-1', name: 'Target 60', description: 'Interpolation search on uniform data.', initialData: [10, 20, 30, 40, 50, 60, 70, 80], targetValue: 60 }],
    'Exponential Search': [{ id: 'ex-1', name: 'Target 32', description: 'Exponential range search.', initialData: [2, 4, 8, 16, 32, 64, 128], targetValue: 32 }],
    'Fibonacci Search': [{ id: 'ex-1', name: 'Target 50', description: 'Fibonacci block search.', initialData: [10, 22, 35, 40, 45, 50, 80, 82, 85], targetValue: 50 }],
    'Ternary Search': [{ id: 'ex-1', name: 'Target 60', description: 'Three-way split search.', initialData: [12, 24, 36, 48, 60, 72, 84], targetValue: 60 }],
    'Sentinel Search': [{ id: 'ex-1', name: 'Target 50', description: 'Sentinel boundary-free search.', initialData: [15, 35, 20, 50, 65, 40], targetValue: 50 }],

    'Bubble Sort': [{ id: 'ex-1', name: 'Unsorted Array', description: 'Bubble sort pass.', initialData: [45, 12, 89, 34, 67, 23] }],
    'Selection Sort': [{ id: 'ex-1', name: 'Find Minimum', description: 'Selection sort min scan.', initialData: [64, 25, 12, 22, 11] }],
    'Insertion Sort': [{ id: 'ex-1', name: 'Shift & Insert', description: 'Insertion sort key shift.', initialData: [12, 11, 13, 5, 6] }],
    'Merge Sort': [{ id: 'ex-1', name: 'Divide & Merge', description: 'Recursive merge sort.', initialData: [38, 27, 43, 3, 9, 82, 10] }],
    'Quick Sort': [{ id: 'ex-1', name: 'Pivot Partition', description: 'Quick sort last element pivot.', initialData: [10, 80, 30, 90, 40, 50, 70] }],
    'Heap Sort': [{ id: 'ex-1', name: 'Max-Heapify', description: 'Heap sort root extraction.', initialData: [12, 11, 13, 5, 6, 7] }],
    'Shell Sort': [{ id: 'ex-1', name: 'Gap Sequence', description: 'Shell sort diminishing gap.', initialData: [35, 14, 23, 7, 42, 19, 31] }],
    'Counting Sort': [{ id: 'ex-1', name: 'Keys [1..8]', description: 'Counting sort frequency array.', initialData: [4, 2, 8, 3, 3, 1, 4, 2] }],
    'Radix Sort': [{ id: 'ex-1', name: 'Digit Sorting', description: 'Radix LSD digit sort.', initialData: [170, 45, 75, 90, 802, 24, 2, 66] }],
    'Bucket Sort': [{ id: 'ex-1', name: 'Bucket Scatter', description: 'Bucket sort distribution.', initialData: [29, 13, 22, 37, 52, 49, 41] }],
    'Cocktail Shaker Sort': [{ id: 'ex-1', name: 'Bidirectional Pass', description: 'Cocktail shaker back and forth.', initialData: [5, 1, 4, 2, 8, 0, 2] }],
    'Comb Sort': [{ id: 'ex-1', name: 'Shrink Factor 1.3', description: 'Comb sort gap reduction.', initialData: [8, 4, 15, 56, 3, 44, 23, 9] }],
    'Cycle Sort': [{ id: 'ex-1', name: 'Cycle Rotations', description: 'Cycle sort minimal writes.', initialData: [20, 40, 50, 10, 30] }],
    'Tim Sort': [{ id: 'ex-1', name: 'Insertion + Merge', description: 'Tim sort hybrid runs.', initialData: [5, 21, 7, 23, 19, 1, 18, 12] }],

    'Array Operations': [{ id: 'ex-1', name: 'Array Mutate', description: 'Add, remove, update elements.', initialData: [10, 20, 30, 40, 50] }],
    'Two Pointers Converging': [{ id: 'ex-1', name: 'Target Sum 14', description: 'Converging left/right pointers.', initialData: [2, 4, 7, 10, 15], targetValue: 14 }],
    'Sliding Window': [{ id: 'ex-1', name: 'Window Size 3', description: 'Sliding window max sum.', initialData: [2, 1, 5, 1, 3, 2], windowSize: 3 }],
    'String Char Search': [{ id: 'ex-1', name: 'String "RADAR"', description: 'Search character \'R\'.', initialData: [82, 65, 68, 65, 82] }],
    'Palindrome Check': [{ id: 'ex-1', name: 'Palindrome Check', description: 'Compare start/end characters.', initialData: [82, 65, 68, 65, 82] }],
    'Linked List Node Mutate': [{ id: 'ex-1', name: 'List Nodes', description: 'Add, remove list nodes.', initialData: [10, 20, 30, 40] }],
    'Linked List Reverse': [{ id: 'ex-1', name: 'Reverse Links', description: 'In-place pointer reversal.', initialData: [5, 15, 25, 35] }],
    'Stack Operations': [{ id: 'ex-1', name: 'Stack LIFO', description: 'Push, Pop, Peek.', initialData: [10, 20, 30] }],
    'Queue Operations': [{ id: 'ex-1', name: 'Queue FIFO', description: 'Enqueue, Dequeue, Peek.', initialData: [100, 200, 300] }],
    'Hash Table Operations': [{ id: 'ex-1', name: 'Key-Value Hash', description: 'Add, search keys.', initialData: [15, 22, 37, 42] }],
    'BST Node Operations': [{ id: 'ex-1', name: 'BST Tree', description: 'Insert, search nodes.', initialData: [50, 30, 70, 20, 40] }],
    'Heap Operations': [{ id: 'ex-1', name: 'Heap Tree', description: 'Heapify operations.', initialData: [80, 60, 70, 30, 40] }],
    'Graph Graph Traversal': [{ id: 'ex-1', name: 'Graph Traversal', description: 'BFS/DFS graph traversal.', initialData: [0, 1, 2, 3, 4] }],
    'Recursion Call Stack': [{ id: 'ex-1', name: 'Factorial Stack', description: 'Call stack unwind.', initialData: [5, 4, 3, 2, 1] }],
    'Activity Selection': [{ id: 'ex-1', name: 'Interval Selection', description: 'Greedy activity selection.', initialData: [1, 3, 0, 5, 8] }],
    'Fibonacci DP Tabulation': [{ id: 'ex-1', name: 'DP Table', description: 'Fibonacci DP table.', initialData: [0, 1, 1, 2, 3, 5, 8] }]
  }), []);

  const currentExample = useMemo(() => {
    const list = examplesMap[selectedSubPart] || examplesMap['Linear Search'];
    return list.find(e => e.id === selectedExampleId) || list[0];
  }, [examplesMap, selectedSubPart, selectedExampleId]);

  useEffect(() => {
    setWorkingArray([...currentExample.initialData]);
    setArrayInputText(currentExample.initialData.join(', '));
    if (currentExample.targetValue !== undefined) {
      setSearchValueInput(currentExample.targetValue.toString());
    }
  }, [currentExample]);

  const handleGenerateRandomArray = () => {
    const randArr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 85) + 10);
    setWorkingArray(randArr);
    setArrayInputText(randArr.join(', '));
    setStepIndex(0);
    setIsPlaying(false);
    setStatusMessage('Generated new random array.');
  };

  const handleApplyCustomArray = () => {
    try {
      const parsed = arrayInputText.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length > 0) {
        setWorkingArray(parsed);
        setStepIndex(0);
        setIsPlaying(false);
        setStatusMessage(`Loaded array: [${parsed.join(', ')}].`);
      } else {
        setStatusMessage('Invalid array input format. Use comma separated numbers.');
      }
    } catch {
      setStatusMessage('Invalid array input format. Use comma separated numbers.');
    }
  };

  const handleAddArrayElement = () => {
    const val = parseInt(elementInputVal, 10);
    if (!isNaN(val)) {
      setWorkingArray(prev => [...prev, val]);
      setArrayInputText(prev => `${prev}, ${val}`);
      setStatusMessage(`Added element ${val} to array.`);
    }
  };

  const handleRemoveArrayElement = () => {
    const idx = parseInt(elementIndexInput, 10);
    if (!isNaN(idx) && idx >= 0 && idx < workingArray.length) {
      const removed = workingArray[idx];
      setWorkingArray(prev => prev.filter((_, i) => i !== idx));
      setStatusMessage(`Removed element at index ${idx} (value ${removed}).`);
    } else {
      setStatusMessage(`Invalid index ${idx}.`);
    }
  };

  const handleUpdateArrayElement = () => {
    const idx = parseInt(elementIndexInput, 10);
    const val = parseInt(elementInputVal, 10);
    if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx < workingArray.length) {
      const newArr = [...workingArray];
      newArr[idx] = val;
      setWorkingArray(newArr);
      setStatusMessage(`Updated index ${idx} to value ${val}.`);
    }
  };

  const handleStackPush = () => {
    const val = parseInt(elementInputVal, 10);
    if (!isNaN(val)) {
      setStackData(prev => [...prev, val]);
      setStatusMessage(`Pushed ${val} onto top of Stack.`);
    }
  };

  const handleStackPop = () => {
    if (stackData.length > 0) {
      const popped = stackData[stackData.length - 1];
      setStackData(prev => prev.slice(0, prev.length - 1));
      setStatusMessage(`Popped top element ${popped} from Stack.`);
    } else {
      setStatusMessage('Stack Underflow! Stack is empty.');
    }
  };

  const handleStackPeek = () => {
    if (stackData.length > 0) {
      setStatusMessage(`Stack Top Peek: ${stackData[stackData.length - 1]}.`);
    } else {
      setStatusMessage('Stack is empty.');
    }
  };

  const handleQueueEnqueue = () => {
    const val = parseInt(elementInputVal, 10);
    if (!isNaN(val)) {
      setQueueData(prev => [...prev, val]);
      setStatusMessage(`Enqueued ${val} at Queue tail.`);
    }
  };

  const handleQueueDequeue = () => {
    if (queueData.length > 0) {
      const dequeued = queueData[0];
      setQueueData(prev => prev.slice(1));
      setStatusMessage(`Dequeued head element ${dequeued} from Queue.`);
    } else {
      setStatusMessage('Queue Underflow! Queue is empty.');
    }
  };

  const handleQueuePeek = () => {
    if (queueData.length > 0) {
      setStatusMessage(`Queue Head Peek: ${queueData[0]}.`);
    } else {
      setStatusMessage('Queue is empty.');
    }
  };

  // STEP GENERATOR ALGORITHMS
  const steps: VisualStep[] = useMemo(() => {
    const arr = [...workingArray];
    const generated: VisualStep[] = [];
    const target = parseInt(searchValueInput, 10) || 70;

    if (selectedCategory === 'SEARCHING') {
      let comps = 0;
      let found = false;

      generated.push({
        array: [...arr],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [],
        description: `Starting ${selectedSubPart} for target ${target} in array [${arr.join(', ')}].`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      if (selectedSubPart === 'Binary Search') {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          comps++;
          generated.push({
            array: [...arr],
            comparingIndices: [mid],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [mid],
            pointers: [
              { label: 'low', index: low, color: 'var(--color-blue)' },
              { label: 'mid', index: mid, color: 'var(--color-amber)' },
              { label: 'high', index: high, color: 'var(--color-purple)' }
            ],
            description: `Binary Search mid index = ${mid} (${arr[mid]}). Target = ${target}.`,
            totalComparisons: comps,
            totalSwaps: 0
          });

          if (arr[mid] === target) {
            found = true;
            generated.push({
              array: [...arr],
              comparingIndices: null,
              swappingIndices: null,
              sortedIndices: [mid],
              activeIndices: [mid],
              description: `Target ${target} FOUND at index ${mid}!`,
              totalComparisons: comps,
              totalSwaps: 0
            });
            break;
          } else if (arr[mid] < target) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
      } else if (selectedSubPart === 'Jump Search') {
        const n = arr.length;
        let step = Math.floor(Math.sqrt(n)) || 1;
        let prev = 0;

        while (arr[Math.min(step, n) - 1] < target) {
          comps++;
          generated.push({
            array: [...arr],
            comparingIndices: [Math.min(step, n) - 1],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [prev, Math.min(step, n) - 1],
            pointers: [
              { label: 'prev', index: prev, color: 'var(--color-blue)' },
              { label: 'step', index: Math.min(step, n) - 1, color: 'var(--color-purple)' }
            ],
            description: `Jump Search checking block end index ${Math.min(step, n) - 1} (${arr[Math.min(step, n) - 1]}).`,
            totalComparisons: comps,
            totalSwaps: 0
          });
          prev = step;
          step += Math.floor(Math.sqrt(n)) || 1;
          if (prev >= n) break;
        }

        while (prev < Math.min(step, n)) {
          comps++;
          generated.push({
            array: [...arr],
            comparingIndices: [prev],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [prev],
            pointers: [{ label: 'curr', index: prev, color: 'var(--color-amber)' }],
            description: `Linear search within block at index ${prev} (${arr[prev]}).`,
            totalComparisons: comps,
            totalSwaps: 0
          });
          if (arr[prev] === target) {
            found = true;
            generated.push({
              array: [...arr],
              comparingIndices: null,
              swappingIndices: null,
              sortedIndices: [prev],
              activeIndices: [prev],
              description: `Target ${target} FOUND at index ${prev}!`,
              totalComparisons: comps,
              totalSwaps: 0
            });
            break;
          }
          prev++;
        }
      } else if (selectedSubPart === 'Interpolation Search') {
        let low = 0, high = arr.length - 1;
        while (low <= high && target >= arr[low] && target <= arr[high]) {
          comps++;
          if (low === high) {
            if (arr[low] === target) {
              found = true;
              generated.push({
                array: [...arr],
                comparingIndices: [low],
                swappingIndices: null,
                sortedIndices: [low],
                activeIndices: [low],
                description: `Target ${target} FOUND at index ${low}!`,
                totalComparisons: comps,
                totalSwaps: 0
              });
            }
            break;
          }

          const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
          const validPos = Math.max(low, Math.min(high, pos));

          generated.push({
            array: [...arr],
            comparingIndices: [validPos],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [validPos],
            pointers: [
              { label: 'low', index: low, color: 'var(--color-blue)' },
              { label: 'pos', index: validPos, color: 'var(--color-amber)' },
              { label: 'high', index: high, color: 'var(--color-purple)' }
            ],
            description: `Interpolation Search estimated position pos = ${validPos} (${arr[validPos]}).`,
            totalComparisons: comps,
            totalSwaps: 0
          });

          if (arr[validPos] === target) {
            found = true;
            generated.push({
              array: [...arr],
              comparingIndices: null,
              swappingIndices: null,
              sortedIndices: [validPos],
              activeIndices: [validPos],
              description: `Target ${target} FOUND at index ${validPos}!`,
              totalComparisons: comps,
              totalSwaps: 0
            });
            break;
          }
          if (arr[validPos] < target) low = validPos + 1;
          else high = validPos - 1;
        }
      } else if (selectedSubPart === 'Exponential Search') {
        if (arr[0] === target) {
          found = true;
          generated.push({
            array: [...arr],
            comparingIndices: [0],
            swappingIndices: null,
            sortedIndices: [0],
            activeIndices: [0],
            description: `Target ${target} FOUND at index 0!`,
            totalComparisons: 1,
            totalSwaps: 0
          });
        } else {
          let bound = 1;
          while (bound < arr.length && arr[bound] <= target) {
            comps++;
            generated.push({
              array: [...arr],
              comparingIndices: [bound],
              swappingIndices: null,
              sortedIndices: [],
              activeIndices: [bound],
              pointers: [{ label: 'bound', index: bound, color: 'var(--color-purple)' }],
              description: `Exponential Search doubling bound index = ${bound} (${arr[bound]}).`,
              totalComparisons: comps,
              totalSwaps: 0
            });
            bound *= 2;
          }

          let low = Math.floor(bound / 2);
          let high = Math.min(bound, arr.length - 1);

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            comps++;
            generated.push({
              array: [...arr],
              comparingIndices: [mid],
              swappingIndices: null,
              sortedIndices: [],
              activeIndices: [mid],
              pointers: [
                { label: 'low', index: low, color: 'var(--color-blue)' },
                { label: 'mid', index: mid, color: 'var(--color-amber)' },
                { label: 'high', index: high, color: 'var(--color-purple)' }
              ],
              description: `Binary search step in range [${low}..${high}]: mid = ${mid} (${arr[mid]}).`,
              totalComparisons: comps,
              totalSwaps: 0
            });

            if (arr[mid] === target) {
              found = true;
              generated.push({
                array: [...arr],
                comparingIndices: null,
                swappingIndices: null,
                sortedIndices: [mid],
                activeIndices: [mid],
                description: `Target ${target} FOUND at index ${mid}!`,
                totalComparisons: comps,
                totalSwaps: 0
              });
              break;
            } else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
          }
        }
      } else if (selectedSubPart === 'Ternary Search') {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
          const mid1 = low + Math.floor((high - low) / 3);
          const mid2 = high - Math.floor((high - low) / 3);
          comps += 2;

          generated.push({
            array: [...arr],
            comparingIndices: [mid1, mid2],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [mid1, mid2],
            pointers: [
              { label: 'mid1', index: mid1, color: 'var(--color-amber)' },
              { label: 'mid2', index: mid2, color: 'var(--color-purple)' }
            ],
            description: `Ternary Search mid1=${mid1} (${arr[mid1]}), mid2=${mid2} (${arr[mid2]}).`,
            totalComparisons: comps,
            totalSwaps: 0
          });

          if (arr[mid1] === target) {
            found = true;
            generated.push({ array: [...arr], comparingIndices: null, swappingIndices: null, sortedIndices: [mid1], activeIndices: [mid1], description: `Target ${target} FOUND at mid1 (${mid1})!`, totalComparisons: comps, totalSwaps: 0 });
            break;
          }
          if (arr[mid2] === target) {
            found = true;
            generated.push({ array: [...arr], comparingIndices: null, swappingIndices: null, sortedIndices: [mid2], activeIndices: [mid2], description: `Target ${target} FOUND at mid2 (${mid2})!`, totalComparisons: comps, totalSwaps: 0 });
            break;
          }

          if (target < arr[mid1]) high = mid1 - 1;
          else if (target > arr[mid2]) low = mid2 + 1;
          else { low = mid1 + 1; high = mid2 - 1; }
        }
      } else if (selectedSubPart === 'Sentinel Search') {
        const n = arr.length;
        const last = arr[n - 1];
        arr[n - 1] = target;
        let i = 0;

        while (arr[i] !== target) {
          comps++;
          generated.push({
            array: [...arr],
            comparingIndices: [i],
            swappingIndices: null,
            sortedIndices: [],
            activeIndices: [i],
            description: `Sentinel loop checking index ${i} (${arr[i]}).`,
            totalComparisons: comps,
            totalSwaps: 0
          });
          i++;
        }

        arr[n - 1] = last;
        comps++;
        if (i < n - 1 || arr[n - 1] === target) {
          found = true;
          generated.push({
            array: [...arr],
            comparingIndices: null,
            swappingIndices: null,
            sortedIndices: [i],
            activeIndices: [i],
            description: `Target ${target} FOUND at index ${i}!`,
            totalComparisons: comps,
            totalSwaps: 0
          });
        }
      } else {
        // Linear Search / Default
        for (let i = 0; i < arr.length; i++) {
          comps++;
          if (arr[i] === target) {
            found = true;
            generated.push({
              array: [...arr],
              comparingIndices: null,
              swappingIndices: null,
              sortedIndices: [i],
              activeIndices: [i],
              description: `Target ${target} FOUND at index ${i}!`,
              totalComparisons: comps,
              totalSwaps: 0
            });
            break;
          } else {
            generated.push({
              array: [...arr],
              comparingIndices: [i],
              swappingIndices: null,
              sortedIndices: [],
              activeIndices: [i],
              description: `Checking index ${i} (${arr[i]}). Not equal to target ${target}.`,
              totalComparisons: comps,
              totalSwaps: 0
            });
          }
        }
      }

      if (!found) {
        generated.push({
          array: [...arr],
          comparingIndices: null,
          swappingIndices: null,
          sortedIndices: [],
          activeIndices: [],
          description: `Target ${target} NOT found in array.`,
          totalComparisons: comps,
          totalSwaps: 0
        });
      }
    } else if (selectedCategory === 'SORTING') {
      let comps = 0, swaps = 0;
      generated.push({
        array: [...arr],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [],
        description: `Starting ${selectedSubPart} on array [${arr.join(', ')}].`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      if (selectedSubPart === 'Selection Sort') {
        for (let i = 0; i < arr.length - 1; i++) {
          let minIdx = i;
          for (let j = i + 1; j < arr.length; j++) {
            comps++;
            generated.push({
              array: [...arr],
              comparingIndices: [minIdx, j],
              swappingIndices: null,
              sortedIndices: Array.from({ length: i }, (_, k) => k),
              activeIndices: [j],
              pointers: [{ label: 'min', index: minIdx, color: 'var(--color-amber)' }],
              description: `Comparing current min at index ${minIdx} (${arr[minIdx]}) with index ${j} (${arr[j]}).`,
              totalComparisons: comps,
              totalSwaps: swaps
            });
            if (arr[j] < arr[minIdx]) minIdx = j;
          }
          if (minIdx !== i) {
            swaps++;
            const tmp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = tmp;
            generated.push({
              array: [...arr],
              comparingIndices: null,
              swappingIndices: [i, minIdx],
              sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
              activeIndices: [],
              description: `Swapped minimum element ${arr[i]} into position index ${i}.`,
              totalComparisons: comps,
              totalSwaps: swaps
            });
          }
        }
      } else if (selectedSubPart === 'Insertion Sort') {
        for (let i = 1; i < arr.length; i++) {
          let key = arr[i];
          let j = i - 1;
          while (j >= 0 && arr[j] > key) {
            comps++;
            swaps++;
            arr[j + 1] = arr[j];
            generated.push({
              array: [...arr],
              comparingIndices: [j, j + 1],
              swappingIndices: [j + 1],
              sortedIndices: [],
              activeIndices: [j],
              description: `Shifting ${arr[j]} right to insert key ${key}.`,
              totalComparisons: comps,
              totalSwaps: swaps
            });
            j--;
          }
          arr[j + 1] = key;
        }
      } else if (selectedSubPart === 'Cocktail Shaker Sort') {
        let swapped = true;
        let start = 0;
        let end = arr.length - 1;

        while (swapped) {
          swapped = false;
          for (let i = start; i < end; i++) {
            comps++;
            if (arr[i] > arr[i + 1]) {
              swaps++;
              const tmp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = tmp;
              swapped = true;
              generated.push({
                array: [...arr],
                comparingIndices: null,
                swappingIndices: [i, i + 1],
                sortedIndices: [],
                activeIndices: [],
                description: `Forward Pass: Swapped ${tmp} and ${arr[i]}.`,
                totalComparisons: comps,
                totalSwaps: swaps
              });
            }
          }
          if (!swapped) break;
          swapped = false;
          end--;
          for (let i = end - 1; i >= start; i--) {
            comps++;
            if (arr[i] > arr[i + 1]) {
              swaps++;
              const tmp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = tmp;
              swapped = true;
              generated.push({
                array: [...arr],
                comparingIndices: null,
                swappingIndices: [i, i + 1],
                sortedIndices: [],
                activeIndices: [],
                description: `Backward Pass: Swapped ${tmp} and ${arr[i]}.`,
                totalComparisons: comps,
                totalSwaps: swaps
              });
            }
          }
          start++;
        }
      } else if (selectedSubPart === 'Comb Sort') {
        let gap = arr.length;
        let shrink = 1.3;
        let sorted = false;

        while (!sorted) {
          gap = Math.floor(gap / shrink);
          if (gap <= 1) {
            gap = 1;
            sorted = true;
          }

          for (let i = 0; i + gap < arr.length; i++) {
            comps++;
            generated.push({
              array: [...arr],
              comparingIndices: [i, i + gap],
              swappingIndices: null,
              sortedIndices: [],
              activeIndices: [i, i + gap],
              pointers: [{ label: 'gap', index: i + gap, color: 'var(--color-purple)' }],
              description: `Comb Sort gap = ${gap}. Comparing index ${i} (${arr[i]}) & index ${i + gap} (${arr[i + gap]}).`,
              totalComparisons: comps,
              totalSwaps: swaps
            });

            if (arr[i] > arr[i + gap]) {
              swaps++;
              const tmp = arr[i];
              arr[i] = arr[i + gap];
              arr[i + gap] = tmp;
              sorted = false;
              generated.push({
                array: [...arr],
                comparingIndices: null,
                swappingIndices: [i, i + gap],
                sortedIndices: [],
                activeIndices: [],
                description: `Swapped ${tmp} and ${arr[i]}.`,
                totalComparisons: comps,
                totalSwaps: swaps
              });
            }
          }
        }
      } else {
        // Bubble Sort / Default Sorting Step Simulation
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            comps++;
            generated.push({
              array: [...arr],
              comparingIndices: [j, j + 1],
              swappingIndices: null,
              sortedIndices: [],
              activeIndices: [],
              description: `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`,
              totalComparisons: comps,
              totalSwaps: swaps
            });

            if (arr[j] > arr[j + 1]) {
              swaps++;
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              generated.push({
                array: [...arr],
                comparingIndices: null,
                swappingIndices: [j, j + 1],
                sortedIndices: [],
                activeIndices: [],
                description: `Swapped ${temp} and ${arr[j]}.`,
                totalComparisons: comps,
                totalSwaps: swaps
              });
            }
          }
        }
      }

      generated.push({
        array: [...arr],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: arr.map((_, idx) => idx),
        activeIndices: [],
        description: `${selectedSubPart} Complete!`,
        totalComparisons: comps,
        totalSwaps: swaps
      });
    } else if (selectedCategory === 'LINKED_LISTS') {
      const listData = arr.length > 0 ? arr : [10, 20, 30, 40];
      generated.push({
        array: [...listData],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        pointers: [{ label: 'head', index: 0, color: 'var(--color-blue)' }],
        description: `Linked List initialized with ${listData.length} nodes: ${listData.join(' -> ')} -> NULL.`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      if (selectedSubPart.includes('Reverse')) {
        for (let i = 0; i < listData.length; i++) {
          generated.push({
            array: [...listData],
            comparingIndices: null,
            swappingIndices: i > 0 ? [i - 1, i] : null,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            activeIndices: [i],
            pointers: [
              ...(i > 0 ? [{ label: 'prev', index: i - 1, color: 'var(--color-purple)' }] : []),
              { label: 'curr', index: i, color: 'var(--color-amber)' },
              ...(i < listData.length - 1 ? [{ label: 'next', index: i + 1, color: 'var(--color-blue)' }] : [])
            ],
            description: `Reversing pointer for Node(${listData[i]}): redirecting next pointer to ${i > 0 ? `Node(${listData[i-1]})` : 'NULL'}.`,
            totalComparisons: i + 1,
            totalSwaps: i
          });
        }
        generated.push({
          array: [...listData].reverse(),
          comparingIndices: null,
          swappingIndices: null,
          sortedIndices: listData.map((_, k) => k),
          activeIndices: [0],
          pointers: [{ label: 'new_head', index: 0, color: 'var(--color-green)' }],
          description: `Linked List In-Place Reversal Complete! New head points to Node(${listData[listData.length - 1]}).`,
          totalComparisons: listData.length,
          totalSwaps: listData.length - 1
        });
      } else {
        for (let i = 0; i < listData.length; i++) {
          generated.push({
            array: [...listData],
            comparingIndices: [i],
            swappingIndices: null,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            activeIndices: [i],
            pointers: [{ label: 'curr', index: i, color: 'var(--color-amber)' }],
            description: `Traversing Linked List Node ${i + 1}/${listData.length} (val = ${listData[i]}).`,
            totalComparisons: i + 1,
            totalSwaps: 0
          });
        }
      }
    } else if (selectedCategory === 'STACKS_QUEUES') {
      const activeData = selectedSubPart.includes('Stack') ? stackData : queueData;
      const isStack = selectedSubPart.includes('Stack');
      generated.push({
        array: activeData.length > 0 ? activeData : [10, 20, 30],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: isStack ? [activeData.length - 1] : [0],
        pointers: isStack 
          ? [{ label: 'TOP (LIFO)', index: Math.max(0, activeData.length - 1), color: 'var(--color-purple)' }]
          : [
              { label: 'FRONT (HEAD)', index: 0, color: 'var(--color-blue)' },
              { label: 'REAR (TAIL)', index: Math.max(0, activeData.length - 1), color: 'var(--color-amber)' }
            ],
        description: `${isStack ? 'Stack (LIFO)' : 'Queue (FIFO)'} state: [${activeData.join(', ')}].`,
        totalComparisons: activeData.length,
        totalSwaps: 0
      });
    } else if (selectedCategory === 'TREES_BST') {
      const treeData = [50, 30, 70, 20, 40, 60, 80];
      let traversalSeq: number[] = [];

      if (selectedSubPart.includes('In-Order')) {
        traversalSeq = [20, 30, 40, 50, 60, 70, 80];
      } else if (selectedSubPart.includes('Pre-Order')) {
        traversalSeq = [50, 30, 20, 40, 70, 60, 80];
      } else if (selectedSubPart.includes('Post-Order')) {
        traversalSeq = [20, 40, 30, 60, 80, 70, 50];
      } else {
        traversalSeq = [50, 30, 70, 20, 40, 60, 80];
      }

      generated.push({
        array: treeData,
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        traversalOrder: [],
        description: `BST initialized with Root node (50). Visualizing ${selectedSubPart}.`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      traversalSeq.forEach((nodeVal, stepIdx) => {
        const arrIdx = treeData.indexOf(nodeVal);
        generated.push({
          array: treeData,
          comparingIndices: [arrIdx],
          swappingIndices: null,
          sortedIndices: traversalSeq.slice(0, stepIdx).map(v => treeData.indexOf(v)),
          activeIndices: [arrIdx],
          traversalOrder: traversalSeq.slice(0, stepIdx + 1),
          pointers: [{ label: 'visiting', index: arrIdx, color: 'var(--color-amber)' }],
          description: `Visiting Tree Node (${nodeVal}). Appended to traversal sequence: [${traversalSeq.slice(0, stepIdx + 1).join(', ')}].`,
          totalComparisons: stepIdx + 1,
          totalSwaps: 0
        });
      });
    } else if (selectedCategory === 'GRAPHS') {
      const isBFS = selectedSubPart.includes('BFS') || selectedSubPart.includes('Graph');
      const seq = isBFS ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'D', 'E', 'C'];

      generated.push({
        array: [1, 2, 3, 4, 5],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        traversalOrder: [],
        description: `Graph Graph Traversal (${isBFS ? 'BFS Level-by-Level Queue' : 'DFS Deep-First Stack'}) starting at Node 'A'.`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      seq.forEach((nodeLabel, stepIdx) => {
        generated.push({
          array: [1, 2, 3, 4, 5],
          comparingIndices: [stepIdx],
          swappingIndices: null,
          sortedIndices: Array.from({ length: stepIdx }, (_, k) => k),
          activeIndices: [stepIdx],
          traversalOrder: seq.slice(0, stepIdx + 1),
          pointers: [{ label: nodeLabel, index: stepIdx, color: 'var(--color-purple)' }],
          description: `${isBFS ? 'BFS Queue Dequeue' : 'DFS Stack Pop'}: Visiting Graph Node '${nodeLabel}'. Visited set: {${seq.slice(0, stepIdx + 1).join(', ')}}.`,
          totalComparisons: stepIdx + 1,
          totalSwaps: 0
        });
      });
    } else if (selectedCategory === 'RECURSION_BACKTRACKING') {
      const stackFrames = [
        { funcName: 'fact', arg: 5 },
        { funcName: 'fact', arg: 4 },
        { funcName: 'fact', arg: 3 },
        { funcName: 'fact', arg: 2 },
        { funcName: 'fact', arg: 1 }
      ];

      generated.push({
        array: [5, 4, 3, 2, 1],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        callStack: [stackFrames[0]],
        description: `Recursion Call Stack: Pushing frame fact(5).`,
        totalComparisons: 1,
        totalSwaps: 0
      });

      for (let i = 1; i < stackFrames.length; i++) {
        generated.push({
          array: [5, 4, 3, 2, 1],
          comparingIndices: null,
          swappingIndices: null,
          sortedIndices: [],
          activeIndices: [i],
          callStack: stackFrames.slice(0, i + 1),
          description: `Pushing recursive call frame ${stackFrames[i].funcName}(${stackFrames[i].arg}) onto Call Stack (Depth ${i + 1}).`,
          totalComparisons: i + 1,
          totalSwaps: 0
        });
      }

      // Unwinding Phase
      const returnVals = [1, 2, 6, 24, 120];
      for (let i = stackFrames.length - 1; i >= 0; i--) {
        const activeFrames = stackFrames.slice(0, i + 1).map((f, idx) => {
          if (idx === i) return { ...f, returnVal: returnVals[stackFrames.length - 1 - i], isUnwinding: true };
          return f;
        });
        generated.push({
          array: [5, 4, 3, 2, 1],
          comparingIndices: null,
          swappingIndices: [i],
          sortedIndices: Array.from({ length: stackFrames.length - i }, (_, k) => stackFrames.length - 1 - k),
          activeIndices: [i],
          callStack: activeFrames,
          description: `Base Case / Return Unwind: ${stackFrames[i].funcName}(${stackFrames[i].arg}) returns ${returnVals[stackFrames.length - 1 - i]}.`,
          totalComparisons: stackFrames.length + (stackFrames.length - i),
          totalSwaps: 0
        });
      }
    } else if (selectedCategory === 'HEAPS') {
      const heapArr = [80, 60, 70, 30, 40, 50, 65];
      generated.push({
        array: [...heapArr],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        pointers: [{ label: 'Root (Max)', index: 0, color: 'var(--color-amber)' }],
        description: `Max-Heap array representation [${heapArr.join(', ')}]. Root element = ${heapArr[0]}.`,
        totalComparisons: 0,
        totalSwaps: 0
      });

      for (let i = 0; i < heapArr.length; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        generated.push({
          array: [...heapArr],
          comparingIndices: [left < heapArr.length ? left : i, right < heapArr.length ? right : i],
          swappingIndices: null,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          activeIndices: [i],
          pointers: [
            { label: 'parent', index: i, color: 'var(--color-amber)' },
            ...(left < heapArr.length ? [{ label: 'left', index: left, color: 'var(--color-blue)' }] : []),
            ...(right < heapArr.length ? [{ label: 'right', index: right, color: 'var(--color-purple)' }] : [])
          ],
          description: `Heapify check at index ${i} (${heapArr[i]}): parent vs left child (${left < heapArr.length ? heapArr[left] : 'N/A'}) & right child (${right < heapArr.length ? heapArr[right] : 'N/A'}).`,
          totalComparisons: i + 1,
          totalSwaps: 0
        });
      }
    } else if (selectedCategory === 'DYNAMIC_PROGRAMMING') {
      const dpValues = [0, 1, 1, 2, 3, 5, 8, 13];
      generated.push({
        array: dpValues,
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [0, 1],
        activeIndices: [0, 1],
        dpTable: dpValues.map((v, i) => ({
          index: i,
          value: i <= 1 ? v : '?',
          formula: i <= 1 ? `Base case dp[${i}] = ${v}` : `dp[${i}] = dp[${i-1}] + dp[${i-2}]`,
          isFinal: i <= 1
        })),
        description: `DP Tabulation initialized with base cases: dp[0] = 0, dp[1] = 1.`,
        totalComparisons: 2,
        totalSwaps: 0
      });

      for (let i = 2; i < dpValues.length; i++) {
        const tableState = dpValues.map((v, idx) => ({
          index: idx,
          value: idx <= i ? v : '?',
          formula: idx === i ? `dp[${i}] = dp[${i-1}] (${dpValues[i-1]}) + dp[${i-2}] (${dpValues[i-2]}) = ${v}` : `dp[${idx}]`,
          isComputing: idx === i,
          isFinal: idx < i
        }));

        generated.push({
          array: dpValues,
          comparingIndices: [i - 1, i - 2],
          swappingIndices: [i],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          activeIndices: [i],
          dpTable: tableState,
          pointers: [
            { label: 'dp[i-2]', index: i - 2, color: 'var(--color-blue)' },
            { label: 'dp[i-1]', index: i - 1, color: 'var(--color-amber)' },
            { label: 'dp[i]', index: i, color: 'var(--color-green)' }
          ],
          description: `Computing DP state dp[${i}] = dp[${i-1}] (${dpValues[i-1]}) + dp[${i-2}] (${dpValues[i-2]}) => ${dpValues[i]}.`,
          totalComparisons: i + 1,
          totalSwaps: 0
        });
      }
    } else {
      generated.push({
        array: [...arr],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [],
        activeIndices: [0],
        description: `Visualizing ${selectedCategory} (${selectedSubPart}): [${arr.join(', ')}].`,
        totalComparisons: 0,
        totalSwaps: 0
      });
      for (let i = 0; i < arr.length; i++) {
        generated.push({
          array: [...arr],
          comparingIndices: [i],
          swappingIndices: null,
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          activeIndices: [i],
          description: `Processing element index ${i} (value ${arr[i]}).`,
          totalComparisons: i + 1,
          totalSwaps: 0
        });
      }
    }

    return generated;
  }, [selectedCategory, selectedSubPart, workingArray, searchValueInput, stackData, queueData]);

  const currentStep = steps[stepIndex] || steps[0];

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  const handleNextStep = () => {
    if (stepIndex < steps.length - 1) setStepIndex(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (stepIndex > 0) setStepIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setStatusMessage('Execution reset to initial state.');
  };

  const getBarColor = (index: number) => {
    if (currentStep.comparingIndices && currentStep.comparingIndices.includes(index)) {
      return 'var(--color-amber)';
    }
    if (currentStep.swappingIndices && currentStep.swappingIndices.includes(index)) {
      return 'var(--color-purple)';
    }
    if (currentStep.sortedIndices && currentStep.sortedIndices.includes(index)) {
      return 'var(--color-green)';
    }
    if (currentStep.activeIndices && currentStep.activeIndices.includes(index)) {
      return 'var(--color-blue)';
    }
    return 'var(--color-cyan)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye style={{ width: 22, height: 22, color: 'var(--color-cyan)' }} />
          <h2 className="page-title">Algorithm & Data Structure Visualizer</h2>
        </div>
        <p className="page-subtitle">
          Interactive step-by-step visual execution engine for Searching, Sorting, and Data Structures.
        </p>
      </div>

      {/* 1. CATEGORIES SELECTOR */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {categoriesList.map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
            style={{
              backgroundColor: selectedCategory === cat.id ? 'var(--color-cyan)' : undefined,
              borderColor: selectedCategory === cat.id ? 'var(--color-cyan)' : undefined
            }}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (cat.id === 'DYNAMIC_PROGRAMMING') {
                triggerMotivationPopup('DYNAMIC_PROGRAMMING', false);
              } else if (cat.id === 'SORTING') {
                triggerMotivationPopup('SORTING', false);
              } else if (cat.id === 'STACKS_QUEUES') {
                triggerMotivationPopup('STACK', false);
              } else if (cat.id === 'GRAPHS') {
                triggerMotivationPopup('GRAPH', false);
              } else if (cat.id === 'TREES_BST') {
                triggerMotivationPopup('TREES', false);
              } else if (cat.id === 'HASHING') {
                triggerMotivationPopup('HASH_MAP', false);
              }
              const firstSubPart = (subPartsMap[cat.id] || [{ id: 'Default', name: 'Default', desc: '' }])[0].id;
              setSelectedSubPart(firstSubPart);
              setSelectedExampleId('ex-1');
              setStepIndex(0);
              setIsPlaying(false);
              setStatusMessage('');
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 2. SUB-PARTS SELECTOR */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers style={{ width: 14, height: 14, color: 'var(--color-cyan)' }} />
          <span>Active Sub-part in {categoriesList.find(c => c.id === selectedCategory)?.name} ({(subPartsMap[selectedCategory] || []).length} Available):</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(subPartsMap[selectedCategory] || []).map(sp => (
            <button
              key={sp.id}
              className={`btn btn-sm ${selectedSubPart === sp.id ? 'btn-secondary' : 'btn-outline'}`}
              style={{
                borderColor: selectedSubPart === sp.id ? 'var(--color-cyan)' : 'var(--border-subtle)',
                color: selectedSubPart === sp.id ? 'var(--color-cyan)' : 'var(--text-primary)'
              }}
              onClick={() => {
                setSelectedSubPart(sp.id);
                setSelectedExampleId('ex-1');
                setStepIndex(0);
                setIsPlaying(false);
                setStatusMessage('');
              }}
            >
              <span>{sp.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY-SPECIFIC RELEVANT CONTROLS BAR */}
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderLeft: '4px solid var(--color-cyan)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
          <Sliders style={{ width: 16, height: 16 }} />
          <span>Category Specific Controls ({categoriesList.find(c => c.id === selectedCategory)?.name})</span>
        </div>

        {/* SEARCHING CONTROLS */}
        {selectedCategory === 'SEARCHING' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Input Array:</span>
              <input
                type="text"
                className="input-field"
                style={{ width: '220px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={arrayInputText}
                onChange={(e) => setArrayInputText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Search Value:</span>
              <input
                type="number"
                className="input-field"
                style={{ width: '80px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={searchValueInput}
                onChange={(e) => setSearchValueInput(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-sm" onClick={handleApplyCustomArray}>
              <span>Load Data</span>
            </button>
          </div>
        )}

        {/* SORTING CONTROLS */}
        {selectedCategory === 'SORTING' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Input Array:</span>
              <input
                type="text"
                className="input-field"
                style={{ width: '240px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={arrayInputText}
                onChange={(e) => setArrayInputText(e.target.value)}
              />
            </div>

            <button className="btn btn-secondary btn-sm" onClick={handleGenerateRandomArray}>
              <Shuffle style={{ width: 12, height: 12 }} />
              <span>Generate Random Array</span>
            </button>

            <button className="btn btn-primary btn-sm" onClick={handleApplyCustomArray}>
              <span>Load Array</span>
            </button>
          </div>
        )}

        {/* ARRAYS CONTROLS */}
        {selectedCategory === 'ARRAYS' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Value:</span>
              <input
                type="text"
                className="input-field"
                style={{ width: '70px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={elementInputVal}
                onChange={(e) => setElementInputVal(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Index:</span>
              <input
                type="number"
                className="input-field"
                style={{ width: '60px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={elementIndexInput}
                onChange={(e) => setElementIndexInput(e.target.value)}
              />
            </div>

            <button className="btn btn-outline btn-sm" onClick={handleAddArrayElement}>
              <Plus style={{ width: 12, height: 12 }} />
              <span>Add Element</span>
            </button>

            <button className="btn btn-outline btn-sm" onClick={handleRemoveArrayElement}>
              <Trash2 style={{ width: 12, height: 12 }} />
              <span>Remove Element</span>
            </button>

            <button className="btn btn-outline btn-sm" onClick={handleUpdateArrayElement}>
              <span>Update Element</span>
            </button>

            <button className="btn btn-primary btn-sm" onClick={() => { setSearchValueInput(elementInputVal); handleReset(); }}>
              <Search style={{ width: 12, height: 12 }} />
              <span>Search Element</span>
            </button>
          </div>
        )}

        {/* STACKS & QUEUES CONTROLS */}
        {selectedCategory === 'STACKS_QUEUES' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Element:</span>
              <input
                type="number"
                className="input-field"
                style={{ width: '80px', padding: '4px 8px', fontSize: '0.8rem' }}
                value={elementInputVal}
                onChange={(e) => setElementInputVal(e.target.value)}
              />
            </div>

            {selectedSubPart.includes('Stack') ? (
              <>
                <button className="btn btn-primary btn-sm" onClick={handleStackPush}>
                  <span>Push</span>
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleStackPop}>
                  <span>Pop</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={handleStackPeek}>
                  <span>Peek Top</span>
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-sm" onClick={handleQueueEnqueue}>
                  <span>Enqueue</span>
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleQueueDequeue}>
                  <span>Dequeue</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={handleQueuePeek}>
                  <span>Peek Head</span>
                </button>
              </>
            )}
          </div>
        )}

        {statusMessage && (
          <div style={{ fontSize: '0.8rem', color: 'var(--easy-color)', fontWeight: 600 }}>
            {statusMessage}
          </div>
        )}
      </div>

      {/* 4. VISUALIZATION CANVAS & PLAYBACK CONTROLS */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Playback Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
              <span>{isPlaying ? 'Pause' : 'Start'}</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <span>{isPlaying ? 'Pause Execution' : 'Resume Execution'}</span>
            </button>

            <button
              className="btn btn-outline"
              disabled={stepIndex <= 0}
              onClick={handlePrevStep}
            >
              <SkipBack style={{ width: 16, height: 16 }} />
              <span>Step Backward</span>
            </button>

            <button
              className="btn btn-outline"
              disabled={stepIndex >= steps.length - 1}
              onClick={handleNextStep}
            >
              <SkipForward style={{ width: 16, height: 16 }} />
              <span>Step Forward</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={handleReset}
            >
              <RotateCcw style={{ width: 16, height: 16 }} />
              <span>Reset</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Speed Control:</span>
            <input
              type="range"
              min="100"
              max="1200"
              step="100"
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              style={{ width: '100px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {speedMs}ms
            </span>
          </div>
        </div>

        {/* Array Bars Visualization Canvas */}
        <div 
          style={{ 
            minHeight: '280px', 
            maxWidth: '100%',
            overflowX: 'auto',
            backgroundColor: 'var(--bg-root)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '16px',
            position: 'relative'
          }}
        >
          {currentStep.array.map((val, idx) => {
            const barHeight = Math.max(30, Math.min(220, val * 2.2));
            const barBg = getBarColor(idx);
            const pointer = currentStep.pointers?.find(p => p.index === idx);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative'
                }}
              >
                {/* Pointer Tag */}
                {pointer && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-28px',
                      backgroundColor: pointer.color,
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      zIndex: 2
                    }}
                  >
                    {pointer.label}
                  </div>
                )}

                {/* Element Value Label */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {val}
                </span>

                {/* Animated Bar */}
                <div
                  style={{
                    width: '42px',
                    height: `${barHeight}px`,
                    backgroundColor: barBg,
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                />

                {/* Index Label */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Specialized Canvas Overlays (Traversal Order, Call Stack, DP Table) */}
        {currentStep.traversalOrder && currentStep.traversalOrder.length > 0 && (
          <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-cyan)' }}>Traversal Output Order:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              {currentStep.traversalOrder.map((item, i) => (
                <span key={i} style={{ padding: '2px 8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', borderRadius: '4px', fontWeight: 700 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentStep.callStack && currentStep.callStack.length > 0 && (
          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-purple)' }}>Recursion Call Stack (Depth: {currentStep.callStack.length}):</span>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '6px' }}>
              {currentStep.callStack.map((frame, fIdx) => (
                <div key={fIdx} style={{ padding: '6px 12px', backgroundColor: frame.isUnwinding ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-root)', border: `1px solid ${frame.isUnwinding ? '#10b981' : 'var(--border-subtle)'}`, borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{frame.funcName}({frame.arg})</span>
                  {frame.returnVal !== undefined && (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>returns {frame.returnVal}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep.dpTable && currentStep.dpTable.length > 0 && (
          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-cyan)' }}>DP State Tabulation Table:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
              {currentStep.dpTable.map((cell) => (
                <div key={cell.index} style={{ padding: '8px 12px', backgroundColor: cell.isComputing ? 'rgba(245, 158, 11, 0.2)' : cell.isFinal ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-root)', border: `1px solid ${cell.isComputing ? 'var(--color-amber)' : cell.isFinal ? '#10b981' : 'var(--border-subtle)'}`, borderRadius: '6px', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>dp[{cell.index}]</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{cell.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution Log Narration Box */}
        <div 
          style={{ 
            padding: '14px 18px', 
            backgroundColor: 'var(--bg-surface-elevated)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Step {stepIndex + 1} of {steps.length}</span>
            <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)' }}>
              <span>Total Comparisons: <strong>{currentStep.totalComparisons}</strong></span>
              <span>Total Swaps: <strong>{currentStep.totalSwaps}</strong></span>
            </div>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRight style={{ width: 14, height: 14, color: 'var(--color-cyan)' }} />
            <span>{currentStep.description}</span>
          </div>
        </div>

      </div>

      {/* 5. TIME & SPACE COMPLEXITY ANALYSIS CARD */}
      {(() => {
        const comp = getAlgorithmComplexity(selectedSubPart, selectedCategory);
        return (
          <div 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
              <Clock style={{ width: 16, height: 16 }} />
              <span>Time & Auxiliary Space Complexity: {selectedSubPart}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Best Time</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--easy-color)', fontSize: '0.95rem' }}>{comp.best}</strong>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Average Time</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--medium-color)', fontSize: '0.95rem' }}>{comp.avg}</strong>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Worst Time</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--hard-color)', fontSize: '0.95rem' }}>{comp.worst}</strong>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Aux Space</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{comp.space}</strong>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 6. ALGORITHM CODE LOGIC & LANGUAGE SELECTOR CARD */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code style={{ width: 18, height: 18, color: 'var(--color-cyan)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Algorithm Code Implementation: <span style={{ color: 'var(--color-cyan)' }}>{selectedSubPart}</span>
            </h3>
          </div>
        </div>

        <pre 
          style={{ 
            backgroundColor: 'var(--bg-root)', 
            padding: '16px 20px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            overflowX: 'auto',
            margin: 0,
            lineHeight: 1.6
          }}
        >
          <code>{getAlgorithmCodeSnippet(selectedSubPart, selectedCategory, preferredLanguage)}</code>
        </pre>
      </div>

      {/* 6. SOLVE RELATED DSA PROBLEMS CARD */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle style={{ width: 18, height: 18, color: 'var(--easy-color)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Solve Related DSA Problems ({selectedSubPart})
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
          Master this concept by solving real practice questions directly in the interactive compiler.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {getRelatedProblems(selectedCategory, selectedSubPart).map((prob) => {
            const diffColor = prob.difficulty === 'Easy' ? 'var(--easy-color)' : prob.difficulty === 'Medium' ? 'var(--medium-color)' : 'var(--hard-color)';
            return (
              <div 
                key={prob.id}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {prob.title}
                  </span>
                  <span 
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: diffColor,
                      border: `1px solid ${diffColor}`,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {prob.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Topic: {prob.topic}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ gap: '4px', fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => {
                      if (onNavigateTab) {
                        onNavigateTab('problem_detail', prob.id);
                      }
                    }}
                  >
                    <span>Solve</span>
                    <ExternalLink style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
