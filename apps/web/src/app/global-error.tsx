"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (e.g., Sentry)
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 text-center">
            <h1 className="font-bold text-4xl">Application Error</h1>
            <p className="text-muted-foreground">
              A critical error occurred. Please refresh the page.
            </p>
            {error.digest && <p className="font-mono text-sm">Error ID: {error.digest}</p>}
            <button
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary-hover"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
