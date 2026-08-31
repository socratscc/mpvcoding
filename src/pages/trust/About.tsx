import { Link } from 'react-router';
import Seo from '@/components/Seo';

export default function About() {
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8 pb-4">
      <Seo
        title="About — ToolForge"
        description="ToolForge is a collection of fast, free, browser-based tools for video, time, and text. No signup, no uploads, no fuss."
        path="/about"
      />
      <p className="text-[13px] text-faint">Last updated: June 2025</p>
      <h1 className="mt-2 text-[26px] leading-8 md:text-[32px] md:leading-10 font-bold tracking-[-0.02em] text-ink">
        About ToolForge
      </h1>

      <div className="mt-4 text-[16px] leading-[1.7] text-subtle">
        <p>
          ToolForge is a small collection of fast, free tools for everyday work: video bitrate and
          file size planning, aspect ratio math, time calculations, and text cleanup. Each tool
          does one job well — the{' '}
          <Link to="/video-bitrate-calculator" className="text-brand hover:underline">
            Video Bitrate Calculator
          </Link>{' '}
          helps you hit a target file size, the{' '}
          <Link to="/video-file-size-calculator" className="text-brand hover:underline">
            Video File Size Calculator
          </Link>{' '}
          estimates exports before you render, the{' '}
          <Link to="/aspect-ratio-resolution-calculator" className="text-brand hover:underline">
            Aspect Ratio Calculator
          </Link>{' '}
          converts between dimensions and ratios, the{' '}
          <Link to="/duration-date-time-calculator" className="text-brand hover:underline">
            Duration &amp; Time Calculator
          </Link>{' '}
          handles time arithmetic, and the{' '}
          <Link to="/text-cleaner-formatter" className="text-brand hover:underline">
            Text Cleaner &amp; Formatter
          </Link>{' '}
          tidies pasted text in one click.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Why we built it</h2>
        <p>
          Most small utilities on the web are buried in ads, locked behind signups, or quietly
          upload whatever you paste into them. We wanted the opposite: tools that open instantly,
          work offline once loaded, ask for nothing, and never send your data anywhere.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">How it works</h2>
        <p>
          Every tool on ToolForge is plain client-side code that runs entirely in your browser.
          Nothing you type or paste leaves your device. The formulas behind each calculator are
          shown on the page itself, so you can verify the math yourself instead of trusting a black
          box.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">What's next</h2>
        <p>
          We're planning written guides and a few more tools in the same spirit. The core set will
          stay free, with no signup and no paywall. If something is broken, confusing, or missing,{' '}
          <Link to="/contact" className="text-brand hover:underline">
            get in touch
          </Link>{' '}
          — feedback shapes what we build next.
        </p>
      </div>
    </div>
  );
}
