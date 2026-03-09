"use client";

import { Button } from "@tfs-ucmp/ui";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (e.g., Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="font-bold text-4xl">Something went wrong!</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="font-mono text-muted-foreground text-sm">Error ID: {error.digest}</p>
        )}
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
