export type PythonLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface PythonTopicNote {
  id: string;
  title: string;
  category: string;
  level: PythonLevel;
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

export const PYTHON_CATEGORIES = [
  'Python Fundamentals',
  'Variables and Data Types',
  'Operators',
  'Input and Output',
  'Conditional Statements',
  'Loops',
  'Functions',
  'Recursion',
  'Strings',
  'Lists',
  'Tuples',
  'Sets',
  'Dictionaries',
  'Arrays and Collections',
  'List Comprehensions',
  'Functions and Advanced Functions',
  'Modules and Packages',
  'File Handling',
  'Exception Handling',
  'Object-Oriented Programming',
  'Iterators and Generators',
  'Decorators',
  'Lambda Functions',
  'Functional Programming',
  'Regular Expressions',
  'Dates and Time',
  'JSON and Data Serialization',
  'Virtual Environments and pip',
  'Type Hints',
  'Dataclasses',
  'Pattern Matching',
  'Python Standard Library',
  'Memory Management',
  'Multithreading',
  'Multiprocessing',
  'Async Programming',
  'Networking',
  'APIs and HTTP',
  'Database Programming',
  'SQLite',
  'Testing',
  'Debugging',
  'Logging',
  'Python Performance Optimization',
  'Security Basics',
  'Web Development',
  'Flask',
  'Django',
  'FastAPI',
  'Data Science with Python',
  'NumPy',
  'Pandas',
  'Matplotlib',
  'Machine Learning with Python',
  'AI and Python',
  'Automation and Scripting',
  'Web Scraping',
  'Python for DSA',
  'Competitive Programming with Python',
  'Python Projects'
] as const;

export type PythonCategory = typeof PYTHON_CATEGORIES[number];

const CATEGORY_TOPIC_MAP: Record<PythonCategory, string[]> = {
  'Python Fundamentals': ['Python Introduction and Setup', 'Python Interpreter and Bytecode', 'Python Syntax Invariants and Indentation'],
  'Variables and Data Types': ['Variables and Assignment', 'Primitive Data Types', 'Dynamic Typing and Reference Model', 'Type Conversion and Casting'],
  'Operators': ['Arithmetic Operators', 'Comparison and Relational Operators', 'Logical Operators', 'Bitwise Operators in Python', 'Assignment and Membership Operators'],
  'Input and Output': ['Formatted Strings (f-strings)', 'Console Input with input()', 'Print Parameters (sep and end)'],
  'Conditional Statements': ['If, Elif, and Else Statements', 'Ternary Conditional Expressions', 'Nested Conditional Logic'],
  'Loops': ['For Loops and range()', 'While Loops and Loop Flags', 'Break, Continue, and Else Clauses in Loops'],
  'Functions': ['Defining Functions and Return Values', 'Positional vs Keyword Arguments', 'Default Parameters', '*args and **kwargs Variable Arguments', 'Variable Scope (Local, Global, Nonlocal)'],
  'Recursion': ['Recursive Functions and Stack Frames', 'Base Cases and Call Stack Bounds', 'Memoization with functools.lru_cache'],
  'Strings': ['String Immutability and Indexing', 'String Slicing Syntax [start:stop:step]', 'String Methods (split, join, strip, replace)', 'String Formatting and Encoding'],
  'Lists': ['List Creation and Dynamic Indexing', 'List Methods (append, extend, pop, insert, sort)', 'List Slicing and Shallow vs Deep Copy'],
  'Tuples': ['Tuple Immutability and Tuple Packing/Unpacking', 'NamedTuples from collections'],
  'Sets': ['Set Operations (Union, Intersection, Difference)', 'Frozenset and Uniqueness Guarantees'],
  'Dictionaries': ['Dictionary Key-Value Storage and Hash Lookup', 'Dictionary Methods (keys, values, items, get)', 'Defaultdict and Counter from collections'],
  'Arrays and Collections': ['Array Module (array.array)', 'Collections Module (deque, OrderedDict, ChainMap)'],
  'List Comprehensions': ['List Comprehensions with Filtering', 'Dict and Set Comprehensions', 'Nested Comprehensions'],
  'Functions and Advanced Functions': ['First-Class Functions and High-Order Functions', 'Closures and Lexical Scoping', 'Partial Functions with functools.partial'],
  'Modules and Packages': ['Importing Modules (import, from, as)', 'Creating Custom Packages and __init__.py', 'Standard Library Overview'],
  'File Handling': ['Opening and Closing Files with open()', 'Context Managers and the with Statement', 'Reading and Writing Text vs Binary Files'],
  'Exception Handling': ['Try, Except, Else, and Finally Blocks', 'Catching Specific Exceptions and Exception Hierarchy', 'Raising Custom Exceptions'],
  'Object-Oriented Programming': ['Classes, Objects, and Self Parameter', 'Constructors (__init__) and Instance Attributes', 'Inheritance and Method Overriding', 'Multiple Inheritance and MRO (Method Resolution Order)', 'Encapsulation and Private Attributes (__name)', 'Polymorphism and Duck Typing', 'Class Methods (@classmethod) and Static Methods (@staticmethod)', 'Magic/Dunder Methods (__str__, __repr__, __len__, __getitem__)'],
  'Iterators and Generators': ['Iterables vs Iterators (__iter__ and __next__)', 'Generator Functions and yield Keyword', 'Generator Expressions and Memory Savings'],
  'Decorators': ['Function Decorators and @functools.wraps', 'Decorators with Arguments', 'Class-based Decorators'],
  'Lambda Functions': ['Lambda Anonymous Functions', 'Lambda with map(), filter(), and sorted()'],
  'Functional Programming': ['Map, Filter, and Reduce Functions', 'Immutability and Pure Functions in Python'],
  'Regular Expressions': ['Regex Patterns with re Module', 're.match, re.search, and re.findall', 'Regex Capturing Groups and Substitution'],
  'Dates and Time': ['Datetime Module (date, time, datetime)', 'Timezones with zoneinfo', 'Parsing and Formatting Datetimes (strftime and strptime)'],
  'JSON and Data Serialization': ['JSON Encoding and Decoding (json.dumps, json.loads)', 'Pickle Module for Object Serialization'],
  'Virtual Environments and pip': ['Creating Virtual Environments with venv', 'Package Management with pip and requirements.txt'],
  'Type Hints': ['Type Annotations (int, str, List, Dict)', 'Optional and Union Types', 'Generic Types and TypeVar'],
  'Dataclasses': ['Creating Classes with @dataclass', 'Field Configuration and Post-Init Validation'],
  'Pattern Matching': ['Match-Case Statements in Python 3.10+', 'Pattern Matching with Sequences and Dicts'],
  'Python Standard Library': ['OS and Sys Modules', 'Pathlib for Modern File Paths', 'Math and Random Modules'],
  'Memory Management': ['Reference Counting and Garbage Collection', 'Garbage Collector Module (gc)', 'Memory Optimization with __slots__'],
  'Multithreading': ['Threading Module and Thread Lifecycle', 'Global Interpreter Lock (GIL) Explanation', 'Thread Synchronization with Locks and Queues'],
  'Multiprocessing': ['Multiprocessing Module for CPU-Bound Tasks', 'Process Pools (ProcessPoolExecutor)', 'Inter-Process Communication (Pipe, Queue)'],
  'Async Programming': ['Asyncio Fundamentals and event loop', 'Async and Await Keywords', 'Concurrent Execution with asyncio.gather'],
  'Networking': ['Socket Programming Basics', 'Building TCP Client and Server in Python'],
  'APIs and HTTP': ['Making HTTP Requests with requests Library', 'Parsing API JSON Responses and Handling Headers'],
  'Database Programming': ['Python DB-API 2.0 Specification', 'Database Connection Pooling'],
  'SQLite': ['SQLite3 Module and Embedded Database Setup', 'Executing SQL Queries and Parameterized Statements'],
  'Testing': ['Unit Testing with unittest Framework', 'Modern Testing with Pytest', 'Mocking Dependencies with unittest.mock'],
  'Debugging': ['Debugging with pdb and breakpoint()', 'Inspecting Variables and Call Stack'],
  'Logging': ['Logging Module Configuration and Levels', 'Structured JSON Logging'],
  'Python Performance Optimization': ['Profiling Code with cProfile and timeit', 'Numba and Cython Overview'],
  'Security Basics': ['Secure Password Hashing with hashlib', 'Environment Variables and Secret Management'],
  'Web Development': ['Python Web Ecosystem Overview (WSGI vs ASGI)', 'Web Application Security Fundamentals'],
  'Flask': ['Flask Framework Setup and Routing', 'Flask Templates and Request Handling'],
  'Django': ['Django MVT Architecture', 'Django ORM and Database Models', 'Django REST Framework (DRF)'],
  'FastAPI': ['FastAPI Setup and Path Parameters', 'Pydantic Data Validation Models', 'Async Endpoints and Auto OpenAPI Docs'],
  'Data Science with Python': ['Data Science Workflow and Environment Setup', 'Data Wrangling Fundamentals'],
  'NumPy': ['NumPy N-Dimensional Arrays (ndarray)', 'NumPy Vectorized Operations and Broadcasting', 'NumPy Slicing, Reshaping, and Indexing'],
  'Pandas': ['Pandas Series and DataFrames', 'Reading CSV and Excel Files with Pandas', 'Data Cleaning, Filtering, and GroupBy'],
  'Matplotlib': ['Plotting Line, Bar, and Scatter Charts with Matplotlib', 'Customizing Figures and Subplots'],
  'Machine Learning with Python': ['Scikit-Learn Overview and Data Preparation', 'Train-Test Split and Model Training (Linear Regression, Decision Trees)'],
  'AI and Python': ['Overview of Deep Learning (PyTorch & TensorFlow)', 'LLM Integration with Python (OpenAI/LangChain)'],
  'Automation and Scripting': ['Automating File and Directory Tasks', 'Automating Tasks with Schedule and Subprocess'],
  'Web Scraping': ['HTML Parsing with BeautifulSoup4', 'Web Automation with Selenium/Playwright'],
  'Python for DSA': ['Arrays in Python (Lists)', 'Strings in Python for DSA', 'Hash Maps in Python (dict)', 'Hash Sets in Python (set)', 'Stacks in Python (list / collections.deque)', 'Queues in Python (collections.deque)', 'Linked Lists in Python (Custom Nodes)', 'Trees in Python (Custom Binary Trees)', 'Binary Search Trees in Python', 'Heaps and Priority Queues (heapq)', 'Graphs Representation in Python (Adjacency List)', 'BFS Traversal in Python', 'DFS Traversal in Python', 'Recursion and Backtracking in Python', 'Sorting Algorithms in Python (Timsort & sorted)', 'Searching Algorithms in Python (Binary Search with bisect)', 'Two Pointers Pattern in Python', 'Sliding Window Pattern in Python', 'Greedy Algorithms in Python', 'Dynamic Programming in Python (Memoization & Tabulation)', 'Bit Manipulation in Python', 'Prefix Sum Pattern in Python', 'Binary Search Pattern in Python', 'Union Find (Disjoint Set) in Python'],
  'Competitive Programming with Python': ['Fast I/O in Python (sys.stdin.read)', 'Useful Built-in Modules for CP (itertools, collections, math)'],
  'Python Projects': ['CLI Calculator and Todo App Project', 'Automated Web Scraper Project', 'FastAPI REST Microservice Project']
};

function getLevelForTopic(category: string, _title: string): PythonLevel {
  if (
    category.includes('Fundamentals') ||
    category.includes('Variables') ||
    category.includes('Operators') ||
    category.includes('Input') ||
    category.includes('Conditional') ||
    category.includes('Loops') ||
    category.includes('Functions') ||
    category.includes('Strings') ||
    category.includes('Lists') ||
    category.includes('Tuples') ||
    category.includes('Sets') ||
    category.includes('Dictionaries')
  ) {
    return 'Beginner';
  }

  if (
    category.includes('Async') ||
    category.includes('Multiprocessing') ||
    category.includes('Memory') ||
    category.includes('Flask') ||
    category.includes('Django') ||
    category.includes('FastAPI') ||
    category.includes('Machine Learning') ||
    category.includes('AI') ||
    category.includes('Performance')
  ) {
    return 'Advanced';
  }

  return 'Intermediate';
}

function buildComprehensivePythonNote(category: PythonCategory, title: string): PythonTopicNote {
  const level = getLevelForTopic(category, title);

  let whatItIs = `**${title}** is a core concept in Python programming within the category of **${category}**.`;
  let whyUsed = `It provides clean syntax, high readability, and powerful standard features to build software efficiently.`;
  let howItWorks = `Python executes this construct dynamically using the CPython bytecode interpreter and runtime memory manager.`;
  let syntax = `# Syntax for ${title}\nresult = example_expression()`;
  let codeExamples: CodeSnippetExample[] = [
    {
      title: `${title} Example`,
      code: `# Example demonstrating ${title}\n\ndef demo():\n    print("Executing ${title}")\n\ndemo()`,
      explanation: `Line 1: Comments describe the snippet.\nLine 3: Function defined.\nLine 6: Invokes the code.`
    }
  ];
  let importantRules = [
    'Always adhere to PEP 8 style guidelines (4 spaces indentation).',
    'Keep function definitions clear, concise, and focused on a single responsibility.'
  ];
  let commonMistakes = [
    'Indentation errors caused by mixing tabs and spaces.',
    'Mutating default argument values like lists or dicts in function signatures.'
  ];
  let realWorldUse = `Widely used across web backends, automation scripts, data science pipelines, and AI engineering.`;
  let timeComplexity: string | undefined = undefined;
  let spaceComplexity: string | undefined = undefined;
  let relatedConcepts = ['Python Standard Library', 'PEP 8', 'Data Structures'];
  let practiceQuestions: PracticeQuestion[] = [
    {
      question: `What is the primary benefit of ${title} in Python?`,
      answer: `It improves code clarity, maintainability, and runtime efficiency.`
    }
  ];
  let dsaConnection = `Essential building block for implementing algorithms, memory references, and algorithmic problem solving in Python.`;

  // Specific content overrides for core topics & search keywords
  if (title.includes('List') || title.includes('Lists')) {
    whatItIs = `A **List** in Python is a mutable, ordered sequence of elements enclosed in square brackets \`[]\`. Lists can store heterogeneous data types.`;
    whyUsed = `Lists allow storing, modifying, ordering, and accessing sequences of data dynamically with built-in methods like \`append()\`, \`pop()\`, and \`sort()\`.`;
    howItWorks = `CPython implements lists as dynamic contiguous arrays of object pointers. When space is exhausted, capacity is automatically over-allocated by approximately ~1.125x.`;
    syntax = `# Creating lists\nmy_list = [10, 20, 30]\n# Appending & Accessing\nmy_list.append(40)\nval = my_list[0] # 10`;
    codeExamples = [
      {
        title: 'List Operations & Slicing',
        code: `nums = [5, 2, 8, 1, 9]\nnums.append(10)\nnums.sort()\n\nprint("Sorted:", nums)  # [1, 2, 5, 8, 9, 10]\nprint("Subslice:", nums[1:4])  # [2, 5, 8]`,
        explanation: `Line 1: List initialization.\nLine 2: Append 10 to end in O(1) amortized time.\nLine 3: Timsort O(N log N) in-place sort.`
      }
    ];
    importantRules = [
      'Lists are mutable; modifying a list mutates all references to that same list object unless copied (`list.copy()`).',
      'Indexing out of range raises an `IndexError`.'
    ];
    commonMistakes = [
      'Using `list.remove(x)` when `x` is not present, raising a `ValueError`.',
      'Modifying a list while iterating over it with a `for` loop.'
    ];
    realWorldUse = 'Storing query results from databases, task queues, tabular rows, and API payloads.';
    timeComplexity = 'Access: O(1), Append: O(1) amortized, Insert/Delete: O(N), Search: O(N).';
    spaceComplexity = 'O(N) contiguous memory allocation.';
    relatedConcepts = ['Tuples', 'List Comprehensions', 'Arrays', 'Timsort'];
    practiceQuestions = [
      { question: 'What happens if you access list[-1] in Python?', answer: 'It retrieves the last element of the list using negative indexing.' }
    ];
    dsaConnection = 'Primary data structure in Python for Array-based DSA problems, Dynamic Programming tables, and Stacks.';
  } else if (title.includes('Dictionary') || title.includes('Dictionaries') || title.includes('dict')) {
    whatItIs = `A **Dictionary** in Python is a mutable collection of key-value pairs where keys must be hashable and unique. Written as \`{key: value}\`.`;
    whyUsed = `Provides instant O(1) average time complexity key-value lookups, insertion, and deletion.`;
    howItWorks = `Python dictionaries use a highly optimized Hash Table implementation (combining a sparse hash array and a dense key-value array maintaining insertion order since Python 3.7).`;
    syntax = `# Dictionary creation\nuser = {"name": "Alice", "role": "admin"}\n# Access & Update\nprint(user["name"])\nuser["age"] = 25`;
    codeExamples = [
      {
        title: 'Frequency Counter using Dict',
        code: `text = "algorise"\nfreq = {}\nfor char in text:\n    freq[char] = freq.get(char, 0) + 1\n\nprint(freq)  # {'a': 1, 'l': 1, 'g': 1, 'o': 1, 'r': 1, 'i': 1, 's': 1, 'e': 1}`,
        explanation: "Line 3: freq.get(char, 0) returns 0 if character is missing without raising KeyError."
      }
    ];
    importantRules = [
      'Keys must be hashable (immutable types like `int`, `str`, `tuple`). Mutable types like `list` cannot be keys.',
      'Accessing a non-existent key with `dict[key]` throws `KeyError`; use `dict.get(key, default)`.'
    ];
    commonMistakes = [
      'Attempting to use a list as a dictionary key.',
      'Expecting un-ordered dictionary behavior in Python 3.7+.'
    ];
    realWorldUse = 'Caching HTTP payloads, database ORM mapping, JSON parsing, session stores.';
    timeComplexity = 'Lookup, Insertion, Deletion: Average O(1), Worst O(N) on hash collisions.';
    spaceComplexity = 'O(N) hash table memory.';
    relatedConcepts = ['Hash Sets', 'Collections Counter', 'JSON', 'Hash Functions'];
    practiceQuestions = [
      { question: 'Why can a list not be used as a dictionary key in Python?', answer: 'Lists are mutable and unhashable; their hash value could change if elements are modified.' }
    ];
    dsaConnection = 'Essential for Hash Map DSA problems, 2-Sum problem, Frequency Counting, Memoization in Dynamic Programming, and Graph Adjacency Lists.';
  } else if (title.includes('Decorator') || title.includes('Decorators')) {
    whatItIs = `A **Decorator** is a function that takes another function as an argument, extends its behavior without modifying it explicitly, and returns a new function using the \`@decorator\` syntax.`;
    whyUsed = `Allows clean cross-cutting concerns such as logging, authentication, execution timing, input validation, and caching.`;
    howItWorks = `Syntactic sugar for \`target_func = decorator(target_func)\`. Uses closure mechanics to wrap the inner function execution.`;
    syntax = `def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        # Pre-execution logic\n        res = func(*args, **kwargs)\n        # Post-execution logic\n        return res\n    return wrapper\n\n@my_decorator\ndef greet():\n    print("Hello!")`;
    codeExamples = [
      {
        title: 'Timing Execution Decorator',
        code: `import time\nfrom functools import wraps\n\ndef timer_decorator(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        duration = time.time() - start\n        print(f"[{func.__name__}] Execution took {duration:.4f}s")\n        return result\n    return wrapper\n\n@timer_decorator\ndef compute_sum(n):\n    return sum(range(n))\n\ncompute_sum(1000000)`,
        explanation: "Line 5: @wraps(func) preserves function metadata (docstring, name).\nLine 14: @timer_decorator automatically wraps compute_sum call."
      }
    ];
    importantRules = [
      'Always use `@functools.wraps(func)` on the inner wrapper function to preserve original function name and docstrings.',
      'Accept `*args` and `**kwargs` in wrapper functions to support decorated functions with any argument signatures.'
    ];
    commonMistakes = [
      'Forgetting to return the inner wrapper function from the decorator outer function.',
      'Forgetting to return the result of `func(*args, **kwargs)` inside the wrapper.'
    ];
    realWorldUse = 'Flask/FastAPI route authentication (`@app.get()`, `@login_required`), Django permissions, Pytest fixtures.';
    timeComplexity = 'O(1) wrapper overhead + time complexity of wrapped function.';
    spaceComplexity = 'O(1) memory for closure scope.';
    relatedConcepts = ['First-Class Functions', 'Closures', 'High-Order Functions', 'functools'];
    practiceQuestions = [
      { question: 'Why is @functools.wraps important in decorators?', answer: 'It copies original function name, docstring, and annotations onto the wrapper function.' }
    ];
    dsaConnection = 'Used with `@functools.lru_cache` for automatic Top-Down Dynamic Programming memoization.';
  } else if (title.includes('Generator') || title.includes('Generators')) {
    whatItIs = `A **Generator** in Python is a special iterator produced by a function containing the \`yield\` keyword. It computes values lazily one at a time on-demand.`;
    whyUsed = `Saves memory by avoiding building entire large data sequences in RAM at once.`;
    howItWorks = `When \`yield\` is encountered, the generator function's execution state, local variables, and frame are suspended. Calling \`next()\` resumes execution right after \`yield\`.`;
    syntax = `def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ngen = countdown(3)\nfor num in gen:\n    print(num)`;
    codeExamples = [
      {
        title: 'Memory-Efficient Fibonacci Generator',
        code: `def fibonacci_gen():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci_gen()\nfor _ in range(5):\n    print(next(fib), end=" ")  # Outputs: 0 1 1 2 3`,
        explanation: "Line 4: yield a pauses execution and yields number.\nLine 8: next(fib) resumes generator execution frame."
      }
    ];
    importantRules = [
      'Generators are single-pass iterators; once fully consumed, they raise `StopIteration` and cannot be restarted.',
      'Generators cannot be indexed (`gen[0]` raises `TypeError`).'
    ];
    commonMistakes = [
      'Trying to reuse an already exhausted generator.',
      'Using generator expressions inside `sum()` or `any()` with extra un-needed list square brackets.'
    ];
    realWorldUse = 'Streaming massive log files line-by-line, database streaming cursors, machine learning batch data loaders.';
    timeComplexity = 'O(1) per yield step.';
    spaceComplexity = 'O(1) constant auxiliary memory regardless of dataset size.';
    relatedConcepts = ['Iterators', 'Yield Keyword', 'Iterable Protocol', 'Streaming'];
    practiceQuestions = [
      { question: 'What is the memory difference between a List and a Generator?', answer: 'Lists load all elements in RAM (O(N) space); Generators produce items on demand (O(1) space).' }
    ];
    dsaConnection = 'Ideal for streaming infinite graph state space trees, memory-constrained stream processing, and pipeline processing.';
  } else if (title.includes('Async') || title.includes('Asyncio') || title.includes('asyncio')) {
    whatItIs = `**Async Programming (asyncio)** is a concurrent execution model using an event loop to run single-threaded asynchronous tasks with \`async\` and \`await\` keywords.`;
    whyUsed = `Handles thousands of concurrent I/O-bound operations (network requests, DB queries) efficiently without thread context-switching overhead.`;
    howItWorks = `An Event Loop manages coroutines. When a coroutine awaits an I/O operation (\`await asyncio.sleep()\`), the event loop pauses it and switches to run another ready coroutine.`;
    syntax = `import asyncio\n\nasync def fetch_data():\n    print("Start fetch")\n    await asyncio.sleep(1) # Non-blocking I/O delay\n    return "Data"\n\nasyncio.run(fetch_data())`;
    codeExamples = [
      {
        title: 'Concurrent Async Tasks with asyncio.gather',
        code: `import asyncio\nimport time\n\nasync def worker(id, delay):\n    print(f"Task {id} starting...")\n    await asyncio.sleep(delay)\n    print(f"Task {id} finished!")\n    return f"Result {id}"\n\nasync def main():\n    results = await asyncio.gather(\n        worker(1, 1),\n        worker(2, 2),\n        worker(3, 1)\n    )\n    print("All done:", results)\n\nasyncio.run(main())`,
        explanation: "Line 11: asyncio.gather() runs all 3 workers concurrently in ~2s total time instead of 4s sequential."
      }
    ];
    importantRules = [
      'Never call blocking synchronous functions (like `time.sleep()` or `requests.get()`) inside async coroutines; use `asyncio.sleep()` or async HTTP libraries like `httpx`/`aiohttp`.',
      'Coroutines must be awaited or scheduled as tasks (`asyncio.create_task()`).'
    ];
    commonMistakes = [
      'Calling an async function without `await`, returning an un-awaited coroutine object.',
      'Blocking the single event loop thread with heavy CPU computation.'
    ];
    realWorldUse = 'FastAPI microservices, WebSocket servers, chat applications, high-concurrency web scrapers.';
    timeComplexity = 'O(1) event loop scheduling overhead per I/O task.';
    spaceComplexity = 'O(N) for active coroutine call frames.';
    relatedConcepts = ['Event Loop', 'Coroutines', 'FastAPI', 'Multithreading'];
    practiceQuestions = [
      { question: 'Why does asyncio outperform multithreading for I/O-bound tasks in Python?', answer: 'It avoids operating system thread context-switching overhead and GIL lock contention using lightweight event-driven coroutines.' }
    ];
    dsaConnection = 'Underlying paradigm for concurrent graph crawlers, async stream algorithms, and parallel API data pipelines.';
  } else if (title.includes('FastAPI')) {
    whatItIs = `**FastAPI** is a modern, high-performance Python web framework for building REST APIs with Python type hints and automatic interactive OpenAPI (Swagger) documentation.`;
    whyUsed = `Offers extreme performance (comparable to NodeJS & Go) alongside automatic request validation via Pydantic and built-in async support.`;
    howItWorks = `Built on top of Starlette for ASGI web routing and Pydantic for data serialization and type enforcement.`;
    syntax = `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.post("/items/")\nasync def create_item(item: Item):\n    return {"item": item.name, "status": "created"}`;
    codeExamples = [
      {
        title: 'FastAPI Endpoint with Path Parameter & Validation',
        code: `from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\nproblems_db = {1: "Two Sum", 2: "Valid Anagram"}\n\n@app.get("/api/problems/{problem_id}")\nasync def get_problem(problem_id: int):\n    if problem_id not in problems_db:\n        raise HTTPException(status_code=404, detail="Problem not found")\n    return {"id": problem_id, "title": problems_db[problem_id]}`,
        explanation: "Line 7: problem_id: int automatically parses and validates incoming path parameter.\nLine 9: Raises standard HTTP 404 JSON response."
      }
    ];
    importantRules = [
      'Define data models using Pydantic `BaseModel` for automatic body validation.',
      'Leverage `async def` for I/O-bound DB operations.'
    ];
    commonMistakes = [
      'Using synchronous blocking DB drivers in `async def` route handlers without threadpools.',
      'Forgetting to run server with an ASGI server like `uvicorn main:app --reload`.'
    ];
    realWorldUse = 'Production backend APIs for Microsoft, Uber, Netflix, and modern ML/AI model serving.';
    timeComplexity = 'O(1) route routing and JSON serialization.';
    spaceComplexity = 'O(N) memory for ASGI request context.';
    relatedConcepts = ['Pydantic', 'Asyncio', 'REST APIs', 'OpenAPI'];
    practiceQuestions = [
      { question: 'What handles data validation in FastAPI?', answer: 'Pydantic models enforce schema types and auto-generate validation error messages.' }
    ];
    dsaConnection = 'API routing framework serving ALGOrise problems, compiler requests, and execution outputs.';
  } else if (title.includes('Pandas')) {
    whatItIs = `**Pandas** is the core Python data analysis library providing high-performance DataFrames (2D tabular structures) and Series (1D labelled arrays).`;
    whyUsed = `Simplifies data cleaning, filtering, merging, aggregation, and time-series analysis for structured CSV, SQL, and Parquet data.`;
    howItWorks = `Built on top of NumPy arrays, organizing columns into homogeneous typed memory blocks for fast C-level operations.`;
    syntax = `import pandas as pd\n\n# Create DataFrame\ndf = pd.DataFrame({"Name": ["Alice", "Bob"], "Score": [95, 88]})\n\n# Filter\nhigh_scores = df[df["Score"] > 90]`;
    codeExamples = [
      {
        title: 'Pandas Data Filtering & GroupBy',
        code: `import pandas as pd\n\ndata = {\n    "Category": ["Math", "Math", "Physics", "Physics"],\n    "Score": [90, 85, 92, 78]\n}\ndf = pd.DataFrame(data)\n\n# GroupBy Average\navg_scores = df.groupby("Category")["Score"].mean()\nprint(avg_scores)`,
        explanation: "Line 9: groupby('Category')['Score'].mean() aggregates dataset per category in O(N) vectorized C-speed."
      }
    ];
    importantRules = [
      'Prefer vectorized Pandas methods over iterating over rows with `for index, row in df.iterrows()`.',
      'Use `.loc[]` for label indexing and `.iloc[]` for integer position indexing.'
    ];
    commonMistakes = [
      'Using Python loops over DataFrames causing 100x performance degradation.',
      'Ignoring `SettingWithCopyWarning` when modifying slices of DataFrames.'
    ];
    realWorldUse = 'Data science pipelines, financial quantitative modeling, ETL data processing.';
    timeComplexity = 'O(N) for column filtering and GroupBy aggregations.';
    spaceComplexity = 'O(N) RAM for tabular memory blocks.';
    relatedConcepts = ['NumPy', 'DataFrames', 'Matplotlib', 'CSV Processing'];
    practiceQuestions = [
      { question: 'What is the difference between loc and iloc in Pandas?', answer: 'loc selects by label/column names; iloc selects by integer zero-based index positions.' }
    ];
    dsaConnection = 'Used for analyzing tabular problem submissions, benchmarking algorithmic performance, and dataset preparation.';
  } else if (title.includes('Recursion') || title.includes('Recursive')) {
    whatItIs = `**Recursion** in Python is a technique where a function calls itself to break down a problem into smaller sub-instances until reaching a Base Case.`;
    whyUsed = `Provides intuitive solutions for naturally recursive structures such as Trees, Graphs, Backtracking, and Divide & Conquer algorithms.`;
    howItWorks = `Each recursive call pushes a frame onto the CPython Call Stack. Default recursion limit is 1000 frames (\`sys.getrecursionlimit()\`).`;
    syntax = `def factorial(n):\n    if n <= 1: return 1  # Base Case\n    return n * factorial(n - 1)  # Recursive Step`;
    codeExamples = [
      {
        title: 'Recursive Fibonacci with LRU Cache Memoization',
        code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(50))  # Instant O(N) result: 12586269025`,
        explanation: "Line 3: @lru_cache memoizes call results, converting exponential O(2^N) recursion into linear O(N)."
      }
    ];
    importantRules = [
      'Every recursive function MUST have a clear Base Case to avoid infinite recursion.',
      'Be mindful of Python recursion depth limit (`RecursionError: maximum recursion depth exceeded`).'
    ];
    commonMistakes = [
      'Missing base case leading to `RecursionError`.',
      'Forgetting memoization on overlapping subproblems.'
    ];
    realWorldUse = 'Parsing JSON/XML trees, directory file walking, compiler AST parsing.';
    timeComplexity = 'O(N) linear recursion; O(2^N) naive tree recursion; O(N) with memoization.';
    spaceComplexity = 'O(N) auxiliary stack space for depth N.';
    relatedConcepts = ['Call Stack', 'Memoization', 'Dynamic Programming', 'Backtracking'];
    practiceQuestions = [
      { question: 'How do you increase the recursion limit in Python?', answer: 'Using sys.setrecursionlimit(limit_number).' }
    ];
    dsaConnection = 'Foundation for Tree Traversals (DFS), Merge Sort, Quick Sort, Backtracking, and Dynamic Programming.';
  } else if (title.includes('Dynamic Programming') || title.includes('DP')) {
    whatItIs = `**Dynamic Programming (DP)** is an algorithmic optimization technique that solves complex problems by breaking them into overlapping subproblems, solving each subproblem once, and storing the results.`;
    whyUsed = `Transforms exponential time complexities (e.g. O(2^N)) into polynomial or linear time (e.g. O(N), O(N^2)).`;
    howItWorks = "Can be implemented via Top-Down Memoization (Recursion + @lru_cache / dictionary) or Bottom-Up Tabulation (iterative DP array/table).";
    syntax = `# Bottom-Up Tabulation Example (Coin Change / Fibonacci)\ndp = [0] * (n + 1)\ndp[1] = 1\nfor i in range(2, n + 1):\n    dp[i] = dp[i-1] + dp[i-2]`;
    codeExamples = [
      {
        title: '0/1 Knapsack / Coin Change DP in Python',
        code: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    \n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n            \n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1, 2, 5], 11))  # 3 (5 + 5 + 1)`,
        explanation: "Line 2: DP array initialized to infinity.\nLine 7: Tabulation state transition equation dp[i] = min(dp[i], dp[i - coin] + 1) in O(amount * len(coins))."
      }
    ];
    importantRules = [
      'Identify the DP State (what parameters uniquely define a subproblem).',
      'Formulate the State Transition Equation relating current state to sub-states.'
    ];
    commonMistakes = [
      'Confusing Top-Down recursion without memoization with true DP.',
      'Incorrect DP table initialization values (e.g. using 0 instead of infinity for minimization).'
    ];
    realWorldUse = 'Diff algorithms (git diff), DNA sequence alignment (Needleman-Wunsch), shortest path routing, resource allocation.';
    timeComplexity = 'O(N * M) depending on state space dimensions.';
    spaceComplexity = 'O(N) or O(N * M) auxiliary table space (can often be optimized).';
    relatedConcepts = ['Memoization', 'Tabulation', 'Recursion', 'Optimal Substructure'];
    practiceQuestions = [
      { question: 'What two properties must a problem have to be solved with Dynamic Programming?', answer: 'Overlapping Subproblems and Optimal Substructure.' }
    ];
    dsaConnection = 'Core topic in competitive programming for Longest Common Subsequence, Knapsack, Edit Distance, and Path Finding.';
  } else if (category === 'Python for DSA') {
    whatItIs = `**${title}** covers both the idiomatic Python implementation of ${title.replace(' in Python', '')} and how Python features are leveraged to solve Data Structures & Algorithms problems.`;
    whyUsed = "Python's concise syntax, expressive standard library (collections, heapq, bisect, itertools), and automatic dynamic memory management make it one of the top choices for coding interviews and competitive programming.";
    howItWorks = `Python provides built-in high-level data structures (lists, dicts, sets, tuples) alongside efficient low-level C-implementations for heap and queue operations.`;
    syntax = `# ${title} Syntax Pattern\n# Idiomatic Python structure for algorithm implementation`;
    codeExamples = [
      {
        title: `${title} Implementation`,
        code: `# ${title} Code Example in Python\nimport collections, heapq\n\ndef solve_problem(data):\n    # Idiomatic solution pattern\n    return data\n\nprint("DSA Demo:", solve_problem([1, 2, 3]))`,
        explanation: "Line 2: Efficient standard library imports.\nLine 4: Algorithm execution."
      }
    ];

    importantRules = [
      'Know the exact Big-O time and space complexity of built-in Python methods.',
      'Use `collections.deque` for queues/stacks instead of `list.pop(0)` which is slow O(N).'
    ];
    commonMistakes = [
      'Using `list.pop(0)` for FIFO queues causing O(N) shifting instead of `deque.popleft()` which is O(1).',
      'Forgetting that `heapq` in Python creates a Min-Heap by default (negate values for Max-Heap).'
    ];
    realWorldUse = 'Core algorithmic logic in search engines, routing software, database indexing, and interview coding.';
    timeComplexity = 'Varies per algorithm: O(1), O(log N), O(N), or O(N log N).';
    spaceComplexity = 'O(1) auxiliary to O(N) auxiliary space.';
    relatedConcepts = ['Big-O Notation', 'Python Standard Library', 'Algorithms'];
    practiceQuestions = [
      { question: `How do you implement a Queue efficiently in Python for ${title}?`, answer: `Use collections.deque with append() for enqueue and popleft() for dequeue in O(1) time.` }
    ];
    dsaConnection = `Directly applied in solving LeetCode, HackerRank, and ALGOrise competitive programming questions.`;
  }

  return {
    id: `python-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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

class PythonNotesService {
  private allNotes: PythonTopicNote[] = [];

  constructor() {
    this.generateAllPythonNotes();
  }

  private generateAllPythonNotes() {
    const list: PythonTopicNote[] = [];
    (Object.keys(CATEGORY_TOPIC_MAP) as PythonCategory[]).forEach((cat) => {
      const topics = CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensivePythonNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): PythonTopicNote[] {
    return this.allNotes;
  }

  public getCategories(): readonly PythonCategory[] {
    return PYTHON_CATEGORIES;
  }

  public getNoteById(id: string): PythonTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): PythonTopicNote[] {
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

export const pythonNotesService = new PythonNotesService();
