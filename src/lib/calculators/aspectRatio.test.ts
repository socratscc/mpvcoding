import { describe, it, expect } from 'vitest';
import { dimsToRatio, matchCommonRatio, otherSide, roundToEven, gcd } from './aspectRatio';

describe('gcd', () => {
  it('computes greatest common divisor', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(7, 13)).toBe(1);
  });
});

describe('dimsToRatio', () => {
  it('simplifies 1920x1080 to 16:9', () => {
    expect(dimsToRatio(1920, 1080)).toEqual({ w: 16, h: 9 });
  });
  it('simplifies 1080x1920 to 9:16', () => {
    expect(dimsToRatio(1080, 1920)).toEqual({ w: 9, h: 16 });
  });
  it('handles odd dimensions', () => {
    expect(dimsToRatio(1366, 768)).toEqual({ w: 683, h: 384 });
  });
  it('throws on zero/negative/absurd dims', () => {
    expect(() => dimsToRatio(0, 100)).toThrow(/greater than 0/);
    expect(() => dimsToRatio(100, -1)).toThrow(/greater than 0/);
    expect(() => dimsToRatio(200_000, 100)).toThrow(/absurdly/);
    expect(() => dimsToRatio(NaN, 100)).toThrow(/finite/);
  });
});

describe('matchCommonRatio', () => {
  it('matches 16:9 exactly', () => {
    const m = matchCommonRatio(1920, 1080);
    expect(m).not.toBeNull();
    expect(m!.label).toBe('16:9');
    expect(m!.exact).toBe(true);
  });
  it('matches 9:16 and 1:1', () => {
    expect(matchCommonRatio(1080, 1920)!.label).toBe('9:16');
    expect(matchCommonRatio(500, 500)!.label).toBe('1:1');
  });
  it('matches within small tolerance', () => {
    // 1366/768 ≈ 1.7786 vs 16/9 ≈ 1.7778 → ~0.047% deviation
    const m = matchCommonRatio(1366, 768);
    expect(m!.label).toBe('16:9');
    expect(m!.exact).toBe(false);
  });
  it('returns null when no common ratio is close', () => {
    expect(matchCommonRatio(1000, 999, 0.0001)).toBeNull(); // not exact 1:1
    expect(matchCommonRatio(17, 4)).toBeNull();
  });
  it('throws on invalid input', () => {
    expect(() => matchCommonRatio(0, 100)).toThrow(/greater than 0/);
  });
});

describe('otherSide / roundToEven', () => {
  it('computes height from width for 16:9', () => {
    expect(otherSide(16, 9, 1920, 'width')).toBe(1080);
  });
  it('computes width from height for 9:16', () => {
    expect(otherSide(9, 16, 1920, 'height')).toBe(1080);
  });
  it('rounds to even pixels', () => {
    // 1000 * 9/16 = 562.5 → rounds to 562
    expect(otherSide(16, 9, 1000, 'width')).toBe(562);
    expect(roundToEven(563)).toBe(564);
    expect(roundToEven(561)).toBe(562);
    expect(roundToEven(562)).toBe(562);
  });
  it('throws on invalid ratio', () => {
    expect(() => otherSide(0, 9, 1920, 'width')).toThrow(/greater than 0/);
    expect(() => otherSide(16, 9, -100, 'width')).toThrow(/greater than 0/);
  });
});
