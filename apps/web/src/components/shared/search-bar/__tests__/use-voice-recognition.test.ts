/**
 * Unit tests for useVoiceRecognition hook
 * @module search-bar/__tests__/use-voice-recognition
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useVoiceRecognition } from "../hooks/use-voice-recognition";

// Mock Web Speech API
interface MockSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  abort: ReturnType<typeof vi.fn>;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
}

describe("useVoiceRecognition", () => {
  let mockRecognition: MockSpeechRecognition;
  let originalSpeechRecognition: any;
  let originalWebkitSpeechRecognition: any;

  beforeEach(() => {
    // Save originals
    originalSpeechRecognition = (window as any).SpeechRecognition;
    originalWebkitSpeechRecognition = (window as any).webkitSpeechRecognition;

    // Create mock recognition instance
    mockRecognition = {
      continuous: false,
      interimResults: false,
      lang: "",
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      onstart: null,
      onend: null,
      onresult: null,
      onerror: null,
    };

    // Mock the constructor
    (window as any).SpeechRecognition = vi.fn(() => mockRecognition);
  });

  afterEach(() => {
    // Restore originals
    (window as any).SpeechRecognition = originalSpeechRecognition;
    (window as any).webkitSpeechRecognition = originalWebkitSpeechRecognition;
  });

  it("should detect browser support correctly", () => {
    const { result } = renderHook(() => useVoiceRecognition());
    expect(result.current.isSupported).toBe(true);
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
  });

  it("should configure speech recognition correctly", () => {
    renderHook(() => useVoiceRecognition());

    expect(mockRecognition.continuous).toBe(false);
    expect(mockRecognition.interimResults).toBe(true);
    expect(mockRecognition.lang).toBe("en-US");
  });

  it("should start listening when startListening is called", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    expect(mockRecognition.start).toHaveBeenCalledTimes(1);
  });

  it("should update isListening state when recognition starts", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
      // Simulate onstart event
      if (mockRecognition.onstart) {
        mockRecognition.onstart(new Event("start"));
      }
    });

    expect(result.current.isListening).toBe(true);
  });

  it("should stop listening when stopListening is called", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
      if (mockRecognition.onstart) {
        mockRecognition.onstart(new Event("start"));
      }
    });

    act(() => {
      result.current.stopListening();
    });

    expect(mockRecognition.stop).toHaveBeenCalledTimes(1);
  });

  it("should update isListening state when recognition ends", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
      if (mockRecognition.onstart) {
        mockRecognition.onstart(new Event("start"));
      }
    });

    act(() => {
      // Simulate onend event
      if (mockRecognition.onend) {
        mockRecognition.onend(new Event("end"));
      }
    });

    expect(result.current.isListening).toBe(false);
  });

  it("should toggle listening state", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    // Start listening
    act(() => {
      result.current.toggleListening();
    });

    expect(mockRecognition.start).toHaveBeenCalledTimes(1);

    // Simulate start
    act(() => {
      if (mockRecognition.onstart) {
        mockRecognition.onstart(new Event("start"));
      }
    });

    expect(result.current.isListening).toBe(true);

    // Stop listening
    act(() => {
      result.current.toggleListening();
    });

    expect(mockRecognition.stop).toHaveBeenCalledTimes(1);
  });

  it("should update transcript when recognition result is received", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    // Simulate recognition result
    act(() => {
      if (mockRecognition.onresult) {
        const mockEvent = {
          resultIndex: 0,
          results: [
            {
              0: { transcript: "hello world" },
              isFinal: true,
              length: 1,
            },
          ],
          length: 1,
        };
        mockRecognition.onresult(mockEvent);
      }
    });

    expect(result.current.transcript).toBe("hello world");
  });

  it("should handle interim results", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    // Simulate interim result
    act(() => {
      if (mockRecognition.onresult) {
        const mockEvent = {
          resultIndex: 0,
          results: [
            {
              0: { transcript: "hello" },
              isFinal: false,
              length: 1,
            },
          ],
          length: 1,
        };
        mockRecognition.onresult(mockEvent);
      }
    });

    expect(result.current.transcript).toBe("hello");
  });

  it("should call onTranscriptChange callback when transcript changes", () => {
    const onTranscriptChange = vi.fn();
    const { result } = renderHook(() => useVoiceRecognition(onTranscriptChange));

    act(() => {
      result.current.startListening();
    });

    // Simulate recognition result
    act(() => {
      if (mockRecognition.onresult) {
        const mockEvent = {
          resultIndex: 0,
          results: [
            {
              0: { transcript: "test transcript" },
              isFinal: true,
              length: 1,
            },
          ],
          length: 1,
        };
        mockRecognition.onresult(mockEvent);
      }
    });

    expect(onTranscriptChange).toHaveBeenCalledWith("test transcript");
  });

  it("should handle recognition errors with user-friendly messages", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    // Simulate error
    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "no-speech",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).toEqual({
      code: "no-speech",
      message: "No speech detected. Please try again.",
    });
    expect(result.current.isListening).toBe(false);
  });

  it("should handle audio-capture error", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "audio-capture",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).toEqual({
      code: "audio-capture",
      message: "Microphone access denied. Please check permissions.",
    });
  });

  it("should handle not-allowed error", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "not-allowed",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).toEqual({
      code: "not-allowed",
      message: "Microphone access not allowed.",
    });
  });

  it("should handle network error", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "network",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).toEqual({
      code: "network",
      message: "Network error. Please check your connection.",
    });
  });

  it("should handle unknown errors with default message", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "unknown-error",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).toEqual({
      code: "unknown-error",
      message: "Voice recognition failed. Please try again.",
    });
  });

  it("should clear error when starting new recognition", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    // First recognition with error
    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onerror) {
        const mockEvent = {
          error: "no-speech",
        };
        mockRecognition.onerror(mockEvent);
      }
    });

    expect(result.current.error).not.toBe(null);

    // Start new recognition
    act(() => {
      result.current.startListening();
      if (mockRecognition.onstart) {
        mockRecognition.onstart(new Event("start"));
      }
    });

    expect(result.current.error).toBe(null);
  });

  it("should clear transcript when starting new recognition", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    // First recognition
    act(() => {
      result.current.startListening();
    });

    act(() => {
      if (mockRecognition.onresult) {
        const mockEvent = {
          resultIndex: 0,
          results: [
            {
              0: { transcript: "old transcript" },
              isFinal: true,
              length: 1,
            },
          ],
          length: 1,
        };
        mockRecognition.onresult(mockEvent);
      }
    });

    expect(result.current.transcript).toBe("old transcript");

    // Start new recognition
    act(() => {
      result.current.startListening();
    });

    expect(result.current.transcript).toBe("");
  });

  it("should abort recognition on unmount", () => {
    const { unmount } = renderHook(() => useVoiceRecognition());

    unmount();

    expect(mockRecognition.abort).toHaveBeenCalledTimes(1);
  });
});

describe("useVoiceRecognition - unsupported browser", () => {
  let originalSpeechRecognition: any;
  let originalWebkitSpeechRecognition: any;

  beforeEach(() => {
    // Save originals
    originalSpeechRecognition = (window as any).SpeechRecognition;
    originalWebkitSpeechRecognition = (window as any).webkitSpeechRecognition;

    // Remove both APIs to simulate unsupported browser
    (window as any).SpeechRecognition = undefined;
    (window as any).webkitSpeechRecognition = undefined;
  });

  afterEach(() => {
    // Restore originals
    (window as any).SpeechRecognition = originalSpeechRecognition;
    (window as any).webkitSpeechRecognition = originalWebkitSpeechRecognition;
  });

  it("should handle unsupported browser gracefully", () => {
    const { result } = renderHook(() => useVoiceRecognition());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBe(null);

    // Should not throw when calling methods
    act(() => {
      result.current.startListening();
      result.current.stopListening();
      result.current.toggleListening();
    });
  });
});
