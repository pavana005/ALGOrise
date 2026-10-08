import React from 'react';

/**
 * ALGOrise Syntax Highlighter Utility
 * Formats source code strings into structured, syntax-highlighted React nodes
 * supporting Python, Java, C++, JavaScript, C, C#, and Go across Dark, Light, and Cute modes.
 */

const KEYWORDS = new Set([
  // Python
  'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'is', 'and', 'or', 'not',
  'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'pass',
  'break', 'continue', 'global', 'nonlocal', 'async', 'await', 'None', 'True', 'False', 'self',
  // Java / C# / C++ / C / Go / JS
  'public', 'private', 'protected', 'static', 'void', 'int', 'long', 'double', 'float', 'boolean',
  'bool', 'char', 'string', 'String', 'struct', 'interface', 'enum', 'do', 'switch', 'case', 'new',
  'this', 'super', 'catch', 'throw', 'throws', 'package', 'namespace', 'using', 'func', 'var',
  'let', 'const', 'function', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false', 'nil',
  'auto', 'template', 'typename', 'vector', 'map', 'unordered_map', 'set', 'pair', 'std', 'include',
  'type', 'range', 'chan', 'select', 'defer', 'go', 'fallthrough'
]);

const TYPES = new Set([
  'List', 'Dict', 'Set', 'Tuple', 'Optional', 'Union', 'Any', 'int', 'long', 'float', 'double',
  'boolean', 'bool', 'char', 'string', 'String', 'vector', 'map', 'unordered_map', 'set', 'pair',
  'ListNode', 'TreeNode', 'Solution', 'int[]', 'String[]', 'vector<int>', 'vector<string>',
  'int*', 'char*', 'void*', 'struct'
]);

interface SyntaxToken {
  type: 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'function' | 'operator' | 'text';
  value: string;
}

export function tokenizeCode(code: string, _language: string = 'python'): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const char = code[i];

    // 1. Comments
    if ((char === '/' && code[i + 1] === '/') || char === '#') {
      let commentEnd = code.indexOf('\n', i);
      if (commentEnd === -1) commentEnd = n;
      tokens.push({ type: 'comment', value: code.substring(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    if (char === '/' && code[i + 1] === '*') {
      let commentEnd = code.indexOf('*/', i + 2);
      if (commentEnd === -1) commentEnd = n;
      else commentEnd += 2;
      tokens.push({ type: 'comment', value: code.substring(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // 2. String Literals ("...", '...', `...`)
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      let strEnd = i + 1;
      while (strEnd < n) {
        if (code[strEnd] === '\\') {
          strEnd += 2;
          continue;
        }
        if (code[strEnd] === quote) {
          strEnd++;
          break;
        }
        if (code[strEnd] === '\n' && quote !== '`') break;
        strEnd++;
      }
      tokens.push({ type: 'string', value: code.substring(i, strEnd) });
      i = strEnd;
      continue;
    }

    // 3. Numbers
    if (/\d/.test(char) && (i === 0 || !/[a-zA-Z0-9_]/.test(code[i - 1]))) {
      let numEnd = i;
      while (numEnd < n && /[\d.xXa-fA-F]/.test(code[numEnd])) {
        numEnd++;
      }
      tokens.push({ type: 'number', value: code.substring(i, numEnd) });
      i = numEnd;
      continue;
    }

    // 4. Identifiers / Keywords / Functions
    if (/[a-zA-Z_$]/.test(char)) {
      let idEnd = i;
      while (idEnd < n && /[a-zA-Z0-9_$]/.test(code[idEnd])) {
        idEnd++;
      }
      const word = code.substring(i, idEnd);

      // Check if function call (followed by '(')
      let nextCharIdx = idEnd;
      while (nextCharIdx < n && /\s/.test(code[nextCharIdx])) nextCharIdx++;
      const isFunction = nextCharIdx < n && code[nextCharIdx] === '(';

      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (TYPES.has(word)) {
        tokens.push({ type: 'type', value: word });
      } else if (isFunction && !['if', 'for', 'while', 'switch', 'catch'].includes(word)) {
        tokens.push({ type: 'function', value: word });
      } else {
        tokens.push({ type: 'text', value: word });
      }
      i = idEnd;
      continue;
    }

    // 5. Operators
    if (/[+\-*/%=&|^<>!?:~]/.test(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    // 6. Whitespace and structural tokens
    tokens.push({ type: 'text', value: char });
    i++;
  }

  return tokens;
}

export const renderHighlightedCode = (code: string, language: string = 'python'): React.ReactNode => {
  if (!code) return null;
  const tokens = tokenizeCode(code, language);

  return (
    <>
      {tokens.map((token, index) => {
        switch (token.type) {
          case 'keyword':
            return <span key={index} className="code-token-keyword">{token.value}</span>;
          case 'type':
            return <span key={index} className="code-token-type">{token.value}</span>;
          case 'string':
            return <span key={index} className="code-token-string">{token.value}</span>;
          case 'number':
            return <span key={index} className="code-token-number">{token.value}</span>;
          case 'comment':
            return <span key={index} className="code-token-comment">{token.value}</span>;
          case 'function':
            return <span key={index} className="code-token-function">{token.value}</span>;
          case 'operator':
            return <span key={index} className="code-token-operator">{token.value}</span>;
          default:
            return <span key={index}>{token.value}</span>;
        }
      })}
    </>
  );
};
