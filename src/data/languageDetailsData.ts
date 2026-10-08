export interface LanguageDetailSection {
  explanation: string;
  code: string;
}

export interface ImportantConcept {
  title: string;
  explanation: string;
}

export interface DSAImplementationExample {
  title: string;
  explanation: string;
  code: string;
}

export interface ExtraCodeExample {
  title: string;
  description: string;
  code: string;
}

export interface LanguageDetail {
  id: 'python' | 'java' | 'cpp' | 'c' | 'javascript' | 'go';
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  overview: string; // What the language is
  useCases: string[]; // What it is used for
  basicSyntax: LanguageDetailSection;
  variablesAndTypes: LanguageDetailSection;
  operators: LanguageDetailSection;
  conditionals: LanguageDetailSection;
  loops: LanguageDetailSection;
  functions: LanguageDetailSection;
  arraysAndCollections: LanguageDetailSection;
  strings: LanguageDetailSection;
  oop: LanguageDetailSection;
  errorHandling: LanguageDetailSection;
  importantConcepts: ImportantConcept[];
  dsaExamples: DSAImplementationExample[];
  codeExamples: ExtraCodeExample[];
}

export const LANGUAGE_DETAILS_DATA: Record<string, LanguageDetail> = {
  python: {
    id: 'python',
    name: 'Python 3',
    shortName: 'Python',
    tagline: 'High-level, interpreted, dynamically typed language known for unmatched readability and vast ecosystem.',
    badge: 'Beginner Friendly & Versatile',
    overview: 'Python is a high-level, general-purpose, interpreted programming language created by Guido van Rossum in 1991. It emphasizes code readability with its clean syntax and reliance on significant whitespace. Python supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
    useCases: [
      'Data Structures & Algorithms interview preparation',
      'Artificial Intelligence & Machine Learning (PyTorch, TensorFlow, Scikit-Learn)',
      'Data Science, Analytics & Visualization (Pandas, NumPy, Matplotlib)',
      'Web Development (Django, FastAPI, Flask)',
      'Automation, Scripting & Web Scraping (Selenium, BeautifulSoup)'
    ],
    basicSyntax: {
      explanation: 'Python uses indentation (4 spaces) rather than curly braces {} or semicolons ; to define code blocks. Comments start with the hash # symbol.',
      code: `# Python Hello World Program
def main():
    # Print welcome message to standard output
    message = "Hello, ALGOrise Learner!"
    print(message)

if __name__ == "__main__":
    main()`
    },
    variablesAndTypes: {
      explanation: 'Python is dynamically typed. You do not specify data types when declaring variables; the runtime infers types automatically.',
      code: `# Primitive and Composite Data Types
age = 25                  # int
price = 99.99             # float
is_active = True          # bool
name = "Alice"            # str

# Collections
numbers_list = [1, 2, 3]  # list (mutable array)
point_tuple = (10, 20)    # tuple (immutable)
unique_set = {1, 2, 3}    # set (unique elements)
user_dict = {"id": 101}   # dict (hash map)`
    },
    operators: {
      explanation: 'Python supports standard arithmetic, comparison, logical (and, or, not), bitwise, and membership (in, not in) operators.',
      code: `# Arithmetic & Floor Division
a = 15
b = 4
sum_val = a + b           # 19
exp = a ** 2              # 225 (Exponentiation)
floor_div = a // b        # 3 (Floor division)

# Logical & Membership
has_access = (a > 10) and (b < 5)   # True
is_present = 15 in [10, 15, 20]      # True`
    },
    conditionals: {
      explanation: 'Conditional branching uses if, elif, and else statements evaluated sequentially.',
      code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Final Grade: {grade}")`
    },
    loops: {
      explanation: 'Python provides for loops (iterating over sequences or range()) and while loops.',
      code: `# For Loop with range
for i in range(1, 6):
    print(f"Iteration {i}")

# While Loop
count = 3
while count > 0:
    print(f"Countdown: {count}")
    count -= 1`
    },
    functions: {
      explanation: 'Functions are defined using the def keyword and can return single or multiple values via tuple packing.',
      code: `def calculate_stats(numbers: list[int]) -> tuple[int, float]:
    """Returns the sum and average of a list of integers."""
    total = sum(numbers)
    avg = total / len(numbers) if numbers else 0.0
    return total, avg

total_val, avg_val = calculate_stats([10, 20, 30, 40])
print(f"Total: {total_val}, Average: {avg_val}")`
    },
    arraysAndCollections: {
      explanation: 'Python built-in collections include lists (dynamic arrays), tuples, sets, and dictionaries (hash maps). collections module provides deque and Counter.',
      code: `from collections import deque, Counter

# Dynamic Array / List
arr = [10, 20, 30]
arr.append(40)            # Add to tail O(1)
arr.pop()                 # Remove from tail O(1)

# Double-Ended Queue (Stack / Queue)
dq = deque([1, 2, 3])
dq.appendleft(0)          # O(1) push head
first = dq.popleft()      # O(1) pop head

# Frequency Counter
freq = Counter(["apple", "banana", "apple"])
print(freq["apple"])       # 2`
    },
    strings: {
      explanation: 'Strings in Python are immutable sequences of Unicode characters. Supports slicing [start:end:step], f-string formatting, and rich built-in methods.',
      code: `text = "ALGOrise DSA Platform"

# Slicing & Reversing
sub = text[0:8]           # "ALGOrise"
reversed_str = text[::-1] # Reverse string

# Methods
clean_text = text.lower().strip()
words = text.split(" ")
joined = "-".join(words)`
    },
    oop: {
      explanation: 'Object-Oriented Programming uses classes, constructors (__init__), instance methods with self, inheritance, and encapsulation.',
      code: `class TreeNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert_left(self, parent: TreeNode, val: int) -> TreeNode:
        parent.left = TreeNode(val)
        return parent.left`
    },
    errorHandling: {
      explanation: 'Exceptions are handled using try, except, else, and finally blocks to catch runtime errors gracefully.',
      code: `def safe_divide(a: float, b: float) -> float:
    try:
        result = a / b
    except ZeroDivisionError as e:
        print("Error: Cannot divide by zero!")
        return 0.0
    except TypeError:
        print("Error: Invalid numeric types provided.")
        return 0.0
    else:
        print("Division successful.")
        return result
    finally:
        print("Operation complete.")`
    },
    importantConcepts: [
      {
        title: 'Dynamic Typing & Reference Semantics',
        explanation: 'Variables in Python are references to objects stored in heap memory. Assignment b = a points b to the same object.'
      },
      {
        title: 'List Comprehensions & Generator Expressions',
        explanation: 'Concise syntax for creating lists or lazy generators: [x**2 for x in range(10) if x % 2 == 0].'
      },
      {
        title: 'Garbage Collection & Memory Management',
        explanation: 'Python manages memory automatically using reference counting combined with a cyclic garbage collector.'
      }
    ],
    dsaExamples: [
      {
        title: 'Two Sum (Hash Map Approach - O(N) Time)',
        explanation: 'Find indices of two numbers in an array that add up to a target value using a dictionary for constant time lookups.',
        code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))`
      },
      {
        title: 'Valid Parentheses (Stack Approach - O(N) Time)',
        explanation: 'Determine if an input string containing brackets is valid using a LIFO Stack.',
        code: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack

print(is_valid_parentheses("({[]})"))`
      }
    ],
    codeExamples: [
      {
        title: 'Binary Search Implementation',
        description: 'Searches for a target value in a sorted array in O(log N) logarithmic time.',
        code: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
      }
    ]
  },

  java: {
    id: 'java',
    name: 'Java 17',
    shortName: 'Java',
    tagline: 'Statically typed, object-oriented, write-once-run-anywhere language powering enterprise backends and Android.',
    badge: 'Enterprise & Systems',
    overview: 'Java is a class-based, object-oriented programming language designed by James Gosling at Sun Microsystems in 1995 (now owned by Oracle). Java code compiles into bytecode that runs on the Java Virtual Machine (JVM), enabling cross-platform portability.',
    useCases: [
      'Backend Web APIs & Microservices (Spring Boot, Jakarta EE)',
      'Enterprise Software Systems & Banking Backends',
      'Android Mobile Application Development',
      'Big Data Processing Frameworks (Apache Hadoop, Apache Spark)',
      'Competitive Programming & Technical Interviews'
    ],
    basicSyntax: {
      explanation: 'Java requires every program to be inside a class. Execution begins in the public static void main(String[] args) method.',
      code: `public class Main {
    public static void main(String[] args) {
        // Output text to console
        System.out.println("Hello, ALGOrise Learner!");
    }
}`
    },
    variablesAndTypes: {
      explanation: 'Java is strongly and statically typed. Variables are explicitly declared with primitive types or reference objects.',
      code: `// Primitive Types
int count = 100;
double price = 49.99;
boolean isCompleted = true;
char grade = 'A';

// Reference Types / Objects
String title = "ALGOrise DSA";
Integer boxedCount = Integer.valueOf(100);
int[] numbers = {10, 20, 30, 40};`
    },
    operators: {
      explanation: 'Java provides standard arithmetic, assignment, relational, logical (&&, ||, !), bitwise, and ternary (? :) operators.',
      code: `int x = 20;
int y = 7;

int sum = x + y;            // 27
int remainder = x % y;      // 6

// Ternary Operator
String status = (x >= 18) ? "Adult" : "Minor";

// Short-circuit Logical AND
boolean result = (x > 10) && (y < 10);`
    },
    conditionals: {
      explanation: 'Supports if-else branching, ternary expressions, and switch statements (including enhanced switch expressions in Java 17).',
      code: `int score = 88;
char grade;

if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}

// Java 17 Switch Expression
String message = switch (grade) {
    case 'A', 'B' -> "Excellent Performance!";
    case 'C'      -> "Good Job!";
    default       -> "Keep Practicing.";
};`
    },
    loops: {
      explanation: 'Java provides standard for loops, enhanced for-each loops, while loops, and do-while loops.',
      code: `int[] arr = {5, 10, 15, 20};

// Enhanced For-Each Loop
for (int num : arr) {
    System.out.println("Value: " + num);
}

// Standard While Loop
int k = 0;
while (k < 3) {
    System.out.println("Index: " + k);
    k++;
}`
    },
    functions: {
      explanation: 'Functions in Java are methods defined inside classes. They specify access modifiers, return types, method name, and parameters.',
      code: `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double computeAverage(int[] nums) {
        if (nums.length == 0) return 0.0;
        int sum = 0;
        for (int n : nums) sum += n;
        return (double) sum / nums.length;
    }
}`
    },
    arraysAndCollections: {
      explanation: 'Java Collection Framework provides List (ArrayList), Set (HashSet), Map (HashMap), and Queue (ArrayDeque / PriorityQueue).',
      code: `import java.util.*;

// Dynamic Resizable Array
List<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
int first = list.get(0);

// Hash Map for Key-Value Lookups O(1)
Map<String, Integer> map = new HashMap<>();
map.put("Two Sum", 1);
boolean containsKey = map.containsKey("Two Sum");

// Min-Heap Priority Queue for Dijkstra / Heaps
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.add(50);
minHeap.add(10);
int smallest = minHeap.poll(); // Returns 10`
    },
    strings: {
      explanation: 'String objects in Java are immutable. StringBuilder is used for efficient mutable string manipulation.',
      code: `String str = "ALGOrise";
String upper = str.toUpperCase();
char ch = str.charAt(0);     // 'A'

// StringBuilder for O(1) Appends
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) {
    sb.append(i).append(" ");
}
String result = sb.toString();`
    },
    oop: {
      explanation: 'Core OOP pillars: Encapsulation (private fields, getters/setters), Inheritance (extends), Polymorphism (overriding/overloading), and Abstraction (interfaces).',
      code: `interface Shape {
    double calculateArea();
}

class Circle implements Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}`
    },
    errorHandling: {
      explanation: 'Java uses checked and unchecked exceptions handled with try-catch-finally blocks or try-with-resources.',
      code: `public static int parseNumber(String str) {
    try {
        return Integer.parseInt(str);
    } catch (NumberFormatException e) {
        System.err.println("Failed to parse integer: " + e.getMessage());
        return -1;
    } finally {
        System.out.println("Parsing attempt finished.");
    }
}`
    },
    importantConcepts: [
      {
        title: 'JVM & Garbage Collection (GC)',
        explanation: 'Automatic memory management via Generational Garbage Collection cleans up unreferenced objects.'
      },
      {
        title: 'Generics & Type Erasure',
        explanation: 'Generics provide compile-time type safety for collections while preserving backward compatibility through byte erasure.'
      }
    ],
    dsaExamples: [
      {
        title: 'Two Sum (HashMap Approach - O(N) Time)',
        explanation: 'Uses java.util.HashMap to store array elements and their 0-based indices for constant time lookup.',
        code: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
      }
    ],
    codeExamples: [
      {
        title: 'Singly Linked List Node Structure',
        description: 'Standard Java implementation of a ListNode for linked list problems.',
        code: `public class ListNode {
    public int val;
    public ListNode next;

    public ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}`
      }
    ]
  },

  cpp: {
    id: 'cpp',
    name: 'C++ 20',
    shortName: 'C++',
    tagline: 'High-performance, compiled language with low-level memory control, rich Standard Template Library (STL), and RAII.',
    badge: 'High Performance & Competitive Programming',
    overview: 'C++ is a powerful general-purpose programming language developed by Bjarne Stroustrup in 1979 as an extension of the C language. It offers raw pointer memory manipulation, fast execution, compile-time templates, and object-oriented capabilities.',
    useCases: [
      'Competitive Programming & Algorithmic Contests (LeetCode, Codeforces)',
      'Game Engines & High-Graphics 3D Rendering (Unreal Engine)',
      'Operating Systems, Device Drivers & Embedded Systems',
      'High-Frequency Trading (HFT) & Financial Execution Systems',
      'Database Engine Core Development (MySQL, RocksDB)'
    ],
    basicSyntax: {
      explanation: 'C++ code includes header files with #include, uses namespace std, and starts execution inside main().',
      code: `#include <iostream>
using namespace std;

int main() {
    // Print message to standard output console stream
    cout << "Hello, ALGOrise C++ Learner!" << endl;
    return 0;
}`
    },
    variablesAndTypes: {
      explanation: 'C++ is strongly typed with primitive types (int, double, char, bool) and STL container classes.',
      code: `#include <iostream>
#include <string>
#include <vector>

int val = 42;
double pi = 3.14159;
bool flag = true;
std::string text = "ALGOrise";

// C++ STL Dynamic Array Vector
std::vector<int> nums = {1, 2, 3, 4};`
    },
    operators: {
      explanation: 'Supports arithmetic, relational, logical, bitwise, pointer dereference (*), address-of (&), and scope resolution (::) operators.',
      code: `int a = 10, b = 3;
int div_res = a / b;        // Integer division = 3
int mod_res = a % b;        // Remainder = 1

// Pointer operators
int* ptr = &a;             // ptr holds memory address of a
int val_at_ptr = *ptr;     // Dereference pointer to get value (10)`
    },
    conditionals: {
      explanation: 'Uses standard if, else if, else conditions, switch statements, and ternary operators.',
      code: `int score = 82;

if (score >= 90) {
    std::cout << "Grade A" << std::endl;
} else if (score >= 80) {
    std::cout << "Grade B" << std::endl;
} else {
    std::cout << "Grade C" << std::endl;
}`
    },
    loops: {
      explanation: 'Supports indexed for loops, range-based for loops (C++11), while loops, and do-while loops.',
      code: `#include <iostream>
#include <vector>

std::vector<int> data = {10, 20, 30};

// Range-based for loop with auto reference
for (const auto& item : data) {
    std::cout << item << " ";
}`
    },
    functions: {
      explanation: 'Functions accept parameters by value, by reference (&), or by const reference to avoid unnecessary copying.',
      code: `#include <iostream>
#include <vector>

// Pass vector by const reference for zero-copy efficiency
void printVector(const std::vector<int>& vec) {
    for (int num : vec) {
        std::cout << num << " ";
    }
}

// Pass by reference to modify caller variable in-place
void swapValues(int& x, int& y) {
    int temp = x;
    x = y;
    y = temp;
}`
    },
    arraysAndCollections: {
      explanation: 'C++ Standard Template Library (STL) provides std::vector, std::unordered_map, std::unordered_set, std::queue, std::stack, and std::priority_queue.',
      code: `#include <vector>
#include <unordered_map>
#include <queue>

// STL Vector (Dynamic Array)
std::vector<int> vec;
vec.push_back(100);

// STL Unordered Map (O(1) Hash Table)
std::unordered_map<int, int> freq;
freq[5]++;

// Max-Heap Priority Queue
std::priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(50);
int top = maxHeap.top(); // 50`
    },
    strings: {
      explanation: 'std::string provides high-performance character sequence management with STL algorithm compatibility.',
      code: `#include <string>
#include <algorithm>

std::string str = "ALGOrise";
str += " Platform";

// Reverse string in-place using STL
std::reverse(str.begin(), str.end());`
    },
    oop: {
      explanation: 'C++ supports classes, constructors/destructors, virtual functions for polymorphism, and multiple inheritance.',
      code: `class Node {
public:
    int data;
    Node* next;

    Node(int val) : data(val), next(nullptr) {}
};`
    },
    errorHandling: {
      explanation: 'Exceptions are thrown using throw and caught using try-catch blocks.',
      code: `#include <iostream>
#include <stdexcept>

double divide(double a, double b) {
    if (b == 0.0) throw std::invalid_argument("Division by zero!");
    return a / b;
}

void test() {
    try {
        divide(10.0, 0.0);
    } catch (const std::exception& e) {
        std::cerr << "Caught Error: " << e.what() << std::endl;
    }
}`
    },
    importantConcepts: [
      {
        title: 'Pointers, References & Memory Management',
        explanation: 'Direct memory addressing via pointers (*, &) and dynamic allocation with new/delete or Smart Pointers (std::unique_ptr, std::shared_ptr).'
      },
      {
        title: 'STL Complexity Guarantees',
        explanation: 'std::unordered_map operates in O(1) average time; std::map operates in O(log N) balanced tree time.'
      }
    ],
    dsaExamples: [
      {
        title: 'Two Sum (C++ STL Unordered Map - O(N) Time)',
        explanation: 'Efficient two-sum implementation utilizing std::unordered_map.',
        code: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`
      }
    ],
    codeExamples: [
      {
        title: 'Fast I/O for Competitive Programming',
        description: 'Optimizes standard stream speed for handling large I/O datasets.',
        code: `#include <iostream>

void fastIO() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
}`
      }
    ]
  },

  c: {
    id: 'c',
    name: 'C (GCC)',
    shortName: 'C',
    tagline: 'Foundational procedural language offering raw memory access, pointers, and direct hardware execution.',
    badge: 'Core Computer Science Foundation',
    overview: 'C is a general-purpose procedural computer programming language created by Dennis Ritchie in 1972 at Bell Labs. It forms the backbone of modern computing — operating systems (Linux, Windows kernel), compilers, database engines, and hardware drivers are built in C.',
    useCases: [
      'Operating System Kernels (Linux Kernel, Windows NT Kernel)',
      'Embedded Systems, Microcontrollers & IoT Devices',
      'Compilers, Interpreters & Runtime Engines (Python C-API, JVM)',
      'Database Engine Cores (SQLite, PostgreSQL core)',
      'BCA / B.Tech Computer Science Core Curriculum'
    ],
    basicSyntax: {
      explanation: 'C programs include standard library headers like <stdio.h> and execute starting from the main() function.',
      code: `#include <stdio.h>

int main() {
    // Print formatted string to console
    printf("Hello, ALGOrise C Learner!\\n");
    return 0;
}`
    },
    variablesAndTypes: {
      explanation: 'C requires explicit primitive variable types (int, float, double, char) and struct keywords for composite types.',
      code: `#include <stdio.h>

int count = 10;
float score = 95.5f;
char letter = 'C';

// Fixed-size primitive array
int numbers[5] = {1, 2, 3, 4, 5};`
    },
    operators: {
      explanation: 'Includes arithmetic, relational, logical, bitwise (&, |, ^, ~), pointer dereference (*), address-of (&), and struct member access (->).',
      code: `int a = 10;
int *ptr = &a;      // Pointer variable ptr stores address of a

// Dereferencing pointer to update value of a
*ptr = 25;          // a is now 25`
    },
    conditionals: {
      explanation: 'Conditionals in C use if, else if, else, and switch statements with integral expression cases.',
      code: `int score = 75;

if (score >= 90) {
    printf("Grade A\\n");
} else if (score >= 70) {
    printf("Grade B\\n");
} else {
    printf("Grade C\\n");
}`
    },
    loops: {
      explanation: 'Provides traditional for loops, while loops, and do-while loops.',
      code: `#include <stdio.h>

for (int i = 0; i < 5; i++) {
    printf("Index: %d\\n", i);
}`
    },
    functions: {
      explanation: 'Functions require return type declarations and argument types. Arguments are passed by value; pass by pointer simulates pass-by-reference.',
      code: `#include <stdio.h>

// Function taking pointers to swap integers
void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`
    },
    arraysAndCollections: {
      explanation: 'C uses static stack arrays or dynamically allocated heap arrays managed via malloc(), calloc(), and free().',
      code: `#include <stdio.h>
#include <stdlib.h>

// Dynamic Heap Allocation in C
int *arr = (int *)malloc(5 * sizeof(int));
if (arr != NULL) {
    arr[0] = 10;
    arr[1] = 20;
    // Always free dynamically allocated memory to prevent memory leaks
    free(arr);
}`
    },
    strings: {
      explanation: 'Strings in C are null-terminated character arrays (char[]) ending with the null byte \'\\0\'.',
      code: `#include <stdio.h>
#include <string.h>

char str[50] = "ALGOrise";
strcat(str, " DSA"); // Concatenation
int len = strlen(str);`
    },
    oop: {
      explanation: 'C is a procedural language without classes. Object-like constructs are implemented using struct and function pointers.',
      code: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

struct Point p1 = {10, 20};`
    },
    errorHandling: {
      explanation: 'C does not have try-catch blocks. Error handling relies on integer return status codes, NULL checks, and errno.',
      code: `#include <stdio.h>
#include <stdlib.h>

FILE *file = fopen("data.txt", "r");
if (file == NULL) {
    printf("Error opening file!\\n");
}`
    },
    importantConcepts: [
      {
        title: 'Manual Memory Allocation & Pointers',
        explanation: 'malloc(), calloc(), realloc(), free() require strict memory allocation and deallocation discipline.'
      },
      {
        title: 'Structs & Pointers to Structs',
        explanation: 'Member access via dot . for values or arrow -> for struct pointers (ptr->val).'
      }
    ],
    dsaExamples: [
      {
        title: 'Singly Linked List Implementation in C',
        explanation: 'Creating, allocating, and traversing a Linked List using C structs and malloc.',
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* createNode(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;
    return newNode;
}`
      }
    ],
    codeExamples: [
      {
        title: 'Bubble Sort in C',
        description: 'In-place sorting algorithm comparing adjacent elements.',
        code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
      }
    ]
  },

  javascript: {
    id: 'javascript',
    name: 'JavaScript (ES6)',
    shortName: 'JavaScript',
    tagline: 'High-level, dynamically typed language powering web frontends, Node.js backends, and full-stack development.',
    badge: 'Web & Full Stack Standard',
    overview: 'JavaScript is a high-level, lightweight, interpreted or JIT-compiled programming language created by Brendan Eich in 1995. Originally built for web browsers, JavaScript now powers both web frontends and server-side applications via Node.js.',
    useCases: [
      'Interactive Web Applications & Frontend Frameworks (React, Next.js, Vue)',
      'Server-Side Web APIs & Backend Microservices (Node.js, Express, NestJS)',
      'Cross-Platform Mobile App Development (React Native)',
      'Desktop Applications (Electron, VS Code)',
      'Algorithmic & Web-Based Data Structure Visualizers'
    ],
    basicSyntax: {
      explanation: 'Variables are declared with const or let. Statements can end with or without semicolons. Console output uses console.log().',
      code: `// Modern ES6 JavaScript Hello World
const greetUser = (name) => {
  const message = \`Hello, \${name}! Welcome to ALGOrise.\`;
  console.log(message);
};

greetUser("JavaScript Developer");`
    },
    variablesAndTypes: {
      explanation: 'JavaScript has primitive types (number, string, boolean, null, undefined, symbol, bigint) and Object types.',
      code: `const age = 25;             // Number
const price = 99.99;        // Number
const name = "Alice";       // String
const isActive = true;      // Boolean
let data = null;            // Null

// Objects & Arrays
const user = { id: 1, role: "Admin" };
const scores = [90, 85, 92];`
    },
    operators: {
      explanation: 'Supports arithmetic, loose (==) vs strict (===) equality, logical, nullish coalescing (??), and optional chaining (?.).',
      code: `const a = 10;
const b = "10";

console.log(a == b);   // true (loose equality with type coercion)
console.log(a === b);  // false (strict equality - recommended)

// Nullish Coalescing & Optional Chaining
const input = null;
const val = input ?? "Default Value";
const city = user?.address?.city;`
    },
    conditionals: {
      explanation: 'Uses standard if, else if, else conditions, switch statements, and ternary operators.',
      code: `const score = 88;

const grade = score >= 90 ? 'A' 
            : score >= 80 ? 'B' 
            : 'C';

console.log(\`Grade: \${grade}\`);`
    },
    loops: {
      explanation: 'Supports for, for...of (over array values), for...in (over object keys), while, and Array higher-order methods (.forEach, .map).',
      code: `const items = ["Array", "Stack", "Queue"];

// modern for...of loop
for (const item of items) {
  console.log(\`DSA Topic: \${item}\`);
}

// Higher-order array iteration
items.forEach((item, index) => {
  console.log(\`\${index}: \${item}\`);
});`
    },
    functions: {
      explanation: 'Functions can be defined via standard function declarations or ES6 arrow functions with lexical this.',
      code: `// ES6 Arrow Function
const calculateSum = (a, b) => a + b;

// Higher Order Function returning a closure
const createMultiplier = (factor) => (num) => num * factor;
const double = createMultiplier(2);
console.log(double(5)); // 10`
    },
    arraysAndCollections: {
      explanation: 'Built-in Array object serves as dynamic array, stack, and queue. ES6 added Map and Set collection classes.',
      code: `// Array as Stack / Queue
const stack = [];
stack.push(10);           // Push O(1)
const top = stack.pop();  // Pop O(1)

// ES6 Set & Map
const uniqueSet = new Set([1, 2, 2, 3]);
const map = new Map();
map.set("key", "value");`
    },
    strings: {
      explanation: 'Strings are immutable UTF-16 sequences. Template literals allow embedded expressions with backticks.',
      code: `const text = "ALGOrise DSA";
const sub = text.substring(0, 8);
const upper = text.toUpperCase();
const reversed = text.split('').reverse().join('');`
    },
    oop: {
      explanation: 'JavaScript uses prototype-based inheritance wrapped in ES6 class syntax.',
      code: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}`
    },
    errorHandling: {
      explanation: 'Handled via try...catch...finally blocks. Async promises use try/catch inside async functions.',
      code: `const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error("Invalid JSON:", err.message);
    return null;
  }
};`
    },
    importantConcepts: [
      {
        title: 'Event Loop & Asynchronous Non-Blocking I/O',
        explanation: 'JavaScript handles concurrency via single-threaded Event Loop, Task Queue, and Microtask Queue (Promises).'
      },
      {
        title: 'Closures & Lexical Scope',
        explanation: 'Functions retain access to variables in their outer enclosing lexical scope even after the parent function completes.'
      }
    ],
    dsaExamples: [
      {
        title: 'Two Sum (JavaScript Map - O(N) Time)',
        explanation: 'Using JavaScript ES6 Map for constant time complement search.',
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
      }
    ],
    codeExamples: [
      {
        title: 'Breadth-First Search (BFS) Tree Traversal',
        description: 'Iterative level-order traversal using an array-based queue.',
        code: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`
      }
    ]
  },

  go: {
    id: 'go',
    name: 'Go 1.21',
    shortName: 'Go',
    tagline: 'Statically typed, compiled language engineered at Google for extreme concurrency, fast compilation, and simple syntax.',
    badge: 'Cloud Native & High Concurrency',
    overview: 'Go (Golang) is an open-source programming language created at Google by Robert Griesemer, Rob Pike, and Ken Thompson in 2009. Designed for simplicity, safety, and speed, Go features built-in goroutines for light-weight concurrency.',
    useCases: [
      'Cloud Native & Infrastructure Software (Docker, Kubernetes, Terraform)',
      'High-Performance Web Microservices & APIs',
      'Distributed Systems & Networking Tools',
      'DevOps Automation Tooling',
      'Technical Interviews & Algorithmic Problem Solving'
    ],
    basicSyntax: {
      explanation: 'Go code belongs to packages. Execution begins in function main() inside package main. Imports specify required packages.',
      code: `package main

import "fmt"

func main() {
    // Print line to standard output
    fmt.Println("Hello, ALGOrise Go Learner!")
}`
    },
    variablesAndTypes: {
      explanation: 'Go is strongly typed. Short variable declaration syntax := infers type automatically inside functions.',
      code: `package main

var count int = 10         // Explicit type declaration
price := 49.99             // Short declaration (float64)
name := "ALGOrise"         // string
isActive := true           // bool

// Array vs Slice
var fixedArr [5]int        // Fixed length array
slice := []int{10, 20, 30} // Dynamic slice`
    },
    operators: {
      explanation: 'Supports arithmetic, relational, logical, bitwise, channel operators (<-), and pointer operators (*, &).',
      code: `a := 15
b := 4

sum := a + b
isGreater := (a > 10) && (b < 5)

// Pointer in Go
ptr := &a
*ptr = 30 // a is now 30`
    },
    conditionals: {
      explanation: 'if statements in Go can include a short initialization statement before condition evaluation.',
      code: `if score := 85; score >= 90 {
    fmt.Println("Grade A")
} else if score >= 80 {
    fmt.Println("Grade B")
} else {
    fmt.Println("Grade C")
}`
    },
    loops: {
      explanation: 'Go has only ONE looping construct: the for loop, which can be used as standard for, while, or infinite loop.',
      code: `// Standard for loop
for i := 0; i < 5; i++ {
    fmt.Println("Index:", i)
}

// Slice iteration using range
nums := []int{100, 200, 300}
for index, val := range nums {
    fmt.Printf("Index %d: %d\\n", index, val)
}`
    },
    functions: {
      explanation: 'Functions can return multiple values, enabling idiomatic error handling pattern (val, err).',
      code: `func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}`
    },
    arraysAndCollections: {
      explanation: 'Slices (dynamic views over arrays) and maps (hash tables) are built-in fundamental collection types.',
      code: `// Slices (Dynamic Arrays)
slice := make([]int, 0)
slice = append(slice, 10) // O(1) append

// Maps (Hash Tables)
hashmap := make(map[string]int)
hashmap["TwoSum"] = 1
val, exists := hashmap["TwoSum"]`
    },
    strings: {
      explanation: 'Strings in Go are immutable byte slices (UTF-8). The strings package provides helper functions.',
      code: `import "strings"

str := "ALGOrise Go"
upper := strings.ToUpper(str)
contains := strings.Contains(str, "Go")`
    },
    oop: {
      explanation: 'Go does not have classes or inheritance. Composition is achieved via struct embedding and interfaces.',
      code: `type ListNode struct {
    Val  int
    Next *ListNode
}

type Shape interface {
    Area() float64
}`
    },
    errorHandling: {
      explanation: 'Go avoids exceptions. Functions return an error interface value as their final return argument.',
      code: `res, err := divide(10.0, 0.0)
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Println("Result:", res)
}`
    },
    importantConcepts: [
      {
        title: 'Goroutines & Channels',
        explanation: 'Lightweight concurrent threads executed by Go runtime (go worker()) communicating via channels (ch <- val).'
      },
      {
        title: 'Explicit Error Handling Pattern',
        explanation: 'No silent exception throwing. Every potential failure is explicitly checked with if err != nil.'
      }
    ],
    dsaExamples: [
      {
        title: 'Two Sum (Go Map - O(N) Time)',
        explanation: 'Idiomatic Go implementation of Two Sum utilizing built-in map.',
        code: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, found := seen[complement]; found {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`
      }
    ],
    codeExamples: [
      {
        title: 'Stack Data Structure in Go',
        description: 'Using slice as LIFO Stack with push and pop methods.',
        code: `type Stack []int

func (s *Stack) Push(v int) {
    *s = append(*s, v)
}

func (s *Stack) Pop() int {
    old := *s
    n := len(old)
    val := old[n-1]
    *s = old[0 : n-1]
    return val
}`
      }
    ]
  }
};
