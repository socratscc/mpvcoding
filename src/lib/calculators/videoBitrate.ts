/**
 * Video bitrate calculator.
 * NOTE: uses decimal units — 1 MB = 1,000,000 bytes, 1 GB = 1,000,000,000 bytes.
 * 1 byte = 8 bits. Bitrates are in kilobits per second (kbps, 1 kbps = 1,000 bits/s).
 */

export type SizeUnit = 'MB' | 'GB';
export type BitrateUnit = 'kbps' | 'Mbps';

export interface VideoBitrateResult {
  /** Suggested video-only bitrate in kbps. */
  videoBitrateKbps: number;
  /** Total bitrate (video + audio) in kbps. */
  totalBitrateKbps: number;
  /** Estimated file size in MB for the suggested bitrate (≈ target, sanity check). */
  estimatedSizeMB: number;
}

const MAX_SECONDS = 10 ** 9; // ~31.7 years — anything beyond is absurd
const MAX_SIZE_MB = 10 ** 9;

function assertFinite(value: number, name: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number.`);
  }
}

export function mbToBytes(mb: number): number {
  assertFinite(mb, 'Size (MB)');
  return mb * 1_000_000;
}

export function gbToBytes(gb: number): number {
  assertFinite(gb, 'Size (GB)');
  return gb * 1_000_000_000;
}

export function bytesToMB(bytes: number): number {
  assertFinite(bytes, 'Bytes');
  return bytes / 1_000_000;
}

export function bytesToGB(bytes: number): number {
  assertFinite(bytes, 'Bytes');
  return bytes / 1_000_000_000;
}

export function kbpsToMbps(kbps: number): number {
  assertFinite(kbps, 'Bitrate (kbps)');
  return kbps / 1000;
}

export function mbpsToKbps(mbps: number): number {
  assertFinite(mbps, 'Bitrate (Mbps)');
  return mbps * 1000;
}

/**
 * Given a duration and a target file size, compute the bitrate required to hit it.
 * @param durationSeconds total duration in seconds (> 0)
 * @param targetSize target file size (> 0)
 * @param sizeUnit 'MB' | 'GB' (decimal units)
 * @param audioBitrateKbps optional audio bitrate in kbps (>= 0, default 0)
 */
export function videoBitrateForSize(
  durationSeconds: number,
  targetSize: number,
  sizeUnit: SizeUnit = 'MB',
  audioBitrateKbps: number = 0,
): VideoBitrateResult {
  assertFinite(durationSeconds, 'Duration (seconds)');
  assertFinite(targetSize, 'Target size');
  assertFinite(audioBitrateKbps, 'Audio bitrate (kbps)');
  if (sizeUnit !== 'MB' && sizeUnit !== 'GB') {
    throw new Error(`Size unit must be "MB" or "GB", got "${sizeUnit}".`);
  }
  if (durationSeconds <= 0) throw new Error('Duration must be greater than 0.');
  if (durationSeconds > MAX_SECONDS) throw new Error('Duration is absurdly large.');
  if (targetSize <= 0) throw new Error('Target file size must be greater than 0.');
  const targetMB = sizeUnit === 'GB' ? targetSize * 1000 : targetSize;
  if (targetMB > MAX_SIZE_MB) throw new Error('Target file size is absurdly large.');
  if (audioBitrateKbps < 0) throw new Error('Audio bitrate cannot be negative.');

  // totalBits = bytes * 8 ; totalKbps = totalBits / seconds / 1000
  const totalBytes = targetMB * 1_000_000;
  const totalBitrateKbps = (totalBytes * 8) / durationSeconds / 1000;
  const videoBitrateKbps = totalBitrateKbps - audioBitrateKbps;
  if (videoBitrateKbps <= 0) {
    throw new Error(
      'Audio bitrate alone exceeds the total bitrate allowed by the target size. Increase the target size or lower the audio bitrate.',
    );
  }
  return {
    videoBitrateKbps,
    totalBitrateKbps,
    estimatedSizeMB: bytesToMB((videoBitrateKbps + audioBitrateKbps) * 1000 * durationSeconds / 8),
  };
}
