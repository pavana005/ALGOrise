import { technicalQuestionsData } from './interview/technicalQuestions';
import { hrQuestionsData } from './interview/hrQuestions';
import { behavioralQuestionsData } from './interview/behavioralQuestions';
import { managerialQuestionsData } from './interview/managerialQuestions';
import { systemDesignQuestionsData } from './interview/systemDesignQuestions';
import { codingQuestionsData } from './interview/codingQuestions';
import { resumeQuestionsData } from './interview/resumeQuestions';
import { salaryQuestionsData } from './interview/salaryQuestions';

export type ProgressionLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type InterviewRoundType =
  | 'Technical'
  | 'HR'
  | 'Managerial'
  | 'System Design'
  | 'Coding'
  | 'Resume'
  | 'Behavioral'
  | 'Salary'
  | 'Skills';

export type TargetRole =
  | 'All Roles'
  | 'Software Developer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'AI/ML Engineer'
  | 'Cybersecurity Engineer'
  | 'Cloud Engineer'
  | 'DevOps Engineer'
  | 'QA Engineer'
  | 'Mobile Developer';

export interface FollowUpQuestion {
  question: string;
  answer: string;
}

export interface StarFramework {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface LevelInfo {
  id: ProgressionLevel;
  title: string;
  subtitle: string;
  description: string;
  targetRole: string;
  badgeVariant: 'green' | 'blue' | 'purple';
  topicsCovered: string[];
}

export const progressionLevels: LevelInfo[] = [
  {
    id: 'Beginner',
    title: 'Beginner Level',
    subtitle: 'Core Fundamentals & Essential Concepts',
    description: 'Master basic data structures, core programming concepts, fundamental networking, OOP principles, DBMS basics, and entry-level HR questions.',
    targetRole: 'Entry-Level / Junior Developer',
    badgeVariant: 'green',
    topicsCovered: ['Arrays & Linked Lists', 'OOP Primitives', 'SQL & Joins', 'HTTP & OS Basics', 'HR Foundations']
  },
  {
    id: 'Intermediate',
    title: 'Intermediate Level',
    subtitle: 'Algorithms, Design & Practical Systems',
    description: 'Deepen knowledge in algorithms, SOLID principles, database transactions & indexes, OS concurrency, web architecture, and STAR behavioral questions.',
    targetRole: 'Mid-Level Software Engineer',
    badgeVariant: 'blue',
    topicsCovered: ['Trees & Graphs', 'SOLID & Patterns', 'ACID & Indexing', 'OS Deadlocks & Virtual Memory', 'STAR Behavioral']
  },
  {
    id: 'Advanced',
    title: 'Advanced Level',
    subtitle: 'System Design, Architecture & Complex Topics',
    description: 'Tackle complex dynamic programming, distributed systems design, high-throughput caching, concurrency, cloud orchestration, and AI models.',
    targetRole: 'Senior Engineer / Tech Lead',
    badgeVariant: 'purple',
    topicsCovered: ['Dynamic Programming', 'Distributed Systems', 'Database Sharding', 'Micro-Frontends & Cloud Mesh', 'Transformers & System Design']
  }
];

export interface CodingProblemDetails {
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  hints: string[];
  pattern: string;
  expectedComplexity: { time: string; space: string };
  starterCode: Record<string, string>;
  testCases: { input: string; output: string }[];
  solutionCode: Record<string, string>;
}

export interface SystemDesignDetails {
  scale: string;
  architectureOverview: string;
  keyComponents: string[];
  dataModel: string;
  tradeoffs: string[];
}

export interface SalaryScript {
  context: string;
  scriptText: string;
  keyTactics: string[];
}

export interface InterviewQuestion {
  id: string;
  round: InterviewRoundType;
  level: ProgressionLevel;
  category: string;
  subcategory?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard' | 'Common / Behavioral';
  question: string;
  thinkFirstPrompt?: string;
  answer: string;
  explanation?: string;

  // Evaluation & Structure breakdown
  whatInterviewerEvaluates?: string[];
  answerStructure?: string[];
  whatToAvoid?: string[];
  exampleAnswer?: string;
  starFramework?: StarFramework;
  codeSnippet?: string;

  // Round-specific metadata
  codingProblemDetails?: CodingProblemDetails;
  systemDesignDetails?: SystemDesignDetails;
  salaryScript?: SalaryScript;

