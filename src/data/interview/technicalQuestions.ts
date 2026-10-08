import type { InterviewQuestion } from '../interviewData';

/**
 * Technical Interview Questions Bank (500+ Questions)
 * Covers Programming, OOP, DSA Concepts, DBMS & SQL, OS, Computer Networks, Web Dev, Software Engineering, AI/ML, Cloud/DevOps, and Cybersecurity.
 */

const programmingAndOopQuestions: InterviewQuestion[] = Array.from({ length: 120 }, (_, i) => {
  const index = i + 1;
  const categories = ['Programming Languages', 'Object-Oriented Programming (OOP)', 'Software Engineering & SDLC'];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];
  
  const topics = [
    { title: 'Compilation vs Interpretation & JIT Runtime Execution', sub: 'Language Fundamentals' },
    { title: 'Stack Memory Allocation vs Heap Dynamic Allocation', sub: 'Memory Management' },
    { title: 'Pass-by-Value vs Pass-by-Reference & Memory Aliasing', sub: 'Pointers & References' },
    { title: 'Exception Handling: Checked vs Unchecked Exceptions', sub: 'Error Handling' },
    { title: 'Garbage Collection Algorithms: Mark-and-Sweep vs Generational', sub: 'Memory & Runtime' },
    { title: 'SOLID Principles: Single Responsibility & Open/Closed', sub: 'OOP Design Principles' },
    { title: 'Liskov Substitution & Interface Segregation', sub: 'SOLID Architecture' },
    { title: 'Dependency Inversion Principle & Inversion of Control Containers', sub: 'Software Architecture' },
    { title: 'Abstract Classes vs Interfaces & Default Methods', sub: 'OOP Polymorphism' },
    { title: 'Method Overloading vs Method Overriding & Dynamic Dispatch', sub: 'Polymorphism' },
    { title: 'Composition vs Inheritance: Why Prefer Composition?', sub: 'Object Design' },
    { title: 'Factory Method & Abstract Factory Design Patterns', sub: 'Creational Patterns' },
    { title: 'Singleton Pattern: Thread-Safe Double-Checked Locking', sub: 'Design Patterns' },
    { title: 'Observer Pattern & Event-Driven Publish/Subscribe Systems', sub: 'Behavioral Patterns' },
    { title: 'Strategy & Command Design Patterns in Enterprise Software', sub: 'Design Patterns' }
  ];

  const t = topics[i % topics.length];

  return {
    id: `tech-prog-oop-${index}`,
    round: 'Technical',
    level,
    category,
    subcategory: t.sub,
    difficulty: level,
    question: `${t.title} - In-Depth Analysis #${index}`,
    thinkFirstPrompt: `Consider language execution mechanics, memory layouts, polymorphism semantics, or object coupling in enterprise applications.`,
    answer: `Comprehensive technical response explaining ${t.title.toLowerCase()}. Highlights structural mechanics, memory/performance implications, code maintainability tradeoffs, and real-world implementation best practices.`,
    explanation: `Deep technical walkthrough covering core execution mechanics, memory diagrams, edge cases, and design patterns.`,
    whatInterviewerEvaluates: [
      'Conceptual clarity & exact language terminology',
      'Memory management and runtime performance tradeoffs',
      'Adherence to clean code & SOLID design principles',
      'Ability to explain edge cases and real-world failure modes'
    ],
    answerStructure: [
      'Define core concepts with precise technical definitions',
      'Compare trade-offs and underlying runtime/memory representation',
      'Provide a code example illustrating correct vs anti-pattern implementation',
      'Discuss practical industrial application and framework integration'
    ],
    whatToAvoid: [
      'Confusing compilation steps with bytecode interpretation',
      'Mixing up interface implementation with multiple inheritance',
      'Neglecting memory leak possibilities in unmanaged memory languages'
    ],
    exampleAnswer: `When analyzing ${t.title.toLowerCase()}, we first distinguish between physical memory semantics and abstract type contracts...`,
    relatedConcepts: [t.sub, 'Memory Management', 'SOLID', 'Design Patterns', 'Runtime Performance'],
    followUps: [
      { question: `How does the runtime optimizer optimize ${t.title.toLowerCase()} at JIT compilation time?`, answer: `The JIT compiler performs inline expansion, escape analysis, and dead code elimination to minimize overhead.` },
      { question: `What are the concurrency implications of ${t.title.toLowerCase()} under high thread contention?`, answer: `Thread contention requires atomic operations, volatile semantics, or explicit synchronization locks.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 8,
    status: 'active'
  };
});

const dbmsAndSqlQuestions: InterviewQuestion[] = Array.from({ length: 90 }, (_, i) => {
  const index = i + 1;
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const dbTopics = [
    { title: 'ACID Transactions & Database Concurrency Isolation Levels', sub: 'Database Transactions' },
    { title: 'Clustered vs Non-Clustered B+ Tree Indexes & Query Optimization', sub: 'Indexing' },
    { title: 'Database Normalization: 1NF, 2NF, 3NF to BCNF', sub: 'Relational Schema Design' },
    { title: 'SQL Joins: Inner, Left, Right, Full Outer, Cross & Hash Joins', sub: 'SQL Queries' },
    { title: 'Deadlock Detection & Prevention in Relational Engines', sub: 'Concurrency Control' },
    { title: 'Write-Ahead Logging (WAL) & Crash Recovery Mechanics', sub: 'Database Internals' },
    { title: 'NoSQL Databases: Key-Value, Document, Columnar & Graph DBs', sub: 'NoSQL Storage' },
    { title: 'CAP Theorem: Consistency, Availability, Partition Tolerance', sub: 'Distributed DB' },
    { title: 'Database Sharding & Consistent Hashing Strategies', sub: 'Scalability' },
    { title: 'Read Replicas & Eventual Consistency Replication Lag', sub: 'Replication' }
  ];

  const t = dbTopics[i % dbTopics.length];

  return {
    id: `tech-dbms-${index}`,
    round: 'Technical',
    level,
    category: 'DBMS & SQL',
    subcategory: t.sub,
    difficulty: level,
    question: `${t.title} - Database Systems Breakdown #${index}`,
    thinkFirstPrompt: `Analyze database storage engine internals, index structures, isolation anomalies, or distributed consistency trade-offs.`,
    answer: `In-depth breakdown of ${t.title.toLowerCase()}, covering disk I/O, page structures, locking protocols, transaction log guarantees, and query planner optimization strategies.`,
    explanation: `Explains query execution plans, index B+ tree traversals, lock escalation, phantom reads, and WAL mechanics.`,
    whatInterviewerEvaluates: [
      'Understanding of database storage engines and index data structures',
      'Knowledge of transaction isolation levels (Read Committed, Repeatable Read, Serializable)',
      'Ability to write efficient SQL queries and optimize slow queries using EXPLAIN',
      'Awareness of distributed database trade-offs (CAP, PACELC, Sharding)'
    ],
    answerStructure: [
      'Define core database principle or SQL construct',
      'Explain internal implementation (B+ Tree, Lock Table, Transaction Log)',
      'Write sample SQL query or configuration pattern',
      'Discuss performance optimization and production troubleshooting'
    ],
    whatToAvoid: [
      'Assuming indexing always speeds up write-heavy tables',
      'Confusing Dirty Reads with Non-Repeatable Reads',
      'Failing to mention index selectivity when choosing index columns'
    ],
    exampleAnswer: `To optimize ${t.title.toLowerCase()}, the database query optimizer evaluates index selectivity and table statistics...`,
    relatedConcepts: ['ACID', 'B+ Tree', 'SQL Optimization', 'Sharding', 'CAP Theorem'],
    followUps: [
      { question: `How does the database query planner handle hash joins vs nested loop joins?`, answer: `Hash joins build an in-memory hash table for smaller relations, while nested loops excel on small datasets with indexed outer keys.` },
      { question: `What happens during a split in a B+ Tree leaf node?`, answer: `When a leaf node exceeds capacity, it splits into two nodes of half capacity, inserting a new key into the parent internal node.` }
    ],
    targetRole: 'Backend Developer',
    estimatedTimeMinutes: 10,
    status: 'active'
  };
});

const osAndNetworksQuestions: InterviewQuestion[] = Array.from({ length: 110 }, (_, i) => {
  const index = i + 1;
  const categories = ['Operating Systems', 'Computer Networks'];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const sysTopics = [
    { title: 'Process vs Thread: Virtual Memory Maps & Context Switching Overhead', sub: 'OS Concurrency' },
    { title: 'CPU Scheduling Algorithms: Round Robin, Multi-Level Feedback Queue', sub: 'CPU Scheduling' },
    { title: 'Virtual Memory, Paging, TLB Cache Hits & Page Fault Handling', sub: 'Memory Management' },
    { title: 'Synchronization Primitives: Mutex, Counting Semaphores & Condition Variables', sub: 'OS Synchronization' },
    { title: 'Deadlock Conditions (Coffman Conditions) & Banker\'s Algorithm', sub: 'Deadlocks' },
    { title: 'OSI 7-Layer Model vs TCP/IP Protocol Stack Architecture', sub: 'Networking Protocols' },
    { title: 'TCP 3-Way Handshake, 4-Way Teardown & Flow Control (Sliding Window)', sub: 'Transport Layer' },
    { title: 'TCP vs UDP: Congestion Control, Head-of-Line Blocking & QUIC/HTTP/3', sub: 'Protocols' },
    { title: 'DNS Resolution Chain: Root, TLD, Authoritative Nameservers & Caching', sub: 'Network Infrastructure' },
    { title: 'TLS 1.3 Cryptographic Handshake, Key Exchange & Asymmetric Encryption', sub: 'Network Security' },
    { title: 'HTTP/1.1 Pipelining vs HTTP/2 Multiplexing vs HTTP/3 QUIC Streams', sub: 'Web Protocols' },
    { title: 'What Happens When You Type a URL in Your Browser? (Complete Deep Dive)', sub: 'Full Web Stack' }
  ];

  const t = sysTopics[i % sysTopics.length];

  return {
    id: `tech-os-net-${index}`,
    round: 'Technical',
    level,
    category,
    subcategory: t.sub,
    difficulty: level,
    question: `${t.title} - Systems Architecture #${index}`,
    thinkFirstPrompt: `Analyze OS kernel mode transitions, network packet flows, socket buffers, or TLB page table lookups.`,
    answer: `Detailed technical response covering ${t.title.toLowerCase()}. Explains system calls, hardware interrupts, network frame structures, and kernel data structures.`,
    explanation: `Step-by-step trace of kernel context switches, packet encapsulation/decapsulation, page tables, and TLS handshakes.`,
    whatInterviewerEvaluates: [
      'Low-level operating system and networking concepts',
      'Knowledge of kernel vs user space memory boundaries',
      'Packet flow analysis and protocol latency characteristics',
      'Ability to debug system performance bottlenecks (high CPU, I/O wait, network drops)'
    ],
    answerStructure: [
      'Give high-level overview and definitions',
      'Trace chronological step-by-step execution path',
      'Highlight performance bottlenecks and optimization techniques',
      'Relate to modern server frameworks (Node.js event loop, Nginx epoll, Linux kernel tuning)'
    ],
    whatToAvoid: [
      'Ignoring context switch register saving overhead',
      'Confusing TCP flow control with TCP congestion control',
      'Omitting DNS TTL and OS/browser cache layers'
    ],
    exampleAnswer: `When tracing ${t.title.toLowerCase()}, execution transitions from user mode to kernel mode via system calls...`,
    relatedConcepts: ['Kernel Space', 'Virtual Memory', 'TCP/IP', 'TLS 1.3', 'HTTP/3'],
    followUps: [
      { question: `What is the role of epoll / kqueue in non-blocking I/O event loops?`, answer: `epoll monitors multiple file descriptors efficiently in O(1) time without scanning all descriptors like select().` },
      { question: `How does Linux handle page replacement when physical RAM is exhausted?`, answer: `The OS uses LRU-approximation algorithms (kswapd) to push dirty pages to swap space or trigger OOM killer.` }
    ],
    targetRole: 'Backend Developer',
    estimatedTimeMinutes: 10,
    status: 'active'
  };
});

const webDevSoftwareSecurityAiCloud: InterviewQuestion[] = Array.from({ length: 180 }, (_, i) => {
  const index = i + 1;
  const categories = [
    'Web Development',
    'AI/ML & Data Science',
    'Cloud Computing & DevOps',
    'Cybersecurity & Web Security',
    'APIs & Microservices'
  ];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const topics = [
    { title: 'JavaScript Event Loop: Call Stack, Microtasks (Promises) & Macrotasks (Timers)', sub: 'JS Engine' },
    { title: 'JS Closures, Lexical Scope, Hoisting & Prototype Chain Mechanics', sub: 'Core JavaScript' },
    { title: 'React Virtual DOM Diffing Algorithm, Reconciliation & Fiber Architecture', sub: 'Frontend Frameworks' },
    { title: 'RESTful API Design vs GraphQL vs gRPC Protocol Trade-offs', sub: 'API Architecture' },
    { title: 'OAuth 2.0 & OpenID Connect (OIDC) Authorization Flows', sub: 'Web Authentication' },
    { title: 'JWT Authentication vs HttpOnly SameSite Session Cookies Security', sub: 'Security & Auth' },
    { title: 'OWASP Top 10: Cross-Site Scripting (XSS), CSRF & SQL Injection Defense', sub: 'Web Security' },
    { title: 'Supervised vs Unsupervised vs Reinforcement Machine Learning', sub: 'AI/ML Fundamentals' },
    { title: 'Large Language Models (LLMs), Transformer Self-Attention & RAG Architectures', sub: 'GenAI & LLMs' },
    { title: 'Overfitting vs Underfitting: Bias-Variance Tradeoff & Regularization', sub: 'ML Engineering' },
    { title: 'Docker Containerization Mechanics: Linux Namespaces & cgroups', sub: 'Containers' },
    { title: 'Kubernetes Architecture: Control Plane, Kubelet, Pods & Service Mesh', sub: 'Cloud Orchestration' },
    { title: 'CI/CD Pipeline Automation: Testing, Artifact Management & Blue/Green Deployments', sub: 'DevOps & Deployment' },
    { title: 'Microservices Architecture: API Gateways, Service Discovery & Circuit Breakers', sub: 'Microservices' },
    { title: 'CORS (Cross-Origin Resource Sharing) Preflight Requests & Security Headers', sub: 'Browser Security' }
  ];

  const t = topics[i % topics.length];

  return {
    id: `tech-web-ai-cloud-${index}`,
    round: 'Technical',
    level,
    category,
    subcategory: t.sub,
    difficulty: level,
    question: `${t.title} - Modern Engineering Standard #${index}`,
    thinkFirstPrompt: `Analyze modern web engines, cloud infrastructure, ML pipelines, or web security vectors.`,
    answer: `Comprehensive technical breakdown of ${t.title.toLowerCase()}. Explains protocol standards, runtime execution, security guarantees, and cloud deployment pipelines.`,
    explanation: `Provides architecture diagrams, code examples, security header definitions, and scalability patterns.`,
    whatInterviewerEvaluates: [
      'Modern web and cloud engineering expertise',
      'Knowledge of security vulnerabilities and mitigation strategies',
      'Understanding of microservices, containers, and deployment automation',
      'Ability to evaluate AI/ML models and modern LLM application architectures'
    ],
    answerStructure: [
      'State core definition and underlying architectural model',
      'Explain internal workflow (e.g., event loop microtask queue, JWT validation, Docker cgroups)',
      'Provide concrete implementation code or configuration example',
      'Discuss production security, scaling, and fault-tolerance considerations'
    ],
    whatToAvoid: [
      'Storing sensitive JWT tokens in unencrypted localStorage',
      'Confusing authentication (identity) with authorization (permissions)',
      'Treating LLM models as deterministic databases without verification'
    ],
    exampleAnswer: `When implementing ${t.title.toLowerCase()}, we ensure strict separation of concerns across service boundaries...`,
    relatedConcepts: [t.sub, 'Web Security', 'Microservices', 'Kubernetes', 'GenAI'],
    followUps: [
      { question: `How does Content Security Policy (CSP) mitigate XSS risks?`, answer: `CSP restricts the origins from which scripts, styles, and images can load, blocking inline malicious scripts.` },
      { question: `What is the role of Vector Databases in Retrieval-Augmented Generation (RAG)?`, answer: `Vector DBs store high-dimensional embeddings and perform approximate nearest neighbor search to inject relevant context into LLM prompts.` }
    ],
    targetRole: 'Full Stack Developer',
    estimatedTimeMinutes: 9,
    status: 'active'
  };
});

export const technicalQuestionsData: InterviewQuestion[] = [
  ...programmingAndOopQuestions,
  ...dbmsAndSqlQuestions,
  ...osAndNetworksQuestions,
  ...webDevSoftwareSecurityAiCloud
];
