"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useEffect, useState } from "react";
import { idbDel, idbGet, idbSet } from "~/lib/indexeddb";

const SAVED_KEY = "saved-vehicles";
const SEARCH_KEY = "search-history";

/**
 * App-wide TanStack Query provider using `persistQueryClient` with an
 * IndexedDB-backed persister (using the local `~/lib/indexeddb` helper).
 * Persists only two
 * specific query keys so we avoid storing the entire cache.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep server data fresh for 30 s before refetching in background
            staleTime: 30 * 1000,
            // Retry once on failure then surface the error
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    // Use TanStack's persistQueryClient but provide a custom persister that
    // stores only the two keys we care about in IndexedDB via our helper.
    const { unsubscribe } = persistQueryClient({
      queryClient,
      persister: {
        persistClient: async () => {
          try {
            const saved = queryClient.getQueryData<string[]>([SAVED_KEY]);
            if (saved) {
              await idbSet(SAVED_KEY, saved);
            }

            const searches = queryClient.getQueryData<unknown[]>([SEARCH_KEY]);
            if (searches) {
              await idbSet(SEARCH_KEY, searches);
            }
          } catch (err) {
            // best-effort
            // eslint-disable-next-line no-console
            console.warn("persistClient error", err);
          }
        },
        restoreClient: async () => {
          try {
            const saved = await idbGet(SAVED_KEY);
            if (Array.isArray(saved)) {
              queryClient.setQueryData([SAVED_KEY], saved);
            }

            const searches = await idbGet(SEARCH_KEY);
            if (Array.isArray(searches)) {
              queryClient.setQueryData([SEARCH_KEY], searches);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("restoreClient error", err);
          }
          return null;
        },
        removeClient: async () => {
          try {
            await idbDel(SAVED_KEY);
            await idbDel(SEARCH_KEY);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("removeClient error", err);
          }
        },
      },
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
