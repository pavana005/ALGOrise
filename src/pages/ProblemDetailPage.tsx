import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Code,
  ChevronLeft,
  ChevronRight,
  Terminal,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock,
  HardDrive,
  ArrowRight,
  Sparkles,
  BookOpen,
  Pause,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Layers,
  Compass
} from 'lucide-react';
import { problemsData } from '../data/problemsData';
import type { Problem } from '../data/problemsData';
import { adminContentService } from '../services/adminContentService';
import { Badge } from '../components/common/Badge';
import { triggerMotivationPopup } from '../components/common/MotivationPopup';
import type { MotivationCategory } from '../data/motivationData';
import { useProgress } from '../context/ProgressContext';
import type { TabType } from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { codeExecutionService } from '../services/codeExecutionService';
import { getProblemLearningContent } from '../services/learningContentService';
import { CodeEditor } from '../components/common/CodeEditor';

export type TestStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compilation Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Executed';

export interface CompilerResult {
  tested: boolean;
  mode: 'run' | 'submit';
  status: TestStatus;
  message: string;
  runtimeMs: number | null;
  memoryMb: number | null;
  testCasesPassed: number;
  totalTestCases: number;
  stdout?: string;
  stderr?: string;
  output?: string;
  details: {
    testNum: number;
    input: string;
    expected: string;
    actual?: string;
    status: 'Passed' | 'Failed' | 'Error';
    errorMsg?: string;
    stdout?: string;
  }[];
}

interface ProblemDetailPageProps {
  problemId?: string;
  onNavigateTab: (tab: TabType, extraId?: string) => void;
  onShowDevNotice?: (msg: string) => void;
}

