import type { Vehicle } from "~/components/shared/types";
import { mockVehicles } from "~/lib/search/mock-vehicles";

/** Fisher-Yates shuffle — returns a new randomly-ordered copy. */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = tmp as T;
  }
  return copy;
}

export function fetchGarageCars(): Vehicle[] {
  // Uses the same data source as the used cars page, shuffled per call
  return shuffle(mockVehicles);
}
