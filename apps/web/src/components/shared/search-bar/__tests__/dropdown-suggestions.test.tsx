/**
 * Unit tests for DropdownSuggestions component
 * @module search-bar/__tests__/dropdown-suggestions
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownSuggestions } from "../dropdown-suggestions";
import type { Suggestion } from "../types";

describe("DropdownSuggestions", () => {
  const mockSuggestions: Suggestion[] = [
    { text: "SUV under 35k with", highlight: "Low Miles", id: "1" },
    { text: "Sedan with", highlight: "Leather Seats", id: "2" },
    { text: "Truck with", highlight: "4WD", id: "3" },
  ];

  it("renders suggestions in dropdown format", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    // Check that listbox is rendered
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    // Check that all suggestions are rendered
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);

    // Check suggestion content
    expect(screen.getByText("SUV under 35k with")).toBeInTheDocument();
    expect(screen.getByText("Low Miles")).toBeInTheDocument();
    expect(screen.getByText("Sedan with")).toBeInTheDocument();
    expect(screen.getByText("Leather Seats")).toBeInTheDocument();
  });

  it("does not render when suggestions array is empty", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onSelect when a suggestion is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    const firstOption = options[0];
    if (!firstOption) {
      throw new Error("First option not found");
    }
    await user.click(firstOption);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it("calls onSelect when Enter key is pressed on a suggestion", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    const firstOption = options[0];
    if (!firstOption) {
      throw new Error("First option not found");
    }
    firstOption.focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it("calls onSelect when Space key is pressed on a suggestion", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    const firstOption = options[0];
    if (!firstOption) {
      throw new Error("First option not found");
    }
    firstOption.focus();
    await user.keyboard(" ");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it("applies animation classes when isAnimating is true", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={true} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("opacity-0", "scale-y-95", "-translate-y-1");
  });

  it("applies visible classes when isAnimating is false", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("opacity-100", "scale-y-100", "translate-y-0");
  });

  it("marks the active suggestion with aria-selected", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions
        activeDescendantId="suggestion-1"
        isAnimating={false}
        onSelect={onSelect}
        suggestions={mockSuggestions}
      />
    );

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[2]).toHaveAttribute("aria-selected", "false");
  });

  it("calls onSuggestionFocus when mouse enters a suggestion", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onSuggestionFocus = vi.fn();
    render(
      <DropdownSuggestions
        isAnimating={false}
        onSelect={onSelect}
        onSuggestionFocus={onSuggestionFocus}
        suggestions={mockSuggestions}
      />
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(1);
    const secondOption = options[1];
    if (!secondOption) {
      throw new Error("Second option not found");
    }
    await user.hover(secondOption);

    expect(onSuggestionFocus).toHaveBeenCalledWith(1);
  });

  it("renders suggestions with proper ARIA attributes", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("id", "search-suggestions");

    const options = screen.getAllByRole("option");
    options.forEach((option, index) => {
      expect(option).toHaveAttribute("id", `suggestion-${index}`);
      expect(option).toHaveAttribute("tabIndex", "-1");
    });
  });

  it("positions dropdown directly below input with no gap", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("top-full", "-mt-px");
  });

  it("applies visual separation with shadows and borders", () => {
    const onSelect = vi.fn();
    render(
      <DropdownSuggestions isAnimating={false} onSelect={onSelect} suggestions={mockSuggestions} />
    );

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass("shadow-lg", "border");
  });
});
