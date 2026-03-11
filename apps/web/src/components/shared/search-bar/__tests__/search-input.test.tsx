/**
 * Unit tests for SearchInput component
 * @module search-bar/__tests__/search-input
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "../search-input";

const VOICE_INPUT_REGEX = /voice input/i;
const START_VOICE_INPUT_REGEX = /start voice input/i;
const STOP_VOICE_INPUT_REGEX = /stop voice input/i;

describe("SearchInput", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    suggestionsOpen: false,
  };

  it("renders input field with placeholder", () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute(
      "placeholder",
      'Try: "SUV under 35k with heated seats near San Francisco"'
    );
  });

  it("renders with custom placeholder", () => {
    render(<SearchInput {...defaultProps} placeholder="Search vehicles..." />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "Search vehicles...");
  });

  it("displays the current value", () => {
    render(<SearchInput {...defaultProps} value="SUV" />);

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("SUV");
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "SUV");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith("S");
    expect(onChange).toHaveBeenCalledWith("U");
    expect(onChange).toHaveBeenCalledWith("V");
  });

  it("calls onSubmit when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchInput {...defaultProps} onSubmit={onSubmit} value="SUV" />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onEscape when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    render(<SearchInput {...defaultProps} onEscape={onEscape} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{Escape}");

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowDown when Arrow Down key is pressed", async () => {
    const user = userEvent.setup();
    const onArrowDown = vi.fn();
    render(<SearchInput {...defaultProps} onArrowDown={onArrowDown} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(onArrowDown).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowUp when Arrow Up key is pressed", async () => {
    const user = userEvent.setup();
    const onArrowUp = vi.fn();
    render(<SearchInput {...defaultProps} onArrowUp={onArrowUp} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowUp}");

    expect(onArrowUp).toHaveBeenCalledTimes(1);
  });

  it("disables native browser autocomplete", () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("autoComplete", "off");
  });

  it("applies rounded-full class when suggestions are closed", () => {
    const { container } = render(<SearchInput {...defaultProps} suggestionsOpen={false} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-full");
  });

  it("applies rounded-t-3xl class when suggestions are open", () => {
    const { container } = render(<SearchInput {...defaultProps} suggestionsOpen={true} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-t-3xl");
  });

  it("applies border when withBorder is true", () => {
    const { container } = render(<SearchInput {...defaultProps} withBorder={true} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("border");
  });

  it("does not apply border when withBorder is false", () => {
    const { container } = render(<SearchInput {...defaultProps} withBorder={false} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass("border");
  });

  it("renders voice button when enableVoiceRecognition is true", () => {
    render(<SearchInput {...defaultProps} enableVoiceRecognition={true} />);

    const voiceButton = screen.getByRole("button", { name: VOICE_INPUT_REGEX });
    expect(voiceButton).toBeInTheDocument();
  });

  it("does not render voice button when enableVoiceRecognition is false", () => {
    render(<SearchInput {...defaultProps} enableVoiceRecognition={false} />);

    const voiceButton = screen.queryByRole("button", { name: VOICE_INPUT_REGEX });
    expect(voiceButton).not.toBeInTheDocument();
  });

  it("calls onVoiceClick when voice button is clicked", async () => {
    const user = userEvent.setup();
    const onVoiceClick = vi.fn();
    render(
      <SearchInput {...defaultProps} enableVoiceRecognition={true} onVoiceClick={onVoiceClick} />
    );

    const voiceButton = screen.getByRole("button", { name: START_VOICE_INPUT_REGEX });
    await user.click(voiceButton);

    expect(onVoiceClick).toHaveBeenCalledTimes(1);
  });

  it("shows 'Stop voice input' label when listening", () => {
    render(<SearchInput {...defaultProps} enableVoiceRecognition={true} isListening={true} />);

    const voiceButton = screen.getByRole("button", { name: STOP_VOICE_INPUT_REGEX });
    expect(voiceButton).toBeInTheDocument();
    expect(voiceButton).toHaveAttribute("aria-pressed", "true");
  });

  it("shows 'Start voice input' label when not listening", () => {
    render(<SearchInput {...defaultProps} enableVoiceRecognition={true} isListening={false} />);

    const voiceButton = screen.getByRole("button", { name: START_VOICE_INPUT_REGEX });
    expect(voiceButton).toBeInTheDocument();
    expect(voiceButton).toHaveAttribute("aria-pressed", "false");
  });

  it("sets proper ARIA attributes for accessibility", () => {
    render(
      <SearchInput
        {...defaultProps}
        ariaActiveDescendant="suggestion-0"
        ariaControls="search-suggestions"
        ariaExpanded={true}
      />
    );

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-label", "Search for vehicles");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-controls", "search-suggestions");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-activedescendant", "suggestion-0");
  });

  it("defaults aria-expanded to false when not provided", () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("applies transition classes for smooth animations", () => {
    const { container } = render(<SearchInput {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("transition-all", "duration-500", "ease-out");
  });
});
