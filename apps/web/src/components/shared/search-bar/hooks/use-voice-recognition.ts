/**
 * Custom hook for voice recognition using Web Speech API
 * @module search-bar/hooks/use-voice-recognition
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseVoiceRecognitionReturn, VoiceRecognitionError } from "../types";

// Type definitions for Web Speech API (not in standard TypeScript lib)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Module-level constant — never recreated
const TRAILING_PUNCT_RE = /[.!?,;]+$/;

function stripTrailingPunctuation(text: string): string {
  return text.trim().replace(TRAILING_PUNCT_RE, "").trim();
}

/**
 * Get user-friendly error message for Web Speech API error codes
 */
function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "no-speech": "No speech detected. Please try again.",
    "audio-capture": "Microphone access denied. Please check permissions.",
    "not-allowed": "Microphone access not allowed.",
    network: "Network error. Please check your connection.",
    aborted: "Voice recognition was cancelled.",
    "bad-grammar": "Recognition error. Please try again.",
    "language-not-supported": "Language not supported.",
  };
  return errorMessages[errorCode] || "Voice recognition failed. Please try again.";
}

/**
 * Check if Web Speech API is supported in the current browser
 */
function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    (window.SpeechRecognition != null || window.webkitSpeechRecognition != null)
  );
}

/**
 * Custom hook for voice recognition functionality
 *
 * Google-assistant-style behaviour:
 * - Shows interim (live) results while the user speaks
 * - Accumulates confirmed final segments across pauses
 * - Auto-restarts when the browser terminates the session mid-listening
 * - Callback ref pattern — never reinitialises recognition on re-render
 */
export function useVoiceRecognition(
  onTranscriptChange?: (transcript: string) => void
): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<VoiceRecognitionError | null>(null);
  const [isSupported] = useState(isSpeechRecognitionSupported());

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Stable ref for the callback — avoids reinitialising recognition on every render
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  // Tracks whether the user intentionally wants listening active (vs browser auto-stop)
  const shouldBeListeningRef = useRef(false);
  // Accumulates confirmed final segments so pauses don't wipe previous words
  const finalTranscriptRef = useRef("");
  // Timer ref for auto-stopping after 3 seconds of silence post-speech
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize speech recognition — runs once
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true; // Keep listening across natural pauses
      recognition.interimResults = true; // Show live interim results
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (!result?.[0]) {
            continue;
          }

          const text = result[0].transcript;
          if (result.isFinal) {
            // Append confirmed segment (strip trailing punct from it)
            finalTranscriptRef.current += `${stripTrailingPunctuation(text)} `;
            // Reset 3-second silence timer — auto-stop if no more speech arrives
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
            silenceTimerRef.current = setTimeout(() => {
              shouldBeListeningRef.current = false;
              try {
                recognition.stop();
              } catch {
                /* ignore */
              }
            }, 3000);
          } else {
            interim = text;
          }
        }

        // Combine confirmed finals + live interim for display
        const display = stripTrailingPunctuation(`${finalTranscriptRef.current}${interim}`.trim());

        setTranscript(display);
        onTranscriptChangeRef.current?.(display);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 'aborted' is fired when we call stop() intentionally — not a real error
        if (event.error === "aborted") {
          return;
        }

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setError({ code: event.error, message: getErrorMessage(event.error) });
        shouldBeListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        // Auto-restart if the user hasn't explicitly stopped (browser killed it)
        if (shouldBeListeningRef.current) {
          try {
            recognition.start();
          } catch {
            // If restart fails, surface it gracefully
            shouldBeListeningRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setError({
        code: "initialization-failed",
        message: "Failed to initialize voice recognition.",
      });
    }

    return () => {
      shouldBeListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, [isSupported]); // stable — never re-runs

  const startListening = useCallback(() => {
    if (!(isSupported && recognitionRef.current)) {
      return;
    }
    try {
      // Clear any stale silence timer from a previous session
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      finalTranscriptRef.current = "";
      setTranscript("");
      setError(null);
      shouldBeListeningRef.current = true;
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError({ code: "start-failed", message: "Failed to start voice recognition." });
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!(isSupported && recognitionRef.current)) {
      return;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    shouldBeListeningRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error("Failed to stop speech recognition:", err);
    }
  }, [isSupported]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening,
    transcript,
    error,
    isSupported,
  };
}
