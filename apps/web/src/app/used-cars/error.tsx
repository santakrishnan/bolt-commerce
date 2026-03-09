"use client";

import { usedCarsMessages } from "~/lib/messages/used-cars";

export default function UsedCarsError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { segmentError } = usedCarsMessages;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-bold text-3xl">{segmentError.title}</h1>
      <p className="max-w-md text-muted-foreground">{segmentError.description}</p>
      <button
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary-hover"
        onClick={() => reset()}
        type="button"
      >
        {segmentError.retryCta}
      </button>
    </main>
  );
}
