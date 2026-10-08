export type CppLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface CppTopicNote {
  id: string;
  title: string;
  category: string;
  level: CppLevel;
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

export const CPP_CATEGORIES = [
  'Introduction to C++',
  'C++ Program Structure',
  'Variables and Data Types',
  'Constants and Literals',
  'Type Conversion and Casting',
  'Operators',
  'Input and Output',
  'Conditional Statements',
  'Loops',
  'Functions',
  'Function Overloading',
  'Default Arguments',
  'Recursion',
  'Arrays',
  'Strings',
  'Pointers',
  'References',
  'Dynamic Memory',
  'Structures',
  'Classes and Objects',
  'Constructors',
  'Destructors',
  'Encapsulation',
  'Inheritance',
  'Polymorphism',
  'Abstraction',
  'Virtual Functions',
  'Pure Virtual Functions',
  'Abstract Classes',
  'Operator Overloading',
  'Friend Functions',
  'Static Members',
  'this Pointer',
  'Namespaces',
  'Templates',
  'Function Templates',
  'Class Templates',
  'Exception Handling',
  'File Handling',
  'Preprocessor',
  'Header Files',
  'Lambda Expressions',
  'STL',
  'Iterators',
  'Algorithms Library',
  'Containers',
  'Modern C++',
  'Smart Pointers',
  'Move Semantics',
  'Memory Management',
  'Multithreading',
  'C++ for DSA',
  'Competitive Programming with C++',
  'Advanced C++',
  'C++ Projects'
] as const;

export type CppCategory = typeof CPP_CATEGORIES[number];

const CATEGORY_TOPIC_MAP: Record<CppCategory, string[]> = {
  'Introduction to C++': ['C++ Evolution and Features', 'Compiling and Linking C++ Code', 'C++ vs C Key Differences'],
  'C++ Program Structure': ['Main Function Entry Point', 'Header Inclusions (#include <iostream>)', 'Namespaces and std::'],
  'Variables and Data Types': ['Primitive Data Types and Sizeof', 'auto Keyword and Type Inference', 'decltype Type Deduction'],
  'Constants and Literals': ['const Qualifier vs constexpr', 'Literal Suffixes (u, l, f)'],
  'Type Conversion and Casting': ['Implicit Type Promotion', 'Modern C++ Casts (static_cast, reinterpret_cast, const_cast)'],
  'Operators': ['Arithmetic and Bitwise Operators', 'Relational and Logical Operators', 'Operator Precedence and Overloading Rules'],
  'Input and Output': ['Standard I/O Streams (cin, cout, cerr, clog)', 'Stream Manipulators (std::endl, std::setw, std::fixed)'],
  'Conditional Statements': ['If, Else If, and Else Statements', 'Switch Case and [[fallthrough]]', 'Ternary Conditional Expressions'],
  'Loops': ['For Loops and Counter Variables', 'Range-based For Loops (for (const auto& x : container))', 'While and Do-While Loops'],
  'Functions': ['Function Declarations and Definitions', 'Pass-by-Value vs Pass-by-Reference', 'Inline Functions (inline keyword)'],
  'Function Overloading': ['Function Overloading Invariants', 'Name Mangling and Symbol Resolution'],
  'Default Arguments': ['Default Parameter Values', 'Default Arguments Rules in Header Files'],
  'Recursion': ['Recursive Call Stack Mechanics', 'Tail Call Optimization in C++'],
  'Arrays': ['Fixed-Size C-Style Arrays', 'std::array Container Wrapper'],
  'Strings': ['std::string Class and Operations', 'std::string_view for Zero-Copy Strings'],
  'Pointers': ['Pointer Declarations and & Address-Of', 'Dereferencing Pointers with * Operator', 'Null Pointers (nullptr vs NULL)'],
  'References': ['Lvalue References (T&)', 'Pointers vs References Comparison', 'Const References (const T&)'],
  'Dynamic Memory': ['New and Delete Operators (new, delete, new[], delete[])', 'Memory Leaks and RAII Pattern'],
  'Structures': ['Struct Declaration in C++', 'Struct vs Class Default Access Specifiers'],
  'Classes and Objects': ['Class Definition and Access Specifiers (public, private, protected)', 'Member Functions and Object Instantiation'],
  'Constructors': ['Default and Parameterized Constructors', 'Member Initializer Lists', 'Copy Constructors and Shallow vs Deep Copy'],
  'Destructors': ['Destructors (~ClassName)', 'RAII and Deterministic Cleanup'],
  'Encapsulation': ['Data Hiding and Getters/Setters', 'Maintaining Class Invariants'],
  'Inheritance': ['Public, Protected, and Private Inheritance', 'Multiple Inheritance and Diamond Problem (virtual base class)'],
  'Polymorphism': ['Compile-Time vs Run-Time Polymorphism', 'Virtual Functions and VTable/VPtr Mechanics'],
  'Abstraction': ['Interface Design and Abstraction Boundaries'],
  'Virtual Functions': ['Virtual Functions and Dynamic Dispatch', 'Override and Final Keywords'],
  'Pure Virtual Functions': ['Pure Virtual Function Syntax (= 0)', 'Abstract Base Classes'],
  'Abstract Classes': ['Interface Contracts in C++', 'Polymorphic Base Destructors (virtual ~Base())'],
  'Operator Overloading': ['Overloading Binary and Unary Operators', 'Overloading Stream Operators (<< and >>)'],
  'Friend Functions': ['Friend Functions and Friend Classes'],
  'Static Members': ['Static Class Variables and Lifetime', 'Static Member Functions'],
  'this Pointer': ['this Pointer Usage', 'Method Chaining returning *this'],
  'Namespaces': ['Defining Custom Namespaces', 'Namespace Aliases and Anonymous Namespaces'],
  'Templates': ['Generic Programming Principles'],
  'Function Templates': ['Function Template Syntax (template <typename T>)', 'Template Argument Deduction'],
  'Class Templates': ['Class Template Definition', 'Template Specialization (Full and Partial)'],
  'Exception Handling': ['Try, Catch, and Throw Blocks', 'Standard Exception Hierarchy (std::exception)', 'noexcept Specifier'],
  'File Handling': ['std::fstream, std::ifstream, std::ofstream', 'Reading and Writing Text vs Binary Files'],
  'Preprocessor': ['Include Guards (#pragma once / #ifndef)', 'Conditional Preprocessing'],
  'Header Files': ['Header (.h / .hpp) and Source (.cpp) Separation', 'Forward Declarations'],
  'Lambda Expressions': ['Lambda Expression Syntax ([captures](params) { body })', 'Capture Modes ([=], [&], [x, &y])'],
  'STL': ['Standard Template Library Overview'],
  'Iterators': ['Iterator Categories (Input, Output, Forward, Bidirectional, RandomAccess)', 'std::begin and std::end'],
  'Algorithms Library': ['std::sort and Custom Comparators', 'Binary Search Algorithms (std::binary_search, std::lower_bound, std::upper_bound)', 'Modifying Algorithms (std::transform, std::reverse, std::accumulate)'],
  'Containers': ['Sequence Containers (std::vector, std::deque, std::list, std::forward_list)', 'Container Adapters (std::stack, std::queue, std::priority_queue)', 'Associative Containers (std::set, std::map, std::multiset, std::multimap)', 'Unordered Associative Containers (std::unordered_set, std::unordered_map)', 'Utility Containers (std::pair, std::tuple)'],
  'Modern C++': ['Modern C++ Overview (C++11 through C++20)', 'RAII Idiom', 'Structured Bindings (auto [a, b] = p)', 'std::optional, std::variant, std::any', 'C++20 Concepts and Requires Clauses'],
  'Smart Pointers': ['std::unique_ptr Exclusive Ownership', 'std::shared_ptr Shared Ownership and Ref Counting', 'std::weak_ptr Breaking Circular References'],
  'Move Semantics': ['Rvalue References (T&&)', 'std::move and Move Constructors / Move Assignment'],
  'Memory Management': ['Stack vs Heap Allocation in C++', 'Custom Memory Allocators Overview'],
  'Multithreading': ['std::thread and Thread Lifecycle', 'std::mutex and std::lock_guard', 'std::async and std::future'],
  'C++ for DSA': ['Arrays in C++ (std::vector & std::array)', 'Strings in C++ for DSA (std::string)', 'Linked Lists in C++ (std::list & Custom Structs)', 'Stacks and Queues in C++ (std::stack & std::queue)', 'Deques in C++ (std::deque)', 'Hash Tables in C++ (std::unordered_map & std::unordered_set)', 'Sets and Maps in C++ (std::set & std::map)', 'Trees and BST in C++', 'AVL Trees in C++', 'Heaps and Priority Queues in C++ (std::priority_queue)', 'Graphs in C++ (Adjacency List with vector<vector<int>>)', 'BFS Traversal in C++', 'DFS Traversal in C++', 'Recursion and Backtracking in C++', 'Sorting Algorithms in C++', 'Searching Algorithms in C++ (std::lower_bound / std::upper_bound)', 'Two Pointers Pattern in C++', 'Sliding Window Pattern in C++', 'Prefix Sum Pattern in C++', 'Greedy Algorithms in C++', 'Dynamic Programming in C++ (vector<vector<int>> DP Tables)', 'Bit Manipulation in C++', 'Trie Data Structure in C++', 'Union Find (Disjoint Set Union) in C++', 'Graph Algorithms in C++ (Dijkstra, Kruskal, Prim)'],
  'Competitive Programming with C++': ['Fast I/O Setup (ios_base::sync_with_stdio(false); cin.tie(NULL);)', 'Competitive Programming C++ Template'],
  'Advanced C++': ['Metaprogramming with constexpr and SFINAE', 'Expression Templates Overview'],
  'C++ Projects': ['CLI Banking System Project', 'Custom Thread Pool Engine Project', 'High-Performance REST API Microservice Project']
};

function getLevelForTopic(category: string, _title: string): CppLevel {
  if (
    category.includes('Introduction') ||
    category.includes('Structure') ||
    category.includes('Variables') ||
    category.includes('Constants') ||
    category.includes('Operators') ||
    category.includes('Input') ||
    category.includes('Conditional') ||
    category.includes('Loops') ||
    category.includes('Functions') ||
    category.includes('Arrays')
  ) {
    return 'Beginner';
  }

  if (
    category.includes('Smart Pointers') ||
    category.includes('Move Semantics') ||
    category.includes('Modern C++') ||
    category.includes('Multithreading') ||
    category.includes('Advanced C++') ||
    category.includes('Templates') ||
    category.includes('C++ for DSA') ||
    category.includes('Projects')
  ) {
    return 'Advanced';
  }

  return 'Intermediate';
}

function buildComprehensiveCppNote(category: CppCategory, title: string): CppTopicNote {
  const level = getLevelForTopic(category, title);

  let whatItIs = `**${title}** is a fundamental feature of C++ within the category of **${category}**.`;
  let whyUsed = `C++ provides zero-cost abstractions, deterministic object lifetime (RAII), high performance, and an extensive Standard Template Library (STL).`;
  let howItWorks = `The C++ compiler compiles code into native binary instructions, supporting static compile-time template expansions and dynamic runtime vtable dispatches.`;
  let syntax = `// Syntax for ${title}\n#include <iostream>\n\nint main() {\n    // Code here\n    return 0;\n}`;
  let codeExamples: CodeSnippetExample[] = [
    {
      title: `${title} Example`,
      code: `#include <iostream>\n\nint main() {\n    std::cout << "Executing ${title}" << std::endl;\n    return 0;\n}`,
      explanation: "Line 1: #include <iostream> includes standard stream I/O.\nLine 3: main() entry point.\nLine 4: std::cout prints to console."
    }
  ];
  let importantRules = [
    'Prefer modern C++ features (`auto`, `nullptr`, smart pointers, range-based `for`) over obsolete C-style practices.',
    'Follow RAII: manage resources (files, memory, locks) inside object constructors and destructors.'
  ];
  let commonMistakes = [
    'Mixing raw `new`/`delete` calls instead of using smart pointers (`std::unique_ptr`).',
    'Forgetting `std::ios_base::sync_with_stdio(false)` for fast competitive programming I/O.'
  ];
  let realWorldUse = `Used extensively in Game Engines (Unreal Engine), High-Frequency Trading systems, Web Browsers (Chrome/V8), Operating Systems, and AI frameworks (PyTorch C++ backend).`;
  let timeComplexity: string | undefined = undefined;
  let spaceComplexity: string | undefined = undefined;
  let relatedConcepts = ['STL', 'RAII', 'Templates', 'Modern C++'];
  let practiceQuestions: PracticeQuestion[] = [
    {
      question: `What is the primary benefit of ${title} in modern C++?`,
      answer: `It improves code safety, maintainability, and runtime efficiency without adding runtime overhead.`
    }
  ];
  let dsaConnection = `Essential for implementing efficient Data Structures & Algorithms, utilizing STL containers, and competing in competitive programming.`;

  // Specific content overrides for core topics & search keywords
  if (title.includes('Pointers vs References') || title.includes('References') || title === 'References') {
    whatItIs = `In C++, **Pointers** (\`int* p\`) store memory addresses, while **References** (\`int& r\`) act as immutable aliases for existing variables.`;
    whyUsed = `References provide clean syntax for pass-by-reference without dereferencing syntax, while pointers allow dynamic re-assignment and optional NULL states.`;
    howItWorks = `Consider code: \`int x = 10; int* p = &x; int& r = x;\`
- **\`x\`**: An integer variable allocated in memory storing value \`10\`.
- **\`&x\`**: Memory address of \`x\` (e.g. \`0x7ffeefbff5ac\`).
- **\`p\`**: Pointer variable storing address \`0x7ffeefbff5ac\`.
- **\`*p\`**: Dereference operator accessing value stored at address \`p\` (\`10\`).
- **\`r\`**: An alias directly bound to \`x\`. Modifying \`r\` modifies \`x\` directly.
- **Pointers vs References Difference**: Pointers can be reassigned and be \`nullptr\`; References MUST be initialized at declaration and CANNOT be rebound to another variable.`;
    syntax = `int x = 10;\nint* p = &x;  // Pointer storing address of x\nint& r = x;   // Reference alias for x\n\n*p = 20; // x becomes 20\nr = 30;  // x becomes 30`;
    codeExamples = [
      {
        title: 'Pointers vs References Demonstration',
        code: `#include <iostream>\n\nvoid modifyByPointer(int* ptr) {\n    if (ptr != nullptr) {\n        *ptr += 10;\n    }\n}\n\nvoid modifyByReference(int& ref) {\n    ref += 10;\n}\n\nint main() {\n    int num = 50;\n    modifyByPointer(&num);     // num becomes 60\n    modifyByReference(num);    // num becomes 70\n    std::cout << "num = " << num << std::endl;\n    return 0;\n}`,
        explanation: "Line 3: modifyByPointer requires explicit nullptr check and & argument.\nLine 9: modifyByReference provides cleaner syntax directly mutating caller variable."
      }
    ];
    importantRules = [
      'Prefer const references (`const T&`) for passing large objects into functions to avoid copying without allowing mutation.',
      'References must be bound at creation and cannot be NULL.'
    ];
    commonMistakes = [
      'Returning a reference to a local stack variable from a function (Dangling Reference).',
      'Attempting to rebind a reference to point to another variable.'
    ];
    realWorldUse = 'Function argument passing across C++ libraries, copy constructors (`T(const T&)`), operator overloading.';
    timeComplexity = 'O(1) pointer/alias memory access.';
    spaceComplexity = 'References are optimized away by compiler; pointers occupy 8 bytes on 64-bit systems.';
    relatedConcepts = ['Const References', 'Pointers', 'Pass-by-Reference', 'Lvalues'];
    practiceQuestions = [
      { question: 'Can a reference in C++ be nullptr?', answer: 'No, references must always be bound to a valid lvalue object upon initialization.' }
    ];
    dsaConnection = 'Const references are used in custom STL comparators and graph traversal function calls to avoid unnecessary memory allocations.';
  } else if (title.includes('vector') || title.includes('std::vector')) {
    whatItIs = `**\`std::vector\`** is the standard C++ dynamic sequence container that automatically resizes its contiguous array memory when elements are added or removed.`;
    whyUsed = `Provides O(1) random index access, contiguous memory for cache locality, and dynamic capacity growth.`;
    howItWorks = `Stores elements in contiguous heap memory. When capacity is reached, it allocates ~1.5x to 2x new memory, moves existing elements, and frees old memory.`;
    syntax = `#include <vector>\n\nstd::vector<int> vec = {1, 2, 3};\nvec.push_back(4);  // Appends 4\nvec.emplace_back(5); // In-place construction\nint val = vec[0];  // O(1) access`;
    codeExamples = [
      {
        title: 'std::vector Operations & Iteration',
        code: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9};\n    nums.push_back(10);\n    std::sort(nums.begin(), nums.end());\n    \n    for (int x : nums) {\n        std::cout << x << " "; // 1 2 5 8 9 10\n    }\n    return 0;\n}`,
        explanation: "Line 6: vec.push_back() appends element in amortized O(1).\nLine 7: std::sort sorts vector in O(N log N)."
      }
    ];
    importantRules = [
      'Use `vec.reserve(N)` if final size is known in advance to avoid multiple re-allocations.',
      'Use `vec.emplace_back()` instead of `push_back()` when constructing objects directly in place.'
    ];
    commonMistakes = [
      'Using `vec[i]` with an out-of-range index; use `vec.at(i)` for bounds-checked access throwing `std::out_of_range`.',
      'Calling `push_back()` inside a loop without pre-reserving memory.'
    ];
    realWorldUse = 'Primary container in modern C++ applications, game engine entity lists, database result sets.';
    timeComplexity = 'Random Access: O(1), Append: O(1) amortized, Insert/Delete at Middle: O(N).';
    spaceComplexity = 'O(N) contiguous memory allocation.';
    relatedConcepts = ['Containers', 'Iterators', 'std::sort', 'Cache Locality'];
    practiceQuestions = [
      { question: 'What is the difference between vector size() and capacity()?', answer: 'size() is the current number of elements; capacity() is the total memory allocated before reallocating.' }
    ];
    dsaConnection = 'Default workhorse container for 1D/2D arrays, Dynamic Programming tables (`vector<vector<int>>`), and Graph Adjacency Lists.';
  } else if (title.includes('unordered_map') || title.includes('Hash Tables in C++')) {
    whatItIs = `**\`std::unordered_map\`** is an associative container that stores key-value pairs using a Hash Table with average O(1) time complexity for lookup, insertion, and deletion.`;
    whyUsed = `Offers fast O(1) average lookup times when key ordering is not required.`;
    howItWorks = `Uses bucket array hashing with chaining (linked list buckets) to handle collision resolution.`;
    syntax = `#include <unordered_map>\n\nstd::unordered_map<std::string, int> freq;\nfreq["apple"] = 5;\nif (freq.find("apple") != freq.end()) {\n    std::cout << "Found: " << freq["apple"];\n}`;
    codeExamples = [
      {
        title: 'Frequency Counter using std::unordered_map',
        code: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nint main() {\n    std::vector<int> nums = {1, 2, 2, 3, 3, 3};\n    std::unordered_map<int, int> counts;\n    \n    for (int num : nums) {\n        counts[num]++;\n    }\n    \n    for (const auto& [key, val] : counts) {\n        std::cout << key << ": " << val << "\\n";\n    }\n    return 0;\n}`,
        explanation: "Line 10: counts[num]++ inserts or increments frequency in average O(1).\nLine 13: Structured binding auto [key, val] unpacks map pair."
      }
    ];
    importantRules = [
      'Keys must have a specialized `std::hash<Key>` functor (built-in for primitives and strings; custom structs require custom hash functions).',
      'For sorted key order, use `std::map` (Red-Black BST, O(log N)) instead of `std::unordered_map`.'
    ];
    commonMistakes = [
      'Using `map[key]` to read missing keys; this inserts a default-constructed value! Use `map.find(key)` or `map.contains(key)` (C++20).',
      'Worst-case O(N) complexity on hash collisions in competitive programming (use custom hash splitmix64).'
    ];
    realWorldUse = 'Caching layers, session management, database indexing, symbol tables in compilers.';
    timeComplexity = 'Average: O(1) for insert/find/erase; Worst-case: O(N) on bucket collision.';
    spaceComplexity = 'O(N) bucket and node allocation.';
    relatedConcepts = ['std::map', 'std::unordered_set', 'Hash Functions', 'Structured Bindings'];
    practiceQuestions = [
      { question: 'How do you check if a key exists in an unordered_map without inserting a default value?', answer: 'Use map.find(key) != map.end() or map.contains(key) in C++20.' }
    ];
    dsaConnection = 'Primary C++ container for 2-Sum problem, Frequency Maps, Top-Down DP Memoization, and Graph Adjacency Maps.';
  } else if (title.includes('Smart Pointers') || title.includes('unique_ptr') || title.includes('shared_ptr')) {
    whatItIs = `**Smart Pointers** (\`std::unique_ptr\`, \`std::shared_ptr\`, \`std::weak_ptr\`) are RAII object wrappers over raw pointers that automatically manage heap memory lifetime and prevent memory leaks.`;
    whyUsed = `Eliminates manual \`delete\` calls, dangling pointers, double-frees, and memory leak bugs in modern C++.`;
    howItWorks = `
- **\`std::unique_ptr\`**: Exclusive ownership model. Cannot be copied, only moved (\`std::move\`). Frees memory when going out of scope.
- **\`std::shared_ptr\`**: Shared ownership model. Maintains a control block with a reference count. Frees memory when ref count hits 0.
- **\`std::weak_ptr\`**: Non-owning observer of a \`shared_ptr\` to break circular reference memory leaks.`;
    syntax = `#include <memory>\n\n// Create unique_ptr\nauto ptr1 = std::make_unique<int>(42);\n\n// Create shared_ptr\nauto ptr2 = std::make_shared<std::string>("ALGOrise");`;
    codeExamples = [
      {
        title: 'Modern C++ Smart Pointers Example',
        code: `#include <iostream>\n#include <memory>\n\nclass Resource {\npublic:\n    Resource() { std::cout << "Resource Acquired\\n"; }\n    ~Resource() { std::cout << "Resource Destroyed\\n"; }\n    void greet() { std::cout << "Hello from Resource\\n"; }\n};\n\nint main() {\n    {\n        auto res = std::make_unique<Resource>();\n        res->greet();\n    } // res automatically destroyed here at end of scope\n    return 0;\n}`,
        explanation: "Line 12: std::make_unique allocates Resource.\nLine 14: End of block scope automatically invokes Resource destructor without explicit delete!"
      }
    ];
    importantRules = [
      'Prefer `std::make_unique` and `std::make_shared` over raw `new` calls.',
      'Default to `std::unique_ptr` for exclusive ownership; only use `std::shared_ptr` when true shared ownership is required.'
    ];
    commonMistakes = [
      'Creating circular `shared_ptr` references, preventing reference count from reaching zero (use `weak_ptr`).',
      'Copying a `unique_ptr` (compilation error; use `std::move()`).'
    ];
    realWorldUse = 'Modern game engines, GUI frameworks, web server connections, operating system abstractions.';
    timeComplexity = 'O(1) allocation and smart pointer overhead.';
    spaceComplexity = 'unique_ptr: 8 bytes (zero overhead over raw pointer); shared_ptr: 16 bytes (pointer + control block).';
    relatedConcepts = ['RAII', 'Move Semantics', 'Ownership', 'Resource Management'];
    practiceQuestions = [
      { question: 'Why is make_unique preferred over new in modern C++?', answer: 'It is exception-safe, prevents memory leaks if an exception occurs during construction, and offers cleaner syntax.' }
    ];
    dsaConnection = 'Used in production C++ data structures (Trees, Graphs, ASTs) for safe, automated node lifetime management.';
  } else if (title.includes('Move Semantics') || title.includes('std::move') || title.includes('Rvalue')) {
    whatItIs = `**Move Semantics** (introduced in C++11) allows transferring resources (like dynamic memory allocations) from a temporary rvalue object to another object without making deep copies.`;
    whyUsed = "Eliminates expensive deep copying of large containers (std::vector, std::string), resulting in massive performance gains.";
    howItWorks = `Uses Rvalue References (\`T&&\`) and \`std::move()\`. Instead of allocating new memory and copying data, move constructors swap internal memory pointers and leave the source object in a valid but empty state.`;
    syntax = `#include <utility>\n\nstd::vector<int> v1 = {1, 2, 3, 4, 5};\n// Transfer ownership of v1 buffer to v2\nstd::vector<int> v2 = std::move(v1); // v1 is now empty`;
    codeExamples = [
      {
        title: 'Move Constructor vs Copy Constructor',
        code: `#include <iostream>\n#include <vector>\n#include <utility>\n\nclass Buffer {\npublic:\n    int* data;\n    size_t size;\n    \n    Buffer(size_t s) : size(s), data(new int[s]) {}\n    ~Buffer() { delete[] data; }\n    \n    // Move Constructor\n    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {\n        other.data = nullptr;\n        other.size = 0;\n    }\n};\n\nint main() {\n    Buffer b1(1000000);\n    Buffer b2 = std::move(b1); // Instant O(1) pointer transfer\n    return 0;\n}`,
        explanation: "Line 13: Buffer(Buffer&& other) takes rvalue reference, steals other.data pointer, and sets other.data to nullptr."
      }
    ];
    importantRules = [
      'Mark move constructors and move assignment operators with `noexcept` so STL containers (`vector`) use them during reallocation.',
      'After `std::move(obj)`, the source object is in a "valid but unspecified" state; do not read its old data.'
    ];
    commonMistakes = [
      'Calling `std::move` on local return values inside functions (prevents RVO / NRVO compiler optimizations).',
      'Using an object after moving from it without re-initializing it.'
    ];
    realWorldUse = 'High-frequency trading engines, audio processing, database query response moving, standard library containers.';
    timeComplexity = 'O(1) constant pointer swap time vs O(N) deep copy.';
    spaceComplexity = 'O(1) auxiliary space.';
    relatedConcepts = ['Rvalues and Lvalues', 'std::move', 'noexcept', 'RAII'];
    practiceQuestions = [
      { question: 'What does std::move() actually do in C++?', answer: 'It does not move anything at runtime; it performs an explicit static_cast to an rvalue reference (T&&).' }
    ];
    dsaConnection = 'Used in fast STL container reallocations and returning complex graph/tree structures from recursive functions efficiently.';
  } else if (category === 'C++ for DSA' || title.includes('Trees') || title.includes('Graphs') || title.includes('Binary Search')) {
    whatItIs = `**${title}** covers both idiomatic C++ algorithm implementation and STL utilization (\`std::vector\`, \`std::priority_queue\`, \`std::unordered_map\`) for optimal Data Structures & Algorithms performance.`;
    whyUsed = `C++ is the global gold-standard language for Competitive Programming and DSA due to STL speed, zero-overhead templates, fast I/O, and fine-grained control over memory.`;
    howItWorks = `Combines high-performance STL templates with native memory pointer/reference manipulation for top algorithmic speed.`;
    syntax = `// ${title} Syntax Pattern in C++\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;`;
    codeExamples = [
      {
        title: `${title} Implementation in C++`,
        code: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    vector<int> nums = {1, 3, 5, 7, 9};\n    auto it = lower_bound(nums.begin(), nums.end(), 5);\n    cout << "Index: " << (it - nums.begin()) << "\\n"; // 2\n    return 0;\n}`,
        explanation: "Line 9: Fast I/O setup disabling sync with stdio.\nLine 14: std::lower_bound performs Binary Search in O(log N)."
      }
    ];
    importantRules = [
      'Always disable stream synchronization (`ios_base::sync_with_stdio(false); cin.tie(NULL);`) for competitive programming.',
      'Pass containers by const reference (`const vector<int>&`) to prevent O(N) copies.'
    ];
    commonMistakes = [
      'Using `endl` inside fast loops (flushes buffer every iteration, slowing execution down 10x); use `\\n`.',
      'Index out of bounds errors when accessing vector indices.'
    ];
    realWorldUse = 'Competitive programming (Codeforces, LeetCode, ALGOrise), high-frequency algorithm trading, compiler optimization.';
    timeComplexity = 'O(1), O(log N), O(N), or O(N log N) depending on algorithm.';
    spaceComplexity = 'O(1) to O(N) space.';
    relatedConcepts = ['STL Containers', 'Fast I/O', 'Binary Search', 'Big-O Notation'];
    practiceQuestions = [
      { question: 'Why should you use \\n instead of std::endl in fast C++ loops?', answer: 'std::endl explicitly flushes the I/O buffer to disk/console on every line, causing severe performance slowdowns.' }
    ];
    dsaConnection = 'Core engine for solving competitive programming questions and algorithmic coding interviews.';
  }

  return {
    id: `cpp-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    category,
    level,
    whatItIs,
    whyUsed,
    howItWorks,
    syntax,
    codeExamples,
    importantRules,
    commonMistakes,
    realWorldUse,
    timeComplexity,
    spaceComplexity,
    relatedConcepts,
    practiceQuestions,
    dsaConnection
  };
}

class CppNotesService {
  private allNotes: CppTopicNote[] = [];

  constructor() {
    this.generateAllCppNotes();
  }

  private generateAllCppNotes() {
    const list: CppTopicNote[] = [];
    (Object.keys(CATEGORY_TOPIC_MAP) as CppCategory[]).forEach((cat) => {
      const topics = CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveCppNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): CppTopicNote[] {
    return this.allNotes;
  }

  public getCategories(): readonly CppCategory[] {
    return CPP_CATEGORIES;
  }

  public getNoteById(id: string): CppTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): CppTopicNote[] {
    const q = query.toLowerCase().trim();
    return this.allNotes.filter((note) => {
      const matchesCat = categoryFilter === 'All' || note.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || note.level === levelFilter;
      
      if (!matchesCat || !matchesLevel) return false;
      if (!q) return true;

      const titleMatch = note.title.toLowerCase().includes(q);
      const categoryMatch = note.category.toLowerCase().includes(q);
      const whatMatch = note.whatItIs.toLowerCase().includes(q);
      const codeMatch = note.codeExamples.some(c => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      const conceptMatch = note.relatedConcepts.some(rc => rc.toLowerCase().includes(q));
      
      return titleMatch || categoryMatch || whatMatch || codeMatch || conceptMatch;
    });
  }
}

export const cppNotesService = new CppNotesService();
