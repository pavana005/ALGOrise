import type { Problem } from '../data/problemsData';

export interface ProblemOverview {
  about: string;
  given: string;
  needToFind: string;
  returnWhat: string;
  mainChallenge: string;
}

export interface ProblemStatementInfo {
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  expectedResult: string;
}

export interface ReallyAskingInfo {
  simpleTranslation: string;
  whatYouDoNotNeedToDo: string;
}

export interface RealWorldExample {
  analogy: string;
  explanation: string;
}

export interface WhyItMatters {
  techniqueSolved: string;
  whyProgrammersUseIt: string;
  situationsBenefiting: string;
  skillLearned: string;
}

export interface RealWorldUse {
  title: string;
  desc: string;
}

export interface ConceptInfo {
  name: string;
  whatIsIt: string;
  whyNeeded: string;
}

export interface DataStructureExplanation {
  name: string;
  whatIsIt: string;
  howItWorks: string;
  whyUsefulHere: string;
  withoutIt: string;
  connectionToProblem: string;
}

export interface BruteForceExplanation {
  whatBeginnerTries: string;
  whyItWorks: string;
  whatItChecks: string;
  timeComplexity: string;
  whySlow: string;
  pseudocode?: string;
}

export interface OptimizationJourneyStep {
  stepName: string;
  desc: string;
}

export interface StepByStepApproachItem {
  stepNumber: number;
  title: string;
  action: string;
  why: string;
}

export interface WalkthroughStep {
  currentVal: string;
  currentIndex: string;
  variables: string;
  dsState: string;
  decision: string;
  nextStep: string;
}

export interface ExampleWalkthrough {
  sampleInput: string;
  targetOutput: string;
  steps: WalkthroughStep[];
}

export interface EdgeCaseItem {
  caseName: string;
  description: string;
  whyItMatters: string;
}

export interface CommonMistakeItem {
  mistakeName: string;
  wrongThinking: string;
  betterThinking: string;
}

export interface ComplexityExplanation {
  timeComplexity: string;
  timeSimple: string;
  whyTime: string;
  spaceComplexity: string;
  spaceSimple: string;
  whySpace: string;
}

export interface ThinkingQuestion {
  question: string;
  hint: string;
  answer: string;
}

export interface ProblemLearningContent {
  problemOverview: ProblemOverview;
  problemStatement: ProblemStatementInfo;
  whatIsItReallyAsking: ReallyAskingInfo;
  realWorldExample: RealWorldExample;
  whyItMatters: WhyItMatters;
  realWorldUses: RealWorldUse[];
  concepts: ConceptInfo[];
  dataStructureExplanation: DataStructureExplanation;
  recognitionClues: string[];
  bruteForceExplanation: BruteForceExplanation;
  optimizationJourney: OptimizationJourneyStep[];
  stepByStepApproach: StepByStepApproachItem[];
  pseudocode: string;
  exampleWalkthrough: ExampleWalkthrough;
  edgeCases: EdgeCaseItem[];
  commonMistakes: CommonMistakeItem[];
  complexityExplanation: ComplexityExplanation;
  thinkingQuestions: ThinkingQuestion[];
}

/**
 * Returns tailored, problem-specific learning content for any DSA problem.
 */
