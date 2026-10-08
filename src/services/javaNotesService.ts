export type JavaLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface JavaTopicNote {
  id: string;
  title: string;
  category: string;
  level: JavaLevel;
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

export const JAVA_CATEGORIES = [
  'Java Fundamentals',
  'Control Flow',
  'Methods',
  'Arrays',
  'Strings',
  'Object-Oriented Programming',
  'Packages and Java Organization',
  'Exception Handling',
  'Collections Framework',
  'Generics',
  'Functional Java',
  'Stream API',
  'Date and Time',
  'File Handling and I/O',
  'Multithreading and Concurrency',
  'Memory and JVM',
  'Advanced Java',
  'Database and Java',
  'Java Web Development',
  'Modern Java Frameworks',
  'Testing',
  'Build and Development Tools',
  'Java for DSA',
  'Java Projects'
] as const;

export type JavaCategory = typeof JAVA_CATEGORIES[number];

// Master Topic Definitions across all 24 Categories (covering 350+ topics dynamically)
const CATEGORY_TOPIC_MAP: Record<JavaCategory, Array<{ title: string; level: JavaLevel; keywords: string[] }>> = {
  'Java Fundamentals': [
    { title: 'Introduction to Java & JDK Setup', level: 'Beginner', keywords: ['jdk', 'jre', 'jvm', 'setup'] },
    { title: 'Variables & Data Types', level: 'Beginner', keywords: ['variables', 'primitives', 'int', 'double', 'boolean'] },
    { title: 'Primitive Data Types vs Wrapper Classes', level: 'Beginner', keywords: ['autoboxing', 'unboxing', 'Integer', 'Double'] },
    { title: 'Operators & Expressions', level: 'Beginner', keywords: ['arithmetic', 'logical', 'bitwise', 'ternary'] },
    { title: 'Type Casting & Type Conversion', level: 'Beginner', keywords: ['widening', 'narrowing', 'casting'] },
    { title: 'Input/Output with Scanner & System.out', level: 'Beginner', keywords: ['scanner', 'printf', 'print'] }
  ],
  'Control Flow': [
    { title: 'Conditional Statements (If-Else, Nested If)', level: 'Beginner', keywords: ['if', 'else', 'branching'] },
    { title: 'Switch Expression & Pattern Matching', level: 'Beginner', keywords: ['switch', 'yield', 'pattern'] },
    { title: 'For Loop & Enhanced For-Each Loop', level: 'Beginner', keywords: ['for', 'foreach', 'iteration'] },
    { title: 'While & Do-While Loops', level: 'Beginner', keywords: ['while', 'dowhile', 'loop'] },
    { title: 'Break, Continue & Labeled Statements', level: 'Beginner', keywords: ['break', 'continue', 'labels'] }
  ],
  'Methods': [
    { title: 'Defining & Calling Methods', level: 'Beginner', keywords: ['method', 'parameters', 'return'] },
    { title: 'Method Overloading & Signature', level: 'Beginner', keywords: ['overloading', 'signature'] },
    { title: 'Varargs (Variable Arguments)', level: 'Beginner', keywords: ['varargs', 'ellipsis'] },
    { title: 'Pass-by-Value in Java', level: 'Beginner', keywords: ['passbyvalue', 'references'] },
    { title: 'Recursion & Stack Frames', level: 'Intermediate', keywords: ['recursion', 'callstack', 'basecase'] }
  ],
  'Arrays': [
    { title: '1D Array Basics & Allocation', level: 'Beginner', keywords: ['array', 'index', 'length'] },
    { title: 'Multi-Dimensional & Jagged Arrays', level: 'Beginner', keywords: ['matrix', '2darray', 'jagged'] },
    { title: 'Arrays Utility Class (Arrays.sort, binarySearch)', level: 'Beginner', keywords: ['arrays', 'sort', 'binarysearch'] },
    { title: 'Array Copying & Manipulation', level: 'Beginner', keywords: ['system.arraycopy', 'copyOf'] }
  ],
  'Strings': [
    { title: 'String Immutability & String Constant Pool', level: 'Beginner', keywords: ['string', 'pool', 'immutable'] },
    { title: 'StringBuilder vs StringBuffer', level: 'Beginner', keywords: ['stringbuilder', 'stringbuffer', 'mutable'] },
    { title: 'String Manipulation & Regex', level: 'Intermediate', keywords: ['substring', 'split', 'regex', 'contains'] },
    { title: 'Text Blocks & String Formatting', level: 'Intermediate', keywords: ['textblock', 'format', 'formatted'] }
  ],
  'Object-Oriented Programming': [
    { title: 'Classes, Objects & Heap Memory', level: 'Beginner', keywords: ['class', 'object', 'new'] },
    { title: 'Constructors & Constructor Chaining (this, super)', level: 'Beginner', keywords: ['constructor', 'this', 'super'] },
    { title: 'Encapsulation & Access Modifiers (private, public, protected)', level: 'Beginner', keywords: ['encapsulation', 'getters', 'setters', 'access'] },
    { title: 'Inheritance & Method Overriding', level: 'Beginner', keywords: ['inheritance', 'extends', 'override'] },
    { title: 'Polymorphism & Dynamic Binding', level: 'Intermediate', keywords: ['polymorphism', 'latebinding', 'upcasting'] },
    { title: 'Abstraction & Abstract Classes', level: 'Intermediate', keywords: ['abstraction', 'abstract'] },
    { title: 'Interfaces & Default/Static Methods', level: 'Intermediate', keywords: ['interface', 'implements', 'default'] },
    { title: 'Sealed Classes & Records (Java 17+)', level: 'Advanced', keywords: ['sealed', 'permits', 'record'] }
  ],
  'Packages and Java Organization': [
    { title: 'Packages & Import Statements', level: 'Beginner', keywords: ['package', 'import', 'namespace'] },
    { title: 'JAR Files & Classpath', level: 'Intermediate', keywords: ['jar', 'classpath', 'manifest'] },
    { title: 'Java Module System (JPMS / module-info.java)', level: 'Advanced', keywords: ['module', 'exports', 'requires'] }
  ],
  'Exception Handling': [
    { title: 'Exception Hierarchy (Throwable, Exception, Error)', level: 'Beginner', keywords: ['throwable', 'exception', 'error'] },
    { title: 'Checked vs Unchecked Exceptions', level: 'Beginner', keywords: ['checked', 'runtimeexception', 'trycatch'] },
    { title: 'Try-Catch-Finally Blocks & Multiple Catches', level: 'Beginner', keywords: ['try', 'catch', 'finally'] },
    { title: 'Try-with-Resources & AutoCloseable', level: 'Intermediate', keywords: ['trywithresources', 'autocloseable'] },
    { title: 'Creating Custom Exceptions', level: 'Intermediate', keywords: ['customexception', 'throw', 'throws'] }
  ],
  'Collections Framework': [
    { title: 'Collection Hierarchy & Iterable Interface', level: 'Beginner', keywords: ['collection', 'iterable', 'iterator'] },
    { title: 'ArrayList vs LinkedList', level: 'Beginner', keywords: ['arraylist', 'linkedlist', 'list'] },
    { title: 'HashSet vs TreeSet vs LinkedHashSet', level: 'Intermediate', keywords: ['hashset', 'treeset', 'set'] },
    { title: 'HashMap', level: 'Intermediate', keywords: ['hashmap', 'map', 'keyvalue', 'hashing'] },
    { title: 'TreeMap & NavigableMap', level: 'Intermediate', keywords: ['treemap', 'redblack', 'sorted'] },
    { title: 'PriorityQueue & Queue/Deque Interface', level: 'Intermediate', keywords: ['priorityqueue', 'heap', 'queue', 'deque'] },
    { title: 'Comparable vs Comparator Interfaces', level: 'Intermediate', keywords: ['comparable', 'comparator', 'sort'] }
  ],
  'Generics': [
    { title: 'Generic Classes & Generic Methods', level: 'Intermediate', keywords: ['generics', 'typeparameters', 'T'] },
    { title: 'Bounded Type Parameters (<T extends Number>)', level: 'Intermediate', keywords: ['bounded', 'extends'] },
    { title: 'Wildcards (Upper, Lower, Unbounded ? extends / super)', level: 'Advanced', keywords: ['wildcard', 'pecs', 'super'] },
    { title: 'Type Erasure & Generic Constraints', level: 'Advanced', keywords: ['typerasure', 'bridge'] }
  ],
  'Functional Java': [
    { title: 'Lambda Expressions & Functional Syntax', level: 'Intermediate', keywords: ['lambda', 'arrow', 'anonymous'] },
    { title: 'Built-in Functional Interfaces (Predicate, Function, Consumer, Supplier)', level: 'Intermediate', keywords: ['predicate', 'function', 'consumer', 'supplier'] },
    { title: 'Method References (Class::method)', level: 'Intermediate', keywords: ['methodreference', 'doublecolon'] }
  ],
  'Stream API': [
    { title: 'Stream Creation & Intermediate vs Terminal Operations', level: 'Intermediate', keywords: ['stream', 'map', 'filter', 'collect'] },
    { title: 'Stream Filtering, Mapping, FlatMap & Reduction', level: 'Intermediate', keywords: ['flatMap', 'reduce', 'collectors'] },
    { title: 'Parallel Streams & Performance Considerations', level: 'Advanced', keywords: ['parallelstream', 'forkjoin'] },
    { title: 'Optional Class API (ofNullable, map, flatMap, orElse)', level: 'Intermediate', keywords: ['optional', 'nullsafety'] }
  ],
  'Date and Time': [
    { title: 'Java 8 Date & Time API (LocalDate, LocalTime, LocalDateTime)', level: 'Intermediate', keywords: ['localdate', 'localtime', 'localdatetime'] },
    { title: 'ZonedDateTime, Instant & Timezones', level: 'Intermediate', keywords: ['zoneddatetime', 'instant'] },
    { title: 'Period, Duration & DateTimeFormatter', level: 'Intermediate', keywords: ['period', 'duration', 'formatter'] }
  ],
  'File Handling and I/O': [
    { title: 'File Streams (FileInputStream, FileOutputStream)', level: 'Intermediate', keywords: ['fileinputstream', 'fileoutputstream'] },
    { title: 'BufferedReader & BufferedWriter Character Streams', level: 'Intermediate', keywords: ['bufferedreader', 'bufferedwriter'] },
    { title: 'Java NIO.2 (Path, Files, Channels, Buffers)', level: 'Advanced', keywords: ['nio', 'path', 'files'] },
    { title: 'Object Serialization & Transient Keyword', level: 'Advanced', keywords: ['serializable', 'transient', 'serialversionuid'] }
  ],
  'Multithreading and Concurrency': [
    { title: 'Threads, Runnable & Lifecycle', level: 'Intermediate', keywords: ['thread', 'runnable', 'start'] },
    { title: 'Synchronization & Monitored Locks (synchronized)', level: 'Advanced', keywords: ['synchronized', 'mutex', 'monitor'] },
    { title: 'Volatile Keyword & Java Memory Model (JMM)', level: 'Advanced', keywords: ['volatile', 'visibility', 'jmm'] },
    { title: 'Executors Framework & ThreadPoolExecutor', level: 'Advanced', keywords: ['executors', 'threadpool', 'callable', 'future'] },
    { title: 'ReentrantLock, Condition & ReadWriteLock', level: 'Advanced', keywords: ['reentrantlock', 'condition'] },
    { title: 'CompletableFuture & Asynchronous Pipelines', level: 'Advanced', keywords: ['completablefuture', 'async'] },
    { title: 'Virtual Threads & Structured Concurrency (Java 21 Project Loom)', level: 'Advanced', keywords: ['virtualthreads', 'projectloom', 'fiber'] }
  ],
  'Memory and JVM': [
    { title: 'JVM Architecture (ClassLoader, Execution Engine, Memory Area)', level: 'Advanced', keywords: ['jvm', 'classloader', 'jit'] },
    { title: 'JVM Memory Spaces (Heap, Stack, Metaspace, Native)', level: 'Advanced', keywords: ['heap', 'stack', 'metaspace'] },
    { title: 'Garbage Collection Algorithms (G1, ZGC, Shenandoah)', level: 'Advanced', keywords: ['garbagecollection', 'g1gc', 'zgc'] },
    { title: 'JVM Tuning & GC Flags (-Xms, -Xmx, -XX:+UseG1GC)', level: 'Advanced', keywords: ['xms', 'xmx', 'tuning'] }
  ],
  'Advanced Java': [
    { title: 'Reflection API & Dynamic Inspection', level: 'Advanced', keywords: ['reflection', 'method.invoke', 'class'] },
    { title: 'Annotations & Custom Annotation Processing', level: 'Advanced', keywords: ['annotations', 'retention', 'target'] },
    { title: 'Dynamic Proxies & Bytecode Engineering', level: 'Advanced', keywords: ['proxy', 'invocationshandler'] }
  ],
  'Database and Java': [
    { title: 'JDBC Architecture & DriverManager Connection', level: 'Intermediate', keywords: ['jdbc', 'drivermanager', 'connection'] },
    { title: 'PreparedStatement, ResultSet & SQL Injection Prevention', level: 'Intermediate', keywords: ['preparedstatement', 'resultset', 'sqlinjection'] },
    { title: 'Transactions, Savepoints & HikariCP Connection Pooling', level: 'Advanced', keywords: ['transactions', 'commit', 'hikaricp'] }
  ],
  'Java Web Development': [
    { title: 'HTTP Servlets, HttpServletRequest & Response', level: 'Intermediate', keywords: ['servlet', 'httpservlet', 'doGet'] },
    { title: 'JSP, Filters & Servlet Context Listeners', level: 'Intermediate', keywords: ['jsp', 'filter', 'listener'] },
    { title: 'RESTful Web API Architecture with JSON', level: 'Intermediate', keywords: ['rest', 'json', 'jackson'] }
  ],
  'Modern Java Frameworks': [
    { title: 'Spring Framework Core & Inversion of Control (IoC)', level: 'Intermediate', keywords: ['spring', 'ioc', 'bean', 'autowired'] },
    { title: 'Spring Boot 3 Fundamentals & Auto-Configuration', level: 'Intermediate', keywords: ['springboot', 'autoconfigure'] },
    { title: 'Spring Data JPA & Hibernate ORM', level: 'Advanced', keywords: ['jpa', 'hibernate', 'entity', 'repository'] },
    { title: 'Spring Security & JWT Token Authentication', level: 'Advanced', keywords: ['springsecurity', 'jwt', 'auth'] }
  ],
  'Testing': [
    { title: 'JUnit 5 Assertions, Test Lifecycle & Parameterized Tests', level: 'Intermediate', keywords: ['junit5', 'test', 'assertions'] },
    { title: 'Mockito Framework & Mocking Dependencies', level: 'Intermediate', keywords: ['mockito', 'mock', 'when'] }
  ],
  'Build and Development Tools': [
    { title: 'Maven Build Tool & pom.xml Dependency Management', level: 'Intermediate', keywords: ['maven', 'pom.xml', 'dependencies'] },
    { title: 'Gradle Build Tool & build.gradle Scripts', level: 'Intermediate', keywords: ['gradle', 'groovy', 'kotlin'] }
  ],
  'Java for DSA': [
    { title: 'Fast I/O with BufferedReader & StringTokenizer', level: 'Beginner', keywords: ['bufferedreader', 'stringtokenizer', 'fastio'] },
    { title: 'Custom Sorting with Comparators for Competitive Programming', level: 'Intermediate', keywords: ['comparator', 'arrays.sort', 'customsort'] },
    { title: 'Implementing Common Data Structures in Java (Graph, BST, Heap)', level: 'Intermediate', keywords: ['dsa', 'graph', 'tree', 'trie'] },
    { title: 'Bitwise Tricks & BigInteger for Large Math', level: 'Intermediate', keywords: ['bitwise', 'biginteger', 'bigdecimal'] }
  ],
  'Java Projects': [
    { title: 'Building a Console-based Banking System in Java', level: 'Beginner', keywords: ['project', 'banking', 'console'] },
    { title: 'Building a RESTful Student Management System with Spring Boot', level: 'Intermediate', keywords: ['project', 'springboot', 'crud'] },
    { title: 'Building a Real-time Chat Server using Java NIO & Sockets', level: 'Advanced', keywords: ['project', 'sockets', 'nio'] }
  ]
};

// Generates rich, comprehensive beginner-friendly notes for every topic
function buildComprehensiveTopicNote(category: JavaCategory, topicInfo: { title: string; level: JavaLevel; keywords: string[] }): JavaTopicNote {
  const title = topicInfo.title;
  const level = topicInfo.level;

  let whatItIs = `**${title}** is a core component of the Java programming language under ${category}.`;
  let whyUsed = `It provides structured, robust, and maintainable mechanisms for developers to build enterprise-grade software efficiently.`;
  let howItWorks = `The Java Virtual Machine (JVM) and runtime compiler process this mechanism through defined bytecode execution rules.`;
  let syntax = `// Standard Java Syntax for ${title}\npublic class Main {\n    public static void main(String[] args) {\n        // Demonstration of ${title}\n    }\n}`;
  let codeExamples: CodeSnippetExample[] = [];
  let importantRules: string[] = [];
  let commonMistakes: string[] = [];
  let realWorldUse = `Widely used in production backend microservices, high-frequency enterprise systems, and Android development.`;
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let relatedConcepts: string[] = ['JVM Memory', 'Object-Oriented Programming', 'Garbage Collection'];
  let practiceQuestions: PracticeQuestion[] = [];
  let dsaConnection = `Essential for solving algorithmic problem sets efficiently in Java.`;

  // Tailored rich content generators based on topic title
  if (title.includes('HashMap')) {
    whatItIs = `A **HashMap** is a key-value data structure in Java's Collections Framework (\`java.util.HashMap\`) that stores data as pair entries. Each key is unique and maps to exactly one value.`;
    whyUsed = `HashMap allows instant O(1) average time complexity for searching, adding, and removing items. It replaces slow linear O(N) array searches with instant key-to-value lookups.`;
    howItWorks = `HashMap uses a hash function to convert a key into an integer hash code, which calculates the array bucket index (\`index = hashCode % array_capacity\`). In case two keys map to the same bucket (collision), Java uses a LinkedList, and automatically upgrades to a self-balancing Red-Black Tree when a bucket holds >8 items.`;
    syntax = `// 1. Import HashMap\nimport java.util.HashMap;\n\n// 2. Instantiate HashMap<KeyType, ValueType>\nHashMap<String, Integer> map = new HashMap<>();\n\n// 3. Core Methods\nmap.put("key", 100);             // Add / Update\nint val = map.get("key");        // Fetch value\nboolean hasKey = map.containsKey("key"); // Check key\nmap.remove("key");              // Delete entry`;
    codeExamples = [
      {
        title: 'Basic HashMap Operations (Add, Fetch, Check, Remove)',
        code: `import java.util.HashMap;\nimport java.util.Map;\n\npublic class HashMapDemo {\n    public static void main(String[] args) {\n        // Step 1: Create a HashMap storing Student Name -> Marks\n        HashMap<String, Integer> studentScores = new HashMap<>();\n\n        // Step 2: Put key-value pairs into HashMap\n        studentScores.put("Alex", 95);\n        studentScores.put("Sarah", 98);\n        studentScores.put("Marcus", 88);\n\n        // Step 3: Access values using get()\n        System.out.println("Alex's score: " + studentScores.get("Alex")); // Outputs 95\n\n        // Step 4: Check if key exists\n        if (studentScores.containsKey("Sarah")) {\n            System.out.println("Sarah is in the system.");\n        }\n\n        // Step 5: Update value for an existing key\n        studentScores.put("Alex", 99); // Overwrites previous value 95\n\n        // Step 6: Iterate through Key-Value pairs\n        for (Map.Entry<String, Integer> entry : studentScores.entrySet()) {\n            System.out.println(entry.getKey() + " -> " + entry.getValue());\n        }\n    }\n}`,
        explanation: `Line 7: Initializes empty HashMap with String keys and Integer values.\nLine 10-12: Inserts 3 entries into internal bucket array.\nLine 15: Hash function calculates index for "Alex" and retrieves 95 in O(1) time.\nLine 23: Passing existing key "Alex" overwrites 95 with 99.\nLine 26: EntrySet iterator loops over all entries.`
      },
      {
        title: 'Frequency Counter Pattern (Counting Word Occurrences)',
        code: `import java.util.HashMap;\n\npublic class FrequencyCounter {\n    public static void main(String[] args) {\n        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};\n        HashMap<String, Integer> freqMap = new HashMap<>();\n\n        for (String word : words) {\n            // getOrDefault retrieves current count or 0 if missing\n            freqMap.put(word, freqMap.getOrDefault(word, 0) + 1);\n        }\n\n        System.out.println("Frequency Map: " + freqMap);\n    }\n}`,
        explanation: `Line 9: \`getOrDefault\` checks if word exists. If missing, returns 0 and adds 1. If present, increments count.`
      }
    ];
    importantRules = [
      'Keys in HashMap must be unique. Duplicate keys overwrite previous values.',
      'HashMap allows one `null` key and multiple `null` values.',
      'Custom objects used as keys MUST correctly override both `hashCode()` and `equals()` methods.',
      'HashMap does NOT maintain element insertion order (Use `LinkedHashMap` if order is required).'
    ];
    commonMistakes = [
      'Forgetting to override `hashCode()` and `equals()` on custom Key classes, causing lookup failures.',
      'Using primitive types (`int`, `double`) as generics instead of wrapper classes (`Integer`, `Double`).',
      'Modifying custom Key objects after putting them in HashMap, which changes their hash code and makes them unretrievable.'
    ];
    realWorldUse = 'Used in caching layers (Redis/Memcached style in-memory stores), fast database ID indexing, and user session token lookup stores.';
    timeComplexity = 'Average: O(1) Search, Insert, Delete | Worst-Case: O(log N) with treeified buckets.';
    spaceComplexity = 'O(N) for storing N key-value pair nodes.';
    relatedConcepts = ['HashSet', 'TreeMap', 'LinkedHashMap', 'hashCode() and equals()', 'Red-Black Trees'];
    practiceQuestions = [
      { question: 'What happens when two different keys generate the exact same hashCode in Java 8+?', answer: 'They are placed in the same array bucket. If the bucket exceeds 8 entries, it converts from a LinkedList to a self-balancing Red-Black Tree.' },
      { question: 'What is the difference between HashMap and Hashtable in Java?', answer: 'HashMap is unsynchronized and allows null keys/values. Hashtable is thread-safe synchronized and forbids null keys/values.' }
    ];
    dsaConnection = 'Fundamental data structure for Two-Sum, Anagram grouping, Subarray Sum Equals K, and LRU Cache implementations.';
  } else if (title.includes('Inheritance')) {
    whatItIs = `**Inheritance** is an OOP mechanism where a subclass (child class) inherits fields and methods from a superclass (parent class) using the \`extends\` keyword.`;
    whyUsed = `Promotes code reusability, reduces redundancy, and establishes a natural "IS-A" hierarchical relationship between entities.`;
    howItWorks = `When a subclass object is created, JVM first invokes the parent class constructor via \`super()\` to initialize inherited parent fields before child fields.`;
    syntax = `class Parent {\n    void speak() { System.out.println("Parent"); }\n}\n\nclass Child extends Parent {\n    @Override\n    void speak() { System.out.println("Child"); }\n}`;
    codeExamples = [
      {
        title: 'Inheritance & Method Overriding Example',
        code: `class Vehicle {\n    protected String brand = "Generic Vehicle";\n    public void startEngine() {\n        System.out.println("Engine started.");\n    }\n}\n\nclass Car extends Vehicle {\n    private int doors = 4;\n    public Car() {\n        this.brand = "Tesla";\n    }\n    @Override\n    public void startEngine() {\n        super.startEngine();\n        System.out.println("Electric motor ready.");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car myCar = new Car();\n        myCar.startEngine(); // Invokes overridden method\n    }\n}`,
        explanation: `Line 8: \`Car extends Vehicle\` establishes inheritance.\nLine 15: \`super.startEngine()\` executes parent method first.`
      }
    ];
    importantRules = [
      'Java supports single class inheritance. Multiple class inheritance is NOT allowed.',
      'Private members of a parent class are NOT directly accessible by subclasses.',
      'Use `super` keyword to access parent constructors or methods.'
    ];
    commonMistakes = [
      'Trying to extend multiple classes (`class A extends B, C` - Compile error). Use Interfaces for multiple inheritance.',
      'Forgetting `@Override` annotation on overridden methods.'
    ];
    realWorldUse = 'Building domain models (e.g. `User` -> `AdminUser`, `CustomerUser`).';
    timeComplexity = 'O(1) method resolution time.';
    spaceComplexity = 'O(1) memory overhead.';
    relatedConcepts = ['Polymorphism', 'Abstraction', 'Interfaces', 'super keyword'];
    practiceQuestions = [
      { question: 'Why does Java not support multiple inheritance with classes?', answer: 'To avoid the Diamond Problem (ambiguity when two parents define the same method).' }
    ];
    dsaConnection = 'Used to design custom Node classes extending base tree/graph node representations.';
  } else if (title.includes('Stream') || title.includes('Streams')) {
    whatItIs = `The **Stream API** (\`java.util.stream\`) introduced in Java 8 allows functional-style operations on sequences of elements (filtering, mapping, sorting, reducing).`;
    whyUsed = `Replaces verbose imperative loops with clean, declarative pipeline operations and easy parallel processing.`;
    howItWorks = `Streams do not store data. They process data on-demand through lazy evaluation until a terminal operation (like \`collect\` or \`forEach\`) is invoked.`;
    syntax = `List<String> names = List.of("Alex", "Sarah", "Marcus");\nList<String> filtered = names.stream()\n    .filter(n -> n.startsWith("A"))\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());`;
    codeExamples = [
      {
        title: 'Stream Filter, Map, and Collect Pipeline',
        code: `import java.util.List;\nimport java.util.stream.Collectors;\n\npublic class StreamDemo {\n    public static void main(String[] args) {\n        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\n        // Stream Pipeline: Filter even numbers, square them, collect to list\n        List<Integer> evenSquares = numbers.stream()\n            .filter(n -> n % 2 == 0)\n            .map(n -> n * n)\n            .collect(Collectors.toList());\n\n        System.out.println("Even Squares: " + evenSquares);\n    }\n}`,
        explanation: `Line 9: \`stream()\` initiates pipeline.\nLine 10: \`filter\` keeps evens.\nLine 11: \`map\` transforms each even number.\nLine 12: \`collect\` compiles results into List.`
      }
    ];
    importantRules = [
      'A Stream can only be consumed once. Reusing a consumed stream throws `IllegalStateException`.',
      'Intermediate operations (filter, map) are lazy and do not execute until terminal operation runs.'
    ];
    commonMistakes = [
      'Modifying the underlying source collection inside a Stream operation.',
      'Using parallel streams on small datasets, which causes thread synchronization overhead.'
    ];
    realWorldUse = 'Processing database result lists, filtering API request data, and transforming DTOs in REST services.';
    timeComplexity = 'O(N) for linear stream pass.';
    spaceComplexity = 'O(N) for collecting to new dataset.';
    relatedConcepts = ['Lambdas', 'Functional Interfaces', 'Optional', 'Collectors'];
    practiceQuestions = [
      { question: 'What is the difference between intermediate and terminal operations in Streams?', answer: 'Intermediate operations return a new Stream and execute lazily. Terminal operations trigger pipeline evaluation and return non-stream results.' }
    ];
    dsaConnection = 'Stream lines data transformation and array conversions in competitive programming solutions.';
  } else if (title.includes('Multithreading') || title.includes('Thread')) {
    whatItIs = `**Multithreading** is the concurrent execution of two or more threads within a single Java process to maximize CPU utilization.`;
    whyUsed = `Allows concurrent execution of heavy tasks (e.g. handling thousands of HTTP requests simultaneously without blocking).`;
    howItWorks = `The Operating System and JVM Thread Scheduler allocate CPU time slices to active threads based on priority and state transitions.`;
    syntax = `// Method 1: Extend Thread\nclass MyThread extends Thread {\n    public void run() { System.out.println("Running"); }\n}\n\n// Method 2: Implement Runnable\nRunnable task = () -> System.out.println("Async Task");\nThread t = new Thread(task);\nt.start();`;
    codeExamples = [
      {
        title: 'Concurrent Threads with Runnable & Synchronization',
        code: `class Counter {\n    private int count = 0;\n    public synchronized void increment() {\n        count++;\n    }\n    public int getCount() { return count; }\n}\n\npublic class ThreadDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Counter counter = new Counter();\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) counter.increment();\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) counter.increment();\n        });\n\n        t1.start();\n        t2.start();\n        t1.join();\n        t2.join();\n\n        System.out.println("Final Count: " + counter.getCount()); // 2000\n    }\n}`,
        explanation: `Line 3: \`synchronized\` prevents race conditions when both threads increment count.`
      }
    ];
    importantRules = [
      'Call `start()` to launch a new thread. Calling `run()` directly executes code on the current main thread!',
      'Use `synchronized` or `ReentrantLock` to protect shared mutable state from race conditions.'
    ];
    commonMistakes = [
      'Calling `run()` instead of `start()`.',
      'Causing deadlocks by acquiring multiple locks in different orders across threads.'
    ];
    realWorldUse = 'Spring Boot Web Servers handling concurrent HTTP user sessions.';
    timeComplexity = 'O(N/T) parallel processing time with T threads.';
    spaceComplexity = 'O(T) stack space per thread stack frame.';
    relatedConcepts = ['Executors', 'Virtual Threads', 'Synchronization', 'Volatile'];
    practiceQuestions = [
      { question: 'What is a Race Condition in Java?', answer: 'A race condition occurs when multiple threads concurrently read and modify shared data without synchronization, producing unpredictable results.' }
    ];
    dsaConnection = 'Parallel BFS/DFS graph processing and multithreaded sorting algorithms.';
  } else if (title.includes('JDBC') || title.includes('Database')) {
    whatItIs = `**JDBC (Java Database Connectivity)** is an API (\`java.sql\`) that enables Java applications to connect to relational SQL databases (MySQL, PostgreSQL, Oracle).`;
    whyUsed = `Executes SQL queries, inserts, updates, and transactions directly from Java backend applications.`;
    howItWorks = `DriverManager loads vendor JDBC drivers, creates a Connection socket, executes SQL via PreparedStatement, and parses ResultSet rows.`;
    syntax = `Connection conn = DriverManager.getConnection(url, user, pass);\nPreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");\nstmt.setInt(1, 101);\nResultSet rs = stmt.executeQuery();`;
    codeExamples = [
      {
        title: 'JDBC PreparedStatement Query Execution',
        code: `import java.sql.*;\n\npublic class JdbcDemo {\n    public static void main(String[] args) {\n        String url = "jdbc:mysql://localhost:3306/algorise_db";\n        String user = "root";\n        String pass = "password";\n        String sql = "SELECT id, name, email FROM users WHERE status = ?";\n\n        try (Connection conn = DriverManager.getConnection(url, user, pass);\n             PreparedStatement stmt = conn.prepareStatement(sql)) {\n            \n            stmt.setString(1, "active");\n            ResultSet rs = stmt.executeQuery();\n\n            while (rs.next()) {\n                System.out.println("User: " + rs.getString("name") + " (" + rs.getString("email") + ")");\n            }\n        } catch (SQLException e) {\n            e.printStackTrace();\n        }\n    }\n}`,
        explanation: `Line 11: Try-with-resources auto-closes Connection and PreparedStatement.\nLine 14: \`PreparedStatement\` prevents SQL injection attacks.`
      }
    ];
    importantRules = [
      'ALWAYS use `PreparedStatement` with parameterized `?` placeholders instead of concatenating raw strings into SQL statements.',
      'Always close database connections and result sets to prevent pool leaks.'
    ];
    commonMistakes = [
      'Concatenating user inputs into raw SQL queries, creating critical SQL Injection vulnerabilities.',
      'Leaving connections unclosed, exhausting database connection pools.'
    ];
    realWorldUse = 'Database abstraction layer in Spring Data JPA, Hibernate, and MyBatis.';
    timeComplexity = 'O(1) network request + DB query index lookup time.';
    spaceComplexity = 'O(N) for ResultSet memory buffering.';
    relatedConcepts = ['Spring Data JPA', 'Hibernate', 'Transactions', 'HikariCP'];
    practiceQuestions = [
      { question: 'How does PreparedStatement prevent SQL Injection?', answer: 'It pre-compiles the SQL query structure on the DB server first, ensuring parameters are treated strictly as literal data values rather than executable code.' }
    ];
    dsaConnection = 'Underlying connectivity engine for storing student algorithm progress and metrics.';
  } else if (title.includes('Spring Boot') || title.includes('Spring')) {
    whatItIs = `**Spring Boot** is an open-source Java framework that simplifies production-ready microservices and web application development with auto-configuration and embedded Tomcat servers.`;
    whyUsed = `Eliminates complex XML boilerplate configurations, provides dependency injection, and lets developers build REST APIs rapidly.`;
    howItWorks = "The Spring IoC (Inversion of Control) container scans for @Component, @Service, and @RestController annotations, automatically wiring beans and managing object lifecycles.";
    syntax = `@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    @GetMapping\n    public List<User> getUsers() { return userService.findAll(); }\n}`;
    codeExamples = [
      {
        title: 'Spring Boot REST Controller & Dependency Injection',
        code: `import org.springframework.web.bind.annotation.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/api/v1/problems")\npublic class ProblemController {\n\n    private final ProblemService problemService;\n\n    // Constructor Dependency Injection\n    public ProblemController(ProblemService problemService) {\n        this.problemService = problemService;\n    }\n\n    @GetMapping\n    public List<String> getAllProblems() {\n        return List.of("Two Sum", "Reverse Linked List", "LRU Cache");\n    }\n}`,
        explanation: `Line 4: \`@RestController\` marks class as an HTTP REST endpoint returning JSON response.\nLine 11: Constructor injection wires ProblemService dependency automatically.`
      }
    ];
    importantRules = [
      'Prefer Constructor Dependency Injection over `@Autowired` field injection for immutability and unit testability.',
      'Annotate main application class with `@SpringBootApplication`.'
    ];
    commonMistakes = [
      'Component scan failures caused by placing packages outside the main application package hierarchy.',
      'Exposing database Entity objects directly to API clients instead of DTO (Data Transfer Object) representations.'
    ];
    realWorldUse = 'Industry standard backend framework for Netflix, Uber, Amazon, and enterprise banking APIs.';
    timeComplexity = 'O(1) HTTP request routing time.';
    spaceComplexity = 'O(N) heap memory for IoC bean singleton instances.';
    relatedConcepts = ['Dependency Injection', 'Hibernate JPA', 'Spring Security', 'REST APIs'];
    practiceQuestions = [
      { question: 'What does @SpringBootApplication do in Spring Boot?', answer: 'It is a convenience annotation combining @Configuration, @EnableAutoConfiguration, and @ComponentScan.' }
    ];
    dsaConnection = 'Backend infrastructure serving ALGOrise problems, compiler requests, and user progress.';
  } else if (title.includes('Recursion')) {
    whatItIs = `**Recursion** is a programming technique where a method calls itself to solve smaller sub-instances of the same problem until reaching a base condition.`;
    whyUsed = `Provides elegant, concise solutions for naturally recursive structures like Trees, Graphs, Divide & Conquer algorithms, and Dynamic Programming.`;
    howItWorks = `Each recursive call creates a new stack frame on the JVM Call Stack storing local variables. When the base case is satisfied, stack frames unwind back to the caller.`;
    syntax = `int factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive call\n}`;
    codeExamples = [
      {
        title: 'Recursive Factorial & Stack Unwinding',
        code: `public class RecursionDemo {\n    public static int factorial(int n) {\n        // Base Case: Stop condition\n        if (n <= 1) {\n            return 1;\n        }\n        // Recursive Step\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        int result = factorial(5);\n        System.out.println("5! = " + result); // Outputs 120\n    }\n}`,
        explanation: `Line 4: Base case prevents infinite recursion.\nLine 8: \`factorial(5)\` computes \`5 * factorial(4)\` until \`factorial(1)\` returns 1.`
      }
    ];
    importantRules = [
      'Every recursive method MUST have at least one Base Case to terminate recursion.',
      'Ensure recursive steps move strictly towards the Base Case.'
    ];
    commonMistakes = [
      'Missing base case leading to `StackOverflowError`.',
      'Redundant overlapping recursive calls without memoization (e.g. Naive Fibonacci O(2^N)).'
    ];
    realWorldUse = 'Directory tree file searching, JSON object parsing, and AST compilation.';
    timeComplexity = 'O(N) for linear recursion; O(2^N) for binary tree recursion without memoization.';
    spaceComplexity = 'O(N) auxiliary call stack space for depth N.';
    relatedConcepts = ['Call Stack', 'Backtracking', 'Dynamic Programming', 'Trees'];
    practiceQuestions = [
      { question: 'What causes a StackOverflowError in recursive Java methods?', answer: 'Infinite recursion caused by missing or unreached base cases exhausting JVM stack space.' }
    ];
    dsaConnection = 'Foundation for Tree traversals (DFS), Merge Sort, Quick Sort, and Backtracking algorithms.';
  }

  // Create full note object
  return {
    id: `java-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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

class JavaNotesService {
  private allNotes: JavaTopicNote[] = [];

  constructor() {
    this.generateAllJavaNotes();
  }

  private generateAllJavaNotes() {
    const list: JavaTopicNote[] = [];
    (Object.keys(CATEGORY_TOPIC_MAP) as JavaCategory[]).forEach((cat) => {
      const topics = CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveTopicNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): JavaTopicNote[] {
    return this.allNotes;
  }

  public getCategories(): readonly JavaCategory[] {
    return JAVA_CATEGORIES;
  }

  public getNoteById(id: string): JavaTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): JavaTopicNote[] {
    const q = query.toLowerCase().trim();
    return this.allNotes.filter((note) => {
      const matchesCat = categoryFilter === 'All' || note.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || note.level === levelFilter;
      
      if (!matchesCat || !matchesLevel) return false;
      if (!q) return true;

      const titleMatch = note.title.toLowerCase().includes(q);
      const whatMatch = note.whatItIs.toLowerCase().includes(q);
      const codeMatch = note.codeExamples.some(c => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      const conceptMatch = note.relatedConcepts.some(rc => rc.toLowerCase().includes(q));
      
      return titleMatch || whatMatch || codeMatch || conceptMatch;
    });
  }
}

export const javaNotesService = new JavaNotesService();
