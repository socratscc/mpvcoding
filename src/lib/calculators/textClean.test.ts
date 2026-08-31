import { describe, it, expect } from 'vitest';
import {
  cleanText,
  collapseSpaces,
  convertCase,
  countText,
  dedupeLines,
  normalizeLineEndings,
  removeBlankLines,
  sortLines,
  trimText,
} from './textClean';

describe('normalizeLineEndings', () => {
  it('converts CRLF and CR to LF', () => {
    expect(normalizeLineEndings('a\r\nb\rc')).toBe('a\nb\nc');
  });
});

describe('collapseSpaces', () => {
  it('collapses runs of spaces/tabs but keeps newlines', () => {
    expect(collapseSpaces('a   b\t\tc\nd  e')).toBe('a b c\nd e');
  });
});

describe('trimText', () => {
  it('trims each line and the whole text', () => {
    expect(trimText('  hello  \n  world  ')).toBe('hello\nworld');
  });
});

describe('removeBlankLines', () => {
  it('removes blank and whitespace-only lines', () => {
    expect(removeBlankLines('a\n\n   \nb')).toBe('a\nb');
  });
  it('returns empty string for whitespace-only text', () => {
    expect(removeBlankLines('  \n\n')).toBe('');
  });
});

describe('cleanText', () => {
  it('applies combined operations in order', () => {
    const dirty = '  Hello   World  \r\n\r\n\r\n   Foo\tBar   ';
    expect(
      cleanText(dirty, { trim: true, collapseSpaces: true, removeBlankLines: true, normalizeLineEndings: true }),
    ).toBe('Hello World\nFoo Bar');
  });
  it('no options → text unchanged', () => {
    expect(cleanText('a  b\n\n', {})).toBe('a  b\n\n');
  });
});

describe('convertCase', () => {
  it('upper / lower', () => {
    expect(convertCase('Hello World', 'upper')).toBe('HELLO WORLD');
    expect(convertCase('Hello World', 'lower')).toBe('hello world');
  });
  it('title case capitalizes word starts', () => {
    expect(convertCase('hello world foo', 'title')).toBe('Hello World Foo');
    expect(convertCase('hELLO-wORLD', 'title')).toBe('Hello-World');
  });
  it('throws on unknown mode', () => {
    // @ts-expect-error invalid mode
    expect(() => convertCase('a', 'camel')).toThrow(/Unknown case mode/);
  });
});

describe('sortLines', () => {
  it('sorts ascending and descending', () => {
    expect(sortLines('banana\napple\ncherry')).toBe('apple\nbanana\ncherry');
    expect(sortLines('banana\napple\ncherry', 'desc')).toBe('cherry\nbanana\napple');
  });
});

describe('dedupeLines', () => {
  it('removes duplicate lines keeping first occurrence', () => {
    expect(dedupeLines('a\nb\na\nc\nb')).toBe('a\nb\nc');
  });
  it('duplicate-only text collapses to one line', () => {
    expect(dedupeLines('x\nx\nx')).toBe('x');
  });
});

describe('countText', () => {
  it('counts chars, words, lines', () => {
    expect(countText('hello world\nfoo')).toEqual({
      chars: 15,
      charsNoSpaces: 13,
      words: 3,
      lines: 2,
    });
  });
  it('empty text → all zeros', () => {
    expect(countText('')).toEqual({ chars: 0, charsNoSpaces: 0, words: 0, lines: 0 });
  });
  it('whitespace-only text has zero words', () => {
    const c = countText('   \n  ');
    expect(c.words).toBe(0);
    expect(c.lines).toBe(2);
  });
});

describe('input validation', () => {
  it('rejects non-string input', () => {
    // @ts-expect-error invalid input
    expect(() => countText(42)).toThrow(/string/);
  });
  it('rejects absurdly large text', () => {
    const huge = 'a'.repeat(5_000_001);
    expect(() => trimText(huge)).toThrow(/absurdly/);
  });
});