  keyTakeaways?: string[];
  relatedConcepts?: string[];
  relatedQuestionIds?: string[];
  followUps?: FollowUpQuestion[];
  targetRole?: TargetRole;
  verified?: boolean;
  estimatedTimeMinutes?: number;
  status?: 'active' | 'draft' | 'disabled';
}

export const roundDefinitions: {
  id: InterviewRoundType;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
}[] = [
  {
    id: 'Technical',
    title: 'Technical Round',
    subtitle: 'Core Knowledge & Engineering Fundamentals',
    description: 'Master CS concepts, OOP, DBMS, OS, Networks, Web Dev, Cloud, Security, and APIs.',
    iconName: 'BrainCircuit',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'Coding',
    title: 'Coding Round',
    subtitle: 'Algorithms & Problem Solving',
    description: 'Hands-on DSA challenges: Arrays, DP, Graphs, Trees, Two Pointers, and Binary Search.',
    iconName: 'Code2',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'HR',
    title: 'HR Round',
    subtitle: 'Behavioral, Personality & Work Culture',
    description: 'Self-intro, career goals, strengths, weakness, communication, and team fit.',
    iconName: 'UserCheck',
    color: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)'
  },
  {
    id: 'Managerial',
    title: 'Managerial Round',
    subtitle: 'Leadership, Ownership & Decision Making',
    description: 'Conflict resolution, prioritization, handling pressure, deadlines, and mentoring.',
    iconName: 'ShieldCheck',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'System Design',
    title: 'System Design Round',
    subtitle: 'Scalable Architecture & Infrastructure',
    description: 'Build URL Shorteners, Chat Apps, Rate Limiters, Payment Systems, and Caching Layers.',
    iconName: 'Layers',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.15)'
  },
  {
    id: 'Resume',
    title: 'Resume / Project Round',
    subtitle: 'Explaining What You Actually Built',
    description: 'Deep dive into your projects, tech choices, architecture, challenges, and lessons.',
    iconName: 'FileText',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 'Behavioral',
    title: 'Behavioral / Situational Round',
    subtitle: 'Structured STAR Framework Practice',
    description: 'Practice real workplace scenarios using Situation, Task, Action, and Result.',
    iconName: 'Target',
    color: '#6366f1',
    badgeBg: 'rgba(99, 102, 241, 0.15)'
  },
  {
    id: 'Salary',
    title: 'Salary & Offer Round',
    subtitle: 'Negotiation, Compensation & Offer Evaluation',
    description: 'Base pay, equity, bonuses, offer comparison, timing, and professional counter scripts.',
    iconName: 'DollarSign',
    color: '#14b8a6',
    badgeBg: 'rgba(20, 184, 166, 0.15)'
  },
  {
    id: 'Skills',
    title: 'Interviewer Communication Skills',
    subtitle: 'Handling Interviewers & Unknown Questions',
    description: '6-step recovery guide when you do not know the answer, red flags, and questions to ask.',
    iconName: 'Sparkles',
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)'
  }
];

export const targetRolesList: TargetRole[] = [
  'All Roles',
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cybersecurity Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'QA Engineer',
  'Mobile Developer'
];

export const interviewCategories = [
  'All',
  'DSA & Algorithms',
  'Programming Languages',
  'Object-Oriented Programming (OOP)',
  'DBMS & SQL',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Software Engineering & SDLC',
  'AI/ML & Data Science',
  'System Design & Architecture',
  'Cloud Computing & DevOps',
  'Cybersecurity & Web Security',
  'Git & Version Control',
  'APIs & Microservices'
];

export const codingCategories = [
  'All Coding Topics',
  'Arrays',
  'Strings',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Trees',
  'Graphs',
  'Heap',
  'Binary Search',
  'Greedy',
  'Backtracking',
  'Dynamic Programming',
  'Bit Manipulation',
  'Recursion'
];

export const hrCategories = [
  'All HR Categories',
  'Self Introduction',
  'Strengths and Weaknesses',
  'Career Goals',
  'Education',
  'Teamwork',
  'Leadership',
  'Communication',
  'Conflict Management',
  'Problem Solving',
  'Time Management',
  'Pressure and Stress',
  'Failure and Mistakes',
  'Achievements',
  'Projects',
  'Internship',
  'Company and Role',
  'Motivation',
  'Adaptability',
  'Workplace Situations',
  'Ethics',
  'Remote Work',
  'Relocation'
];

export const managerialCategories = [
  'All Managerial Topics',
  'Leadership & Ownership',
  'Delegation & Prioritization',
  'Conflict & Disagreement',
  'Deadlines & Pressure',
  'Production Incidents',
  'Stakeholder Management',
  'Mentoring & Growth',
  'Ambiguous Requirements'
];

export const systemDesignTopics = [
  'All Design Topics',
  'URL Shortener',
  'Chat Application',
  'Notification System',
  'Rate Limiter',
  'File Storage',
  'News Feed',
  'Payment System',
  'Video Streaming',
  'Search System',
  'Logging System',
  'Ride Sharing',
  'Recommendation System'
];

export const salaryCategories = [
  'All Negotiation Topics',
  'Understanding Compensation',
  'Expected Salary Scripts',
  'Low Offer Counter Scripts',
  'Multiple Offers Strategy',
  'Evaluating Total Package',
  'Negotiating Benefits & Equity',
  'Fresher Negotiation Guide',
  'Declining & Accepting Offers'
];

export const interviewerQuestionsToAskData = [
  {
    category: 'Role & Responsibilities',
    question: 'What does success look like for someone in this role in the first 90 days?',
    whyUseful: 'Demonstrates results orientation and helps you understand immediate team expectations.'
  },
  {
    category: 'Team & Engineering Culture',
    question: 'How does the team handle technical debt and production code reviews?',
    whyUseful: 'Reveals true engineering quality standards and whether technical debt is systematically addressed.'
  },
  {
    category: 'Manager & Leadership',
    question: 'How do you support team members when a release deadline is at risk or an incident occurs?',
    whyUseful: 'Shows managerial empathy, accountability, and team crisis management style.'
  },
  {
    category: 'Growth & Mentorship',
    question: 'What opportunities are provided for engineers to take ownership of system design decisions?',
    whyUseful: 'Shows ambition for career progression and evaluates autonomy given to engineers.'
  }
];

