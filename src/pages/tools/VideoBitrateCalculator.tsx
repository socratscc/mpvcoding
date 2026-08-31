import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import ToolPageShell from '@/components/ToolPageShell';
import ResultPanel from '@/components/ResultPanel';
import {
  videoBitrateForSize,
  kbpsToMbps,
  type SizeUnit,
} from '@/lib/calculators/videoBitrate';

type DurationUnit = 'minutes' | 'seconds' | 'hours';
type OutUnit = 'Mbps' | 'kbps';

const DURATION_TO_SECONDS: Record<DurationUnit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
};

const inputCls =
  'h-11 w-full rounded-lg border border-hairline bg-surface px-3 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1';
const selectCls =
  'h-11 w-full rounded-lg border border-hairline bg-surface px-2 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1';
const labelCls = 'mb-1.5 block text-[13px] font-semibold text-ink';

const DEFAULTS = { duration: '10', durationUnit: 'minutes' as DurationUnit, size: '25', sizeUnit: 'MB' as SizeUnit, audio: '128', outUnit: 'Mbps' as OutUnit };

function fmtBitrate(kbps: number, unit: OutUnit, digits = 2): string {
  if (unit === 'Mbps') return `${kbpsToMbps(kbps).toFixed(digits)} Mbps`;
  return `${Math.round(kbps).toLocaleString('en-US')} kbps`;
}

