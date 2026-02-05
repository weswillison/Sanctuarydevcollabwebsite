import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

const SITE_NAME = 'Sanctuary Development Collaborative';

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | ${SITE_NAME}`;

    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');

      if (metaDescription) metaDescription.setAttribute('content', description);
      if (ogDescription) ogDescription.setAttribute('content', description);
      if (twitterDescription) twitterDescription.setAttribute('content', description);
    }

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');

    if (ogTitle) ogTitle.setAttribute('content', `${title} | ${SITE_NAME}`);
    if (twitterTitle) twitterTitle.setAttribute('content', `${title} | ${SITE_NAME}`);
  }, [title, description]);
}
