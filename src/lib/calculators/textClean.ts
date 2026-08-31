/**
 * Text cleaning / formatting utilities. All processing is local (client-side).
 */

export interface CleanOptions {
  /** Trim leading/trailing whitespace of the whole text and each line. */
  trim?: boolean;
  /** Collapse runs of spaces/tabs within a line into a single space. */
  collapseSpaces?: boolean;
  /** Remove blank (whitespace-only) lines. */
  removeBlankLines?: boolean;
  /** Normalize line endings to "\n". Applied before other operations when any option touches lines. */
  normalizeLineEndings?: boolean;
}

export type CaseMode = 'upper' | 'lower' | 'title';

export interface TextCounts {
  chars: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
}

const MAX_LENGTH = 5_000_000; // 5M chars — beyond is absurd for this tool

function assertText(text: string): void {
  if (typeof text !== 'string') throw new Error('Input must be a string.');
  if (text.length > MAX_LENGTH) throw new Error('Text is absurdly large (max 5,000,000 characters).');
}

/** Normalize CRLF / CR line endings to LF. */
export function normalizeLineEndings(text: string): string {
  assertText(text);
  return text.replace(/\r\n?/g, '\n');
}

/** Collapse runs of spaces/tabs within each line to a single space. */
export function collapseSpaces(text: string): string {
  assertText(text);
  return text.replace(/[^\S\n]+/g, ' ');
}

/** Trim each line and the whole text. */
export function trimText(text: string): string {
  assertText(text);
  return text
    .split('\n')
    .map((l) => l.replace(/^[^\S\n]+|[^\S\n]+$/g, ''))
    .join('\n')
    .replace(/^[^\S\n]+|[^\S\n]+$/g, '');
}

/** Remove blank (whitespace-only) lines. */
export function removeBlankLines(text: string): string {
  assertText(text);
  return text
    .split('\n')
    .filter((l) => l.trim() !== '')
    .join('\n');
}

/** Apply a set of cleaning operations in a fixed, sensible order. */
export function cleanText(text: string, options: CleanOptions): string {
  assertText(text);
  let out = text;
  if (options.normalizeLineEndings) out = normalizeLineEndings(out);
  if (options.collapseSpaces) out = collapseSpaces(out);
  if (options.trim) out = trimText(out);
  if (options.removeBlankLines) out = removeBlankLines(out);
  return out;
}

/** Convert case: 'upper' | 'lower' | 'title'. */
export function convertCase(text: string, mode: CaseMode): string {
  assertText(text);
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.toLowerCase().replace(/(^|[\s\-_([{"'])(\p{L})/gu, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
    default:
      throw new Error(`Unknown case mode: ${String(mode)}`);
  }
}

/** Sort lines. 'asc' (default) or 'desc', locale-aware. */
export function sortLines(text: string, direction: 'asc' | 'desc' = 'asc'): string {
  assertText(text);
  const lines = text.split('\n');
  lines.sort((a, b) => a.localeCompare(b));
  if (direction === 'desc') lines.reverse();
  return lines.join('\n');
}

/** Remove duplicate lines, keeping the first occurrence. */
export function dedupeLines(text: string): string {
  assertText(text);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split('\n')) {
    if (!seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
  }
  return out.join('\n');
}

/** Count characters, words, and lines. Empty text → all zeros. */
export function countText(text: string): TextCounts {
  assertText(text);
  const normalized = normalizeLineEndings(text);
  const words = normalized.trim() === '' ? 0 : normalized.trim().split(/\s+/).length;
  return {
    chars: normalized.length,
    charsNoSpaces: normalized.replace(/\s/g, '').length,
    words,
    lines: normalized === '' ? 0 : normalized.split('\n').length,
  };
}
