/**
 * SEO Utility Functions
 * Provides reusable SEO configuration for all pages
 */

const BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.sariyahtech.com';
const SITE_NAME = 'Sariyah Tech';
const DEFAULT_DESCRIPTION = 'Premier technology development and education company. Build cutting-edge software, websites, mobile apps, and AI agents. Learn from industry experts.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Generate page SEO metadata
 */
export const generateSEOMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  structuredData = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_URL);

  return {
    title: fullTitle,
    metaTitle: title || SITE_NAME,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : '',
    image,
    url: canonicalUrl,
    type,
    structuredData: structuredData || generateDefaultStructuredData(title, description, canonicalUrl),
  };
};

/**
 * Generate default structured data
 */
export const generateDefaultStructuredData = (title, description, url) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: description || DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/courses?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate Organization structured data
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media URLs here
    ],
  };
};

/**
 * Generate Course structured data
 */
export const generateCourseSchema = (course) => {
  if (!course) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.shortDescription || course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    image: course.thumbnail || DEFAULT_IMAGE,
    url: `${BASE_URL}/course/${course.slug}`,
    ...(course.price && { offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'BDT',
    }}),
  };
};

/**
 * Generate Product structured data
 */
export const generateProductSchema = (product) => {
  if (!product) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.thumbnail || DEFAULT_IMAGE,
    url: `${BASE_URL}/product/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      priceCurrency: 'BDT',
      availability: product.isPublished ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
};

