import { motivationMessages, formatMotivationMessage } from '../src/data/motivationData.ts';

console.log(`\n==============================================`);
console.log(`TESTING ALGORISE POPUP MESSAGE SYSTEM`);
console.log(`==============================================\n`);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Check total message count and unique IDs
assert(motivationMessages.length >= 30, `Contains a rich pool of ${motivationMessages.length} distinct messages`);

const ids = motivationMessages.map(m => m.id);
const uniqueIds = new Set(ids);
assert(ids.length === uniqueIds.size, `All message IDs are unique (${ids.length} total)`);

// 2. Test formatting safety against undefined/null/NaN
const safeTest1 = formatMotivationMessage("Hello {username}! Streak is {streak}, points {points}, attempts {attempts}", {});
assert(!safeTest1.includes('undefined') && !safeTest1.includes('null') && !safeTest1.includes('NaN'), `Safe formatting with empty context: "${safeTest1}"`);

const safeTest2 = formatMotivationMessage("Testing {algorithm} with {level} and {daysAway} days", {
  algorithm: undefined,
  level: undefined,
  daysAway: undefined
});
assert(!safeTest2.includes('undefined') && !safeTest2.includes('null') && !safeTest2.includes('NaN'), `Safe formatting with undefined fields: "${safeTest2}"`);

// 3. Test required context categories
const requiredCategories = [
  'PROBLEM_BROWSING',
  'SPEEDRUN_BROWSING',
  'STUCK_ON_PROBLEM',
  'IDLE_ON_PROBLEM',
  'FAILED_ATTEMPTS',
  'COMPILE_ERROR',
  'RUNTIME_ERROR',
  'TIME_LIMIT_EXCEEDED',
  'ACCEPTED',
  'FAST_SOLVE',
  'MANY_HINTS',
  'REPEATED_RUNS',
  'REPEATED_EDITS',
  'VISUALIZER',
  'LEARNING',
  'LESSON_COMPLETE',
  'BROKEN_STREAK',
  'RETURNING_USER',
  'BINARY_SEARCH',
  'RECURSION',
  'DYNAMIC_PROGRAMMING',
  'HASH_MAP',
  'STACK',
  'QUEUE',
  'GRAPH',
  'SORTING',
  'TWO_POINTERS',
  'SLIDING_WINDOW',
  'TREES'
];

requiredCategories.forEach(cat => {
  const count = motivationMessages.filter(m => m.category === cat).length;
  assert(count > 0, `Category "${cat}" has ${count} distinct message(s)`);
});

// 4. Verify specific jokes from user requirements
const sampleChecks = [
  "Collecting problems like Pokémon",
  "Bro is speedrunning the problem list",
  "array is starting to feel awkward",
  "At this point you're not debugging. You're negotiating.",
  "The compiler has reviewed your code and would like a word.",
  "Your code ran. Unfortunately, it chose violence.",
  "WAIT. IT ACTUALLY WORKS?!",
  "Leave some problems for the rest of us",
  "One more hint and I'm basically pair programming",
  "The problem hasn't moved. Your mouse hasn't moved.",
  "That line has been changed so many times",
  "Finally. We're going to SEE what your algorithm is actually doing.",
  "suspiciously effective alternative to guessing",
  "unnecessary amount of computer science knowledge",
  "Your streak has left the chat.",
  "Look who remembered Algorise exists.",
  "You checked the middle. The algorithm is proud of you.",
  "Your function called itself again",
  "You remembered something. That's basically DP.",
  "remembering things in a Hash Map",
  "Last in, first out. Unlike your unfinished assignments",
  "BFS has entered the queue.",
  "Just because every node is connected doesn't mean your solution is.",
  "Your array is finally getting organized",
  "Two pointers walking toward each other. Still a better love story than Twilight.",
  "Expanding the window, shrinking the window"
];

sampleChecks.forEach(sample => {
  const found = motivationMessages.some(m => m.template.toLowerCase().includes(sample.toLowerCase()));
  assert(found, `Contains required witty joke: "${sample.substring(0, 45)}..."`);
});

console.log(`\n==============================================`);
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
console.log(`==============================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
