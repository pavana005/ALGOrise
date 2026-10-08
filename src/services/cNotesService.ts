export type CLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface CTopicNote {
  id: string;
  title: string;
  category: string;
  level: CLevel;
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

export const C_CATEGORIES = [
  'Introduction to C',
  'C Program Structure',
  'Variables and Constants',
  'Data Types',
  'Type Conversion and Casting',
  'Operators',
  'Input and Output',
  'Conditional Statements',
  'Loops',
  'Functions',
  'Recursion',
  'Arrays',
  'Multidimensional Arrays',
  'Strings',
  'Pointers',
  'Pointer Arithmetic',
  'Pointers and Arrays',
  'Pointers and Functions',
  'Double Pointers',
  'Dynamic Memory Allocation',
  'Structures',
  'Unions',
  'Enumerations',
  'Typedef',
  'Storage Classes',
  'Scope and Lifetime',
  'Preprocessor',
  'Macros',
  'Header Files',
  'File Handling',
  'Command Line Arguments',
  'Bit Manipulation',
  'Error Handling',
  'Memory Management',
  'Debugging',
  'C Standard Library',
  'Advanced Pointers',
  'Function Pointers',
  'Callbacks',
  'Modular Programming',
  'Data Structures in C',
  'Algorithms in C',
  'C for DSA',
  'Competitive Programming with C',
  'C Projects'
] as const;

export type CCategory = typeof C_CATEGORIES[number];

const CATEGORY_TOPIC_MAP: Record<CCategory, string[]> = {
  'Introduction to C': ['History of C and Features', 'Compiling and Running C Programs', 'C Compiler Tools (GCC/Clang)'],
  'C Program Structure': ['Main Function and Entry Point', 'Header Inclusions (#include <stdio.h>)', 'Comments and Formatting Rules'],
  'Variables and Constants': ['Variable Declaration and Initialization', 'Constants and #define vs const', 'Keywords and Identifiers'],
  'Data Types': ['Primitive Data Types (int, float, double, char)', 'Signed vs Unsigned Types', 'Sizeof Operator and Memory Layout'],
  'Type Conversion and Casting': ['Implicit Type Promotion', 'Explicit Casting Syntax (type)var'],
  'Operators': ['Arithmetic Operators', 'Relational and Logical Operators', 'Bitwise Operators in C', 'Assignment and Increment/Decrement Operators', 'Operator Precedence and Associativity'],
  'Input and Output': ['Formatted Output with printf()', 'Formatted Input with scanf()', 'Format Specifiers (%d, %f, %c, %s, %p)'],
  'Conditional Statements': ['If, Else If, and Else', 'Switch Case Statements and break', 'Ternary Conditional Operator'],
  'Loops': ['For Loops and Counter Variables', 'While Loops and Condition Checking', 'Do-While Loops', 'Break, Continue, and Goto'],
  'Functions': ['Function Prototypes and Definitions', 'Pass by Value', 'Pass by Reference (via Pointers)', 'Return Values and Void Functions'],
  'Recursion': ['Recursive Function Mechanics', 'Call Stack and Frame Allocation', 'Base Cases and Stack Overflow'],
  'Arrays': ['1D Array Declaration and Indexing', 'Array Memory Contiguity', 'Passing Arrays to Functions'],
  'Multidimensional Arrays': ['2D Arrays and Matrix Representation', 'Row-Major Memory Order in C'],
  'Strings': ['Null-Terminated Character Arrays', 'String Literals vs Char Arrays', 'Standard String Functions (strlen, strcpy, strcat, strcmp)'],
  'Pointers': ['Pointer Fundamentals and & Addresses', 'Dereferencing Pointers with * Operator', 'Null Pointers and Wild Pointers'],
  'Pointer Arithmetic': ['Incrementing and Decrementing Pointers', 'Pointer Subtraction and Offset Math'],
  'Pointers and Arrays': ['Array Name as Constant Pointer', 'Pointer-Based Array Traversal *(arr + i)'],
  'Pointers and Functions': ['Passing Pointers to Functions', 'Returning Pointers from Functions'],
  'Double Pointers': ['Pointers to Pointers (int **pp)', 'Dynamic 2D Array Allocation'],
  'Dynamic Memory Allocation': ['malloc() Allocation', 'calloc() Zero-Initialized Allocation', 'realloc() Resizing Allocation', 'free() and Deallocation'],
  'Structures': ['Defining Structures (struct)', 'Accessing Members with Dot (.) and Arrow (->) Operators', 'Nested Structures and Array of Structs'],
  'Unions': ['Union Definition and Memory Sharing', 'Structures vs Unions Comparison'],
  'Enumerations': ['Enum Declaration and Integer Values', 'Using Enums for State Management'],
  'Typedef': ['Typedef Alias Declarations', 'Typedef with Structs and Function Pointers'],
  'Storage Classes': ['Auto and Register Storage Classes', 'Static Storage Class and Persisted Values', 'Extern Storage Class for Global Files'],
  'Scope and Lifetime': ['Local vs Global Scope', 'Variable Lifetime on Stack vs Data Segment'],
  'Preprocessor': ['Preprocessor Directives (#include, #define)', 'Conditional Compilation (#ifdef, #ifndef, #endif)'],
  'Macros': ['Function-Like Macros', 'Macro Pitfalls and Parentheses Rules'],
  'Header Files': ['Creating Custom Header Files (.h)', 'Header Guards (#ifndef _HEADER_H_)'],
  'File Handling': ['Opening and Closing Files (fopen, fclose)', 'Reading and Writing Text Files (fprintf, fscanf, fgets)', 'Binary File Operations (fread, fwrite)'],
  'Command Line Arguments': ['argc and argv Parameters in main()', 'Parsing Command Line Options'],
  'Bit Manipulation': ['Bitwise AND, OR, XOR, NOT', 'Left Shift and Right Shift Operators', 'Setting, Clearing, and Toggling Bits'],
  'Error Handling': ['Errno and perror() / strerror()', 'Checking Memory Allocation Failures'],
  'Memory Management': ['Stack vs Heap Memory Layout', 'Memory Leaks and Valgrind Detection', 'Dangling Pointers and Buffer Overflows'],
  'Debugging': ['Debugging C Code with GDB', 'Core Dumps and Segmentation Fault Analysis'],
  'C Standard Library': ['stdlib.h Utility Functions', 'math.h Mathematical Functions', 'ctype.h Character Testing Functions'],
  'Advanced Pointers': ['Void Pointers (void*) Generic Pointers', 'Const Pointers vs Pointer to Const'],
  'Function Pointers': ['Function Pointer Syntax and Declaration', 'Invoking Functions via Pointers'],
  'Callbacks': ['Callback Functions in C', 'qsort() Custom Comparator Callbacks'],
  'Modular Programming': ['Separation of Interface (.h) and Implementation (.c)', 'Building Multi-File C Programs'],
  'Data Structures in C': ['Implementing Linked Lists in C', 'Implementing Stacks in C', 'Implementing Queues in C', 'Implementing Binary Trees in C'],
  'Algorithms in C': ['Sorting Algorithms in C (Bubble, Selection, Quick Sort)', 'Searching Algorithms in C (Linear & Binary Search)'],
  'C for DSA': ['Arrays in C for DSA', 'Strings in C for DSA', 'Linked Lists in C (Single & Doubly)', 'Circular Linked Lists in C', 'Stacks in C (Array & Pointer-based)', 'Queues and Deques in C', 'Hash Tables in C (Struct & Array of Buckets)', 'Trees and BST in C', 'Heaps and Priority Queues in C', 'Graphs in C (Adjacency Matrix & List)', 'BFS and DFS Traversals in C', 'Recursion and Backtracking in C', 'Sorting & Binary Search in C', 'Two Pointers and Sliding Window in C', 'Greedy Algorithms in C', 'Dynamic Programming in C (Array Tabulation)', 'Bit Manipulation in C for DSA', 'Prefix Sum and Union Find in C'],
  'Competitive Programming with C': ['Fast I/O in C (scanf/printf optimizations)', 'Competitive Coding Template in C'],
  'C Projects': ['CLI Student Management System Project', 'Custom Memory Allocator Project', 'File Encryption Tool Project']
};

function getLevelForTopic(category: string, _title: string): CLevel {
  if (
    category.includes('Introduction') ||
    category.includes('Structure') ||
    category.includes('Variables') ||
    category.includes('Data Types') ||
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
    category.includes('Dynamic Memory') ||
    category.includes('Double Pointers') ||
    category.includes('Function Pointers') ||
    category.includes('Advanced') ||
    category.includes('Callbacks') ||
    category.includes('DSA') ||
    category.includes('Debugging') ||
    category.includes('Projects')
  ) {
    return 'Advanced';
  }

  return 'Intermediate';
}

function buildComprehensiveCNote(category: CCategory, title: string): CTopicNote {
  const level = getLevelForTopic(category, title);

  let whatItIs = `**${title}** is a core concept in C programming within the category of **${category}**.`;
  let whyUsed = `C provides direct hardware access, deterministic memory layout, zero abstraction runtime overhead, and explicit pointer control.`;
  let howItWorks = `The C compiler translates C source code directly into machine assembly and native binary code managed on the process Stack and Heap.`;
  let syntax = `// Syntax for ${title}\n#include <stdio.h>\n\nint main() {\n    // Code here\n    return 0;\n}`;
  let codeExamples: CodeSnippetExample[] = [
    {
      title: `${title} Example`,
      code: `#include <stdio.h>\n\nint main() {\n    printf("Executing ${title}\\n");\n    return 0;\n}`,
      explanation: "Line 1: #include <stdio.h> brings standard I/O library.\nLine 3: main() is entry point.\nLine 4: printf prints message."
    }
  ];
  let importantRules = [
    'Always declare variables before using them in standard C code.',
    'Be explicit with buffer sizes to avoid memory corruption.'
  ];
  let commonMistakes = [
    'Forgetting the null-terminator `\\0` when working with strings.',
    'Dereferencing uninitialized or NULL pointers leading to Segmentation Faults.'
  ];
  let realWorldUse = `Used extensively in Operating System Kernels (Linux, Windows), Embedded Firmware, Database Engines (PostgreSQL, SQLite), and Game Engines.`;
  let timeComplexity: string | undefined = undefined;
  let spaceComplexity: string | undefined = undefined;
  let relatedConcepts = ['Pointers', 'Memory Layout', 'C Standard Library'];
  let practiceQuestions: PracticeQuestion[] = [
    {
      question: `What is the primary significance of ${title} in C programming?`,
      answer: `It provides low-level control, high runtime speed, and precise memory management.`
    }
  ];
  let dsaConnection = `Provides explicit memory pointers and struct layouts necessary for building low-level Data Structures (Linked Lists, Trees, Graphs, Hash Buckets).`;

  // Specific content overrides for core topics & search keywords
  if (title.includes('Pointer Fundamentals') || title.includes('Pointers') || title === 'Pointers') {
    whatItIs = `A **Pointer** in C is a variable that stores the memory address of another variable rather than storing a direct data value. Declared using the asterisk symbol (e.g. \`int *p\`).`;
    whyUsed = `Pointers enable dynamic memory allocation, pass-by-reference function parameter mutation, efficient array/string traversals, and building complex linked data structures without copying large memory blocks.`;
    howItWorks = `Consider code: \`int x = 10; int *p = &x;\`
- **\`x\`**: An integer variable allocated in RAM storing integer value \`10\`.
- **\`&x\`**: The memory address where \`x\` is located (e.g. \`0x7ffeefbff5ac\`).
- **\`p\`**: Pointer variable storing the address \`0x7ffeefbff5ac\`.
- **\`*p\`**: The dereference operator accessing the actual value stored at address \`p\` (returns \`10\`).`;
    syntax = `int x = 10;\nint *p = &x; // p holds address of x\n\nprintf("Value of x: %d\\n", x);\nprintf("Address of x: %p\\n", (void*)&x);\nprintf("Value via pointer *p: %d\\n", *p);`;
    codeExamples = [
      {
        title: 'Pointer Address & Dereferencing Demonstration',
        code: `#include <stdio.h>\n\nint main() {\n    int val = 42;\n    int *ptr = &val;  // ptr points to val\n\n    printf("val = %d\\n", val);          // 42\n    printf("&val = %p\\n", (void*)&val);  // Memory address\n    printf("ptr = %p\\n", (void*)ptr);   // Same address\n    printf("*ptr = %d\\n", *ptr);        // 42 (Dereferencing)\n\n    *ptr = 99; // Mutates val directly via pointer\n    printf("New val = %d\\n", val);     // 99\n    return 0;\n}`,
        explanation: "Line 5: ptr is assigned address of val (&val).\nLine 10: *ptr accesses data inside address ptr.\nLine 12: Mutating *ptr changes val directly in RAM."
      }
    ];
    importantRules = [
      'Always initialize pointers to NULL or a valid address before dereferencing (`int *p = NULL;`).',
      'Dereferencing a NULL or uninitialized (wild) pointer results in an instant Segmentation Fault.'
    ];
    commonMistakes = [
      'Confusing pointer declaration (`int *p`) with dereferencing (`*p = 5`).',
      'Attempting to store an integer value directly into a pointer variable without `&`.'
    ];
    realWorldUse = 'Hardware register manipulation, C standard library I/O buffers, Linux kernel memory management.';
    timeComplexity = 'O(1) direct hardware memory lookup.';
    spaceComplexity = '4 bytes (32-bit systems) or 8 bytes (64-bit systems) for pointer address storage.';
    relatedConcepts = ['Pointer Arithmetic', 'Address-of Operator &', 'Dereference Operator *', 'Memory Layout'];
    practiceQuestions = [
      { question: 'What does the & operator return in C?', answer: 'It returns the memory address of the variable it precedes.' },
      { question: 'What happens if you dereference a NULL pointer (*p where p == NULL)?', answer: 'The operating system terminates execution immediately with a Segmentation Fault error.' }
    ];
    dsaConnection = 'Underlying memory mechanism for Linked Lists (`struct Node *next`), Binary Trees (`struct Node *left, *right`), and Dynamic Hash Tables.';
  } else if (title.includes('malloc') || title.includes('Dynamic Memory Allocation') || title.includes('calloc')) {
    whatItIs = `**Dynamic Memory Allocation** in C allows allocating memory manually on the **Heap** at runtime using \`malloc()\`, \`calloc()\`, \`realloc()\`, and freeing it using \`free()\`.`;
    whyUsed = `Enables programs to allocate memory when the dataset size is not known at compile time, and to build resizable dynamic data structures.`;
    howItWorks = `\`malloc(size_t bytes)\` requests contiguous bytes from the Heap OS memory pool. It returns a generic \`void*\` pointer to the allocated memory block, or \`NULL\` if allocation fails.`;
    syntax = `#include <stdlib.h>\n\n// Allocate array of 5 integers\nint *arr = (int*) malloc(5 * sizeof(int));\nif (arr != NULL) {\n    arr[0] = 100;\n    free(arr); // Deallocate when done\n    arr = NULL; // Prevent dangling pointer\n}`;
    codeExamples = [
      {
        title: 'Dynamic Array Allocation with malloc and free',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = (int*) malloc(n * sizeof(int));\n    \n    if (arr == NULL) {\n        printf("Memory allocation failed!\\n");\n        return 1;\n    }\n    \n    for (int i = 0; i < n; i++) {\n        arr[i] = (i + 1) * 10;\n    }\n    \n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]); // 10 20 30 40 50\n    }\n    printf("\\n");\n    \n    free(arr);\n    arr = NULL;\n    return 0;\n}`,
        explanation: "Line 6: malloc allocates n * sizeof(int) bytes on Heap.\nLine 8: Always check if arr == NULL to handle out-of-memory.\nLine 20: free(arr) returns memory back to OS to prevent memory leak."
      }
    ];
    importantRules = [
      'Always check if `malloc()` returns `NULL` before using allocated memory.',
      'Every call to `malloc()`, `calloc()`, or `realloc()` MUST be matched by a call to `free()` to prevent Memory Leaks.',
      'Set pointer to `NULL` after `free(ptr)` to avoid Dangling Pointer vulnerabilities.'
    ];
    commonMistakes = [
      'Memory Leaks: Forgetting to call `free()`, causing program RAM usage to grow continuously.',
      'Double Free: Calling `free(ptr)` twice on the same address.',
      'Using memory after calling `free()` (Use-After-Free bug).'
    ];
    realWorldUse = 'Database record buffers, web server socket buffers, game engine asset loading.';
    timeComplexity = 'O(1) Heap allocator search time.';
    spaceComplexity = 'O(N) Heap memory allocation.';
    relatedConcepts = ['Heap Memory', 'Stack vs Heap', 'Memory Leaks', 'Valgrind'];
    practiceQuestions = [
      { question: 'What is the difference between malloc() and calloc() in C?', answer: 'malloc() allocates raw uninitialized bytes; calloc() allocates zero-initialized memory blocks.' }
    ];
    dsaConnection = 'Used for instantiating dynamic DSA structures like Dynamic Arrays (ArrayLists), Linked List Nodes, Tree Nodes, and Hash Buckets.';
  } else if (title.includes('Structures') || title.includes('struct') || title === 'Structures') {

    whatItIs = `A **Structure (struct)** in C is a user-defined composite data type that allows grouping variables of different data types under a single unified name.`;
    whyUsed = `Enables modeling real-world entities (e.g. Student, BankAccount, Point) and data structure nodes (e.g. Node, TreeNode) cleanly.`;
    howItWorks = `Members are laid out contiguously in memory in the order of declaration, aligned according to CPU memory word boundaries (structure padding).`;
    syntax = `struct Student {\n    int id;\n    char name[50];\n    float gpa;\n};\n\nstruct Student s1 = {101, "Alice", 3.9f};\nprintf("Name: %s, GPA: %.2f\\n", s1.name, s1.gpa);`;
    codeExamples = [
      {
        title: 'Structure Pointer with Arrow (->) Operator',
        code: `#include <stdio.h>\n#include <string.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nint main() {\n    struct Node n1;\n    struct Node *ptr = &n1;\n    \n    ptr->data = 100; // Same as (*ptr).data = 100\n    ptr->next = NULL;\n    \n    printf("Node data: %d\\n", ptr->data);\n    return 0;\n}`,
        explanation: "Line 4: Struct Node defined with self-referential pointer next.\nLine 12: ptr->data accesses struct member via pointer."
      }
    ];
    importantRules = [
      'Use dot (`.`) operator to access members of direct struct variables (`s1.id`).',
      'Use arrow (`->`) operator to access members of struct pointers (`ptr->id`).'
    ];
    commonMistakes = [
      'Forgetting semicolon `;` at the end of struct definition body.',
      'Using dot `.` operator on a struct pointer instead of `->` or `(*ptr).`.'
    ];
    realWorldUse = 'OS Kernel process control blocks (PCB), network packet headers, C database ORM records.';
    timeComplexity = 'O(1) member offset access.';
    spaceComplexity = 'Sum of member byte sizes + memory padding bytes.';
    relatedConcepts = ['Unions', 'Typedef', 'Pointers to Structs', 'Self-Referential Structs'];
    practiceQuestions = [
      { question: 'What is the arrow operator (->) in C?', answer: 'Syntactic sugar for dereferencing a struct pointer and accessing a member: ptr->member is (*ptr).member.' }
    ];
    dsaConnection = 'Fundamental building block for Linked List Nodes, BST Nodes, Graph Nodes, and Min-Heap elements in C.';
  } else if (title.includes('Function Pointers') || title.includes('Callbacks')) {
    whatItIs = `A **Function Pointer** in C is a pointer variable that stores the memory address of executable code (functions) rather than data variables.`;
    whyUsed = `Enables callback functions, event handling, dynamic strategy dispatching, and custom sorting comparators (e.g. \`qsort()\`).`;
    howItWorks = `Function names in C decay into memory addresses pointing to code instructions in the Code/Text Segment of memory.`;
    syntax = `// Function pointer declaration matching: int func(int, int)\nint (*operation)(int, int);\n\noperation = add; // Point to add function\nint result = operation(10, 20);`;
    codeExamples = [
      {
        title: 'Custom qsort() Comparator with Function Pointers',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\n// Custom comparator for qsort\nint compare_asc(const void *a, const void *b) {\n    return (*(int*)a - *(int*)b);\n}\n\nint main() {\n    int arr[] = {40, 10, 50, 20, 30};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    \n    // Pass compare_asc function pointer to qsort\n    qsort(arr, n, sizeof(int), compare_asc);\n    \n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    return 0;\n}`,
        explanation: "Line 5: Custom comparator converting void* to int*.\nLine 14: qsort receives function pointer compare_asc as callback."
      }
    ];
    importantRules = [
      'Function pointer signature (return type and parameter types) MUST match target function exactly.',
      'Use parentheses around `(*func_ptr)` in declaration to distinguish from function returning a pointer.'
    ];
    commonMistakes = [
      'Forgetting parentheses `int *func()` (function returning pointer) vs `int (*func)()` (pointer to function).',
      'Passing incompatible parameter types to callback.'
    ];
    realWorldUse = 'C event loops, GUI button click listeners, Linux device driver file operations struct (`file_operations`).';
    timeComplexity = 'O(1) indirect call dispatch time.';
    spaceComplexity = '4 or 8 bytes for pointer address.';
    relatedConcepts = ['Callbacks', 'qsort', 'Void Pointers', 'Typedef for Function Pointers'];
    practiceQuestions = [
      { question: 'What does int (*cmp)(const void*, const void*) declare in C?', answer: 'A function pointer cmp that takes two const void pointers and returns an integer.' }
    ];
    dsaConnection = 'Used for passing custom comparator functions to sorting algorithms and priority queues.';
  } else if (title.includes('File Handling')) {
    whatItIs = `**File Handling** in C allows reading and writing data to permanent disk storage using standard I/O functions like \`fopen()\`, \`fclose()\`, \`fprintf()\`, \`fscanf()\`, \`fread()\`, and \`fwrite()\`.`;
    whyUsed = `Persists application state, configuration settings, user records, and datasets beyond application termination.`;
    howItWorks = `\`fopen()\` initializes a \`FILE*\` stream structure containing I/O buffer pointers, file position indicators, and error flags.`;
    syntax = `#include <stdio.h>\n\nFILE *fp = fopen("output.txt", "w");\nif (fp != NULL) {\n    fprintf(fp, "Hello ALGOrise C Notes!\\n");\n    fclose(fp);\n}`;
    codeExamples = [
      {
        title: 'Writing and Reading Text File in C',
        code: `#include <stdio.h>\n\nint main() {\n    FILE *fp = fopen("data.txt", "w");\n    if (fp == NULL) return 1;\n    \n    fprintf(fp, "Score: %d\\n", 95);\n    fclose(fp);\n    \n    char buffer[100];\n    fp = fopen("data.txt", "r");\n    if (fp != NULL) {\n        fgets(buffer, sizeof(buffer), fp);\n        printf("Read from file: %s", buffer);\n        fclose(fp);\n    }\n    return 0;\n}`,
        explanation: "Line 4: fopen in write mode ('w').\nLine 11: fopen in read mode ('r').\nLine 14: fclose flushes buffers and closes OS file handle."
      }
    ];
    importantRules = [
      'Always check if `FILE*` pointer is `NULL` after calling `fopen()`.',
      'Always call `fclose()` to flush output buffers to disk and release file handles.'
    ];
    commonMistakes = [
      'Forgetting to close files causing corrupted or incomplete disk writes.',
      'Opening non-existent files in read mode (`r`), causing `NULL` pointer crash.'
    ];
    realWorldUse = 'Logging server activities, saving game save states, parsing CSV datasets.';
    timeComplexity = 'O(N) disk I/O time.';
    spaceComplexity = 'O(1) auxiliary buffer space.';
    relatedConcepts = ['FILE Stream', 'fopen Modes', 'Binary Files', 'I/O Buffering'];
    practiceQuestions = [
      { question: 'What does fopen("file.txt", "w") do if file.txt already exists?', answer: 'It truncates (erases) existing file contents to length 0.' }
    ];
    dsaConnection = 'Used for loading large competitive programming test inputs and saving algorithm benchmark metrics.';
  } else if (category === 'C for DSA' || title.includes('Linked Lists') || title.includes('Trees') || title.includes('Stacks')) {
    whatItIs = `**${title}** covers both the low-level C implementation of ${title.replace(' in C', '')} using explicit struct nodes and pointers, and memory considerations for algorithm performance.`;
    whyUsed = `C provides raw memory pointers and explicit \`malloc()\`/\`free()\` control, giving developers maximum control over Data Structure memory overhead and node linking.`;
    howItWorks = `Nodes are created dynamically on Heap using \`malloc(sizeof(struct Node))\` and linked explicitly via pointer addresses (\`node->next = next_node\`).`;
    syntax = `struct Node {\n    int data;\n    struct Node *next;\n};\n\nstruct Node* create_node(int val) {\n    struct Node *new_node = (struct Node*) malloc(sizeof(struct Node));\n    new_node->data = val;\n    new_node->next = NULL;\n    return new_node;\n}`;
    codeExamples = [
      {
        title: `${title} Implementation in C`,
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int val;\n    struct Node *next;\n};\n\nvoid push(struct Node **head, int val) {\n    struct Node *new_node = (struct Node*) malloc(sizeof(struct Node));\n    new_node->val = val;\n    new_node->next = *head;\n    *head = new_node;\n}\n\nint main() {\n    struct Node *head = NULL;\n    push(&head, 10);\n    push(&head, 20);\n    printf("Head val: %d\\n", head->val); // 20\n    return 0;\n}`,
        explanation: "Line 9: Double pointer **head allows modifying caller's head pointer inside push function.\nLine 10: malloc allocates Heap memory for Node."
      }
    ];
    importantRules = [
      'Always check `malloc()` return values when allocating DSA nodes.',
      'Traverse linked structures carefully to avoid dereferencing `NULL->next`.',
      'Free every allocated node when destroying data structures to prevent memory leaks.'
    ];
    commonMistakes = [
      'Losing head pointer reference during node insertion or deletion.',
      'Dangling pointers caused by freeing a node before copying its `next` address.'
    ];
    realWorldUse = 'Kernel task schedulers, memory allocators, network packet routing queues.';
    timeComplexity = 'Access/Search: O(N), Insert/Delete: O(1) if pointer is known.';
    spaceComplexity = 'O(N) node memory allocation.';
    relatedConcepts = ['Structs', 'Pointers', 'Double Pointers', 'malloc / free'];
    practiceQuestions = [
      { question: 'Why do we pass a double pointer (struct Node **head) when inserting at the head of a Linked List in C?', answer: 'So the function can update the original head pointer variable in the caller function.' }
    ];
    dsaConnection = 'Primary C implementation pattern for LeetCode, HackerRank, and ALGOrise Data Structures & Algorithms problems.';
  }

  return {
    id: `c-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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

class CNotesService {
  private allNotes: CTopicNote[] = [];

  constructor() {
    this.generateAllCNotes();
  }

  private generateAllCNotes() {
    const list: CTopicNote[] = [];
    (Object.keys(CATEGORY_TOPIC_MAP) as CCategory[]).forEach((cat) => {
      const topics = CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveCNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): CTopicNote[] {
    return this.allNotes;
  }

  public getCategories(): readonly CCategory[] {
    return C_CATEGORIES;
  }

  public getNoteById(id: string): CTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): CTopicNote[] {
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

export const cNotesService = new CNotesService();
