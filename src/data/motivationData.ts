export type MotivationCategory =
  | 'LOGIN'
  | 'IDLE'
  | 'IDLE_ON_PROBLEM'
  | 'TAB_RETURN'
  | 'STUCK_ON_PROBLEM'
  | 'FAILED_ATTEMPTS'
  | 'COMPILE_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'PROBLEM_SOLVED'
  | 'ACCEPTED'
  | 'FAST_SOLVE'
  | 'MANY_HINTS'
  | 'REPEATED_RUNS'
  | 'REPEATED_EDITS'
  | 'STREAK'
  | 'BROKEN_STREAK'
  | 'PROBLEM_BROWSING'
  | 'SPEEDRUN_BROWSING'
  | 'LONG_SESSION'
  | 'RETURNING_USER'
  | 'FIRST_PROBLEM'
  | 'FIRST_ACCEPTED'
  | 'POINTS'
  | 'LEARNING'
  | 'LESSON_COMPLETE'
  | 'VISUALIZER'
  | 'RANDOM_CHAOS'
  | 'BINARY_SEARCH'
  | 'RECURSION'
  | 'DYNAMIC_PROGRAMMING'
  | 'BFS'
  | 'DFS'
  | 'SLIDING_WINDOW'
  | 'HASH_MAP'
  | 'TWO_POINTERS'
  | 'STACK'
  | 'QUEUE'
  | 'GRAPH'
  | 'SORTING'
  | 'TREES';

export type PersonalityLevel = 'funny' | 'sarcastic' | 'playful' | 'cs_chaos';

export interface MotivationMessage {
  id: string;
  category: MotivationCategory;
  personality: PersonalityLevel;
  badgeTitle: string;
  badgeVariant: 'blue' | 'pink' | 'amber' | 'purple' | 'green';
  template: string;
}

export interface MotivationContext {
  username?: string;
  streak?: number;
  problemsSolved?: number;
  points?: number;
  algorithm?: string;
  level?: string | number;
  attempts?: number;
  daysAway?: number;
}

// Safely format variables to prevent rendering undefined, null, or NaN
export const formatMotivationMessage = (template: string, ctx: MotivationContext = {}): string => {
  const username = ctx.username && ctx.username !== 'undefined' ? ctx.username : 'Coder';
  const streak = ctx.streak !== undefined && !isNaN(Number(ctx.streak)) ? Number(ctx.streak) : 1;
  const problemsSolved = ctx.problemsSolved !== undefined && !isNaN(Number(ctx.problemsSolved)) ? Number(ctx.problemsSolved) : 0;
  const points = ctx.points !== undefined && !isNaN(Number(ctx.points)) ? Number(ctx.points) : 100;
  const algorithm = ctx.algorithm && ctx.algorithm !== 'undefined' ? ctx.algorithm : 'this problem';
  const level = ctx.level !== undefined && ctx.level !== 'undefined' ? ctx.level : 1;
  const attempts = ctx.attempts !== undefined && !isNaN(Number(ctx.attempts)) ? Number(ctx.attempts) : 1;
  const daysAway = ctx.daysAway !== undefined && !isNaN(Number(ctx.daysAway)) ? Number(ctx.daysAway) : 2;

  return template
    .replace(/\{username\}/g, username)
    .replace(/\{streak\}/g, String(streak))
    .replace(/\{problemsSolved\}/g, String(problemsSolved))
    .replace(/\{points\}/g, String(points))
    .replace(/\{algorithm\}/g, algorithm)
    .replace(/\{level\}/g, String(level))
    .replace(/\{attempts\}/g, String(attempts))
    .replace(/\{daysAway\}/g, String(daysAway));
};

