"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type PersistedClient,
  type Persister,
  persistQueryClient,
} from "@tanstack/react-query-persist-client";
import { useEffect, useState } from "react";
import { idbDel, idbGet, idbSet } from "~/lib/indexeddb";

/** IndexedDB key for the persisted TanStack Query cache. */
const PERSIST_KEY = "tanstack-query-cache";

/** Cache buster — bump this when the persisted data shape changes. */
const PERSIST_BUSTER = "v1";

/** Only persist queries whose keys start with one of these prefixes. */
const PERSISTED_PREFIXES = ["saved-vehicles", "search-history"];

/**
 * IndexedDB-backed persister that conforms to TanStack's `Persister` interface.
 *
 * Unlike the previous implementation, this properly:
 * - Accepts and stores the full `PersistedClient` (with timestamp + buster)
 * - Returns `PersistedClient | undefined` from `restoreClient`
 * - Lets TanStack handle cache busting and max-age expiry automatically
 */
const idbPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      await idbSet(PERSIST_KEY, client);
    } catch {
      // best-effort — IndexedDB may be unavailable in incognito
    }
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const stored = await idbGet<PersistedClient>(PERSIST_KEY);
      return stored ?? undefined;
    } catch {
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await idbDel(PERSIST_KEY);
    } catch {
      // best-effort
    }
  },
};

/**
 * App-wide TanStack Query provider with IndexedDB persistence.
 *
 * Persistence strategy:
 * - Only `saved-vehicles` and `search-history` queries are persisted
 *   (controlled by `shouldDehydrateQuery`)
 * - On app load, TanStack restores the cache from IDB, checks the buster
 *   and max-age, then hydrates. Restored data is still subject to `staleTime`
 *   — a background refetch runs immediately to sync with the server.
 * - gcTime is set to 24 hours so the cache survives long enough for
 *   persistence to be useful (default 5 min would GC before restore).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep server data fresh for 30 s before refetching in background
            staleTime: 30 * 1000,
            // Keep unused query data for 24 h so persisted cache survives GC
            gcTime: 24 * 60 * 60 * 1000,
            // Retry once on failure then surface the error
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const [unsubscribe] = persistQueryClient({
      queryClient,
      persister: idbPersister,
      buster: PERSIST_BUSTER,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // Only persist successful queries whose key starts with a known prefix
          if (query.state.status !== "success") {
            return false;
          }
          const firstKey = query.queryKey[0];
          return typeof firstKey === "string" && PERSISTED_PREFIXES.includes(firstKey);
        },
      },
    });

    return unsubscribe;
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
