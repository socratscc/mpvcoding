import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { TOOL_ROUTES } from '@/config';
import { LogoMark } from '@/components/icons';

const NAV_LINKS = [
  { path: '/', name: 'Home' },
  ...TOOL_ROUTES.map(({ path, name }) => ({
    path,
    // Short labels for the compact header
    name: name
      .replace('Video Bitrate Calculator', 'Video Bitrate')
      .replace('Video File Size Calculator', 'File Size')
      .replace('Aspect Ratio Calculator', 'Aspect Ratio')
      .replace('Duration & Time Calculator', 'Time Calculator')
      .replace('Text Cleaner & Formatter', 'Text Cleaner'),
  })),
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 bg-surface border-b border-hairline">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-[16px] font-bold text-ink"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span>ToolForge</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-brand font-semibold' : 'text-subtle hover:text-brand'
                }`
              }
              end={l.path === '/'}
            >
              {l.name}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md text-subtle hover:text-brand"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile slide-down menu (200ms) */}
      <div
        className={`lg:hidden overflow-hidden border-b border-hairline bg-surface transition-all duration-200 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-b-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-2" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-11 items-center text-[15px] ${
                  isActive ? 'text-brand font-semibold' : 'text-subtle'
                }`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
