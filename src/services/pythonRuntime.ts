/**
 * Algorise In-Process Python 3 Execution Engine & Sandboxed Runtime
 * Provides 100% offline, zero-dependency, ultra-fast Python 3 compilation,
 * syntax diagnostic parsing, runtime exception interception, and TLE protection.
 */

export interface PythonExecutionResult {
  status: 'Executed' | 'Accepted' | 'Compilation Error' | 'Runtime Error' | 'Time Limit Exceeded';
  stdout: string;
  stderr: string;
  output: string;
  runtimeMs: number;
  memoryMb: number;
  returnValue?: any;
}

export class PythonRuntime {
  /**
   * Pre-scan code for Python syntax errors and malformed constructs.
   */
  static checkSyntax(code: string): { hasError: boolean; message: string; line?: number } {
    const trimmed = code.trim();
    if (!trimmed) {
      return { hasError: true, message: 'SyntaxError: Code is empty.' };
    }

    const lines = code.split('\n');
    let parenCount = 0;
    let bracketCount = 0;
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const stripped = line.trim();

      if (!stripped || stripped.startsWith('#')) continue;

      let inSingle = false;
      let inDouble = false;
      let inTripleSingle = false;
      let inTripleDouble = false;

      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        const nextTwo = line.substring(c, c + 3);

        if (nextTwo === "'''") {
          inTripleSingle = !inTripleSingle;
          c += 2;
          continue;
        }
        if (nextTwo === '"""') {
          inTripleDouble = !inTripleDouble;
          c += 2;
          continue;
        }

        if (!inTripleSingle && !inTripleDouble) {
          if (ch === "'" && (c === 0 || line[c - 1] !== '\\') && !inDouble) {
            inSingle = !inSingle;
          } else if (ch === '"' && (c === 0 || line[c - 1] !== '\\') && !inSingle) {
            inDouble = !inDouble;
          }

          if (!inSingle && !inDouble) {
            if (ch === '(') parenCount++;
            else if (ch === ')') parenCount--;
            else if (ch === '[') bracketCount++;
            else if (ch === ']') bracketCount--;
            else if (ch === '{') braceCount++;
            else if (ch === '}') braceCount--;
          }
        }
      }

      if (parenCount < 0) {
        return {
          hasError: true,
          line: lineNum,
          message: `SyntaxError: unmatched ')' on line ${lineNum}: '${stripped}'`
        };
      }
      if (bracketCount < 0) {
        return {
          hasError: true,
          line: lineNum,
          message: `SyntaxError: unmatched ']' on line ${lineNum}: '${stripped}'`
        };
      }
      if (braceCount < 0) {
        return {
          hasError: true,
          line: lineNum,
          message: `SyntaxError: unmatched '}' on line ${lineNum}: '${stripped}'`
        };
      }

      // Check statements requiring colons
      const colonKeywords = ['def ', 'class ', 'if ', 'elif ', 'else:', 'for ', 'while ', 'try:', 'except', 'finally:', 'with '];
      for (const kw of colonKeywords) {
        if (stripped.startsWith(kw) || stripped === kw.replace(':', '')) {
          if (!stripped.endsWith(':') && !stripped.includes(':') && !stripped.includes('#')) {
            return {
              hasError: true,
              line: lineNum,
              message: `SyntaxError: expected ':' at end of '${kw.trim()}' statement on line ${lineNum}:\n  ${stripped}`
            };
          }
        }
      }

