export type CSharpLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface CSharpTopicNote {
  id: string;
  title: string;
  category: string;
  level: CSharpLevel;
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

export const CSHARP_CATEGORIES = [
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
] as const;

export type CSharpCategory = typeof CSHARP_CATEGORIES[number];

export const CSHARP_CATEGORY_TOPIC_MAP: Record<CSharpCategory, string[]> = {
  'Introduction to C# & .NET': ['Introduction to C#', '.NET CLR, CTS, and CLI Environment'],
  'Variables and Data Types': ['Variables, Constants & Value Types vs Reference Types', 'Nullable Types'],
  'Operators & Expressions': ['Operators and Null-Coalescing (??, ??)'],
  'Input and Output': ['Console I/O and String Interpolation ($)'],
  'Conditional Statements': ['If, Else, and Pattern Matching Switch'],
  'Loops & Iteration': ['For, Foreach, While, and Do-While Loops'],
  'Methods & Parameters': ['Methods, Ref, Out, and Optional Parameters'],
  'Arrays & Collections': ['Arrays, List<T>, Dictionary<TKey, TValue>, HashSet<T>, Stack<T>, Queue<T>'],
  'Strings & StringBuilder': ['Strings and StringBuilder Performance'],
  'Object-Oriented Programming': ['OOP Pillars in C#'],
  'Classes and Structs': ['Classes, Structs, and Records (C# 9+)'],
  'Inheritance & Interfaces': ['Inheritance and Interfaces'],
  'Polymorphism & Abstraction': ['Virtual, Override, Abstract, and Sealed'],
  'Properties & Indexers': ['Auto-Properties and Indexers'],
  'LINQ (Language Integrated Query)': ['LINQ Queries and Method Syntax (Select, Where, OrderBy, GroupBy)'],
  'Generics': ['Generics and Generic Constraints (where T : class)'],
  'Exception Handling': ['Try, Catch, Finally, and Custom Exceptions'],
  'Delegates & Events': ['Delegates, Func<T>, Action<T>, and Events'],
  'Async & Await (Task-based)': ['Async, Await, Task, and Task.WhenAll'],
  'File I/O & Streams': ['File, FileStream, and StreamReader/Writer'],
  'Memory Management & Garbage Collection': ['Garbage Collection (Generations 0, 1, 2) and IDisposable'],
  'C# for DSA': ['List<T>, Dictionary, HashSet, PriorityQueue<TElement, TPriority> in DSA'],
  'ASP.NET Core Basics': ['ASP.NET Core Web API Controllers & Dependency Injection'],
  'Entity Framework Core': ['EF Core DbContext & LINQ Queries'],
  'C# Projects': ['Task Tracker CLI App', 'REST API Service']
};

function buildComprehensiveCSharpNote(category: CSharpCategory, title: string): CSharpTopicNote {
  let level: CSharpLevel = 'Beginner';
  if (
    category.includes('LINQ') ||
    category.includes('Generics') ||
    category.includes('Delegates') ||
    category.includes('Async') ||
    category.includes('Memory') ||
    category.includes('ASP.NET') ||
    category.includes('Entity')
  ) {
    level = 'Intermediate';
  }
  if (category.includes('DSA') || category.includes('Projects') || title.includes('CLR') || title.includes('IDisposable')) {
    level = 'Advanced';
  }

  return {
    id: `csharp-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    category,
    level,
    whatItIs: `**${title}** is a core component of C# and the .NET ecosystem, providing strongly-typed, modern object-oriented programming capabilities.`,
    whyUsed: `Enables enterprise-grade application development, high-performance web APIs with ASP.NET Core, cross-platform apps, and efficient algorithmic problem solving.`,
    howItWorks: `Executes on the .NET Common Language Runtime (CLR) with Just-In-Time (JIT) compilation and automatic memory garbage collection.`,
    syntax: `// ${title} C# Syntax\nusing System;\n\nnamespace AlgoriseNotes {\n    class Program {\n        static void Main(string[] args) {\n            // ${title} implementation\n            Console.WriteLine("C# ${title}");\n        }\n    }\n}`,
    codeExamples: [
      {
        title: `${title} Example`,
        code: `using System;\nusing System.Collections.Generic;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Demonstrating ${title} in C# .NET 8");\n    }\n}`,
        explanation: "Line 1: Includes System namespace for core runtime functions.\nLine 4: Main entry point of the executable C# application."
      }
    ],
    importantRules: [
      'C# is strictly type-safe; variables must be declared with explicit types or implicit `var`.',
      'Value types live on the Stack; Reference types live on the Heap managed by Garbage Collection.'
    ],
    commonMistakes: [
      'Modifying a collection while iterating over it using `foreach`.',
      'Forgetting to implement `IDisposable` or `using` statement for unmanaged file handles or DbContext.'
    ],
    realWorldUse: `Enterprise backend services, WPF/MAUI desktop apps, Unity game development, and high-performance Web APIs.`,
    timeComplexity: 'O(1) to O(N log N) depending on algorithm or collection lookup.',
    spaceComplexity: 'O(1) auxiliary to O(N) heap allocations.',
    relatedConcepts: ['.NET CLR', 'Generics', 'LINQ', 'Memory Management'],
    practiceQuestions: [
      { question: `What is the role of ${title} in C#?`, answer: `It provides structured, type-safe execution within the .NET CLR environment.` }
    ],
    dsaConnection: `Provides built-in collection data structures like List<T>, Dictionary<TKey, TValue>, HashSet<T>, and PriorityQueue<TElement, TPriority> for DSA problem solving.`
  };
}

class CSharpNotesService {
  private allNotes: CSharpTopicNote[] = [];

  constructor() {
    this.generateAllNotes();
  }

  private generateAllNotes() {
    const list: CSharpTopicNote[] = [];
    (Object.keys(CSHARP_CATEGORY_TOPIC_MAP) as CSharpCategory[]).forEach((cat) => {
      const topics = CSHARP_CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveCSharpNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): CSharpTopicNote[] {
    return this.allNotes;
  }

  public getNoteById(id: string): CSharpTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): CSharpTopicNote[] {
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

export const csharpNotesService = new CSharpNotesService();
