"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Default delay (ms) before the background sync GET fires. Gives the BED
 *  service time to persist before we refetch. */
const BACKGROUND_SYNC_DELAY = 2000;

/**
 * A thin wrapper around `useMutation` that applies the standard optimistic-update
 * pattern used by our list-based providers (FavoritesProvider, SearchHistoryProvider):
 *
 *   1. Cancel outstanding queries for the key
 *   2. Snapshot the current cache
 *   3. Apply the `updater` to produce the next cache value
 *   4. Rollback on error
 *   5. On success: if the server returned an array, set it as cache directly
 *   6. On settle:
 *      — Response had data  → mark stale only (refetchType: 'none')
 *      — Response was empty → delayed background GET after BACKGROUND_SYNC_DELAY
 *
 * This avoids the race condition where an immediate GET returns stale data
 * because the BED service hasn't finished persisting yet.
 */
export function useOptimisticListMutation<TItem, TVariables>({
  queryKey,
  mutationFn,
  updater,
  syncDelay = BACKGROUND_SYNC_DELAY,
}: {
  queryKey: readonly unknown[];
  mutationFn: (vars: TVariables) => Promise<unknown>;
  /** Return the new list given the current cache and the mutation variables. */
  updater: (current: TItem[], vars: TVariables) => TItem[];
  /** Delay (ms) before background sync GET fires when mutation response has no
   *  data. Defaults to 2 000 ms. Set to 0 to refetch immediately (old behavior). */
  syncDelay?: number;
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
      // Use server response as source of truth when available
      if (Array.isArray(data)) {
        queryClient.setQueryData<TItem[]>(queryKey, data);
      }
    },
    onError: (_err: unknown, _vars: TVariables, context?: { previous: TItem[] }) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: (data: unknown) => {
      if (Array.isArray(data)) {
        // Server returned the updated list — cache is already set in onSuccess.
        // Just mark stale so next mount/focus does a consistency check.
        queryClient.invalidateQueries({ queryKey, refetchType: "none" });
      } else if (syncDelay > 0) {
        // POST didn't return updated list — schedule a delayed background GET
        // to give the BED service time to persist before we refetch.
        // Non-blocking: setTimeout is fire-and-forget, doesn't affect page load.
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey });
        }, syncDelay);
      } else {
        // syncDelay === 0 — immediate refetch (legacy behavior)
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
