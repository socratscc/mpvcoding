/**
 * Duration & date-time calculations.
 */

export interface DurationBreakdown {
  /** Signed totals */
  totalMilliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  /** Absolute breakdown of the magnitude (always non-negative) */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True when `from` is after `to` (negative duration). */
  negative: boolean;
}

export type TimeInput = Date | number | string;

const MAX_ABS_MS = 1000 * 365.25 * 24 * 60 * 60 * 1000; // 1000 years — beyond is absurd

function toDate(value: TimeInput, name: string): Date {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`${name} is not a valid date/time.`);
  }
  return d;
}

/** Duration between two datetimes: `to - from`. Negative when `to` precedes `from`. */
export function durationBetween(from: TimeInput, to: TimeInput): DurationBreakdown {
  const a = toDate(from, 'Start time');
  const b = toDate(to, 'End time');
  const ms = b.getTime() - a.getTime();
  if (Math.abs(ms) > MAX_ABS_MS) throw new Error('Time span is absurdly large.');
  const abs = Math.abs(ms);
  const seconds = Math.floor(abs / 1000);
  return {
    totalMilliseconds: ms,
    totalSeconds: ms / 1000,
    totalMinutes: ms / 60_000,
    totalHours: ms / 3_600_000,
    totalDays: ms / 86_400_000,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    negative: ms < 0,
  };
}

export interface DurationParts {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

function partsToMs(parts: DurationParts): number {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parts;
  for (const [name, v] of Object.entries({ days, hours, minutes, seconds })) {
    if (typeof v !== 'number' || Number.isNaN(v) || !Number.isFinite(v)) {
      throw new Error(`Duration part "${name}" must be a finite number.`);
    }
  }
  return ((days * 24 + hours) * 3600 + minutes * 60 + seconds) * 1000;
}

/** Add a duration to a datetime. Returns a new Date. */
export function addDuration(base: TimeInput, parts: DurationParts): Date {
  const d = toDate(base, 'Base time');
  return new Date(d.getTime() + partsToMs(parts));
}

/** Subtract a duration from a datetime. Returns a new Date. */
export function subtractDuration(base: TimeInput, parts: DurationParts): Date {
  const d = toDate(base, 'Base time');
  return new Date(d.getTime() - partsToMs(parts));
}
