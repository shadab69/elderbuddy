/**
 * Utility helper to handle different image sources from the database.
 * The database can return clean URLs, raw HTML <img> tags, or raw <svg> tags.
 */
export const getCleanImage = (imageSrc, fallback = 'assets/cci_cement.png') => {
  if (!imageSrc) {
    return { isSvg: false, src: fallback };
  }
  
  const trimmed = imageSrc.trim();
  
  // Case 1: Programmatic inline SVG
  if (trimmed.startsWith('<svg')) {
    return { isSvg: true, src: trimmed };
  }
  
  // Case 2: Injected <img> HTML string
  if (trimmed.startsWith('<img') || trimmed.startsWith('<')) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return { isSvg: false, src: match[1] };
    }
  }
  
  // Case 3: Standard image path or URL
  return { isSvg: false, src: trimmed };
};
