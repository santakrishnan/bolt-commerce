import { render, screen } from "@arrow/vitest-config/test-utils";
import { describe, expect, it } from "vitest";

// Simple component for testing
function Button({ children }: { children: React.ReactNode }) {
  return <button type="button">{children}</button>;
}

describe("Example Test", () => {
  it("should render button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should have button element", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Test");
  });
});
