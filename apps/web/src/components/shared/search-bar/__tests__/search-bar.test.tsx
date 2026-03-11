/**
 * Unit tests for SearchBar component
 * @module search-bar/__tests__/search-bar
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../search-bar";
import type { AutocompleteService } from "../types";

const VOICE_INPUT_REGEX = /voice input/i;

describe("SearchBar", () => {
  const mockOnValueChange = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    value: "",
    onValueChange: mockOnValueChange,
    onSubmit: mockOnSubmit,
  };

  it("renders the search input", () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("calls onValueChange when user types", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "SUV");

    expect(mockOnValueChange).toHaveBeenCalled();
  });

  it("calls onSubmit when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} value="SUV" />);

    const input = screen.getByRole("combobox");
    await user.type(input, "{Enter}");

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("merges user config with defaults", () => {
    const config = {
      displayMode: "pills" as const,
      placeholder: "Custom placeholder",
    };

    render(<SearchBar {...defaultProps} config={config} />);

    const input = screen.getByPlaceholderText("Custom placeholder");
    expect(input).toBeInTheDocument();
  });

  it("does not submit when query is empty", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} value="" />);

    const input = screen.getByRole("combobox");
    await user.type(input, "{Enter}");

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows voice button when voice recognition is enabled and supported", () => {
    // Mock Web Speech API support
    const mockSpeechRecognition = vi.fn();
    (window as any).webkitSpeechRecognition = mockSpeechRecognition;

    render(<SearchBar {...defaultProps} config={{ enableVoiceRecognition: true }} />);

    const voiceButton = screen.getByLabelText(VOICE_INPUT_REGEX);
    expect(voiceButton).toBeInTheDocument();
  });

  it("displays suggestions from autocomplete service", async () => {
    const mockService: AutocompleteService = {
      getSuggestions: vi.fn().mockResolvedValue([
        { text: "SUV under", highlight: "35k" },
        { text: "SUV with", highlight: "heated seats" },
      ]),
    };

    render(<SearchBar {...defaultProps} autocompleteService={mockService} value="SUV" />);

    // Wait for suggestions to appear
    await screen.findByText("35k");
    expect(screen.getByText("heated seats")).toBeInTheDocument();
  });
});
