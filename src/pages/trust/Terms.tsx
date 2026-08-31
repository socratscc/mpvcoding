import { Link } from 'react-router';
import Seo from '@/components/Seo';

export default function Terms() {
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8 pb-4">
      <Seo
        title="Terms of Use — ToolForge"
        description="The terms for using ToolForge's free browser-based tools. Provided as-is, for general informational purposes."
        path="/terms"
      />
      <p className="text-[13px] text-faint">Last updated: June 2025</p>
      <h1 className="mt-2 text-[26px] leading-8 md:text-[32px] md:leading-10 font-bold tracking-[-0.02em] text-ink">
        Terms of Use
      </h1>

      <div className="mt-4 text-[16px] leading-[1.7] text-subtle">
        <h2 className="mt-8 text-[20px] font-semibold text-ink">Acceptance</h2>
        <p>
          By accessing or using ToolForge, you agree to these Terms of Use. If you don't agree,
          please don't use the site.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">The tools</h2>
        <p>
          ToolForge provides free browser-based utilities — such as the{' '}
          <Link to="/video-bitrate-calculator" className="text-brand hover:underline">
            Video Bitrate Calculator
          </Link>
          , the{' '}
          <Link to="/aspect-ratio-resolution-calculator" className="text-brand hover:underline">
            Aspect Ratio Calculator
          </Link>
          , and the{' '}
          <Link to="/duration-date-time-calculator" className="text-brand hover:underline">
            Duration &amp; Time Calculator
          </Link>{' '}
          — free of charge, "as is" and "as available", without warranty of any kind, express or
          implied. Calculations are provided in good faith for general informational purposes, but
          we don't guarantee accuracy, completeness, or fitness for a particular purpose.
          Double-check results that matter — for example before committing to storage plans,
          delivery specs, or client deliverables.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Acceptable use</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Don't scrape or crawl the site at abusive rates that degrade service for others.</li>
          <li>
            Don't misrepresent the tools, or wrap and re-host them, as your own hosted service.
          </li>
          <li>Don't use the site for anything unlawful.</li>
        </ul>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Intellectual property</h2>
        <p>
          The site design, text, and code are © ToolForge. Your inputs and the outputs you generate
          with the tools remain entirely yours — we claim no rights over them.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, ToolForge and its operators are not liable for
          any direct, indirect, incidental, or consequential damages arising from the use of the
          site or from decisions made based on tool output.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Changes</h2>
        <p>
          These terms may be updated from time to time. Changes take effect when posted on this
          page; the date shown above reflects the latest revision. Continued use of the site after
          a change constitutes acceptance of the updated terms.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Contact</h2>
        <p>
          Questions about these terms? Reach us via the{' '}
          <Link to="/contact" className="text-brand hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
