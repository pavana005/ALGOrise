export type JSLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface JSTopicNote {
  id: string;
  title: string;
  category: string;
  level: JSLevel;
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

export const JS_CATEGORIES = [
  'Introduction to JavaScript',
  'Variables and Data Types',
  'Operators',
  'Input and Output',
  'Conditional Statements',
  'Loops',
  'Functions',
  'Recursion',
  'Strings',
  'Arrays',
  'Objects',
  'JSON',
  'Dates and Time',
  'Math Functions',
  'DOM Manipulation',
  'Events',
  'Browser APIs',
  'Error Handling',
  'Modules',
  'Object-Oriented Programming',
  'ES6+ Features',
  'Asynchronous JavaScript',
  'Promises',
  'Async/Await',
  'Fetch API',
  'Local Storage',
  'Session Storage',
  'Cookies',
  'Regular Expressions',
  'Functional Programming',
  'Higher-Order Functions',
  'Closures',
  'Scope',
  'Hoisting',
  'this Keyword',
  'Prototypes',
  'Classes',
  'Iterators',
  'Generators',
  'Maps and Sets',
  'Memory Management',
  'Debugging',
  'Testing',
  'Node.js',
  'Express.js',
  'REST APIs',
  'Authentication',
  'WebSockets',
  'TypeScript Basics',
  'Modern JavaScript',
  'JavaScript for DSA',
  'Frontend Development',
  'Backend Development',
  'Full Stack JavaScript',
  'JavaScript Projects'
] as const;

export type JSCategory = typeof JS_CATEGORIES[number];

const CATEGORY_TOPIC_MAP: Record<JSCategory, string[]> = {
  'Introduction to JavaScript': ['JavaScript History and Ecosystem', 'JavaScript Engine and V8 JIT Compilation', 'Script Tag Inclusions and Inline vs External Scripts'],
  'Variables and Data Types': ['Var, Let, and Const Comparison', 'Primitive vs Reference Data Types', 'Typeof Operator and Dynamic Typing', 'Type Coercion and Explicit Conversion'],
  'Operators': ['Arithmetic and Assignment Operators', 'Strict (===) vs Loose (==) Equality', 'Logical Operators and Short-Circuiting', 'Nullish Coalescing (??) and Optional Chaining (?.)'],
  'Input and Output': ['Console Methods (console.log, console.error, console.table)', 'Browser Alert, Prompt, and Confirm Dialogs'],
  'Conditional Statements': ['If, Else If, and Else Control Flow', 'Switch Case Statements', 'Ternary Operator (condition ? a : b)'],
  'Loops': ['For, While, and Do-While Loops', 'For...of Loop (Iterables) vs For...in Loop (Object Keys)', 'Break, Continue, and Labeled Loops'],
  'Functions': ['Function Declarations vs Function Expressions', 'Arrow Functions (=>) and Lexical this', 'Default Parameters and Rest Parameters (...args)', 'Function Call vs Apply vs Bind'],
  'Recursion': ['Recursive Call Stack Mechanics', 'Base Cases and Call Stack Overflow', 'Tail Call Optimization in JS Engines'],
  'Strings': ['String Immutability and Indexing', 'Template Literals (Backticks ${})', 'String Methods (slice, split, includes, replace)'],
  'Arrays': ['Array Declarations and Dynamic Allocation', 'Array Mutator Methods (push, pop, shift, unshift, splice)', 'Array Iterator Methods (map, filter, reduce, find, forEach)', 'Spread Operator (...arr) and Array Destructuring'],
  'Objects': ['Object Literals and Property Access (Dot vs Bracket)', 'Object Destructuring and Shorthand Properties', 'Object Methods (Object.keys, Object.values, Object.entries)', 'Shallow Copy (Object.assign, ...) vs Deep Copy (structuredClone)'],
  'JSON': ['JSON Format and Rules', 'JSON.stringify() and JSON.parse()'],
  'Dates and Time': ['Date Object Creation and Parsing', 'Formatting Dates and Intl.DateTimeFormat'],
  'Math Functions': ['Math Object Constants and Methods (Math.floor, Math.ceil, Math.round)', 'Generating Random Numbers (Math.random())'],
  'DOM Manipulation': ['Selecting DOM Elements (querySelector, getElementById)', 'Modifying Text and HTML (textContent, innerHTML)', 'Manipulating Element Styles and ClassList', 'Creating and Appending DOM Elements (createElement, appendChild)'],
  'Events': ['Event Listeners (addEventListener, removeEventListener)', 'Event Bubbling and Event Capturing (Phase Model)', 'Event Delegation Pattern', 'Form Events and event.preventDefault()'],
  'Browser APIs': ['Timers (setTimeout and setInterval Mechanics)', 'Geolocation API', 'Browser Notifications API', 'Window and History APIs'],
  'Error Handling': ['Try, Catch, Finally Error Handling', 'Throwing Custom Error Objects', 'Global Error Listeners (window.onerror)'],
  'Modules': ['ES6 Modules (import and export)', 'Default vs Named Exports', 'CommonJS (require/module.exports) vs ES Modules'],
  'Object-Oriented Programming': ['Classes and Object Instantiation', 'Encapsulation and Private Fields (#privateField)', 'Class Inheritance and super Keyword'],
  'ES6+ Features': ['Destructuring Assignment Syntax', 'Rest and Spread Operators', 'Default Parameters and Enhanced Object Literals', 'Symbol Primitive Type'],
  'Asynchronous JavaScript': ['Synchronous Execution vs Asynchronous Event Loop', 'Callback Functions and Callback Hell', 'Macrotasks vs Microtasks Queue Model'],
  'Promises': ['Promise States (Pending, Fulfilled, Rejected)', 'Chaining Promises (.then, .catch, .finally)', 'Promise Static Methods (Promise.all, Promise.race, Promise.allSettled)'],
  'Async/Await': ['Async Functions and Await Keyword', 'Error Handling in Async/Await with Try/Catch', 'Sequential vs Concurrent Async Execution'],
  'Fetch API': ['Making HTTP Requests with fetch()', 'Handling JSON HTTP Responses and Headers', 'Handling Fetch Error Responses (res.ok)'],
  'Local Storage': ['LocalStorage Key-Value Storage API', 'Storing Objects in LocalStorage with JSON'],
  'Session Storage': ['SessionStorage vs LocalStorage Lifetime'],
  'Cookies': ['Document.cookie Management and HttpOnly Flags'],
  'Regular Expressions': ['RegExp Literals and RegExp Constructor', 'Regex Methods (test, exec, match, replace)'],
  'Functional Programming': ['Pure Functions and Immutability', 'Currying and Function Composition'],
  'Higher-Order Functions': ['Higher-Order Function Concept', 'Custom HOF Implementations'],
  'Closures': ['Lexical Scope and Closure Definition', 'Preserving State via Closures', 'Private Variables via Closure Scope'],
  'Scope': ['Global, Function, and Block Scope', 'Lexical Scope and Scope Chain Lookup'],
  'Hoisting': ['Variable Hoisting (var vs let/const Temporal Dead Zone)', 'Function Declaration Hoisting vs Function Expression'],
  'this Keyword': ['this Binding Rules (Default, Implicit, Explicit, New)', 'Arrow Function Lexical this Binding'],
  'Prototypes': ['Prototype Object and __proto__ Pointer', 'Prototype Chain and Inheritance Lookup'],
  'Classes': ['Class Syntax in ES6', 'Static Class Methods and Properties'],
  'Iterators': ['Iterable Protocol and [Symbol.iterator]()', 'Custom Iterator Implementation'],
  'Generators': ['Generator Functions (function*) and yield Keyword', 'Lazy Iteration with Generators'],
  'Maps and Sets': ['Map Key-Value Storage (Any Type as Key)', 'Set Unique Element Collection', 'WeakMap and WeakSet Memory Garbage Collection'],
  'Memory Management': ['Garbage Collection Mark-and-Sweep Algorithm', 'Memory Leaks (Unintended Globals, Detached DOM Trees)'],
  'Debugging': ['Chrome DevTools Debugger and Breakpoints', 'Console Debugging and debugger; Statement'],
  'Testing': ['Unit Testing Fundamentals with Jest', 'Testing DOM and Async Code'],
  'Node.js': ['Node.js Runtime Architecture and Event Loop', 'Node Core Modules (fs, path, http)'],
  'Express.js': ['Express Framework Setup and Routing', 'Express Middleware Functions (req, res, next)'],
  'REST APIs': ['Designing RESTful API Endpoints', 'HTTP Verbs (GET, POST, PUT, DELETE) and Status Codes'],
  'Authentication': ['JWT (JSON Web Token) Authentication', 'Password Hashing with bcrypt'],
  'WebSockets': ['Real-Time Bidirectional Communication with WebSockets', 'Socket.io Library Overview'],
  'TypeScript Basics': ['TypeScript Type Annotations (string, number, boolean, Array)', 'Interfaces vs Type Aliases', 'Generic Functions and Classes'],
  'Modern JavaScript': ['Modern JS Tooling (Babel, Vite, Webpack)', 'ES2022+ Features Overview'],
  'JavaScript for DSA': ['Arrays in JavaScript (Array.prototype)', 'Strings in JavaScript for DSA', 'Objects and Hash Maps in JS (Object & Map)', 'Sets in JavaScript (Set)', 'Stacks in JavaScript (Array push/pop)', 'Queues in JavaScript (Array or Custom Head/Tail)', 'Linked Lists in JavaScript (Custom Node Class)', 'Trees and BST in JavaScript', 'Heaps and Priority Queues in JS (Custom Binary Heap)', 'Graphs in JS (Adjacency List with Map/Object)', 'BFS Traversal in JavaScript', 'DFS Traversal in JavaScript', 'Recursion and Backtracking in JavaScript', 'Sorting Algorithms in JS (Array.prototype.sort)', 'Searching Algorithms in JS', 'Two Pointers Pattern in JS', 'Sliding Window Pattern in JS', 'Prefix Sum Pattern in JS', 'Greedy Algorithms in JS', 'Dynamic Programming in JS (2D Arrays & Objects)', 'Bit Manipulation in JS', 'Trie Data Structure in JS', 'Union Find (Disjoint Set) in JS'],
  'Frontend Development': ['DOM State Management and Component Architecture', 'Modern SPA Framework Overview (React/Vue)'],
  'Backend Development': ['Building Scalable Node.js Backends', 'Database Connections (MongoDB / PostgreSQL)'],
  'Full Stack JavaScript': ['MERN / PERN Stack Architecture Overview', 'Connecting Frontend Client to REST/GraphQL Backend'],
  'JavaScript Projects': ['Interactive Todo & Kanban App Project', 'Real-Time Chat App with WebSockets Project', 'Full Stack E-Commerce API Microservice Project']
};

function getLevelForTopic(category: string, _title: string): JSLevel {
  if (
    category.includes('Introduction') ||
    category.includes('Variables') ||
    category.includes('Operators') ||
    category.includes('Input') ||
    category.includes('Conditional') ||
    category.includes('Loops') ||
    category.includes('Functions') ||
    category.includes('Strings') ||
    category.includes('Arrays')
  ) {
    return 'Beginner';
  }

  if (
    category.includes('Async') ||
    category.includes('Promises') ||
    category.includes('Fetch') ||
    category.includes('Closures') ||
    category.includes('Node.js') ||
    category.includes('Express') ||
    category.includes('WebSockets') ||
    category.includes('TypeScript') ||
    category.includes('JavaScript for DSA') ||
    category.includes('Projects')
  ) {
    return 'Advanced';
  }

  return 'Intermediate';
}

function buildComprehensiveJSNote(category: JSCategory, title: string): JSTopicNote {
  const level = getLevelForTopic(category, title);

  let whatItIs = `**${title}** is a foundational concept in JavaScript programming within the category of **${category}**.`;
  let whyUsed = `JavaScript is the universal language of the web, powering interactive browser UIs, asynchronous web servers (Node.js), and full-stack software development.`;
  let howItWorks = `JavaScript code is parsed and executed by modern V8/JS engines using Just-In-Time (JIT) compilation, lexical scope environments, and a single-threaded Event Loop.`;
  let syntax = `// Syntax for ${title}\nconsole.log("Executing ${title}");`;
  let codeExamples: CodeSnippetExample[] = [
    {
      title: `${title} Example`,
      code: `// Example demonstrating ${title}\nfunction demo() {\n    console.log("Executing ${title}");\n}\ndemo();`,
      explanation: "Line 2: Defines function demo.\nLine 3: Logs message to console.\nLine 5: Executes function."
    }
  ];
  let importantRules = [
    'Always use `const` by default, `let` when reassigning variables, and avoid legacy `var`.',
    'Understand asynchronous event-loop execution order to prevent race conditions.'
  ];
  let commonMistakes = [
    'Confusing loose equality (`==`) with strict equality (`===`). Always use `===`.',
    'Blocking the main UI thread with heavy synchronous computations.'
  ];
  let realWorldUse = `Used on 98%+ of web browsers, React/Vue frontend apps, Express REST backends, Electron desktop apps, and React Native mobile apps.`;
  let timeComplexity: string | undefined = undefined;
  let spaceComplexity: string | undefined = undefined;
  let relatedConcepts = ['Event Loop', 'ES6+', 'Scope', 'V8 Engine'];
  let practiceQuestions: PracticeQuestion[] = [
    {
      question: `What is the primary role of ${title} in JavaScript?`,
      answer: `It provides expressive syntax, dynamic data manipulation, and runtime flexibility.`
    }
  ];
  let dsaConnection = `Essential building block for data structures, array operations, hash lookups, and asynchronous algorithms in JavaScript.`;

  // Specific content overrides for core topics & search keywords
  if (title.includes('Closures') || title.includes('Lexical Scope') || title === 'Closures') {
    whatItIs = `A **Closure** in JavaScript is a function bundled together with references to its surrounding state (lexical environment). A closure gives an inner function access to an outer function's scope even after the outer function has returned.`;
    whyUsed = `Closures enable data privacy (encapsulation), stateful factory functions, currying, event listeners maintaining outer state, and module patterns.`;
    howItWorks = `Consider example code:
\`\`\`javascript
let x = 10;
function test() {
    console.log(x); // Accesses x from outer Lexical Scope
}
test();
\`\`\`
When \`test()\` is defined, it captures a persistent reference to its outer Scope Chain containing \`x = 10\`. Even if outer functions finish executing, captured variables remain in Heap memory.`;
    syntax = `function createCounter() {\n    let count = 0; // Private variable captured in closure\n    return function() {\n        count++;\n        return count;\n    };\n}\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2`;
    codeExamples = [
      {
        title: 'Private State Encapsulation via Closures',
        code: `function createBankAccount(initialBalance) {\n    let balance = initialBalance; // Encapsulated private variable\n    \n    return {\n        deposit(amount) {\n            balance += amount;\n            return balance;\n        },\n        getBalance() {\n            return balance;\n        }\n    };\n}\n\nconst myAccount = createBankAccount(100);\nconsole.log(myAccount.deposit(50));  // 150\nconsole.log(myAccount.getBalance());  // 150\n// balance cannot be accessed directly from outside! (undefined)`,
        explanation: "Line 2: balance is private variable.\nLine 5: Inner method deposit closes over balance.\nLine 17: balance is protected from direct external modification."
      }
    ];
    importantRules = [
      'Closures capture variable references, not static value snapshots.',
      'Be mindful of memory management: un-released closures holding massive objects can cause Memory Leaks.'
    ];
    commonMistakes = [
      'Using `var` in a `for` loop with `setTimeout`, where all iterations close over the single hoisted variable (use `let` for block scope).',
      'Expecting private closure variables to be directly inspectable on returned objects.'
    ];
    realWorldUse = 'React `useState` hook internals, Redux middleware, private module scopes, custom event listeners.';
    timeComplexity = 'O(1) lexical variable scope lookup.';
    spaceComplexity = 'O(N) memory for captured scope references.';
    relatedConcepts = ['Lexical Scope', 'Scope Chain', 'Encapsulation', 'Higher-Order Functions'];
    practiceQuestions = [
      { question: 'What is a closure in simple terms?', answer: 'An inner function that remembers and accesses variables from its outer enclosing scope even after the outer function finishes executing.' },
      { question: 'Why does using let instead of var fix the setTimeout inside for-loop problem?', answer: 'let creates a brand new block-scoped binding for each loop iteration, whereas var uses a single hoisted function-scoped variable.' }
    ];
    dsaConnection = 'Used in Memoization for Dynamic Programming algorithms and constructing private Node states in graph traversals.';
  } else if (title.includes('Promises') || title.includes('Async/Await') || title.includes('Timers')) {
    whatItIs = `**Asynchronous JavaScript** manages non-blocking operations (network requests, timers, file I/O) using the Event Loop, Promises (\`new Promise()\`), and \`async\` / \`await\`.`;
    whyUsed = `Keeps the web browser UI responsive and single-threaded Node.js servers high-throughput without freezing while waiting for I/O responses.`;
    howItWorks = `Consider timer example code:
\`\`\`javascript
setTimeout(() => {
    console.log("Hello");
}, 1000);
\`\`\`
1. \`setTimeout\` is invoked; the JS engine registers the timer callback with the Browser Web APIs / Node C++ timer module and continues executing synchronous code instantly.
2. After 1000ms delay, the timer callback is pushed to the **Macrotask Queue**.
3. When the synchronous Call Stack becomes empty, the **Event Loop** picks up the callback from the Macrotask Queue and pushes it to the Call Stack for execution.`;
    syntax = `// Async/Await with Fetch API & Error Handling\nasync function loadData() {\n    try {\n        const response = await fetch("https://api.algorise.io/problems");\n        const data = await response.json();\n        console.log(data);\n    } catch (err) {\n        console.error("Fetch Error:", err);\n    }\n}`;
    codeExamples = [
      {
        title: 'Promise Chaining vs Async/Await',
        code: `// Function returning a Promise\nconst fetchUser = (id) => {\n    return new Promise((resolve, reject) => {\n        setTimeout(() => {\n            if (id > 0) resolve({ id, name: "Alex" });\n            else reject(new Error("Invalid ID"));\n        }, 500);\n    });\n};\n\n// Consuming Promise using Async/Await\nasync function main() {\n    try {\n        const user = await fetchUser(1);\n        console.log("Fetched User:", user.name); // Alex\n    } catch (err) {\n        console.error(err.message);\n    }\n}\nmain();`,
        explanation: "Line 3: Creates explicit Promise with resolve/reject.\nLine 13: await pauses function execution without blocking Event Loop until Promise resolves."
      }
    ];
    importantRules = [
      'Always handle Promise rejections using `.catch()` or `try/catch` with `await`. Unhandled rejections crash Node.js.',
      'Promises run Microtasks which execute before Macrotasks (`setTimeout`/`setInterval`).'
    ];
    commonMistakes = [
      'Forgetting `await` when calling an async function, returning a pending Promise object instead of the resolved data value.',
      'Using `forEach()` with `await` expecting sequential execution (use `for...of` or `Promise.all()`).'
    ];
    realWorldUse = 'Making AJAX API requests, database queries in Node.js Express, reading file streams, WebSockets.';
    timeComplexity = 'O(1) Event Loop scheduling time.';
    spaceComplexity = 'O(N) memory for pending Promise callbacks.';
    relatedConcepts = ['Event Loop', 'Microtasks vs Macrotasks', 'Fetch API', 'Callbacks'];
    practiceQuestions = [
      { question: 'Which runs first: Promise.then callback or setTimeout callback?', answer: 'Promise.then callback runs first because Promise callbacks are Microtasks, which take precedence over Macrotasks (setTimeout).' }
    ];
    dsaConnection = 'Underlying engine for concurrent async graph crawlers, streaming batch algorithms, and parallel API fetchers.';
  } else if (title.includes('DOM Manipulation') || title.includes('Events') || title.includes('Selecting DOM Elements')) {
    whatItIs = `**DOM (Document Object Model) Manipulation** allows JavaScript to interactively select, modify, style, insert, and delete HTML elements and listen to user **Events** (\`click\`, \`input\`, \`submit\`).`;
    whyUsed = `Powers dynamic, interactive single-page web applications (SPAs) without requiring full web page reloads.`;
    howItWorks = `The browser parses HTML into an object tree of DOM nodes. JavaScript accesses these nodes via \`document.querySelector()\`, attaches event listeners, and updates CSS/HTML in real-time.`;
    syntax = `// Select Element & Attach Event Listener\nconst btn = document.querySelector("#submit-btn");\nconst input = document.querySelector("#user-name");\n\nbtn.addEventListener("click", (e) => {\n    e.preventDefault();\n    console.log("Hello " + input.value);\n});`;
    codeExamples = [
      {
        title: 'DOM Element Selection, Styling & Event Listener',
        code: `// Create and Append DOM Element dynamically\nconst container = document.querySelector("#app");\nconst card = document.createElement("div");\n\ncard.className = "card-box";\ncard.textContent = "Click Me!";\ncard.style.cursor = "pointer";\n\ncard.addEventListener("click", () => {\n    card.style.backgroundColor = "#10B981";\n    card.textContent = "Clicked & Active!";\n});\n\ncontainer.appendChild(card);`,
        explanation: "Line 2: document.querySelector selects target container.\nLine 3: document.createElement creates new div node.\nLine 8: addEventListener registers click handler.\nLine 13: appendChild mounts node into browser DOM tree."
      }
    ];
    importantRules = [
      'Use Event Delegation on parent containers when handling events for multiple dynamically added child elements.',
      'Always call `e.preventDefault()` on form submit events to stop automatic browser page refresh.'
    ];
    commonMistakes = [
      'Using `innerHTML` with unsanitized user inputs, creating Cross-Site Scripting (XSS) security vulnerabilities (use `textContent`).',
      'Trying to select DOM elements before the HTML document finishes loading.'
    ];
    realWorldUse = 'Building interactive forms, modal popups, drag-and-drop interfaces, dynamic data tables.';
    timeComplexity = 'O(1) ID lookup (`getElementById`); O(N) querySelectorAll scan.';
    spaceComplexity = 'O(N) memory for DOM tree nodes.';
    relatedConcepts = ['Event Delegation', 'Event Bubbling', 'XSS Security', 'Browser Rendering'];
    practiceQuestions = [
      { question: 'What is Event Delegation in JavaScript?', answer: 'A technique of attaching a single event listener to a parent element to handle events triggered by any of its current or future child elements using event.target.' }
    ];
    dsaConnection = 'Interactive rendering layer displaying ALGOrise problems, test case results, and code editor components.';
  } else if (title.includes('Maps and Sets') || title.includes('Objects') || title.includes('Arrays')) {
    whatItIs = `**JavaScript Collections** (\`Array\`, \`Object\`, \`Map\`, \`Set\`) provide built-in data structures for storing ordered sequences, key-value pairs, and unique value sets.`;
    whyUsed = `\`Map\` allows any key type (including objects) with O(1) lookups; \`Set\` guarantees unique elements; \`Array\` provides high-level iteration methods (\`map\`, \`filter\`, \`reduce\`).`;
    howItWorks = `V8 engine optimizes JS Objects and Maps using hidden classes and Hash Tables, while Arrays operate as dynamically resizable memory buffers.`;
    syntax = `// Map & Set creation\nconst myMap = new Map();\nmyMap.set("key", "value");\n\nconst mySet = new Set([1, 2, 2, 3]); // Set(3) {1, 2, 3}`;
    codeExamples = [
      {
        title: 'Map and Set Collections Demonstration',
        code: `const userRoles = new Map();
const user1 = { id: 101 };
userRoles.set(user1, "Admin");

console.log(userRoles.get(user1)); // Admin

const uniqueTags = new Set(["JS", "Python", "JS", "C++"]);
uniqueTags.add("Java");
console.log(uniqueTags.has("Python")); // true
console.log(Array.from(uniqueTags)); // ['JS', 'Python', 'C++', 'Java']`,
        explanation: "Line 3: Map accepts object user1 as key (which Object cannot do).\nLine 7: Set automatically deduplicates repeated 'JS' string."
      }
    ];
    importantRules = [
      'Use `Map` when keys are dynamic or non-string types, or when frequent additions/deletions are needed.',
      'Use `Set` when requiring guaranteed element uniqueness.'
    ];
    commonMistakes = [
      'Expecting plain JS Object keys to retain non-string types (Object converts all keys to strings).',
      'Mutating an Array while iterating over it.'
    ];
    realWorldUse = 'Caching API responses, managing unique active user IDs, shopping cart items, session stores.';
    timeComplexity = 'Map/Set Lookup, Insert, Delete: O(1) average; Array Access: O(1), Search: O(N).';
    spaceComplexity = 'O(N) memory storage.';
    relatedConcepts = ['WeakMap', 'WeakSet', 'Array Methods', 'Hash Tables'];
    practiceQuestions = [
      { question: 'What is the key difference between a JS Object and a Map?', answer: 'Objects only allow string or symbol keys; Maps allow any data type (including objects and functions) as keys and maintain insertion order.' }
    ];
    dsaConnection = 'Essential for Hash Map and Hash Set DSA problems (2-Sum, Frequency Counter, Visited Set in BFS/DFS).';
  } else if (category === 'JavaScript for DSA') {
    whatItIs = `**${title}** covers both idiomatic JavaScript implementations of ${title.replace(' in JavaScript', '')} and how JS features are applied to solve Data Structures & Algorithms problems.`;
    whyUsed = "JavaScript's rich built-in array methods (map, filter, reduce), Map, Set, and flexible object types make it a popular language for web developer coding interviews.";
    howItWorks = `Combines high-performance V8 engine dynamic memory management with algorithmic patterns.`;
    syntax = `// ${title} Syntax Pattern\nfunction solveProblem(data) {\n    // Solution logic\n    return data;\n}`;
    codeExamples = [
      {
        title: `${title} Implementation in JS`,
        code: `// ${title} Code Example in JavaScript\nfunction solve(nums) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        map.set(nums[i], i);\n    }\n    return map;\n}\nconsole.log(solve([10, 20, 30]));`,
        explanation: "Line 3: Map initialized for instant O(1) lookup.\nLine 4: Single pass traversal in O(N) time."
      }
    ];
    importantRules = [
      'Be mindful that `Array.prototype.sort()` sorts elements as strings by default! Always pass a numeric comparator `(a, b) => a - b`.',
      'Use `Map` or `Set` for O(1) lookups instead of nested array `.indexOf()` or `.includes()` which are O(N).'
    ];
    commonMistakes = [
      'Calling `arr.sort()` without a comparator function, sorting `[10, 2, 5]` into `[10, 2, 5]` string order!',
      'Using `Array.prototype.shift()` in FIFO queues inside loops, causing slow O(N) shifting.'
    ];
    realWorldUse = 'Frontend state sorting, filtering search queries, algorithm performance optimizations in browser applications.';
    timeComplexity = 'O(1), O(log N), O(N), or O(N log N) depending on algorithm.';
    spaceComplexity = 'O(1) auxiliary to O(N) space.';
    relatedConcepts = ['Array Methods', 'Map and Set', 'Big-O Complexity', 'Algorithms'];
    practiceQuestions = [
      { question: 'Why does [10, 2, 5].sort() return [10, 2, 5] in JavaScript?', answer: 'Because default sort converts numbers to strings and compares UTF-16 code unit values; pass (a, b) => a - b to sort numerically.' }
    ];
    dsaConnection = 'Core engine for solving LeetCode, HackerRank, and ALGOrise competitive coding questions in JavaScript.';
  }

  return {
    id: `js-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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

class JSNotesService {
  private allNotes: JSTopicNote[] = [];

  constructor() {
    this.generateAllJSNotes();
  }

  private generateAllJSNotes() {
    const list: JSTopicNote[] = [];
    (Object.keys(CATEGORY_TOPIC_MAP) as JSCategory[]).forEach((cat) => {
      const topics = CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveJSNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): JSTopicNote[] {
    return this.allNotes;
  }

  public getCategories(): readonly JSCategory[] {
    return JS_CATEGORIES;
  }

  public getNoteById(id: string): JSTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): JSTopicNote[] {
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

export const jsNotesService = new JSNotesService();
