export const SITE_NAME = 'ToolForge';
export const SITE_URL = 'https://www.mpvcoding.workers.dev';

/** Ad placeholders are disabled in the MVP; AdSlot renders nothing when false. */
export const ADS_ENABLED = false;

export const TOOL_ROUTES = [
  {
    path: '/video-bitrate-calculator',
    name: 'Video Bitrate Calculator',
    blurb: 'Find the bitrate you need to hit a target file size.',
  },
  {
    path: '/video-file-size-calculator',
    name: 'Video File Size Calculator',
    blurb: 'Estimate how large your exported video will be.',
  },
  {
    path: '/aspect-ratio-resolution-calculator',
    name: 'Aspect Ratio Calculator',
    blurb: 'Convert between dimensions and common aspect ratios.',
  },
  {
    path: '/duration-date-time-calculator',
    name: 'Duration & Time Calculator',
    blurb: 'Add, subtract, or measure time between two points.',
  },
  {
    path: '/text-cleaner-formatter',
    name: 'Text Cleaner & Formatter',
    blurb: 'Remove extra spaces, blank lines, and fix formatting.',
  },
] as const;

export const SITE_ROUTES = [
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms of Use' },
] as const;
