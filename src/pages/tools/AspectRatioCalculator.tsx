import { useMemo, useState } from 'react';
import ToolPageShell from '@/components/ToolPageShell';
import ResultPanel from '@/components/ResultPanel';
import { dimsToRatio, matchCommonRatio, otherSide } from '@/lib/calculators/aspectRatio';

type Mode = 'dims-to-ratio' | 'ratio-to-dims';
type KnownSide = 'width' | 'height';

const inputCls =
  'h-11 w-full rounded-lg border border-hairline bg-surface px-3 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1';
const labelCls = 'mb-1.5 block text-[13px] font-semibold text-ink';

const PRESETS = [
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
  { label: '4:3', w: 4, h: 3 },
  { label: '1:1', w: 1, h: 1 },
  { label: '21:9', w: 21, h: 9 },
];

const RATIO_EXPLAINER: Record<string, string> = {
  '16:9': '16:9 is the standard for YouTube, TV, and most monitors.',
  '9:16': '9:16 is vertical (Shorts/Reels/TikTok).',
  '1:1': '1:1 is square feeds.',
  '4:5': '4:5 is Instagram portrait.',
  '21:9': '21:9 is ultrawide/cinematic.',
};

const DEFAULTS = {
  mode: 'dims-to-ratio' as Mode,
  width: '1920',
  height: '1080',
  ratioW: '16',
  ratioH: '9',
  knownSide: 'width' as KnownSide,
  knownValue: '1920',
};

function toInt(v: string): number {
  return Number(v);
}

