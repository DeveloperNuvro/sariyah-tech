import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal SEO Component
 * Handles meta tags, Open Graph, Twitter Cards, and structured data
 * Optimized to prevent unnecessary re-renders
 */
const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage, 
  ogTitle,
  ogDescription,
  canonicalUrl,
  structuredData,
  type = 'website',
  noindex = false,
}) => {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.sariyahtech.com';
  const siteName = 'Sariyah Tech';
  
  const seoData = useMemo(() => {
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const metaTitle = ogTitle || title || siteName;
    const metaDescription = ogDescription || description || 'Premier technology development and education company. Build cutting-edge software, websites, mobile apps, and AI agents.';
    const imageUrl = ogImage || `${baseUrl}/og-image.jpg`;
    const canonical = canonicalUrl || `${baseUrl}${location.pathname}${location.search}`;
    
    return { fullTitle, metaTitle, metaDescription, imageUrl, canonical };
  }, [title, ogTitle, ogDescription, description, ogImage, canonicalUrl, baseUrl, location.pathname, location.search]);

  useEffect(() => {
    // Update document title
    document.title = seoData.fullTitle;

    // Helper function to set or update meta tag
    const setMetaTag = (attr, name, content) => {
      if (!content) return;
      const selector = `meta[${attr}="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('name', 'title', seoData.metaTitle);
    setMetaTag('name', 'description', seoData.metaDescription);
    if (keywords.length > 0) {
      setMetaTag('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }

    // Robots meta
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoData.canonical);

    // Open Graph tags
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', seoData.canonical);
    setMetaTag('property', 'og:title', seoData.metaTitle);
    setMetaTag('property', 'og:description', seoData.metaDescription);
    setMetaTag('property', 'og:image', seoData.imageUrl);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:locale', 'en_US');

    // Twitter Card tags
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:url', seoData.canonical);
    setMetaTag('property', 'twitter:title', seoData.metaTitle);
    setMetaTag('property', 'twitter:description', seoData.metaDescription);
    setMetaTag('property', 'twitter:image', seoData.imageUrl);

    // Handle structured data
    if (structuredData) {
      // Remove existing structured data scripts by type
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach((script) => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === structuredData['@type']) {
            script.remove();
          }
        } catch (e) {
          // Invalid JSON, remove it
          script.remove();
        }
      });

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Cleanup is handled by replacing tags on next render
    };
  }, [seoData, keywords, structuredData, type, noindex]);

  return null;
};

export default SEO;
