import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

// Built-in branded SVG fallback that works 100% offline with zero external network dependencies
export const BRAND_PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="fmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="fmTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00829B" />
      <stop offset="100%" stop-color="#083344" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#fmBg)" />
  <g transform="translate(140, 110)">
    <rect x="0" y="30" width="120" height="120" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4" />
    <path d="M35 30 V18 C35 6, 85 6, 85 18 V30" fill="none" stroke="url(#fmTeal)" stroke-width="6" stroke-linecap="round" />
    <circle cx="60" cy="90" r="22" fill="#ECFEFF" stroke="#00829B" stroke-width="4" />
    <path d="M51 90 L57 96 L71 82" fill="none" stroke="#00829B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <text x="200" y="280" text-anchor="middle" fill="#083344" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" letter-spacing="1.5">FAVOURITE MART BD</text>
  <text x="200" y="305" text-anchor="middle" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600">100% Authentic Product</text>
</svg>
`)}`;

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75';

// Helper to optimize image URL for mobile data savings
function optimizeImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    // Compress and serve WebP/AVIF format with lower mobile weight
    let optimized = url;
    if (!optimized.includes('format=')) {
      optimized += (optimized.includes('?') ? '&' : '?') + 'auto=format&fit=crop';
    }
    optimized = optimized.replace(/w=\d+/, 'w=450').replace(/q=\d+/, 'q=70');
    return optimized;
  }
  return url;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src || src.trim() === '') return fallbackSrc || BRAND_PLACEHOLDER_SVG;
    return optimizeImageUrl(src);
  });
  const [errorStage, setErrorStage] = useState<number>(0); // 0 = original, 1 = fallbackSrc, 2 = BRAND_PLACEHOLDER_SVG
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state whenever src prop changes (e.g. products re-rendered or updated)
  useEffect(() => {
    if (!src || src.trim() === '') {
      setImgSrc(fallbackSrc || BRAND_PLACEHOLDER_SVG);
      setErrorStage(1);
    } else {
      setImgSrc(optimizeImageUrl(src));
      setErrorStage(0);
    }
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (errorStage === 0) {
      // First attempt failed, try primary fallback
      setErrorStage(1);
      setImgSrc(fallbackSrc);
    } else if (errorStage === 1) {
      // Primary fallback also failed, fall back to guaranteed offline SVG
      setErrorStage(2);
      setImgSrc(BRAND_PLACEHOLDER_SVG);
    }

    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product image'}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-90'} transition-opacity duration-300`}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};
