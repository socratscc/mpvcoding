import { useState, type ReactNode } from 'react';

export interface ResultMetric {
  label: string;
  value: string;
}

export interface ResultPanelProps {
  /** Primary big result (mono, accent). Hidden in error state. */
  value?: string;
  unit?: string;
  /** Secondary stat row. */
  metrics?: ResultMetric[];
  /** Error message; when set, the result area is hidden. */
  error?: string | null;
  /** Formula explainer line (mono, small). */
  formula?: string;
  onCopy?: () => void;
  onReset?: () => void;
  copyValue?: string;
  children?: ReactNode;
}

/**
 * Shared result panel for calculators (design.md §7 ResultPanel).
 * White card, 1px border, 12px radius, 24px padding, Copy / Reset row,
 * inline error state, 300ms accent-subtle flash on recalculation.
 */
export default function ResultPanel({
  value,
  unit,
  metrics,
  error,
  formula,
  onCopy,
  onReset,
  copyValue,
  children,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  // key={valueKey} remounts on recalculation → 300ms accent-subtle flash
  const valueKey = value ?? '';

  const handleCopy = async () => {
    const text = copyValue ?? [value, unit].filter(Boolean).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
    onCopy?.();
  };

  return (
    <section className="rounded-xl border border-hairline bg-surface p-6" aria-live="polite">
      {error ? (
        <p className="flex items-center gap-2 text-[15px] text-error" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : (
        <>
          {value !== undefined && (
            <div
              key={valueKey}
              className="rounded-lg px-2 -mx-2 [animation:resultflash_300ms_ease-out]"
            >
              <span className="font-mono tnum text-[30px] leading-[38px] font-semibold text-brand">
                {value}
              </span>
              {unit && <span className="ml-2 font-mono text-[14px] font-medium text-subtle">{unit}</span>}
            </div>
          )}
          {metrics && metrics.length > 0 && (
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-[13px] leading-5 text-faint">{m.label}</dt>
                  <dd className="font-mono tnum text-[15px] font-medium text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {formula && (
            <p className="mt-4 border-t border-hairline pt-3 font-mono text-[14px] leading-[22px] text-subtle">
              {formula}
            </p>
          )}
          {children}
        </>
      )}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          disabled={Boolean(error)}
          className="inline-flex h-11 items-center rounded-lg border border-hairline bg-surface px-4 text-[15px] font-semibold text-subtle transition-colors hover:border-subtle hover:text-ink disabled:opacity-40"
        >
          {copied ? 'Copied ✓' : 'Copy result'}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center rounded-lg px-4 text-[15px] font-semibold text-faint transition-colors hover:text-ink"
          >
            Reset
          </button>
        )}
      </div>
    </section>
  );
}
