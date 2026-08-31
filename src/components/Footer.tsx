import { Link } from 'react-router';
import { SITE_ROUTES, TOOL_ROUTES } from '@/config';
import { LogoMark } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-hairline bg-footerbg">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-[16px] font-bold text-ink">
            <LogoMark />
            <span>ToolForge</span>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-faint">
            Fast, free, browser-based tools. No signup.
          </p>
        </div>

        <nav aria-label="Tools">
          <h3 className="text-[13px] font-semibold text-ink">Tools</h3>
          <ul className="mt-3 space-y-2">
            {TOOL_ROUTES.map((t) => (
              <li key={t.path}>
                <Link to={t.path} className="text-[13px] text-subtle hover:text-brand">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h3 className="text-[13px] font-semibold text-ink">Site</h3>
          <ul className="mt-3 space-y-2">
            {SITE_ROUTES.map((r) => (
              <li key={r.path}>
                <Link to={r.path} className="text-[13px] text-subtle hover:text-brand">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-hairline">
        <p className="mx-auto max-w-[1080px] px-4 py-4 text-[13px] text-faint">
          © 2025 ToolForge. All tools run locally in your browser.
        </p>
      </div>
    </footer>
  );
}
