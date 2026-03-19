"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Optimistic mutation hook for list-based caches (favorites, search history).
 *
 * Flow:
 *   1. `onMutate`  — cancel queries, snapshot, optimistically update cache
 *   2. `mutationFn`— POST/DELETE to BED service
 *   3. `onSuccess` — if server returned an array, set it as authoritative cache
 *   4. `onError`   — rollback to snapshot
 *   5. `onSettled` — mark query stale (refetchType: 'none' — no immediate GET)
 *
 * Why no immediate GET after mutation?
 *   - Optimistic update keeps the UI correct instantly
 *   - IDB persistence (via PersistQueryClientProvider) preserves the cache
 *     across same-session navigation (e.g. VDP → My Garage)
 *   - staleTime (5 min) + refetchOnWindowFocus handle cross-session/device sync
 *   - An immediate GET risks a race condition with eventual-consistency backends
 *     (BED may not have persisted yet → GET returns stale data → overwrites
 *     the optimistic update)
 */
export function useOptimisticListMutation<TItem, TVariables>({
  queryKey,
  mutationFn,
  updater,
}: {
  queryKey: readonly unknown[];
  mutationFn: (vars: TVariables) => Promise<unknown>;
  /** Return the new list given the current cache and the mutation variables. */
  updater: (current: TItem[], vars: TVariables) => TItem[];
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (vars: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TItem[]>(queryKey) ?? [];
      queryClient.setQueryData<TItem[]>(queryKey, updater(previous, vars));
      return { previous };
    },
    onSuccess: (data: unknown) => {
      // If the server returned the updated list, use it as source of truth
      if (Array.isArray(data)) {
        queryClient.setQueryData<TItem[]>(queryKey, data);
      }
    },
    onError: (_err: unknown, _vars: TVariables, context?: { previous: TItem[] }) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      // Mark stale without immediate refetch. The next mount, window focus,
      // or staleTime expiry will trigger a background sync with the server.
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });
}