export const motivationMessages: MotivationMessage[] = [
  // =========================================================================
  // 1. BROWSING_PROBLEMS (Browsing the problem list)
  // =========================================================================
  {
    id: 'browse-1',
    category: 'PROBLEM_BROWSING',
    personality: 'sarcastic',
    badgeTitle: 'Collector Syndrome 🎒',
    badgeVariant: 'amber',
    template: "Collecting problems like Pokémon isn't the same as solving them."
  },
  {
    id: 'browse-2',
    category: 'PROBLEM_BROWSING',
    personality: 'playful',
    badgeTitle: 'Window Shopper 🛍️',
    badgeVariant: 'blue',
    template: "You've scrolled through half the catalog. Are we window shopping for algorithms today?"
  },
  {
    id: 'browse-3',
    category: 'PROBLEM_BROWSING',
    personality: 'funny',
    badgeTitle: 'Mental Backlog 📁',
    badgeVariant: 'purple',
    template: "Adding problems to your mental backlog where dreams go to rest peacefully."
  },
  {
    id: 'browse-4',
    category: 'PROBLEM_BROWSING',
    personality: 'cs_chaos',
    badgeTitle: 'Nutritional Warning 🏷️',
    badgeVariant: 'pink',
    template: "You're inspecting difficulty badges like nutrition labels you're definitely going to ignore."
  },
  {
    id: 'browse-5',
    category: 'PROBLEM_BROWSING',
    personality: 'sarcastic',
    badgeTitle: 'Cost Analysis 💸',
    badgeVariant: 'amber',
    template: "Picking a problem is free. Actually solving it has a non-refundable emotional cost."
  },

  // =========================================================================
  // 2. SPEEDRUN_BROWSING (Opening many problems quickly without solving)
  // =========================================================================
  {
    id: 'speedrun-1',
    category: 'SPEEDRUN_BROWSING',
    personality: 'sarcastic',
    badgeTitle: 'Speedrunner Alert 🏎️',
    badgeVariant: 'purple',
    template: "Bro is speedrunning the problem list instead of the problems."
  },
  {
    id: 'speedrun-2',
    category: 'SPEEDRUN_BROWSING',
    personality: 'funny',
    badgeTitle: 'Tinder For DSA 🔥',
    badgeVariant: 'pink',
    template: "You're swiping left on algorithms like it's a dating app. Just commit to one."
  },
  {
    id: 'speedrun-3',
    category: 'SPEEDRUN_BROWSING',
    personality: 'cs_chaos',
    badgeTitle: 'Tab Overload 📑',
    badgeVariant: 'amber',
    template: "Opening a problem, reading line 1, and immediately fleeing to the next. Elite survival strategy."
  },
  {
    id: 'speedrun-4',
    category: 'SPEEDRUN_BROWSING',
    personality: 'playful',
    badgeTitle: 'Mythical Quest 🦄',
    badgeVariant: 'blue',
    template: "Still searching for that mythical problem that solves itself upon opening?"
  },

  // =========================================================================
  // 3. STUCK_ON_PROBLEM (Staring at the same problem for a long time)
  // =========================================================================
  {
    id: 'stuck-1',
    category: 'STUCK_ON_PROBLEM',
    personality: 'funny',
    badgeTitle: 'Awkward Silence 👁️',
    badgeVariant: 'pink',
    template: "You've been staring at this problem so long, the array is starting to feel awkward."
  },
  {
    id: 'stuck-2',
    category: 'STUCK_ON_PROBLEM',
    personality: 'sarcastic',
    badgeTitle: 'Staff Engineer Telepathy 🧠',
    badgeVariant: 'purple',
    template: "If staring aggressively at the screen solved test cases, you'd be a Staff Engineer by now."
  },
  {
    id: 'stuck-3',
    category: 'STUCK_ON_PROBLEM',
    personality: 'cs_chaos',
    badgeTitle: 'CPU Maxed ⚡',
    badgeVariant: 'amber',
    template: "Your brain is currently experiencing 100% CPU utilization with 0% throughput."
  },
  {
    id: 'stuck-4',
    category: 'STUCK_ON_PROBLEM',
    personality: 'playful',
    badgeTitle: 'Optical Illusion 🕶️',
    badgeVariant: 'blue',
    template: "Rumor has it that if you squint hard enough, the O(N) solution reveals itself in the white space."
  },
  {
    id: 'stuck-5',
    category: 'STUCK_ON_PROBLEM',
    personality: 'funny',
    badgeTitle: 'BPM Check 💓',
    badgeVariant: 'pink',
    template: "The editor cursor is blinking at 60 BPM. Your heart rate is probably higher."
  },

  // =========================================================================
  // 4. IDLE_ON_PROBLEM (Zero activity while on problem page)
  // =========================================================================
  {
    id: 'idle-1',
    category: 'IDLE_ON_PROBLEM',
    personality: 'sarcastic',
    badgeTitle: 'Vital Signs Alert 🚨',
    badgeVariant: 'amber',
    template: "The problem hasn't moved. Your mouse hasn't moved. We have concerns."
  },
  {
    id: 'idle-2',
    category: 'IDLE_ON_PROBLEM',
    personality: 'cs_chaos',
    badgeTitle: 'Breakpoint Hit ⏸️',
    badgeVariant: 'purple',
    template: "Did your browser freeze, or did your brain hit an unhandled breakpoint?"
  },
  {
    id: 'idle-3',
    category: 'IDLE_ON_PROBLEM',
    personality: 'playful',
    badgeTitle: 'Garbage Collector 🧹',
    badgeVariant: 'blue',
    template: "Still there? Even the JavaScript garbage collector gave up on waiting."
  },
  {
    id: 'idle-4',
    category: 'IDLE_ON_PROBLEM',
    personality: 'funny',
    badgeTitle: 'Telepathy Protocol 📡',
    badgeVariant: 'pink',
    template: "Taking a power nap or telepathically sending binary code directly to the compiler?"
  },

  // =========================================================================
  // 5. FAILED_ATTEMPTS / WRONG_ANSWER (Failed test cases on submit)
  // =========================================================================
  {
    id: 'wa-1',
    category: 'FAILED_ATTEMPTS',
    personality: 'sarcastic',
    badgeTitle: 'Hostage Negotiation 🤝',
    badgeVariant: 'amber',
    template: "At this point you're not debugging. You're negotiating."
  },
  {
    id: 'wa-2',
    category: 'FAILED_ATTEMPTS',
    personality: 'funny',
    badgeTitle: 'Vibe Check Failed 📉',
    badgeVariant: 'pink',
    template: "Expected: [0, 1]. Output: []. Vibes: completely destroyed."
  },
  {
    id: 'wa-3',
    category: 'FAILED_ATTEMPTS',
    personality: 'playful',
    badgeTitle: 'Unreasonable Test 🧪',
    badgeVariant: 'blue',
    template: "Your code is working perfectly. The hidden test cases are just being unreasonable."
  },
  {
    id: 'wa-4',
    category: 'FAILED_ATTEMPTS',
    personality: 'cs_chaos',
    badgeTitle: 'Off By One 📏',
    badgeVariant: 'purple',
    template: "Off by one? Or off by an entire semester of Data Structures?"
  },
  {
    id: 'wa-5',
    category: 'FAILED_ATTEMPTS',
    personality: 'sarcastic',
    badgeTitle: 'Edge or Cliff? 🧗',
    badgeVariant: 'amber',
    template: "That wasn't just an edge case. That was an emotional cliff."
  },
  {
    id: 'wa-6',
    category: 'FAILED_ATTEMPTS',
    personality: 'funny',
    badgeTitle: 'Glass Half Full 🥤',
    badgeVariant: 'pink',
    template: "Passing 1 out of 45 test cases is technically not zero. Progress is progress."
  },

  // =========================================================================
  // 6. COMPILE_ERROR (Compiler syntax errors)
  // =========================================================================
  {
    id: 'ce-1',
    category: 'COMPILE_ERROR',
    personality: 'sarcastic',
    badgeTitle: 'Compiler Intervention 🛑',
    badgeVariant: 'pink',
    template: "The compiler has reviewed your code and would like a word."
  },
  {
    id: 'ce-2',
    category: 'COMPILE_ERROR',
    personality: 'funny',
    badgeTitle: 'Fallen Semicolon 🪦',
    badgeVariant: 'purple',
    template: "A semicolon died for your sins and you didn't even notice."
  },
  {
    id: 'ce-3',
    category: 'COMPILE_ERROR',
    personality: 'cs_chaos',
    badgeTitle: 'New Language Alert ✍️',
    badgeVariant: 'amber',
    template: "Bold strategy inventing brand new programming language syntax on the fly."
  },
  {
    id: 'ce-4',
    category: 'COMPILE_ERROR',
    personality: 'playful',
    badgeTitle: 'Hostage Situation 🧮',
    badgeVariant: 'blue',
    template: "Missing bracket detected. The compiler is holding execution hostage until you find it."
  },
  {
    id: 'ce-5',
    category: 'COMPILE_ERROR',
    personality: 'sarcastic',
    badgeTitle: 'Emotional Damage 💥',
    badgeVariant: 'pink',
    template: "The compiler read line {level} and took personal offense."
  },

  // =========================================================================
  // 7. RUNTIME_ERROR (Runtime exceptions / crashes)
  // =========================================================================
  {
    id: 're-1',
    category: 'RUNTIME_ERROR',
    personality: 'sarcastic',
    badgeTitle: 'Violence Chosen ⚔️',
    badgeVariant: 'pink',
    template: "Your code ran. Unfortunately, it chose violence."
  },
  {
    id: 're-2',
    category: 'RUNTIME_ERROR',
    personality: 'funny',
    badgeTitle: 'Null Search 🔍',
    badgeVariant: 'purple',
    template: "Null Pointer Exception: the computer searched for your logic and found nothing."
  },
  {
    id: 're-3',
    category: 'RUNTIME_ERROR',
    personality: 'cs_chaos',
    badgeTitle: 'Out of Bounds 🚧',
    badgeVariant: 'amber',
    template: "Index out of range. You reached for an element that doesn't exist, like your weekend plans."
  },
  {
    id: 're-4',
    category: 'RUNTIME_ERROR',
    personality: 'playful',
    badgeTitle: 'Forbidden Realm 🌌',
    badgeVariant: 'blue',
    template: "Segmentation fault: your program went exploring forbidden memory realms."
  },
  {
    id: 're-5',
    category: 'RUNTIME_ERROR',
    personality: 'funny',
    badgeTitle: 'Illegal Math 🚫',
    badgeVariant: 'pink',
    template: "Division by zero? The fundamental laws of mathematics would like you to reconsider."
  },

  // =========================================================================
  // 8. TIME_LIMIT_EXCEEDED (Infinite loops / TLE)
  // =========================================================================
  {
    id: 'tle-1',
    category: 'TIME_LIMIT_EXCEEDED',
    personality: 'cs_chaos',
    badgeTitle: 'Existential Crisis 🌀',
    badgeVariant: 'amber',
    template: "Your loop went into an existential crisis and never returned."
  },
  {
    id: 'tle-2',
    category: 'TIME_LIMIT_EXCEEDED',
    personality: 'funny',
    badgeTitle: 'Sentient While Loop 🤖',
    badgeVariant: 'purple',
    template: "Time Limit Exceeded. Your while loop has achieved consciousness and refuses to terminate."
  },
  {
    id: 'tle-3',
    category: 'TIME_LIMIT_EXCEEDED',
    personality: 'sarcastic',
    badgeTitle: 'Generational Algorithm ⏳',
    badgeVariant: 'pink',
    template: "O(2^N) complexity detected. Your grandchildren will be notified when this execution finishes."
  },
  {
    id: 'tle-4',
    category: 'TIME_LIMIT_EXCEEDED',
    personality: 'playful',
    badgeTitle: 'Server Aged 👴',
    badgeVariant: 'blue',
    template: "Execution timed out. Even our cloud server visibly aged a few seconds waiting for line 12."
  },

  // =========================================================================
  // 9. ACCEPTED / PROBLEM_SOLVED (All test cases passed)
  // =========================================================================
  {
    id: 'ac-1',
    category: 'ACCEPTED',
    personality: 'funny',
    badgeTitle: 'Screenshot This 📸',
    badgeVariant: 'green',
    template: "WAIT. IT ACTUALLY WORKS?! Somebody screenshot this before it breaks."
  },
  {
    id: 'ac-2',
    category: 'ACCEPTED',
    personality: 'playful',
    badgeTitle: 'Quick Commit ⚡',
    badgeVariant: 'blue',
    template: "Green text! Quick, commit before the compiler changes its mind."
  },
  {
    id: 'ac-3',
    category: 'ACCEPTED',
    personality: 'sarcastic',
    badgeTitle: 'Productive Citizen 🏆',
    badgeVariant: 'purple',
    template: "Look at you, actually solving problems instead of complaining about tech Twitter."
  },
  {
    id: 'ac-4',
    category: 'ACCEPTED',
    personality: 'cs_chaos',
    badgeTitle: 'Postponed Impostor 🧠',
    badgeVariant: 'pink',
    template: "All test cases passed. Impostor syndrome temporarily postponed for the next 24 hours."
  },
  {
    id: 'ac-5',
    category: 'ACCEPTED',
    personality: 'funny',
    badgeTitle: 'Dopamine Delivery 🍬',
    badgeVariant: 'green',
    template: "Dopamine delivered. Are we moving to the next problem or riding this high for three days?"
  },

  // =========================================================================
  // 10. FAST_SOLVE (Solved in under 45 seconds)
  // =========================================================================
  {
    id: 'fast-1',
    category: 'FAST_SOLVE',
    personality: 'playful',
    badgeTitle: 'Leave Some For Us 🧠',
    badgeVariant: 'purple',
    template: "Okay genius. Leave some problems for the rest of us."
  },
  {
    id: 'fast-2',
    category: 'FAST_SOLVE',
    personality: 'sarcastic',
    badgeTitle: 'Google Recruiter Spotted 🕵️',
    badgeVariant: 'amber',
    template: "Solved in 30 seconds? Either you did this yesterday or you're secretly interviewing at Google."
  },
  {
    id: 'fast-3',
    category: 'FAST_SOLVE',
    personality: 'cs_chaos',
    badgeTitle: 'Black Magic Verified 🪄',
    badgeVariant: 'pink',
    template: "Did you even read the problem statement, or did you guess the solution by smell?"
  },

  // =========================================================================
  // 11. MANY_HINTS (Unlocked multiple hints)
  // =========================================================================
  {
    id: 'hints-1',
    category: 'MANY_HINTS',
    personality: 'sarcastic',
    badgeTitle: 'Pair Programming 👥',
    badgeVariant: 'amber',
    template: "One more hint and I'm basically pair programming for you."
  },
  {
    id: 'hints-2',
    category: 'MANY_HINTS',
    personality: 'funny',
    badgeTitle: 'GTA Cheat Codes 🎮',
    badgeVariant: 'purple',
    template: "Opening all three hints like cheat codes in GTA San Andreas."
  },
  {
    id: 'hints-3',
    category: 'MANY_HINTS',
    personality: 'playful',
    badgeTitle: 'No Shame Zone 🛡️',
    badgeVariant: 'blue',
    template: "No shame in hints. Even senior engineers secretly google 'how to iterate over dictionary'."
  },

  // =========================================================================
  // 12. REPEATED_RUNS (Repeatedly clicking Run Code without submitting)
  // =========================================================================
  {
    id: 'runs-1',
    category: 'REPEATED_RUNS',
    personality: 'funny',
    badgeTitle: 'Stage Fright 🎭',
    badgeVariant: 'pink',
    template: "You've pressed Run {attempts} times. The code is starting to get stage fright."
  },
  {
    id: 'runs-2',
    category: 'REPEATED_RUNS',
    personality: 'sarcastic',
    badgeTitle: 'Elevator Button 🛗',
    badgeVariant: 'amber',
    template: "Hitting Run repeatedly won't change the output, but we deeply respect the optimism."
  },
  {
    id: 'runs-3',
    category: 'REPEATED_RUNS',
    personality: 'cs_chaos',
    badgeTitle: 'Intimidation Tactics 🥊',
    badgeVariant: 'purple',
    template: "Clicking Run 10 times doesn't intimidate the compiler, but it does demonstrate pure passion."
  },

  // =========================================================================
  // 13. REPEATED_EDITS (Constantly modifying code without running)
  // =========================================================================
  {
    id: 'edits-1',
    category: 'REPEATED_EDITS',
    personality: 'sarcastic',
    badgeTitle: 'Identity Crisis 🪞',
    badgeVariant: 'amber',
    template: "That line has been changed so many times it no longer knows who it is."
  },
  {
    id: 'edits-2',
    category: 'REPEATED_EDITS',
    personality: 'funny',
    badgeTitle: 'Universal Balance ⚖️',
    badgeVariant: 'purple',
    template: "Adding and removing the exact same semicolon hoping the universe balances itself out."
  },
  {
    id: 'edits-3',
    category: 'REPEATED_EDITS',
    personality: 'cs_chaos',
    badgeTitle: 'Variable Evolution 🧬',
    badgeVariant: 'pink',
    template: "Renaming variables from `x` to `temp` to `val` to `please_work`."
  },

  // =========================================================================
  // 14. VISUALIZER (Opening or interacting with visualizer)
  // =========================================================================
  {
    id: 'vis-1',
    category: 'VISUALIZER',
    personality: 'playful',
    badgeTitle: 'Visual Proof 🎬',
    badgeVariant: 'blue',
    template: "Finally. We're going to SEE what your algorithm is actually doing."
  },
  {
    id: 'vis-2',
    category: 'VISUALIZER',
    personality: 'funny',
    badgeTitle: 'Synchronized Swimming 🏊',
    badgeVariant: 'purple',
    template: "Watching pointers dance across the array like synchronized swimming."
  },
  {
    id: 'vis-3',
    category: 'VISUALIZER',
    personality: 'cs_chaos',
    badgeTitle: 'Aesthetic Suffering 🎨',
    badgeVariant: 'pink',
    template: "Color-coded glowing nodes make the algorithmic suffering look so aesthetic."
  },

  // =========================================================================
  // 15. LEARNING (Opening Flow of Learning / Learn mode)
  // =========================================================================
  {
    id: 'learn-1',
    category: 'LEARNING',
    personality: 'sarcastic',
    badgeTitle: 'Radical Idea 💡',
    badgeVariant: 'purple',
    template: "Ah yes, learning. A suspiciously effective alternative to guessing."
  },
  {
    id: 'learn-2',
    category: 'LEARNING',
    personality: 'playful',
    badgeTitle: 'Groundbreaking Innovation 📖',
    badgeVariant: 'blue',
    template: "Reading the explanation before writing broken code? Groundbreaking innovation."
  },
  {
    id: 'learn-3',
    category: 'LEARNING',
    personality: 'funny',
    badgeTitle: 'Elite Curriculum 🎓',
    badgeVariant: 'green',
    template: "Theory first, debugging tears later. That is an elite curriculum."
  },

  // =========================================================================
  // 16. LESSON_COMPLETE (Finishing a learning stage / chapter)
  // =========================================================================
  {
    id: 'lesson-1',
    category: 'LESSON_COMPLETE',
    personality: 'funny',
    badgeTitle: 'Knowledge Acquired 🧠',
    badgeVariant: 'green',
    template: "Lesson complete. Your brain has acquired another unnecessary amount of computer science knowledge."
  },
  {
    id: 'lesson-2',
    category: 'LESSON_COMPLETE',
    personality: 'sarcastic',
    badgeTitle: 'Party Trivia 🍸',
    badgeVariant: 'purple',
    template: "Another topic mastered. You are now 3% closer to explaining what a Monad is at parties."
  },

  // =========================================================================
  // 17. BROKEN_STREAK (Losing a streak)
  // =========================================================================
  {
    id: 'streak-lost-1',
    category: 'BROKEN_STREAK',
    personality: 'sarcastic',
    badgeTitle: 'Streak Departed 💨',
    badgeVariant: 'amber',
    template: "Your streak has left the chat."
  },
  {
    id: 'streak-lost-2',
    category: 'BROKEN_STREAK',
    personality: 'funny',
    badgeTitle: 'Clean Slate 🧼',
    badgeVariant: 'pink',
    template: "0 day streak. A clean slate! A fresh start! (And a tragic loss of momentum)."
  },

  // =========================================================================
  // 18. RETURNING_USER (Returning after absence)
  // =========================================================================
  {
    id: 'return-1',
    category: 'RETURNING_USER',
    personality: 'sarcastic',
    badgeTitle: 'Look Who Returned 👀',
    badgeVariant: 'amber',
    template: "Look who remembered Algorise exists."
  },
  {
    id: 'return-2',
    category: 'RETURNING_USER',
    personality: 'playful',
    badgeTitle: 'Drafts Were Lonely 💌',
    badgeVariant: 'purple',
    template: "Welcome back! Your code drafts were getting lonely in localStorage."
  },
  {
    id: 'return-3',
    category: 'RETURNING_USER',
    personality: 'funny',
    badgeTitle: 'Array Reunion 👋',
    badgeVariant: 'blue',
    template: "You've been gone for {daysAway} days. The arrays were starting to miss your syntax errors."
  },

  // =========================================================================
  // 19. ALGORITHM_SPECIFIC: BINARY_SEARCH
  // =========================================================================
  {
    id: 'bs-1',
    category: 'BINARY_SEARCH',
    personality: 'playful',
    badgeTitle: 'Middle Child 🎯',
    badgeVariant: 'blue',
    template: "You checked the middle. The algorithm is proud of you."
  },
  {
    id: 'bs-2',
    category: 'BINARY_SEARCH',
    personality: 'cs_chaos',
    badgeTitle: 'Midpoint Sanity ⚖️',
    badgeVariant: 'purple',
    template: "L = 0, R = N - 1, and somewhere in between lies your remaining sanity."
  },
  {
    id: 'bs-3',
    category: 'BINARY_SEARCH',
    personality: 'funny',
    badgeTitle: 'Logarithmic Hatchet 🪓',
    badgeVariant: 'amber',
    template: "O(log N): chopping your problem in half repeatedly until it stops resisting."
  },

  // =========================================================================
  // 20. ALGORITHM_SPECIFIC: RECURSION
  // =========================================================================
  {
    id: 'rec-1',
    category: 'RECURSION',
    personality: 'funny',
    badgeTitle: 'Family Reunion 👨‍👩‍👧‍👦',
    badgeVariant: 'pink',
    template: "Your function called itself again. At this point it's a full family reunion."
  },
  {
    id: 'rec-2',
    category: 'RECURSION',
    personality: 'cs_chaos',
    badgeTitle: 'Base Case Missing 🪜',
    badgeVariant: 'amber',
    template: "To understand recursion, you must first forget your base case and crash the call stack."
  },
  {
    id: 'rec-3',
    category: 'RECURSION',
    personality: 'sarcastic',
    badgeTitle: 'Stack Overflowing 🧺',
    badgeVariant: 'purple',
    template: "The call stack frames are piling up higher than your unwashed laundry."
  },

  // =========================================================================
  // 21. ALGORITHM_SPECIFIC: DYNAMIC_PROGRAMMING
  // =========================================================================
  {
    id: 'dp-1',
    category: 'DYNAMIC_PROGRAMMING',
    personality: 'funny',
    badgeTitle: 'Memory Unlocked 🧠',
    badgeVariant: 'purple',
    template: "Congratulations. You remembered something. That's basically DP."
  },
  {
    id: 'dp-2',
    category: 'DYNAMIC_PROGRAMMING',
    personality: 'sarcastic',
    badgeTitle: '2D Grid Hoarder 📦',
    badgeVariant: 'amber',
    template: "Why compute something twice when you can waste 800MB storing it in a 2D matrix?"
  },
  {
    id: 'dp-3',
    category: 'DYNAMIC_PROGRAMMING',
    personality: 'cs_chaos',
    badgeTitle: 'Overlapping Decisions 🔄',
    badgeVariant: 'pink',
    template: "Overlapping subproblems: just like your recurring life decisions at 2 AM."
  },

  // =========================================================================
  // 22. ALGORITHM_SPECIFIC: HASH_MAP
  // =========================================================================
  {
    id: 'hash-1',
    category: 'HASH_MAP',
    personality: 'playful',
    badgeTitle: 'Instant Recall ⚡',
    badgeVariant: 'green',
    template: "Your code just discovered that remembering things in a Hash Map is shockingly useful."
  },
  {
    id: 'hash-2',
    category: 'HASH_MAP',
    personality: 'funny',
    badgeTitle: 'Magic Constant 🎩',
    badgeVariant: 'purple',
    template: "O(1) average lookup time. The closest thing to actual black magic in computer science."
  },
  {
    id: 'hash-3',
    category: 'HASH_MAP',
    personality: 'sarcastic',
    badgeTitle: 'Trading Memory 🪙',
    badgeVariant: 'blue',
    template: "Trading RAM for speed like a true 21st-century software engineer."
  },

  // =========================================================================
  // 23. ALGORITHM_SPECIFIC: STACK
  // =========================================================================
  {
    id: 'stack-1',
    category: 'STACK',
    personality: 'sarcastic',
    badgeTitle: 'LIFO Priority 📚',
    badgeVariant: 'amber',
    template: "Last in, first out. Unlike your unfinished assignments from three weeks ago."
  },
  {
    id: 'stack-2',
    category: 'STACK',
    personality: 'playful',
    badgeTitle: 'Holy Trinity ⛪',
    badgeVariant: 'blue',
    template: "Push, pop, and peek. The holy trinity of validating matching parentheses."
  },

  // =========================================================================
  // 24. ALGORITHM_SPECIFIC: QUEUE
  // =========================================================================
  {
    id: 'queue-1',
    category: 'QUEUE',
    personality: 'playful',
    badgeTitle: 'Take A Number 🎫',
    badgeVariant: 'blue',
    template: "BFS has entered the queue. Please take a number and wait in line."
  },
  {
    id: 'queue-2',
    category: 'QUEUE',
    personality: 'funny',
    badgeTitle: 'FIFO Fantasy 🏪',
    badgeVariant: 'green',
    template: "First in, first out. If only airport security and customer service worked this efficiently."
  },

  // =========================================================================
  // 25. ALGORITHM_SPECIFIC: GRAPH
  // =========================================================================
  {
    id: 'graph-1',
    category: 'GRAPH',
    personality: 'sarcastic',
    badgeTitle: 'Disconnected Reality 🕸️',
    badgeVariant: 'purple',
    template: "Just because every node is connected doesn't mean your solution is."
  },
  {
    id: 'graph-2',
    category: 'GRAPH',
    personality: 'cs_chaos',
    badgeTitle: 'Toxic Cycles 🔄',
    badgeVariant: 'pink',
    template: "Cycles detected in the graph. Much like your daily cycle of procrastinating."
  },

  // =========================================================================
  // 26. ALGORITHM_SPECIFIC: SORTING
  // =========================================================================
  {
    id: 'sort-1',
    category: 'SORTING',
    personality: 'funny',
    badgeTitle: 'Organized Chaos 🗂️',
    badgeVariant: 'blue',
    template: "Your array is finally getting organized. Unlike your study schedule."
  },
  {
    id: 'sort-2',
    category: 'SORTING',
    personality: 'sarcastic',
    badgeTitle: 'Bubble Sort Shame 🫧',
    badgeVariant: 'amber',
    template: "Bubble sort is fine for 4 numbers, but please never show this code to an interviewer."
  },

  // =========================================================================
  // 27. ALGORITHM_SPECIFIC: TWO_POINTERS
  // =========================================================================
  {
    id: 'pointers-1',
    category: 'TWO_POINTERS',
    personality: 'playful',
    badgeTitle: 'Better Love Story 💘',
    badgeVariant: 'pink',
    template: "Two pointers walking toward each other. Still a better love story than Twilight."
  },
  {
    id: 'pointers-2',
    category: 'TWO_POINTERS',
    personality: 'funny',
    badgeTitle: 'Meeting In The Middle 🤝',
    badgeVariant: 'purple',
    template: "Left pointer meets right pointer in the middle. Peak romantic DSA."
  },

  // =========================================================================
  // 28. ALGORITHM_SPECIFIC: SLIDING_WINDOW
  // =========================================================================
  {
    id: 'window-1',
    category: 'SLIDING_WINDOW',
    personality: 'funny',
    badgeTitle: 'Attention Span 🪟',
    badgeVariant: 'amber',
    template: "Expanding the window, shrinking the window... feels like your attention span."
  },
  {
    id: 'window-2',
    category: 'SLIDING_WINDOW',
    personality: 'cs_chaos',
    badgeTitle: 'Window Invariant 🪟',
    badgeVariant: 'blue',
    template: "Maintain the window invariant or face an off-by-one catastrophe on test case 38."
  },

  // =========================================================================
  // 29. ALGORITHM_SPECIFIC: TREES
  // =========================================================================
  {
    id: 'tree-1',
    category: 'TREES',
    personality: 'playful',
    badgeTitle: 'Branch Manager 🌳',
    badgeVariant: 'green',
    template: "You're traversing branches. Just don't fall off the call stack."
  },
  {
    id: 'tree-2',
    category: 'TREES',
    personality: 'sarcastic',
    badgeTitle: 'Invert The Binary Tree 🔄',
    badgeVariant: 'purple',
    template: "Invert a binary tree or get rejected by Homebrew's creator. The classic choice."
  },

  // =========================================================================
  // 30. TAB_RETURN (Returning to tab after being away)
  // =========================================================================
  {
    id: 'tab-1',
    category: 'TAB_RETURN',
    personality: 'funny',
    badgeTitle: 'Tab Switch Caught 🕵️',
    badgeVariant: 'pink',
    template: "Welcome back from Reddit/YouTube. That 'quick break' took 15 minutes."
  },
  {
    id: 'tab-2',
    category: 'TAB_RETURN',
    personality: 'sarcastic',
    badgeTitle: 'Stack Overflow Returned 📋',
    badgeVariant: 'blue',
    template: "Back from googling the solution? Don't worry, your secret is safe with the compiler."
  },

  // =========================================================================
  // 31. LONG_SESSION (Studying for over 45 minutes)
  // =========================================================================
  {
    id: 'long-1',
    category: 'LONG_SESSION',
    personality: 'playful',
    badgeTitle: 'Posture Check 🪑',
    badgeVariant: 'amber',
    template: "Uncurl your spine. You currently look like a shrimp staring at a laptop."
  },
  {
    id: 'long-2',
    category: 'LONG_SESSION',
    personality: 'funny',
    badgeTitle: 'Hydration Protocol 💧',
    badgeVariant: 'blue',
    template: "Drink some water. High memory consumption applies to humans too."
  },

  // =========================================================================
  // 32. LOGIN / WELCOME
  // =========================================================================
  {
    id: 'login-1',
    category: 'LOGIN',
    personality: 'playful',
    badgeTitle: 'Coder Detected 👾',
    badgeVariant: 'purple',
    template: "Welcome back {username}. The compiler has been patiently waiting to crush your hopes."
  },
  {
    id: 'login-2',
    category: 'LOGIN',
    personality: 'funny',
    badgeTitle: 'Coffee Conversion ☕',
    badgeVariant: 'amber',
    template: "Hey {username}! Ready to turn caffeine and stress into O(1) solutions?"
  },
  {
    id: 'login-3',
    category: 'LOGIN',
    personality: 'sarcastic',
    badgeTitle: 'Back For More? 🕶️',
    badgeVariant: 'blue',
    template: "Welcome {username}. Another fine day to write code that only works on your machine."
  },
  {
    id: 'login-4',
    category: 'LOGIN',
    personality: 'funny',
    badgeTitle: 'Syntax Survivor 🛡️',
    badgeVariant: 'green',
    template: "Hey {username}, log in confirmed. Time to pretend you understand how your dynamic programming solution worked yesterday."
  }
];
