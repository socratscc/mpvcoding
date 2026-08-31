import { describe, it, expect } from 'vitest';
import {
  videoBitrateForSize,
  mbToBytes,
  bytesToGB,
  kbpsToMbps,
  mbpsToKbps,
} from './videoBitrate';

describe('videoBitrateForSize', () => {
  it('computes total & video bitrate for a 10 min, 25 MB target with 128 kbps audio', () => {
    const r = videoBitrateForSize(600, 25, 'MB', 128);
    // 25,000,000 B * 8 / 600 s = 333,333.33 bps = 333.333 kbps total
    expect(r.totalBitrateKbps).toBeCloseTo(333.333, 2);
    expect(r.videoBitrateKbps).toBeCloseTo(205.333, 2);
    expect(r.estimatedSizeMB).toBeCloseTo(25, 5);
  });

  it('supports GB targets', () => {
    const r = videoBitrateForSize(3600, 2, 'GB', 0);
    // 2e9 * 8 / 3600 = 4,444,444 bps ≈ 4444.44 kbps
    expect(r.totalBitrateKbps).toBeCloseTo(4444.444, 1);
    expect(r.videoBitrateKbps).toBeCloseTo(4444.444, 1);
  });

  it('defaults audio bitrate to 0', () => {
    const r = videoBitrateForSize(60, 8);
    expect(r.videoBitrateKbps).toBeCloseTo(r.totalBitrateKbps, 10);
    expect(r.estimatedSizeMB).toBeCloseTo(8, 5);
  });

  it('throws on zero/negative duration', () => {
    expect(() => videoBitrateForSize(0, 25)).toThrow(/greater than 0/);
    expect(() => videoBitrateForSize(-10, 25)).toThrow(/greater than 0/);
  });

  it('throws on zero/negative target size and invalid unit', () => {
    expect(() => videoBitrateForSize(60, 0)).toThrow(/greater than 0/);
    expect(() => videoBitrateForSize(60, -5)).toThrow(/greater than 0/);
    // @ts-expect-error invalid unit
    expect(() => videoBitrateForSize(60, 5, 'TB')).toThrow(/MB.*GB/);
  });

  it('throws when audio bitrate exceeds what target allows', () => {
    // 1 MB over 3600s → 2.22 kbps total; audio 128 kbps cannot fit
    expect(() => videoBitrateForSize(3600, 1, 'MB', 128)).toThrow(/exceeds/);
  });

  it('throws on absurd values and NaN/Infinity', () => {
    expect(() => videoBitrateForSize(1e10, 25)).toThrow(/absurdly/);
    expect(() => videoBitrateForSize(60, 2e9)).toThrow(/absurdly/);
    expect(() => videoBitrateForSize(NaN, 25)).toThrow(/finite/);
    expect(() => videoBitrateForSize(60, Infinity)).toThrow(/finite/);
  });
});

describe('unit helpers', () => {
  it('converts MB to bytes using decimal units', () => {
    expect(mbToBytes(1)).toBe(1_000_000);
  });
  it('converts bytes to GB', () => {
    expect(bytesToGB(2_500_000_000)).toBe(2.5);
  });
  it('converts kbps <-> Mbps', () => {
    expect(kbpsToMbps(1500)).toBe(1.5);
    expect(mbpsToKbps(2.5)).toBe(2500);
  });
});
