import React, { useRef, useState, useEffect } from 'react';
import { renderHighlightedCode } from '../../utils/syntaxHighlighter';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: string;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  error?: string | null;
  warning?: string | null;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  placeholder = '// Write your code solution here...',
  minHeight = '380px',
  readOnly = false,
  autoFocus = false,
  error,
  warning,
  className = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [lineCount, setLineCount] = useState<number>(1);

  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(Math.max(1, lines));
  }, [value]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleScroll = () => {
    if (!textareaRef.current) return;
    const top = textareaRef.current.scrollTop;
    const left = textareaRef.current.scrollLeft;

    if (preRef.current) {
      preRef.current.scrollTop = top;
      preRef.current.scrollLeft = left;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = top;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div
      className={`code-editor-container ${className}`}
      onClick={handleContainerClick}
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        minHeight,
        borderRadius: '8px',
        border: error
          ? '1.5px solid var(--state-error, #F43F5E)'
          : warning
          ? '1.5px solid var(--state-warning, #F59E0B)'
          : '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-code-editor, #231225)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: 'text'
      }}
    >
      {/* 1. LINE NUMBERS GUTTER */}
      <div
        ref={gutterRef}
        className="code-editor-gutter"
        style={{
          width: '44px',
          flexShrink: 0,
          padding: '12px 6px',
          backgroundColor: 'var(--code-gutter-bg, #1B0D1D)',
          borderRight: '1px solid var(--code-gutter-border, #3D1E3E)',
          color: 'var(--code-line-number, #C084FC)',
          fontFamily: 'Consolas, Monaco, "JetBrains Mono", monospace',
          fontSize: '0.825rem',
          lineHeight: '1.6',
          textAlign: 'right',
          userSelect: 'none',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {lineNumbers.map((num) => (
          <div key={num} style={{ height: '1.6em' }}>
            {num}
          </div>
        ))}
      </div>

      {/* 2. SYNTAX HIGHLIGHTED DISPLAY & EDITABLE TEXTAREA WRAPPER */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          minHeight
        }}
      >
        {/* SYNTAX HIGHLIGHTING OVERLAY (BEHIND TEXTAREA) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: '12px 14px',
            fontFamily: 'Consolas, Monaco, "JetBrains Mono", monospace',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            color: 'var(--text-code-editor, #FCE7F3)',
            boxSizing: 'border-box'
          }}
        >
          {value ? (
            renderHighlightedCode(value, language)
          ) : (
            <span style={{ color: 'var(--placeholder-text, #9B6C99)', opacity: 0.65 }}>
              {placeholder}
            </span>
          )}
        </pre>

        {/* EDITABLE TEXTAREA (TRANSPARENT FOREGROUND FOR CURSOR/TYPING) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="code-editor-textarea"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: '12px 14px',
            fontFamily: 'Consolas, Monaco, "JetBrains Mono", monospace',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: 'transparent',
            color: value ? 'transparent' : 'var(--placeholder-text, #9B6C99)',
            caretColor: 'var(--accent-primary, #EC4899)',
            border: 'none',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
};
