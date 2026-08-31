import { useMemo, useState } from 'react';
import ToolPageShell from '@/components/ToolPageShell';
import ResultPanel from '@/components/ResultPanel';
import { durationBetween, addDuration, subtractDuration } from '@/lib/calculators/timeCalc';

type Mode = 'between' | 'shift';
type Op = 'add' | 'subtract';

function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultAt(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return toLocalInputValue(d);
}

const inputCls =
  'h-11 w-full rounded-lg border border-hairline bg-surface px-3 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1';
const labelCls = 'mb-1 block text-[13px] font-semibold text-ink';

function formatDuration(days: number, hours: number, minutes: number, negative: boolean): string {
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  return (negative ? '−' : '') + parts.join(' ');
}

export default function DurationDateTimeCalculator() {
  const [mode, setMode] = useState<Mode>('between');
  const [start, setStart] = useState(() => defaultAt(9, 0));
  const [end, setEnd] = useState(() => defaultAt(17, 30));
  const [shiftBase, setShiftBase] = useState(() => defaultAt(9, 0));
  const [op, setOp] = useState<Op>('add');
  const [dDays, setDDays] = useState('0');
  const [dHours, setDHours] = useState('2');
  const [dMinutes, setDMinutes] = useState('30');

  const result = useMemo(() => {
    try {
      if (mode === 'between') {
        if (!start || !end) return { error: 'Please pick a date and time.' };
        const r = durationBetween(new Date(start), new Date(end));
        if (Math.abs(r.totalDays) > 100 * 365.25)
          return { error: 'Range too large — please keep within 100 years.' };
        return {
          error: null,
          primary: formatDuration(r.days, r.hours, r.minutes, r.negative),
          note: r.negative ? 'End is before start — showing a negative duration.' : null,
          metrics: [
            { label: 'Total minutes', value: Math.round(r.totalMinutes).toLocaleString('en-US') },
            { label: 'Total seconds', value: Math.round(r.totalSeconds).toLocaleString('en-US') },
          ],
          copy: `Duration: ${formatDuration(r.days, r.hours, r.minutes, r.negative)} (${Math.round(r.totalMinutes).toLocaleString('en-US')} minutes)`,
        };
      }
      if (!shiftBase) return { error: 'Please pick a date and time.' };
      const days = Number(dDays || '0');
      const hours = Number(dHours || '0');
      const minutes = Number(dMinutes || '0');
      if ([days, hours, minutes].some((n) => Number.isNaN(n))) {
        return { error: 'Please enter valid numbers for the duration.' };
      }
      if (days < 0 || hours < 0 || minutes < 0) {
        return { error: 'Use the Subtract switch instead of negative numbers.' };
      }
      const parts = { days, hours, minutes };
      const base = new Date(shiftBase);
      const out = op === 'add' ? addDuration(base, parts) : subtractDuration(base, parts);
      if (Math.abs(out.getTime() - base.getTime()) > 100 * 365.25 * 24 * 3600 * 1000) {
        return { error: 'Range too large — please keep within 100 years.' };
      }
      const pad = (n: number) => String(n).padStart(2, '0');
      const iso = `${out.getFullYear()}-${pad(out.getMonth() + 1)}-${pad(out.getDate())}T${pad(out.getHours())}:${pad(out.getMinutes())}`;
      const primary = out.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(/, (\d{2}:)/, ' — $1');
      const weekday = out.toLocaleDateString('en-US', { weekday: 'long' });
      return {
        error: null,
        primary,
        note: null,
        metrics: [
          { label: 'Day of week', value: weekday },
          { label: 'ISO (local)', value: iso },
        ],
        copy: `${primary} (${iso})`,
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Something went wrong.' };
    }
  }, [mode, start, end, shiftBase, op, dDays, dHours, dMinutes]);

  const reset = () => {
    setStart(defaultAt(9, 0));
    setEnd(defaultAt(17, 30));
    setShiftBase(defaultAt(9, 0));
    setOp('add');
    setDDays('0');
    setDHours('2');
    setDMinutes('30');
  };

  const tabBtn = (m: Mode, label: string) => (
    <button
      key={m}
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={`h-11 flex-1 rounded-lg px-4 text-[15px] font-semibold transition-colors duration-200 ${
        mode === m ? 'bg-brand text-white' : 'text-subtle hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  const nowBtn = (setter: (v: string) => void) => (
    <button
      type="button"
      onClick={() => setter(toLocalInputValue(new Date()))}
      className="mt-1 inline-flex min-h-11 items-center text-[13px] font-semibold text-brand hover:underline"
    >
      Set to now
    </button>
  );

  return (
    <ToolPageShell
      title="Duration & Time Calculator — Add, Subtract, Measure Time"
      description="Calculate the duration between two times, or add and subtract hours and minutes from a date and time. Days, hours, minutes, and totals. Free, no signup."
      path="/duration-date-time-calculator"
      h1="Duration & Time Calculator"
      intro="Find how much time lies between two points, or shift a date and time forward or backward. Results show days, hours, and minutes plus totals."
      icon="/duration-date-time-calculator"
      steps={[
        'Pick a mode: measure the time between two points, or shift a date/time by a duration.',
        'Time between: set start and end — we subtract the timestamps and break the difference into days, hours, and minutes.',
        'Add/subtract: set a starting point, choose add or subtract, enter days, hours, minutes.',
        "Everything runs on your device's local clock — no server, no timezone math.",
      ]}
      example={
        <div>
          <p className="font-semibold text-ink">Time between</p>
          <p>Start Jan 10, 2025 09:15 → End Jan 12, 2025 18:45.</p>
          <ol className="mt-1 list-decimal pl-5">
            <li>Difference: 2 days + 9 hours + 30 minutes</li>
            <li>
              Total minutes: (2×24 + 9) × 60 + 30 = <strong className="text-ink">3,450 minutes</strong>
            </li>
            <li>
              Total seconds: 3,450 × 60 = <strong className="text-ink">207,000 seconds</strong>
            </li>
          </ol>
          <p className="mt-3 font-semibold text-ink">Add / subtract</p>
          <p>
            Jun 18, 2025 09:00, <strong className="text-ink">add</strong> 0 days, 2 hours, 30 minutes →{' '}
            <strong className="text-ink">Jun 18, 2025 11:30</strong>.
          </p>
        </div>
      }
      faq={[
        {
          q: 'Does this handle timezones?',
          a: 'No. Both times are read as your device\u2019s local time and subtracted directly. If your points are in different timezones, convert one of them first.',
        },
        {
          q: 'Can the duration be negative?',
          a: 'Yes — if the end is before the start, we show a negative duration rather than an error, so you can measure backwards.',
        },
        {
          q: 'Does it account for daylight saving time?',
          a: "Because everything uses your device's local time, a range crossing a DST change reflects your clock as displayed. For precise elapsed-seconds math across DST, use UTC timestamps.",
        },
        {
          q: 'How do I calculate work hours?',
          a: 'Enter clock-in as start and clock-out as end. Subtract breaks with the Subtract mode (e.g. minus 30 minutes for lunch).',
        },
        {
          q: 'Is my data sent anywhere?',
          a: 'No. Date math runs entirely in your browser.',
        },
      ]}
      related={[
        { path: '/video-bitrate-calculator', name: 'Video Bitrate Calculator', blurb: 'Turn a clip length into a bitrate plan.' },
        { path: '/video-file-size-calculator', name: 'Video File Size Calculator', blurb: 'See how duration affects file size.' },
        { path: '/text-cleaner-formatter', name: 'Text Cleaner & Formatter', blurb: 'Format timestamps and logs.' },
      ]}
      guides={
        <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <h2 className="text-faint">Guides</h2>
          <p className="mt-2 text-[15px] text-faint">
            Guide coming soon: <em>Working with time in spreadsheets and ffmpeg commands.</em>
          </p>
        </div>
      }
      result={
        <div>
          <ResultPanel
            value={result.error ? undefined : result.primary}
            metrics={result.error ? undefined : result.metrics}
            error={result.error}
            onReset={reset}
            copyValue={result.error ? undefined : result.copy}
          />
          {result.note && (
            <p className="mt-3 rounded-lg bg-warning px-4 py-2 text-[13px] text-subtle">{result.note}</p>
          )}
          <p className="mt-3 text-[13px] text-faint">
            Times are interpreted in your device's local timezone. No timezone conversion is performed.
          </p>
        </div>
      }
    >
      {/* Mode switch */}
      <div role="tablist" aria-label="Calculation mode" className="flex gap-1 rounded-lg border border-hairline bg-pagebg p-1">
        {tabBtn('between', 'Time between')}
        {tabBtn('shift', 'Add / subtract')}
      </div>

      <div className="mt-5 transition-opacity duration-200">
        {mode === 'between' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dtc-start" className={labelCls}>Start date &amp; time</label>
              <input
                id="dtc-start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputCls}
              />
              {nowBtn(setStart)}
            </div>
            <div>
              <label htmlFor="dtc-end" className={labelCls}>End date &amp; time</label>
              <input
                id="dtc-end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputCls}
              />
              {nowBtn(setEnd)}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="dtc-base" className={labelCls}>Start date &amp; time</label>
              <input
                id="dtc-base"
                type="datetime-local"
                value={shiftBase}
                onChange={(e) => setShiftBase(e.target.value)}
                className={inputCls}
              />
              {nowBtn(setShiftBase)}
            </div>
            <div>
              <span className={labelCls}>Operation</span>
              <div className="inline-flex gap-1 rounded-lg border border-hairline bg-pagebg p-1" role="group" aria-label="Operation">
                {(['add', 'subtract'] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={op === o}
                    onClick={() => setOp(o)}
                    className={`h-11 rounded-lg px-5 text-[15px] font-semibold capitalize transition-colors duration-200 ${
                      op === o ? 'bg-brand text-white' : 'text-subtle hover:text-ink'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={labelCls}>Duration</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(
                  [
                    ['Days', dDays, setDDays],
                    ['Hours', dHours, setDHours],
                    ['Minutes', dMinutes, setDMinutes],
                  ] as const
                ).map(([label, val, set]) => (
                  <div key={label}>
                    <label htmlFor={`dtc-${label.toLowerCase()}`} className="mb-1 block text-[13px] text-faint">
                      {label}
                    </label>
                    <input
                      id={`dtc-${label.toLowerCase()}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
