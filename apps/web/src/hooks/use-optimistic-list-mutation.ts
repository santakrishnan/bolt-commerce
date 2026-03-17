"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * A thin wrapper around `useMutation` that applies the standard optimistic-update
 * pattern used by our list-based providers (FavoritesProvider, SearchHistoryProvider):
 *
 *   1. Cancel outstanding queries for the key
 *   2. Snapshot the current cache
 *   3. Apply the `updater` to produce the next cache value
 *   4. Rollback on error
 *   5. Invalidate on settle (re-sync with server)
 *
 * This eliminates the repeated onMutate/onError/onSettled boilerplate.
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
    onError: (_err: unknown, _vars: TVariables, context?: { previous: TItem[] }) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
