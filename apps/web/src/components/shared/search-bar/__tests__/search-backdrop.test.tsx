/**
 * Unit tests for SearchBackdrop component
 * @module search-bar/__tests__/search-backdrop
 */

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBackdrop } from "../search-backdrop";

describe("SearchBackdrop", () => {
  it("renders when isVisible is true", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeInTheDocument();
  });

  it("does not render when isVisible is false", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={false} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).not.toBeInTheDocument();
  });

  it("calls onClose when clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]') as HTMLElement;
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      backdrop.focus();
      await user.keyboard("{Escape}");
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("applies animating styles when isAnimating is true", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SearchBackdrop isAnimating={true} isVisible={true} onClose={onClose} />
    );

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass("opacity-0");
  });

  it("applies visible styles when isAnimating is false", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SearchBackdrop isAnimating={false} isVisible={true} onClose={onClose} />
    );

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass("opacity-100");
  });

  it("has aria-hidden attribute", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("has correct z-index for layering", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toHaveClass("z-40");
  });

  it("applies backdrop blur styling", () => {
    const onClose = vi.fn();
    const { container } = render(<SearchBackdrop isVisible={true} onClose={onClose} />);

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toHaveClass("backdrop-blur-sm");
  });
});