export const interviewRedFlagsData = [
  {
    title: 'Unclear Role & Shifting Responsibilities',
    signal: 'Interviewer cannot describe daily duties or changes requirements mid-interview.',
    recommendation: 'Ask clarifying questions about specific team objectives and key deliverables before accepting.'
  },
  {
    title: 'High Pressure Offer Timelines ("Exploding Offers")',
    signal: 'Demand to sign within 24-48 hours without adequate time to evaluate total compensation.',
    recommendation: 'Politely request reasonable extension time (e.g. 5 business days) to review details thoroughly.'
  },
  {
    title: 'Dismissive Attitude Toward Work-Life Balance or Incidents',
    signal: 'Interviewer boasts about routine 80-hour workweeks or chaotic midnight deployments.',
    recommendation: 'Investigate team on-call rotas and incident response policies.'
  },
  {
    title: 'Reluctance to Allow You to Ask Questions',
    signal: 'Interview ends abruptly without giving you 5-10 minutes to ask about the team or culture.',
    recommendation: 'Follow up via email with 2 thoughtful questions to assess team communication responsiveness.'
  }
];

export const unknownQuestionGuideSteps = [
  {
    step: 1,
    title: 'Don\'t Panic',
    action: 'Take a deep breath. Interviewers want to see how you reason under uncertainty, not just memorize answers.'
  },
  {
    step: 2,
    title: 'Clarify the Question',
    action: 'Repeat your understanding of the question to confirm expectations: "Just to clarify, are we looking for a client-side or server-side approach?"'
  },
  {
    step: 3,
    title: 'State What You Do Know',
    action: 'Anchor on related core principles: "I haven\'t used framework X specifically, but I am very familiar with the underlying virtual DOM / event-loop concept..."'
  },
  {
    step: 4,
    title: 'Explain Your Reasoning',
    action: 'Walk the interviewer through your logical thought process step-by-step out loud.'
  },
  {
    step: 5,
    title: 'Identify What You\'re Unsure About',
    action: 'Be honest about edge cases or gaps: "I am uncertain about how the cache invalidation triggers across instances..."'
  },
  {
    step: 6,
    title: 'Describe How You Would Find Out',
    action: 'Conclude with practical problem solving: "In a real scenario, I would inspect the API telemetry logs and read the RFC specification."'
  }
];

