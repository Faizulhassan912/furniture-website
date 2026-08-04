/**
 * optimizeCloudinaryUrl — Automatically optimizes Cloudinary image URLs.
 * 
 * HOW IT WORKS:
 * Cloudinary supports on-the-fly transformations via URL parameters.
 * By inserting `f_auto,q_auto,w_XXX` into the URL, we tell Cloudinary to:
 *   - f_auto: Serve the best format for the browser (WebP for Chrome, AVIF if supported)
 *   - q_auto: Automatically compress while maintaining visual quality
 *   - w_XXX:  Resize to a max width (saves bandwidth on mobile)
 * 
 * This alone can reduce image sizes by 60-80%!
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - Target width in pixels (default: 800)
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Don't double-transform if already optimized
  if (url.includes('f_auto') || url.includes('q_auto')) return url;

  // Cloudinary URL pattern: .../upload/v1234567/folder/image.jpg
  // We insert transformations after /upload/
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width}/`
  );
}

/**
 * Get a srcSet string for responsive images.
 * Provides multiple sizes so the browser picks the best one.
 */
export function getCloudinarySrcSet(url) {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;

  const sizes = [400, 600, 800, 1200];
  return sizes
    .map(w => `${optimizeCloudinaryUrl(url, w)} ${w}w`)
    .join(', ');
}