export function getProblemLearningContent(problem: Problem): ProblemLearningContent {
  const id = problem.id.toLowerCase();
  const topic = problem.topic || 'General DSA';
  const ex = problem.examples[0] || { input: 'N/A', output: 'N/A' };

  // --------------------------------------------------------------------------
  // 1. TWO SUM & HASH MAP LOOKUP PROBLEMS
  // --------------------------------------------------------------------------
  if (id.startsWith('two-sum') || (topic === 'Two Pointers' && problem.pattern.includes('Hash Map'))) {
    return {
      problemOverview: {
        about: `Searching an unsorted array of numbers to find a pair that adds up exactly to a given target sum.`,
        given: `An array of numbers (nums = ${ex.input.split(', target')[0] || '[2, 7, 11, 15]'}) and a target number.`,
        needToFind: `The pair of numbers whose sum equals the target.`,
        returnWhat: `An array containing the 0-based index positions of the two matching numbers.`,
        mainChallenge: `Finding the matching pair in a single pass without using slow nested loops (O(N^2)).`
      },
      problemStatement: {
        statement: problem.description,
        inputFormat: `nums (Array of integers), target (Integer)`,
        outputFormat: `Array of 2 Integers representing indices`,
        constraints: problem.constraints,
        expectedResult: ex.output
      },
      whatIsItReallyAsking: {
        simpleTranslation: `Basically, you have a list of numbers and a total sum. You need to find two numbers from the list that add up to that exact total.`,
        whatYouDoNotNeedToDo: `You do NOT need to sort the array first, and you do NOT need to find all possible pairs—just return the indices of one valid matching pair!`
      },
      realWorldExample: {
        analogy: `Imagine you have ₹500 in your pocket and are looking at a store price list. You want to pick two items that cost ₹500 combined. Instead of adding every item price with every other item price, you write down each price you see in a notebook. For every new item, you calculate (₹500 - price) and check if that exact remaining amount is already written in your notebook!`,
        explanation: `The notebook is a Hash Map. Checking if the remaining amount is in the notebook takes instant constant time.`
      },
      whyItMatters: {
        techniqueSolved: `Replaces linear search lookups with constant-time memory lookups.`,
        whyProgrammersUseIt: `Avoids quadratic O(N^2) time complexity in search problems by trading space for speed.`,
        situationsBenefiting: `Transaction matching, ledger reconciliation, duplicate detection, and real-time gaming pairing.`,
        skillLearned: `Transforming search constraints into key-value memory lookups.`
      },
      realWorldUses: [
        { title: 'Database Indexing & Joins', desc: 'Hash join algorithms in PostgreSQL and MySQL match foreign keys between tables in O(N) time.' },
        { title: 'Financial Ledger Reconciliation', desc: 'Banking audit systems pair offsetting debit (+₹X) and credit (-₹X) ledger entries to balance books automatically.' },
        { title: 'E-Commerce Promotion Discount Pairs', desc: 'Shopping cart engines find pairs of items qualifying for "Buy 2 for ₹500" bundle promotions.' }
      ],
      concepts: [
        { name: 'Array Iteration', whatIsIt: 'Traversing elements sequentially from start to end.', whyNeeded: 'We must inspect items to evaluate candidate numbers.' },
        { name: 'Hash Map (Dictionary)', whatIsIt: 'A key-value memory structure that provides O(1) average lookup speed.', whyNeeded: 'Allows checking if a required complement value was seen before in instant constant time.' }
      ],
      dataStructureExplanation: {
        name: 'Hash Map (Hash Table / Dictionary)',
        whatIsIt: 'A data structure that stores key-value pairs using a hash function.',
        howItWorks: 'It maps keys (number values) directly to array bucket locations where their corresponding indices are stored.',
        whyUsefulHere: 'When inspecting number `x`, we can check if `target - x` exists in the Hash Map in O(1) time.',
        withoutIt: 'Without a Hash Map, we would have to scan the remaining array for every element, taking slow O(N^2) time.',
        connectionToProblem: 'It stores `num -> index` as we iterate, serving as our algorithmic memory.'
      },
      recognitionClues: [
        'Need to find a pair of items satisfying a mathematical equation.',
        'Input size N is up to 10^4 or 10^5 (nested loops will trigger Time Limit Exceeded TLE).',
        'Problem asks for O(1) lookup of previously visited items.',
        'You need to return original element indices (which pre-sorting might disrupt).'
      ],
      bruteForceExplanation: {
        whatBeginnerTries: 'Use two nested `for` loops (outer loop `i`, inner loop `j`) to check every possible pair sum.',
        whyItWorks: 'It exhaustively tests all N * (N - 1) / 2 pair combinations.',
        whatItChecks: 'Whether `nums[i] + nums[j] == target` for all `i != j`.',
        timeComplexity: 'O(N^2) Time | O(1) Space',
        whySlow: 'For N = 10,000, it performs ~50,000,000 operations, causing TLE timeouts on online judge compilers.',
        pseudocode: `FOR i FROM 0 TO N-1:\n    FOR j FROM i+1 TO N-1:\n        IF nums[i] + nums[j] == target:\n            RETURN [i, j]`
      },
      optimizationJourney: [
        { stepName: 'Brute Force Search', desc: 'Nested loops check every pair in O(N^2) time.' },
        { stepName: 'Notice Repeated Work', desc: 'For element `nums[i]`, we repeatedly search remaining array for `target - nums[i]`.' },
        { stepName: 'Ask: Can We Remember?', desc: 'Instead of searching repeatedly, store visited numbers in a Hash Map.' },
        { stepName: 'Single-Pass Memory Lookup', desc: 'For each number, query Hash Map for `target - num`. If present, return indices immediately.' }
      ],
      stepByStepApproach: [
        { stepNumber: 1, title: 'Initialize Hash Map', action: 'Create an empty Hash Map `seen` to store number values as keys and array indices as values.', why: 'We need memory to remember numbers we have already seen.' },
        { stepNumber: 2, title: 'Iterate Through Array', action: 'Loop through `nums` with index `i` from 0 to N-1.', why: 'We must examine each element as a potential candidate.' },
        { stepNumber: 3, title: 'Calculate Required Complement', action: 'Compute `complement = target - nums[i]`.', why: 'This tells us the exact matching number needed to reach the target sum.' },
        { stepNumber: 4, title: 'Check Hash Map Memory', action: 'If `complement` exists in `seen`, return `[seen[complement], i]`.', why: 'We found the matching pair! `seen[complement]` is the first index, `i` is the second index.' },
        { stepNumber: 5, title: 'Store Current Element', action: 'If not found, insert `seen[nums[i]] = i` and proceed to next iteration.', why: 'Remembers current number for subsequent elements.' }
      ],
      pseudocode: `FUNCTION solve(nums, target):\n    CREATE empty HashMap 'seen'\n    FOR index i FROM 0 TO length(nums) - 1:\n        num = nums[i]\n        diff = target - num\n        IF diff EXISTS IN seen:\n            RETURN [seen[diff], i]\n        END IF\n        seen[num] = i\n    END FOR\n    RETURN []`,
      exampleWalkthrough: {
        sampleInput: `nums = [2, 7, 11, 15], target = 9`,
        targetOutput: `[0, 1]`,
        steps: [
          { currentVal: 'nums[0] = 2', currentIndex: 'i = 0', variables: 'diff = 9 - 2 = 7', dsState: 'seen = {}', decision: '7 is NOT in seen. Store seen[2] = 0.', nextStep: 'Move to i = 1' },
          { currentVal: 'nums[1] = 7', currentIndex: 'i = 1', variables: 'diff = 9 - 7 = 2', dsState: 'seen = { 2: 0 }', decision: '2 IS FOUND in seen at index 0! Return [0, 1].', nextStep: 'Done! Return [0, 1]' }
        ]
      },
      edgeCases: [
        { caseName: 'Array with 2 Elements', description: 'Smallest valid array size (e.g. nums = [3, 3], target = 6).', whyItMatters: 'Ensures algorithm handles minimal input bounds correctly.' },
        { caseName: 'Negative Numbers', description: 'Inputs containing negative values (e.g. nums = [-3, 4, 3, 90], target = 0).', whyItMatters: 'Validates that subtraction `target - num` works across negative integers.' },
        { caseName: 'Identical Duplicate Values', description: 'Target formed by duplicate numbers (e.g. nums = [3, 3], target = 6).', whyItMatters: 'Guarantees complement lookup retrieves first index before overwriting key.' }
      ],
      commonMistakes: [
        { mistakeName: 'Using Same Element Twice', wrongThinking: 'Matching nums[i] with itself (e.g. target = 6, nums[0] = 3, returning [0,0]).', betterThinking: 'Check complement in map before storing current element, or verify index i != j.' },
        { mistakeName: 'Pre-sorting Array Disruption', wrongThinking: 'Sorting nums and using two pointers without tracking original index map.', betterThinking: 'Use Hash Map or store (val, orig_index) tuples if pre-sorting.' }
      ],
      complexityExplanation: {
        timeComplexity: 'O(N)',
        timeSimple: 'Linear Time Complexity',
        whyTime: 'We iterate through the array of N elements at most once. Hash Map lookup and insertion execute in O(1) average constant time.',
        spaceComplexity: 'O(N)',
        spaceSimple: 'Linear Space Complexity',
        whySpace: 'In the worst-case scenario where no pair matches until the final element, up to N elements are stored in the Hash Map memory.'
      },
      thinkingQuestions: [
        { question: 'If you had to solve this without writing code, what information would you keep track of as you read each number?', hint: 'Think about what notebook entry prevents starting over from item 0.', answer: 'You write down each number you read and its position, checking if the number needed to reach target was already written down.' },
        { question: 'Why does pre-sorting the array make returning indices harder?', hint: 'Consider what sorting does to array positions.', answer: 'Sorting rearranges element positions, so index 0 after sorting may not be the original index 0 requested by the problem.' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 2. CONTAINER WITH MOST WATER & TWO POINTERS CONVERGING
  // --------------------------------------------------------------------------
  if (id.includes('container') || id.includes('water') || (topic === 'Two Pointers' && problem.pattern.includes('Converging'))) {
    return {
      problemOverview: {
        about: `Finding two vertical lines in an elevation array that form a container holding the maximum volume of water.`,
        given: `An array of line heights \`height = [1,8,6,2,5,4,8,3,7]\`.`,
        needToFind: `The maximum area of water that can be trapped between any two vertical lines.`,
        returnWhat: `An integer representing the maximum calculated water container area.`,
        mainChallenge: `Maximizing both container width (distance between lines) and height (bounded by the shorter line) in O(N) time.`
      },
      problemStatement: {
        statement: problem.description,
        inputFormat: `height (Array of integers)`,
        outputFormat: `Integer (Maximum Area)`,
        constraints: problem.constraints,
        expectedResult: ex.output
      },
      whatIsItReallyAsking: {
        simpleTranslation: `Basically, pick two vertical walls from a row of walls so that the water contained between them is as large as possible.`,
        whatYouDoNotNeedToDo: `You do NOT need to fill water over every individual wall—just select two outer walls to form a single maximum container!`
      },
      realWorldExample: {
        analogy: `Imagine building a water tank between two dam walls of different heights. The water level can only rise as high as the SHORTER dam wall; any extra water spills over the shorter wall. To maximize water volume, you want walls that are both tall and far apart!`,
        explanation: `Volume = Width × Min(Height1, Height2). Moving the shorter wall inward is the only way to potentially find a taller boundary.`
      },
      whyItMatters: {
        techniqueSolved: `Efficiently shrinking search space using the Two Pointers invariant.`,
        whyProgrammersUseIt: `Eliminates O(N^2) pair checks by proving that moving the taller line inward can never increase area.`,
        situationsBenefiting: `Resource allocation, maximum rectangular bounding boxes, and geometric optimization.`,
        skillLearned: `Using mathematical proof of monotonicity to eliminate search candidates.`
      },
      realWorldUses: [
        { title: 'Computer Graphics Bounding Boxes', desc: 'Finding maximum inner bounding boxes for rendering textures and collision meshes.' },
        { title: 'Signal Processing Bandwidth Maximums', desc: 'Calculating maximum throughput capacity across fluctuating signal frequency boundaries.' },
        { title: 'Civil Dam Reservoir Design', desc: 'Optimizing water reservoir retention capacity given natural terrain elevation maps.' }
      ],
      concepts: [
        { name: 'Two Pointers Invariant', whatIsIt: 'Maintaining two index pointers at opposite ends of an array and moving them inward.', whyNeeded: 'Allows exploring maximum width first and shrinking candidates deterministically.' },
        { name: 'Area Formula Math', whatIsIt: 'Area = (right - left) * min(height[left], height[right]).', whyNeeded: 'Determines actual water volume bounded by the shorter wall.' }
      ],
      dataStructureExplanation: {
        name: 'Two Pointers (Left and Right Index Markers)',
        whatIsIt: 'Two integer variables (`left = 0`, `right = N - 1`) tracking array boundaries.',
        howItWorks: '`left` starts at index 0, `right` starts at N - 1. We compare `height[left]` and `height[right]`.',
        whyUsefulHere: 'Width is maximum at start. To find a larger area as width decreases, height MUST increase.',
        withoutIt: 'Checking all pairs takes O(N^2) time, which fails on large inputs (N = 10^5).',
        connectionToProblem: 'Moving the pointer at the shorter height guarantees we never miss a larger area candidate.'
      },
      recognitionClues: [
        'Problem asks for maximum area or container between pairs in an array.',
        'Array indices represent sequential spatial distance.',
        'Brute force checking all pairs takes O(N^2), but array ordering allows two-way pointer convergence.'
      ],
      bruteForceExplanation: {
        whatBeginnerTries: 'Check all pair combinations `(i, j)` with two nested loops and track max area.',
        whyItWorks: 'Exhaustively evaluates every possible container pair.',
        whatItChecks: '`area = (j - i) * min(height[i], height[j])` for all `i < j`.',
        timeComplexity: 'O(N^2) Time | O(1) Space',
        whySlow: 'N = 100,000 means 5 billion operations, triggering TLE.',
        pseudocode: `FOR i FROM 0 TO N-1:\n    FOR j FROM i+1 TO N-1:\n        area = (j - i) * MIN(height[i], height[j])\n        max_water = MAX(max_water, area)`
      },
      optimizationJourney: [
        { stepName: 'Start Max Width', desc: 'Place left pointer at start (0) and right pointer at end (N-1).' },
        { stepName: 'Calculate Area', desc: 'Compute water volume = (right - left) * min(height[left], height[right]).' },
        { stepName: 'Identify Bottleneck', desc: 'Water level is constrained by the SHORTER wall.' },
        { stepName: 'Smart Convergence', desc: 'Move the shorter wall inward. Moving taller wall inward would only decrease width without raising height!' }
      ],
      stepByStepApproach: [
        { stepNumber: 1, title: 'Initialize Pointers', action: 'Set `left = 0`, `right = height.length - 1`, and `max_water = 0`.', why: 'Starts at maximum possible container width.' },
        { stepNumber: 2, title: 'Calculate Current Water', action: 'Compute `current_water = (right - left) * min(height[left], height[right])`.', why: 'Evaluates area formed by current boundary walls.' },
        { stepNumber: 3, title: 'Update Maximum Record', action: 'Set `max_water = max(max_water, current_water)`.', why: 'Keeps track of highest water volume encountered.' },
        { stepNumber: 4, title: 'Move Shorter Pointer', action: 'If `height[left] < height[right]`, increment `left++`. Else, decrement `right--`.', why: 'Moving shorter wall is the ONLY action that can yield a taller container.' }
      ],
      pseudocode: `FUNCTION maxArea(height):\n    left = 0, right = length(height) - 1\n    max_water = 0\n    WHILE left < right:\n        water = (right - left) * MIN(height[left], height[right])\n        max_water = MAX(max_water, water)\n        IF height[left] < height[right]:\n            left = left + 1\n        ELSE:\n            right = right - 1\n        END IF\n    END WHILE\n    RETURN max_water`,
      exampleWalkthrough: {
        sampleInput: `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`,
        targetOutput: `49`,
        steps: [
          { currentVal: 'h[0]=1, h[8]=7', currentIndex: 'left=0, right=8', variables: 'width=8, h=1, water=8', dsState: 'max_water = 8', decision: 'h[left] < h[right] (1 < 7) -> Move left++', nextStep: 'left becomes 1' },
          { currentVal: 'h[1]=8, h[8]=7', currentIndex: 'left=1, right=8', variables: 'width=7, h=7, water=49', dsState: 'max_water = 49 (NEW MAX)', decision: 'h[left] >= h[right] (8 >= 7) -> Move right--', nextStep: 'right becomes 7' }
        ]
      },
      edgeCases: [
        { caseName: 'Two Elements Array', description: 'Minimal input size `height = [1, 1]`.', whyItMatters: 'Area is simply `1 * min(1,1) = 1`.' },
        { caseName: 'All Heights Identical', description: 'Array like `[5, 5, 5, 5]`.', whyItMatters: 'Max area is outer boundaries `(3-0)*5 = 15`.' }
      ],
      commonMistakes: [
        { mistakeName: 'Moving Taller Pointer', wrongThinking: 'Moving the taller line inward hoping to find an even taller line.', betterThinking: 'Moving taller line decreases width while container height remains limited by shorter line.' }
      ],
      complexityExplanation: {
        timeComplexity: 'O(N)',
        timeSimple: 'Linear Time Complexity',
        whyTime: 'Each step moves either left or right pointer by 1, taking at most N steps total.',
        spaceComplexity: 'O(1)',
        spaceSimple: 'Constant Auxiliary Space',
        whySpace: 'Only integer pointer variables (`left`, `right`, `max_water`) are used.'
      },
      thinkingQuestions: [
        { question: 'Why is moving the taller pointer inward guaranteed to never produce a larger area?', hint: 'Think about what happens to width and maximum height.', answer: 'Width decreases by 1, and height cannot exceed the shorter wall. So area can only stay same or decrease!' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 3. BINARY SEARCH PROBLEMS
  // --------------------------------------------------------------------------
  if (id.includes('binary-search') || topic === 'Binary Search') {
    return {
      problemOverview: {
        about: `Locating a target value within a sorted array by repeatedly dividing the search interval in half.`,
        given: `A sorted array of numbers \`nums\` and a \`target\` value to find.`,
        needToFind: `The index position of \`target\` if present in the array.`,
        returnWhat: `Integer index of target (or \`-1\` if target does not exist).`,
        mainChallenge: `Achieving O(log N) runtime speed by halving search boundaries on every iteration.`
      },
      problemStatement: {
        statement: problem.description,
        inputFormat: `nums (Sorted Array), target (Integer)`,
        outputFormat: `Integer Index`,
        constraints: problem.constraints,
        expectedResult: ex.output
      },
      whatIsItReallyAsking: {
        simpleTranslation: `Imagine guessing a secret number between 1 and 100. If you guess 50 and are told "too high", you eliminate all numbers 50-100 instantly!`,
        whatYouDoNotNeedToDo: `You do NOT need to check numbers one by one from start to end!`
      },
      realWorldExample: {
        analogy: `Imagine looking for the word "Telephone" in a physical dictionary book. Instead of turning every page from page 1, you open the book near the middle. Seeing "M", you know "T" comes after "M", so you throw away the first half of the book and focus only on the right half!`,
        explanation: `Because dictionary words are sorted alphabetically, checking the middle page eliminates half the pages in a single step.`
      },
      whyItMatters: {
        techniqueSolved: `Eliminates half of remaining candidates on every step, scaling effortlessly to massive datasets.`,
        whyProgrammersUseIt: `Replaces linear O(N) scanning with ultra-fast O(log N) logarithmic search (searching 1 billion items in just 30 steps!).`,
        situationsBenefiting: `Database B-Tree indexing, git bisect bug finding, and root-finding math algorithms.`,
        skillLearned: `Search space reduction using invariant conditions.`
      },
      realWorldUses: [
        { title: 'Database Primary Key Indexing', desc: 'B-Tree database indexes use binary search to retrieve records from millions of table rows instantly.' },
        { title: 'Git Bisect Debugging', desc: 'Git bisect performs binary search across commit history to locate the exact commit that introduced a bug.' },
        { title: 'Auto-Complete Dictionary Lookup', desc: 'Predictive keyboards search sorted word lists to suggest words in milliseconds.' }
      ],
      concepts: [
        { name: 'Sorted Property Invariant', whatIsIt: 'Elements arranged in non-decreasing order.', whyNeeded: 'Allows determining whether target lies to the left or right of any index.' },
        { name: 'Logarithmic Division', whatIsIt: 'Dividing search range by 2 at each iteration.', whyNeeded: 'Guarantees execution in O(log N) time.' }
      ],
      dataStructureExplanation: {
        name: 'Pointers (Low, Mid, High)',
        whatIsIt: 'Three integer variables defining active search boundaries.',
        howItWorks: '`low` starts at 0, `high` at N-1. `mid = low + (high - low) / 2`.',
        whyUsefulHere: 'Inspects element at `mid`. If `nums[mid] < target`, target MUST be in right half (`low = mid + 1`).',
        withoutIt: 'Scanning one by one takes O(N) linear time.',
        connectionToProblem: 'Monotonic sorted property enables instant elimination of half the search space.'
      },
      recognitionClues: [
        'Input array is SORTED or monotonically increasing/decreasing.',
        'Problem requires O(log N) time complexity explicitly.',
        'Searching for target value, insertion position, or boundary condition.'
      ],
      bruteForceExplanation: {
        whatBeginnerTries: 'Use a linear for-loop from index 0 to N-1 to check `if nums[i] == target`.',
        whyItWorks: 'Guarantees finding target if present.',
        whatItChecks: 'Every element sequentially.',
        timeComplexity: 'O(N) Time | O(1) Space',
        whySlow: 'Scanning 1,000,000 elements requires 1,000,000 steps compared to Binary Search which takes only 20 steps!',
        pseudocode: `FOR i FROM 0 TO N-1:\n    IF nums[i] == target:\n        RETURN i\nRETURN -1`
      },
      optimizationJourney: [
        { stepName: 'Linear Search', desc: 'Inspect items one by one in O(N) time.' },
        { stepName: 'Notice Sorted Property', desc: 'Data is sorted! Element at middle gives directional clue.' },
        { stepName: 'Eliminate Half Space', desc: 'If mid element is smaller than target, target CANNOT be in left half.' },
        { stepName: 'Logarithmic Performance', desc: 'Reduce search space from N to N/2 to N/4... reaching answer in O(log N) steps.' }
      ],
      stepByStepApproach: [
        { stepNumber: 1, title: 'Set Initial Boundaries', action: 'Set `low = 0` and `high = nums.length - 1`.', why: 'Defines initial search range covering whole array.' },
        { stepNumber: 2, title: 'Calculate Middle Index', action: 'While `low <= high`, compute `mid = low + Math.floor((high - low) / 2)`.', why: 'Prevents integer overflow while picking middle candidate.' },
        { stepNumber: 3, title: 'Check Middle Element', action: 'If `nums[mid] == target`, return `mid`.', why: 'Target found!' },
        { stepNumber: 4, title: 'Adjust Search Window', action: 'If `nums[mid] < target`, set `low = mid + 1`. Else set `high = mid - 1`.', why: 'Eliminates half the search window where target cannot exist.' }
      ],
      pseudocode: `FUNCTION search(nums, target):\n    low = 0, high = length(nums) - 1\n    WHILE low <= high:\n        mid = low + (high - low) / 2\n        IF nums[mid] == target:\n            RETURN mid\n        ELSE IF nums[mid] < target:\n            low = mid + 1\n        ELSE:\n            high = mid - 1\n        END IF\n    END WHILE\n    RETURN -1`,
      exampleWalkthrough: {
        sampleInput: `nums = [-1, 0, 3, 5, 9, 12], target = 9`,
        targetOutput: `4`,
        steps: [
          { currentVal: 'nums[2] = 3', currentIndex: 'low=0, high=5 -> mid=2', variables: '3 < 9 (target is right)', dsState: 'Search right half', decision: 'nums[mid] < target -> set low = mid + 1 (3)', nextStep: 'low becomes 3' },
          { currentVal: 'nums[4] = 9', currentIndex: 'low=3, high=5 -> mid=4', variables: '9 == 9 (MATCH!)', dsState: 'Target Found', decision: 'nums[4] == target -> Return index 4', nextStep: 'Done!' }
        ]
      },
      edgeCases: [
        { caseName: 'Target Out of Bounds', description: 'Target smaller than nums[0] or larger than nums[N-1].', whyItMatters: 'Loop terminates cleanly with `low > high` returning -1.' },
        { caseName: 'Single Element Array', description: 'nums = [5], target = 5.', whyItMatters: '`low = high = 0`, mid = 0 matches immediately.' }
      ],
      commonMistakes: [
        { mistakeName: 'Integer Overflow in Mid Calculation', wrongThinking: 'Using `mid = (low + high) / 2`.', betterThinking: 'Use `mid = low + Math.floor((high - low) / 2)` to prevent overflow in languages with fixed integer types.' },
        { mistakeName: 'Infinite Loop in While Condition', wrongThinking: 'Using `while (low < high)` without handling single element window.', betterThinking: 'Use `while (low <= high)` and update `low = mid + 1` / `high = mid - 1`.' }
      ],
      complexityExplanation: {
        timeComplexity: 'O(log N)',
        timeSimple: 'Logarithmic Time Complexity',
        whyTime: 'The search space is divided by 2 at every step. For 1,000,000 items, at most 20 comparisons are performed.',
        spaceComplexity: 'O(1)',
        spaceSimple: 'Constant Auxiliary Space',
        whySpace: 'Only pointer variables (`low`, `high`, `mid`) are stored in memory.'
      },
      thinkingQuestions: [
        { question: 'Why does Binary Search REQUIRE the input array to be sorted?', hint: 'What assumption allows throwing away half the pages in a dictionary?', answer: 'Without sorting, seeing nums[mid] < target gives NO information about whether target is in left or right half!' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 4. FALLBACK / GENERAL DSA PROBLEM CONTENT
  // --------------------------------------------------------------------------
  return {
    problemOverview: {
      about: `Solving "${problem.title}" using ${problem.pattern} techniques under topic ${topic}.`,
      given: `Input: ${ex.input}`,
      needToFind: `Calculated target result: ${ex.output}`,
      returnWhat: `Correct result value matching problem specification.`,
      mainChallenge: `Formulating an optimal algorithmic approach within time limit constraints.`
    },
    problemStatement: {
      statement: problem.description,
      inputFormat: `Input data structure matching problem specification`,
      outputFormat: `Target result output`,
      constraints: problem.constraints,
      expectedResult: ex.output
    },
    whatIsItReallyAsking: {
      simpleTranslation: `Process input data using structural invariants to return the expected result efficiently.`,
      whatYouDoNotNeedToDo: `Avoid redundant checks or brute force loops that exceed time bounds.`
    },
    realWorldExample: {
      analogy: `Imagine organizing index cards in a filing cabinet to find key information quickly.`,
      explanation: `Using the right data structure allows jumping directly to required answers.`
    },
    whyItMatters: {
      techniqueSolved: `Optimizes search and state tracking using ${problem.pattern}.`,
      whyProgrammersUseIt: `Reduces computational complexity and improves application throughput.`,
      situationsBenefiting: `Production backend systems, data pipelines, and core software utilities.`,
      skillLearned: `Algorithmic problem solving and data structure selection.`
    },
    realWorldUses: [
      { title: 'Core Software Framework Utilities', desc: 'Used in standard library implementations, database queries, and system tools.' }
    ],
    concepts: [
      { name: problem.topic, whatIsIt: `Core algorithmic topic in computer science.`, whyNeeded: `Provides foundational structures to solve the problem.` }
    ],
    dataStructureExplanation: {
      name: problem.pattern,
      whatIsIt: `Algorithmic technique for ${topic}.`,
      howItWorks: `Iterates or traverses elements while maintaining state invariants.`,
      whyUsefulHere: `Allows solving the problem in optimal time.`,
      withoutIt: `Naive approaches require excessive execution time.`,
      connectionToProblem: `Directly satisfies problem performance constraints.`
    },
    recognitionClues: [
      `Key pattern indicator: ${problem.pattern}`,
      `Topic domain: ${topic}`
    ],
    bruteForceExplanation: {
      whatBeginnerTries: `Inspect every combination using basic loops.`,
      whyItWorks: `Evaluates all options exhaustively.`,
      whatItChecks: `All possible states.`,
      timeComplexity: `O(N^2) or higher`,
      whySlow: `Triggers Time Limit Exceeded (TLE) on large inputs.`
    },
    optimizationJourney: [
      { stepName: 'Brute Force', desc: 'Exhaustive check of candidates.' },
      { stepName: 'Optimal Pattern', desc: `Apply ${problem.pattern} to optimize execution.` }
    ],
    stepByStepApproach: [
      { stepNumber: 1, title: 'Initialize Variables', action: 'Set up pointers or data structures.', why: 'Establishes initial state.' },
      { stepNumber: 2, title: 'Process Elements', action: 'Iterate through input and apply pattern logic.', why: 'Computes target answer.' }
    ],
    pseudocode: `FUNCTION solve(input):\n    INITIALIZE state\n    FOR item IN input:\n        PROCESS item\n    RETURN result`,
    exampleWalkthrough: {
      sampleInput: ex.input,
      targetOutput: ex.output,
      steps: [
        { currentVal: 'Initial item', currentIndex: 'Step 1', variables: 'State initialized', dsState: 'Active', decision: 'Process candidate', nextStep: 'Complete execution' }
      ]
    },
    edgeCases: [
      { caseName: 'Empty or Minimal Input', description: 'Handles boundary constraints.', whyItMatters: 'Prevents index errors or runtime exceptions.' }
    ],
    commonMistakes: [
      { mistakeName: 'Off-by-one Error', wrongThinking: 'Incorrect loop index bounds.', betterThinking: 'Verify loop conditions explicitly.' }
    ],
    complexityExplanation: {
      timeComplexity: problem.timeComplexity || 'O(N)',
      timeSimple: 'Optimal Time Complexity',
      whyTime: 'Executes within expected algorithmic bounds.',
      spaceComplexity: problem.spaceComplexity || 'O(1)',
      spaceSimple: 'Optimal Space Complexity',
      whySpace: 'Uses minimal auxiliary memory.'
    },
    thinkingQuestions: [
      { question: 'What is the key invariant that makes this approach optimal?', hint: 'Consider how memory or pointer movement reduces work.', answer: 'The structure avoids redundant candidate comparisons.' }
    ]
  };
}
