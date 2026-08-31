import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '@/config';

export interface SeoProps {
  /** Page title (50–60 chars); SITE_NAME suffix added when missing. */
  title: string;
  /** Meta description (140–160 chars). */
  description: string;
  /** Canonical path, e.g. "/video-bitrate-calculator" or "/" */
  path: string;
}

/** Per-page SEO: document title, meta description, canonical link, OG tags. */
export default function Seo({ title, description, path }: SeoProps) {
  useEffect(() => {
    const url = SITE_URL + (path === '/' ? '/' : path);
    document.title = title;

    const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE_NAME);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path]);

  return null;
}
