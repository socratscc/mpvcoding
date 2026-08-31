import { Link } from 'react-router';
import Seo from '@/components/Seo';

export default function Contact() {
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8 pb-4">
      <Seo
        title="Contact — ToolForge"
        description="Questions, feedback, or tool requests? Get in touch with the ToolForge team."
        path="/contact"
      />
      <p className="text-[13px] text-faint">Last updated: June 2025</p>
      <h1 className="mt-2 text-[26px] leading-8 md:text-[32px] md:leading-10 font-bold tracking-[-0.02em] text-ink">
        Contact
      </h1>

      <div className="mt-4 text-[16px] leading-[1.7] text-subtle">
        <p>
          Found a bug, have a tool idea, or spotted a math error on one of the calculators? We'd
          like to hear about it.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-[16px] text-subtle">Email us at</p>
          <a
            href="mailto:hello@mpvcoding.workers.dev"
            className="mt-1 inline-block font-mono text-[18px] font-semibold text-brand hover:underline"
          >
            hello@mpvcoding.workers.dev
          </a>
          <p className="mt-2 text-[13px] text-faint">
            We read everything and usually reply within a few days.
          </p>
        </div>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Before you write</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>
            Check the FAQ section on each tool page — many questions about formulas and units are
            answered there, for example on the{' '}
            <Link to="/video-bitrate-calculator" className="text-brand hover:underline">
              Video Bitrate Calculator
            </Link>{' '}
            and the{' '}
            <Link to="/duration-date-time-calculator" className="text-brand hover:underline">
              Duration &amp; Time Calculator
            </Link>
            .
          </li>
          <li>
            Reporting a calculation issue? Include the page URL and the exact inputs you used so we
            can reproduce it quickly.
          </li>
          <li>
            Feature requests are welcome — tell us what you're trying to do. We can't promise every
            idea will be built, but we read them all.
          </li>
        </ul>

        <p className="mt-8">
          There's no contact form — email is the one and only channel. For details on how your data
          is (not) handled, see our{' '}
          <Link to="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
