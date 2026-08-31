/**
 * Hand-authored inline SVG icons per design.md §9.
 * 1.5px stroke, #5C5C57 (currentColor used so callers can recolor).
 */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

function base(props: P) {
  return {
    width: 32,
    height: 32,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export function LogoMark(props: P) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#FFFFFF" stroke="#3B6BD4" strokeWidth="2" />
      <path d="M14.5 5.5 L9.5 18.5" stroke="#3B6BD4" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconBitrate(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 12v3" />
      <path d="M8 8v8" />
      <path d="M12 5v14" />
      <path d="M16 9v6" />
      <path d="M20 11v2" />
    </svg>
  );
}

export function IconFileSize(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M6 2.5h8L19 7.5V21a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 5 21V3a.5.5 0 0 1 .5-.5z" />
      <path d="M14 2.5V8h5" />
      <path d="M9 17.5v-4" />
      <path d="M7.5 15 9 13.5 10.5 15" />
    </svg>
  );
}

export function IconAspect(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 18 21 6" />
    </svg>
  );
}

export function IconTime(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconText(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14h10" />
      <path d="M4 18h7" />
    </svg>
  );
}

export function IconCheck(props: P) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function IconArrowRight(props: P) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export const TOOL_ICONS = {
  '/video-bitrate-calculator': IconBitrate,
  '/video-file-size-calculator': IconFileSize,
  '/aspect-ratio-resolution-calculator': IconAspect,
  '/duration-date-time-calculator': IconTime,
  '/text-cleaner-formatter': IconText,
} as const;