const baseInterviewQuestions: InterviewQuestion[] = [
  // ==========================================
  // 1. TECHNICAL ROUND QUESTIONS
  // ==========================================
  {
    id: 'tech-oop-solid',
    round: 'Technical',
    level: 'Intermediate',
    category: 'Object-Oriented Programming (OOP)',
    subcategory: 'SOLID Principles',
    difficulty: 'Intermediate',
    targetRole: 'Software Developer',
    question: 'Explain the SOLID principles in Object-Oriented Design with practical examples.',
    thinkFirstPrompt: 'Recall what each letter stands for: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    answer: 'SOLID stands for:\n1. Single Responsibility Principle (SRP): A class should have only one reason to change.\n2. Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.\n4. Interface Segregation Principle (ISP): Clients should not be forced to depend on interfaces they do not use.\n5. Dependency Inversion Principle (DIP): High-level modules should depend on abstractions, not concrete implementations.',
    explanation: 'Following SOLID results in codebases that are maintainable, testable, and adaptable to changing business requirements.',
    whatInterviewerEvaluates: [
      'Clear understanding of object-oriented design trade-offs',
      'Ability to explain real refactoring scenarios',
      'Knowledge of interface segregation vs monolithic classes'
    ],
    answerStructure: [
      'Define SOLID acronym quickly',
      'Deep-dive into 2 core principles (SRP and Dependency Inversion)',
      'Provide a short refactoring code snippet'
    ],
    codeSnippet: `// Dependency Inversion Principle Example
interface MessageNotifier {
  send(message: string): void;
}

class EmailNotifier implements MessageNotifier {
  send(message: string) { console.log("Email sent: " + message); }
}

class UserService {
  constructor(private notifier: MessageNotifier) {} // High-level depends on abstraction
  registerUser(email: string) {
    this.notifier.send("Welcome!");
  }
}`,
    keyTakeaways: ['DIP enables easy dependency injection for unit testing.', 'OCP prevents breaking existing working code.'],
    relatedConcepts: ['Design Patterns', 'Refactoring', 'Unit Testing'],
    followUps: [
      {
        question: 'How does Dependency Inversion differ from Dependency Injection?',
        answer: 'Dependency Inversion is the high-level architectural principle (depend on abstractions), while Dependency Injection is the practical design pattern/technique used to pass dependencies into objects.'
      }
    ],
    verified: true,
    status: 'active'
  },
  {
    id: 'tech-dbms-acid',
    round: 'Technical',
    level: 'Intermediate',
    category: 'DBMS & SQL',
    subcategory: 'Transactions',
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    question: 'What are ACID properties in database management systems, and why are they critical?',
    thinkFirstPrompt: 'Think about bank transfer operations: money deducted from Account A must reliably reach Account B.',
    answer: 'ACID guarantees database transaction reliability:\n- Atomicity: All operations in a transaction succeed or all fail (all-or-nothing).\n- Consistency: Transactions transition the database from one valid state to another, obeying all constraints.\n- Isolation: Concurrent transactions execute without interfering with each other (controlled by isolation levels).\n- Durability: Once committed, changes survive system crashes or power failures.',
    whatInterviewerEvaluates: ['Understanding of database reliability', 'Knowledge of concurrency control & isolation levels', 'Practical transaction handling skills'],
    answerStructure: ['Define ACID', 'Explain bank transfer analogy for Atomicity & Isolation', 'Discuss Isolation levels (Read Committed, Repeatable Read, Serializable)'],
    keyTakeaways: ['Atomicity uses write-ahead logging (WAL) for rollbacks.', 'Higher isolation levels reduce concurrency throughput.'],
    followUps: [
      {
        question: 'What is a phantom read, and which isolation level prevents it?',
        answer: 'A phantom read occurs when a transaction re-runs a query returning rows that were newly inserted by another committed transaction. The Serializable isolation level prevents phantom reads.'
      }
    ],
    verified: true,
    status: 'active'
  },
  {
    id: 'tech-os-process-thread',
    round: 'Technical',
    level: 'Beginner',
    category: 'Operating Systems',
    subcategory: 'Concurrency',
    difficulty: 'Beginner',
    targetRole: 'Software Developer',
    question: 'What is the difference between a Process and a Thread?',
    thinkFirstPrompt: 'Consider memory allocation, context switching overhead, and isolation.',
    answer: 'A Process is an independent program in execution with its own virtual address space, file descriptors, and environment. A Thread is the smallest unit of execution within a process, sharing memory (heap, code segment) with other threads of the same process.\n\nKey Differences:\n1. Memory: Processes have isolated memory; threads share heap memory.\n2. Overhead: Context switching between processes is heavy; thread switching is lightweight.\n3. Crash Impact: If a process crashes, it doesn\'t crash other processes; an unhandled thread exception can crash the entire host process.',
    whatInterviewerEvaluates: ['Fundamental system concepts', 'Understanding memory isolation vs shared memory concurrency'],
    answerStructure: ['Direct contrast of process vs thread', 'Memory breakdown (Heap vs Stack)', 'Context switching performance comparison'],
    keyTakeaways: ['Threads have individual stack memory but shared heap.', 'Inter-process communication (IPC) requires pipes/sockets.'],
    verified: true,
    status: 'active'
  },
  {
    id: 'tech-cn-tcp-udp',
    round: 'Technical',
    level: 'Beginner',
    category: 'Computer Networks',
    subcategory: 'Transport Layer',
    difficulty: 'Beginner',
    targetRole: 'Backend Developer',
    question: 'Compare TCP and UDP protocols. When would you choose one over the other?',
    thinkFirstPrompt: 'Think about reliability vs speed: Web browsing vs live video streaming.',
    answer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, and guarantees in-order packet delivery using a 3-way handshake (SYN, SYN-ACK, ACK), flow control, and retransmission.\nUDP (User Datagram Protocol) is connectionless, lightweight, and unordered without delivery guarantees.\n\nUse TCP for web HTTP/HTTPS, file transfer (FTP), and database connections where zero data loss is required.\nUse UDP for video streaming, online gaming, and VoIP where low latency is critical and minor packet loss is acceptable.',
    whatInterviewerEvaluates: ['Network layer understanding', 'Real-world protocol selection criteria'],
    keyTakeaways: ['TCP uses congestion windowing.', 'UDP header size is 8 bytes vs TCP 20-60 bytes.'],
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 2. CODING ROUND QUESTIONS
  // ==========================================
  {
    id: 'coding-two-sum',
    round: 'Coding',
    level: 'Beginner',
    category: 'Arrays',
    subcategory: 'Hashing',
    difficulty: 'Easy',
    targetRole: 'Software Developer',
    question: 'Two Sum: Find indices of the two numbers in an array that add up to a target.',
    thinkFirstPrompt: 'How can a Hash Map trade O(N) space for O(N) time complexity?',
    answer: 'Iterate through the array while maintaining a Hash Map of { complementValue: index }. For each element `num`, check if `target - num` exists in the map. If yes, return current index and mapped index.',
    codingProblemDetails: {
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exact one valid answer exists'],
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' }
      ],
      hints: ['Instead of checking all pairs with O(N^2) brute force, store elements you\'ve seen in a hash map.'],
      pattern: 'Hash Map Lookup',
      expectedComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  return [];\n};'
      },
      testCases: [
        { input: '[2,7,11,15], 9', output: '[0,1]' },
        { input: '[3,2,4], 6', output: '[1,2]' }
      ],
      solutionCode: {
        javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}'
      }
    },
    whatInterviewerEvaluates: ['Space vs Time complexity trade-off', 'Hash map proficiency', 'Edge case handling'],
    verified: true,
    status: 'active'
  },
  {
    id: 'coding-valid-parentheses',
    round: 'Coding',
    level: 'Beginner',
    category: 'Stack',
    subcategory: 'Strings',
    difficulty: 'Easy',
    targetRole: 'Software Developer',
    question: 'Valid Parentheses: Determine if an input string containing (), {}, [] is valid.',
    thinkFirstPrompt: 'Which data structure enforces Last-In-First-Out matching of brackets?',
    answer: 'Use a Stack. Push open brackets onto the stack. When encountering a closing bracket, pop from the stack and verify that it matches the corresponding opening bracket type. The string is valid if the stack is empty at the end.',
    codingProblemDetails: {
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
      examples: [
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
      ],
      hints: ['Every closing bracket must match the most recently opened bracket.'],
      pattern: 'Stack Matching',
      expectedComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        javascript: 'function isValid(s) {\n  // Write code here\n  return false;\n};'
      },
      testCases: [
        { input: '"()[]{}"', output: 'true' },
        { input: '"(]"', output: 'false' }
      ],
      solutionCode: {
        javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (let char of s) {\n    if (char === "(" || char === "{" || char === "[") {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}'
      }
    },
    verified: true,
    status: 'active'
  },
  {
    id: 'coding-max-subarray',
    round: 'Coding',
    level: 'Intermediate',
    category: 'Dynamic Programming',
    subcategory: 'Arrays',
    difficulty: 'Medium',
    targetRole: 'Software Developer',
    question: 'Maximum Subarray (Kadane\'s Algorithm): Find contiguous subarray with largest sum.',
    thinkFirstPrompt: 'Should you extend the current subarray sum or start fresh at current element?',
    answer: 'Kadane\'s Algorithm maintains a running current sum `maxEndingHere = max(num, maxEndingHere + num)` and tracks the overall `maxSoFar`. Returns `maxSoFar` in O(N) time.',
    codingProblemDetails: {
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
      examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }],
      hints: ['If current subarray sum becomes negative, starting a new subarray at next index is always better.'],
      pattern: 'Kadane\'s Algorithm / DP',
      expectedComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: { javascript: 'function maxSubArray(nums) {\n  return 0;\n};' },
      testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' }],
      solutionCode: {
        javascript: 'function maxSubArray(nums) {\n  let currentSum = nums[0];\n  let maxSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}'
      }
    },
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 3. HR ROUND QUESTIONS
  // ==========================================
  {
    id: 'hr-self-intro',
    round: 'HR',
    level: 'Beginner',
    category: 'Self Introduction',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'Tell me about yourself and your computer science educational background.',
    thinkFirstPrompt: 'Structure your response in 3 steps: Present (current status), Past (key academic project/skills), Future (enthusiasm for this role).',
    answer: 'Use a structured 90-second elevator pitch:\n- Present: State your degree, graduation status, and primary tech stack.\n- Past: Highlight 1-2 major academic or personal projects where you demonstrated coding ability.\n- Future: Express why you are passionate about joining this company as a software developer.',
    whatInterviewerEvaluates: [
      'Communication clarity and brevity',
      'Alignment of your technical background with job requirements',
      'Enthusiasm and self-confidence'
    ],
    answerStructure: [
      'Present (30s): Education, current tech stack focus',
      'Past (40s): 1 signature full-stack project or internship result',
      'Future (20s): Passion for this specific position and company mission'
    ],
    whatToAvoid: [
      'Reciting your resume line-by-line chronologically',
      'Sharing personal details unrelated to professional growth',
      'Speaking for over 3 minutes without pausing'
    ],
    exampleAnswer: 'I am a final-year Computer Science student specializing in Web Development and Systems. Recently, I built a real-time collaborative code editor using TypeScript and WebSockets, which served 500+ student peer reviews. I am excited about joining your engineering team because of your focus on scalable developer tools.',
    starFramework: {
      situation: 'I am a recent CS graduate passionate about building web applications and learning algorithms.',
      task: 'I wanted to gain practical coding experience beyond classroom lectures.',
      action: 'I built a full-stack algorithm learning platform using React, TypeScript, and Node.js.',
      result: 'The project helped me master frontend state management and API integration, preparing me for a junior software engineer role.'
    },
    followUps: [
      {
        question: 'What is the most interesting technical challenge you encountered during your CS degree?',
        answer: 'Implementing a custom memory allocator in C during OS class, which taught me how fragmentation and pointer arithmetic work at low levels.'
      }
    ],
    verified: true,
    status: 'active'
  },
  {
    id: 'hr-strengths-weaknesses',
    round: 'HR',
    level: 'Beginner',
    category: 'Strengths and Weaknesses',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'What is your greatest technical strength and your biggest area for professional growth?',
    thinkFirstPrompt: 'Choose an authentic technical strength and a genuine growth area with active steps you take to improve.',
    answer: 'For your strength, pick an authentic skill backed by evidence (e.g., systematic root-cause debugging). For your area for growth, choose a real non-fatal weakness (e.g., public speaking anxiety during tech demos) and explain your active remediation steps.',
    whatInterviewerEvaluates: ['Self-awareness and humility', 'Growth mindset', 'Honesty vs canned clichés'],
    answerStructure: [
      'State strength + short concrete example',
      'State real weakness + active action steps taken to improve'
    ],
    whatToAvoid: [
      'Fake weaknesses like "I work too hard" or "I am a perfectionist"',
      'Fatal flaws like "I dislike writing tests" or "I get angry under pressure"'
    ],
    exampleAnswer: 'My greatest strength is systematic debugging—I break down obscure errors using telemetry and stack traces rather than guessing. My growth area used to be public speaking. To overcome this, I joined Toastmasters and started presenting technical sprint demos weekly.',
    verified: true,
    status: 'active'
  },
  {
    id: 'hr-why-this-company',
    round: 'HR',
    level: 'Beginner',
    category: 'Company and Role',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'Why do you want to work at our company specifically?',
    thinkFirstPrompt: 'Connect your personal values and engineering interests with the company\'s products, technical architecture, or culture.',
    answer: 'Demonstrate specific research about the company\'s product stack, recent blog posts, or engineering challenges, and align them with your technical growth goals.',
    whatInterviewerEvaluates: ['Company research and genuine interest', 'Value alignment', 'Long-term intent'],
    whatToAvoid: ['Generic answers that apply to any tech company ("You pay well and have nice offices")'],
    exampleAnswer: 'I read your engineering blog post on migrating your microservices to Go. Having worked on backend services in Node and Go, I was inspired by your approach to reducing latency by 40%. I want to work with a team that prioritizes engineering rigor at scale.',
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 4. MANAGERIAL ROUND QUESTIONS
  // ==========================================
  {
    id: 'mgr-conflict-resolution',
    round: 'Managerial',
    level: 'Intermediate',
    category: 'Conflict & Disagreement',
    difficulty: 'Intermediate',
    targetRole: 'Software Developer',
    question: 'Tell me about a time you had a strong technical disagreement with a teammate or senior engineer. How did you resolve it?',
    thinkFirstPrompt: 'Focus on objective data, benchmarks, trade-offs, and putting project outcome above personal ego.',
    answer: 'Use the STAR method:\n- Situation: Describe the technical dispute (e.g., REST vs GraphQL for a mobile API).\n- Task: Need to reach consensus without delaying sprint milestones.\n- Action: Proposal of objective benchmarking and prototype spike.\n- Result: Data-driven decision accepted by the team.',
    whatInterviewerEvaluates: [
      'Professional maturity & emotional intelligence',
      'Ability to disagree and commit',
      'Use of data & benchmarks to resolve tech disputes'
    ],
    answerStructure: [
      'Contextualize the technical conflict briefly',
      'Explain how you depersonalized the debate using data/prototypes',
      'Describe the final outcome and how team unity was preserved'
    ],
    whatToAvoid: [
      'Bad-mouthing former colleagues',
      'Claiming you were 100% right and the other person was stupid'
    ],
    exampleAnswer: 'During a backend redesign, my teammate wanted to adopt MongoDB while I advocated for PostgreSQL. I suggested building a 1-day benchmark test measuring query throughput for our relational schema. The data showed PostgreSQL handled our multi-join transactions 3x faster, so we mutually agreed on PostgreSQL.',
    verified: true,
    status: 'active'
  },
  {
    id: 'mgr-deadline-pressure',
    round: 'Managerial',
    level: 'Intermediate',
    category: 'Deadlines & Pressure',
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    question: 'How do you handle a scenario where a critical feature deadline is approaching, but unexpected technical scope was uncovered?',
    thinkFirstPrompt: 'Prioritize transparent stakeholder communication, scope negotiation, and quality control.',
    answer: '1. Assess remaining scope vs timeline.\n2. Communicate immediately with tech leads and product managers.\n3. Propose MVP scope reduction (cut nice-to-haves) rather than sacrificing test quality or working burnout hours.',
    whatInterviewerEvaluates: ['Priority management', 'Risk escalation transparency', 'Uncompromising commitment to code quality'],
    whatToAvoid: ['Silently working midnight shifts without telling anyone until launch fails'],
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 5. SYSTEM DESIGN ROUND QUESTIONS
  // ==========================================
  {
    id: 'sys-url-shortener',
    round: 'System Design',
    level: 'Intermediate',
    category: 'URL Shortener',
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    question: 'Design a scalable URL Shortening service like TinyURL.',
    thinkFirstPrompt: 'Calculate read:write ratio (e.g. 100:1 read-heavy), unique key generation (Base62 encoding), caching strategy (Redis), and database choice.',
    answer: 'System Design Steps:\n1. Requirements: Functional (Shorten long URL, Redirect short URL), Non-Functional (High availability, <50ms redirect latency, 100M URLs/day).\n2. Estimation: 100M URLs/day = ~1160 writes/sec, 100:1 read ratio = 116k reads/sec.\n3. Key Generation: Base62 encoding of auto-increment ID or Distributed Key Generation Service (KGS).\n4. Architecture: Load Balancer -> API Gateway -> Shortener Service -> Redis Cache -> NoSQL/SQL DB.\n5. Cache: Cache top 20% hot URLs in Redis with LRU eviction.',
    systemDesignDetails: {
      scale: '100 Million URLs per day (1,160 writes/sec, 116,000 reads/sec)',
      architectureOverview: 'Client -> CDN/LB -> API Servers -> Redis Cluster -> Key Generation Service (KGS) -> Cassandra/PostgreSQL Database',
      keyComponents: [
        'Base62 Encoding Engine (a-z, A-Z, 0-9)',
        'Pre-generated Key Service (KGS) to eliminate DB lock contention',
        'Redis Cache for hot short URLs (LRU eviction)',
        'Database Sharding by short key hash'
      ],
      dataModel: 'Table URL_Mapping { short_key VARCHAR(7) PK, original_url TEXT, created_at TIMESTAMP, expires_at TIMESTAMP }',
      tradeoffs: [
        'KGS pre-allocation avoids runtime collision but requires redundant KGS instances for fault tolerance.',
        'NoSQL (Cassandra) scales reads effortlessly over SQL, but SQL provides strict ACID if billing is attached.'
      ]
    },
    whatInterviewerEvaluates: [
      'Capacity estimation (QPS, Storage)',
      'Understanding Base62 vs Hashing MD5/SHA256',
      'Caching strategy for read-heavy workloads'
    ],
    verified: true,
    status: 'active'
  },
  {
    id: 'sys-rate-limiter',
    round: 'System Design',
    level: 'Advanced',
    category: 'Rate Limiter',
    difficulty: 'Advanced',
    targetRole: 'Backend Developer',
    question: 'Design an API Rate Limiter to prevent abuse (e.g. 100 requests per minute per IP).',
    thinkFirstPrompt: 'Compare algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter.',
    answer: 'Rate Limiter Architecture:\n1. Placement: API Gateway middleware level.\n2. Algorithm Choice: Sliding Window Counter using Redis Sorted Sets or Atomic Influx counters.\n3. Storage: Redis key `rate:user_id:minute` with TTL.\n4. Headers: Return `X-RateLimit-Remaining`, `X-RateLimit-Limit`, and `Retry-After`.',
    systemDesignDetails: {
      scale: '10,000 requests per second with sub-5ms overhead',
      architectureOverview: 'API Gateway Middleware -> Redis Cluster (Atomic Lua scripts)',
      keyComponents: ['Token Bucket Algorithm', 'Redis Distributed In-Memory Key Store', 'HTTP 429 Too Many Requests response handler'],
      dataModel: 'Redis Hash: `ratelimit:{client_ip}` -> { tokens: 95, last_updated: 1690000000 }',
      tradeoffs: ['Sliding window log is exact but memory heavy; Sliding window counter uses tiny memory with 99.9% accuracy.']
    },
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 6. RESUME / PROJECT ROUND QUESTIONS
  // ==========================================
  {
    id: 'res-project-architecture',
    round: 'Resume',
    level: 'Intermediate',
    category: 'Project Explanation',
    difficulty: 'Intermediate',
    targetRole: 'Software Developer',
    question: 'Walk me through the architecture of the most complex project listed on your resume.',
    thinkFirstPrompt: 'Structure: Problem statement -> High-level stack -> Your specific technical contribution -> Trade-offs faced.',
    answer: 'Break down your project into 4 clear parts:\n1. Goal: What problem did this application solve?\n2. Stack: Frontend framework, Backend API, Database, Hosting.\n3. Your Contribution: Explicitly highlight what modules YOU built vs team members.\n4. Challenges: A major bottleneck or bug you fixed.',
    whatInterviewerEvaluates: [
      'Clarity in explaining technical choices',
      'Honesty about personal contribution vs group work',
      'Depth of understanding of project internals'
    ],
    answerStructure: [
      'High-level summary (30s)',
      'Diagram breakdown in prose (Frontend -> API -> DB)',
      'Specific technical challenge overcome (e.g. WebSocket connection drop handling)'
    ],
    whatToAvoid: ['Saying "We built it" for everything without specifying your personal role.'],
    exampleAnswer: 'I built an online collaborative code editor. The architecture uses React on the frontend, Node.js with Socket.io on the backend, and Docker containers to execute user code isolatedly. My main contribution was writing the WebSocket sync manager to handle concurrent edits without code collisions.',
    verified: true,
    status: 'active'
  },
  {
    id: 'res-tech-choices',
    round: 'Resume',
    level: 'Intermediate',
    category: 'Technology Choices',
    difficulty: 'Intermediate',
    targetRole: 'Full Stack Developer',
    question: 'Why did you choose React and PostgreSQL for your main project instead of alternatives?',
    thinkFirstPrompt: 'Justify technical stack selection based on requirements, data relationships, and developer velocity rather than hype.',
    answer: 'Explain trade-offs:\n- PostgreSQL: Chosen over MongoDB because the project required relational integrity between Users, Subscriptions, and Transactions with strict foreign key constraints.\n- React: Chosen for component reusability and fast state synchronization for rich UI interactions.',
    whatInterviewerEvaluates: ['Pragmatic engineering decision making vs tech hype chasing'],
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 7. BEHAVIORAL / SITUATIONAL ROUND
  // ==========================================
  {
    id: 'beh-star-failure',
    round: 'Behavioral',
    level: 'Intermediate',
    category: 'Failure and Mistakes',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'Describe a situation where a code deployment broke or failed in production. How did you respond?',
    thinkFirstPrompt: 'Use STAR: Situation, Task, Action (Immediate rollback + root cause post-mortem), Result.',
    answer: 'Apply the STAR Framework:\n- Situation: After pushing a release, users experienced 500 server errors on login.\n- Task: Restore service immediately and minimize downtime.\n- Action: I triggered an immediate automated CI/CD rollback to the previous stable release commit, then analyzed server logs to identify a missing environment variable migration.\n- Result: Service was restored in 4 minutes. I created a automated pre-deploy check script to ensure environment variables are validated.',
    starFramework: {
      situation: 'A production release contained a missing database migration environment variable, causing login failures for 5% of traffic.',
      task: 'Restore service latency and stability within SLA targets without losing user session state.',
      action: 'I immediately initiated a roll-back to the prior green deployment build, inspected telemetry logs, identified the un-migrated schema column, and wrote an integration test enforcing schema migration validation in CI.',
      result: 'Downtime was limited to under 4 minutes, and zero data loss occurred. The added CI check prevented 2 subsequent deployment regressions.'
    },
    whatInterviewerEvaluates: ['Calmness under pressure', 'Blameless post-mortem culture', 'Preventative process creation'],
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 8. SALARY & NEGOTIATION ROUND
  // ==========================================
  {
    id: 'sal-expected-salary',
    round: 'Salary',
    level: 'Beginner',
    category: 'Expected Salary Scripts',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'What are your salary expectations for this role?',
    thinkFirstPrompt: 'Avoid anchoring yourself too low prematurely. Focus on total compensation and market research.',
    answer: 'Strategy:\n1. Express enthusiasm for the role.\n2. Pivot to total compensation range based on market research.\n3. Request to understand company benchmark ranges for the position first.',
    salaryScript: {
      context: 'When asked about expected salary during early HR screening.',
      scriptText: '"I am primarily focused on finding the right role and team fit where I can make a high impact. Based on my research on current market standards for software engineers in this location, I understand the range is around $110,000 - $130,000. However, I am open to discussing a competitive total package including base salary, bonus, and equity once we agree on mutual fit."',
      keyTactics: [
        'Avoid giving a single rigid low number',
        'Reference market research data points',
        'Emphasize total compensation (Base + Equity + Benefits)'
      ]
    },
    whatInterviewerEvaluates: ['Professional confidence', 'Market awareness', 'Negotiation poise'],
    verified: true,
    status: 'active'
  },
  {
    id: 'sal-low-offer-counter',
    round: 'Salary',
    level: 'Intermediate',
    category: 'Low Offer Counter Scripts',
    difficulty: 'Intermediate',
    targetRole: 'Software Developer',
    question: 'How do you respond professionally to a salary offer that is below your expectations?',
    thinkFirstPrompt: 'Express gratitude, reiterate excitement, state specific value, and propose a data-backed counter offer.',
    answer: 'Step-by-step Counter Strategy:\n1. Express genuine excitement for the offer.\n2. Politeness & Gratitude: Thank the recruiter.\n3. Counter proposal: Present your researched range citing specific skills/experience.\n4. Flexibility: Mention signing bonus or review timeline if base budget is firm.',
    salaryScript: {
      context: 'Responding to an offer that is 10-15% below market expectation.',
      scriptText: '"Thank you so much for extending this offer! I am thrilled about the prospect of joining the team. Given my experience in full-stack architecture and backend optimization, I was hoping for a base salary closer to $125,000. If we can reach that figure, or supplement with a joining bonus, I would be ready to sign immediately."',
      keyTactics: ['Show clear willingness to close when target is met', 'Offer alternative leverage points like joining bonus']
    },
    verified: true,
    status: 'active'
  },

  // ==========================================
  // 9. INTERVIEWER SKILLS & "WHEN YOU DON'T KNOW"
  // ==========================================
  {
    id: 'skl-dont-know-response',
    round: 'Skills',
    level: 'Beginner',
    category: 'When You Don\'t Know',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'How to answer effectively when an interviewer asks a technical question you don\'t know?',
    thinkFirstPrompt: 'Never guess blindly or pretend to know. Walk through your thought process and 6-step framework.',
    answer: 'Follow the 6-Step Honest Recovery Framework:\n1. Don\'t Panic: Stay calm.\n2. Clarify: Confirm boundaries of the question.\n3. State What You Know: Anchor on known fundamentals.\n4. Reasoning: Explain your logical deduction process out loud.\n5. Highlight Uncertainty: Point out what you are unsure about.\n6. How to Find Out: Mention practical documentation or logging techniques.',
    exampleAnswer: '"I haven\'t used gRPC in production directly, but I am familiar with HTTP/2 protocol multiplexing and Protocol Buffers data serialization. If I were designing a microservice with gRPC today, I would start by reading the proto3 schema specs and inspecting latency benchmarks against REST."',
    whatInterviewerEvaluates: ['Authenticity & integrity', 'Problem-solving methodology under ambiguity'],
    verified: true,
    status: 'active'
  },
  {
    id: 'skl-questions-to-ask',
    round: 'Skills',
    level: 'Beginner',
    category: 'Interviewer Questions',
    difficulty: 'Common / Behavioral',
    targetRole: 'Software Developer',
    question: 'What are the best questions to ask the interviewer at the end of an interview?',
    thinkFirstPrompt: 'Ask questions that reveal real engineering practices, team culture, and management style.',
    answer: 'Ask high-signal questions:\n1. "What does success look like in the first 90 days for this role?"\n2. "How does the engineering team balance building new features versus addressing technical debt?"\n3. "Can you walk me through how a recent production incident was handled on the team?"',
    keyTakeaways: ['Shows active engagement and critical thinking about everyday work environment.'],
    verified: true,
    status: 'active'
  }
];

export const interviewQuestionsData: InterviewQuestion[] = [
  ...baseInterviewQuestions,
  ...technicalQuestionsData,
  ...hrQuestionsData,
  ...behavioralQuestionsData,
  ...managerialQuestionsData,
  ...systemDesignQuestionsData,
  ...codingQuestionsData,
  ...resumeQuestionsData,
  ...salaryQuestionsData
];
