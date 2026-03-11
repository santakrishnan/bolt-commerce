/**
 * Unit tests for SuggestionDisplay component
 * Tests the strategy pattern implementation for switching between display modes
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuggestionDisplay } from "../suggestion-display";
import type { Suggestion } from "../types";

describe("SuggestionDisplay", () => {
  const mockSuggestions: Suggestion[] = [
    { text: "SUV under 35k with", highlight: "Low Miles", id: "1" },
    { text: "Sedan with", highlight: "Leather Seats", id: "2" },
    { text: "Truck with", highlight: "4WD", id: "3" },
  ];

  const mockOnSelect = vi.fn();

  describe("Strategy Pattern - Mode Switching", () => {
    it("renders DropdownSuggestions when mode is dropdown", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="dropdown"
          onSelect={mockOnSelect}
          suggestions={mockSuggestions}
        />
      );

      // Verify dropdown is rendered with listbox role
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();

      // Verify suggestions are rendered as options
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);

      // Verify first suggestion content
      expect(screen.getByText("SUV under 35k with")).toBeInTheDocument();
      expect(screen.getByText("Low Miles")).toBeInTheDocument();
    });

    it("renders PillsSuggestions when mode is pills", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="pills"
          onSelect={mockOnSelect}
          suggestions={mockSuggestions}
        />
      );

      // Verify pills are rendered with listbox role
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();

      // Verify suggestions are rendered as buttons
      const buttons = screen.getAllByRole("option");
      expect(buttons).toHaveLength(3);

      // Verify pills have below placement (mt-sm class)
      expect(listbox).toHaveClass("mt-sm");
    });

    it("renders PillsSuggestions with above placement when specified", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="pills"
          onSelect={mockOnSelect}
          pillsPlacement="above"
          suggestions={mockSuggestions}
        />
      );

      // Verify pills are rendered with above placement (mb-sm class)
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
      expect(listbox).toHaveClass("mb-sm");
    });

    it("defaults to below placement for pills mode when not specified", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="pills"
          onSelect={mockOnSelect}
          suggestions={mockSuggestions}
        />
      );

      // Verify default placement is below (mt-sm class)
      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveClass("mt-sm");
    });
  });

  describe("Props Passing", () => {
    it("passes suggestions array to dropdown mode", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="dropdown"
          onSelect={mockOnSelect}
          suggestions={mockSuggestions}
        />
      );

      // Verify all suggestions are rendered
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
    });

    it("passes suggestions array to pills mode", () => {
      render(
        <SuggestionDisplay
          isAnimating={false}
          mode="pills"
          onSelect={mockOnSelect}
          suggestions={mockSuggestions}
        />
      );

      // Verify all suggestions are rendered
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
    });

    it("handles empty suggestions array", () => {
      const { container } = render(
        <SuggestionDisplay
          isAnimating={false}
          mode="dropdown"
          onSelect={mockOnSelect}
          suggestions={[]}
        />
      );

      // Verify nothing is rendered for empty suggestions
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Interface Compliance", () => {
    it("accepts all required SuggestionDisplayProps", () => {
      // This test verifies TypeScript interface compliance
      const props = {
        mode: "dropdown" as const,
        suggestions: mockSuggestions,
        isAnimating: true,
        onSelect: mockOnSelect,
      };

      expect(() => render(<SuggestionDisplay {...props} />)).not.toThrow();
    });

    it("accepts optional pillsPlacement prop", () => {
      const props = {
        mode: "pills" as const,
        suggestions: mockSuggestions,
        isAnimating: false,
        onSelect: mockOnSelect,
        pillsPlacement: "above" as const,
      };

      expect(() => render(<SuggestionDisplay {...props} />)).not.toThrow();
    });
  });
});
