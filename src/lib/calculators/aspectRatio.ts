/**
 * Aspect ratio / resolution calculations.
 */

export interface Ratio {
  w: number;
  h: number;
}

export interface CommonRatioMatch {
  label: string; // e.g. "16:9"
  ratio: Ratio;
  /** 0 when exact; otherwise absolute difference of w/h from the common ratio. */
  deviation: number;
  exact: boolean;
}

const COMMON_RATIOS: Ratio[] = [
  { w: 16, h: 9 },
  { w: 9, h: 16 },
  { w: 4, h: 3 },
  { w: 1, h: 1 },
  { w: 21, h: 9 },
  { w: 3, h: 2 },
  { w: 5, h: 4 },
];

/** Default tolerance (relative) for matching common ratios. */
export const RATIO_TOLERANCE = 0.01;
const MAX_DIM = 100_000;

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function assertDim(value: number, name: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number.`);
  }
  if (value <= 0) throw new Error(`${name} must be greater than 0.`);
  if (value > MAX_DIM) throw new Error(`${name} is absurdly large (max ${MAX_DIM}).`);
}

/**
 * Reduce pixel dimensions to a simplified ratio using GCD.
 * Dimensions are truncated to integers. Very large reduced terms (>1000) are
 * returned as-is rather than approximated.
 */
export function dimsToRatio(width: number, height: number): Ratio {
  assertDim(width, 'Width');
  assertDim(height, 'Height');
  const w = Math.trunc(width);
  const h = Math.trunc(height);
  if (w <= 0 || h <= 0) throw new Error('Dimensions must truncate to positive integers.');
  const d = gcd(w, h);
  return { w: w / d, h: h / d };
}

/**
 * Match dimensions against a list of common aspect ratios.
 * Returns the best match with a deviation measure, or null when nothing is
 * within tolerance.
 */
export function matchCommonRatio(
  width: number,
  height: number,
  tolerance: number = RATIO_TOLERANCE,
): CommonRatioMatch | null {
  assertDim(width, 'Width');
  assertDim(height, 'Height');
  if (tolerance < 0) throw new Error('Tolerance cannot be negative.');
  const r = width / height;
  let best: CommonRatioMatch | null = null;
  for (const cr of COMMON_RATIOS) {
    const crValue = cr.w / cr.h;
    const deviation = Math.abs(r - crValue) / crValue;
    if (deviation <= tolerance && (best === null || deviation < best.deviation)) {
      best = {
        label: `${cr.w}:${cr.h}`,
        ratio: { ...cr },
        deviation,
        exact: deviation === 0,
      };
    }
  }
  return best;
}

/** Round a pixel count to the nearest even integer (codecs prefer even dims). */
export function roundToEven(value: number): number {
  const rounded = Math.round(value);
  return rounded % 2 === 0 ? rounded : rounded + (value >= rounded ? 1 : -1);
}

/**
 * Given a ratio and one known side, compute the other side, rounded to even pixels.
 */
export function otherSide(ratioW: number, ratioH: number, known: number, knownSide: 'width' | 'height'): number {
  assertDim(ratioW, 'Ratio width');
  assertDim(ratioH, 'Ratio height');
  assertDim(known, 'Known side');
  if (knownSide === 'width') {
    return roundToEven((known * ratioH) / ratioW);
  }
  return roundToEven((known * ratioW) / ratioH);
}
