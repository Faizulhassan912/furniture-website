/**
 * OptimizedImage — A drop-in replacement for <img> that:
 * 1. Auto-optimizes Cloudinary URLs (WebP/AVIF + compression)
 * 2. Adds loading="lazy" by default (browser skips off-screen images)
 * 3. Adds decoding="async" (browser doesn't block rendering for images)
 * 4. Provides responsive srcSet for Cloudinary images
 */
import { optimizeCloudinaryUrl, getCloudinarySrcSet } from '../../utils/imageOptimizer';

export default function OptimizedImage({ 
  src, 
  alt = '', 
  className = '', 
  width = 800, 
  loading = 'lazy',
  fetchPriority = undefined,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props 
}) {
  const optimizedSrc = optimizeCloudinaryUrl(src, width);
  const srcSet = getCloudinarySrcSet(src);
  const effectivePriority = fetchPriority || (loading === 'eager' ? 'high' : undefined);

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={effectivePriority}
      decoding="async"
      {...props}
    />
  );
}
