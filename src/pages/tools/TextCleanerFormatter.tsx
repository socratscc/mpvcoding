import { useEffect, useMemo, useRef, useState } from 'react';
import ToolPageShell from '@/components/ToolPageShell';
import {
  cleanText,
  convertCase,
  sortLines,
  dedupeLines,
  countText,
} from '@/lib/calculators/textClean';

type CaseChoice = 'none' | 'upper' | 'lower' | 'title' | 'sentence';

const checkboxCls = 'h-5 w-5 rounded border-hairline accent-[#3B6BD4]';
const ghostBtn =
  'inline-flex min-h-11 items-center rounded-lg px-3 text-[13px] font-semibold text-brand transition-colors hover:bg-accent';

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toUpperCase());
}

export default function TextCleanerFormatter() {
  const [text, setText] = useState('');
  const [trim, setTrim] = useState(true);
  const [collapse, setCollapse] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [dedupe, setDedupe] = useState(false);
  const [sort, setSort] = useState(false);
  const [caseMode, setCaseMode] = useState<CaseChoice>('none');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [cleanedMsg, setCleanedMsg] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);
  const cleanedTimer = useRef<number | undefined>(undefined);

  const counts = useMemo(() => {
    try {
      return countText(text);
    } catch {
      return null;
    }
  }, [text]);

  const large = text.length > 1_000_000;

  const flashNotice = (msg: string | null) => {
    setNotice(msg);
    window.clearTimeout(noticeTimer.current);
    if (msg) noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
  };

  const runClean = () => {
    if (text === '') {
      flashNotice('Paste some text first.');
      return;
    }
    try {
      let applied = 0;
      let out = cleanText(text, { trim, collapseSpaces: collapse, removeBlankLines: removeBlank, normalizeLineEndings: normalize });
      if (trim) applied += 1;
      if (collapse) applied += 1;
      if (removeBlank) applied += 1;
      if (normalize) applied += 1;
      if (dedupe) {
        out = dedupeLines(out);
        applied += 1;
      }
      if (sort) {
        out = sortLines(out, 'asc');
        applied += 1;
      }
      if (caseMode !== 'none') {
        out = caseMode === 'sentence' ? toSentenceCase(out) : convertCase(out, caseMode);
        applied += 1;
      }
      setText(out);
      flashNotice(null);
      setCleanedMsg(`Cleaned ✓ — ${applied} operation${applied === 1 ? '' : 's'} applied.`);
      window.clearTimeout(cleanedTimer.current);
      cleanedTimer.current = window.setTimeout(() => setCleanedMsg(null), 2000);
    } catch (e) {
      flashNotice(e instanceof Error ? e.message : 'Something went wrong while cleaning.');
    }
  };

  // Re-run live on option toggle when text is present.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (text !== '') runClean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trim, collapse, removeBlank, normalize, dedupe, sort, caseMode]);

  useEffect(
    () => () => {
      window.clearTimeout(noticeTimer.current);
      window.clearTimeout(cleanedTimer.current);
    },
    [],
  );

  const paste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) setText((t) => (t ? `${t}\n${clip}` : clip));
    } catch {
      flashNotice('Clipboard unavailable — paste manually with Ctrl/Cmd+V.');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      flashNotice('Clipboard unavailable — select the text and copy manually.');
    }
  };

  const reset = () => {
    setText('');
    setTrim(true);
    setCollapse(true);
    setRemoveBlank(false);
    setNormalize(false);
    setDedupe(false);
    setSort(false);
    setCaseMode('none');
    flashNotice(null);
    setCleanedMsg(null);
  };

  const ops: Array<[string, boolean, (v: boolean) => void, string]> = [
    ['trim', trim, setTrim, 'Trim leading/trailing spaces on each line'],
    ['collapse', collapse, setCollapse, 'Collapse multiple spaces into one'],
    ['blank', removeBlank, setRemoveBlank, 'Remove blank lines'],
    ['normalize', normalize, setNormalize, 'Normalize line breaks (CRLF/CR → LF)'],
    ['dedupe', dedupe, setDedupe, 'Remove duplicate lines'],
    ['sort', sort, setSort, 'Sort lines (A→Z)'],
  ];

  return (
    <ToolPageShell
      title="Text Cleaner & Formatter — Remove Spaces, Blank Lines, Duplicates"
      description="Paste text and clean it instantly: trim spaces, remove blank lines, fix line breaks, change case, sort and dedupe lines. Runs 100% locally in your browser."
      path="/text-cleaner-formatter"
      h1="Text Cleaner & Formatter"
      intro="Paste messy text, pick the cleanups you need, and copy the result. Everything is processed locally on your device — nothing is uploaded or stored."
      icon="/text-cleaner-formatter"
      steps={[
        'Paste or type your text into the box.',
        'Tick the cleanups you want — trim spaces, remove blank or duplicate lines, sort, or change case.',
        'Click Clean text (or just toggle an option) — the text is cleaned in place.',
        'Copy the result with one click. Repeat as needed — nothing is stored.',
      ]}
      example={
        <div>
          <p>
            With <strong className="text-ink">Trim spaces</strong>, <strong className="text-ink">Collapse spaces</strong>,{' '}
            <strong className="text-ink">Remove blank lines</strong> and{' '}
            <strong className="text-ink">Remove duplicate lines</strong> enabled:
          </p>
          <p className="mt-2 font-semibold text-ink">Input</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-hairline bg-surface p-3 font-mono text-[13px] leading-5 text-subtle">{`  apple   pie

  banana split
  apple   pie`}</pre>
          <p className="mt-2 font-semibold text-ink">Output</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-hairline bg-surface p-3 font-mono text-[13px] leading-5 text-subtle">{`apple pie
banana split`}</pre>
          <p className="mt-2">
            Line count 4 → 2 · Characters 52 → 22. Each raw line was trimmed and collapsed; the empty line was
            removed; the second “apple pie” was dropped as a duplicate.
          </p>
        </div>
      }
      faq={[
        {
          q: 'Is my text uploaded or stored?',
          a: 'No. All processing is local JavaScript in your browser. Nothing is sent to any server, and nothing is saved when you leave the page.',
        },
        {
          q: "What's the maximum text size?",
          a: "There's no hard limit; texts up to a few hundred thousand characters clean instantly. Extremely large pastes (over ~1M characters) may take a moment.",
        },
        {
          q: "Does 'Remove duplicate lines' keep the first occurrence?",
          a: 'Yes. Lines are compared exactly (after trimming, if that option is on), and the first occurrence of each unique line is kept in its original position.',
        },
        {
          q: "What does 'Normalize line breaks' do?",
          a: 'It converts Windows-style (CRLF) and old Mac-style (CR) line endings to Unix-style (LF), so pasted text from different systems behaves consistently.',
        },
        {
          q: 'Can I undo a cleaning?',
          a: "Yes — your browser's undo (Ctrl/Cmd+Z) works in the textarea right after cleaning.",
        },
      ]}
      related={[
        { path: '/duration-date-time-calculator', name: 'Duration & Time Calculator', blurb: 'Clean up logs, then compute their time spans.' },
        { path: '/video-bitrate-calculator', name: 'Video Bitrate Calculator', blurb: 'Planning exports? Get the right bitrate.' },
        { path: '/aspect-ratio-resolution-calculator', name: 'Aspect Ratio Calculator', blurb: 'Match dimensions for any platform.' },
      ]}
      guides={
        <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <h2 className="text-faint">Guides</h2>
          <p className="mt-2 text-[15px] text-faint">
            Guide coming soon: <em>10 text cleanups that save an hour every week.</em>
          </p>
        </div>
      }
      result={
        <section className="rounded-xl border border-hairline bg-surface p-6" aria-live="polite">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copy}
              disabled={text === ''}
              className="inline-flex h-11 items-center rounded-lg border border-hairline bg-surface px-4 text-[15px] font-semibold text-subtle transition-colors hover:border-subtle hover:text-ink disabled:opacity-40"
            >
              {copied ? 'Copied ✓' : 'Copy result'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center rounded-lg px-4 text-[15px] font-semibold text-faint transition-colors hover:text-ink"
            >
              Reset
            </button>
            {cleanedMsg && (
              <span className="text-[13px] font-semibold text-success" role="status">
                {cleanedMsg}
              </span>
            )}
          </div>
          <p className="mt-4 rounded-lg bg-warning px-4 py-3 text-[13px] leading-5 text-subtle">
            All cleaning happens in your browser with plain JavaScript. You can disconnect from the internet and
            this tool keeps working — your text is never sent to a server.
          </p>
        </section>
      }
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label htmlFor="tc-text" className="text-[13px] font-semibold text-ink">
          Your text
        </label>
        <div className="-my-2 flex">
          <button type="button" onClick={paste} className={ghostBtn}>Paste</button>
          <button type="button" onClick={() => setText('')} className={ghostBtn}>Clear</button>
        </div>
      </div>

      <textarea
        id="tc-text"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here…"
        className="mt-1 min-h-[220px] w-full resize-y rounded-lg border border-hairline bg-surface p-3 text-[15px] leading-6 text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
      />

      {/* Privacy chip */}
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#BFDCC9] bg-[#EAF4EE] px-3 py-1 text-[13px] font-medium text-success">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Processed locally — text is never uploaded.
      </p>

      {/* Stats bar */}
      <p
        key={`${counts?.chars ?? 0}-${counts?.words ?? 0}-${counts?.lines ?? 0}`}
        className="mt-3 rounded-lg px-2 py-1 font-mono tnum text-[13px] leading-5 text-faint [animation:resultflash_200ms_ease-out]"
        aria-live="polite"
      >
        Characters: {(counts?.chars ?? 0).toLocaleString('en-US')} · Words:{' '}
        {(counts?.words ?? 0).toLocaleString('en-US')} · Lines: {(counts?.lines ?? 0).toLocaleString('en-US')}
      </p>
      {large && (
        <p className="mt-1 text-[13px] text-error">Large text — processing may take a moment.</p>
      )}

      {/* Operations */}
      <fieldset className="mt-4">
        <legend className="text-[13px] font-semibold text-ink">Cleanups</legend>
        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {ops.map(([key, val, set, label]) => (
            <label key={key} className="flex min-h-11 cursor-pointer items-center gap-2 text-[15px] text-subtle">
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => set(e.target.checked)}
                className={`${checkboxCls} transition-all duration-100`}
              />
              {label}
            </label>
          ))}
          <label className="flex min-h-11 items-center gap-2 text-[15px] text-subtle">
            <span className="shrink-0">Case</span>
            <select
              value={caseMode}
              onChange={(e) => setCaseMode(e.target.value as CaseChoice)}
              className="h-11 w-full rounded-lg border border-hairline bg-surface px-2 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
            >
              <option value="none">No change</option>
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="title">Title Case</option>
              <option value="sentence">Sentence case</option>
            </select>
          </label>
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runClean}
          className="inline-flex h-11 items-center rounded-lg bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:opacity-90"
        >
          Clean text
        </button>
        {notice && <span className="text-[13px] text-faint" role="status">{notice}</span>}
      </div>
    </ToolPageShell>
  );
}
