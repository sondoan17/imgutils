export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for touch support first
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Then verify screen size
    return window.matchMedia('(max-width: 768px)').matches;
  }
  
  return false;
}; 