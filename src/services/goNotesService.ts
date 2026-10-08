export type GoLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippetExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface GoTopicNote {
  id: string;
  title: string;
  category: string;
  level: GoLevel;
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

export const GO_CATEGORIES = [
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
] as const;

export type GoCategory = typeof GO_CATEGORIES[number];

export const GO_CATEGORY_TOPIC_MAP: Record<GoCategory, string[]> = {
  'Introduction to Go (Golang)': ['Introduction to Go', 'Go Toolchain & Compilation (go run, go build)'],
  'Go Program Structure & Packages': ['Packages, Main Function, and Imports'],
  'Variables and Constants': ['Short Variable Declaration (:=) vs var', 'Constants and iota'],
  'Basic Data Types': ['Primitive Data Types (int, float64, string, bool, byte, rune)'],
  'Operators & Control Flow': ['If, Else, and Switch Statements'],
  'Loops (For & Range)': ['For Loop and Range Iteration over Slices and Maps'],
  'Functions & Multiple Return Values': ['Functions, Named Return Values, and Variadic Parameters'],
  'Pointers in Go': ['Pointers (*T and &x) and Memory Addresses'],
  'Arrays and Slices': ['Arrays vs Slices, make(), append(), and slice capacity'],
  'Maps (Hash Tables)': ['Maps (map[K]V), Lookups, and deleting keys'],
  'Structs & Methods': ['Structs, Field Embedding, and Method Receivers (Value vs Pointer)'],
  'Interfaces & Polymorphism': ['Implicit Interfaces and Empty Interface (interface{})'],
  'Goroutines & Concurrency': ['Goroutines (go func()) and Lightweight Threads'],
  'Channels & Select': ['Unbuffered & Buffered Channels, Select Statement'],
  'Sync Package (Mutex & WaitGroup)': ['sync.WaitGroup and sync.Mutex for Race Prevention'],
  'Error Handling (error interface & defer)': ['Error Handling Pattern (if err != nil) and Defer'],
  'Panic and Recover': ['Panic, Recover, and Stack Tracing'],
  'File I/O & OS Package': ['Reading & Writing Files with os and io/ioutil'],
  'JSON Handling (Marshal & Unmarshal)': ['json.Marshal and json.Unmarshal with Struct Tags'],
  'Go Modules & Dependency Management': ['Go Modules (go.mod & go.sum)'],
  'Go for DSA': ['Slices, Maps, Heaps (container/heap), and Custom Structs in DSA'],
  'HTTP Web Servers & Net/HTTP': ['Building HTTP Servers with net/http'],
  'Gin Web Framework': ['Gin Web Framework REST Endpoints'],
  'Go Projects': ['Concurrent Web Crawler', 'REST API Microservice']
};

function buildComprehensiveGoNote(category: GoCategory, title: string): GoTopicNote {
  let level: GoLevel = 'Beginner';
  if (
    category.includes('Goroutines') ||
    category.includes('Channels') ||
    category.includes('Sync') ||
    category.includes('Interfaces') ||
    category.includes('Gin') ||
    category.includes('HTTP')
  ) {
    level = 'Intermediate';
  }
  if (category.includes('DSA') || category.includes('Projects') || title.includes('Panic') || title.includes('Heap')) {
    level = 'Advanced';
  }

  return {
    id: `go-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    category,
    level,
    whatItIs: `**${title}** is a core language construct in Go (Golang), known for simplicity, fast compilation, and high-performance concurrency.`,
    whyUsed: `Go provides lightning-fast execution speed, minimal memory overhead, native concurrency with goroutines, and clean syntax without complex inheritance hierarchies.`,
    howItWorks: `Compiled directly to static native machine code without virtual machines, featuring a lightweight runtime scheduler and concurrent garbage collector.`,
    syntax: `// ${title} Go Syntax\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // ${title} implementation\n    fmt.Println("Go ${title}")\n}`,
    codeExamples: [
      {
        title: `${title} Example`,
        code: `package main\n\nimport (\n    "fmt"\n)\n\nfunc main() {\n    fmt.Println("Demonstrating ${title} in Go")\n}`,
        explanation: "Line 1: package main defines the standalone executable module.\nLine 7: main() function serves as the application entry point."
      }
    ],
    importantRules: [
      'Go uses implicit interfaces; a struct implements an interface automatically by implementing its methods.',
      'Unused variables or imports cause a compile-time error in Go.'
    ],
    commonMistakes: [
      'Accessing a nil map without initializing it using `make(map[K]V)`.',
      'Forgetting to pass pointer receivers when modifying struct fields in methods.'
    ],
    realWorldUse: `Cloud-native services (Docker, Kubernetes), high-concurrency microservices, CLI tools, and network proxies.`,
    timeComplexity: 'O(1) to O(N log N) depending on data structure lookup or goroutine synchronization.',
    spaceComplexity: 'O(1) auxiliary to O(N) memory allocations.',
    relatedConcepts: ['Goroutines', 'Channels', 'Slices', 'Implicit Interfaces'],
    practiceQuestions: [
      { question: `Why is ${title} useful in Go development?`, answer: `It enables concise, safe, and performant code execution with native concurrency.` }
    ],
    dsaConnection: `Go slices and maps provide high-efficiency array and hash map implementations for competitive programming and DSA.`
  };
}

class GoNotesService {
  private allNotes: GoTopicNote[] = [];

  constructor() {
    this.generateAllNotes();
  }

  private generateAllNotes() {
    const list: GoTopicNote[] = [];
    (Object.keys(GO_CATEGORY_TOPIC_MAP) as GoCategory[]).forEach((cat) => {
      const topics = GO_CATEGORY_TOPIC_MAP[cat];
      topics.forEach((t) => {
        list.push(buildComprehensiveGoNote(cat, t));
      });
    });
    this.allNotes = list;
  }

  public getAllNotes(): GoTopicNote[] {
    return this.allNotes;
  }

  public getNoteById(id: string): GoTopicNote | undefined {
    return this.allNotes.find((n) => n.id === id);
  }

  public searchNotes(query: string, categoryFilter: string = 'All', levelFilter: string = 'All'): GoTopicNote[] {
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

export const goNotesService = new GoNotesService();