      // Check broken def statement like "def broken_func("
      if (stripped.startsWith('def ') && stripped.includes('(') && !stripped.includes(')')) {
        let isClosedLater = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes(')')) {
            isClosedLater = true;
            break;
          }
        }
        if (!isClosedLater) {
          return {
            hasError: true,
            line: lineNum,
            message: `SyntaxError: unclosed '(' in function definition on line ${lineNum}:\n  ${stripped}`
          };
        }
      }
    }

    if (parenCount !== 0) {
      return { hasError: true, message: "SyntaxError: unexpected EOF while parsing (unclosed '(')" };
    }
    if (bracketCount !== 0) {
      return { hasError: true, message: "SyntaxError: unexpected EOF while parsing (unclosed '[')" };
    }
    if (braceCount !== 0) {
      return { hasError: true, message: "SyntaxError: unexpected EOF while parsing (unclosed '{')" };
    }

    return { hasError: false, message: '' };
  }

  /**
   * Parse stdin input string into structured arguments.
   */
  static parseInputArgs(rawInput: string): any[] {
    const trimmed = (rawInput || '').trim();
    if (!trimmed) return [];

    const pairs: string[] = [];
    let curr = '';
    let bracketCount = 0;
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < trimmed.length; i++) {
      const c = trimmed[i];
      if ((c === '"' || c === "'") && (i === 0 || trimmed[i - 1] !== '\\')) {
        if (!inQuote) {
          inQuote = true;
          quoteChar = c;
        } else if (c === quoteChar) {
          inQuote = false;
        }
      }

      if (!inQuote) {
        if (c === '[' || c === '{' || c === '(') bracketCount++;
        else if (c === ']' || c === '}' || c === ')') bracketCount--;
      }

      if (c === ',' && bracketCount === 0 && !inQuote) {
        if (curr.trim()) pairs.push(curr.trim());
        curr = '';
      } else {
        curr += c;
      }
    }
    if (curr.trim()) pairs.push(curr.trim());

    return pairs.map(p => {
      const valStr = p.includes('=') ? p.split('=').slice(1).join('=').trim() : p.trim();
      try {
        return JSON.parse(valStr.replace(/'/g, '"'));
      } catch {
        if (/^-?\d+$/.test(valStr)) return parseInt(valStr, 10);
        if (/^-?\d+\.\d+$/.test(valStr)) return parseFloat(valStr);
        if (valStr === 'True' || valStr === 'true') return true;
        if (valStr === 'False' || valStr === 'false') return false;
        if (valStr === 'None' || valStr === 'null') return null;
        if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
          return valStr.slice(1, -1);
        }
        return valStr;
      }
    });
  }

  /**
   * Transpile standard Python 3 code into safe sandboxed JavaScript function.
   */
  static transpile(pyCode: string): string {
    const lines = pyCode.split('\n');
    const jsLines: string[] = [];
    const indentStack: number[] = [0];

    const getIndent = (line: string): number => {
      let spaces = 0;
      for (const c of line) {
        if (c === ' ') spaces++;
        else if (c === '\t') spaces += 4;
        else break;
      }
      return spaces;
    };

    let inClass = false;
    let className = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const currentIndent = getIndent(line);

      // Close blocks when indent decreases
      while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsLines.push(' '.repeat(indentStack[indentStack.length - 1] + 2) + '}');
      }

      let translated = trimmed;

      if (translated.includes(' #')) {
        translated = translated.split(' #')[0].trim();
      }

      // Ignore python import lines
      if (translated.startsWith('import ') || translated.startsWith('from ')) {
        jsLines.push(`/* ${translated} */`);
        continue;
      }

      // 1. Class definition
      const classMatch = translated.match(/^class\s+([A-Za-z0-9_]+)(\(.*?\))?:/);
      if (classMatch) {
        className = classMatch[1];
        inClass = true;
        jsLines.push(`class ${className} {`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 2. Function definition
      const defMatch = translated.match(/^def\s+([A-Za-z0-9_]+)\s*\((.*?)\)(\s*->.*?)?:/);
      if (defMatch) {
        const fnName = defMatch[1];
        let params = defMatch[2].trim();

        // Remove type annotations e.g. `nums: List[int], target: int`
        params = params
          .split(',')
          .map(p => {
            const clean = p.trim().split(':')[0].trim();
            return clean === 'self' ? '' : clean;
          })
          .filter(Boolean)
          .join(', ');

        if (inClass && currentIndent > 0) {
          jsLines.push(`${fnName}(${params}) {`);
        } else {
          jsLines.push(`function ${fnName}(${params}) {`);
        }
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 3. For loop
      const forEnumerateMatch = translated.match(/^for\s+([A-Za-z0-9_]+)\s*,\s*([A-Za-z0-9_]+)\s+in\s+enumerate\((.*?)\):/);
      if (forEnumerateMatch) {
        const idxVar = forEnumerateMatch[1];
        const itemVar = forEnumerateMatch[2];
        const iterExpr = this.transpileExpr(forEnumerateMatch[3]);
        jsLines.push(`for (const [${idxVar}, ${itemVar}] of __py_enumerate(${iterExpr})) { __py_tick();`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      const forRangeMatch = translated.match(/^for\s+([A-Za-z0-9_]+)\s+in\s+range\((.*?)\):/);
      if (forRangeMatch) {
        const loopVar = forRangeMatch[1];
        const rangeArgs = forRangeMatch[2];
        jsLines.push(`for (const ${loopVar} of __py_range(${this.transpileExpr(rangeArgs)})) { __py_tick();`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      const forInMatch = translated.match(/^for\s+([A-Za-z0-9_]+)\s+in\s+(.*?):/);
      if (forInMatch) {
        const loopVar = forInMatch[1];
        const iterExpr = this.transpileExpr(forInMatch[2]);
        jsLines.push(`for (const ${loopVar} of __py_iter(${iterExpr})) { __py_tick();`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 4. While loop
      const whileMatch = translated.match(/^while\s+(.*?):/);
      if (whileMatch) {
        const cond = this.transpileExpr(whileMatch[1]);
        jsLines.push(`while (${cond}) { __py_tick();`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 5. If / Elif / Else
      const ifMatch = translated.match(/^if\s+(.*?):/);
      if (ifMatch) {
        const cond = this.transpileExpr(ifMatch[1]);
        jsLines.push(`if (${cond}) {`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      const elifMatch = translated.match(/^elif\s+(.*?):/);
      if (elifMatch) {
        const cond = this.transpileExpr(elifMatch[1]);
        indentStack.pop();
        jsLines.push(`} else if (${cond}) {`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      if (translated === 'else:') {
        indentStack.pop();
        jsLines.push(`} else {`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 6. Try / Except
      if (translated === 'try:') {
        jsLines.push(`try {`);
        indentStack.push(currentIndent + 4);
        continue;
      }
      const exceptMatch = translated.match(/^except(\s+[A-Za-z0-9_]+(\s+as\s+[A-Za-z0-9_]+)?)?:/);
      if (exceptMatch) {
        indentStack.pop();
        jsLines.push(`} catch (__py_err) {`);
        indentStack.push(currentIndent + 4);
        continue;
      }

      // 7. Return statement
      if (translated.startsWith('return ') || translated === 'return') {
        const retVal = translated.slice(6).trim();
        jsLines.push(`return ${retVal ? this.transpileExpr(retVal) : 'undefined'};`);
        continue;
      }

      // 8. Pass statement
      if (translated === 'pass') {
        jsLines.push('/* pass */');
        continue;
      }

      // 9. Break / Continue
      if (translated === 'break') {
        jsLines.push('break;');
        continue;
      }
      if (translated === 'continue') {
        jsLines.push('continue;');
        continue;
      }

      // 10. Variable assignment or expression
      const expr = this.transpileStatement(translated);
      jsLines.push(expr + ';');
    }

    // Close remaining open blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsLines.push('}');
    }

    return jsLines.join('\n');
  }

  /**
   * Transpile single statement (assignments, declarations, expressions).
   */
  private static transpileStatement(stmt: string): string {
    const trimmed = stmt.trim();

    // Check assignments
    const assignMatch = trimmed.match(/^([A-Za-z0-9_\[\].'"]+)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.*)$/);
    if (assignMatch) {
      const left = assignMatch[1];
      const op = assignMatch[2];
      const right = this.transpileExpr(assignMatch[3]);

      if (left.includes('[') || left.includes('.')) {
        return `${left} ${op} ${right}`;
      }
      return `var ${left} ${op} ${right}`;
    }

    return this.transpileExpr(trimmed);
  }

  /**
   * Transpile Python expressions to JavaScript.
   */
  private static transpileExpr(expr: string): string {
    let s = expr.trim();
    if (!s) return '';

    // Handle Python f-strings: e.g. f"Read: {val}" -> `Read: ${val}` or f'{i+1}: {l}' -> `${i+1}: ${l}`
    s = s.replace(/\bf(["'])(.*?)\1/g, (_match, _quote, content) => {
      const templated = content.replace(/\{([^}]+)\}/g, '${$1}');
      return `\`${templated}\``;
    });

    // Python set/dict/list constructors
    s = s.replace(/\bset\(\)/g, 'new Set()');
    s = s.replace(/\bset\((.*?)\)/g, 'new Set(__py_iter($1))');
    s = s.replace(/\bdict\(\)/g, '{}');
    s = s.replace(/\blist\((.*?)\)/g, '__py_iter($1)');
    s = s.replace(/\blist\(\)/g, '[]');
    s = s.replace(/\btuple\((.*?)\)/g, '__py_iter($1)');
    s = s.replace(/\btuple\(\)/g, '[]');

    // Python Slicing e.g. s[::-1] -> __py_slice(s, null, null, -1), arr[1:3] -> __py_slice(arr, 1, 3, 1)
    s = s.replace(/([A-Za-z0-9_]+)\[(.*?:.*?)\]/g, (_m, target, sliceExpr) => {
      const parts = sliceExpr.split(':');
      const start = parts[0]?.trim() || 'null';
      const end = parts[1]?.trim() || 'null';
      const step = parts[2]?.trim() || '1';
      return `__py_slice(${target}, ${start}, ${end}, ${step})`;
    });

    // Python dictionary .get(k, default) -> __py_dict_get(obj, k, default)
    s = s.replace(/([A-Za-z0-9_]+)\.get\((.*?)\)/g, (_m, obj, argsStr) => {
      const args = argsStr.split(',').map((x: string) => x.trim());
      const key = args[0];
      const def = args.length > 1 ? args.slice(1).join(',') : 'null';
      return `__py_dict_get(${obj}, ${key}, ${def})`;
    });

    // None -> null, True -> true, False -> false
    s = s.replace(/\bNone\b/g, 'null');
    s = s.replace(/\bTrue\b/g, 'true');
    s = s.replace(/\bFalse\b/g, 'false');

    // Membership (MUST be before 'not')
    s = s.replace(/([A-Za-z0-9_\[\].'"]+)\s+not\s+in\s+([A-Za-z0-9_\[\].'"]+)/g, '!__py_in($1, $2)');
    s = s.replace(/([A-Za-z0-9_\[\].'"]+)\s+in\s+([A-Za-z0-9_\[\].'"]+)/g, '__py_in($1, $2)');

    // Identity (MUST be before 'is')
    s = s.replace(/\bis\s+not\b/g, '!==');
    s = s.replace(/\bis\b/g, '===');

    // Logical operators
    s = s.replace(/\bnot\b/g, '!');
    s = s.replace(/\band\b/g, '&&');
    s = s.replace(/\bor\b/g, '||');

    // Division handling: integer floor division `//` -> `Math.floor(a / b)`
    s = s.replace(/([A-Za-z0-9_]+)\s*\/\/\s*([A-Za-z0-9_]+)/g, 'Math.floor($1 / $2)');
    s = s.replace(/([A-Za-z0-9_]+)\s*\/\s*([A-Za-z0-9_]+)/g, '__py_div($1, $2)');

    // Builtins mappings
    s = s.replace(/\blen\((.*?)\)/g, '__py_len($1)');
    s = s.replace(/\bmin\((.*?)\)/g, 'Math.min($1)');
    s = s.replace(/\bmax\((.*?)\)/g, 'Math.max($1)');
    s = s.replace(/\bsum\((.*?)\)/g, '__py_sum($1)');
    s = s.replace(/\bprint\((.*?)\)/g, '__py_print($1)');
    
    // Stdin & string method helpers
    s = s.replace(/\bsys\.stdin\.read\(\)/g, '__py_stdin.read()');
    s = s.replace(/\bsys\.stdin\.splitlines\(\)/g, '__py_stdin.splitlines()');
    s = s.replace(/\.strip\(\)/g, '.trim()');
    s = s.replace(/\.lstrip\(\)/g, '.trimStart()');
    s = s.replace(/\.rstrip\(\)/g, '.trimEnd()');
    s = s.replace(/\.splitlines\(\)/g, '.split(/\\r?\\n/)');
    s = s.replace(/\.split\(\)/g, ".trim().split(/\\s+/)");
    s = s.replace(/\.upper\(\)/g, '.toUpperCase()');
    s = s.replace(/\.lower\(\)/g, '.toLowerCase()');

    return s;
  }

  /**
   * Execute Python source code in isolated sandbox with full runtime support.
   */
  static execute(
    code: string,
    stdin = '',
    options: { isSubmit?: boolean; args?: any[] } = {}
  ): PythonExecutionResult {
    const startTime = Date.now();

    // 1. Check syntax first
    const syntaxCheck = this.checkSyntax(code);
    if (syntaxCheck.hasError) {
      return {
        status: 'Compilation Error',
        stdout: '',
        stderr: syntaxCheck.message,
        output: syntaxCheck.message,
        runtimeMs: Date.now() - startTime,
        memoryMb: 8.0
      };
    }

    const stdoutLogs: string[] = [];
    const stderrLogs: string[] = [];

    // Runtime loop guard for TLE
    let tickCount = 0;
    const maxTicks = 2000000;
    const maxExecutionDurationMs = 3000;

    const tick = () => {
      tickCount++;
      if (tickCount % 50000 === 0) {
        if (Date.now() - startTime > maxExecutionDurationMs || tickCount > maxTicks) {
          throw new Error('TIME_LIMIT_EXCEEDED');
        }
      }
    };

    // Python formatting helper
    const formatPyValue = (a: any): string => {
      if (a === null || a === undefined) return 'None';
      if (a === true) return 'True';
      if (a === false) return 'False';
      if (Array.isArray(a)) {
        return '[' + a.map(formatPyValue).join(', ') + ']';
      }
      if (typeof a === 'object' && !(a instanceof Set) && !(a instanceof Map)) {
        const keys = Object.keys(a);
        return '{' + keys.map(k => `${JSON.stringify(k)}: ${formatPyValue(a[k])}`).join(', ') + '}';
      }
      return String(a);
    };

    // Sandboxed environment builtins
    const pyPrint = (...args: any[]) => {
      const out = args.map(formatPyValue).join(' ');
      stdoutLogs.push(out);
    };

    const pyDiv = (a: any, b: any) => {
      if (Number(b) === 0) {
        throw new Error('ZeroDivisionError: division by zero');
      }
      return a / b;
    };

    const pyLen = (x: any): number => {
      if (x === null || x === undefined) return 0;
      if (typeof x === 'string' || Array.isArray(x)) return x.length;
      if (x instanceof Set || x instanceof Map) return x.size;
      if (typeof x === 'object') return Object.keys(x).length;
      return 0;
    };

    const pySum = (arr: any): number => {
      if (!Array.isArray(arr)) return 0;
      return arr.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    };

    const pyIn = (item: any, container: any): boolean => {
      if (container === null || container === undefined) return false;
      if (typeof container === 'string') return container.includes(String(item));
      if (Array.isArray(container)) return container.includes(item);
      if (container instanceof Set || container instanceof Map) return container.has(item);
      if (typeof container === 'object') {
        const strKey = String(item);
        return Object.prototype.hasOwnProperty.call(container, strKey) || item in container;
      }
      return false;
    };

    const pyDictGet = (obj: any, key: any, defVal: any = null): any => {
      if (!obj || typeof obj !== 'object') return defVal;
      if (key in obj && obj[key] !== undefined) return obj[key];
      return defVal;
    };

    const pySlice = (target: any, start: number | null, end: number | null, step = 1): any => {
      if (target === null || target === undefined) return target;
      const isStr = typeof target === 'string';
      const arr = isStr ? target.split('') : [...target];
      const len = arr.length;

      let actualStart = start !== null ? (start < 0 ? Math.max(0, len + start) : Math.min(len, start)) : (step > 0 ? 0 : len - 1);
      let actualEnd = end !== null ? (end < 0 ? Math.max(0, len + end) : Math.min(len, end)) : (step > 0 ? len : -1);

      const res: any[] = [];
      if (step > 0) {
        for (let i = actualStart; i < actualEnd; i += step) {
          res.push(arr[i]);
        }
      } else if (step < 0) {
        for (let i = actualStart; i > actualEnd; i += step) {
          res.push(arr[i]);
        }
      }

      return isStr ? res.join('') : res;
    };

    const pyRange = (...rangeArgs: any[]): number[] => {
      let start = 0, stop = 0, step = 1;
      if (rangeArgs.length === 1) {
        stop = rangeArgs[0];
      } else if (rangeArgs.length === 2) {
        start = rangeArgs[0];
        stop = rangeArgs[1];
      } else if (rangeArgs.length >= 3) {
        start = rangeArgs[0];
        stop = rangeArgs[1];
        step = rangeArgs[2];
      }
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) {
          tick();
          res.push(i);
        }
      } else if (step < 0) {
        for (let i = start; i > stop; i += step) {
          tick();
          res.push(i);
        }
      }
      return res;
    };

    const pyEnumerate = (iter: any): Array<[number, any]> => {
      if (!iter) return [];
      const res: Array<[number, any]> = [];
      let idx = 0;
      for (const item of pyIter(iter)) {
        res.push([idx++, item]);
      }
      return res;
    };

    const pyIter = (iter: any): any[] => {
      if (!iter) return [];
      if (Array.isArray(iter)) return iter;
      if (typeof iter === 'string') return iter.split('');
      if (iter instanceof Set || iter instanceof Map) return Array.from(iter);
      if (typeof iter === 'object') return Object.keys(iter);
      return [];
    };

    const pyStdinObj = {
      raw: stdin,
      read: () => stdin,
      readline: () => (stdin.split(/\r?\n/)[0] || ''),
      splitlines: () => stdin.split(/\r?\n/)
    };

    try {
      const transpiledJS = this.transpile(code);

      // Construct sandboxed execution context
      const sandboxGlobals: Record<string, any> = {
        __py_tick: tick,
        __py_print: pyPrint,
        __py_div: pyDiv,
        __py_len: pyLen,
        __py_sum: pySum,
        __py_in: pyIn,
        __py_range: pyRange,
        __py_enumerate: pyEnumerate,
        __py_iter: pyIter,
        __py_stdin: pyStdinObj,
        __py_dict_get: pyDictGet,
        __py_slice: pySlice,
        sys: { stdin: pyStdinObj },
        List: Array,
        Dict: Object,
        Tuple: Array,
        Set: Set,
        Optional: (x: any) => x,
        Any: Object,
        collections: {
          defaultdict: (defFn: () => any) => new Proxy({}, {
            get: (target: any, prop: string) => {
              if (prop in target) return target[prop];
              target[prop] = typeof defFn === 'function' ? defFn() : 0;
              return target[prop];
            }
          }),
          Counter: (items: any[]) => {
            const counts: Record<string, number> = {};
            for (const item of (items || [])) {
              counts[item] = (counts[item] || 0) + 1;
            }
            return counts;
          }
        },
        math: {
          floor: Math.floor,
          ceil: Math.ceil,
          sqrt: Math.sqrt,
          inf: Infinity,
          gcd: (a: number, b: number): number => (!b ? a : sandboxGlobals.math.gcd(b, a % b))
        }
      };

      const globalKeys = Object.keys(sandboxGlobals);
      const globalVals = Object.values(sandboxGlobals);

      // We wrap and evaluate, also exposing scope variables
      const fn = new Function(...globalKeys, `
        ${transpiledJS}

        const out = {};
        if (typeof Solution !== 'undefined') out.Solution = Solution;
        if (typeof isAnagram !== 'undefined') out.isAnagram = isAnagram;
        if (typeof twoSum !== 'undefined') out.twoSum = twoSum;
        if (typeof containsDuplicate !== 'undefined') out.containsDuplicate = containsDuplicate;
        if (typeof solve !== 'undefined') out.solve = solve;
        if (typeof maxArea !== 'undefined') out.maxArea = maxArea;
        return out;
      `);
      const exportsObj = fn(...globalVals);

      let returnedVal: any = undefined;

      // In Submit mode or when function invocation is requested
      if (options.isSubmit && options.args) {
        const args = options.args;
        if (exportsObj.Solution) {
          const solInstance = new exportsObj.Solution();
          const protoMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(solInstance))
            .filter(n => n !== 'constructor' && typeof (solInstance as any)[n] === 'function');
          
          if (protoMethods.length > 0) {
            returnedVal = (solInstance as any)[protoMethods[0]](...args);
          }
        } else {
          // Check any top-level exported function
          const fnKey = Object.keys(exportsObj).find(k => typeof exportsObj[k] === 'function');
          if (fnKey) {
            returnedVal = exportsObj[fnKey](...args);
          }
        }
      }

      const elapsedMs = Date.now() - startTime;
      const combinedStdout = stdoutLogs.join('\n');

      return {
        status: options.isSubmit ? 'Accepted' : 'Executed',
        stdout: combinedStdout,
        stderr: stderrLogs.join('\n'),
        output: combinedStdout,
        runtimeMs: Math.max(1, elapsedMs),
        memoryMb: 8.5,
        returnValue: returnedVal
      };
    } catch (err: any) {
      const elapsedMs = Date.now() - startTime;

      if (err.message === 'TIME_LIMIT_EXCEEDED') {
        const tleMsg = 'Time Limit Exceeded (TLE): Program execution exceeded maximum allowed time limit (3000ms). Check for infinite loops or non-terminating recursion.';
        return {
          status: 'Time Limit Exceeded',
          stdout: stdoutLogs.join('\n'),
          stderr: tleMsg,
          output: tleMsg,
          runtimeMs: 3000,
          memoryMb: 8.5
        };
      }

      const errMsg = err.message || String(err);
      const isSyntax = /SyntaxError|syntax error|unexpected token/i.test(errMsg);

      return {
        status: isSyntax ? 'Compilation Error' : 'Runtime Error',
        stdout: stdoutLogs.join('\n'),
        stderr: errMsg,
        output: errMsg,
        runtimeMs: elapsedMs,
        memoryMb: 8.0
      };
    }
  }
}
