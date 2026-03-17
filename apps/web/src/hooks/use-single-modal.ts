"use client";

import { useEffect, useRef } from "react";

/**
 * Ensures only one instance of a modal is open at a time.
 *
 * When `isOpen` becomes true, broadcasts a CustomEvent with a unique instance
 * ID. Any other mounted instance that hears the event will call its own
 * `onClose`, closing itself.
 */
export function useSingletonModal(eventName: string, isOpen: boolean, onClose: () => void) {
  const instanceIdRef = useRef<string>(Math.random().toString(36).slice(2));

  // Close this instance when another one opens.
  useEffect(() => {
    function handler(e: Event) {
      if (!(e instanceof CustomEvent)) {
        return;
      }
      if (e.detail !== instanceIdRef.current) {
        onClose();
      }
    }
    window.addEventListener(eventName, handler as EventListener);
    return () => window.removeEventListener(eventName, handler as EventListener);
  }, [eventName, onClose]);

  // Broadcast when this instance opens.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail: instanceIdRef.current }));
  }, [isOpen, eventName]);
}
