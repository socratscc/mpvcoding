import { Link } from 'react-router';
import Seo from '@/components/Seo';

export default function Privacy() {
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-8 pb-4">
      <Seo
        title="Privacy Policy — ToolForge"
        description="ToolForge tools run entirely in your browser. We don't collect, upload, or store your text, numbers, or files."
        path="/privacy"
      />
      <p className="text-[13px] text-faint">Last updated: June 2025</p>
      <h1 className="mt-2 text-[26px] leading-8 md:text-[32px] md:leading-10 font-bold tracking-[-0.02em] text-ink">
        Privacy Policy
      </h1>

      <div className="mt-4 text-[16px] leading-[1.7] text-subtle">
        <h2 className="mt-8 text-[20px] font-semibold text-ink">The short version</h2>
        <p>
          Our tools process everything locally in your browser. We don't see, collect, or store
          what you type or calculate. When you paste text into the{' '}
          <Link to="/text-cleaner-formatter" className="text-brand hover:underline">
            Text Cleaner &amp; Formatter
          </Link>{' '}
          or run numbers through the{' '}
          <Link to="/video-file-size-calculator" className="text-brand hover:underline">
            Video File Size Calculator
          </Link>
          , that data never leaves your device.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">What we don't collect</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>No accounts, no signups, no email addresses required to use any tool.</li>
          <li>No file uploads — tools work on the values you type, in memory, in your browser.</li>
          <li>No text or numbers entered into the tools are transmitted to us or anyone else.</li>
        </ul>

        {/* TODO: Google Analytics */}
        <h2 className="mt-8 text-[20px] font-semibold text-ink">Analytics</h2>
        <p>
          We may use privacy-respecting, aggregate analytics (page views only) to understand which
          tools are useful and where to improve. No personal data, no cross-site tracking. No
          analytics scripts are loaded at this time; if and when analytics are enabled, the details
          — including any consent mechanism — will be disclosed here before they go live.
        </p>

        {/* TODO: AdSense */}
        <h2 className="mt-8 text-[20px] font-semibold text-ink">Advertising</h2>
        <p>
          We may show ads in the future (for example via Google AdSense) to keep the tools free. Ad
          networks may use cookies and similar technologies to serve and measure ads, and may
          collect data subject to their own privacy policies. This section — including cookie
          consent details — will be updated before any advertising is enabled. No ad scripts are
          loaded at this time.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Cookies</h2>
        <p>
          The tools themselves require no cookies. No tracking or functional cookies are set by
          ToolForge in the current version of the site.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Changes</h2>
        <p>
          If this policy changes, the update will be posted on this page and the "Last updated"
          date above will change accordingly.
        </p>

        <h2 className="mt-8 text-[20px] font-semibold text-ink">Contact</h2>
        <p>
          Questions about this policy? Reach us via the{' '}
          <Link to="/contact" className="text-brand hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