export const ProblemDetailPage: React.FC<ProblemDetailPageProps> = ({
  problemId = 'two-sum',
  onNavigateTab
}) => {
  const { markProblemSolved, markProblemAttempted } = useProgress();

  const problem: Problem = useMemo(() => {
    const found = problemsData.find(p => p.id === problemId) || problemsData.find(p => p.id === problemId.replace(/-lvl[123]$/, '')) || problemsData[0];
    const override = adminContentService.getPublicProblemOverride(found.id);
    return override ? { ...found, ...override } : found;
  }, [problemId]);

  const baseId = useMemo(() => problem.id.replace(/-lvl[123]$/, ''), [problem.id]);
  const baseProb = useMemo(() => problemsData.find(p => p.id === baseId) || problem, [baseId, problem]);

  const currentIndex = useMemo(() => {
    const idx = problemsData.findIndex(p => p.id === problem.id);
    return idx !== -1 ? idx : 0;
  }, [problem.id]);

  const { preferredLanguage } = useLanguage();

  // Active Mode: ALWAYS 'learning' by default when opening any problem
  const [activeMode, setActiveMode] = useState<'learning' | 'practice'>('learning');

  // Interactive Learning Mode States
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(0);
  const [selectedClueIndex, setSelectedClueIndex] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Practice Mode state
  const [selectedLanguage, setSelectedLanguage] = useState<string>(preferredLanguage);
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>(problem.examples[0]?.input || '');
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Execution & Compiler Result State
  const [testResult, setTestResult] = useState<CompilerResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executingMode, setExecutingMode] = useState<'run' | 'submit' | null>(null);

  // User activity & context tracking refs for smart popups
  const problemOpenTimeRef = useRef<number>(Date.now());
  const consecutiveRunsRef = useRef<number>(0);
  const submitAttemptsRef = useRef<number>(0);
  const editCountRef = useRef<number>(0);

  // Learning Mode State & Progress
  const [isPlayingDryRun, setIsPlayingDryRun] = useState<boolean>(false);
  const [dryRunStep, setDryRunStep] = useState<number>(0);
  const [openThinkingQuestions, setOpenThinkingQuestions] = useState<Record<number, boolean>>({});
  const [isLearningCompleted, setIsLearningCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`algorise_learning_completed_${problemId}`) === 'true';
    } catch {
      return false;
    }
  });

  // Exactly 3 Progressive Hints (Hint 1 — Small Nudge, Hint 2 — Direction, Hint 3 — Strong Hint)
  const progressiveHints = useMemo(() => {
    const hints = problem.hints || [];
    const h1 = hints[0]
      ? hints[0].replace(/^Hint 1 \(.*?\):\s*/i, '').replace(/^Hint 1:\s*/i, '')
      : 'Analyze problem inputs and identify optimal data structures.';
    const h2 = hints[1]
      ? hints[1].replace(/^Hint 2 \(.*?\):\s*/i, '').replace(/^Hint 2:\s*/i, '')
      : 'Avoid quadratic nested loops by maintaining state invariants.';
    const h3 = hints[2]
      ? hints[2].replace(/^Hint 3 \(.*?\):\s*/i, '').replace(/^Hint 3:\s*/i, '')
      : 'Traverse data linearly in a single pass to achieve optimal runtime bounds.';

    return [
      { id: 0, label: 'Hint 1 — Small Nudge', content: h1 },
      { id: 1, label: 'Hint 2 — Direction', content: h2 },
      { id: 2, label: 'Hint 3 — Strong Hint', content: h3 }
    ];
  }, [problem]);

  // Starter code template provider (minimal function/class header skeleton ONLY)
  const getStarterCode = (lang: string, _prob: Problem) => {
    const fnName = 'solve';
    switch (lang) {
      case 'python':
        return `class Solution:\n    def ${fnName}(self, *args, **kwargs):\n        # Write your Python 3 solution for ${_prob.title} here\n        pass\n`;
      case 'javascript':
        return `/** ${_prob.title} */\nvar ${fnName} = function(...args) {\n    // Write your JavaScript solution here\n};\n`;
      case 'java':
        return `class Solution {\n    public Object ${fnName}(Object... args) {\n        // Write your Java solution for ${_prob.title} here\n        return null;\n    }\n}\n`;
      case 'cpp':
        return `class Solution {\npublic:\n    // Solution method for ${_prob.title}\n    void ${fnName}() {\n        // Write your C++ solution here\n    }\n};\n`;
      case 'c':
        return `// ${_prob.title}\nvoid ${fnName}() {\n    // Write your C solution here\n}\n`;
      case 'csharp':
        return `public class Solution {\n    public object ${fnName}(params object[] args) {\n        // Write your C# solution for ${_prob.title} here\n        return null;\n    }\n}\n`;
      case 'go':
        return `func ${fnName}() {\n    // Write your Go solution for ${_prob.title} here\n}\n`;
      default:
        return `// Write your solution for ${_prob.title} here\n`;
    }
  };

  // Sync preferred language & starter code
  useEffect(() => {
    setSelectedLanguage(preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    // Load saved code draft for this specific problem & language, or fallback to starter code
    try {
      const savedDraft = localStorage.getItem(`algorise_code_draft_${problem.id}_${selectedLanguage}`);
      if (savedDraft !== null && savedDraft !== undefined && savedDraft.trim() !== '') {
        setCode(savedDraft);
      } else {
        setCode(getStarterCode(selectedLanguage, problem));
      }
    } catch {
      setCode(getStarterCode(selectedLanguage, problem));
    }

    // Reset state & restore remembered mode (defaulting to 'learning') when problem or problem mode changes
    try {
      const savedMode = localStorage.getItem(`algorise_problem_mode_${problem.id}`);
      if (savedMode === 'practice' || savedMode === 'learning') {
        setActiveMode(savedMode);
      } else {
        setActiveMode('learning');
      }
    } catch {
      setActiveMode('learning');
    }

    setCustomInput(problem.examples[0]?.input || '');
    setOpenHints({});
    setActiveMode('learning');
    setShowSolution(false);
    setTestResult(null);
    setIsExecuting(false);
    setDryRunStep(0);
    setIsPlayingDryRun(false);
    setOpenThinkingQuestions({});
    setSelectedConceptIndex(0);
    setSelectedClueIndex(null);

    try {
      setIsLearningCompleted(localStorage.getItem(`algorise_learning_completed_${problem.id}`) === 'true');
    } catch {
      setIsLearningCompleted(false);
    }

    // Reset activity counters for this newly loaded problem
    problemOpenTimeRef.current = Date.now();
    consecutiveRunsRef.current = 0;
    submitAttemptsRef.current = 0;
    editCountRef.current = 0;

    // Detect speedrun problem browsing (e.g. visiting 3+ different problems within 75 seconds without solving)
    let isSpeedrunning = false;
    try {
      const now = Date.now();
      const historyRaw = sessionStorage.getItem('algorise_recent_problem_opens');
      const history: { id: string; time: number }[] = historyRaw ? JSON.parse(historyRaw) : [];
      const recentDistinct = history.filter(h => now - h.time < 75000 && h.id !== problem.id);
      recentDistinct.push({ id: problem.id, time: now });
      sessionStorage.setItem('algorise_recent_problem_opens', JSON.stringify(recentDistinct.slice(-10)));

      if (recentDistinct.length >= 3) {
        isSpeedrunning = true;
        triggerMotivationPopup('SPEEDRUN_BROWSING', false);
      }
    } catch {
      // Ignore
    }

    // Trigger initial pattern or topic popup when problem loads (if not speedrunning)
    const initialPopupTimer = setTimeout(() => {
      if (isSpeedrunning) return;

      const topicLower = (problem.topic || '').toLowerCase();
      const patternLower = (problem.pattern || '').toLowerCase();
      let categoryToTrigger: MotivationCategory = 'PROBLEM_BROWSING';
      if (topicLower.includes('binary search') || patternLower.includes('binary search')) categoryToTrigger = 'BINARY_SEARCH';
      else if (topicLower.includes('dynamic programming') || topicLower.includes('dp') || patternLower.includes('dynamic programming')) categoryToTrigger = 'DYNAMIC_PROGRAMMING';
      else if (topicLower.includes('sliding window') || patternLower.includes('sliding window')) categoryToTrigger = 'SLIDING_WINDOW';
      else if (topicLower.includes('two pointers') || patternLower.includes('two pointers')) categoryToTrigger = 'TWO_POINTERS';
      else if (topicLower.includes('hash') || patternLower.includes('hash') || topicLower.includes('dictionary')) categoryToTrigger = 'HASH_MAP';
      else if (topicLower.includes('stack') || patternLower.includes('stack')) categoryToTrigger = 'STACK';
      else if (topicLower.includes('queue') || patternLower.includes('queue')) categoryToTrigger = 'QUEUE';
      else if (topicLower.includes('graph') || patternLower.includes('graph')) categoryToTrigger = 'GRAPH';
      else if (topicLower.includes('tree') || patternLower.includes('tree')) categoryToTrigger = 'TREES';
      else if (topicLower.includes('sort') || patternLower.includes('sort')) categoryToTrigger = 'SORTING';
      else if (topicLower.includes('recursion') || patternLower.includes('recursion')) categoryToTrigger = 'RECURSION';
      else if (topicLower.includes('bfs') || patternLower.includes('bfs')) categoryToTrigger = 'BFS';
      else if (topicLower.includes('dfs') || patternLower.includes('dfs')) categoryToTrigger = 'DFS';

      triggerMotivationPopup(categoryToTrigger, false, { algorithm: problem.title });
    }, 3200);

    // Trigger stuck on problem timer after 50 seconds of active problem viewing
    const stuckTimer = setTimeout(() => {
      triggerMotivationPopup('STUCK_ON_PROBLEM', false, { algorithm: problem.title });
    }, 50000);

    return () => {
      clearTimeout(initialPopupTimer);
      clearTimeout(stuckTimer);
    };
  }, [problem.id, selectedLanguage, baseId, problem]);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    // Automatically update starter code when language changes
    setCode(getStarterCode(newLang, problem));
  };

  const handleLoadStarterCode = () => {
    setCode(getStarterCode(selectedLanguage, problem));
  };

  const handleModeChange = (mode: 'learning' | 'practice') => {
    setActiveMode(mode);
    if (mode === 'learning') {
      triggerMotivationPopup('LEARNING', false, { algorithm: problem.title });
    }
    try {
      localStorage.setItem(`algorise_problem_mode_${problemId}`, mode);
    } catch {
      // Ignore
    }
  };

  const toggleHint = (index: number) => {
    setOpenHints(prev => {
      const nextState = !prev[index];
      if (nextState) {
        const currentlyOpenCount = Object.values(prev).filter(Boolean).length;
        if (currentlyOpenCount >= 1) {
          triggerMotivationPopup('MANY_HINTS', false, { algorithm: problem.title });
        } else {
          triggerMotivationPopup('STUCK_ON_PROBLEM', false, { algorithm: problem.title });
        }
      }
      return { ...prev, [index]: nextState };
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalSolutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const starter = getStarterCode(selectedLanguage, problem);
    setCode(starter);
    setCustomInput(problem.examples[0]?.input || '');
    setTestResult(null);
    setIsExecuting(false);
    try {
      localStorage.removeItem(`algorise_code_draft_${problem.id}_${selectedLanguage}`);
    } catch {
      // Ignore
    }
  };

  // Real Code Execution Compiler Engine (Run & Submit)
  const executeCompiler = async (isSubmit: boolean) => {
    try {
      setIsExecuting(true);
      setExecutingMode(isSubmit ? 'submit' : 'run');
      setTestResult(null); // Clear previous result immediately upon new execution

      if (!isSubmit) {
        // RUN MODE: Execute user code with custom input (passed directly to stdin)
        consecutiveRunsRef.current += 1;
        const runRes = await codeExecutionService.runCode(selectedLanguage, code, customInput);
        
        setTestResult({
          tested: true,
          mode: 'run',
          status: runRes.status,
          message: runRes.status === 'Executed' ? 'Program Executed' : runRes.status,
          runtimeMs: runRes.runtimeMs,
          memoryMb: runRes.memoryMb,
          testCasesPassed: 0,
          totalTestCases: 0,
          stdout: runRes.stdout,
          stderr: runRes.stderr,
          output: runRes.output,
          details: []
        });

        if (runRes.status === 'Compilation Error') {
          triggerMotivationPopup('COMPILE_ERROR', true, { algorithm: problem.title });
        } else if (runRes.status === 'Runtime Error') {
          triggerMotivationPopup('RUNTIME_ERROR', true, { algorithm: problem.title });
        } else if (runRes.status === 'Time Limit Exceeded') {
          triggerMotivationPopup('TIME_LIMIT_EXCEEDED', true, { algorithm: problem.title });
        } else if (consecutiveRunsRef.current >= 4) {
          triggerMotivationPopup('REPEATED_RUNS', false, { algorithm: problem.title });
        }
      } else {
        // SUBMIT MODE: Test user code against all problem test cases
        consecutiveRunsRef.current = 0;
        const testCases = problem.examples.map(ex => ({ input: ex.input, expected: ex.output }));
        const submitRes = await codeExecutionService.submitCode(selectedLanguage, code, testCases);
        
        if (submitRes.status === 'Accepted') {
          markProblemSolved(problem.id);
          const elapsed = Date.now() - problemOpenTimeRef.current;
          if (elapsed < 45000) {
            triggerMotivationPopup('FAST_SOLVE', true, { algorithm: problem.title });
          } else {
            triggerMotivationPopup('ACCEPTED', true, { algorithm: problem.title });
          }
        } else if (submitRes.status === 'Compilation Error') {
          markProblemAttempted(problem.id);
          triggerMotivationPopup('COMPILE_ERROR', true, { algorithm: problem.title });
        } else if (submitRes.status === 'Runtime Error') {
          markProblemAttempted(problem.id);
          triggerMotivationPopup('RUNTIME_ERROR', true, { algorithm: problem.title });
        } else if (submitRes.status === 'Time Limit Exceeded') {
          markProblemAttempted(problem.id);
          triggerMotivationPopup('TIME_LIMIT_EXCEEDED', true, { algorithm: problem.title });
        } else {
          markProblemAttempted(problem.id);
          submitAttemptsRef.current += 1;
          triggerMotivationPopup('FAILED_ATTEMPTS', true, { algorithm: problem.title, attempts: submitAttemptsRef.current });
        }
        
        setTestResult({
          ...submitRes,
          mode: 'submit'
        });
      }
    } catch (err: any) {
      triggerMotivationPopup('RUNTIME_ERROR', true, { algorithm: problem.title });
      setTestResult({
        tested: true,
        mode: isSubmit ? 'submit' : 'run',
        status: 'Runtime Error',
        message: 'Runtime Error',
        runtimeMs: null,
        memoryMb: null,
        testCasesPassed: 0,
        totalTestCases: isSubmit ? problem.examples.length : 0,
        stdout: '',
        stderr: err.message || 'Execution failed',
        output: `RuntimeError: ${err.message || 'Uncaught exception during execution.'}`,
        details: isSubmit ? [{
          testNum: 1,
          input: problem.examples[0]?.input || 'N/A',
          expected: problem.examples[0]?.output || 'N/A',
          status: 'Error',
          errorMsg: `RuntimeError: ${err.message || 'Uncaught exception during execution.'}`
        }] : []
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      const prevProb = problemsData[currentIndex - 1];
      onNavigateTab('problem_detail', prevProb.id);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex < problemsData.length - 1) {
      const nextProb = problemsData[currentIndex + 1];
      onNavigateTab('problem_detail', nextProb.id);
    }
  };

  // Helper for explaining lines of canonical solution code with beginner-friendly details
  const getDetailedCanonicalLineExplanation = (line: string, index: number) => {
    const l = line.trim();
    if (!l) return null;
    if (l.startsWith('#') || l.startsWith('//') || l.startsWith('/*')) {
      return {
        simpleMeaning: 'Documentation comment line.',
        whyNeeded: 'Provides context and readability for developers.',
        variablesUsed: 'None (Comment line)',
        algorithmConnection: 'Describes algorithmic intent before code execution.'
      };
    }
    if (l.includes('def ') || l.includes('function') || (l.includes('class ') && l.includes('Solution')) || l.includes('public static')) {
      return {
        simpleMeaning: 'Defines the solution function entry point.',
        whyNeeded: 'Necessary so the execution environment and caller can pass input arguments into our algorithm.',
        variablesUsed: 'Function parameters (e.g. input array / string and target bounds)',
        algorithmConnection: 'Initializes the function signature matching problem requirements.'
      };
    }
    if (l.includes('seen') || l.includes('map') || l.includes('Set') || l.includes('unordered_map') || l.includes('HashMap') || l.includes('dict') || l.includes('{}') || l.includes('new Map')) {
      return {
        simpleMeaning: 'Creates an empty Hash Map (dictionary) data structure.',
        whyNeeded: 'Stores previously visited elements and their indices for instant lookup.',
        variablesUsed: '`seen` / `map` (Hash Table data structure)',
        algorithmConnection: 'Replaces slow O(N) linear search with instant O(1) time complexity lookup.'
      };
    }
    if (l.includes('for ') || l.includes('while ') || l.includes('.forEach')) {
      return {
        simpleMeaning: 'Loops through input array/sequence one element at a time.',
        whyNeeded: 'Iterates through data to inspect every item sequentially.',
        variablesUsed: '`i` / `idx` (Loop index counter), `num` / `char` (Current item value)',
        algorithmConnection: 'Guarantees a single O(N) linear pass over elements.'
      };
    }
    if (l.includes('target') || l.includes('diff') || l.includes('complement') || l.includes('-')) {
      return {
        simpleMeaning: 'Calculates the required matching difference (target minus current value).',
        whyNeeded: 'Identifies the exact second value needed to satisfy the mathematical constraint.',
        variablesUsed: '`complement` / `diff` (Calculated target difference value)',
        algorithmConnection: 'Transforms pair search into a single target value lookup.'
      };
    }
    if (l.includes('if ') || l.includes('in ') || l.includes('has(') || l.includes('containsKey')) {
      return {
        simpleMeaning: 'Checks if the required complement value already exists in our Hash Map.',
        whyNeeded: 'Determines if we have previously encountered the matching pair item.',
        variablesUsed: '`seen` (Hash Table) and `complement` (Key to check)',
        algorithmConnection: 'Executes O(1) decision condition to trigger immediate early return when solution is found.'
      };
    }
    if (l.includes('return [') || l.includes('return new') || l.includes('return {') || l.includes('return tuple')) {
      return {
        simpleMeaning: 'Returns the matching answer pair indices/values and terminates.',
        whyNeeded: 'Outputs the final result required by the problem specification.',
        variablesUsed: '`seen[complement]` (Stored index) and `i` (Current index)',
        algorithmConnection: 'Completes execution in optimal O(N) time without extra passes.'
      };
    }
    if (l.includes('seen[') || l.includes('.set(') || l.includes('.put(') || l.includes('.add(')) {
      return {
        simpleMeaning: 'Stores current element and its index into the Hash Map.',
        whyNeeded: 'Remembers current item so future iterations can match against it in O(1) time.',
        variablesUsed: '`seen` (Hash Map), `nums[i]` (Key), `i` (Index value)',
        algorithmConnection: 'Builds state for subsequent iterations.'
      };
    }
    if (l.includes('return')) {
      return {
        simpleMeaning: 'Returns default fallback result (e.g. empty array or false) if no solution exists.',
        whyNeeded: 'Satisfies type safety requirements and handles edge cases gracefully.',
        variablesUsed: 'Return value',
        algorithmConnection: 'Safely handles non-existent match cases.'
      };
    }
    return {
      simpleMeaning: `Executes core algorithmic operation step #${index + 1}.`,
      whyNeeded: 'Processes intermediate state computation.',
      variablesUsed: 'Local variables',
      algorithmConnection: 'Contributes to step-by-step state progression.'
    };
  };



  // Beginner-friendly line-by-line solution explainer helper
  const getDetailedLineBreakdown = (code: string, language: string, _prob: Problem) => {
    const lines = code.split('\n');
    return lines.map((lineText, idx) => {
      const trimmed = lineText.trim();
      if (!trimmed) {
        return {
          lineNum: idx + 1,
          code: lineText,
          isBlank: true,
          whatItDoes: 'Empty formatting line',
          whyNeeded: 'Keeps code clean and readable.',
          variables: ''
        };
      }
      if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          isComment: true,
          whatItDoes: 'Code comment line',
          whyNeeded: 'Provides context and documentation for developers.',
          variables: ''
        };
      }

      if (trimmed.includes('def ') || trimmed.includes('function') || trimmed.includes('class ') || trimmed.includes('func ') || trimmed.includes('public') || trimmed.includes('vector<')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: `Defines function signature in ${language.toUpperCase()} accepting input parameters.`,
          whyNeeded: 'Acts as the entry point method called during problem execution.',
          variables: 'Parameters passed into function'
        };
      }

      if (trimmed.includes('Map') || trimmed.includes('dict') || trimmed.includes('seen =') || trimmed.includes('unordered_map') || trimmed.includes('make(map') || trimmed.includes('malloc') || trimmed.includes('HashMap')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Initializes a Hash Map (dictionary) in memory.',
          whyNeeded: 'Allows instant O(1) average lookup time to check previously visited values without quadratic re-scanning.',
          variables: 'Auxiliary lookup data structure (`seen` / `map` / `mp`)'
        };
      }

      if (trimmed.includes('left') || trimmed.includes('right') || trimmed.includes('max_') || trimmed.includes('maxWater') || trimmed.includes('count =') || trimmed.includes('0,')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Initializes tracking pointers, counters, or max value variables.',
          whyNeeded: 'Establishes initial boundary conditions before loop processing starts.',
          variables: 'State pointers & tracking variables (`left`, `right`, `maxWater`, etc.)'
        };
      }

      if (trimmed.includes('for ') || trimmed.includes('while ') || trimmed.includes('enumerate') || trimmed.includes('range')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Starts iterative loop over collection elements.',
          whyNeeded: 'Traverses through input sequence element-by-element from start to end.',
          variables: 'Loop index counter & element variable (`i`, `num`, `left`, `right`)'
        };
      }

      if (trimmed.includes('diff') || trimmed.includes('complement') || trimmed.includes('target -') || trimmed.includes('water =')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Calculates expected complement or step metric value.',
          whyNeeded: 'Determines the exact value needed to satisfy target conditions at the current step.',
          variables: 'Step metric variable (`diff`, `complement`, `water`)'
        };
      }

      if (trimmed.includes('if ') || trimmed.includes('else') || trimmed.includes('map.has') || trimmed.includes('mp.count') || trimmed.includes('in seen') || trimmed.includes('containsKey')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Checks if target condition or matching key exists in memory.',
          whyNeeded: 'Decides whether to return the result or continue searching based on state.',
          variables: 'Boolean condition result'
        };
      }

      if (trimmed.includes('return ')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Returns computed answer indices or calculated result value.',
          whyNeeded: 'Finalizes execution and supplies output back to caller.',
          variables: 'Result value / indices array'
        };
      }

      if (trimmed.includes('seen[') || trimmed.includes('map.set') || trimmed.includes('mp[') || trimmed.includes('left++') || trimmed.includes('right--')) {
        return {
          lineNum: idx + 1,
          code: lineText,
          whatItDoes: 'Stores current element in Hash Map or adjusts pointer boundaries.',
          whyNeeded: 'Saves visited element for future step lookups or shrinks remaining search space.',
          variables: 'Updated map entry or shifted pointer'
        };
      }

      return {
        lineNum: idx + 1,
        code: lineText,
        whatItDoes: `Executes algorithmic operation step #${idx + 1}.`,
        whyNeeded: 'Advances step-by-step logic computation toward solving the problem.',
        variables: 'Local function scope variables'
      };
    });
  };

  const getVariableExplanations = (prob: Problem) => {
    if (prob.topic === 'Two Pointers' || prob.pattern.includes('Hash Map') || prob.id.startsWith('two-sum')) {
      return [
        { name: 'seen / map', role: 'Hash Map (dictionary) storing previously visited numbers and their corresponding 0-based array indices.' },
        { name: 'num / nums[i]', role: 'The current array element being inspected during single-pass iteration.' },
        { name: 'diff / complement', role: 'The exact required matching value needed to reach target sum (target - num).' },
        { name: 'i / index', role: 'The current array loop index counter.' }
      ];
    }
    if (prob.topic === 'Two Pointers') {
      return [
        { name: 'left', role: 'Pointer starting at array index 0 moving rightward.' },
        { name: 'right', role: 'Pointer starting at last array index moving leftward.' },
        { name: 'maxArea / curr', role: 'Tracks maximum accumulated metric across pointer positions.' }
      ];
    }
    if (prob.topic === 'Stacks & Queues') {
      return [
        { name: 'stack', role: 'Last-In-First-Out (LIFO) stack data structure storing open brackets or elements.' },
        { name: 'char', role: 'Current character token being evaluated from input string.' },
        { name: 'top', role: 'Most recently pushed element popped from the stack top for matching.' }
      ];
    }
    return [
      { name: 'input_data', role: 'The primary input array or data structure passed into the function.' },
      { name: 'result / answer', role: 'Target output value calculated and returned by the algorithm.' },
      { name: 'state / memory', role: 'Auxiliary memory structure used to track visited items and avoid redundant calculations.' }
    ];
  };

  // Problem Learning Content Provider & Dry Run Auto-Play Effect
  const learningContentData = useMemo(() => getProblemLearningContent(problem), [problem]);

  useEffect(() => {
    let interval: any = null;
    if (isPlayingDryRun && learningContentData?.exampleWalkthrough?.steps?.length) {
      interval = setInterval(() => {
        setDryRunStep(prev => {
          if (prev >= learningContentData.exampleWalkthrough.steps.length - 1) {
            setIsPlayingDryRun(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingDryRun, learningContentData]);

  const handleCompleteLearningStep = () => {
    setIsLearningCompleted(true);
    try {
      localStorage.setItem(`algorise_learning_completed_${problemId}`, 'true');
    } catch {
      // Ignore
    }
    triggerMotivationPopup('LESSON_COMPLETE', true, { algorithm: problem.title });
  };

  // Get canonical solution code in selected language
  const canonicalSolutionCode = useMemo(() => {
    return problem.codeTemplates[selectedLanguage as keyof typeof problem.codeTemplates] || problem.codeTemplates.javascript || '// Solution template';
  }, [problem, selectedLanguage]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* HEADER TOOLBAR & NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigateTab('problems')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Back to Problem List</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={problem.difficulty.toLowerCase() as any}>
              {problem.difficulty}
            </Badge>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {problem.problemNumber} — {problem.title}
            </h2>
          </div>
        </div>

        {/* COMPACT DUAL MODE SELECTOR: [ 📖 Learning Mode ] [ 💻 Practice Mode ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '3px' }}>
            <button
              type="button"
              onClick={() => handleModeChange('learning')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMode === 'learning' ? 'var(--accent-primary)' : 'transparent',
                color: activeMode === 'learning' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen style={{ width: 14, height: 14 }} />
              <span>Learning Mode</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('practice')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMode === 'practice' ? 'var(--accent-pink)' : 'transparent',
                color: activeMode === 'practice' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Code style={{ width: 14, height: 14 }} />
              <span>Practice Mode</span>
            </button>
          </div>

          {/* Prev / Next Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn btn-outline btn-sm"
              disabled={currentIndex <= 0}
              onClick={handlePrevProblem}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <ChevronLeft style={{ width: 13, height: 13 }} />
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 4px' }}>
              {currentIndex + 1}/{problemsData.length}
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={currentIndex >= problemsData.length - 1}
              onClick={handleNextProblem}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        </div>
      </div>

      {/* COMMON PROBLEM CONCEPT BANNER */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: 'var(--accent-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0
        }}>
          <Sparkles style={{ width: 18, height: 18 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-blue)' }}>
            Common Problem Concept — {baseProb.title}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {problem.commonConcept || baseProb.commonConcept || `Find values in a data structure that satisfy the ${problem.pattern} algorithm requirements.`}
          </div>
        </div>
      </div>

      {/* Progression Banner upon Problem Completion (ONLY for genuine Submit Accepted) */}
      {testResult?.mode === 'submit' && testResult?.status === 'Accepted' && (
        <div 
          style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 style={{ width: 15, height: 15, color: '#10B981' }} />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#10B981' }}>
              Problem Completed Successfully!
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: PRACTICE MODE                                                     */}
      {/* ========================================================================= */}
      {activeMode === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="practice-mode-grid">
            
            {/* LEFT COLUMN: Problem Description, Progressive Hints, Explicit Solution Reveal Control */}
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: 'calc(100vh - 190px)', overflowY: 'auto' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <Badge variant={problem.difficulty.toLowerCase() as any}>
                    {problem.difficulty}
                  </Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{problem.topic}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {problem.title}
                </h3>
              </div>

              {/* Problem Statement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                  Problem Statement:
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-line', padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  {problem.description}
                </div>
              </div>

              {/* Target Examples & Expected Output */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                  Examples:
                </h4>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontFamily: 'Consolas, Monaco, monospace' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> <strong style={{ color: 'var(--text-primary)' }}>{ex.input}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Output:</span> <strong style={{ color: 'var(--accent-pink)' }}>{ex.output}</strong></div>
                    {ex.explanation && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'sans-serif' }}>
                        💡 {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                    Constraints:
                  </h4>
                  <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {problem.constraints.map((c, i) => (
                        <li key={i} style={{ fontFamily: 'Consolas, Monaco, monospace' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 3 PROGRESSIVE HINTS: Need Help? */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle style={{ width: 15, height: 15, color: 'var(--accent-blue)' }} />
                    <span>Need Help? (3 Progressive Hints)</span>
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {progressiveHints.map((item) => {
                    const isOpen = !!openHints[item.id];
                    return (
                      <div 
                        key={item.id}
                        style={{
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-base)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleHint(item.id)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles style={{ width: 13, height: 13, color: 'var(--accent-pink)' }} />
                            {item.label}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            <span>{isOpen ? 'Hide' : 'Reveal'}</span>
                            {isOpen ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
                          </span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '8px 10px', fontSize: '0.775rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', lineHeight: '1.45', backgroundColor: 'var(--bg-surface)' }}>
                            {item.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REVEAL OFFICIAL SOLUTION TOGGLE BUTTON */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                {!showSolution ? (
                  <div 
                    style={{ 
                      padding: '14px', 
                      backgroundColor: 'var(--bg-base)', 
                      border: '1px dashed var(--accent-blue)', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🔒</span>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Official Solution Hidden
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                      You can reveal the official solution when you need it.
                    </p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setShowSolution(true);
                        markProblemAttempted(problem.id);
                      }}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '8px 14px',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '6px'
                      }}
                    >
                      <Eye style={{ width: 14, height: 14 }} />
                      <span>Reveal Answer</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Hide Official Solution Toggle Button */}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowSolution(false)}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '7px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '6px'
                      }}
                    >
                      <EyeOff style={{ width: 14, height: 14 }} />
                      <span>Hide Official Solution</span>
                    </button>

                    {/* 1. COMPLETE SOLUTION */}
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-code-editor, var(--bg-code))', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Code style={{ width: 14, height: 14 }} />
                          1. Complete {selectedLanguage.toUpperCase()} Solution
                        </span>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                          onClick={() => setCode(canonicalSolutionCode)}
                          title="Copy official solution to coding workspace"
                        >
                          <Copy style={{ width: 12, height: 12 }} />
                          <span>Copy to Workspace</span>
                        </button>
                      </div>
                      <pre style={{ margin: 0, fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.8rem', color: 'var(--text-code-editor, var(--text-code))', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '250px', overflowY: 'auto', padding: '10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <code>{canonicalSolutionCode}</code>
                      </pre>
                    </div>

                    {/* 2. LINE-BY-LINE EXPLANATION */}
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles style={{ width: 14, height: 14 }} />
                        <span>2. Line-by-Line Explanation</span>
                      </div>

                      {/* Line-by-Line List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                        {getDetailedLineBreakdown(canonicalSolutionCode, selectedLanguage, problem).map((item) => {
                          if (item.isBlank) return null;
                          return (
                            <div 
                              key={item.lineNum} 
                              style={{ 
                                padding: '8px 10px', 
                                backgroundColor: 'var(--bg-base)', 
                                border: '1px solid var(--border-subtle)', 
                                borderRadius: '6px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '4px',
                                fontSize: '0.76rem' 
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 800, color: 'var(--accent-pink)', backgroundColor: 'rgba(236, 72, 153, 0.15)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                  Line {item.lineNum}
                                </span>
                                <code style={{ fontFamily: 'Consolas, Monaco, monospace', color: 'var(--text-primary)', fontWeight: 600 }}>
                                  {item.code.trim()}
                                </code>
                              </div>
                              <div style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>
                                💡 <strong>What it does:</strong> {item.whatItDoes}
                              </div>
                              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                🎯 <strong>Why needed:</strong> {item.whyNeeded}
                              </div>
                              {item.variables && (
                                <div style={{ color: 'var(--accent-blue)', fontSize: '0.725rem' }}>
                                  🔑 <strong>Variables & Data Structures:</strong> {item.variables}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Input to Output Flow */}
                      <div style={{ marginTop: '2px', padding: '10px 12px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '6px', fontSize: '0.76rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <ArrowRight style={{ width: 13, height: 13 }} />
                          <span>How the Code Moves From Input to Output:</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                          {learningContentData.whatIsItReallyAsking?.simpleTranslation 
                            ? `1. Takes input values and sets up initial tracking memory. 2. Iterates step-by-step through the input while tracking visited states. 3. ${learningContentData.whatIsItReallyAsking.simpleTranslation}`
                            : '1. Receives input arguments. 2. Sets up auxiliary memory and iterates line-by-line over elements. 3. Evaluates condition matches to compute and return output.'}
                        </p>
                      </div>
                    </div>

                    {/* 3. COMPLEXITY EXPLANATION */}
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock style={{ width: 14, height: 14 }} />
                        <span>3. Complexity Explanation</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {/* Time Complexity */}
                        <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: 12, height: 12 }} />
                            <span>Time Complexity: {learningContentData.complexityExplanation?.timeComplexity || problem.timeComplexity || 'O(N)'}</span>
                          </div>
                          <p style={{ fontSize: '0.735rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                            <strong>Why:</strong> {learningContentData.complexityExplanation?.whyTime || 'Performs a single linear pass over the input sequence.'}
                          </p>
                        </div>

                        {/* Space Complexity */}
                        <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HardDrive style={{ width: 12, height: 12 }} />
                            <span>Space Complexity: {learningContentData.complexityExplanation?.spaceComplexity || problem.spaceComplexity || 'O(N)'}</span>
                          </div>
                          <p style={{ fontSize: '0.735rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                            <strong>Why:</strong> {learningContentData.complexityExplanation?.whySpace || 'Allocates auxiliary memory buffer proportional to input size.'}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Practice Coding Compiler Area */}
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal style={{ width: 14, height: 14, color: 'var(--accent-pink)' }} />
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Coding Workspace
                  </span>
                  <select
                    className="select-field"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                  >
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript (ES6)</option>
                    <option value="java">Java 17</option>
                    <option value="cpp">C++ 20</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.725rem' }}
                    onClick={handleLoadStarterCode}
                    title="Load starter code template"
                  >
                    <Code style={{ width: 12, height: 12 }} />
                    <span>Starter Code</span>
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.725rem' }}
                    onClick={handleCopy}
                    title="Copy code"
                  >
                    {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.725rem' }}
                    onClick={handleReset}
                    title="Reset workspace to retry"
                  >
                    <RotateCcw style={{ width: 12, height: 12 }} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* SYNTAX HIGHLIGHTED CODE EDITOR */}
              <CodeEditor
                value={code}
                onChange={(newCode) => {
                  setCode(newCode);
                  editCountRef.current += 1;
                  if (editCountRef.current === 65 || (editCountRef.current > 65 && editCountRef.current % 120 === 0)) {
                    triggerMotivationPopup('REPEATED_EDITS', false, { algorithm: problem.title });
                  }
                  try {
                    localStorage.setItem(`algorise_code_draft_${problem.id}_${selectedLanguage}`, newCode);
                  } catch {
                    // Ignore
                  }
                }}
                language={selectedLanguage}
                placeholder={`// Write your ${selectedLanguage.toUpperCase()} solution here...\n// Editor starts completely empty for independent practice.`}
                minHeight="400px"
                autoFocus
              />

              {/* Custom Input Field for Run Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Custom Input (passed to stdin):
                  </label>
                  {customInput && (
                    <button
                      type="button"
                      onClick={() => setCustomInput('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Clear Input
                    </button>
                  )}
                </div>
                <textarea
                  className="input-field"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter input to pass to standard input (supports multiline)..."
                  rows={2}
                  style={{ 
                    padding: '8px 10px', 
                    fontSize: '0.8rem', 
                    fontFamily: 'Consolas, Monaco, monospace',
                    resize: 'vertical',
                    minHeight: '48px',
                    lineHeight: '1.4'
                  }}
                />
              </div>

              {/* Run, Submit & Retry Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleReset}
                  disabled={isExecuting}
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  title="Reset code to starter template and reset input"
                >
                  <RotateCcw style={{ width: 12, height: 12 }} />
                  <span>Retry / Reset</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => executeCompiler(false)}
                  disabled={isExecuting}
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                >
                  <Play style={{ width: 12, height: 12, color: 'var(--accent-blue)' }} />
                  <span>Run Code</span>
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => executeCompiler(true)}
                  disabled={isExecuting}
                  style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                >
                  <CheckCircle2 style={{ width: 12, height: 12 }} />
                  <span>Submit Solution</span>
                </button>
              </div>



              {/* Loading Indicator while execution is in progress */}
              {isExecuting && (
                <div 
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--border-subtle)',
                      borderTopColor: 'var(--accent-blue)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}
                  />
                  <span>{executingMode === 'submit' ? 'Evaluating solution against test cases...' : 'Executing code...'}</span>
                </div>
              )}

              {/* Compiler Execution Outcome & Output Terminal */}
              {!isExecuting && testResult && (() => {
                const isSubmitAccepted = testResult.mode === 'submit' && testResult.status === 'Accepted';
                const isErrorOrFailed = testResult.status === 'Wrong Answer' || testResult.status === 'Compilation Error' || testResult.status === 'Runtime Error' || testResult.status === 'Time Limit Exceeded';
                const isRunExecuted = testResult.mode === 'run' && testResult.status === 'Executed';

                // Strict Color Rules:
                // GREEN: Only when submitted solution passes all required test cases and backend confirms Accepted.
                // RED: Wrong Answer, Failed test cases, Compilation Error, Runtime Error, Time Limit Exceeded.
                // NEUTRAL: Custom Run execution output (Never Green!).
                const borderColor = isSubmitAccepted
                  ? '#10B981'
                  : isErrorOrFailed
                  ? '#EF4444'
                  : 'var(--border-subtle)';

                const bgStyle = isSubmitAccepted
                  ? 'rgba(16, 185, 129, 0.1)'
                  : isErrorOrFailed
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(30, 41, 59, 0.6)';

                const statusTextColor = isSubmitAccepted
                  ? '#10B981'
                  : isErrorOrFailed
                  ? '#EF4444'
                  : 'var(--accent-blue)';

                const outputTextColor = isSubmitAccepted
                  ? '#10B981'
                  : isErrorOrFailed
                  ? '#F87171'
                  : 'var(--text-code-editor, var(--text-primary))';

                return (
                  <div 
                    style={{ 
                      padding: '12px 14px', 
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: bgStyle,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Result Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 800, 
                            color: statusTextColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isSubmitAccepted && <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />}
                          {isErrorOrFailed && <span>✕</span>}
                          {isRunExecuted && <Terminal style={{ width: 15, height: 15, color: 'var(--accent-blue)' }} />}
                          
                          {isSubmitAccepted && '✓ Accepted'}
                          {!isSubmitAccepted && isRunExecuted && 'Program Executed'}
                          {!isSubmitAccepted && !isRunExecuted && `✕ ${testResult.status}`}
                        </span>

                        {testResult.mode === 'submit' && (
                          <span style={{ fontSize: '0.75rem', color: isSubmitAccepted ? '#10B981' : '#F87171', fontWeight: 600 }}>
                            ({testResult.testCasesPassed} / {testResult.totalTestCases} test cases passed)
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Runtime: {testResult.runtimeMs !== null && testResult.runtimeMs !== undefined ? `${testResult.runtimeMs}ms` : 'Unavailable'} | Memory: {testResult.memoryMb !== null && testResult.memoryMb !== undefined ? `${testResult.memoryMb}MB` : 'Unavailable'}
                      </div>
                    </div>

                    {/* Submission Status Message / Guidance */}
                    {testResult.mode === 'submit' && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: isSubmitAccepted ? '#10B981' : '#F87171' }}>
                        {isSubmitAccepted ? 'All test cases passed.' : testResult.message}
                      </div>
                    )}

                    {/* Standard Error (stderr) Window */}
                    {testResult.stderr && testResult.stderr.trim().length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Terminal style={{ width: 12, height: 12, color: '#EF4444' }} />
                          <span>
                            {testResult.status === 'Compilation Error' ? 'Compilation Diagnostics (stderr):' : 'Standard Error (stderr):'}
                          </span>
                        </div>
                        <pre 
                          style={{ 
                            fontFamily: 'Consolas, Monaco, monospace', 
                            fontSize: '0.775rem', 
                            color: '#F87171', 
                            backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                            padding: '10px 12px', 
                            borderRadius: '6px', 
                            overflowX: 'auto', 
                            margin: 0,
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {testResult.stderr}
                        </pre>
                      </div>
                    )}

                    {/* Program Console Output Window (stdout) */}
                    {testResult.mode === 'run' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Terminal style={{ width: 12, height: 12 }} />
                          <span>Standard Output (stdout):</span>
                        </div>
                        <pre 
                          style={{ 
                            fontFamily: 'Consolas, Monaco, monospace', 
                            fontSize: '0.775rem', 
                            color: outputTextColor, 
                            backgroundColor: 'var(--bg-card)', 
                            padding: '10px 12px', 
                            borderRadius: '6px', 
                            overflowX: 'auto', 
                            margin: 0,
                            border: '1px solid var(--border-subtle)',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {testResult.stdout !== undefined && testResult.stdout !== null && testResult.stdout !== '' 
                            ? testResult.stdout 
                            : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>(No stdout produced)</span>}
                        </pre>
                      </div>
                    )}

                    {/* Test Cases Details Breakdown for Submit Mode */}
                    {testResult.mode === 'submit' && testResult.details && testResult.details.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Test Case Details:
                        </div>
                        {testResult.details.map((det, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              padding: '8px 10px', 
                              backgroundColor: 'var(--bg-base)', 
                              borderRadius: '6px', 
                              border: `1px solid ${det.status === 'Passed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                              fontSize: '0.775rem',
                              fontFamily: 'Consolas, Monaco, monospace'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <strong style={{ color: 'var(--text-primary)' }}>Case #{det.testNum}:</strong>
                              <span style={{ color: det.status === 'Passed' ? '#10B981' : '#F43F5E', fontWeight: 700 }}>
                                {det.status === 'Passed' ? '✓ Passed' : '✕ Failed'}
                              </span>
                            </div>
                            <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> <span style={{ color: 'var(--text-primary)' }}>{det.input}</span></div>
                            <div><span style={{ color: 'var(--text-muted)' }}>Expected:</span> <span style={{ color: '#10B981' }}>{det.expected}</span></div>
                            {det.actual !== undefined && (
                              <div><span style={{ color: 'var(--text-muted)' }}>Your Output:</span> <span style={{ color: det.status === 'Passed' ? '#10B981' : '#F43F5E', fontWeight: 700 }}>{det.actual}</span></div>
                            )}
                            {det.errorMsg && (
                              <div style={{ color: '#F43F5E', marginTop: '4px', fontWeight: 600 }}>Error: {det.errorMsg}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* EXPANDED PROMINENT OFFICIAL SOLUTION SECTION                              */}
          {/* ========================================================================= */}
          {showSolution && (
            <div
              className="card"
              style={{
                padding: '24px 28px',
                borderRadius: '16px',
                border: '1.5px solid var(--accent-blue)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', fontWeight: 800, fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles style={{ width: 18, height: 18 }} />
                    <span>Official Solution</span>
                  </div>
                  <Badge variant="blue">{selectedLanguage.toUpperCase()}</Badge>
                </div>

                <button
                  onClick={() => setShowSolution(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <EyeOff style={{ width: 14, height: 14 }} />
                  <span>Hide Official Solution</span>
                </button>
              </div>

              {/* 1. Complete Solution Code Block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code style={{ width: 18, height: 18, color: 'var(--accent-blue)' }} />
                    <span>Complete Solution ({selectedLanguage.toUpperCase()})</span>
                  </h3>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleCopy}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                  >
                    {copied ? <Check style={{ width: 14, height: 14, color: '#10B981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <pre 
                    style={{ 
                      fontFamily: 'Consolas, Monaco, monospace', 
                      fontSize: '0.875rem', 
                      lineHeight: 1.6, 
                      color: 'var(--text-code-editor, var(--text-code))', 
                      backgroundColor: 'var(--bg-code-editor, var(--bg-code))', 
                      padding: '18px 20px', 
                      margin: 0, 
                      overflowX: 'auto',
                      whiteSpace: 'pre'
                    }}
                  >
                    <code>{canonicalSolutionCode}</code>
                  </pre>
                </div>
              </div>

              {/* 2. Line-by-Line Beginner Explanation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: 18, height: 18, color: 'var(--accent-pink)' }} />
                  <span>Line-by-Line Beginner Explanation</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {canonicalSolutionCode.split('\n').map((line, idx) => {
                    const info = getDetailedCanonicalLineExplanation(line, idx);
                    if (!info) return null;
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: '12px 16px', 
                          backgroundColor: 'var(--bg-base)', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-subtle)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '6px' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-pink)', backgroundColor: 'rgba(236, 72, 153, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                            Line {idx + 1}
                          </span>
                          <code style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem', color: 'var(--text-code-editor, var(--text-code))', fontWeight: 600 }}>
                            {line.trim()}
                          </code>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', marginTop: '4px' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            📖 <strong>Meaning:</strong> {info.simpleMeaning}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            ❓ <strong>Why Needed:</strong> {info.whyNeeded}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', lineHeight: 1.4 }}>
                            📦 <strong>Variables & Structures:</strong> {info.variablesUsed}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#10B981', lineHeight: 1.4 }}>
                            ⚡ <strong>Algorithm Connection:</strong> {info.algorithmConnection}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Variables & Data Structures Explanation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive style={{ width: 18, height: 18, color: 'var(--accent-blue)' }} />
                  <span>Variables & Data Structures</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {getVariableExplanations(problem).map((v, i) => (
                    <div key={i} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <code style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-pink)', fontFamily: 'Consolas, Monaco, monospace' }}>
                        {v.name}
                      </code>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {v.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Execution Trace */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play style={{ width: 18, height: 18, color: 'var(--accent-pink)' }} />
                  <span>Step-by-Step Execution Trace</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Input: {learningContentData.exampleWalkthrough.sampleInput}</span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {learningContentData.exampleWalkthrough.steps.map((st: any, i: number) => (
                    <div key={i} style={{ padding: '12px 16px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                          Step #{i + 1} ({st.currentIndex})
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          State: {st.dsState}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.4, fontFamily: 'Consolas, Monaco, monospace' }}>
                        {st.decision}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Complexity Analysis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ width: 18, height: 18, color: '#10B981' }} />
                  <span>Complexity Analysis</span>
                </h3>

                <div className="grid-2" style={{ gap: '14px' }}>
                  <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', borderLeft: '4px solid #10B981', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>
                      Time Complexity: {problem.timeComplexity || 'O(N)'}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong>Why?</strong> The algorithm performs a single linear pass over N input elements. Each Hash Map lookup and insertion executes in O(1) average constant time, yielding total runtime O(N).
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                      Space Complexity: {problem.spaceComplexity || 'O(N)'}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong>Why?</strong> In the worst-case scenario where no matching pair is found until the final element, up to N elements are stored in the auxiliary Hash Map data structure.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: LEARNING MODE (INTERACTIVE & COLORFUL MULTI-THEME EXPERIENCE)      */}
      {/* ========================================================================= */}
      {activeMode === 'learning' && (() => {
        const content = getProblemLearningContent(problem);
        if (!content) {
          return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              Learning content is being prepared.
            </div>
          );
        }

        const {
          problemOverview,
          problemStatement,
          whatIsItReallyAsking,
          realWorldExample,
          whyItMatters,
          realWorldUses,
          concepts,
          dataStructureExplanation,
          recognitionClues,
          bruteForceExplanation,
          optimizationJourney,
          stepByStepApproach,
          pseudocode,
          exampleWalkthrough,
          edgeCases,
          commonMistakes,
          complexityExplanation,
          thinkingQuestions
        } = content;

        const toggleSection = (key: string) => {
          setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
        };

        const allSectionKeys = ['overview', 'statement', 'meaning', 'analogy', 'importance', 'concepts', 'pattern', 'optimization', 'algorithm', 'pseudocode', 'walkthrough', 'edgecases', 'mistakes', 'complexity', 'questions'];
        const allCollapsed = allSectionKeys.every(k => collapsedSections[k]);

        const toggleAllSections = () => {
          const nextState: Record<string, boolean> = {};
          allSectionKeys.forEach(k => {
            nextState[k] = !allCollapsed;
          });
          setCollapsedSections(nextState);
        };

        const activeStepData = exampleWalkthrough?.steps?.[dryRunStep] || exampleWalkthrough?.steps?.[0];

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* INTERACTIVE LEARNING TOP NAV & CONTROLS */}
            <div 
              className="card"
              style={{
                padding: '12px 18px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1.5px solid var(--accent-blue)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Interactive Learning Roadmap
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Master the algorithmic concept before writing code
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={toggleAllSections}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Layers style={{ width: 13, height: 13 }} />
                  <span>{allCollapsed ? 'Expand All Sections' : 'Collapse All'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleModeChange('practice')}
                  style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Code style={{ width: 14, height: 14 }} />
                  <span>Ready to Practice →</span>
                </button>
              </div>
            </div>

            {/* 1. PROBLEM BLUEPRINT & OVERVIEW */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                onClick={() => toggleSection('overview')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    1
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target style={{ width: 16, height: 16, color: 'var(--accent-blue)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Problem Blueprint & Goal
                    </h3>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="blue">Core Concept</Badge>
                  {collapsedSections['overview'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
                </div>
              </div>

              {!collapsedSections['overview'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.55', padding: '12px 14px', backgroundColor: 'rgba(59, 130, 246, 0.06)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
                    <strong style={{ color: 'var(--accent-blue)' }}>Goal:</strong> {problemOverview.about}
                  </div>

                  <div className="grid-2" style={{ gap: '10px' }}>
                    <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📥 Given Input:</span>
                      </strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{problemOverview.given}</div>
                    </div>

                    <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>🔍 Need To Find:</span>
                      </strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{problemOverview.needToFind}</div>
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '10px' }}>
                    <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.78rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>🎯 Expected Output:</span>
                      </strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{problemOverview.returnWhat || problemStatement.expectedResult}</div>
                    </div>

                    <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.78rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>⚡ Main Algorithmic Hurdle:</span>
                      </strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{problemOverview.mainChallenge}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. WHAT IS THIS REALLY ASKING & EVERYDAY ANALOGY */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('meaning')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-pink)', backgroundColor: 'rgba(236, 72, 153, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    2
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lightbulb style={{ width: 16, height: 16, color: 'var(--accent-pink)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Plain Meaning & Real-World Analogy
                    </h3>
                  </div>
                </div>
                {collapsedSections['meaning'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['meaning'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ padding: '14px', backgroundColor: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    💡 <strong>In Plain Language:</strong> "{whatIsItReallyAsking.simpleTranslation}"
                  </div>

                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', borderLeft: '4px solid var(--accent-pink)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-pink)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles style={{ width: 14, height: 14 }} />
                      <span>Everyday Real-World Analogy:</span>
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
                      "{realWorldExample.analogy}"
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>How it maps to code:</strong> {realWorldExample.explanation}
                    </div>
                  </div>

                  {whatIsItReallyAsking.whatYouDoNotNeedToDo && (
                    <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      ℹ️ <strong>What you do NOT need to do:</strong> {whatIsItReallyAsking.whatYouDoNotNeedToDo}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. WHY IT MATTERS & INDUSTRY USES */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('importance')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    3
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp style={{ width: 16, height: 16, color: '#10B981' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Why This Matters & Industry Applications
                    </h3>
                  </div>
                </div>
                {collapsedSections['importance'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['importance'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div className="grid-2" style={{ gap: '10px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#10B981' }}>What Problem It Solves:</strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{whyItMatters.techniqueSolved}</div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Why Software Engineers Use It:</strong>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{whyItMatters.whyProgrammersUseIt}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Click on real-world use cases to explore:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {realWorldUses.map((u, i) => {
                        const isSelected = selectedConceptIndex === i;
                        return (
                          <div 
                            key={i} 
                            onClick={() => setSelectedConceptIndex(i)}
                            style={{ 
                              padding: '12px 14px', 
                              backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-base)', 
                              borderRadius: '8px', 
                              border: `1.5px solid ${isSelected ? '#10B981' : 'var(--border-subtle)'}`, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: isSelected ? '#10B981' : 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>{u.title}</span>
                              {isSelected && <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{u.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. CONCEPTS & DATA STRUCTURE BREAKDOWN */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('concepts')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    4
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardDrive style={{ width: 16, height: 16, color: '#F59E0B' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Concepts & Data Structure Deep Dive
                    </h3>
                  </div>
                </div>
                {collapsedSections['concepts'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['concepts'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {concepts.map((c, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          padding: '12px 14px', 
                          backgroundColor: 'var(--bg-base)', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-subtle)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '6px'
                        }}
                      >
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-pink)', margin: 0 }}>{c.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}><strong>What is it?</strong> {c.whatIsIt}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}><strong>Why needed?</strong> {c.whyNeeded}</div>
                      </div>
                    ))}
                  </div>

                  {dataStructureExplanation && (
                    <div style={{ padding: '14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', borderLeft: '4px solid #F59E0B', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', margin: 0 }}>
                          🔑 Data Structure: {dataStructureExplanation.name}
                        </h4>
                        <Badge variant="medium">Key Mechanism</Badge>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        <strong>How does it operate?</strong> {dataStructureExplanation.howItWorks}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--accent-blue)', lineHeight: '1.5' }}>
                        <strong>Why is it optimal here?</strong> {dataStructureExplanation.whyUsefulHere}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--accent-pink)', lineHeight: '1.5' }}>
                        <strong>What would happen without it?</strong> {dataStructureExplanation.withoutIt}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. PATTERN RECOGNITION CLUES */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('pattern')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    5
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles style={{ width: 16, height: 16, color: '#8B5CF6' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Pattern Recognition Checklist
                    </h3>
                  </div>
                </div>
                {collapsedSections['pattern'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['pattern'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Watch for these signals when reading new coding interview problems:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {recognitionClues.map((clue, idx) => {
                      const isChecked = selectedClueIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedClueIndex(prev => prev === idx ? null : idx)}
                          style={{ 
                            padding: '10px 14px', 
                            backgroundColor: isChecked ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-base)', 
                            borderRadius: '8px', 
                            border: `1px solid ${isChecked ? '#8B5CF6' : 'var(--border-subtle)'}`,
                            fontSize: '0.825rem',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: isChecked ? '#8B5CF6' : 'var(--text-muted)', fontWeight: 800 }}>
                            {isChecked ? '✓' : '•'}
                          </span>
                          <span>{clue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 6. BRUTE FORCE VS THE OPTIMIZATION BREAKTHROUGH */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('optimization')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-pink)', backgroundColor: 'rgba(236, 72, 153, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    6
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap style={{ width: 16, height: 16, color: 'var(--accent-pink)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      The Optimization Breakthrough (Slow → Fast)
                    </h3>
                  </div>
                </div>
                {collapsedSections['optimization'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['optimization'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
                  
                  {/* Brute Force Card */}
                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', borderLeft: '4px solid var(--accent-pink)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                        First Thought — Brute Force Method
                      </span>
                      <Badge variant="hard">Time: {bruteForceExplanation.timeComplexity}</Badge>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                      <strong>What a beginner tries first:</strong> {bruteForceExplanation.whatBeginnerTries}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Why it works:</strong> {bruteForceExplanation.whyItWorks}
                    </div>
                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#EF4444' }}>
                      ⚠️ <strong>Why Brute Force fails:</strong> {bruteForceExplanation.whySlow}
                    </div>
                  </div>

                  {/* Optimization Journey Steps */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ⚡ How we optimize to O(N):
                    </div>
                    {optimizationJourney.map((step, idx) => (
                      <div key={idx} style={{ padding: '10px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          Step {idx + 1}
                        </span>
                        <div style={{ fontSize: '0.825rem' }}>
                          <strong style={{ color: 'var(--accent-blue)' }}>{step.stepName}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{step.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* 7. STEP-BY-STEP ALGORITHM & PSEUDOCODE */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('algorithm')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    7
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code style={{ width: 16, height: 16, color: 'var(--accent-blue)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Step-by-Step Algorithm & Pseudocode
                    </h3>
                  </div>
                </div>
                {collapsedSections['algorithm'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['algorithm'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stepByStepApproach.map((st) => (
                      <div key={st.stepNumber} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                          Step {st.stepNumber}: {st.title}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                          {st.action}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                          💡 <strong>Why?</strong> {st.why}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: '4px' }}>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '8px' }}>
                      Language-Agnostic Pseudocode:
                    </div>
                    <pre style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.825rem', color: 'var(--text-code-editor, var(--text-code))', backgroundColor: 'var(--bg-code-editor, var(--bg-code))', padding: '12px 14px', borderRadius: '6px', overflowX: 'auto', margin: 0, lineHeight: '1.5' }}>
                      {pseudocode}
                    </pre>
                  </div>

                  {complexityExplanation && (
                    <div className="grid-2" style={{ gap: '10px', marginTop: '4px' }}>
                      <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.78rem', color: '#10B981' }}>⏱️ Optimal Time Complexity:</strong>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>{complexityExplanation.timeComplexity}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{complexityExplanation.whyTime}</div>
                      </div>

                      <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>💾 Space Complexity:</strong>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>{complexityExplanation.spaceComplexity}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{complexityExplanation.whySpace}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 8. INTERACTIVE DRY RUN & STEPPER */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1.5px solid var(--accent-blue)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    8
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Play style={{ width: 16, height: 16, color: '#10B981' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Interactive Stepper & Visual Dry Run
                    </h3>
                  </div>
                </div>

                {/* Timeline Stepper Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isPlayingDryRun ? (
                    <button className="btn btn-outline btn-sm" onClick={() => setIsPlayingDryRun(false)} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                      <Pause style={{ width: 12, height: 12 }} /> <span>Pause</span>
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" disabled={dryRunStep >= exampleWalkthrough.steps.length - 1} onClick={() => setIsPlayingDryRun(true)} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                      <Play style={{ width: 12, height: 12 }} /> <span>Auto-Play</span>
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" disabled={dryRunStep <= 0} onClick={() => { setIsPlayingDryRun(false); setDryRunStep(prev => Math.max(0, prev - 1)); }} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                    <ChevronLeft style={{ width: 12, height: 12 }} /> <span>Prev</span>
                  </button>
                  <button className="btn btn-outline btn-sm" disabled={dryRunStep >= exampleWalkthrough.steps.length - 1} onClick={() => { setIsPlayingDryRun(false); setDryRunStep(prev => Math.min(exampleWalkthrough.steps.length - 1, prev + 1)); }} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                    <span>Next</span> <ChevronRight style={{ width: 12, height: 12 }} />
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => { setIsPlayingDryRun(false); setDryRunStep(0); }} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                    <RotateCcw style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sample Input: <code style={{ color: 'var(--accent-blue)' }}>{exampleWalkthrough.sampleInput}</code> | Target: <code style={{ color: '#10B981' }}>{exampleWalkthrough.targetOutput}</code>
              </div>

              {/* Interactive Step Selector Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Jump to Step:</span>
                {exampleWalkthrough.steps.map((_, idx) => {
                  const isActive = dryRunStep === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setIsPlayingDryRun(false); setDryRunStep(idx); }}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: `1.5px solid ${isActive ? '#10B981' : 'var(--border-subtle)'}`,
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-base)',
                        color: isActive ? '#10B981' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Step {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Step Details Box */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-base)', borderRadius: '10px', border: '1px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                    Active Step #{dryRunStep + 1} of {exampleWalkthrough.steps.length} ({activeStepData?.currentIndex})
                  </span>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    State: {activeStepData?.dsState || 'In Progress'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.825rem' }}>
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Inspecting Element:</span> <br />
                    <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{activeStepData?.currentVal}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Calculation Check:</span> <br />
                    <strong style={{ color: 'var(--accent-pink)', fontFamily: 'monospace' }}>{activeStepData?.variables}</strong>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  💡 <strong>Decision & Reason:</strong> {activeStepData?.decision}
                </div>
              </div>
            </div>

            {/* 9. EDGE CASES & COMMON MISTAKES */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('edgecases')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    9
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle style={{ width: 16, height: 16, color: '#EF4444' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Edge Cases & Common Traps
                    </h3>
                  </div>
                </div>
                {collapsedSections['edgecases'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['edgecases'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {edgeCases.map((ec, i) => (
                      <div key={i} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-pink)' }}>{ec.caseName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{ec.description}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>💡 <strong>Why it matters:</strong> {ec.whyItMatters}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                    Common Beginner Mistakes:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {commonMistakes.map((cm, i) => (
                      <div key={i} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-pink)' }}>❌ Trap: {cm.mistakeName}</div>
                        <div style={{ padding: '8px 10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#EF4444' }}>
                          <strong>Wrong Thinking:</strong> {cm.wrongThinking}
                        </div>
                        <div style={{ padding: '8px 10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#10B981' }}>
                          <strong>Better Thinking:</strong> {cm.betterThinking}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 10. INTERACTIVE SELF-CHECK & THINKING QUESTIONS */}
            <div 
              className="card" 
              style={{ 
                padding: '18px 20px', 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <div 
                onClick={() => toggleSection('questions')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    10
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle style={{ width: 16, height: 16, color: 'var(--accent-blue)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Interactive Self-Check Questions
                    </h3>
                  </div>
                </div>
                {collapsedSections['questions'] ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)' }} /> : <ChevronUp style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
              </div>

              {!collapsedSections['questions'] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' }}>
                  {thinkingQuestions.map((item, idx) => {
                    const isOpen = !!openThinkingQuestions[idx + 1];
                    return (
                      <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
                        <div 
                          onClick={() => setOpenThinkingQuestions(prev => ({ ...prev, [idx + 1]: !prev[idx + 1] }))}
                          style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            ❓ #{idx + 1}: {item.question}
                          </span>
                          <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{isOpen ? 'Hide Answer' : 'Reveal Answer'}</span>
                            {isOpen ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                          </button>
                        </div>

                        {isOpen && (
                          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem' }}>
                            <div style={{ color: 'var(--accent-blue)', fontStyle: 'italic' }}>
                              💡 Hint: {item.hint}
                            </div>
                            <div style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                              <strong>Answer:</strong> {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 11. YOUR TURN — READY TO CODE */}
            <div 
              className="card"
              style={{ 
                padding: '24px 20px', 
                backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                border: '1.5px solid #10B981', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                gap: '14px',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: 24, height: 24, color: '#10B981' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Ready to Practice & Code!
                </h3>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0, lineHeight: '1.5' }}>
                You've reviewed the problem overview, everyday analogy, optimization journey, and step-by-step trace.
                Now transition into Practice Mode and write your solution!
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  className="btn btn-outline"
                  onClick={handleCompleteLearningStep}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isLearningCompleted ? (
                    <>
                      <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                      <span>Learning Marked Complete ✓</span>
                    </>
                  ) : (
                    <>
                      <BookOpen style={{ width: 16, height: 16 }} />
                      <span>Mark Learning Complete</span>
                    </>
                  )}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => handleModeChange('practice')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontSize: '0.875rem' }}
                >
                  <Code style={{ width: 18, height: 18 }} />
                  <span>Start Coding in Practice Mode →</span>
                </button>
              </div>
            </div>

          </div>
        );
      })()}




    </div>
  );
};
