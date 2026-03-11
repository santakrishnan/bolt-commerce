interface BodyLockState {
  count: number;
  previousOverflow: string;
  previousPaddingRight: string;
}

const bodyLockState: BodyLockState = {
  count: 0,
  previousOverflow: "",
  previousPaddingRight: "",
};

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Locks body scrolling and preserves layout width by compensating scrollbar gap.
 * Calls are reference-counted so multiple overlays can coexist safely.
 */
export function lockBodyScroll(): void {
  if (typeof window === "undefined") {
    return;
  }

  const { body } = document;

  if (bodyLockState.count === 0) {
    bodyLockState.previousOverflow = body.style.overflow;
    bodyLockState.previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      const computedPaddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }

    body.style.overflow = "hidden";
  }

  bodyLockState.count += 1;
}

/**
 * Releases a body scroll lock. Body styles are restored once all locks are released.
 */
export function unlockBodyScroll(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (bodyLockState.count === 0) {
    return;
  }

  bodyLockState.count -= 1;

  if (bodyLockState.count === 0) {
    const { body } = document;
    body.style.overflow = bodyLockState.previousOverflow;
    body.style.paddingRight = bodyLockState.previousPaddingRight;
  }
}
