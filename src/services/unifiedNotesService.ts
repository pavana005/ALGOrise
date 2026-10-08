import { javaNotesService } from './javaNotesService';
import { javaNotesProgressService } from './javaNotesProgressService';
import { pythonNotesService } from './pythonNotesService';
import { pythonNotesProgressService } from './pythonNotesProgressService';
import { cNotesService } from './cNotesService';
import { cNotesProgressService } from './cNotesProgressService';
import { cppNotesService } from './cppNotesService';
import { cppNotesProgressService } from './cppNotesProgressService';
import { jsNotesService } from './jsNotesService';
import { jsNotesProgressService } from './jsNotesProgressService';
import { csharpNotesService } from './csharpNotesService';
import { csharpNotesProgressService } from './csharpNotesProgressService';
import { goNotesService } from './goNotesService';
import { goNotesProgressService } from './goNotesProgressService';
import { dsaNotesService } from './dsaNotesService';
import { dsaNotesProgressService } from './dsaNotesProgressService';
import type { TopicStatus, ProgressSummary } from './pythonNotesProgressService';

export type LanguageId = 'java' | 'python' | 'c' | 'cpp' | 'javascript' | 'csharp' | 'go' | 'dsa';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface UnifiedTopicNote {
  id: string;
  languageId: LanguageId;
  languageName: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
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

export interface LanguageMeta {
  id: LanguageId;
  name: string;
  badge: string;
  badgeVariant: 'orange' | 'easy' | 'blue' | 'purple' | 'amber' | 'indigo' | 'cyan';
  iconColor: string;
  description: string;
  categories: readonly string[];
}

export const LANGUAGES_META: LanguageMeta[] = [
  {
    id: 'java',
    name: 'Java',
    badge: 'OOP & Collections',
    badgeVariant: 'orange',
    iconColor: '#ED8B00',
    description: 'Complete Java roadmap covering JVM, OOP pillars, Collections framework, Multi-threading, and DSA.',
    categories: javaNotesService.getCategories()
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'Clean Code & Web/AI',
    badgeVariant: 'easy',
    iconColor: '#3776AB',
    description: 'Beginner to advanced Python covering syntax, lists/dicts, OOP, Async, Django/Flask, and DSA.',
    categories: pythonNotesService.getCategories()
  },
  {
    id: 'c',
    name: 'C',
    badge: 'Low-Level & Memory',
    badgeVariant: 'blue',
    iconColor: '#A8B9CC',
    description: 'Fundamental C programming: pointers, dynamic memory allocation (malloc/free), structs, and pointers.',
    categories: cNotesService.getCategories()
  },
  {
    id: 'cpp',
    name: 'C++',
    badge: 'STL & CP Master',
    badgeVariant: 'purple',
    iconColor: '#00599C',
    description: 'Modern C++17/20, STL containers (vector, map, set), templates, smart pointers, and competitive programming.',
    categories: cppNotesService.getCategories()
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    badge: 'Full-Stack & Web',
    badgeVariant: 'amber',
    iconColor: '#F7DF1E',
    description: 'Full JavaScript roadmap: Closures, Event Loop, DOM, Promises, Async/Await, ES6+, Node.js, and DSA.',
    categories: jsNotesService.getCategories()
  },
  {
    id: 'csharp',
    name: 'C#',
    badge: '.NET 8 & Enterprise',
    badgeVariant: 'indigo',
    iconColor: '#239120',
    description: 'C# .NET 8 mastery: LINQ, Generics, Tasks/Async, Structs, ASP.NET Core, and collections.',
    categories: [
      'Introduction to C# & .NET',
      'Variables and Data Types',
      'Operators & Expressions',
      'Input and Output',
      'Conditional Statements',
      'Loops & Iteration',
      'Methods & Parameters',
      'Arrays & Collections',
      'Strings & StringBuilder',
      'Object-Oriented Programming',
      'Classes and Structs',
      'Inheritance & Interfaces',
      'Polymorphism & Abstraction',
      'Properties & Indexers',
      'LINQ (Language Integrated Query)',
      'Generics',
      'Exception Handling',
      'Delegates & Events',
      'Async & Await (Task-based)',
      'File I/O & Streams',
      'Memory Management & Garbage Collection',
      'C# for DSA',
      'ASP.NET Core Basics',
      'Entity Framework Core',
      'C# Projects'
    ]
  },
  {
    id: 'go',
    name: 'Go',
    badge: 'Golang & Concurrency',
    badgeVariant: 'cyan',
    iconColor: '#00ADD8',
    description: 'High-concurrency Golang roadmap: Slices, Maps, Structs, Goroutines, Channels, sync package, and web servers.',
    categories: [
      'Introduction to Go (Golang)',
      'Go Program Structure & Packages',
      'Variables and Constants',
      'Basic Data Types',
      'Operators & Control Flow',
      'Loops (For & Range)',
      'Functions & Multiple Return Values',
      'Pointers in Go',
      'Arrays and Slices',
      'Maps (Hash Tables)',
      'Structs & Methods',
      'Interfaces & Polymorphism',
      'Goroutines & Concurrency',
      'Channels & Select',
      'Sync Package (Mutex & WaitGroup)',
      'Error Handling (error interface & defer)',
      'Panic and Recover',
      'File I/O & OS Package',
      'JSON Handling (Marshal & Unmarshal)',
      'Go Modules & Dependency Management',
      'Go for DSA',
      'HTTP Web Servers & Net/HTTP',
      'Gin Web Framework',
      'Go Projects'
    ]
  },
  {
    id: 'dsa',
    name: 'DSA',
    badge: 'Data Structures & Algo',
    badgeVariant: 'purple',
    iconColor: '#A855F7',
    description: 'Complete Data Structures & Algorithms textbook notes: Arrays, Hash Maps, Trees, Graphs, DP, and Tries.',
    categories: [
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
    ]
  }
];

class UnifiedNotesService {
  public getLanguages(): LanguageMeta[] {
    return LANGUAGES_META;
  }

  public getLanguageMeta(langId: LanguageId): LanguageMeta {
    return LANGUAGES_META.find((l) => l.id === langId) || LANGUAGES_META[0];
  }

  public getAllTopicsForLanguage(langId: LanguageId): UnifiedTopicNote[] {
    switch (langId) {
      case 'java':
        return javaNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'java', languageName: 'Java' }));
      case 'python':
        return pythonNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'python', languageName: 'Python' }));
      case 'c':
        return cNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'c', languageName: 'C' }));
      case 'cpp':
        return cppNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'cpp', languageName: 'C++' }));
      case 'javascript':
        return jsNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'javascript', languageName: 'JavaScript' }));
      case 'csharp':
        return csharpNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'csharp', languageName: 'C#' }));
      case 'go':
        return goNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'go', languageName: 'Go' }));
      case 'dsa':
        return dsaNotesService.getAllNotes().map((n) => ({ ...n, languageId: 'dsa', languageName: 'DSA' }));
      default:
        return [];
    }
  }

  public getTopicById(langId: LanguageId, topicId: string): UnifiedTopicNote | undefined {
    const topics = this.getAllTopicsForLanguage(langId);
    return topics.find((t) => t.id === topicId);
  }

  public getProgressStats(userId: string, langId: LanguageId): ProgressSummary {
    const totalTopics = this.getAllTopicsForLanguage(langId);
    const ids = totalTopics.map((t) => t.id);

    switch (langId) {
      case 'java':
        return javaNotesProgressService.getProgressStats(userId, ids);
      case 'python':
        return pythonNotesProgressService.getProgressStats(userId, ids);
      case 'c':
        return cNotesProgressService.getProgressStats(userId, ids);
      case 'cpp':
        return cppNotesProgressService.getProgressStats(userId, ids);
      case 'javascript':
        return jsNotesProgressService.getProgressStats(userId, ids);
      case 'csharp':
        return csharpNotesProgressService.getProgressStats(userId, ids);
      case 'go':
        return goNotesProgressService.getProgressStats(userId, ids);
      case 'dsa':
        return dsaNotesProgressService.getProgressStats(userId, ids);
      default:
        return { completedCount: 0, inProgressCount: 0, totalCount: 1, percentage: 0 };
    }
  }

  public getTopicStatus(userId: string, langId: LanguageId, topicId: string): TopicStatus {
    switch (langId) {
      case 'java':
        return javaNotesProgressService.getTopicStatus(userId, topicId);
      case 'python':
        return pythonNotesProgressService.getTopicStatus(userId, topicId);
      case 'c':
        return cNotesProgressService.getTopicStatus(userId, topicId);
      case 'cpp':
        return cppNotesProgressService.getTopicStatus(userId, topicId);
      case 'javascript':
        return jsNotesProgressService.getTopicStatus(userId, topicId);
      case 'csharp':
        return csharpNotesProgressService.getTopicStatus(userId, topicId);
      case 'go':
        return goNotesProgressService.getTopicStatus(userId, topicId);
      case 'dsa':
        return dsaNotesProgressService.getTopicStatus(userId, topicId);
      default:
        return 'not_started';
    }
  }

  public setTopicStatus(userId: string, langId: LanguageId, topicId: string, status: TopicStatus) {
    switch (langId) {
      case 'java':
        return javaNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'python':
        return pythonNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'c':
        return cNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'cpp':
        return cppNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'javascript':
        return jsNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'csharp':
        return csharpNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'go':
        return goNotesProgressService.setTopicStatus(userId, topicId, status);
      case 'dsa':
        return dsaNotesProgressService.setTopicStatus(userId, topicId, status);
    }
  }

  public toggleTopicCompleted(userId: string, langId: LanguageId, topicId: string) {
    switch (langId) {
      case 'java':
        return javaNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'python':
        return pythonNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'c':
        return cNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'cpp':
        return cppNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'javascript':
        return jsNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'csharp':
        return csharpNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'go':
        return goNotesProgressService.toggleTopicCompleted(userId, topicId);
      case 'dsa':
        return dsaNotesProgressService.toggleTopicCompleted(userId, topicId);
    }
  }

  public getLastOpenedTopic(userId: string, langId: LanguageId): string | null {
    switch (langId) {
      case 'java':
        return javaNotesProgressService.getLastOpenedTopic(userId);
      case 'python':
        return pythonNotesProgressService.getLastOpenedTopic(userId);
      case 'c':
        return cNotesProgressService.getLastOpenedTopic(userId);
      case 'cpp':
        return cppNotesProgressService.getLastOpenedTopic(userId);
      case 'javascript':
        return jsNotesProgressService.getLastOpenedTopic(userId);
      case 'csharp':
        return csharpNotesProgressService.getLastOpenedTopic(userId);
      case 'go':
        return goNotesProgressService.getLastOpenedTopic(userId);
      case 'dsa':
        return dsaNotesProgressService.getLastOpenedTopic(userId);
      default:
        return null;
    }
  }

  public setLastOpenedTopic(userId: string, langId: LanguageId, topicId: string): void {
    switch (langId) {
      case 'java':
        javaNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'python':
        pythonNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'c':
        cNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'cpp':
        cppNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'javascript':
        jsNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'csharp':
        csharpNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'go':
        goNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
      case 'dsa':
        dsaNotesProgressService.setLastOpenedTopic(userId, topicId);
        break;
    }
  }

  public globalSearch(query: string, userId: string): { note: UnifiedTopicNote; status: TopicStatus }[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: { note: UnifiedTopicNote; status: TopicStatus }[] = [];
    const allLangs: LanguageId[] = ['java', 'python', 'c', 'cpp', 'javascript', 'csharp', 'go', 'dsa'];

    allLangs.forEach((langId) => {
      const topics = this.getAllTopicsForLanguage(langId);
      topics.forEach((t) => {
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesWhat = t.whatItIs.toLowerCase().includes(q);
        const matchesConcepts = t.relatedConcepts.some((c) => c.toLowerCase().includes(q));

        if (matchesTitle || matchesCat || matchesWhat || matchesConcepts) {
          const status = this.getTopicStatus(userId, langId, t.id);
          results.push({ note: t, status });
        }
      });
    });

    return results;
  }
}

export const unifiedNotesService = new UnifiedNotesService();