export default function AspectRatioCalculator() {
  const [mode, setMode] = useState<Mode>(DEFAULTS.mode);
  const [width, setWidth] = useState(DEFAULTS.width);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [ratioW, setRatioW] = useState(DEFAULTS.ratioW);
  const [ratioH, setRatioH] = useState(DEFAULTS.ratioH);
  const [knownSide, setKnownSide] = useState<KnownSide>(DEFAULTS.knownSide);
  const [knownValue, setKnownValue] = useState(DEFAULTS.knownValue);

  const modeA = useMemo(() => {
    if (mode !== 'dims-to-ratio') return { result: null, error: null };
    try {
      const w = toInt(width);
      const h = toInt(height);
      if (width.trim() === '' || height.trim() === '' || w <= 0 || h <= 0) {
        throw new Error('Width and height must be greater than 0.');
      }
      if (!Number.isInteger(w) || !Number.isInteger(h)) {
        throw new Error('Pixels must be whole numbers.');
      }
      if (w > 100_000 || h > 100_000) throw new Error('Value is too large.');
      const reduced = dimsToRatio(w, h);
      const match = matchCommonRatio(w, h);
      return { result: { w, h, reduced, match }, error: null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Invalid input.' };
    }
  }, [mode, width, height]);

  const modeB = useMemo(() => {
    if (mode !== 'ratio-to-dims') return { result: null, error: null };
    try {
      const rw = toInt(ratioW);
      const rh = toInt(ratioH);
      const kv = toInt(knownValue);
      if (ratioW.trim() === '' || ratioH.trim() === '' || rw <= 0 || rh <= 0) {
        throw new Error('Ratio values must be greater than 0.');
      }
      if (knownValue.trim() === '' || kv <= 0) {
        throw new Error('Width and height must be greater than 0.');
      }
      if (!Number.isInteger(kv)) throw new Error('Pixels must be whole numbers.');
      if (kv > 100_000) throw new Error('Value is too large.');
      const raw = knownSide === 'width' ? (kv * rh) / rw : (kv * rw) / rh;
      const computed = otherSide(rw, rh, kv, knownSide);
      const w = knownSide === 'width' ? kv : computed;
      const h = knownSide === 'width' ? computed : kv;
      const rounded = raw !== computed;
      const scale = knownSide === 'width' ? kv / rw : kv / rh;
      const megapixels = (w * h) / 1_000_000;
      return { result: { w, h, rounded, scale, megapixels }, error: null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Invalid input.' };
    }
  }, [mode, ratioW, ratioH, knownSide, knownValue]);

  const reset = () => {
    setWidth(DEFAULTS.width);
    setHeight(DEFAULTS.height);
    setRatioW(DEFAULTS.ratioW);
    setRatioH(DEFAULTS.ratioH);
    setKnownSide(DEFAULTS.knownSide);
    setKnownValue(DEFAULTS.knownValue);
  };

  const active = mode === 'dims-to-ratio' ? modeA : modeB;

  const resultNode = (
    <div>
      <ResultPanel
        value={
          mode === 'dims-to-ratio'
            ? modeA.result
              ? `${modeA.result.reduced.w}:${modeA.result.reduced.h}`
              : undefined
            : modeB.result
              ? `${modeB.result.w} × ${modeB.result.h}`
              : undefined
        }
        metrics={
          mode === 'dims-to-ratio'
            ? modeA.result
              ? [
                  { label: 'Exact ratio', value: `${(modeA.result.w / modeA.result.h).toFixed(3)} : 1` },
                  { label: 'GCD-reduced', value: `${modeA.result.reduced.w} : ${modeA.result.reduced.h}` },
                  {
                    label: 'Match',
                    value: modeA.result.match
                      ? modeA.result.match.exact
                        ? `✓ ${matchLabel(modeA.result.match.label)}`
                        : `≈ ${modeA.result.match.label} (off by ${(modeA.result.match.deviation * 100).toFixed(1)}%)`
                      : 'Not a standard ratio',
                  },
                ]
              : undefined
            : modeB.result
              ? [
                  { label: 'Scale factor', value: `×${trimNum(modeB.result.scale)}` },
                  { label: 'Total pixels', value: `${modeB.result.megapixels.toFixed(1)} MP` },
                ]
              : undefined
        }
        error={active.error}
        onReset={reset}
        copyValue={
          mode === 'dims-to-ratio'
            ? modeA.result
              ? `${modeA.result.w}×${modeA.result.h} = ${modeA.result.reduced.w}:${modeA.result.reduced.h}`
              : ''
            : modeB.result
              ? `${ratioW}:${ratioH} → ${modeB.result.w} × ${modeB.result.h}`
              : ''
        }
      >
        {mode === 'dims-to-ratio' && modeA.result?.match && (
          <p className="mt-4 rounded-lg bg-accent px-3 py-2 text-[13px] leading-5 text-subtle">
            {RATIO_EXPLAINER[modeA.result.match.label] ??
              `${modeA.result.match.label} is a common display/video format.`}{' '}
            {explainerRest(modeA.result.match.label)}
          </p>
        )}
        {mode === 'ratio-to-dims' && modeB.result?.rounded && (
          <p className="mt-4 rounded-lg bg-warning px-3 py-2 text-[13px] leading-5 text-subtle">
            Computed side rounded to even number for encoder compatibility.
          </p>
        )}
      </ResultPanel>
    </div>
  );

  return (
    <ToolPageShell
      title="Aspect Ratio Calculator — Resolution & Dimensions Converter"
      description="Calculate aspect ratio from width and height, or find the missing dimension from a ratio. Presets for 16:9, 9:16, 4:3, 1:1, 21:9. Free, no signup."
      path="/aspect-ratio-resolution-calculator"
      h1="Aspect Ratio & Resolution Calculator"
      intro="Enter a width and height to find the aspect ratio — or start from a ratio and one dimension to get the other. Matches common video and social-media formats automatically."
      icon="/aspect-ratio-resolution-calculator"
      steps={[
        'Choose a mode: find a ratio from dimensions, or find a missing dimension from a ratio.',
        'Dimensions → Ratio: enter width and height; we divide both by their greatest common divisor and compare against standard formats.',
        'Ratio → Dimension: pick a preset or type a ratio, enter the side you know; we multiply by the ratio factor to get the other side.',
        'We round computed pixel values to even numbers, since most video encoders require them.',
      ]}
      example={
        <div className="font-mono text-[14px] leading-[22px]">
          <p className="font-sans font-semibold text-ink">Mode A: a clip is 2560 × 1080.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>GCD(2560, 1080) = 40 → reduced ratio 64 : 27 (= 21:9 ultrawide)</li>
            <li>Exact decimal: 2560 ÷ 1080 = <strong>2.370 : 1</strong> — matched as 21:9 ultrawide.</li>
          </ol>
          <p className="mt-3 font-sans font-semibold text-ink">Mode B: need a 9:16 vertical video with width 1080.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Height = 1080 × (16 ÷ 9) = <strong>1920</strong></li>
            <li>Result: <strong>1080 × 1920</strong> — the standard Shorts/Reels/TikTok resolution.</li>
          </ol>
        </div>
      }
      faq={[
        { q: 'What aspect ratio is 1920×1080?', a: 'Exactly 16:9 — the standard widescreen format for YouTube, TV, and monitors.' },
        { q: "What's the best ratio for TikTok / Reels / Shorts?", a: '9:16 vertical, typically 1080×1920. Use Mode B with the 9:16 preset and your target width.' },
        { q: 'What ratio does Instagram use?', a: 'Feed posts: 1:1 (square) or 4:5 (portrait, e.g. 1080×1350). Stories and Reels: 9:16.' },
        { q: 'Why does my encoder reject odd dimensions?', a: 'Most codecs (H.264/H.265) require width and height to be divisible by 2 — some by 4. This calculator rounds computed values to even numbers automatically.' },
        { q: 'Is 21:9 the same as 2.39:1?', a: 'Not exactly. 21:9 (64:27) is 2.370:1; cinematic scope is 2.39:1. For web video, 21:9 (e.g. 2560×1080) is the common choice.' },
      ]}
      related={[
        { path: '/video-bitrate-calculator', name: 'Video Bitrate Calculator', blurb: 'Now size the bitrate for your export.' },
        { path: '/video-file-size-calculator', name: 'Video File Size Calculator', blurb: 'Estimate how big the export will be.' },
        { path: '/text-cleaner-formatter', name: 'Text Cleaner & Formatter', blurb: 'Clean up shot lists and export notes.' },
      ]}
      guides={
        <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <h2 className="text-faint">Guides</h2>
          <p className="mt-2 text-[15px] text-faint">
            Guide coming soon: <em>Every social platform's video dimensions, in one table.</em>
          </p>
        </div>
      }
      result={resultNode}
    >
      {/* B — tool UI: mode tabs */}
      <div className="grid grid-cols-2 rounded-lg border border-hairline bg-pagebg p-1" role="tablist" aria-label="Calculator mode">
        {(
          [
            { id: 'dims-to-ratio', label: 'Dimensions → Ratio' },
            { id: 'ratio-to-dims', label: 'Ratio + Side → Dimension' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={mode === t.id}
            onClick={() => setMode(t.id)}
            className={`h-10 rounded-md text-[14px] font-semibold transition-all duration-200 ${
              mode === t.id ? 'bg-surface text-brand shadow-sm' : 'text-subtle hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={mode} className="mt-4 grid gap-4 transition-opacity duration-200">
        {mode === 'dims-to-ratio' ? (
          <>
            <div>
              <label htmlFor="ar-width" className={labelCls}>Width (px)</label>
              <input
                id="ar-width"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ar-height" className={labelCls}>Height (px)</label>
              <input
                id="ar-height"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={inputCls}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className={labelCls}>Ratio presets</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Ratio presets">
                {PRESETS.map((p) => {
                  const activeOn = ratioW === String(p.w) && ratioH === String(p.h);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      aria-pressed={activeOn}
                      onClick={() => {
                        setRatioW(String(p.w));
                        setRatioH(String(p.h));
                      }}
                      className={`h-9 rounded-full border px-4 text-[14px] font-semibold transition-all duration-150 active:scale-95 ${
                        activeOn
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
              <span className={labelCls}>Ratio W : H</span>
              <div className="flex items-center gap-2">
                <input
                  aria-label="Ratio width"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={ratioW}
                  onChange={(e) => setRatioW(e.target.value)}
                  className={inputCls}
                />
                <span className="font-mono text-[16px] text-subtle">:</span>
                <input
                  aria-label="Ratio height"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={ratioH}
                  onChange={(e) => setRatioH(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <span className={labelCls}>Known side</span>
              <div className="inline-flex rounded-lg border border-hairline bg-pagebg p-1" role="group" aria-label="Known side">
                {(['width', 'height'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={knownSide === s}
                    onClick={() => setKnownSide(s)}
                    className={`h-9 rounded-md px-4 text-[14px] font-semibold capitalize transition-colors ${
                      knownSide === s ? 'bg-surface text-brand shadow-sm' : 'text-subtle hover:text-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ar-known" className={labelCls}>
                {knownSide === 'width' ? 'Width (px)' : 'Height (px)'}
              </label>
              <input
                id="ar-known"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={knownValue}
                onChange={(e) => setKnownValue(e.target.value)}
                className={inputCls}
              />
            </div>
          </>
        )}
      </div>
    </ToolPageShell>
  );
}

function matchLabel(label: string): string {
  const names: Record<string, string> = {
    '16:9': 'Common widescreen video format',
    '9:16': 'Vertical video format (Shorts/Reels/TikTok)',
    '4:3': 'Classic TV / tablet format',
    '1:1': 'Square format',
    '21:9': 'Ultrawide / cinematic format',
    '3:2': 'Classic photo format',
    '5:4': 'Large-format photo ratio',
  };
  return names[label] ?? `${label} format`;
}

function explainerRest(label: string): string {
  const all = '16:9 is the standard for YouTube, TV, and most monitors. 9:16 is vertical (Shorts/Reels/TikTok), 1:1 square feeds, 4:5 Instagram portrait, 21:9 ultrawide/cinematic.';
  const sentence = RATIO_EXPLAINER[label];
  return sentence ? all.replace(sentence, '').replace(/\s{2,}/g, ' ').trim() : all;
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
}
