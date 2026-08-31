import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import Seo from '@/components/Seo';
import { TOOL_ROUTES } from '@/config';
import {
  TOOL_ICONS,
  IconArrowRight,
  IconCheck,
} from '@/components/icons';

/** Fade/slide on mount: 400ms ease-out, optional stagger delay. */
function FadeIn({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        animation: 'fadeSlideIn 400ms ease-out both',
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger fade when the grid scrolls into view (15% threshold, once). */
function StaggerGrid({ children, className }: { children: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 300ms ease-out',
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

const WORKFLOW_STEPS = [
  {
    n: 1,
    heading: 'Pick a target size',
    path: '/video-bitrate-calculator',
    tool: 'Video Bitrate Calculator',
    text: 'Decide your file size limit (e.g. 25 MB for Discord) and get the bitrate.',
  },
  {
    n: 2,
    heading: 'Verify the size',
    path: '/video-file-size-calculator',
    tool: 'Video File Size Calculator',
    text: 'Double-check the estimated file size from your chosen bitrate.',
  },
  {
    n: 3,
    heading: 'Match the platform',
    path: '/aspect-ratio-resolution-calculator',
    tool: 'Aspect Ratio Calculator',
    text: 'Get exact dimensions for 16:9, 9:16, 1:1 and more.',
  },
] as const;

const WHY_ITEMS = [
  { label: 'Instant results', text: 'Calculations run in your browser — no waiting, no uploads.' },
  { label: 'No signup', text: 'Core tools are free and require no account.' },
  { label: 'Private by design', text: 'Your text and numbers never leave your device.' },
  { label: 'Mobile friendly', text: 'Works on your phone with numeric keyboards built in.' },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-[1080px] px-4">
      <Seo
        title="ToolForge — Simple Tools for Video, Time, Text & Everyday Work"
        description="Fast browser-based calculators and utilities: video bitrate, file size, aspect ratio, time duration, and text cleaning. No signup for core tools."
        path="/"
      />

      {/* Section 1 — Hero */}
      <section className="py-12 pb-8 text-center">
        <FadeIn>
          <h1 className="mx-auto max-w-2xl">Simple Tools for Video, Time, Text &amp; Everyday Work</h1>
        </FadeIn>
        <FadeIn delay={60}>
          <p className="mx-auto mt-4 max-w-xl text-[18px] leading-7 text-subtle">
            Fast browser-based calculators and utilities. No signup for core tools.
          </p>
        </FadeIn>
      </section>

      {/* Section 2 — Popular Tools */}
      <section className="mt-4">
        <h2>Popular Tools</h2>
        <p className="mt-1 text-[13px] text-faint">Everything runs locally in your browser.</p>
        <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_ROUTES.map((tool) => {
            const Icon = TOOL_ICONS[tool.path];
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="rounded-xl border border-hairline bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-subtle hover:shadow-card"
              >
                <span className="text-subtle">
                  <Icon />
                </span>
                <p className="mt-3 text-[17px] font-semibold text-ink">{tool.name}</p>
                <p className="mt-1 text-[14px] leading-6 text-subtle">{tool.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-brand">
                  Open Tool
                  <IconArrowRight width={16} height={16} />
                </span>
              </Link>
            );
          })}
        </StaggerGrid>
      </section>

      {/* Section 3 — Video Workflow */}
      <section className="mt-12">
        <h2>A Complete Video Export Workflow</h2>
        <p className="mt-2 text-subtle">Planning a video export? These three tools work together:</p>
        <div className="mt-6 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = TOOL_ICONS[step.path];
            return (
              <div key={step.n} className="contents">
                {i > 0 && (
                  <span className="hidden text-faint lg:block" aria-hidden>
                    <IconArrowRight width={24} height={24} />
                  </span>
                )}
                <Link
                  to={step.path}
                  className="flex-1 rounded-xl border border-hairline bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-subtle hover:shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-subtle">
                      <Icon width={24} height={24} />
                    </span>
                    <p className="text-[15px] font-semibold text-ink">
                      {step.n}. {step.heading}
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-brand">{step.tool}</p>
                  <p className="mt-2 text-[14px] leading-6 text-subtle">{step.text}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4 — Why Use These Tools */}
      <section className="mt-12">
        <h2>Why Use These Tools?</h2>
        <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item) => (
            <div key={item.label} className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-success">
                <IconCheck />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-[13px] leading-5 text-subtle">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 — Guides teaser */}
      <section className="mt-12">
        <h2>Guides</h2>
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-pagebg p-6">
          <p className="text-faint">
            In-depth guides are coming soon — including 'How to choose a video bitrate' and 'Video sizes for every
            social platform.'
          </p>
        </div>
      </section>
    </div>
  );
}
