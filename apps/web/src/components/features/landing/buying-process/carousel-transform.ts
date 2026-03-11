import config from "./buying-process-config.json";

/**
 * Calculates the CSS transform value to center the current card in the carousel.
 *
 * @param containerRef - Reference to the carousel container element
 * @param currentIndex - Index of the currently active card
 * @returns CSS translateX string to center the active card
 */
export function getCarouselTransform(
  containerRef: React.RefObject<HTMLDivElement | null>,
  currentIndex: number
): string {
  if (!containerRef.current) {
    return "translateX(0)";
  }
  const containerWidth = containerRef.current.offsetWidth;
  const cardWidth = containerWidth * config.carousel.cardWidthPercentage;
  const gap = config.carousel.gapSize;
  const offset = currentIndex * (cardWidth + gap);
  const centerOffset = (containerWidth - cardWidth) / 2;
  return `translateX(${centerOffset - offset}px)`;
}
