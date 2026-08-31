import type { ReactNode } from 'react';
import { Link } from 'react-router';
import Seo from '@/components/Seo';
import AdSlot from '@/components/AdSlot';
import { TOOL_ICONS } from '@/components/icons';
import { IconArrowRight } from '@/components/icons';

export interface RelatedTool {
  path: keyof typeof TOOL_ICONS;
  name: string;
  blurb: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolPageShellProps {
  /** A — SEO */
  title: string;
  description: string;
  path: string;
  h1: string;
  intro: string;
  icon: keyof typeof TOOL_ICONS;
  /** B — tool UI card (rendered near top) */
  children: ReactNode;
  /** C — result panel */
  result: ReactNode;
  /** D — how it works steps */
  steps: string[];
  /** E — worked example */
  example: ReactNode;
  /** F — FAQ */
  faq: FaqItem[];
  /** G — related tools */
  related: RelatedTool[];
  /** H — guides teaser (optional override) */
  guides?: ReactNode;
}

/**
 * Standard tool-page template (design.md §7 ToolPageShell, sections A–H).
 * Single column, max-width 720px.
 */
export default function ToolPageShell(props: ToolPageShellProps) {
  const Icon = TOOL_ICONS[props.icon];
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8">
      <Seo title={props.title} description={props.description} path={props.path} />

      {/* A — SEO block */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-subtle">
            <Icon width={32} height={32} />
          </span>
          <h1>{props.h1}</h1>
        </div>
        <p className="mt-2 text-subtle">{props.intro}</p>
      </header>

      <AdSlot slot="tool-top" />

      {/* B — tool UI */}
      <section className="rounded-xl border border-hairline bg-surface p-6">{props.children}</section>

      {/* C — result */}
      <div className="mt-6">{props.result}</div>

      {/* D — how it works */}
      <section className="mt-12">
        <h2>How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-subtle">
          {props.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {/* E — worked example */}
      <section className="mt-12 rounded-xl border border-hairline bg-warning p-6">
        <h2>Worked example</h2>
        <div className="mt-3 text-subtle">{props.example}</div>
      </section>

      {/* F — FAQ */}
      <section className="mt-12">
        <h2>FAQ</h2>
        <div className="mt-4 divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {props.faq.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-ink">
                {f.q}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="shrink-0 text-faint transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 pb-1 text-subtle">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* G — related tools */}
      <section className="mt-12">
        <h2>Related tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {props.related.map((r) => {
            const RIcon = TOOL_ICONS[r.path];
            return (
              <Link
                key={r.path}
                to={r.path}
                className="rounded-xl border border-hairline bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-subtle hover:shadow-card"
              >
                <span className="text-subtle">
                  <RIcon width={24} height={24} />
                </span>
                <p className="mt-2 text-[15px] font-semibold text-ink">{r.name}</p>
                <p className="mt-1 flex items-center gap-1 text-[13px] leading-5 text-faint">{r.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* H — guides teaser */}
      <section className="mt-12">
        {props.guides ?? (
          <div className="rounded-xl border border-dashed border-hairline bg-pagebg p-6">
            <h2 className="text-faint">Guides</h2>
            <p className="mt-2 text-[15px] text-faint">Guides coming soon.</p>
          </div>
        )}
      </section>

      <div className="mt-12 flex justify-center">
        <Link to="/" className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
          <IconArrowRight className="rotate-180" width={16} height={16} />
          All tools
        </Link>
      </div>
    </div>
  );
}
