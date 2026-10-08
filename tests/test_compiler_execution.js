import { codeExecutionService } from '../src/services/codeExecutionService.ts';

console.log(`\n======================================================`);
console.log(`RUNNING FULL COMPILER EXECUTION SUITE (REAL ONLINE JUDGE)`);
console.log(`======================================================\n`);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message, extra = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message} -> ${extra}`);
  }
}

async function runAllTests() {
  // Test 1: Code that prints "Hello World"
  console.log('\n--- 1. Testing Code that prints "Hello World" ---');
  const t1 = await codeExecutionService.runCode('python', 'print("Hello World")');
  assert(t1.status === 'Executed', 'Status is Executed');
  assert(t1.stdout.trim() === 'Hello World', `Real stdout captured: "${t1.stdout.trim()}"`);
  assert(!t1.stdout.includes('[0, 1]'), 'Does not include [0, 1]');
  assert(t1.runtimeMs !== null, `Real runtime measured: ${t1.runtimeMs}ms`);

  // Test 2: Code that prints an array
  console.log('\n--- 2. Testing Code that prints an array ---');
  const t2 = await codeExecutionService.runCode('python', 'arr = [10, 20, 30]\nprint(arr)');
  assert(t2.status === 'Executed', 'Status is Executed');
  assert(t2.stdout.trim() === '[10, 20, 30]', `Real array stdout captured: "${t2.stdout.trim()}"`);

  // Test 3: Code that reads custom input
  console.log('\n--- 3. Testing Code that reads custom input ---');
  const t3 = await codeExecutionService.runCode(
    'python',
    'import sys\nval = sys.stdin.read().strip()\nprint(f"Read: {val}")',
    'CustomData123'
  );
  assert(t3.status === 'Executed', 'Status is Executed');
  assert(t3.stdout.trim() === 'Read: CustomData123', `Custom input passed to stdin: "${t3.stdout.trim()}"`);

  // Test 4: Code with multiline input
  console.log('\n--- 4. Testing Code with multiline input ---');
  const multilineData = 'First Line\nSecond Line\nThird Line';
  const t4 = await codeExecutionService.runCode(
    'python',
    'import sys\nlines = sys.stdin.read().splitlines()\nfor i, l in enumerate(lines):\n    print(f"{i+1}: {l}")',
    multilineData
  );
  assert(t4.status === 'Executed', 'Status is Executed');
  assert(
    t4.stdout.trim() === '1: First Line\n2: Second Line\n3: Third Line',
    `Multiline input processed accurately: "${t4.stdout.trim()}"`
  );

  // Test 5: Code with a compile / syntax error
  console.log('\n--- 5. Testing Code with a compile error ---');
  const t5 = await codeExecutionService.runCode('python', 'def broken_func(\n    print("Broken")');
  assert(t5.status === 'Compilation Error', `Detected Compilation Error: status is "${t5.status}"`);
  assert(t5.stderr.length > 0, `Captured compiler stderr diagnostics: "${t5.stderr.trim().split('\n')[0]}"`);
  assert(t5.stdout === '', 'Stdout is empty on compile error');

  // Test 6: Code with a runtime error
  console.log('\n--- 6. Testing Code with a runtime error ---');
  const t6 = await codeExecutionService.runCode('python', 'a = 10\nb = 0\nprint(a / b)');
  assert(t6.status === 'Runtime Error', `Detected Runtime Error: status is "${t6.status}"`);
  assert(t6.stderr.includes('ZeroDivisionError') || t6.stderr.includes('division by zero'), 'Captured runtime error in stderr');

  // Test 7: Code with timeout / infinite loop
  console.log('\n--- 7. Testing Code with infinite loop (TLE) ---');
  const t7 = await codeExecutionService.runCode('python', 'while True:\n    pass');
  assert(t7.status === 'Time Limit Exceeded', `Detected Time Limit Exceeded: status is "${t7.status}"`);
  assert(t7.runtimeMs !== null, `Runtime reported: ${t7.runtimeMs}ms`);

  // Test 8: Code that produces no stdout
  console.log('\n--- 8. Testing Code that produces no stdout ---');
  const t8 = await codeExecutionService.runCode('python', 'x = 42\ny = x + 10\n# No print statement');
  assert(t8.status === 'Executed', 'Status is Executed');
  assert(t8.stdout.trim() === '', `No stdout produced -> stdout is empty ("${t8.stdout}")`);

  // Test 9: JavaScript Execution
  console.log('\n--- 9. Testing JavaScript Execution ---');
  const t9 = await codeExecutionService.runCode('javascript', 'console.log("Hello from Node.js", [1, 2]);');
  assert(t9.status === 'Executed', 'JS executed successfully');
  assert(t9.stdout.includes('Hello from Node.js'), `JS stdout: "${t9.stdout.trim()}"`);

  // Test 10: Submit Mode with test cases
  console.log('\n--- 10. Testing Submit Mode with real test cases ---');
  const testCases = [
    { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
    { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' }
  ];
  const submitSolutionCode = `
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in lookup:
                return [lookup[diff], i]
            lookup[num] = i
        return []
`;
  const submitRes = await codeExecutionService.submitCode('python', submitSolutionCode, testCases);
  assert(submitRes.status === 'Accepted', `Submit solution status: "${submitRes.status}"`);
  assert(submitRes.testCasesPassed === 2, `Passed ${submitRes.testCasesPassed}/${submitRes.totalTestCases} test cases`);
  assert(submitRes.details.length === 2, `Details array length is ${submitRes.details.length}`);

  console.log(`\n======================================================`);
  console.log(`EXECUTION SUMMARY: ${passedTests}/${totalTests} tests passed`);
  console.log(`======================================================\n`);

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error("Fatal error during test run:", err);
  process.exit(1);
});