export default function VideoBitrateCalculator() {
  const [duration, setDuration] = useState(DEFAULTS.duration);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(DEFAULTS.durationUnit);
  const [size, setSize] = useState(DEFAULTS.size);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>(DEFAULTS.sizeUnit);
  const [audio, setAudio] = useState(DEFAULTS.audio);
  const [outUnit, setOutUnit] = useState<OutUnit>(DEFAULTS.outUnit);

  const { result, error } = useMemo(() => {
    try {
      const d = Number(duration);
      const s = Number(size);
      const a = Number(audio);
      if (duration.trim() === '' || d <= 0) throw new Error('Duration must be greater than 0.');
      if (size.trim() === '' || s <= 0) throw new Error('Target file size must be greater than 0.');
      if (audio.trim() !== '' && a < 0) throw new Error("Audio bitrate can't be negative.");
      if ([d, s, a].some((v) => Number.isFinite(v) && Math.abs(v) > 1e12)) {
        throw new Error('Value is too large.');
      }
      const seconds = d * DURATION_TO_SECONDS[durationUnit];
      const r = videoBitrateForSize(seconds, s, sizeUnit, audio.trim() === '' ? 0 : a);
      if (r.videoBitrateKbps <= 0) {
        throw new Error('Audio bitrate is too high for this target size — lower it or increase the file size.');
      }
      return { result: r, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid input.';
      const mapped = msg.includes('exceeds the total bitrate')
        ? 'Audio bitrate is too high for this target size — lower it or increase the file size.'
        : msg;
      return { result: null, error: mapped };
    }
  }, [duration, durationUnit, size, sizeUnit, audio]);

  const reset = () => {
    setDuration(DEFAULTS.duration);
    setDurationUnit(DEFAULTS.durationUnit);
    setSize(DEFAULTS.size);
    setSizeUnit(DEFAULTS.sizeUnit);
    setAudio(DEFAULTS.audio);
    setOutUnit(DEFAULTS.outUnit);
  };

  const primary = result ? fmtBitrate(result.videoBitrateKbps, outUnit) : undefined;
  const copyText = result
    ? `Video bitrate: ${fmtBitrate(result.videoBitrateKbps, outUnit)} (total ${fmtBitrate(result.totalBitrateKbps, outUnit)})`
    : '';

  return (
    <ToolPageShell
      title="Video Bitrate Calculator — Hit Your Target File Size"
      description="Calculate the video bitrate needed to fit a target file size. Enter duration and size, get video and total bitrate in Mbps or kbps. Free, no signup."
      path="/video-bitrate-calculator"
      h1="Video Bitrate Calculator"
      intro="Enter your video's duration and the file size you need to stay under. The calculator tells you the bitrate to set in your encoder — audio included or excluded."
      icon="/video-bitrate-calculator"
      steps={[
        "Enter your video's duration and your target file size (for example a 25 MB upload limit).",
        'Optionally add your audio bitrate — 128 kbps is typical for stereo AAC.',
        'We convert the file size to bits and divide by the duration to get the total bitrate.',
        'Subtracting the audio bitrate gives the video bitrate to set in your encoder (HandBrake, Premiere, ffmpeg…).',
      ]}
      example={
        <div className="font-mono text-[14px] leading-[22px]">
          <p className="font-sans font-semibold text-ink">Goal: fit a 10-minute video into 25 MB with 128 kbps audio.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>File size in bits: 25 MB × 8,000,000 = 200,000,000 bits</li>
            <li>Duration: 10 min = 600 s</li>
            <li>Total bitrate: 200,000,000 ÷ 600 = 333,333 bps ≈ <strong>333 kbps</strong></li>
            <li>Video bitrate: 333 − 128 = <strong>205 kbps ≈ 0.21 Mbps</strong></li>
          </ol>
          <p className="mt-3 font-sans">
            205 kbps is low for 1080p — expect heavy compression. For better quality, raise the limit to
            100 MB (≈ 1.2 Mbps video) or shorten the video.
          </p>
          <p className="mt-3 font-sans text-[12px] text-faint">
            This calculator uses decimal units (1 MB = 8,000,000 bits), matching how operating systems
            and platforms usually report file sizes.
          </p>
        </div>
      }
      faq={[
        { q: 'What bitrate should I use for 1080p video?', a: "For H.264, 8–12 Mbps is typical for good-quality 1080p30; H.265/HEVC needs roughly half. If you're targeting a file size, this calculator gives the ceiling — keep the result at or below that." },
        { q: 'What audio bitrate should I enter?', a: '128 kbps for standard stereo AAC, 192 kbps for higher quality, 320 kbps for music-heavy content. Enter 0 if the video has no audio.' },
        { q: 'Why is my actual file bigger or smaller than the estimate?', a: "Encoders don't hit bitrates exactly. Variable bitrate (VBR) and container overhead cause a few percent of drift. Leave 5–10% headroom under hard limits." },
        { q: 'Does this work for 4K video?', a: 'Yes — the math is resolution-independent. Just know that 4K needs much higher bitrates to look good (typically 35–45 Mbps for H.264), so small file targets will look poor at 4K.' },
        { q: "What's the difference between Mbps and kbps?", a: '1 Mbps = 1,000 kbps. Encoders like HandBrake use kbps; streaming platforms usually quote Mbps. Use the toggle to switch.' },
        { q: 'Is my video uploaded anywhere?', a: 'No. This is a pure calculator — all math runs in your browser and nothing is sent to a server.' },
      ]}
      related={[
        { path: '/video-file-size-calculator', name: 'Video File Size Calculator', blurb: 'Estimate file size from a bitrate you already have.' },
        { path: '/aspect-ratio-resolution-calculator', name: 'Aspect Ratio Calculator', blurb: 'Get exact pixel dimensions for any ratio.' },
        { path: '/duration-date-time-calculator', name: 'Duration & Time Calculator', blurb: 'Work out clip lengths and time offsets.' },
      ]}
      guides={
        <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <h2 className="text-faint">Guides</h2>
          <p className="mt-2 text-[15px] text-faint">
            Guide coming soon: <em>How to choose the right video bitrate for YouTube, Discord, and more.</em>
          </p>
        </div>
      }
      result={
        <div>
          <ResultPanel
            value={primary}
            unit={primary ? undefined : undefined}
            metrics={
              result
                ? [
                    { label: 'Total bitrate', value: fmtBitrate(result.totalBitrateKbps, outUnit) },
                    { label: 'Audio bitrate', value: `${Math.round(Number(audio) || 0)} kbps` },
                    { label: 'Estimated file size', value: sizeUnit === 'GB' ? `${result.estimatedSizeMB >= 1000 ? (result.estimatedSizeMB / 1000).toFixed(2) + ' GB' : result.estimatedSizeMB.toFixed(1) + ' MB'}` : `${result.estimatedSizeMB.toFixed(1)} MB` },
                  ]
                : undefined
            }
            error={error}
            formula="total bitrate = file size (bits) ÷ duration (s) · video bitrate = total bitrate − audio bitrate"
            onReset={reset}
            copyValue={copyText}
          />
          <div className="mt-4 rounded-xl bg-warning p-4 text-[15px] leading-6 text-subtle">
            If the result looks <strong>too low</strong> (under ~1 Mbps for 1080p), your video will look
            blurry or blocky — increase the target size or shorten the clip. If it's <strong>very high</strong>,
            you have room to spare and can raise quality. Need to check the actual size from a bitrate
            instead? Use the{' '}
            <Link to="/video-file-size-calculator" className="font-semibold text-brand">
              Video File Size Calculator
            </Link>
            .
          </div>
        </div>
      }
    >
      {/* B — tool UI */}
      <div className="grid gap-4">
        <div>
          <label htmlFor="vb-duration" className={labelCls}>Video duration</label>
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <input
              id="vb-duration"
              type="number"
              inputMode="decimal"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputCls}
            />
            <select
              aria-label="Duration unit"
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
              className={selectCls}
            >
              <option value="minutes">minutes</option>
              <option value="seconds">seconds</option>
              <option value="hours">hours</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="vb-size" className={labelCls}>Target file size</label>
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <input
              id="vb-size"
              type="number"
              inputMode="decimal"
              min="0"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={inputCls}
            />
            <select
              aria-label="Size unit"
              value={sizeUnit}
              onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
              className={selectCls}
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="vb-audio" className={labelCls}>Audio bitrate (kbps) <span className="font-normal text-faint">(optional)</span></label>
          <input
            id="vb-audio"
            type="number"
            inputMode="decimal"
            min="0"
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-[13px] leading-5 text-faint">
            Common values: 128 (AAC stereo), 192, 320. Leave 0 for video-only.
          </p>
        </div>

        <div>
          <span className={labelCls}>Output unit</span>
          <div className="inline-flex rounded-lg border border-hairline bg-pagebg p-1" role="group" aria-label="Output unit">
            {(['Mbps', 'kbps'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setOutUnit(u)}
                aria-pressed={outUnit === u}
                className={`h-9 rounded-md px-4 text-[14px] font-semibold transition-colors ${
                  outUnit === u ? 'bg-surface text-brand shadow-sm' : 'text-subtle hover:text-ink'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {/* results update live */}}
          className="h-11 w-full rounded-lg bg-brand text-[15px] font-semibold text-white transition-colors hover:opacity-90 sm:w-auto sm:px-8"
        >
          Calculate
        </button>
      </div>
    </ToolPageShell>
  );
}
