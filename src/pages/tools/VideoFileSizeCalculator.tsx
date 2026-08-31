import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import ToolPageShell from '@/components/ToolPageShell';
import ResultPanel from '@/components/ResultPanel';
import { estimateFileSize } from '@/lib/calculators/fileSize';

type DurationUnit = 'minutes' | 'seconds' | 'hours';
type BitrateUnit = 'Mbps' | 'kbps';
type OutUnit = 'auto' | 'MB' | 'GB';

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

const PRESETS: { label: string; value: string; unit: DurationUnit }[] = [
  { label: '1 min', value: '1', unit: 'minutes' },
  { label: '10 min', value: '10', unit: 'minutes' },
  { label: '30 min', value: '30', unit: 'minutes' },
  { label: '1 h', value: '1', unit: 'hours' },
  { label: '2 h', value: '2', unit: 'hours' },
];

const DEFAULTS = {
  duration: '10',
  durationUnit: 'minutes' as DurationUnit,
  bitrate: '10',
  bitrateUnit: 'Mbps' as BitrateUnit,
  audio: '128',
  outUnit: 'auto' as OutUnit,
};

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export default function VideoFileSizeCalculator() {
  const [duration, setDuration] = useState(DEFAULTS.duration);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(DEFAULTS.durationUnit);
  const [bitrate, setBitrate] = useState(DEFAULTS.bitrate);
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>(DEFAULTS.bitrateUnit);
  const [audio, setAudio] = useState(DEFAULTS.audio);
  const [outUnit, setOutUnit] = useState<OutUnit>(DEFAULTS.outUnit);

  const { result, error } = useMemo(() => {
    try {
      const d = Number(duration);
      const b = Number(bitrate);
      const a = Number(audio);
      if (duration.trim() === '' || d <= 0) throw new Error('Duration must be greater than 0.');
      if (bitrate.trim() === '' || b <= 0) throw new Error('Video bitrate must be greater than 0.');
      if (audio.trim() !== '' && a < 0) throw new Error("Audio bitrate can't be negative.");
      if ([d, b, a].some((v) => Number.isFinite(v) && Math.abs(v) > 1e12)) {
        throw new Error('Value is too large.');
      }
      const seconds = d * DURATION_TO_SECONDS[durationUnit];
      const videoKbps = bitrateUnit === 'Mbps' ? b * 1000 : b;
      const r = estimateFileSize(seconds, videoKbps, audio.trim() === '' ? 0 : a);
      return { result: { ...r, seconds }, error: null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Invalid input.' };
    }
  }, [duration, durationUnit, bitrate, bitrateUnit, audio]);

  const reset = () => {
    setDuration(DEFAULTS.duration);
    setDurationUnit(DEFAULTS.durationUnit);
    setBitrate(DEFAULTS.bitrate);
    setBitrateUnit(DEFAULTS.bitrateUnit);
    setAudio(DEFAULTS.audio);
    setOutUnit(DEFAULTS.outUnit);
  };

  const displayUnit: 'MB' | 'GB' | null = result
    ? outUnit === 'auto'
      ? result.sizeMB < 1000
        ? 'MB'
        : 'GB'
      : outUnit
    : null;

  const primary = result && displayUnit
    ? displayUnit === 'GB'
      ? `${result.sizeGB.toFixed(2)} GB`
      : `${result.sizeMB.toFixed(0)} MB`
    : undefined;

  const copyText = result && displayUnit
    ? `Estimated file size: ${primary} @ ${(result.totalBitrateKbps / 1000).toFixed(2)} Mbps total`
    : '';

  const audioMB = result ? ((Number(audio) || 0) * 1000 * result.seconds) / 8 / 1_000_000 : 0;

  return (
    <ToolPageShell
      title="Video File Size Calculator — Estimate Export Size"
      description="Estimate video file size from duration and bitrate. Quick presets for common lengths, MB/GB output, audio included. Free browser tool, no signup."
      path="/video-file-size-calculator"
      h1="Video File Size Calculator"
      intro="Know your export bitrate? Enter it with your video's duration to see how large the file will be — before you hit export."
      icon="/video-file-size-calculator"
      steps={[
        "Enter your video's duration — or tap a preset like 10 min or 1 h.",
        "Enter the video bitrate from your encoder's export settings (e.g. 10 Mbps).",
        'Add your audio bitrate (128 kbps is typical for stereo AAC).',
        "We multiply the combined bitrate by the duration and convert bits to megabytes — that's your estimated file size.",
      ]}
      example={
        <div className="font-mono text-[14px] leading-[22px]">
          <p className="font-sans font-semibold text-ink">
            Question: How big is a 10-minute 1080p video exported at 10 Mbps with 128 kbps audio?
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Total bitrate: 10,000 kbps + 128 kbps = <strong>10,128 kbps</strong></li>
            <li>Duration: 10 min = <strong>600 s</strong></li>
            <li>Total bits: 10,128,000 × 600 = 6,076,800,000 bits</li>
            <li>Convert: ÷ 8 = 759,600,000 bytes → ÷ 1,000,000 ≈ <strong>760 MB (0.76 GB)</strong></li>
          </ol>
          <p className="mt-3 font-sans text-[12px] text-faint">
            Decimal units throughout: 1 MB = 1,000,000 bytes, 1 Mbps = 1,000,000 bits per second.
          </p>
        </div>
      }
      faq={[
        { q: 'Why is my exported file a different size than the estimate?', a: 'Most encoders use variable bitrate (VBR), so the real average drifts from the target by a few percent. Container overhead (MP4/MKV metadata) adds a little more. Expect ±5%.' },
        { q: 'What bitrate does YouTube use?', a: 'YouTube re-encodes everything; for uploads, 8–12 Mbps (H.264 1080p) or 35–45 Mbps (4K) gives good results. This calculator helps you predict the upload file size for whatever bitrate you choose.' },
        { q: 'How big is a 1-hour video?', a: 'At 10 Mbps with 128 kbps audio: about 4.5 GB. At 25 Mbps: about 11 GB. Enter your numbers above for an exact estimate.' },
        { q: 'Does 4K always mean huge files?', a: 'Not necessarily — file size depends on bitrate and duration, not resolution. 4K at a low bitrate just looks soft. Use this together with the Aspect Ratio Calculator to plan exports.' },
        { q: 'Is anything uploaded?', a: 'No. The calculation is pure math running in your browser.' },
      ]}
      related={[
        { path: '/video-bitrate-calculator', name: 'Video Bitrate Calculator', blurb: 'Reverse it: get the bitrate for a target file size.' },
        { path: '/aspect-ratio-resolution-calculator', name: 'Aspect Ratio Calculator', blurb: "Match your resolution to any platform's ratio." },
        { path: '/duration-date-time-calculator', name: 'Duration & Time Calculator', blurb: 'Compute clip lengths and time differences.' },
      ]}
      guides={
        <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <h2 className="text-faint">Guides</h2>
          <p className="mt-2 text-[15px] text-faint">
            Guide coming soon: <em>Video file sizes for every social platform — limits and sweet spots.</em>
          </p>
        </div>
      }
      result={
        <div>
          <ResultPanel
            value={primary}
            metrics={
              result
                ? [
                    { label: 'Total bitrate', value: `${(result.totalBitrateKbps / 1000).toFixed(2)} Mbps` },
                    { label: 'Duration', value: formatDuration(result.seconds) },
                    { label: 'Audio share', value: audioMB >= 1000 ? `≈ ${(audioMB / 1000).toFixed(2)} GB` : `≈ ${audioMB.toFixed(1)} MB` },
                  ]
                : undefined
            }
            error={error}
            formula="file size (MB) = (video bitrate + audio bitrate) × duration (s) ÷ 8,000,000"
            onReset={reset}
            copyValue={copyText}
          />
          <div className="mt-4 rounded-xl bg-warning p-4 text-[15px] leading-6 text-subtle">
            Real exports vary by a few percent — encoders rarely hit the target bitrate exactly, and
            containers add small overhead. Working backwards from a size limit? Use the{' '}
            <Link to="/video-bitrate-calculator" className="font-semibold text-brand">
              Video Bitrate Calculator
            </Link>
            .
          </div>
        </div>
      }
    >
      {/* B — tool UI */}
      <div className="grid gap-4">
        <div>
          <span className={labelCls}>Quick duration</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick duration presets">
            {PRESETS.map((p) => {
              const active = duration === p.value && durationUnit === p.unit;
              return (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setDuration(p.value);
                    setDurationUnit(p.unit);
                  }}
                  className={`h-9 rounded-full border px-4 text-[14px] font-semibold transition-all duration-150 active:scale-95 ${
                    active
                      ? 'border-brand bg-accent text-brand'
                      : 'border-hairline bg-surface text-subtle hover:border-subtle hover:text-ink'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="fs-duration" className={labelCls}>Video duration</label>
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <input
              id="fs-duration"
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
          <label htmlFor="fs-bitrate" className={labelCls}>Video bitrate</label>
          <div className="grid grid-cols-[2fr_1fr] gap-2">
            <input
              id="fs-bitrate"
              type="number"
              inputMode="decimal"
              min="0"
              value={bitrate}
              onChange={(e) => setBitrate(e.target.value)}
              className={inputCls}
            />
            <select
              aria-label="Bitrate unit"
              value={bitrateUnit}
              onChange={(e) => setBitrateUnit(e.target.value as BitrateUnit)}
              className={selectCls}
            >
              <option value="Mbps">Mbps</option>
              <option value="kbps">kbps</option>
            </select>
          </div>
          <p className="mt-1 text-[13px] leading-5 text-faint">e.g. H.264 1080p ≈ 8–12 Mbps</p>
        </div>

        <div>
          <label htmlFor="fs-audio" className={labelCls}>Audio bitrate (kbps)</label>
          <input
            id="fs-audio"
            type="number"
            inputMode="decimal"
            min="0"
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-[13px] leading-5 text-faint">128 typical; 0 for no audio</p>
        </div>

        <div>
          <span className={labelCls}>Output unit</span>
          <div className="inline-flex rounded-lg border border-hairline bg-pagebg p-1" role="group" aria-label="Output unit">
            {(['auto', 'MB', 'GB'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setOutUnit(u)}
                aria-pressed={outUnit === u}
                className={`h-9 rounded-md px-4 text-[14px] font-semibold transition-colors ${
                  outUnit === u ? 'bg-surface text-brand shadow-sm' : 'text-subtle hover:text-ink'
                }`}
              >
                {u === 'auto' ? 'Auto' : u}
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
