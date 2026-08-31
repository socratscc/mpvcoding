/**
 * Video file size estimator.
 * NOTE: decimal units — 1 MB = 1,000,000 bytes; 1 kbps = 1,000 bits/s; 1 byte = 8 bits.
 */

export interface FileSizeResult {
  sizeMB: number;
  sizeGB: number;
  totalBitrateKbps: number;
}

const MAX_SECONDS = 10 ** 9;
const MAX_KBPS = 10 ** 9;

function assertFinite(value: number, name: string): void {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number.`);
  }
}

/**
 * Estimate file size from duration and bitrates.
 * @param durationSeconds total duration in seconds (> 0)
 * @param videoBitrateKbps video bitrate in kbps (>= 0)
 * @param audioBitrateKbps audio bitrate in kbps (>= 0, default 0)
 */
export function estimateFileSize(
  durationSeconds: number,
  videoBitrateKbps: number,
  audioBitrateKbps: number = 0,
): FileSizeResult {
  assertFinite(durationSeconds, 'Duration (seconds)');
  assertFinite(videoBitrateKbps, 'Video bitrate (kbps)');
  assertFinite(audioBitrateKbps, 'Audio bitrate (kbps)');
  if (durationSeconds <= 0) throw new Error('Duration must be greater than 0.');
  if (durationSeconds > MAX_SECONDS) throw new Error('Duration is absurdly large.');
  if (videoBitrateKbps < 0) throw new Error('Video bitrate cannot be negative.');
  if (audioBitrateKbps < 0) throw new Error('Audio bitrate cannot be negative.');
  const totalBitrateKbps = videoBitrateKbps + audioBitrateKbps;
  if (totalBitrateKbps <= 0) throw new Error('Total bitrate must be greater than 0.');
  if (totalBitrateKbps > MAX_KBPS) throw new Error('Bitrate is absurdly large.');

  const bytes = (totalBitrateKbps * 1000 * durationSeconds) / 8;
  return {
    sizeMB: bytes / 1_000_000,
    sizeGB: bytes / 1_000_000_000,
    totalBitrateKbps,
  };
}
