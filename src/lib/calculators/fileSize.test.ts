import { describe, it, expect } from 'vitest';
import { estimateFileSize } from './fileSize';

describe('estimateFileSize', () => {
  it('computes size from duration + video/audio bitrate', () => {
    // 6000 kbps + 128 kbps = 6128 kbps over 600s → 6128e3*600/8 = 459,600,000 B
    const r = estimateFileSize(600, 6000, 128);
    expect(r.totalBitrateKbps).toBe(6128);
    expect(r.sizeMB).toBeCloseTo(459.6, 3);
    expect(r.sizeGB).toBeCloseTo(0.4596, 5);
  });

  it('handles zero audio bitrate', () => {
    const r = estimateFileSize(3600, 1000, 0);
    expect(r.sizeMB).toBeCloseTo(450, 5);
  });

  it('throws on zero/negative duration', () => {
    expect(() => estimateFileSize(0, 1000)).toThrow(/greater than 0/);
    expect(() => estimateFileSize(-5, 1000)).toThrow(/greater than 0/);
  });

  it('throws on negative bitrates', () => {
    expect(() => estimateFileSize(60, -1)).toThrow(/negative/);
    expect(() => estimateFileSize(60, 100, -50)).toThrow(/negative/);
  });

  it('throws when total bitrate is zero', () => {
    expect(() => estimateFileSize(60, 0, 0)).toThrow(/greater than 0/);
  });

  it('throws on absurd/invalid values', () => {
    expect(() => estimateFileSize(1e10, 100)).toThrow(/absurdly/);
    expect(() => estimateFileSize(60, 2e9)).toThrow(/absurdly/);
    expect(() => estimateFileSize(NaN, 100)).toThrow(/finite/);
    expect(() => estimateFileSize(60, Infinity)).toThrow(/finite/);
  });

  it('handles huge but valid numbers', () => {
    const r = estimateFileSize(86_400, 100_000); // 1 day @ 100 Mbps
    expect(r.sizeGB).toBeCloseTo(1080, 3);
  });
});
