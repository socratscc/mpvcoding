import { describe, it, expect } from 'vitest';
import { durationBetween, addDuration, subtractDuration } from './timeCalc';

describe('durationBetween', () => {
  it('computes a simple positive duration', () => {
    const d = durationBetween('2025-01-01T00:00:00Z', '2025-01-02T03:30:00Z');
    expect(d.negative).toBe(false);
    expect(d.days).toBe(1);
    expect(d.hours).toBe(3);
    expect(d.minutes).toBe(30);
    expect(d.totalMinutes).toBe(27.5 * 60);
    expect(d.totalSeconds).toBe(99000);
  });

  it('handles negative durations (end before start)', () => {
    const d = durationBetween('2025-06-10T12:00:00Z', '2025-06-10T10:30:00Z');
    expect(d.negative).toBe(true);
    expect(d.totalMinutes).toBe(-90);
    expect(d.hours).toBe(1);
    expect(d.minutes).toBe(30);
  });

  it('handles leap-day spans (Feb 28 → Mar 1 2024 = 2 days)', () => {
    const d = durationBetween('2024-02-28T00:00:00Z', '2024-03-01T00:00:00Z');
    expect(d.totalDays).toBe(2);
    const d2025 = durationBetween('2025-02-28T00:00:00Z', '2025-03-01T00:00:00Z');
    expect(d2025.totalDays).toBe(1);
  });

  it('zero duration when times are equal', () => {
    const d = durationBetween('2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');
    expect(d.totalMilliseconds).toBe(0);
    expect(d.negative).toBe(false);
    expect(d.days).toBe(0);
  });

  it('accepts Date objects and timestamps', () => {
    const d = durationBetween(new Date(0), 3600_000);
    expect(d.totalHours).toBe(1);
  });

  it('throws on invalid dates and absurd spans', () => {
    expect(() => durationBetween('not-a-date', new Date())).toThrow(/not a valid/);
    expect(() => durationBetween(new Date(), 'banana')).toThrow(/not a valid/);
    expect(() => durationBetween('0001-01-01T00:00:00Z', '9999-01-01T00:00:00Z')).toThrow(/absurdly/);
  });
});

describe('addDuration / subtractDuration', () => {
  it('adds days, hours, minutes, seconds', () => {
    const r = addDuration('2025-01-01T00:00:00Z', { days: 1, hours: 2, minutes: 30, seconds: 15 });
    expect(r.toISOString()).toBe('2025-01-02T02:30:15.000Z');
  });

  it('subtracts a duration', () => {
    const r = subtractDuration('2025-01-02T02:30:15.000Z', { days: 1, hours: 2, minutes: 30, seconds: 15 });
    expect(r.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });

  it('crosses month/year boundaries correctly', () => {
    const r = addDuration('2024-12-31T23:00:00Z', { hours: 2 });
    expect(r.toISOString()).toBe('2025-01-01T01:00:00.000Z');
  });

  it('handles zero parts (no-op)', () => {
    const r = addDuration('2025-05-05T05:05:05.000Z', {});
    expect(r.toISOString()).toBe('2025-05-05T05:05:05.000Z');
  });

  it('throws on invalid base date or non-finite parts', () => {
    expect(() => addDuration('nope', { days: 1 })).toThrow(/not a valid/);
    expect(() => subtractDuration(new Date(), { days: NaN })).toThrow(/finite/);
    expect(() => addDuration(new Date(), { hours: Infinity })).toThrow(/finite/);
  });
});
